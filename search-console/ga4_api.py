"""Read-only GA4 reporting for every site (same service account and site registry as gsc_api.py).

  * Python:  from ga4_api import GA4;  GA4().report("solarkhoj", ["sessionDefaultChannelGroup"], ["sessions"])
  * CLI:     py scripts/ga4_api.py <command> --site <alias>     (per project: py search-console/ga4.py <command>)

Auth: the gsc-reader service account (Viewer or higher on the GA4 account). Key lookup is identical
to gsc_api.py (env GSC_SERVICE_ACCOUNT_JSON_B64, secrets/service-account.json, ~/.config/gsc/...).
Each site's GA4 property id lives in config/sites.json ("ga4_property"). Edit THIS file; per-project
copies are refreshed by scripts/sync_project_folders.py.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import sys
from pathlib import Path

import gsc_api  # shared auth helpers and site registry

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
AI_SOURCES = r"chatgpt|openai|perplexity|gemini|bard|copilot|claude|anthropic|meta\.ai|deepseek|grok|you\.com|mistral|phind"
SUMMARY_METRICS = ["activeUsers", "newUsers", "sessions", "engagedSessions", "engagementRate", "averageSessionDuration",
                   "screenPageViews", "keyEvents"]


class GA4Error(RuntimeError):
    pass


def property_for(site: str | None) -> str:
    site = site or gsc_api.DEFAULT_SITE
    if not site:
        raise GA4Error("Pass --site (or run from a project's search-console/ folder).")
    if site.isdigit():
        return site
    entry = gsc_api.load_sites().get(site)
    if entry is None:
        raise GA4Error(f"Unknown site '{site}'.")
    if not entry.get("ga4_property"):
        raise GA4Error(f"Site '{site}' has no GA4 property yet. Create one, give the service account Viewer access, "
                       f"and set \"ga4_property\" in {gsc_api.SITES_FILE}.")
    return str(entry["ga4_property"])


def _service():
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise GA4Error("Python packages missing. Run: pip install -r search-console/requirements.txt") from exc
    info = gsc_api._service_account_info()  # noqa: SLF001 (shared helper)
    if not info:
        raise GA4Error("No service-account key found (env GSC_SERVICE_ACCOUNT_JSON_B64 or the Console secrets folder).")
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build("analyticsdata", "v1beta", credentials=creds, cache_discovery=False)


def _period(days: int, end: str | None = None) -> tuple[str, str]:
    end_d = dt.date.fromisoformat(end) if end else dt.date.today() - dt.timedelta(days=1)
    return (end_d - dt.timedelta(days=days - 1)).isoformat(), end_d.isoformat()


def _rows(resp: dict, dims: list[str], mets: list[str]) -> list[dict]:
    out = []
    for r in resp.get("rows", []):
        rec = {d: v["value"] for d, v in zip(dims, r.get("dimensionValues", []))}
        for m, v in zip(mets, r.get("metricValues", [])):
            val = v["value"]
            try:
                rec[m] = round(float(val), 4) if "." in val else int(val)
            except ValueError:
                rec[m] = val
        out.append(rec)
    return out


class GA4:
    def __init__(self):
        self.svc = _service()

    def report(self, site: str | None, dims: list[str], mets: list[str], days: int = 28, end: str | None = None,
               limit: int = 1000, order_metric: str | None = None, dim_filter: dict | None = None, compare: bool = False) -> list[dict]:
        start, stop = _period(days, end)
        ranges = [{"startDate": start, "endDate": stop, "name": "current"}]
        if compare:
            p_end = dt.date.fromisoformat(start) - dt.timedelta(days=1)
            ranges.append({"startDate": (p_end - dt.timedelta(days=days - 1)).isoformat(), "endDate": p_end.isoformat(), "name": "previous"})
        body: dict = {"dateRanges": ranges, "dimensions": [{"name": d} for d in dims], "metrics": [{"name": m} for m in mets], "limit": limit}
        if order_metric:
            body["orderBys"] = [{"metric": {"metricName": order_metric}, "desc": True}]
        if dim_filter:
            body["dimensionFilter"] = dim_filter
        try:
            resp = self.svc.properties().runReport(property=f"properties/{property_for(site)}", body=body).execute(num_retries=3)
        except Exception as exc:  # noqa: BLE001
            if isinstance(exc, GA4Error):
                raise
            raise GA4Error(f"GA4 Data API: {str(exc)[:300]}") from exc
        names = dims + (["dateRange"] if compare else [])
        return _rows(resp, names if compare else dims, mets)

    def realtime(self, site: str | None) -> list[dict]:
        """Last 30 minutes: active users, then event counts (two queries; GA4 can't combine them)."""
        prop = f"properties/{property_for(site)}"
        try:
            users = self.svc.properties().runRealtimeReport(property=prop, body={"metrics": [{"name": "activeUsers"}]}).execute(num_retries=3)
            events = self.svc.properties().runRealtimeReport(property=prop, body={
                "dimensions": [{"name": "eventName"}], "metrics": [{"name": "eventCount"}]}).execute(num_retries=3)
        except Exception as exc:  # noqa: BLE001
            raise GA4Error(f"GA4 realtime: {str(exc)[:300]}") from exc
        total = _rows(users, [], ["activeUsers"])
        return [{"eventName": "(active users, last 30 min)", "count": total[0]["activeUsers"] if total else 0}] + \
               [{"eventName": r["eventName"], "count": r["eventCount"]} for r in _rows(events, ["eventName"], ["eventCount"])]

    # ---- ready-made SEO / AIO / GEO views
    def summary(self, site, days=28):
        rows = self.report(site, [], SUMMARY_METRICS, days=days, compare=True)
        by = {r.get("dateRange", "current"): r for r in rows}
        cur, prev = by.get("current", {}), by.get("previous", {})
        return [{"metric": m, "current": cur.get(m, 0), "previous": prev.get(m, 0),
                 "change_pct": round((cur.get(m, 0) - prev.get(m, 0)) / prev[m] * 100, 1) if prev.get(m) else None} for m in SUMMARY_METRICS]

    def channels(self, site, days=28):
        return self.report(site, ["sessionDefaultChannelGroup"], ["sessions", "engagedSessions", "keyEvents", "activeUsers"], days=days, order_metric="sessions")

    def sources(self, site, days=28, limit=50):
        return self.report(site, ["sessionSource", "sessionMedium"], ["sessions", "engagedSessions", "keyEvents"], days=days, limit=limit, order_metric="sessions")

    def ai(self, site, days=90):
        """Sessions referred by AI assistants (GEO / AIO), from GA4's own session source — works on every property."""
        flt = {"filter": {"fieldName": "sessionSource", "stringFilter": {"matchType": "PARTIAL_REGEXP", "value": AI_SOURCES, "caseSensitive": False}}}
        return self.report(site, ["sessionSource", "landingPage"], ["sessions", "engagedSessions", "keyEvents"], days=days, limit=200, order_metric="sessions", dim_filter=flt)

    def pages(self, site, days=28, limit=100):
        return self.report(site, ["landingPage"], ["sessions", "engagedSessions", "engagementRate", "keyEvents"], days=days, limit=limit, order_metric="sessions")

    def organic_pages(self, site, days=28, limit=100):
        flt = {"filter": {"fieldName": "sessionDefaultChannelGroup", "stringFilter": {"matchType": "EXACT", "value": "Organic Search"}}}
        return self.report(site, ["landingPage"], ["sessions", "engagedSessions", "keyEvents"], days=days, limit=limit, order_metric="sessions", dim_filter=flt)

    def leads(self, site, days=28):
        rows = self.report(site, ["eventName"], ["eventCount", "keyEvents"], days=days, limit=200, order_metric="eventCount")
        return [r for r in rows if r.get("keyEvents") or r["eventName"] in ("generate_lead", "form_submit", "contact_click")]

    def countries(self, site, days=28, limit=30):
        return self.report(site, ["country"], ["sessions", "activeUsers", "keyEvents"], days=days, limit=limit, order_metric="sessions")

    def devices(self, site, days=28):
        return self.report(site, ["deviceCategory"], ["sessions", "engagementRate", "keyEvents"], days=days, limit=10, order_metric="sessions")


# --------------------------------------------------------------------------- CLI

def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    cols = list(dict.fromkeys(k for r in rows for k in r)) or ["(no rows)"]
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)


