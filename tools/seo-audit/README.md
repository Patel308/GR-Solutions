# SEO / AIO / GEO regression guard

Tooling for the 2026 redesign. It is not part of the website build (own
`package.json`, ignored by ESLint, Tailwind and Docker) and never ships to
production.

| Script | What it does |
| --- | --- |
| `crawl.mjs` | Crawls every URL in `sitemap.xml` (+ `/landing` and a 404 probe) and writes one JSON snapshot per page: title, meta description, canonical, robots, Open Graph/Twitter, H1–H6 in order, every link with anchor text and region, every image with filename/alt/dimensions/loading, all JSON-LD, the visible copy as text runs, main-content word count, NAP occurrences and invariant checks (one H1, FAQ text = FAQPage schema, visible breadcrumb vs BreadcrumbList, first block after the H1). Also snapshots `robots.txt`, `sitemap.xml`, `llms.txt` and every redirect in `next.config.js`. `--rendered` adds a post-hydration snapshot from Chromium. |
| `diff.mjs` | Compares two snapshots. Every difference is graded **VIOLATION** (frozen by the guardrails), **REVIEW** (allowed only with a written justification) or **INFO**. Exits 1 on any violation. |
| `lighthouse.mjs` | Mobile Lighthouse (default mobile config: Moto G Power, simulated slow 4G, 4× CPU) on the five reference pages, 3 runs each, median run reported. Google Analytics is blocked so before/after numbers stay comparable. |
| `screenshots.mjs` | Responsive audit at 360/390/414/768/1280/1440: horizontal overflow, H1 size and line count, fold position of the first CTA, fixed overlays, tap targets < 48px, CLS; first-viewport screenshots plus full-page captures at 390px. |
| `ab-summary.mjs` | Summarises an interleaved Lighthouse A/B (below): median, mean and range per page and build, plus every run's numbers. |

## Running

```bash
# 1. Build and serve the site exactly as production does
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0RQ8C75FPT npm run build
npx next start -p 3100

# 2. Install the tooling once
npm --prefix tools/seo-audit ci

# 3. Snapshot, compare, measure
cd tools/seo-audit
node crawl.mjs --base http://127.0.0.1:3100 --out snapshots/current --rendered
node diff.mjs --base snapshots/baseline --head snapshots/current --out reports/current/seo-diff.md
node diff.mjs --base snapshots/current --head snapshots/current --head-pages pages-rendered   # content that needs JS
node lighthouse.mjs --base http://localhost:3100 --out reports/current/lighthouse
node screenshots.mjs --base http://localhost:3100 --out reports/current/responsive
```

Playwright and Lighthouse use `/opt/pw-browsers/chromium` by default; pass
`--chrome <path>` or set `CHROME_PATH` elsewhere.

### Comparing two builds (interleaved A/B)

Lighthouse's simulated mobile LCP moves by ±0.3–0.5 s between runs of the
same build, so compare builds by alternating them run by run rather than
batch by batch. Serve each build on its own port, then:

```bash
cd tools/seo-audit
RUNS=/tmp/lh-ab; mkdir -p $RUNS
for i in 1 2 3 4 5 6 7; do
  for page in / /services/oled-qled-tv-repair /services/tv-repair-noida /blog /blog/tv-repair-cost-delhi; do
    slug=$(echo "$page" | sed 's#^/$#home#; s#^/##; s#/#__#g')
    for v in live:3200 new:3100; do
      node lighthouse.mjs --base http://localhost:${v#*:} --only "$page" --runs 1 --out $RUNS/$slug-${v%%:*}-$i > /dev/null
    done
  done
done
node ab-summary.mjs --dir $RUNS --variants live,new --labels "Live site,New site" --out reports/current/lighthouse-ab
```

## What is committed

- `snapshots/baseline/` — the Phase 0 baseline (raw server HTML), taken from a
  production build of commit `595b6c7` (see `snapshots/baseline/meta.json`).
- `reports/phase-0/` — Lighthouse and responsive summaries of the old site.
- `reports/phase-5/` — the redesigned site. `lighthouse-ab/` is the final
  speed comparison (live site, old design on Next.js 16.4 and new site,
  7 alternating runs each); `lighthouse/` and `lighthouse-baseline-rerun/`
  are earlier single batches, kept for reference.
  Raw Lighthouse reports and screenshots are git-ignored and can be
  regenerated with the commands above.

## Signed-off changes

`approved-changes.json` lists changes the owner approved during the
redesign (new form labels, the stock-image swaps, D15, D18 and the
site-wide components). `diff.mjs` reads it by default (`--approved <file>`
for another list, `--approved none` to see everything). A rule matches by
level, field, page and detail-line patterns; matching lines are reported
under **APPROVED** with the rule id and decision, any other lines keep their
level, and only unapproved violations fail the run. Add a rule only for a
change that has been signed off, and keep its patterns as narrow as the
change itself.

## Reading a diff

- `H1-H3 text changed` / `order changed`, `internal links removed or anchor
  changed`, `images removed or alt/filename changed`, `JSON-LD changed`,
  `copy removed or edited`, `FAQ text no longer matches FAQPage schema`,
  sitemap / robots / redirects / llms.txt changes are **violations**: revert,
  or get written approval and record it in the phase notes.
- New links, new copy, new images and moved sections are **review** items:
  each needs a one-line justification in the phase notes.
- Copy is compared as text runs (text between tags), so restyling, new
  wrappers and new classes never show up; only real wording changes do.
