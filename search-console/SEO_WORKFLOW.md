# SEO / AIO / GEO workflow: grsolution.co.in

Use this checkpoint at the start of **any** SEO, AIO (AI Overviews) or GEO (AI-assistant visibility)
task on this site: new pages, rewrites, keyword research, internal links, technical fixes or
reporting. It ties the work to three read-only data sources already connected here:

| Source | Answers | Command |
|---|---|---|
| Google Search Console | what Google shows us for, rankings, CTR, index status | `py search-console/gsc.py ...` |
| GA4 | what visitors do, channels, AI-assistant traffic, leads | `py search-console/ga4.py ...` |
| Google Ads Keyword Planner | how much demand exists, trends, new topics | `py search-console/keywords.py ...` |

On Linux, Mac or a cloud session, use `python3` instead of `py`. Setup is in `search-console/README.md`.

## 1. Checkpoint: take or refresh the baseline

```bash
py search-console/snapshot.py          # GSC + GA4 + Keyword Planner -> search-console/data/snapshots/<date>/
```

- Reuse the latest snapshot if it's under 7 days old. Otherwise take a new one.
- Read `SNAPSHOT.md` first. It covers the 28-day trend, top and striking-distance queries, channels,
  AI-assistant traffic, leads, demand by query and demand the site doesn't rank for yet.
- Its **Data gaps** section lists any missing source. Say so in your answer; don't guess around it.

## 2. Information gathering (only what the task needs)

- **Rankings and opportunities:** `gsc.py query --dimensions query,page --days 90` and
  `--filter "query:contains:<topic>"`.
- **Cannibalization:** query → page pairs where several URLs share one query.
- **Index status:** `gsc.py inspect --url <url>` before rewriting, merging or redirecting a page.
- **Behaviour and conversion:** `ga4.py pages`, `ga4.py organic-pages`, `ga4.py leads`.
- **GEO / AIO:** `ga4.py ai` shows which AI assistants send visitors, to which pages, and whether
  they convert.
- **Demand:**
  - `keywords.py metrics <keywords>` for a fixed list
  - `keywords.py ideas <seeds> --min-volume 20` for new topics
  - `keywords.py ideas --url <page>` for a page
  - `keywords.py geo <city>` for local intent

## 3. Gates: every recommendation must pass these

1. **Evidence:** every keyword, page or claim cites its source and the snapshot date, e.g. "GSC
   2026-11-08: 257 impressions, position 6.3" or "Keyword Planner: 74,000/mo".
2. **No invented numbers.** Never invent search volumes, rankings, traffic, conversions or
   competitor data. If a source can't answer, write "unknown" and list it as a gap.
3. **Demand before content.** Target a new topic only with Keyword Planner volume or GSC
   impressions behind it. Low-volume terms are fine when they're clearly high-intent; say why.
4. **Protect what works.** Before changing a page that already earns clicks, impressions or leads,
   check it in GSC and GA4, and keep its URL and canonical unless the evidence says otherwise.
5. **One page per intent.** Check GSC query → page pairs for cannibalization before creating a page
   that overlaps an existing one.
6. **AIO / GEO.**
   - **Shape:** prefer answer-first sections, clear facts, prices and steps, and structured data
     that matches the visible content.
   - **Evidence:** check `ga4.py ai` to see which pages AI assistants already send traffic to.
7. **Measure.** After changes ship, take a new snapshot after about 28 days and compare it with the
   baseline: the same queries, pages, channels and leads.

## 4. Hand-off

- **Report:** name the snapshot folder used, the changes made or proposed with their evidence, and
  what to re-measure and when.
- **Snapshots:** they stay in `search-console/data/`, which is git-ignored. Copy only the conclusions
  into project docs, never raw exports with user data.
