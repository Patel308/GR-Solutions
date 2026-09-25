# GR Solution — End-to-End Local SEO / AIO / AEO Audit

**Date:** 2026-09-25
**Scope:** Technical SEO, on-page SEO, local SEO, AI/answer-engine optimization, UX & scroll behaviour.
**Explicitly out of scope:** off-page / link building / citations (per request).
**Method:** Production build (`next build`, 86 routes, exit 0), served locally, then all 82 sitemap URLs crawled and parsed. Findings below are measured from rendered HTML, not inferred from source.

---

## 1. Scorecard

| Area | Grade | One-line verdict |
|---|---|---|
| Crawl & indexation | **C** | One robots.txt rule blocks every image on the site. |
| Metadata & canonicals | **A-** | 100% coverage, clean; 25 titles over-length. |
| Structured data | **B** | Broad and consistent, but a broken logo URL and missing dates. |
| Information architecture | **B+** | Only 2 orphans, but blog is near-isolated and 15 pages sit at depth 3. |
| Content uniqueness | **C+** | Same-service-across-cities pages are ~68% identical. |
| Local SEO | **B** | Strong NAP consistency; map embed and locality depth are weak. |
| AIO / AEO readiness | **B** | Good direct-answer pattern; no entity graph, no dates, no `llms.txt`. |
| Performance / UX | **A-** | Lean bundle, optimized images, reduced-motion handled. |

**Current surface:** 8 static + 5 service + 25 local + 40 brand + 4 blog = **82 indexable pages**.

---

## 2. Technical SEO

### P0 — robots.txt blocks every image and all CSS/JS

`app/robots.js` emits `Disallow: /_next/`. Every `next/image` output is served from `/_next/image?url=...`.

Measured: **26 of 26 images** on the homepage use `/_next/image`; **zero** use a direct `/images/` path.

Consequences:
- No image on the site can be crawled → no Google Images traffic, no image thumbnails in local/mobile results.
- Googlebot cannot fetch the CSS and JS chunks it needs to render the page, which degrades rendering-based evaluation and surfaces "blocked resource" warnings in Search Console.

Fix — drop the `/_next/` disallow (keep `/api/`):

```js
// app/robots.js
disallow: ['/api/'],
```

If you want to keep build chunks out of the index while leaving them fetchable, block only `/_next/static/chunks/` — never `/_next/image`.

### P0 — `/landing` is an orphaned, thin, indexable duplicate

- 300 words, **zero internal inbound links**, unreachable by crawl from the homepage.
- Still listed in `sitemap.xml` and still `index,follow`.
- Duplicates `/contact` intent with no unique value.

Fix: either `robots: { index: false }` plus removal from the sitemap, or delete the route. If it is a paid-traffic landing page, it should be `noindex` regardless.

### P1 — Sitemap has no `lastModified`

`app/sitemap.js` emits `changeFrequency` and `priority` only. Google ignores both. It uses `lastmod`. Without it, 82 URLs give no freshness signal and recrawl scheduling suffers.

Add a real date per entry (ideally sourced from content, not build time).

### P1 — Missing `viewport` / `themeColor` export

No `export const viewport` anywhere. The default viewport meta is emitted, but `themeColor` and explicit viewport control are absent.

### P2 — `--font-inter` is referenced but never loaded

`app/globals.css` sets `font-family: var(--font-inter), Inter, Arial, ...` but no `next/font` import exists anywhere. The variable is undefined, so the site silently falls back to Arial. Either load Inter via `next/font`, or drop the variable.

### P2 — Font Awesome loaded as a render-blocking CDN stylesheet

`app/layout.jsx` pulls the full Font Awesome 6.4.0 CSS from cdnjs on every page. It is render-blocking and third-party. The site uses roughly 25 icons. Self-hosting an SVG subset removes a blocking request and a third-party dependency.

### Verified healthy

- All 82 URLs return **200**. No redirect chains in the internal graph.
- **100% canonical coverage**, all self-referencing.
- Exactly **one `<h1>` per page**, 82/82.
- **Zero images missing `alt`** across the whole crawl.
- `www` to apex 301 and a thorough legacy `.html` redirect map are in place (`next.config.js`).
- Bundle is lean: 731 KB total static, largest chunk 226 KB.
- Hero image correctly preloaded with `priority`.

