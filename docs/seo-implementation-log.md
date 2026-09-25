# SEO Implementation Log — 2026-09-25

Work completed against [`seo-audit-2026-09.md`](./seo-audit-2026-09.md). Every number below was re-measured by rebuilding the site and re-crawling all pages after the changes.

**Site surface:** 82 → **91 indexable pages** (97 routes built, including `/landing` which is now `noindex`, plus `robots.txt`, `sitemap.xml`, `llms.txt`).

---

## Verified before / after

| Check | Before | After |
|---|---:|---:|
| Titles over 60 characters | 25 | **0** |
| Meta descriptions over 160 characters | 8 | **0** |
| Pages with broken JSON-LD | 4 | **0** |
| Pages with `datePublished` | 0 | **9** |
| Pages with an `@id` entity graph | 0 | **91** |
| Pages with `sameAs` | 0 | **91** |
| Images crawlable by search engines | **0** | all |
| Blog articles' inbound internal links | 1 each | **3–6 each** |
| `/services/tv-repair-near-me` inbound links | 2 | **90** |
| Pages at click depth 3 | 15 | **0** |
| Orphaned / unreachable pages | 2 | **0** |
| Pages missing H1 / canonical / image alt | 0 | 0 |
| New cost guides: intra-cohort similarity | — | **10.9% avg** (target was under 35%) |

---

## P0 — Blockers fixed

**1. robots.txt no longer blocks every image.** `app/robots.js` disallowed `/_next/`, and all 26 homepage images are served from `/_next/image`. Zero images on the site could be crawled, and Googlebot could not fetch the CSS/JS needed to render pages. Now only `/api/` is disallowed.

**2. Broken BlogPosting schema.** `app/blog/[slug]/page.jsx` referenced `siteConfig.logo`, which did not exist, emitting `"url": "https://grsolution.co.inundefined"` on every article. `siteConfig.logo` is now defined and the publisher references the shared Organization node by `@id`.

**3. `/landing` de-indexed.** A 300-word orphan, unreachable by crawl, duplicating `/contact` intent, but indexable and listed in the sitemap. Now `robots: { index: false, follow: true }` and excluded from the sitemap via an `excludeFromSitemap` flag in `data/pages.js`.

**4. Placeholder text was rendering to live users.** Every blog article displayed the literal string `LinkedIn placeholder: #linkedin-profile-to-be-added` in its byline. Replaced with a proper dated byline linking to `/about`.

---

## P1 — Fixed

- **Sitemap `lastModified`** added (Google ignores `changefreq`/`priority`). Blog entries use their real `updatedAt`; other groups use dated constants in `app/sitemap.js` — bump these when the copy actually changes.
- **Dates added sitewide.** `publishedAt` / `updatedAt` on all articles, rendered as a visible "Published / Last reviewed" byline with `<time datetime>`, and emitted as `datePublished` / `dateModified`.
- **Entity graph.** `entityIds` and `sameAsProfiles` in `data/siteConfig.js`. Organization, LocalBusiness and WebSite now carry stable `@id`s and cross-reference each other instead of being three detached nodes on every page. `sameAs` currently resolves to the Google Business Profile only.
- **Title/description length.** `data/seo.js` adds `buildTitle()` and `clampDescription()`, which degrade gracefully rather than truncating — the generated templates can no longer overflow when a long city name is substituted.
- **Blog isolation broken.** `getArticlesLinkingTo()` in `data/blogArticles.js` inverts the existing `internalLinks` data into a reverse index, and a `RelatedGuides` section is mounted on all three service page templates. The relationship stays declared in one place.
- **Footer "Popular Locations" column** — sitewide links to the 4 city pages, the near-me page and the new brands hub.
- **`/services/brands` hub created**, eliminating click depth 3 entirely.
- **Toshiba brand pages created** (4 cities). Toshiba was advertised on the homepage brand strip with no page behind it. The strip is now generated from `data/brandServicePages.js`, so it can no longer drift.
- **`directAnswer` added to the 5 parent service pages**, matching the extractable-answer pattern already used on local and brand pages.
- **`/llms.txt` published**, generated from live data so it cannot go stale.
- **Author schema corrected** from `Person` to `Organization` — the byline is a team, and claiming Person for a group name undermines E-E-A-T rather than supporting it.

---

## P2 — Fixed

