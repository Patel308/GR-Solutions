"""SEO / AIO / GEO checkpoint: one dated baseline from Search Console + GA4 + Keyword Planner.

  py scripts/seo_snapshot.py --site <alias>          (per project: py search-console/snapshot.py)

Writes <data>/snapshots/<YYYY-MM-DD>/ with CSVs and SNAPSHOT.md (the summary to read first).
Each source is optional: a missing GA4 property or Ads credentials is recorded as a data gap, never
a crash. Read-only everywhere.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import sys
import traceback
from pathlib import Path

HERE = Path(__file__).resolve().parent
for extra in (HERE, Path(os.environ.get("ADS_HOME", r"C:/Users/dell/Desktop/Scallar Stack/Google ads"))):
    if (extra / "ads_api.py").exists() or (extra / "gsc_api.py").exists():
        sys.path.insert(0, str(extra))

import gsc_api  # noqa: E402


def write_csv(path: Path, rows: list[dict]) -> int:
    cols = list(dict.fromkeys(k for r in rows for k in r if k != "monthly_searches")) or ["(no rows)"]
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({k: ("; ".join(map(str, v)) if isinstance(v, list) else v) for k, v in r.items()})
    return len(rows)


def md_table(rows: list[dict], cols: list[str], limit: int = 15) -> str:
    if not rows:
        return "_(no data)_\n"
    out = "| " + " | ".join(cols) + " |\n|" + "---|" * len(cols) + "\n"
    for r in rows[:limit]:
        out += "| " + " | ".join(str(r.get(c, "")).replace("|", "/")[:70] for c in cols) + " |\n"
    return out


def pct(cur, prev):
    return f"{(cur - prev) / prev * 100:+.0f}%" if prev else "n/a"


def snapshot(site: str, out_root: Path, days: int = 28, keyword_limit: int = 150) -> Path:
    today = dt.date.today().isoformat()
    out = out_root / "snapshots" / today
    out.mkdir(parents=True, exist_ok=True)
    entry = gsc_api.load_sites().get(site, {})
    domain = entry.get("domain") or site
    gaps, files, md = [], {}, []
    md.append(f"# SEO / AIO / GEO snapshot: {domain}\n\nTaken {today}. The window is the last {days} days, "
              f"compared with the {days} days before that, unless noted. Sources: Google Search Console, GA4, Google Ads Keyword Planner.\n")

    # ------------------------------------------------------------------ Search Console
    gsc_queries: list[dict] = []
    striking: list[dict] = []
    if entry.get("property"):
        try:
            g = gsc_api.GSC()
            end = dt.date.today() - dt.timedelta(days=3)  # final data only
            cur_start = end - dt.timedelta(days=days - 1)
            prev_end = cur_start - dt.timedelta(days=1)
            prev_start = prev_end - dt.timedelta(days=days - 1)
            cur = g.totals(site, start=cur_start.isoformat(), end=end.isoformat())
            prev = g.totals(site, start=prev_start.isoformat(), end=prev_end.isoformat())
            gsc_queries = g.query(site, ["query"], start=cur_start.isoformat(), end=end.isoformat())
            pages = g.query(site, ["page"], start=cur_start.isoformat(), end=end.isoformat())
            qp = g.query(site, ["query", "page"], start=cur_start.isoformat(), end=end.isoformat(), limit=5000)
            striking = sorted([q for q in gsc_queries if 4 <= q["position"] <= 20 and q["impressions"] >= 20],
                              key=lambda q: q["impressions"], reverse=True)
            for name, rows in {"gsc_queries": gsc_queries, "gsc_pages": pages, "gsc_query_page": qp, "gsc_striking_distance": striking}.items():
                files[name] = write_csv(out / f"{name}.csv", rows)
            md.append("## Search Console (organic search)\n")
            md.append(f"| metric | last {days}d | previous | change |\n|---|---|---|---|\n"
                      f"| clicks | {cur['clicks']} | {prev['clicks']} | {pct(cur['clicks'], prev['clicks'])} |\n"
                      f"| impressions | {cur['impressions']} | {prev['impressions']} | {pct(cur['impressions'], prev['impressions'])} |\n"
                      f"| CTR | {cur['ctr']:.2%} | {prev['ctr']:.2%} | |\n| avg position | {cur['position']:.1f} | {prev['position']:.1f} | |\n")
            md.append("\n**Top queries by clicks**\n\n" + md_table(sorted(gsc_queries, key=lambda q: q["clicks"], reverse=True), ["query", "clicks", "impressions", "ctr", "position"], 10))
            md.append("\n**Striking distance** (position 4-20, at least 20 impressions): usually the quickest wins.\n\n"
                      + md_table(striking, ["query", "impressions", "clicks", "position"], 15))
        except Exception as exc:  # noqa: BLE001
            gaps.append(f"Search Console failed: {str(exc).splitlines()[0][:200]}")
    else:
        gaps.append("No Search Console property for this site yet.")

    # ------------------------------------------------------------------ GA4
    if entry.get("ga4_property"):
        try:
            import ga4_api
            ga = ga4_api.GA4()
            summ, chans, ai, org, leads, countries = (ga.summary(site, days), ga.channels(site, days), ga.ai(site, 90),
                                                      ga.organic_pages(site, days), ga.leads(site, days), ga.countries(site, days))
            for name, rows in {"ga4_summary": summ, "ga4_channels": chans, "ga4_ai_assistants_90d": ai, "ga4_organic_landing_pages": org,
                               "ga4_leads": leads, "ga4_countries": countries}.items():
                files[name] = write_csv(out / f"{name}.csv", rows)
            md.append("\n## GA4 (behaviour, conversions, AI traffic)\n\n" + md_table(summ, ["metric", "current", "previous", "change_pct"], 10))
            md.append("\n**Channels**\n\n" + md_table(chans, ["sessionDefaultChannelGroup", "sessions", "engagedSessions", "keyEvents"], 10))
            ai_sessions = sum(r["sessions"] for r in ai)
            md.append(f"\n**AI assistants (GEO / AIO), last 90 days:** {ai_sessions} sessions and {sum(r['keyEvents'] for r in ai)} key events.\n\n"
                      + md_table(ai, ["sessionSource", "landingPage", "sessions", "keyEvents"], 10))
            md.append("\n**Leads / key events**\n\n" + md_table(leads, ["eventName", "eventCount", "keyEvents"], 10))
        except Exception as exc:  # noqa: BLE001
            gaps.append(f"GA4 failed: {str(exc).splitlines()[0][:200]}")
    else:
        gaps.append("No GA4 property for this site yet, so there's no behaviour, conversion or AI-assistant traffic data.")

    # ------------------------------------------------------------------ Keyword Planner
    try:
        import ads_api
        ads = ads_api.Ads()
        seeds = [q["query"] for q in sorted(gsc_queries, key=lambda q: q["impressions"], reverse=True)[:keyword_limit]]
        seeds += [q["query"] for q in striking if q["query"] not in seeds]
        vol = ads.metrics(seeds, site=site) if seeds else []
        files["keywords_volume_for_gsc_queries"] = write_csv(out / "keywords_volume_for_gsc_queries.csv", vol)
        by_kw = {r["keyword"].lower(): r for r in vol}
        for q in striking:
            v = by_kw.get(q["query"].lower())
            q["monthly_searches"] = v["avg_monthly_searches"] if v else None
        ideas = ads.ideas(site_seed=domain, site=site, limit=300, min_volume=10) if entry.get("domain") else []
        ranking = {q["query"].lower() for q in gsc_queries}
        for r in ideas:
            r["site_has_ranking_query"] = r["keyword"].lower() in ranking
        files["keywords_ideas_for_domain"] = write_csv(out / "keywords_ideas_for_domain.csv", ideas)
        md.append(f"\n## Keyword Planner (demand), via {ads.auth_method}\n")
        if striking:
            md.append("\n**Striking-distance queries with search volume**\n\n"
                      + md_table(sorted(striking, key=lambda q: q.get("monthly_searches") or 0, reverse=True), ["query", "monthly_searches", "position", "impressions"], 12))
        gap_ideas = [r for r in ideas if not r["site_has_ranking_query"]]
        md.append("\n**Demand the site doesn't rank for yet** (from a whole-domain seed)\n\n"
                  + md_table(gap_ideas, ["keyword", "avg_monthly_searches", "competition", "yoy_pct"], 15))
    except Exception as exc:  # noqa: BLE001
        gaps.append(f"Keyword Planner failed: {str(exc).splitlines()[0][:200]}")

    md.append("\n## Data gaps\n\n" + ("\n".join(f"- {g}" for g in gaps) if gaps else "- None\n"))
    md.append("\n## Files\n\n" + "\n".join(f"- `{k}.csv`: {v} rows" for k, v in files.items()) + "\n")
    md.append("\nRead with `SEO_WORKFLOW.md`. Use these numbers as the baseline: say which snapshot a recommendation "
              "relies on, and compare against a new snapshot after changes ship.\n")
    (out / "SNAPSHOT.md").write_text("\n".join(md), encoding="utf-8")
    (out / "snapshot.json").write_text(json.dumps({"site": site, "date": today, "files": files, "gaps": gaps}, indent=2), encoding="utf-8")
    return out


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="snapshot", description="SEO / AIO / GEO baseline from GSC + GA4 + Keyword Planner")
    p.add_argument("--site", default=gsc_api.DEFAULT_SITE, required=gsc_api.DEFAULT_SITE is None)
    p.add_argument("--days", type=int, default=28)
    p.add_argument("--keyword-limit", type=int, default=150, help="top GSC queries to price in Keyword Planner")
    p.add_argument("--out", default=str(gsc_api.DATA_DIR), help="output root (default: this project's search-console/data)")
    a = p.parse_args(argv)
    try:
        path = snapshot(a.site, Path(a.out), a.days, a.keyword_limit)
    except Exception:  # noqa: BLE001
        traceback.print_exc()
        return 1
    print(f"Snapshot written: {path}\nRead first: {path / 'SNAPSHOT.md'}")
    print((path / "SNAPSHOT.md").read_text(encoding="utf-8").split("## Data gaps")[1][:600])
    return 0


if __name__ == "__main__":
    sys.exit(main())