---

## 3. Structured data

### P1 — BlogPosting publisher logo renders as a broken URL

`app/blog/[slug]/page.jsx` references `siteConfig.logo`, which **does not exist** in `data/siteConfig.js` (the key is `defaultOgImage`).

Rendered output on all 4 blog articles:

```json
"publisher": { "logo": { "url": "https://grsolution.co.inundefined" } }
```

Fix: use `siteConfig.defaultOgImage`, or add a `logo` key to `siteConfig`.

### P1 — No `datePublished` / `dateModified` anywhere

Zero occurrences sitewide. `BlogPosting` without `datePublished` is not eligible for Article rich results, and both Google and AI answer engines use dates heavily to decide what to trust and surface. This is the cheapest AEO win available.

### P1 — No entity graph (`@id`, `sameAs`)

Every page emits a standalone `Organization`, `LocalBusiness` and `WebSite` node with no `@id` cross-references and no `sameAs`. `siteConfig.socialLinks` is still `{ facebook: '', instagram: '' }` and the Google Business Profile URL is used only as `hasMap`.

For local SEO and for AI systems resolving "who is GR Solution", wire the nodes together with `@id` and add `sameAs: [GBP URL, Facebook, Instagram, JustDial, Sulekha]`.

### P2 — `WebSite` has no `potentialAction`

No `SearchAction`. Low impact (the site has no search), but it is the only missing standard property.

### P2 — No `AggregateRating` or `Review` markup

Testimonials in `components/Testimonials.jsx` are hard-coded with no markup. **Do not** add self-serving `Review` / `AggregateRating` to `LocalBusiness` — Google has disallowed self-hosted reviews for rich results since 2019 and it risks a manual action. The correct play is to drive reviews to the Google Business Profile and, separately, make the on-site testimonials verifiable (real name, area, TV model, date).

### Verified healthy

- 70 of 82 pages carry a full `Service` + `BreadcrumbList` + `FAQPage` stack.
- **399 unique FAQ questions** across the site — genuinely substantial.
- `BreadcrumbList` correctly goes 4 levels deep on local pages (Home, Services, Service, City).
- All JSON-LD parses without error.

---

## 4. On-page SEO

### P1 — 25 of 82 titles exceed 60 characters

They will truncate in SERPs. Worst offenders:

| Chars | Page |
|---:|---|
| 72 | `/services/plasma-tv-repair` |
| 72 | `/services/curved-tv-repair` |
| 70 | `/contact` |
| 69 | `/services/lcd-tv-repair` |
| 68 | `/services/oled-qled-tv-repair-greater-noida` |

Root cause is the `| GR Solution` suffix plus a middle qualifier. Drop the middle segment on long ones, or shorten the brand suffix.

### P1 — 8 meta descriptions exceed 160 characters

All are Greater Noida / Ghaziabad brand pages, where the longer city name overflows the template in `data/brandServicePages.js`. Shorten the template string.

### P2 — 6 thin pages

| Words | Page |
|---:|---|
| 249 | `/terms` |
| 255 | `/privacy` |
| 266 | `/about` |
| 298 | `/contact` |
| 300 | `/landing` |
| 544 | `/blog` |

`/terms` and `/privacy` being short is fine. **`/about` at 266 words is the real problem** — see E-E-A-T below.

### P2 — Heading semantics misused for statistics

`app/page.jsx` and `app/about/page.jsx` use `<h2>` for the figures "15+" and "15,000+". These are display numbers, not section headings. They pollute the document outline that both Google and AI extractors read.

### P2 — Keyword density is on the high side

Measured on rendered body copy:

- `/services/led-tv-repair-delhi`: "Delhi" x78 in 2182 words (**3.6%**)
- `/services/samsung-tv-repair-delhi`: "Samsung" x49 in 1463 words (**3.4%**)
- `/services/tv-repair-noida`: "Noida" x57 in 1707 words (**3.3%**)