- **`viewport` export** added with `themeColor`.
- **`lang="en-IN"`** (was `en`), with `inLanguage` on WebSite and BlogPosting.
- **`scroll-padding-top: 6.5rem`** added — anchor targets previously landed underneath the 96px sticky header.
- **`overflow-x: hidden` removed from `body`.** It masked a layout overflow and risked breaking the sticky header. Clipping is now scoped to the two marquee tracks that actually overflow.
- **`--font-inter` removed.** The variable was referenced but never defined — no `next/font` import exists — so the stack silently fell back to Arial. Now an explicit stack.
- **Heading semantics.** The "15+" and "15,000+" figures on the homepage were `<h2>` elements polluting the document outline. Now styled spans.

---

## New content — 5 high-intent cost pages

The audit found 18 cost keywords for Noida, Greater Noida and Ghaziabad all funnelling into a single Delhi-NCR article. Five pages now serve that intent:

| URL | Primary keyword | Words | H2s |
|---|---|---:|---:|
| `/blog/tv-repair-cost-delhi` | tv repair cost delhi | 1,690 | 10 |
| `/blog/tv-repair-cost-noida` | tv repair cost noida | 1,519 | 9 |
| `/blog/tv-repair-cost-greater-noida` | tv repair cost greater noida | 1,461 | 8 |
| `/blog/tv-repair-cost-ghaziabad` | tv repair cost ghaziabad | 1,348 | 9 |
| `/blog/tv-screen-replacement-cost-delhi-ncr` | tv screen replacement cost | 1,424 | 9 |

### Written to avoid the duplication trap

The audit's central finding was that existing service-by-city pages run **67–68% identical**. Repeating that pattern on the highest-intent pages on the site would have made the problem worse, so these five share no template. Each is built around what genuinely differs:

- **Delhi** — parts-market proximity and the wide age spread of sets in daily use
- **Noida** — large QLED/OLED panel mix, and high-rise access deciding doorstep vs workshop
- **Greater Noida** — travel distance, making the first visit count, transport risk on large panels
- **Ghaziabad** — repair-versus-replace economics on mid-range family televisions
- **NCR-wide** — panel replacement specifically, and how to tell a real panel fault from a backlight fault

**Measured result: 10.9% average pairwise similarity, 14.7% maximum** — against a 35% target and the 67–68% baseline.

### AEO/AIO structure

Each page carries an extractable 40–60 word `directAnswer` above the fold, **12 comparison tables** across the set (cost drivers, repair-vs-replace, symptom-to-cause, handling by size, where each repair is performed), 6 FAQs with `FAQPage` markup, `datePublished`/`dateModified`, and internal links that now flow back automatically through `RelatedGuides`.

---

## Round 2 — pricing, deduplication and Tier 2–4 build

Site now: **105 indexable pages** (111 routes). Every check below re-measured on a fresh production build.

### Pricing from published sources

`data/pricing.js` now holds **Delhi NCR market ranges**, not placeholders. They were triangulated from five published Indian sources (Urban Company Delhi NCR, Samsung Parts India panel list, Great Bharat Spares backlight list, Aman Repairing Delhi, Serve Hyderabad). Parts-only sources had a labour component added, and a UAE-priced source was discarded. Every table says these are market ranges confirmed after inspection, not a GR Solution rate card, and links to `/pricing#sources`, which lists every source and the method. Earlier FAQ copy that stated a GR visit-fee policy as fact now describes market practice and says "confirm when booking".

### Service-by-city duplication: 68% to 34%

| Cohort | Before | After (raw) | After, boilerplate excluded |
|---|---:|---:|---:|
| `led-tv-repair-{city}` | 67.7% | 34.9% | 31.6% |
| `oled-qled-tv-repair-{city}` | 67.9% | 33.6% | 29.7% |
| `lcd-tv-repair-{city}` | — | 33.4% | 29.2% |
| `plasma-tv-repair-{city}` | — | 33.6% | 29.4% |
| `curved-tv-repair-{city}` | — | 34.6% | 30.4% |
| `tv-repair-{city}` hubs | 59.7% | 33.9% | 31.6% |

