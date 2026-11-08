"""Common Google Ads Keyword Planner API for every Scallar / Lead Gen site (SEO keyword research).

One module, two ways to use it:
  * Python:  from ads_api import Ads;  Ads().ideas(site="solarkhoj", seeds=["rooftop solar"])
  * CLI:     py ads_api.py <command> ...   (or `ads <command>` via ads.cmd; per project:
             `py search-console/keywords.py <command>`)

Auth (read-only use; nothing here changes campaigns or spends money):
  GOOGLE_ADS_AUTH=auto (default) tries, in order:
    1. OAuth refresh token (GOOGLE_ADS_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN). The OAuth app is
       "In production", so the token does not expire on a timer; it dies only if revoked, unused
       for ~6 months, or the Google account loses Ads access.
    2. Service account — the permanent option. Add the service account email as a user in Google
       Ads (Admin > Access and security > Users) on the manager account; then it is used
       automatically whenever OAuth fails. Key from GOOGLE_ADS_JSON_KEY_FILE_PATH, or
       GOOGLE_ADS_SERVICE_ACCOUNT_JSON_B64 / GSC_SERVICE_ACCOUNT_JSON_B64, or the Search Console
       key in Scallar Stack/Console/secrets/service-account.json, or ~/.config/gsc/service-account.json.
  GOOGLE_ADS_AUTH=oauth | service_account forces one method.
  Always needed: GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID (any account under the manager),
  GOOGLE_ADS_LOGIN_CUSTOMER_ID (the manager / MCC id).

Edit THIS file; per-project copies in <project>/search-console/ are refreshed by
Scallar Stack/Console/scripts/sync_project_folders.py.
"""

from __future__ import annotations

import argparse
import base64
import csv
import datetime as dt
import hashlib
import json
import logging
import os
import sys
import tempfile
import time
from pathlib import Path
from typing import Any, Iterable

HERE = Path(__file__).resolve().parent
ENV_FILE = Path(os.environ.get("GOOGLE_ADS_ENV_FILE", HERE / ".env"))
SITES_FILE = Path(os.environ.get("ADS_SITES_FILE", HERE / "config" / "ads_sites.json"))
DATA_DIR = Path(os.environ.get("ADS_DATA_DIR", HERE / "data"))
CACHE_DIR = Path(os.environ.get("ADS_CACHE_DIR", HERE / ".cache" / "ads_api"))
DEFAULT_SITE = os.environ.get("ADS_DEFAULT_SITE") or os.environ.get("GSC_DEFAULT_SITE")
CACHE_DAYS = float(os.environ.get("ADS_CACHE_DAYS", "14"))

COMMON_GEOS = {"india": "2356", "united states": "2840", "us": "2840", "usa": "2840", "united kingdom": "2826",
               "uk": "2826", "uae": "2784", "united arab emirates": "2784", "canada": "2124", "australia": "2036",
               "singapore": "2702", "germany": "2276", "worldwide": ""}
COMMON_LANGS = {"en": "1000", "english": "1000", "hi": "1023", "hindi": "1023"}
SA_KEY_CANDIDATES = [
    Path(r"C:/Users/dell/Desktop/Scallar Stack/Console/secrets/service-account.json"),
    Path.home() / ".config" / "gsc" / "service-account.json",
]


class AdsError(RuntimeError):
    pass


# The client library logs every failed request at INFO/WARNING; errors are reported by this module instead.
logging.getLogger("google.ads.googleads").setLevel(logging.CRITICAL)


# --------------------------------------------------------------------------- env / auth

def _load_env_file() -> None:
    """Minimal .env reader (python-dotenv optional); real environment variables win."""
    if not ENV_FILE.exists():
        return
    for raw in ENV_FILE.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def _digits(value: str | None) -> str:
    return "".join(ch for ch in (value or "") if ch.isdigit())


def _service_account_key_path() -> str | None:
    explicit = os.environ.get("GOOGLE_ADS_JSON_KEY_FILE_PATH")
    if explicit and Path(explicit).exists():
        return explicit
    b64 = os.environ.get("GOOGLE_ADS_SERVICE_ACCOUNT_JSON_B64") or os.environ.get("GSC_SERVICE_ACCOUNT_JSON_B64")
    if b64:
        info = json.loads(base64.b64decode(b64.strip()).decode("utf-8"))
        path = Path(tempfile.gettempdir()) / f"ads-sa-{hashlib.sha1(info['client_email'].encode()).hexdigest()[:10]}.json"
        if not path.exists():
            path.write_text(json.dumps(info), encoding="utf-8")
            try:
                os.chmod(path, 0o600)
            except OSError:
                pass
        return str(path)
    for candidate in SA_KEY_CANDIDATES:
        if candidate.exists():
            return str(candidate)
    return None