Not penalty territory, but noticeably repetitive to a human reader. Some FAQ questions read as machine-generated — e.g. *"What problems are common in led tv repair?"* (lowercase keyword spliced into a sentence).

### Verified healthy

- Median page is **1540 words**; 76 of 82 pages exceed 600 words.
- Heading hierarchy on service/local/brand templates is clean and deep (H1, H2, H3, no skips).
- Every page has a unique title and description.

---

## 5. Content uniqueness — the biggest strategic risk

Measured with 5-gram shingle Jaccard similarity on main content (header and footer stripped):

| Cohort | Pages | Avg similarity | Max |
|---|---:|---:|---:|
| `led-tv-repair-{city}` | 4 | **67.7%** | 70.4% |
| `oled-qled-tv-repair-{city}` | 4 | **67.9%** | 70.6% |
| `samsung-tv-repair-{city}` | 4 | **66.9%** | 70.7% |
| `tv-repair-{city}` | 4 | **59.7%** | 61.4% |
| brand pages, Delhi only | 10 | 45.5% | 49.6% |
| parent service pages | 5 | 24.7% | 26.5% |

Cross-type, same-city is healthy (6–13%). **The weakness is entirely the city axis.** Swapping "Delhi" for "Noida" changes about 30% of the words. Four near-identical pages compete for the same cluster, which is textbook cannibalization and exactly the pattern Google's scaled-content-abuse policy targets.

`docs/keyword-optimization-pass-5/6/7.md` deliberately avoided creating new URLs to limit thin-content risk. That was the right instinct, but it was applied to the wrong axis — the risk is already present in the city dimension of the existing 65 pages.

**What to do:** the fix is not fewer pages, it is more genuinely local substance per page. Each city page needs material that cannot be produced by find-and-replace:

- Real jobs completed in that city (TV model, symptom, what was actually found, outcome, month).
- Genuine per-city logistics: typical response window, actual society/sector coverage, parking and lift realities, workshop-vs-doorstep split for that city.
- City-specific pricing bands you can stand behind.
- Photos taken in that city.
- Named technician who covers that territory.

Target: drive each cohort below 35% similarity. Two cities with real content beat four cities of templated text.

---

## 6. Internal linking

| Metric | Value |
|---|---|
| Orphan pages | 2 (`/`, `/landing`) |
| Pages with 1–2 inbound links | 5 |
| Click depth 1 | 22 pages |
| Click depth 2 | 43 pages |
| Click depth 3 | 15 pages |
| Unreachable from homepage | 1 (`/landing`) |

### P1 — The blog is almost completely isolated

Each of the 4 articles has exactly **one** inbound internal link (from `/blog`). A grep confirms **no service, local, or brand page links to any blog article**. Links flow blog to services but never services to blog.

Every cost/diagnostic article should be linked from the matching service pages. `/blog/led-tv-screen-replacement-cost-delhi` in particular belongs on `/services/led-tv-repair-delhi` and `/services/tv-repair-delhi`.

### P1 — `/services/tv-repair-near-me` has only 2 inbound links

This page absorbs a large share of near-me intent per `docs/keyword-optimization-pass-2.md` (items 4, 6, 7, 11, 12, 16, 22 all map to it), yet it is linked only from `/` and `/services`. It deserves a footer link and a link from all 25 local pages.

### P2 — 15 tail brand pages sit at depth 3

All Vu, Philips, Hisense, TCL and Panasonic pages outside Delhi. They are only reachable via sibling links on other brand pages. A brand hub at `/services/brands` (or a footer brand column) would lift all 40 to depth 2.

### P2 — Header and footer link only the 5 parent services

65 of the 82 pages get no sitewide link equity. A footer "Popular Locations" column (the 4 city pages plus near-me) is a two-line change with sitewide effect.

### P2 — Brand carousel does not match the brand pages

`app/page.jsx` advertises `TOSHIBA` in the homepage brand strip, but **no Toshiba page exists**. Conversely `hisense`, `mi`, `philips` and `tcl` have full 4-city page sets but are absent from the strip. Align both.

---