How it was done:
- **24 hand-written service-and-city blocks** (`data/serviceCityContent.js`), each with 3 paragraphs, a table of common situations and 2 unique FAQs.
- **Verifiable city facts** (`data/cityLocalFacts.js`): route from New Kondli, electricity distributor, housing stock and a locality table. The full block appears on the city hub; each service page shows only its most relevant fact, so pages for different services in one city don't repeat it.
- **Hub and spoke.** Service-level explanations now appear once, on the parent service page ("Faults Explained"), instead of word-for-word on all four city pages.
- **Templated answers made city-specific.** Filler blocks were removed.

**SEO preserved on all 24 pages** (compared before and after): 0 changes to titles, descriptions, H1s or canonicals, 0 H2 headings lost, 0 FAQ questions removed. The median page grew from 2,048 to 2,225 words.

Remaining: 10 pairs sit at 35.0–37.5% raw, all Noida, Greater Noida or Ghaziabad pairs. With sitewide template text excluded they are all below 35%.

### New pages

| Pages | Similarity within the group |
|---|---:|
| 6 symptom guides (sound but no picture, not turning on, screen lines, backlight failure, keeps restarting, repair vs replacement) | 12.1% avg |
| 6 locality pages (East, South and West Delhi, Indirapuram, Vasundhara, Noida Sector 62) | 16.6% avg, about 2% vs their city hub |
| `/pricing`: full price grids, visit charge, cost drivers, sources and method | — |
| `/reviews`: existing testimonials and Google Business Profile links, no Review schema | — |

Locality pages use only checkable local facts, with no invented jobs. Pages that mention "service centre" say plainly that GR Solution is an independent repairer. City hubs link down to their locality pages.

### Font Awesome self-hosted

The render-blocking cdnjs stylesheet and web fonts are gone. `app/icons.css` is a 19 KB subset of the 31 icons actually used, drawn as CSS-masked SVGs, and the existing `<i className="fa-solid …">` markup is unchanged. To regenerate it, run `scripts/generate-icons.cjs` (instructions are in the file). Verified visually in headless Edge.

### Bugs found and fixed during verification

- **All 4 Toshiba pages rendered "undefined"**: Toshiba was missing from the brand label maps. Fixed.
- **Horizontal scroll on phones** on locality pages and blog guides: grid children with wide tables stretched past the viewport. This had been hidden by the old `body { overflow-x: hidden }`. Fixed with `.grid > * { min-width: 0 }`. **All 106 pages checked at 390px with no horizontal scroll.**
- Literal `—` escapes in JSX text on `/pricing` and `/reviews`. Fixed.

### Final state
105 pages, all 200 · 0 titles over 60 · 0 descriptions over 160 · one H1 each · 0 missing canonicals, image alts or broken JSON-LD · 0 duplicate titles · 0 "undefined"/"TODO" in visible text · lint clean.

---

## ⚠ Action required from you

1. **Settle the diagnostic-fee wording.** The homepage hero says "Free Diagnostic", the homepage "Why Choose" block says "Fixed diagnostic fees", and the pricing copy says "confirm visit terms when booking". Pick one and it can be applied everywhere.
2. **Review the market price ranges** in `data/pricing.js`. If GR Solution's own prices differ, replace the values; the file header explains how.
3. **`/about` rewrite**: still thin, with no named people. It needs your real details.
4. **Contact map embed**: still points at the Delhi NCR centroid, not New Kondli.
5. **Social profiles**: `siteConfig.socialLinks` is still empty.
6. **Next locality candidate**: `led tv repair in noida sector 137` has keyword-research demand; Sector 62 was built because it was on the list.

---

## Files (round 2)

**Created:** `data/pricing.js` (rewritten), `data/cityLocalFacts.js`, `data/serviceCityContent.js`, `data/symptomGuides.js`, `data/localityPages.js`, `data/testimonials.js`, `components/PriceTable.jsx`, `components/ContentTable.jsx`, `components/LocalityPage.jsx`, `app/pricing/page.jsx`, `app/reviews/page.jsx`, `app/icons.css`, `scripts/generate-icons.cjs`

**Modified:** `data/localServicePages.js`, `data/costGuides.js`, `data/blogArticles.js`, `data/brandServicePages.js`, `data/pages.js`, `app/services/[slug]/page.jsx`, `app/blog/[slug]/page.jsx`, `app/layout.jsx`, `app/globals.css`, `app/sitemap.js`, `app/llms.txt/route.js`, `components/Footer.jsx`, `components/Testimonials.jsx`
