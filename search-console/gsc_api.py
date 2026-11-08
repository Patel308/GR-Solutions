"""Common Google Search Console API for every Scallar / Lead Gen property.

One module, three ways to use it:

  * Python:   from gsc_api import GSC;  GSC().query("grsolution", days=28, dimensions=["query"])
  * CLI:      py scripts/gsc_api.py <command> ...       (or just `gsc <command>` via gsc.cmd)
  * HTTP:     py scripts/gsc_api.py serve               -> JSON on http://127.0.0.1:8765

Auth (first match wins):
  1. Service account key in an env var: GSC_SERVICE_ACCOUNT_JSON_B64 (base64) or
     GSC_SERVICE_ACCOUNT_JSON (raw JSON). This is what cloud sessions (Codex / Claude Code) use.
  2. Service account key file: env GSC_SERVICE_ACCOUNT_FILE, then secrets/service-account.json
     (this Console folder), then ~/.config/gsc/service-account.json.
  3. OAuth user token - secrets/search-console-token.json, refreshed automatically.
Run `gsc doctor` to see which mode is active and whether every property is reachable.

This file is also vendored into every project's search-console/ folder (by
sync_project_folders.py) so cloud sessions can use it without this Console folder.
Edit it HERE, then re-run the sync.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]
SECRETS = ROOT / "secrets"
SITES_FILE = Path(os.environ.get("GSC_SITES_FILE", ROOT / "config" / "sites.json"))
DATA_DIR = Path(os.environ.get("GSC_DATA_DIR", ROOT / "data"))
DEFAULT_SITE = os.environ.get("GSC_DEFAULT_SITE")  # set by each project's search-console/gsc.py


def _find_key_file() -> Path:
    candidates = [os.environ.get("GSC_SERVICE_ACCOUNT_FILE"), SECRETS / "service-account.json",
                  Path.home() / ".config" / "gsc" / "service-account.json"]
    for c in candidates:
        if c and Path(c).exists():
            return Path(c)
    return SECRETS / "service-account.json"


SERVICE_ACCOUNT_FILE = _find_key_file()
TOKEN_FILE = Path(os.environ.get("GSC_TOKEN_FILE", SECRETS / "search-console-token.json"))
CLIENT_SECRET_FILE = Path(os.environ.get("GSC_CLIENT_FILE", SECRETS / "google-oauth-client.json"))
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

MAX_ROWS_PER_CALL = 25000
SEARCH_TYPES = {"web", "image", "video", "news", "discover", "googleNews"}
DIMENSIONS = {"query", "page", "date", "country", "device", "searchAppearance", "hour"}
FILTER_OPS = {"contains", "equals", "notContains", "notEquals", "includingRegex", "excludingRegex"}

# Standard SEO bundle written by `export`.
EXPORT_BUNDLE = {
    "queries": ["query"],
    "pages": ["page"],
    "query_page": ["query", "page"],
    "daily": ["date"],
    "countries": ["country"],
    "devices": ["device"],
    "search_appearance": ["searchAppearance"],
}


class GSCAuthError(RuntimeError):
    pass


# --------------------------------------------------------------------------- auth

def _service_account_info() -> dict | None:
    """Key from env (cloud sessions) or from a key file; None if neither exists."""
    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON")
    b64 = os.environ.get("GSC_SERVICE_ACCOUNT_JSON_B64")
    try:
        if b64:
            import base64

            return json.loads(base64.b64decode(b64.strip()).decode("utf-8"))
        if raw:
            return json.loads(raw)
    except Exception as exc:  # noqa: BLE001
        raise GSCAuthError(f"GSC_SERVICE_ACCOUNT_JSON(_B64) is set but is not a valid key: {exc}") from exc
    if SERVICE_ACCOUNT_FILE.exists():
        return json.loads(SERVICE_ACCOUNT_FILE.read_text(encoding="utf-8"))
    return None


def _service_account_creds():
    from google.oauth2 import service_account

    return service_account.Credentials.from_service_account_info(_service_account_info(), scopes=SCOPES)


def _oauth_creds(interactive: bool):
    from google.auth.exceptions import RefreshError
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials

    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        if not creds.valid and creds.refresh_token:
            try:
                creds.refresh(Request())
                TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
            except RefreshError:
                creds = None
    if creds and creds.valid:
        return creds
    if not interactive:
        raise GSCAuthError(
            "No Search Console credentials found.\n"
            "  Cloud session (Codex / Claude Code): set env GSC_SERVICE_ACCOUNT_JSON_B64 in the environment settings.\n"
            "  Local machine: put the service-account key at ~/.config/gsc/service-account.json\n"
            "                 (or Scallar Stack/Console/secrets/service-account.json). See search-console/README.md."
        )
    return run_oauth_flow()


def run_oauth_flow():
    from google_auth_oauthlib.flow import InstalledAppFlow

    if not CLIENT_SECRET_FILE.exists():
        raise GSCAuthError(
            "No Search Console credentials found. Set GSC_SERVICE_ACCOUNT_JSON_B64 (cloud sessions) "
            "or put the key at ~/.config/gsc/service-account.json. See search-console/README.md."
        )
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET_FILE), SCOPES)
    # access_type=offline + prompt=consent guarantees a refresh_token is issued.
    creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")
    TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
    return creds


def auth_mode() -> str:
    if os.environ.get("GSC_SERVICE_ACCOUNT_JSON_B64") or os.environ.get("GSC_SERVICE_ACCOUNT_JSON"):
        return "service_account"
    return "service_account" if SERVICE_ACCOUNT_FILE.exists() else "oauth"


def get_service(interactive: bool = False):
    """Return an authenticated searchconsole v1 client."""
    try:
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise GSCAuthError(
            "Python packages missing. Run: pip install google-api-python-client google-auth "
            "(or pip install -r search-console/requirements.txt)"
        ) from exc

    creds = _service_account_creds() if auth_mode() == "service_account" else _oauth_creds(interactive)
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


# --------------------------------------------------------------------------- registry

def load_sites() -> dict[str, dict]:
    if not SITES_FILE.exists():
        return {}
    data = json.loads(SITES_FILE.read_text(encoding="utf-8"))
    if "site" in data and "sites" not in data:  # a project's single-site search-console/site.json
        return {data["site"]: data}
    return data.get("sites", {})


def active_sites() -> dict[str, dict]:
    """Registry entries that have a live GSC property (skips 'pending' future sites)."""
    return {k: v for k, v in load_sites().items() if v.get("property")}


def _require_property(alias: str, entry: dict) -> str:
    if not entry.get("property"):
        raise ValueError(
            f"Site '{alias}' is not in Search Console yet (status: {entry.get('status', 'pending')}). "
            f"When it goes live: add the domain property in GSC, add the service account as a Restricted user, "
            f"then set its 'property' and 'domain' in {SITES_FILE}."
        )
    return entry["property"]


def resolve_site(site: str) -> str:
    """Accept an alias ('grsolution'), a bare domain ('grsolution.co.in') or a full property string."""
    sites = load_sites()
    if site in sites:
        return _require_property(site, sites[site])
    for alias, entry in sites.items():
        if entry.get("domain") and site == entry["domain"]:
            return _require_property(alias, entry)
    if site.startswith(("sc-domain:", "http://", "https://")):
        return site
    raise ValueError(f"Unknown site '{site}'. Known aliases: {', '.join(sites) or '(none)'}")


def alias_for(prop: str) -> str:
    for alias, entry in active_sites().items():
        if entry["property"] == prop:
            return alias
    return prop.replace("sc-domain:", "").replace("https://", "").replace("http://", "").strip("/").replace("/", "_")


# --------------------------------------------------------------------------- dates / filters

def date_range(days: int | None = None, start: str | None = None, end: str | None = None) -> tuple[str, str]:
    """GSC 'final' data lags ~2 days; default end is yesterday (use data_state='all' for fresh data)."""
    end_d = dt.date.fromisoformat(end) if end else dt.date.today() - dt.timedelta(days=1)
    if start:
        start_d = dt.date.fromisoformat(start)
    else:
        start_d = end_d - dt.timedelta(days=(days or 28) - 1)
    return start_d.isoformat(), end_d.isoformat()


def parse_filters(filters: list[str] | None) -> list[dict]:
    """'dimension:operator:expression', e.g. 'query:contains:repair', 'country:equals:ind'."""
    out = []
    for f in filters or []:
        dim, op, expr = f.split(":", 2)
        if dim not in DIMENSIONS or op not in FILTER_OPS:
            raise ValueError(f"Bad filter '{f}'. dims={sorted(DIMENSIONS)} ops={sorted(FILTER_OPS)}")
        out.append({"dimension": dim, "operator": op, "expression": expr})
    return out


# --------------------------------------------------------------------------- client

class GSC:
    def __init__(self, interactive: bool = False):
        self.service = get_service(interactive=interactive)

    # ---- properties
    def sites(self) -> list[dict]:
        return self.service.sites().list().execute(num_retries=5).get("siteEntry", [])

    # ---- search analytics
    def query(
        self,
        site: str,
        dimensions: list[str] | None = None,
        days: int | None = 28,
        start: str | None = None,
        end: str | None = None,
        search_type: str = "web",
        filters: list[str] | None = None,
        data_state: str = "final",
        aggregation: str = "auto",
        limit: int | None = None,
    ) -> list[dict]:
        """Search analytics rows as flat dicts. Paginates past 25k rows; limit=None fetches everything."""
        dimensions = list(dimensions or [])
        bad = set(dimensions) - DIMENSIONS
        if bad:
            raise ValueError(f"Unknown dimensions {bad}; valid: {sorted(DIMENSIONS)}")
        if search_type not in SEARCH_TYPES:
            raise ValueError(f"search_type must be one of {sorted(SEARCH_TYPES)}")
        if "hour" in dimensions:
            data_state = "hourly_all"  # required by the API for the hour dimension

        start_s, end_s = date_range(days, start, end)
        body = {
            "startDate": start_s,
            "endDate": end_s,
            "dimensions": dimensions,
            "type": search_type,
            "dataState": data_state,
            "aggregationType": aggregation,
        }
        parsed = parse_filters(filters)
        if parsed:
            body["dimensionFilterGroups"] = [{"groupType": "and", "filters": parsed}]

        prop = resolve_site(site)
        rows, start_row = [], 0
        while True:
            page_size = MAX_ROWS_PER_CALL if limit is None else min(MAX_ROWS_PER_CALL, limit - len(rows))
            if page_size <= 0:
                break
            body.update(rowLimit=page_size, startRow=start_row)
            resp = self.service.searchanalytics().query(siteUrl=prop, body=body).execute(num_retries=5)
            batch = resp.get("rows", [])
            for r in batch:
                rec = dict(zip(dimensions, r.get("keys", [])))
                rec.update(
                    clicks=r.get("clicks", 0),
                    impressions=r.get("impressions", 0),
                    ctr=round(r.get("ctr", 0.0), 6),
                    position=round(r.get("position", 0.0), 2),
                )
                rows.append(rec)
            if len(batch) < page_size or not dimensions:
                break
            start_row += len(batch)
        return rows

    def totals(self, site: str, **kw) -> dict:
        rows = self.query(site, dimensions=[], **kw)
        base = rows[0] if rows else {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": 0.0}
        start_s, end_s = date_range(kw.get("days", 28), kw.get("start"), kw.get("end"))
        return {"site": alias_for(resolve_site(site)), "property": resolve_site(site), "start": start_s, "end": end_s, **base}

    def last_24h(self, site: str, search_type: str = "web") -> list[dict]:
        """Hourly rows for roughly the last 2 days (same as the GSC '24 hours' view)."""
        today = dt.date.today()
        return self.query(
            site, dimensions=["hour"], start=(today - dt.timedelta(days=2)).isoformat(),
            end=today.isoformat(), search_type=search_type,
        )

    # ---- url inspection / sitemaps
    def inspect(self, site: str, url: str, language: str = "en-US") -> dict:
        body = {"inspectionUrl": url, "siteUrl": resolve_site(site), "languageCode": language}
        return self.service.urlInspection().index().inspect(body=body).execute(num_retries=5).get("inspectionResult", {})

    def sitemaps(self, site: str) -> list[dict]:
        return self.service.sitemaps().list(siteUrl=resolve_site(site)).execute(num_retries=5).get("sitemap", [])

    # ---- bundle export
    def export(self, site: str, days: int = 28, start: str | None = None, end: str | None = None,
               search_type: str = "web", out_dir: Path | None = None) -> Path:
        start_s, end_s = date_range(days, start, end)
        alias = alias_for(resolve_site(site))
        out = out_dir or DATA_DIR / alias / f"{start_s}_{end_s}_{search_type}"
        out.mkdir(parents=True, exist_ok=True)
        summary = {"site": alias, "property": resolve_site(site), "start": start_s, "end": end_s,
                   "search_type": search_type, "exported_at": dt.datetime.now(dt.timezone.utc).isoformat(), "files": {}}
        for name, dims in EXPORT_BUNDLE.items():
            if name == "search_appearance" and search_type not in {"web", "image", "video"}:
                continue
            rows = self.query(site, dimensions=dims, start=start_s, end=end_s, search_type=search_type)
            write_csv(out / f"{name}.csv", rows, dims)
            summary["files"][name] = len(rows)
        summary["totals"] = self.totals(site, start=start_s, end=end_s, search_type=search_type)
        (out / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
        return out


def write_csv(path: Path, rows: list[dict], dims: list[str]) -> None:
    cols = list(dims) + ["clicks", "impressions", "ctr", "position"]
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


def targets(site: str) -> list[str]:
    return list(active_sites()) if site == "all" else [site]


# --------------------------------------------------------------------------- CLI

def print_table(rows: list[dict], cols: list[str] | None = None, max_rows: int = 50) -> None:
    if not rows:
        print("(no rows)")
        return
    cols = cols or list(rows[0])
    shown = rows[:max_rows]
    widths = {c: min(60, max(len(c), *(len(str(r.get(c, ""))) for r in shown))) for c in cols}
    print("  ".join(c.ljust(widths[c]) for c in cols))
    for r in shown:
        print("  ".join(str(r.get(c, ""))[:60].ljust(widths[c]) for c in cols))
    if len(rows) > max_rows:
        print(f"... {len(rows) - max_rows} more rows (use --csv or --json for everything)")


def cmd_doctor(_args) -> int:
    print(f"Auth mode : {auth_mode()}")
    print(f"Registry  : {SITES_FILE}")
    if auth_mode() == "service_account":
        try:
            email = (_service_account_info() or {}).get("client_email")
        except GSCAuthError as exc:
            print(f"\nAUTH FAILED: {exc}")
            return 1
        print(f"SA email  : {email}  (add this as a user on every GSC property)")
    try:
        gsc = GSC()
        visible = {s["siteUrl"]: s["permissionLevel"] for s in gsc.sites()}
    except Exception as exc:  # noqa: BLE001
        print(f"\nAUTH FAILED: {exc}")
        return 1
    ok = True
    print()
    sites = load_sites()
    if DEFAULT_SITE:  # running from a project's search-console/ folder: check only that site
        sites = {DEFAULT_SITE: sites.get(DEFAULT_SITE, {})}
    for alias, entry in sites.items():
        if not entry.get("property"):
            print(f"  --  {alias:<12} {'(not in GSC yet)':<32} {entry.get('status', 'pending')}")
            continue
        perm = visible.get(entry["property"])
        ok &= bool(perm) and perm != "siteUnverifiedUser"
        print(f"  {'OK ' if perm and perm != 'siteUnverifiedUser' else 'NO '} {alias:<12} {entry['property']:<32} {perm or 'not accessible'}")
    if DEFAULT_SITE:
        return 0 if ok else 2
    extra = set(visible) - {e["property"] for e in active_sites().values()}
    for prop in sorted(extra):
        print(f"  +   (not in registry) {prop}  {visible[prop]}")
    return 0 if ok else 2


def cmd_sites(_args) -> int:
    for s in GSC().sites():
        print(f"{s['siteUrl']} | {s['permissionLevel']}")
    return 0


def _common_kw(a) -> dict:
    return dict(days=a.days, start=a.start, end=a.end, search_type=a.type)


def cmd_summary(a) -> int:
    gsc = GSC()
    rows = []
    for s in targets(a.site):
        try:
            rows.append(gsc.totals(s, data_state="all" if a.fresh else "final", **_common_kw(a)))
        except Exception as exc:  # noqa: BLE001
            rows.append({"site": s, "error": str(exc)})
    if a.json:
        print(json.dumps(rows, indent=2))
        return 0
    good = [r for r in rows if "error" not in r]
    if good:
        print_table(good, ["site", "start", "end", "clicks", "impressions", "ctr", "position"])
    for r in rows:
        if "error" in r:
            print(f"{r['site']}: {r['error']}")
    return 0 if good else 1


def cmd_query(a) -> int:
    gsc = GSC()
    dims = [d for d in a.dimensions.split(",") if d] if a.dimensions else []
    rows = []
    for s in targets(a.site):
        part = gsc.query(s, dimensions=dims, filters=a.filter, limit=a.limit,
                         data_state="all" if a.fresh else "final", **_common_kw(a))
        if a.site == "all":
            for r in part:
                r["site"] = s
        rows += part
    if a.site == "all":
        dims = ["site"] + dims
    if a.csv:
        write_csv(Path(a.csv), rows, dims)
        print(f"Wrote {len(rows)} rows to {a.csv}")
    elif a.json:
        print(json.dumps(rows, indent=2, ensure_ascii=False))
    else:
        print_table(rows, dims + ["clicks", "impressions", "ctr", "position"])
    return 0


def cmd_hourly(a) -> int:
    rows = GSC().last_24h(a.site, a.type)
    if a.json:
        print(json.dumps(rows, indent=2))
    else:
        print_table(rows, max_rows=100)
    return 0


def cmd_export(a) -> int:
    gsc = GSC()
    for s in targets(a.site):
        try:
            out = gsc.export(s, **_common_kw(a))
            summary = json.loads((out / "summary.json").read_text(encoding="utf-8"))
            t = summary["totals"]
            print(f"{s:<12} clicks={t['clicks']:<6} impr={t['impressions']:<8} -> {out}")
        except Exception as exc:  # noqa: BLE001
            print(f"{s:<12} FAILED: {exc}")
    return 0


def cmd_inspect(a) -> int:
    res = GSC().inspect(a.site, a.url)
    if a.json:
        print(json.dumps(res, indent=2))
    else:
        idx = res.get("indexStatusResult", {})
        for k in ("verdict", "coverageState", "indexingState", "robotsTxtState", "pageFetchState",
                  "lastCrawlTime", "googleCanonical", "userCanonical", "crawledAs"):
            print(f"{k:<16} {idx.get(k, '')}")
    return 0


def cmd_sitemaps(a) -> int:
    gsc = GSC()
    for s in targets(a.site):
        for sm in gsc.sitemaps(s):
            sub = sum(int(c.get("submitted", 0)) for c in sm.get("contents", []))
            print(f"{s:<12} {sm.get('path')}  submitted={sub}  errors={sm.get('errors', 0)}  "
                  f"warnings={sm.get('warnings', 0)}  lastDownloaded={sm.get('lastDownloaded', '')}")
    return 0


def cmd_auth(_args) -> int:
    run_oauth_flow()
    print(f"Saved new token to {TOKEN_FILE}")
    return cmd_doctor(_args)


# --------------------------------------------------------------------------- HTTP server

class _Handler(BaseHTTPRequestHandler):
    gsc: GSC | None = None
    api_key: str | None = None

    def log_message(self, fmt, *args):  # quieter logs
        sys.stderr.write(f"[gsc-api] {self.address_string()} {fmt % args}\n")

    def _send(self, code: int, payload) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):  # noqa: N802
        if self.api_key and self.headers.get("X-API-Key") != self.api_key:
            return self._send(401, {"error": "missing or wrong X-API-Key"})
        u = urlparse(self.path)
        q = {k: v[-1] for k, v in parse_qs(u.query).items()}
        filters = parse_qs(u.query).get("filter", [])
        endpoints = ["/health", "/sites", "/summary", "/query", "/hourly", "/inspect", "/sitemaps"]
        if u.path in ("/", "/health"):
            return self._send(200, {"ok": True, "auth": auth_mode(), "sites": list(load_sites()), "endpoints": endpoints})
        if u.path not in endpoints:
            return self._send(404, {"error": "unknown endpoint", "endpoints": endpoints})
        try:
            if _Handler.gsc is None:
                _Handler.gsc = GSC()
            gsc = _Handler.gsc
            kw = dict(days=int(q.get("days", 28)), start=q.get("start"), end=q.get("end"),
                      search_type=q.get("type", "web"))
            if u.path == "/sites":
                return self._send(200, {"registry": load_sites(), "accessible": gsc.sites()})
            if u.path == "/summary":
                site = q.get("site", "all")
                return self._send(200, [gsc.totals(s, **kw) for s in targets(site)])
            if u.path == "/query":
                dims = [d for d in q.get("dimensions", "query").split(",") if d]
                limit = int(q["limit"]) if "limit" in q else 1000
                rows = gsc.query(q["site"], dimensions=dims, filters=filters, limit=limit,
                                 data_state=q.get("dataState", "final"), **kw)
                return self._send(200, {"site": q["site"], "count": len(rows), "rows": rows})
            if u.path == "/hourly":
                return self._send(200, gsc.last_24h(q["site"], q.get("type", "web")))
            if u.path == "/inspect":
                return self._send(200, gsc.inspect(q["site"], q["url"]))
            if u.path == "/sitemaps":
                return self._send(200, gsc.sitemaps(q["site"]))
            return self._send(404, {"error": "unknown endpoint", "endpoints": endpoints})
        except KeyError as exc:
            return self._send(400, {"error": f"missing parameter {exc}"})
        except (ValueError, GSCAuthError) as exc:
            return self._send(400 if isinstance(exc, ValueError) else 503, {"error": str(exc)})
        except Exception as exc:  # noqa: BLE001
            return self._send(502, {"error": f"{type(exc).__name__}: {exc}"})


def cmd_serve(a) -> int:
    _Handler.api_key = os.environ.get("GSC_API_KEY")
    server = ThreadingHTTPServer((a.host, a.port), _Handler)
    print(f"GSC API on http://{a.host}:{a.port}  (auth={auth_mode()}, api-key={'on' if _Handler.api_key else 'off'})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="gsc", description="Common Google Search Console API for all properties")
    sub = p.add_subparsers(dest="command", required=True)

    def add_site(sp, site_default=None):
        default = DEFAULT_SITE or site_default
        sp.add_argument("--site", default=default, required=default is None,
                        help="alias from config/sites.json, domain, property string, or 'all'"
                             + (f" (default here: {default})" if default else ""))

    def add_range(sp, site_default=None):
        add_site(sp, site_default)
        sp.add_argument("--days", type=int, default=28)
        sp.add_argument("--start", help="YYYY-MM-DD (overrides --days)")
        sp.add_argument("--end", help="YYYY-MM-DD (default: yesterday)")
        sp.add_argument("--type", default="web", choices=sorted(SEARCH_TYPES))

    sub.add_parser("doctor", help="check auth + access to every registered property").set_defaults(fn=cmd_doctor)
    sub.add_parser("auth", help="re-run the browser OAuth sign-in").set_defaults(fn=cmd_auth)
    sub.add_parser("sites", help="list properties visible to the credentials").set_defaults(fn=cmd_sites)

    sp = sub.add_parser("summary", help="clicks/impressions/ctr/position totals")
    add_range(sp, "all")
    sp.add_argument("--fresh", action="store_true", help="include fresh (not yet final) data")
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(fn=cmd_summary)

    sp = sub.add_parser("query", help="flexible search analytics query")
    add_range(sp)
    sp.add_argument("--dimensions", default="query", help="comma list: " + ",".join(sorted(DIMENSIONS)))
    sp.add_argument("--filter", action="append", help="dim:op:expr, repeatable (e.g. query:contains:repair)")
    sp.add_argument("--limit", type=int, help="max rows (default: all)")
    sp.add_argument("--fresh", action="store_true")
    sp.add_argument("--csv", help="write rows to this CSV path")
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(fn=cmd_query)

    sp = sub.add_parser("hourly", help="hourly data, like the GSC '24 hours' view")
    add_site(sp)
    sp.add_argument("--type", default="web", choices=sorted(SEARCH_TYPES))
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(fn=cmd_hourly)

    sp = sub.add_parser("export", help="standard SEO CSV bundle -> data/<site>/<range>/")
    add_range(sp, "all")
    sp.set_defaults(fn=cmd_export)

    sp = sub.add_parser("inspect", help="URL Inspection (index status) for one URL")
    add_site(sp)
    sp.add_argument("--url", required=True)
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(fn=cmd_inspect)

    sp = sub.add_parser("sitemaps", help="submitted sitemaps and their status")
    add_site(sp, "all")
    sp.set_defaults(fn=cmd_sitemaps)

    sp = sub.add_parser("serve", help="run the local JSON HTTP API")
    sp.add_argument("--host", default="127.0.0.1")
    sp.add_argument("--port", type=int, default=8765)
    sp.set_defaults(fn=cmd_serve)
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return args.fn(args)
    except GSCAuthError as exc:
        print(f"AUTH ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