## 7. Local SEO

### P1 — Map embed points at "Delhi NCR", not the actual business

`app/contact/page.jsx` embeds a Google Maps iframe whose place query is `Delhi NCR` — a region centroid, not `C-4/102, Pocket C 3, New Kondli, Delhi 110096`. Replace it with the embed from the actual Google Business Profile listing so the on-page location signal matches the NAP and the `geo` coordinates in schema.

### P1 — `/about` is too thin to carry E-E-A-T

266 words, zero named people, no founding year, no certifications, no technician count, no brand authorizations. It is also the `author.url` target for every blog article, so it is doing E-E-A-T work it is not equipped for.

For a service business where customers hand over a ₹40,000+ television, this is the weakest trust page on the site. Add: owner/founder name and photo, years active with a founding year, technician count and specializations, workshop address with the real photos already in `/public/images/workshop-*.webp`, service guarantee terms, and any brand or trade credentials.

### P2 — Only 4 locations, each treated as a single unit

`data/localServicePages.js` defines Delhi, Noida, Greater Noida and Ghaziabad. Each `city` object already carries a `nearby` array (East/South/West/North Delhi, Sector 18/62/63/75/76/104/137, Indirapuram, Vaishali, Vasundhara, Pari Chowk) but these render as text only. Delhi is a 1,484 km² city being served by one page. See §9 for the locality plan.

### Verified healthy

- NAP is consistent: phone appears in body copy on 67/82 pages, address on 68/82 — always identical strings, sourced from `siteConfig`.
- `LocalBusiness` schema is complete: address, geo, `openingHoursSpecification`, `areaServed`, `paymentAccepted`, `currenciesAccepted`.
- GA4 is live (`G-0RQ8C75FPT`) with `generate_lead` call-click tracking wired through `data-call-location` on every phone link — genuinely well done.
- Phone, WhatsApp and form CTAs are present on every page.

---

## 8. AIO / AEO (AI & answer-engine optimization)

AI assistants and AI Overviews need: a crawlable page, an extractable direct answer, clear entity identity, and a freshness signal. Status:

| Signal | Status |
|---|---|
| Direct answer near the top | Partial — local, brand and blog pages have `directAnswer`; the **5 parent service pages do not** |
| FAQ structured data | Strong — 399 unique Q&As |
| Content dates | **Missing entirely** — no `datePublished`/`dateModified` sitewide |
| Entity disambiguation | **Missing** — no `sameAs`, no `@id` graph |
| Author identity | Weak — `blogAuthor` is a generic "Editorial Team" with a placeholder `linkedinUrl: '#linkedin-profile-to-be-added'` |
| Crawlable assets | **Broken** — `Disallow: /_next/` blocks all images |
| `llms.txt` | Absent |
| Tabular/extractable facts | Absent — no pricing tables, no symptom-to-cause tables |

### Highest-value AEO actions

1. **Add dates.** Publish and modified dates on all blog articles, plus a visible "Last reviewed" line. AI systems deprioritize undated content.
2. **Add `directAnswer` to the 5 parent service pages** so `/services/led-tv-repair` opens with a 40–60 word extractable answer, matching what local and brand pages already do.
3. **Add `sameAs` and an `@id` entity graph** so AI systems can resolve GR Solution as a distinct business.
4. **Publish comparison tables.** AI Overviews preferentially lift tables. A symptom-to-likely-cause-to-typical-fix table, and a repair-vs-replace decision table, are the two highest-leverage additions.
5. **Add `/llms.txt`** describing the business, service area, service list and canonical page map.
6. **Fix the robots.txt block** — an AI crawler that cannot fetch images cannot use them.

---

## 9. UX, scrolling and rendering

### Verified healthy

- `prefers-reduced-motion` is respected — both the logo marquee and the specialty carousel disable their animations, and `scroll-behavior` resets to `auto`. Correctly implemented.
- Two infinite CSS marquees (`logo-scroll` 30s, `carousel-loop` 42s) use `transform` only, so they are GPU-composited and do not thrash layout. The specialty carousel also pauses on hover.
- Floating WhatsApp/call buttons are `fixed` at `z-[900]`, below the `z-[1000]` sticky header, and the footer carries `pb-28` on mobile so they never cover the last row. Deliberate and correct.
- Mobile nav, services dropdown and enquiry modal are all keyboard-reachable with `aria-label`s on icon-only controls.