def print_rows(rows: list[dict], limit: int = 40) -> None:
    if not rows:
        print("(no rows)")
        return
    cols = list(dict.fromkeys(k for r in rows for k in r))
    width = {c: min(48, max(len(c), *(len(str(r.get(c, ""))) for r in rows[:limit]))) for c in cols}
    print("  ".join(c.ljust(width[c]) for c in cols))
    for r in rows[:limit]:
        print("  ".join(str(r.get(c, ""))[:48].ljust(width[c]) for c in cols))
    if len(rows) > limit:
        print(f"... {len(rows) - limit} more (--csv / --json)")


VIEWS = {"summary": "summary", "channels": "channels", "sources": "sources", "ai": "ai", "pages": "pages",
         "organic-pages": "organic_pages", "leads": "leads", "countries": "countries", "devices": "devices"}


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="ga4", description="Read-only GA4 reports for SEO / AIO / GEO work")
    p.add_argument("command", choices=["doctor", "realtime", *VIEWS])
    p.add_argument("--site", default=gsc_api.DEFAULT_SITE, help="site alias (default: this project) or a GA4 property id")
    p.add_argument("--days", type=int, help="window in days (default 28; ai uses 90)")
    p.add_argument("--csv", help="write rows to this CSV")
    p.add_argument("--json", action="store_true")
    a = p.parse_args(argv)
    try:
        if a.command == "doctor":
            pid = property_for(a.site)
            rows = GA4().report(a.site, [], ["sessions", "activeUsers"], 28)
            print(f"OK  GA4 property {pid} ({a.site}): last 28 days sessions={rows[0]['sessions'] if rows else 0}, users={rows[0]['activeUsers'] if rows else 0}")
            return 0
        g = GA4()
        rows = g.realtime(a.site) if a.command == "realtime" else getattr(g, VIEWS[a.command])(a.site, **({"days": a.days} if a.days else {}))
    except (GA4Error, gsc_api.GSCAuthError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    if a.csv:
        write_csv(Path(a.csv), rows)
        print(f"Wrote {len(rows)} rows to {a.csv}")
    elif a.json:
        print(json.dumps(rows, indent=2, ensure_ascii=False))
    else:
        print_rows(rows)
    return 0


if __name__ == "__main__":
    sys.exit(main())
