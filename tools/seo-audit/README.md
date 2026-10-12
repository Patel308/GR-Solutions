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

## What is committed

- `snapshots/baseline/` — the Phase 0 baseline (raw server HTML), taken from a
  production build of commit `595b6c7` (see `snapshots/baseline/meta.json`).
- `reports/phase-0/` — Lighthouse and responsive summaries. Raw Lighthouse
  reports and screenshots are git-ignored and can be regenerated from the
  baseline commit with the commands above.

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