### P2 — `overflow-x: hidden` on `body` masks a layout overflow

`app/globals.css:42` sets `overflow-x: hidden` on `body`. This hides horizontal overflow rather than fixing it, and on `body` it can break `position: sticky` descendants in some engines — and the header is `sticky top-0`. Find the actual overflowing element (likely a marquee track at `width: max-content`), constrain it, then remove the global hide.

### P2 — No `scroll-margin-top` for a 96px sticky header

`html { scroll-behavior: smooth }` is set and the header is `min-h-[96px]` sticky, but no `scroll-margin-top` / `scroll-padding-top` exists anywhere. Any in-page anchor lands with its target hidden behind the header. Currently only `/landing`'s `#book` link is affected, so impact is low — but add `html { scroll-padding-top: 6.5rem }` before adding any more anchors or a table of contents.

### P2 — Oversized testimonial avatars

`components/Testimonials.jsx` renders avatars at 90x90 from source files of 67–134 KB. `next/image` resizes them, but shipping smaller sources reduces build work and origin transfer.

---

## 10. Keyword pages to build

Coverage of the supplied research is already strong: **35 of the top 50 keywords** map to a live page, and the 15 "missing" are almost all slug-naming variance (`mi-xiaomi-*` already 301s to `mi-*`) rather than genuine gaps. The uncovered top-50 volume is only ~100 searches/month.

The real opportunity is in the **44 cluster secondary keywords that appear nowhere in site copy**, which fall into four clean groups.

### Tier 1 — Per-city cost pages (build first)

18 cost keywords for Noida, Greater Noida and Ghaziabad currently all funnel into the single `/blog/lcd-tv-repair-cost-delhi-ncr` article (`docs/keyword-optimization-pass-5.md`, items 152–169). One page cannot rank for 18 distinct city-qualified cost queries. Cost intent is also the highest-converting and most AI-Overview-eligible content type in this vertical.

| New URL | Primary keyword | Covers |
|---|---|---|
| `/blog/tv-repair-cost-delhi` | tv repair cost delhi | tv technician charges delhi, tv repair charges delhi |
| `/blog/tv-repair-cost-noida` | tv repair cost noida | led tv repair cost noida, tv technician charges noida, led tv panel repair cost noida, oled tv repair cost noida, tv screen replacement cost noida |
| `/blog/tv-repair-cost-greater-noida` | tv repair cost greater noida | 6 Greater Noida cost variants |
| `/blog/tv-repair-cost-ghaziabad` | tv repair cost ghaziabad | 6 Ghaziabad cost variants |
| `/blog/tv-screen-replacement-cost-delhi-ncr` | tv screen replacement cost | screen/panel replacement cost across NCR |

Each needs a real price-range table by screen size and fault type. Publishing honest bands ("X to Y for backlight on a 43-inch, subject to inspection") is what earns the AI Overview citation — the current "we don't publish fixed prices" stance is trustworthy but gives extraction engines nothing to lift.

### Tier 2 — Symptom pages (highest AIO/AEO leverage)

None of these exist. They are exactly what people type into AI assistants, they are city-agnostic so they carry no duplication risk, and they feed the commercial pages.

| New URL | Primary keyword |
|---|---|
| `/blog/tv-sound-but-no-picture` | tv sound working but no picture |
| `/blog/tv-not-turning-on` | tv not turning on standby light blinking |
| `/blog/tv-screen-lines-vertical-horizontal` | lines on tv screen |
| `/blog/tv-backlight-failure-symptoms` | tv backlight repair (uncovered from research) |
| `/blog/tv-keeps-restarting` | tv turning on and off repeatedly |
| `/blog/tv-repair-vs-replacement-guide` | tv repair vs replacement (already in the blog plan, still unbuilt) |

Build each with a symptom-to-likely-cause-to-typical-fix table at the top.