def _base_config() -> dict[str, Any]:
    _load_env_file()
    token = os.environ.get("GOOGLE_ADS_DEVELOPER_TOKEN", "").strip()
    if not token:
        raise AdsError("GOOGLE_ADS_DEVELOPER_TOKEN is not set (see the Google ads folder's .env or the cloud environment settings).")
    cfg: dict[str, Any] = {"developer_token": token, "use_proto_plus": True}
    login = _digits(os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID"))
    if login:
        cfg["login_customer_id"] = login
    return cfg


def _oauth_config() -> dict[str, Any] | None:
    keys = ("GOOGLE_ADS_CLIENT_ID", "GOOGLE_ADS_CLIENT_SECRET", "GOOGLE_ADS_REFRESH_TOKEN")
    if not all(os.environ.get(k) for k in keys):
        return None
    return {"client_id": os.environ["GOOGLE_ADS_CLIENT_ID"].strip(), "client_secret": os.environ["GOOGLE_ADS_CLIENT_SECRET"].strip(),
            "refresh_token": os.environ["GOOGLE_ADS_REFRESH_TOKEN"].strip()}


def _make_client(extra: dict[str, Any]):
    try:
        from google.ads.googleads.client import GoogleAdsClient
    except ImportError as exc:
        raise AdsError("Python package missing. Run: pip install google-ads (or pip install -r search-console/requirements.txt)") from exc
    return GoogleAdsClient.load_from_dict({**_base_config(), **extra})


def _probe(client) -> None:
    """Cheap authenticated call; raises on bad credentials."""
    client.get_service("CustomerService").list_accessible_customers()


def build_client(mode: str | None = None):
    """Return (client, auth_method). auto = OAuth, falling back to the service account."""
    mode = (mode or os.environ.get("GOOGLE_ADS_AUTH", "auto")).lower()
    _load_env_file()
    errors = []
    if mode in ("auto", "oauth"):
        oauth = _oauth_config()
        if oauth:
            client = _make_client(oauth)
            try:
                _probe(client)
                return client, "oauth"
            except Exception as exc:  # noqa: BLE001 (RefreshError, GoogleAdsException, ...)
                errors.append(f"oauth: {type(exc).__name__}: {str(exc)[:160]}")
        elif mode == "oauth":
            errors.append("oauth: GOOGLE_ADS_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN not set")
    if mode in ("auto", "service_account"):
        key = _service_account_key_path()
        if key:
            client = _make_client({"json_key_file_path": key})
            try:
                _probe(client)
                return client, "service_account"
            except Exception as exc:  # noqa: BLE001
                errors.append(f"service_account: {type(exc).__name__}: {str(exc)[:160]}")
        else:
            errors.append("service_account: no key found")
    raise AdsError("No working Google Ads credentials.\n  " + "\n  ".join(errors)
                   + "\n  Fix: run generate_refresh_token.py --write-env, or add the service account as a user in Google Ads.")


# --------------------------------------------------------------------------- registry

def load_sites() -> dict[str, dict]:
    if not SITES_FILE.exists():
        return {}
    data = json.loads(SITES_FILE.read_text(encoding="utf-8"))
    if "site" in data and "sites" not in data:  # a project's single-site file
        return {data["site"]: data}
    return data.get("sites", {})


def site_defaults(site: str | None) -> dict:
    if not site:
        return {}
    sites = load_sites()
    if site not in sites:
        raise AdsError(f"Unknown site '{site}'. Known: {', '.join(sites)}")
    return sites[site]


def resolve_geos(values: Iterable[str] | None) -> list[str]:
    out = []
    for v in values or []:
        v = str(v).strip()
        if v.isdigit():
            out.append(v)
        elif v.lower() in COMMON_GEOS:
            if COMMON_GEOS[v.lower()]:
                out.append(COMMON_GEOS[v.lower()])
        else:
            raise AdsError(f"Unknown location '{v}'. Use a geo target id, one of {sorted(COMMON_GEOS)}, or `geo \"{v}\"` to look it up.")
    return out


def resolve_lang(value: str | None) -> str:
    v = (value or "en").strip().lower()
    return v if v.isdigit() else COMMON_LANGS.get(v) or _fail(f"Unknown language '{value}'. Use en, hi or a language constant id.")


def _fail(msg: str):
    raise AdsError(msg)


# --------------------------------------------------------------------------- cache

def _cache_get(key: dict) -> Any | None:
    path = CACHE_DIR / (hashlib.sha1(json.dumps(key, sort_keys=True).encode()).hexdigest() + ".json")
    if CACHE_DAYS <= 0 or not path.exists():
        return None
    if time.time() - path.stat().st_mtime > CACHE_DAYS * 86400:
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def _cache_put(key: dict, value: Any) -> None:
    if CACHE_DAYS <= 0:
        return
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / (hashlib.sha1(json.dumps(key, sort_keys=True).encode()).hexdigest() + ".json")
    path.write_text(json.dumps(value), encoding="utf-8")


# --------------------------------------------------------------------------- client

def _micros(v: int | None) -> float | None:
    return round(v / 1_000_000, 2) if v else None


def _metrics_row(text: str, m, concepts: list[str] | None = None) -> dict[str, Any]:
    monthly = [{"month": f"{x.year}-{x.month.value - 1:02d}" if hasattr(x.month, "value") else f"{x.year}", "searches": x.monthly_searches}
               for x in m.monthly_search_volumes]
    vols = [x["searches"] for x in monthly]
    last3, prev3 = sum(vols[-3:]), sum(vols[-6:-3])
    row = {
        "keyword": text,
        "avg_monthly_searches": m.avg_monthly_searches,
        "competition": m.competition.name,
        "competition_index": m.competition_index,
        "low_top_of_page_bid": _micros(m.low_top_of_page_bid_micros),
        "high_top_of_page_bid": _micros(m.high_top_of_page_bid_micros),
        "average_cpc": _micros(getattr(m, "average_cpc_micros", None)),
        "trend_3m_pct": round((last3 - prev3) / prev3 * 100, 1) if prev3 else None,
        "yoy_pct": round((vols[-1] - vols[-13]) / vols[-13] * 100, 1) if len(vols) >= 13 and vols[-13] else None,
        "monthly_searches": monthly,
    }
    if concepts is not None:
        row["concepts"] = concepts
    return row


def _group_close_variants(rows: list[dict]) -> list[dict]:
    """Planner reports close variants with identical metrics; keep the first, list the rest."""
    seen: dict[tuple, dict] = {}
    out = []
    for r in rows:
        sig = (r["avg_monthly_searches"], r["competition_index"], r["low_top_of_page_bid"], r["high_top_of_page_bid"],
               tuple(m["searches"] for m in r.get("monthly_searches", [])))
        if r["avg_monthly_searches"] and sig in seen:
            seen[sig].setdefault("close_variants", []).append(r["keyword"])
            continue
        seen[sig] = r
        out.append(r)
    return out


class Ads:
    def __init__(self, auth: str | None = None):
        self.client, self.auth_method = build_client(auth)
        self.customer_id = _digits(os.environ.get("GOOGLE_ADS_CUSTOMER_ID")) or _fail("GOOGLE_ADS_CUSTOMER_ID is not set")
        self.ga = self.client.get_service("GoogleAdsService")

    def _call(self, fn, *args, **kwargs):
        """Retry quota / transient errors with backoff (Keyword Planner is rate-limited)."""
        from google.ads.googleads.errors import GoogleAdsException
        for attempt in range(5):
            try:
                return fn(*args, **kwargs)
            except GoogleAdsException as exc:
                codes = {e.error_code.WhichOneof("error_code") for e in exc.failure.errors}
                if codes & {"quota_error", "internal_error"} and attempt < 4:
                    time.sleep(min(60, 2 ** attempt * 5))
                    continue
                msgs = "; ".join(e.message for e in exc.failure.errors)[:400]
                raise AdsError(f"Google Ads API error ({', '.join(sorted(codes))}): {msgs} [request_id {exc.request_id}]") from exc

    def _history(self, request) -> None:
        """24 complete months of search volume (enables year-over-year), plus average CPC."""
        opts = request.historical_metrics_options
        opts.include_average_cpc = True
        today = dt.date.today().replace(day=1)
        end = today - dt.timedelta(days=1)                      # last day of previous month
        start_year, start_month = (end.year - 2, end.month + 1) if end.month < 12 else (end.year - 1, 1)
        month = self.client.enums.MonthOfYearEnum
        names = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
        opts.year_month_range.start.year = start_year
        opts.year_month_range.start.month = getattr(month, names[start_month - 1])
        opts.year_month_range.end.year = end.year
        opts.year_month_range.end.month = getattr(month, names[end.month - 1])

    def _targets(self, request, site: str | None, geos, lang, network: str):
        d = site_defaults(site)
        for g in resolve_geos(geos if geos else d.get("geos", ["india"])):
            request.geo_target_constants.append(self.ga.geo_target_constant_path(g))
        request.language = self.ga.language_constant_path(resolve_lang(lang or d.get("language", "en")))
        request.keyword_plan_network = getattr(self.client.enums.KeywordPlanNetworkEnum, network)

    def accounts(self) -> list[str]:
        return [r.split("/")[-1] for r in self.client.get_service("CustomerService").list_accessible_customers().resource_names]

    def ideas(self, seeds: list[str] | None = None, url: str | None = None, site_seed: str | None = None, site: str | None = None,
              geos: list[str] | None = None, lang: str | None = None, limit: int = 1000, min_volume: int = 0,
              network: str = "GOOGLE_SEARCH", include_adult: bool = False, use_cache: bool = True,
              group_variants: bool = True) -> list[dict]:
        """Keyword ideas (GenerateKeywordIdeas). Seeds: up to 20 keywords and/or one URL, or a whole domain."""
        seeds = [s for s in (seeds or []) if s.strip()][:20]
        if not (seeds or url or site_seed):
            raise AdsError("Give seed keywords, --url or --site-seed.")
        d = site_defaults(site)
        key = {"op": "ideas", "v": 2, "seeds": seeds, "url": url, "site_seed": site_seed, "geos": geos or d.get("geos"), "lang": lang or d.get("language"),
               "network": network, "adult": include_adult, "customer": self.customer_id}
        rows = _cache_get(key) if use_cache else None
        if rows is None:
            req = self.client.get_type("GenerateKeywordIdeasRequest")
            req.customer_id = self.customer_id
            self._targets(req, site, geos, lang, network)
            req.include_adult_keywords = include_adult
            req.keyword_annotation.append(self.client.enums.KeywordPlanKeywordAnnotationEnum.KEYWORD_CONCEPT)
            self._history(req)
            if site_seed:
                req.site_seed.site = site_seed
            elif seeds and url:
                req.keyword_and_url_seed.url = url
                req.keyword_and_url_seed.keywords.extend(seeds)
            elif url:
                req.url_seed.url = url
            else:
                req.keyword_seed.keywords.extend(seeds)
            svc = self.client.get_service("KeywordPlanIdeaService")
            rows = []
            for idea in self._call(svc.generate_keyword_ideas, request=req):
                concepts = [f"{c.concept_group.name}:{c.name}" for c in idea.keyword_annotations.concepts]
                rows.append(_metrics_row(idea.text, idea.keyword_idea_metrics, concepts))
            _cache_put(key, rows)
        rows = [r for r in rows if (r["avg_monthly_searches"] or 0) >= min_volume]
        rows.sort(key=lambda r: r["avg_monthly_searches"] or 0, reverse=True)
        if group_variants:
            rows = _group_close_variants(rows)
        return rows[:limit]

    def metrics(self, keywords: list[str], site: str | None = None, geos: list[str] | None = None, lang: str | None = None,
                network: str = "GOOGLE_SEARCH", use_cache: bool = True) -> list[dict]:
        """Historical metrics for exact keywords (GenerateKeywordHistoricalMetrics), batched by 1,000."""
        keywords = list(dict.fromkeys(k.strip() for k in keywords if k.strip()))
        d = site_defaults(site)
        out: list[dict] = []
        for i in range(0, len(keywords), 1000):
            batch = keywords[i:i + 1000]
            key = {"op": "metrics", "v": 2, "kw": batch, "geos": geos or d.get("geos"), "lang": lang or d.get("language"), "network": network, "customer": self.customer_id}
            rows = _cache_get(key) if use_cache else None
            if rows is None:
                req = self.client.get_type("GenerateKeywordHistoricalMetricsRequest")
                req.customer_id = self.customer_id
                req.keywords.extend(batch)
                self._targets(req, site, geos, lang, network)
                self._history(req)
                resp = self._call(self.client.get_service("KeywordPlanIdeaService").generate_keyword_historical_metrics, request=req)
                rows = []
                for r in resp.results:
                    row = _metrics_row(r.text, r.keyword_metrics)
                    row["close_variants"] = list(r.close_variants)
                    rows.append(row)
                _cache_put(key, rows)
            out += rows
        return out

    def geo(self, names: list[str], country: str = "IN", locale: str = "en") -> list[dict]:
        svc = self.client.get_service("GeoTargetConstantService")
        req = self.client.get_type("SuggestGeoTargetConstantsRequest")
        req.locale = locale
        req.country_code = country
        req.location_names.names.extend(names)
        res = self._call(svc.suggest_geo_target_constants, request=req)
        return [{"query": s.search_term, "id": s.geo_target_constant.id, "name": s.geo_target_constant.canonical_name,
                 "type": s.geo_target_constant.target_type, "reach": s.reach} for s in res.geo_target_constant_suggestions]


# --------------------------------------------------------------------------- output / CLI

def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    cols = ["keyword", "avg_monthly_searches", "competition", "competition_index", "low_top_of_page_bid", "high_top_of_page_bid",
            "average_cpc", "trend_3m_pct", "yoy_pct", "concepts", "close_variants", "last_12_months"]
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({**r, "concepts": "; ".join(r.get("concepts") or []), "close_variants": ", ".join(r.get("close_variants") or []),
                        "last_12_months": " ".join(str(m["searches"]) for m in r.get("monthly_searches", [])[-12:])})


def print_rows(rows: list[dict], limit: int = 40) -> None:
    if not rows:
        print("(no rows)")
        return
    print(f"{'keyword':<48} {'searches':>9} {'comp':<7} {'bid_low':>8} {'bid_high':>9} {'3m%':>6} {'yoy%':>6}")
    for r in rows[:limit]:
        print(f"{r['keyword'][:48]:<48} {r['avg_monthly_searches'] or 0:>9} {r['competition'][:7]:<7} {r['low_top_of_page_bid'] or '':>8} "
              f"{r['high_top_of_page_bid'] or '':>9} {'' if r['trend_3m_pct'] is None else r['trend_3m_pct']:>6} {'' if r['yoy_pct'] is None else r['yoy_pct']:>6}")
    if len(rows) > limit:
        print(f"... {len(rows) - limit} more (use --csv or --json)")


def _emit(rows: list[dict], args, name: str) -> None:
    if args.csv:
        path = Path(args.csv)
        write_csv(path, rows)
        print(f"Wrote {len(rows)} rows to {path}")
    elif args.json:
        print(json.dumps(rows, indent=2, ensure_ascii=False))
    else:
        print_rows(rows)
        if args.save:
            path = DATA_DIR / f"{name}_{dt.date.today().isoformat()}.csv"
            write_csv(path, rows)
            print(f"Saved {path}")


def cmd_doctor(_a) -> int:
    _load_env_file()
    print(f".env file   : {ENV_FILE} ({'found' if ENV_FILE.exists() else 'not found'})")
    print(f"customer id : {'set' if os.environ.get('GOOGLE_ADS_CUSTOMER_ID') else 'MISSING'} | manager id: {'set' if os.environ.get('GOOGLE_ADS_LOGIN_CUSTOMER_ID') else 'not set'} | developer token: {'set' if os.environ.get('GOOGLE_ADS_DEVELOPER_TOKEN') else 'MISSING'}")
    ok_any = False
    for mode in ("oauth", "service_account"):
        try:
            client, method = build_client(mode)
            n = len(client.get_service("CustomerService").list_accessible_customers().resource_names)
            print(f"  OK  {mode:<16} {n} accessible account(s)")
            ok_any = True
        except AdsError as exc:
            print(f"  --  {mode:<16} {str(exc).splitlines()[1].strip() if len(str(exc).splitlines()) > 1 else exc}")
    if not ok_any:
        return 1
    try:
        ads = Ads()
        rows = ads.ideas(seeds=["keyword research"], geos=["india"], limit=3, use_cache=False)
        print(f"Keyword Planner via {ads.auth_method}: OK ({len(rows)} sample ideas, e.g. '{rows[0]['keyword']}' {rows[0]['avg_monthly_searches']}/mo)")
        return 0
    except AdsError as exc:
        print(f"Keyword Planner: FAILED: {exc}")
        return 2


def cmd_ideas(a) -> int:
    rows = Ads().ideas(seeds=a.seeds, url=a.url, site_seed=a.site_seed, site=a.site, geos=a.geo, lang=a.lang, limit=a.limit,
                       min_volume=a.min_volume, network=a.network, use_cache=not a.no_cache, group_variants=not a.all_variants)
    _emit(rows, a, f"{a.site or 'ideas'}_ideas")
    return 0


def cmd_metrics(a) -> int:
    kws = list(a.keywords)
    if a.file:
        kws += [l.strip() for l in Path(a.file).read_text(encoding="utf-8").splitlines() if l.strip()]
    rows = Ads().metrics(kws, site=a.site, geos=a.geo, lang=a.lang, network=a.network, use_cache=not a.no_cache)
    _emit(rows, a, f"{a.site or 'keywords'}_metrics")
    return 0


def cmd_geo(a) -> int:
    for r in Ads().geo(a.names, country=a.country):
        print(f"{r['id']:<10} {r['type']:<16} {r['name']}  (reach {r['reach']})")
    return 0


def cmd_sites(_a) -> int:
    for alias, s in load_sites().items():
        print(f"{alias:<12} geos={','.join(s.get('geos', []))} lang={s.get('language', 'en')}  {s.get('domain') or s.get('status', '')}")
    return 0


def cmd_accounts(_a) -> int:
    ads = Ads()
    print(f"auth: {ads.auth_method}; planner customer: {ads.customer_id}")
    for cid in ads.accounts():
        print(cid)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="ads", description="Google Ads Keyword Planner API for SEO keyword research (read-only)")
    sub = p.add_subparsers(dest="command", required=True)

    def common(sp):
        sp.add_argument("--site", default=DEFAULT_SITE, help="alias from config/ads_sites.json (sets default geos/language)")
        sp.add_argument("--geo", nargs="+", help="geo target ids or names: india, us, uk, uae, ... (see `geo`)")
        sp.add_argument("--lang", help="en, hi or a language constant id")
        sp.add_argument("--network", default="GOOGLE_SEARCH", choices=["GOOGLE_SEARCH", "GOOGLE_SEARCH_AND_PARTNERS"])
        sp.add_argument("--no-cache", action="store_true", help=f"bypass the {CACHE_DAYS:g}-day cache")
        sp.add_argument("--csv", help="write all rows to this CSV path")
        sp.add_argument("--json", action="store_true")
        sp.add_argument("--save", action="store_true", help="also save a dated CSV in data/")

    sub.add_parser("doctor", help="check credentials (OAuth and service account) and a sample Planner call").set_defaults(fn=cmd_doctor)
    sub.add_parser("sites", help="list site defaults").set_defaults(fn=cmd_sites)
    sub.add_parser("accounts", help="list accessible Google Ads accounts").set_defaults(fn=cmd_accounts)

    sp = sub.add_parser("ideas", help="keyword ideas from seed keywords, a URL or a whole domain")
    sp.add_argument("seeds", nargs="*", help="up to 20 seed keywords")
    sp.add_argument("--url", help="page URL seed (combined with keywords if both given)")
    sp.add_argument("--site-seed", help="whole-domain seed, e.g. solarkhoj.in")
    sp.add_argument("--limit", type=int, default=1000)
    sp.add_argument("--min-volume", type=int, default=0)
    sp.add_argument("--all-variants", action="store_true", help="keep close variants as separate rows")
    common(sp)
    sp.set_defaults(fn=cmd_ideas)

    sp = sub.add_parser("metrics", help="historical search volume / competition / bids for exact keywords")
    sp.add_argument("keywords", nargs="*")
    sp.add_argument("--file", help="text file with one keyword per line")
    common(sp)
    sp.set_defaults(fn=cmd_metrics)

    sp = sub.add_parser("geo", help="look up geo target ids, e.g. geo Noida Delhi --country IN")
    sp.add_argument("names", nargs="+")
    sp.add_argument("--country", default="IN")
    sp.set_defaults(fn=cmd_geo)
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return args.fn(args)
    except AdsError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