### Tier 3 — Locality pages (gated, phased)

The research contains clear sub-city demand that the 4 city pages cannot serve: *led tv repair in south delhi, tv repair in south delhi, samsung tv service center in south delhi, sony tv service center in west delhi, sony tv service centre in east delhi, tv repair in vasundhara ghaziabad, led tv repair in vasundhara ghaziabad, led tv repair in gaffar market delhi, led tv repair in noida sector 137*.

Start with 6, not 20:

`/services/tv-repair-south-delhi`, `/services/tv-repair-east-delhi`, `/services/tv-repair-west-delhi`, `/services/tv-repair-indirapuram`, `/services/tv-repair-vasundhara`, `/services/tv-repair-noida-sector-62`

**Gate:** ship a locality page only when you can supply at least 3 real completed jobs, genuine local access notes, and the covered sub-areas. Without that, these become the doorway pages `docs/keyword-optimization-pass-5.md` correctly warned against — and the existing 68% city similarity means the template cannot be trusted to differentiate them on its own. Measure similarity before publishing; reject anything above 35%.

### Tier 4 — Structural additions

| New URL | Why |
|---|---|
| `/services/brands` | Brand hub. Lifts 15 tail brand pages from depth 3 to 2. |
| `/services/toshiba-tv-repair-{4 cities}` | Toshiba is advertised on the homepage with no page behind it. |
| `/pricing` | Transparent charges page — strong AEO target and a conversion asset. |
| `/reviews` | Consolidates testimonials; route review generation to the GBP. |
| `/llms.txt` | AI crawler guidance. |

### Deliberately not recommended

- **Splitting `oled-qled-tv-repair-{city}` into separate OLED and QLED pages.** The research shows 8 such clusters but all at zero measured volume, and it would add 8 pages at ~68% similarity to an axis that is already the site's weakest. Keep them combined.
- **Competitor comparison pages** for `urban clap tv repair delhi` / `urbanclap tv repair delhi`. The intent is real but navigational — searchers want UrbanClap. Low return, some brand risk.
- **More brand-by-city pages beyond Toshiba.** 40 already exist at 45% intra-cohort similarity. Deepen before widening.

---

## 11. Prioritized roadmap

### Week 1 — Bugs and blockers (hours of work, sitewide impact)

1. Remove `Disallow: /_next/` from `app/robots.js` — unblocks every image and all CSS/JS.
2. Fix `siteConfig.logo` to `siteConfig.defaultOgImage` in `app/blog/[slug]/page.jsx` — repairs broken schema on 4 pages.
3. `noindex` or delete `/landing`, and remove it from the sitemap.
4. Add `lastModified` to `app/sitemap.js`.
5. Trim the 25 over-length titles and 8 over-length descriptions.

### Week 2 — Linking and trust

6. Add a footer "Popular Locations" column (4 city pages plus near-me).
7. Link blog articles from their matching service pages.
8. Build `/services/brands` and fix the homepage brand strip (add Toshiba pages or remove Toshiba).
9. Rewrite `/about` with real people, credentials and the existing workshop photos.
10. Replace the generic "Delhi NCR" map embed with the real GBP embed.

### Weeks 3–4 — AEO foundation

11. Add `datePublished` / `dateModified` to all articles, plus visible "Last reviewed" dates.
12. Add `sameAs` and an `@id` entity graph to the `Organization` / `LocalBusiness` schema.
13. Add `directAnswer` to the 5 parent service pages.
14. Publish `/llms.txt`.

### Month 2 — Content

15. Tier 1: 5 per-city cost pages with real price tables.
16. Tier 2: 6 symptom pages with cause tables.

### Month 3 — Differentiation (the one that actually moves rankings)

17. Rewrite the 4 `tv-repair-{city}` pages and the 4 `led-tv-repair-{city}` pages with genuinely city-specific content. Re-measure similarity; target under 35%.
18. Only then ship Tier 3 locality pages, gated on real job data.

---

*Measurements in this document are reproducible: `next build`, `next start -p 3099`, then crawl all URLs in `sitemap.xml`.*
