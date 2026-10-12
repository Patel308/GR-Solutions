# GR Solution redesign: Phase 0 audit, baseline and plan

> Update: the redesign is complete; results, open decisions and the final
> checks are in [`phase-5-report.md`](phase-5-report.md).

Status: **Phase 0 complete. No UI has been changed.** The baseline was taken
from a production build of `main` at commit `595b6c7` (same as this branch's
base). Everything below is measured, not estimated, unless marked otherwise.

Contents

1. [Stack](#1-stack)
2. [How the baseline was taken](#2-how-the-baseline-was-taken)
3. [SEO / AIO / GEO baseline](#3-seo--aio--geo-baseline)
4. [Mobile Lighthouse baseline](#4-mobile-lighthouse-baseline)
5. [Mobile UX audit](#5-mobile-ux-audit)
6. [Trust and credibility audit](#6-trust-and-credibility-audit)
7. [Accessibility, performance and code findings](#7-accessibility-performance-and-code-findings)
8. [Decisions I need from you](#8-decisions-i-need-from-you)
9. [Copy proposals for approval](#9-copy-proposals-for-approval)
10. [Redesign plan, Phases 1–5](#10-redesign-plan-phases-15)

---

## 1. Stack

| Area | What it is |
| --- | --- |
| Framework | Next.js **16.2.9** (App Router, Turbopack build), React 19.2.7, plain JavaScript (no TypeScript). `package.json` asks for `"latest"`; the lockfile pins the versions above. |
| Rendering | Fully static: 112 prerendered routes (`○`/`●` SSG via `generateStaticParams`), one dynamic route (`/api/health`). `sitemap.xml`, `robots.txt` and `llms.txt` are generated from the same data files as the pages. |
| Content | Data-driven: `data/*.js` (5 services, 25 city pages, 7 locality pages, 44 brand × city pages for 11 brands, 15 blog/guide articles, pricing, testimonials). Templates in `app/` and `components/`. |
| CSS | Tailwind CSS 3.4.19 **with preflight disabled**, plus a small `app/globals.css` (legacy CSS variables, two CSS marquees). Many inline `style={{}}` blocks remain on the home page. Icons are a self-hosted Font Awesome subset rendered as CSS masks (`app/icons.css`). |
| Fonts | **No web fonts are loaded.** CSS asks for `Inter, "Segoe UI", Arial`, but Inter is never downloaded, so Android shows Roboto, iPhone shows Helvetica/Arial and Windows shows Segoe UI. |
| Images | `next/image` with default settings: WebP only (no AVIF), mostly fixed `width`/`height` with 1x/2x density `srcset` and no `sizes`. Source files are in `public/images` and `public/assets`. |
| Forms | Client components posting with `fetch` to FormSubmit (`formsubmit.co/ajax/…`), no page reload. |
| Analytics | GA4 `G-0RQ8C75FPT` via `gtag.js` loaded `afterInteractive` (`components/CallTracking.jsx`). One delegated listener sends `generate_lead` (+ `phone_call_click` to `dataLayer`) on every `tel:` click, with `call_location` and `lead_channel`. No GTM container and no ad pixels are installed. |
| Phone numbers | Two number sets (`data/siteConfig.js`, `components/ContactChannel.jsx`): **ads** `+91 99902 83890` on `/` and `/landing` (and after any paid click), **SEO** `+91 93155 15700` on every other page. Schema and `llms.txt` always use `+91 99902 83890`. See decision **D1**. |
| Hosting / CI | Docker image (`next start`) on a Hostinger VPS behind Caddy. GitHub Actions on push to `main`: lint, build, push image, deploy, health check. Pushing this feature branch does **not** deploy. |

## 2. How the baseline was taken

New tooling lives in `tools/seo-audit/` (own `package.json`; it is not linted,
not bundled and now excluded from the Docker build context). See its
[README](../../tools/seo-audit/README.md).

- **Crawler** (`crawl.mjs`): crawls all **106 sitemap URLs** + `/landing` + a 404
  probe and saves one JSON per page under `tools/seo-audit/snapshots/baseline/`
  with title, meta description, canonical, robots, OG/Twitter, H1–H6 in order,
  every link with anchor text and region (header/main/footer), every image with
  filename/alt/size/loading, all JSON-LD, the visible copy (as text runs), main
  word count, NAP occurrences and invariant checks. It also snapshots
  `robots.txt`, `sitemap.xml`, `llms.txt` and all 40 redirects.
- **Diff** (`diff.mjs`): grades every difference as VIOLATION / REVIEW / INFO and
  exits non-zero on violations. Verified: two independent crawls diff to
  **zero** differences, so Phase 5 noise will be zero.
- **Lighthouse** (`lighthouse.mjs`): Lighthouse 13.5.0, default mobile config
  (Moto G Power, simulated slow 4G 150 ms / 1.6 Mbps, 4× CPU), 3 runs per page,
  median run reported.
- **Responsive audit** (`screenshots.mjs`): Chromium at 360, 390, 414, 768, 1280
  and 1440 px; measures overflow, H1 size, fold position of CTAs, overlays, tap
  targets and CLS.

**Limits you should know about**

- The live site (`grsolution.co.in`), Google Analytics/Tag Manager, Google
  Maps and `share.google` are **blocked by this session's network policy** (to
  allow them, add those hosts in the environment's network settings), and the
  PageSpeed Insights API refused keyless requests (429). So the baseline is a
  local production build, and Lighthouse runs with GA blocked. Both
  before and after are measured the same way, so comparisons are fair, but
  absolute numbers are lab numbers with a ~10 ms server response. Field data
  (CrUX / Search Console Core Web Vitals) still needs checking on your side.
- I could not verify the Google rating or review count (see **D10**).

## 3. SEO / AIO / GEO baseline

Healthy foundations; nothing here is broken.

| Check | Result |
| --- | --- |
| Status codes | All 106 sitemap URLs return 200. `/landing` 200 with `noindex, follow` (correct). Unknown URLs return a real 404. |
| Redirects | All 40 legacy redirects return 308 to the right target, including `www → apex`. |
| H1 | Exactly one H1 on all 108 crawled URLs. |
| FAQ parity | **742 FAQ Q&As** sitewide; every question and answer is visible word for word and matches its `FAQPage` schema. |
| Content in HTML | Raw server HTML vs post-hydration DOM differ only by the GA script tag. **All content is server-rendered.** |
| JSON-LD | Layout: Organization, LocalBusiness+ProfessionalService, WebSite on every page. Service+BreadcrumbList+FAQPage on 81 service/city/brand/locality pages; BlogPosting+BreadcrumbList+FAQPage on 15 articles. All parse cleanly. |
| Answer-first summary | First content block after the H1 on home, services, city, locality, blog posts, pricing and about. **Not on the 44 brand pages**: the hero intro comes first and the summary box sits in the next section (**D15**). |

Pre-existing inconsistencies (recorded, not changed):

- **Visible breadcrumb ≠ BreadcrumbList** on `/about`, `/blog`, `/contact` (no
  visible breadcrumb) and on all city/locality pages (shorter visible labels,
  and city hubs show an extra "TV Repair Services" hop that schema lacks). Google
  tolerates label differences; I'd align them later only with your OK.
- A hidden **"Quick Enquiry" `<h2>` precedes the H1 on every page** (the enquiry
  modal is always in the HTML) (**D13**).
- **Home repeats each service card 3×** (desktop marquee renders the list twice
  + mobile grid): 15 service `<h3>`s for 5 services (**D14**).
- 404 page carries two robots metas (`noindex` and `index, follow`); harmless
  because it returns 404.

## 4. Mobile Lighthouse baseline

Saved in `tools/seo-audit/reports/phase-0/lighthouse/summary.{md,json}`.

| Page | Perf | A11y | Best Pr. | SEO | FCP | LCP | TBT | CLS | Weight | LCP element |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home `/` | 95 | 90 | 96 | 100 | 1.5 s | **2.9 s** | 34 ms | 0 | 443 KB | header logo (hero copy fades in from `opacity: 0`) |
| Service `/services/oled-qled-tv-repair` | 98 | 94 | 100 | 100 | 1.5 s | 2.3 s | 36 ms | 0 | 317 KB | summary paragraph |
| City `/services/tv-repair-noida` | 96 | 94 | 100 | 100 | 1.5 s | **2.7 s** | 28 ms | 0 | 327 KB | summary paragraph |
| Blog index `/blog` | 96 | 94 | 100 | 100 | 1.5 s | **2.7 s** | 37 ms | 0 | 329 KB | H1 |
| Blog post `/blog/tv-repair-cost-delhi` | 97 | 95 | 100 | 100 | 1.5 s | **2.5 s** | 53 ms | 0 | 363 KB | summary paragraph |

Perf scores across the three runs: home 99/97/95, service 98/96/98, city
96/98/98, blog 95/96/97, post 97/97/96.

What this means for the budget:

- **4 of 5 pages already miss the LCP < 2.5 s target in the lab.** LCP is text on
  every page except home, so the lever is render delay and JS, not images. The
  redesign has to *improve* LCP, not just hold it.
- Failing audits: `color-contrast` (all 5), `heading-order` (all 5),
  `select-name` (home), `image-aspect-ratio` (home: the hero photo is displayed
  368×560 from a 1:1 file, i.e. visibly squashed).
- Biggest perf opportunities: ~26 KB unused JS (framework), 38–90 KB of
  oversized images per page (no `sizes`, so phones download the 2× / 1920 px
  variant), render-blocking CSS (12 KB).

## 5. Mobile UX audit

Saved in `tools/seo-audit/reports/phase-0/responsive/responsive.{md,json}`.
Screenshots: [mobile 390 px](phase-0/before-mobile-390.jpg) ·
[desktop 1440 px](phase-0/before-desktop-1440.jpg).

**What works:** no horizontal scroll at any of the 6 widths; CLS 0; sticky
header with a Call button; good, specific long-form content.

**What hurts conversion**

| Problem | Evidence (390 × 844 unless noted) |
| --- | --- |
| H1 far too large | Home 51 px / 5 lines; blog index 48 px / 6 lines = **45 % of a 360 px screen** (66 % at 1440 px). Blog post 43 px / 4–5 lines. |
| CTAs below the fold | First in-content CTA: home 827 px (cut off by the fold), service 1015 px, contact 1621 px, blog post **9,584 px**, blog index **18,877 px**. Only the city page has one above the fold. |
| Very long pages, no CTA en route | Page height: home 19.4k px, service 16.2k, city 25.7k, blog 21.3k, post 14.3k. Between hero and footer there is usually one CTA block. |
| Floating buttons cover copy | Two 54 px circles (54×120 stack) fixed bottom-right overlap paragraph text on every page. |
| Wasted space | ~96–120 px empty padding above every hero on phones; large empty gaps in the footer. |
| Price tables hide prices | On phones the 4-column price table shows *Fault* + *32"–43"* only; the 44–55" and 56"+ prices sit behind an unmarked horizontal scroll. |
| FAQ answers cut off | The accordion caps open answers at 240 px. At 360 px, **6 of 30 tested answers are clipped mid-sentence** (e.g. "Should I repair or replace my TV?" shows 240 of 426 px). Text is still in the DOM, so SEO is unaffected, but users can't read it. |
| Body text | 18–18.9 px, line-height 1.63–1.75 (brief: 16–17 px / 1.6). Muted grey #6E6D7A passes AA (5.1:1). |
| Tap targets | 26–47 interactive elements per page under 48 px: header Call pill 40 px, menu 40×40, "View Service" buttons 44 px, many footer links 20–24 px. |
| Borders that never render | With preflight off, every `border`/`border-2` class without `border-solid` draws **no border**: outline buttons ("Explore Services", "Book Service") look like plain white pills. Native `<button>`s (FAQ questions) keep the browser's dark default border. |
| Forms far down | The /contact booking form starts **2,049 px** down on a 390 px phone; the home callback form at **11,739 px**. |
| Small details | `Call Now` icon touches its text on service heroes; visible copy "Explore city-specific guidance for oled/qled tv repair" is lowercased by code. |

## 6. Trust and credibility audit

| Item | Finding |
| --- | --- |
| Hero, team, service and testimonial images | All are **1024×1024 squares** (`hero.webp`, `team.webp`, `service_*.webp`, `assets/customer_testimonial_*_<timestamp>.webp`): the typical output size of an AI image generator, and they look staged (luxury apartment, six-person lab team). |
| "Meet Our Expert Repair Team" and "Why Delhi, Noida & NCR Trusts" | Both use the same `team.webp`. |
| "Explore More Services" cards | LED, LCD and Plasma all use `service_tv.webp` (same technician photo). Only 2 distinct images exist for 5 services. |
| Real workshop photos | Only three: `workshop-repair-bench.webp` 1200×900, `workshop-tv-diagnosis.webp` 720×960 and `workshop-interior.webp` **141×118 px** (shown ~400 px wide on /about, so it is blurry). These are the most credible assets on the site. |
| Testimonials | "Amit Sharma", "Priya Verma", "Rahul Mehta" with stock-style headshots, on home and /reviews. Their names are `<h3>`s on the home page. The /reviews page also has 3 verbatim Google quotes (no names) and a "4.9 ★ from 9 Google reviews, Sept 2026" snapshot. |
| Contradicting or unverifiable claims | Listed with file references in **D2–D9** below. |

## 7. Accessibility, performance and code findings

Accessibility

- Contrast failures: white on WhatsApp green #25D366 = **1.98:1** (every CTA
  block); "CALL US NOW"/"EMAIL US" labels #94A3B8 on #F8FAFC = 2.45:1. Logo teal
  #1997AD is 3.46:1 on white: fine for icons and large text, not for body text.
- Heading order fails on every page: footer column titles and home feature
  items are `<h4>` directly under `<h2>` (**D13**).
- Home booking form labels aren't associated with their inputs (`select-name`).
- Desktop "Services" dropdown opens on hover only, so keyboard users can't
  reach it. The mobile menu closes on Esc but has no focus trap, doesn't move
  focus and leaves the page behind it tabbable.
- The enquiry modal has no dialog role, focus handling or Esc support.
- FAQ buttons have no `aria-expanded`/`aria-controls`.

Performance

- Home hero photo: no `fetchpriority`, no `sizes` (phones fetch `w=1920`), and
  distorted. The same `hero.webp` is also an un-lazy CSS background further down.
- Hero copy animates in from `opacity: 0`, which hides it from LCP and delays
  the first meaningful paint of the H1.
- Two infinite CSS marquees (services, brand names) duplicate DOM and run
  constantly (they do respect `prefers-reduced-motion`).
- JS: ~167 KB transferred per page, mostly the Next.js/React runtime; Header,
  FAQ and both forms are client components.

Code / security

- **Next.js 16.2.9 has 17 published advisories, 3 of them critical**, including
  *RCE in the Image Optimization API when AVIF files are used* (fixed ≥ 16.3.3)
  and *SSG cache poisoning in self-hosted apps* (fixed ≥ 16.3.8). Your brief asks
  for AVIF, so **the upgrade must happen before AVIF is enabled** (**D19**).
  `npm audit` also flags postcss, sharp, nanoid and source-map-js.
- `package.json` uses `"latest"` for next/react/react-dom; pin exact versions.

## 8. Decisions I need from you

Per your rules I have changed nothing. Items marked **blocking** must be
answered before the phase that needs them.

### Guardrail conflicts

**D1. Which phone number is the NAP? (blocking for Phase 2)**
Your guardrail says NAP must be identical everywhere with `+91 99902 83890`
and `tel:+919990283890`. The site deliberately shows `+91 93155 15700` (SEO
line) on **105 of the 106 sitemap pages** (every page except home), in visible
text, `tel:` and `wa.me` links. Only `/` and `/landing` show `+91 99902 83890`,
and JSON-LD says `+91 99902 83890` everywhere. That split shipped in the last merged commit (`8ab9fae`). Options:

- **(a) Recommended:** keep the ads/SEO split on *action buttons* (sticky bar,
  CTAs: attribution keeps working), but show `+91 99902 83890` in every *NAP
  block* (footer, contact page, about facts table) so the visible NAP matches
  schema and your Google Business Profile.
- (b) Single number `+91 99902 83890` everywhere. GA4's `lead_channel` still
  records ads vs organic *clicks*, but not calls.
- (c) Keep today's behaviour. This conflicts with guardrail 8.

**D12. Section order.** Your Phase 4 orders reorder H2s on home and
service pages and add sections (trust strip, how it works, price teaser, price
guide, CTA blocks). That conflicts with guardrail 3 (H2/H3 order unchanged).
Recommended: approve the reorder for the home and service/city templates (the
diff will prove the text is unchanged), and build new blocks *without* heading
tags unless you approve the heading text.

**D13. Heading-level fixes for accessibility.** (a) Footer column titles and home feature
items are `<h4>` under `<h2>`, which fails `heading-order` on every page. I'd change
them to non-heading elements (or to `<h3>` if you prefer). (b) Render the
enquiry modal only when it's opened, which removes the "Quick Enquiry" `<h2>`
that precedes every page's H1. Both change heading tags, so I need your OK.

**D14. Remove the duplicated home service cards.** Your no-carousel rule
means a static grid, which removes 10 duplicate `<h3>` + image entries (15 → 5).
It's an SEO improvement, but it changes the H3 list.

**D15. Brand pages (44):** move the existing summary box directly under the
H1, as on every other template. Text unchanged, order changed.

**D16. Blog index.** (a) The "Featured" card isn't a blog post (it links to
the OLED service page; H2 "OLED/QLED Television Repair Needs Careful
Diagnosis"). Featuring a real article would change that H2. Keep it or replace it?
(b) Cards gain read time + date (new visible text). (c) 6 of the 21 cards are
service pages styled as posts; I'd keep them but label them "Service guide".

**D17. Blog post additions:** a "Quick answer" label on the summary card, a
table of contents ("On this page", jump links to existing H2s), in-article
CTAs, and "Related guides" (new internal links and headings). OK to add?

**D18. Visible copy bugs:** fix "oled/qled tv repair" capitalisation
(generated by `.toLowerCase()` on service pages)?

### Facts to confirm (copy changes need your answer)

| # | Claim | Where | Question |
| --- | --- | --- | --- |
| **D2 (blocking)** | "Free diagnosis" (header, about, pricing, cost guides, llms.txt) vs "Visit and repair charges depend on location…" and "inspection-based" | `components/Header.jsx:239`, `app/about/page.jsx:30,48`, `data/costGuides.js:117`, `data/blogArticles.js:58,262`, `app/layout.jsx:79` | Is the doorstep visit + diagnosis **₹0 everywhere**? Free only if you go ahead with the repair? Any surcharge for Greater Noida or far sectors? I'll state it identically everywhere. |
| D3 | "24/7 Priority Hotline" vs hours "Mon–Sun 9 AM–9 PM" (footer, contact, schema) | `app/page.jsx:433`, `components/Footer.jsx:134`, `data/siteConfig.js:48` | Is there any out-of-hours line? If not I'll propose replacing "24/7". |
| **D4 (blocking)** | "90 Min Response… priority-dispatch" vs FAQ "same-day or next-day depending on availability" and "arranged based on technician availability" | `app/page.jsx:405-408,34,69` | What can you honestly promise? I need (i) visit time, e.g. "same day if booked before 2 PM in East Delhi/Noida", and (ii) callback time for the form ("we'll call you within **X** minutes"). |
| **D7 (blocking)** | "90-day service warranty where applicable"; "Warranty depends on the repair type and parts used" | `app/page.jsx:116,422,46`, `components/HeroSection.jsx:32` | Exact terms for the trust strip: 90 days on parts *and* labour? Which repairs are excluded? |
| D5 | "#1 TV Repair in Delhi, Noida & NCR"; "Delhi, Noida & NCR's #1 premium TV repair service provider" | `app/page.jsx:113`, `components/Footer.jsx:43` | Unverifiable superlatives. Remove, or replace with "4.9★ on Google"? |
| D6 | "15+ years", "15,000+ happy customers". Also the /about **H1** "… 15+ Years of Service" | `app/page.jsx:116,538-542`, `app/about/page.jsx:155-168`, `components/Footer.jsx:43` | Please confirm both figures and give the founding year (it would also fill `foundingDate` in the Organization schema). If wrong, the /about H1 must change (needs approval). |
| D8 | "Genuine parts" (your trust strip) vs FAQ "genuine or high-quality compatible parts" | `app/page.jsx:54` | I'd word it "Genuine or OEM-grade parts, your choice". OK? |
| D9 | "Our laboratory is equipped with state-of-the-art diagnostic tools… panel bonding to chipset reballing… free technical consultation" | `app/page.jsx:340-343` | Accurate? The real workshop photos show a repair bench, not a lab. |
| **D10 (blocking for Phase 3)** | Testimonials "Amit Sharma / Priya Verma / Rahul Mehta" with headshots | `data/testimonials.js:8-24` | Are these real customers who gave permission, and are the photos theirs? If not, I'll remove them (their `<h3>` names leave the home page) and show the real Google quotes. Also confirm today's Google rating and review count (snapshot says 4.9 ★ / 9 reviews, Sept 2026). |
| D11 | Photos | — | Please send: a sharper workshop interior (current is 141×118 px), a technician at a customer's home, a real owner or team photo, and one photo per TV type if possible. Until then I'll use clearly marked placeholder tiles (icon + "photo coming soon" note in code, not on the page) instead of stock images. |

### Engineering choices

- **D19. Upgrade Next.js first (recommended).** A separate commit:
  16.2.9 → 16.4.x, exact pinned versions, then crawler diff (must be zero) and
  Lighthouse re-run before any UI work. Required before AVIF.
- **D20. Fonts.** The site loads no web fonts today, so any font adds bytes.
  Recommendation: **Plus Jakarta Sans** 700/800 for headings + **Inter** 400/600
  for body, self-hosted woff2, Latin subset, `font-display: swap` with
  metric-matched fallbacks (no layout shift). Roughly 90 KB in total (estimate),
  of which only the H1 weight (~22 KB) is preloaded. I'll measure LCP with and
  without the preload and keep the variant that does not regress. The
  alternative is Jakarta for headings + system UI font for body (≈45 KB).
  Inter-only is a third option.

## 9. Copy proposals for approval

New UI text the redesign needs. Wording depends on D2/D4/D7/D10; numbers in
`{}` are placeholders for your answers. None of this ships without your OK.

| Where | Proposal |
| --- | --- |
| Home hero (mobile) | Keep H1 and the existing description unchanged; add a trust line under it: "★ 4.9 on Google · {90}-day warranty · Free doorstep diagnosis" (rating links to your Google Business Profile). Two CTAs: **Call now** · **WhatsApp**. |
| Sticky bar (≤768 px) | **Call** · **WhatsApp** · **Book Visit** (Book Visit opens the 2-field callback form; without JS it links to /contact). |
| WhatsApp prefill | "Hi GR Solution, I need {OLED/QLED TV repair} in {Noida}." Built from the page: service + city where known, else "TV repair in Delhi NCR". |
| Callback form | Fields: **Phone number** (required), **Your name**, **What's wrong? (optional)**: No picture but sound works · TV won't turn on · Lines or spots on screen · Dim or flickering picture · No sound · Restarting or stuck on logo · Cracked or damaged screen · Smart TV / apps / Wi-Fi · Something else. Brand becomes optional. Button: "Request a callback". Success: "Thanks {name}. We'll call you on {phone} within {X} minutes (9 AM–9 PM)." Error keeps today's text. |
| Section CTA block | "Not sure what's wrong with your TV? Talk to a technician. Diagnosis is free and you approve the price before any paid work." + Call · WhatsApp. |
| In-article CTA (blog, after the price summary) | "Want a firm figure for your TV? Book a doorstep diagnosis and approve the price before any paid work." |
| Trust strip | "{90}-day repair warranty" · "Genuine or OEM-grade parts" · "Doorstep service across Delhi NCR" · "4.9★ Google rating". |
| Blog post | "Quick answer" label on the summary card; "On this page" TOC heading; "Related guides". |

## 10. Redesign plan, Phases 1–5

Each item is one small, reviewable commit. After every template commit I'll run
the crawler diff and attach the result, listing any REVIEW item with its
justification. Anything graded VIOLATION is reverted unless you approved it above.

**Phase 0.5: security (needs D19).** Pin and upgrade Next.js; zero-diff check; Lighthouse.

**Phase 1: design system**

1. *Base and tokens:* CSS custom properties (colour, type, space, radius,
   shadow, motion) mapped into the Tailwind theme. Restore sane element defaults
   (border style, button reset, `img { height: auto }`) behind the existing
   classes, so borders render as designed and buttons stop showing browser
   chrome.
   - Colour: brand navy `#0D47A1` stays primary (8.6:1 on white); deep navy
     `#0D0C22` for text; logo teal `#1997AD` as accent for icons/lines with a
     darker teal (≈ `#0E7490`, 5.4:1) for any teal text; neutral slate scale;
     WhatsApp green darkened to ≈ `#15803D` (5.0:1 with white) for filled
     buttons; semantic success/warning/danger/info. Every pair checked for AA.
2. *Fonts (D20)* via `next/font/local`, Latin subset, swap, metric-matched fallback.
3. *Type scale* with `clamp()`: H1 2rem on phones → ~3.25rem on desktop; H2
   1.5 → 2.25rem; body 16 → 17px, line-height 1.6; article measure 68–72ch.
4. *Spacing and sections:* 4/8 px scale; section padding 48 px on phones,
   80–96 px on desktop.
5. *Components:* Button (primary / secondary / ghost / WhatsApp; ≥ 48 px; visible
   focus and pressed states), Card (service / blog / review / link), Eyebrow
   badge, Accordion (native `<details>`: zero JS, no clipping, content stays in
   the HTML), Field / Select with inline validation, Trust strip, Price list
   (one `<table>` that becomes stacked cards on phones with CSS only, so the
   same text and numbers stay in the HTML), Sticky CTA bar, Section CTA.
6. *Docs:* `docs/design-system.md` (tokens, components, do/don't).

**Phase 2: mobile conversion UX**

1. Sticky action bar (≤ 768 px) replacing the floating circles (on desktop
   the header CTAs take over). Body gets bottom padding so nothing is covered,
   and the bar hides only while the footer is in view. `tel:` / `wa.me` links
   follow D1.
2. Contextual WhatsApp message per page (service + city from the route data).
3. Mobile hero: smaller H1, existing summary, trust line, two CTAs inside the
   first screen; the image moves below the CTAs or is cropped small. Remove the
   opacity entrance animation (LCP).
4. Callback form: Phone + Name + optional Issue/Brand, `type="tel"`,
   `inputmode="numeric"`, `autocomplete="tel"`, inline validation, success state,
   no reload, same FormSubmit endpoint and fields.
5. Compact CTA block after major sections on service, city and blog pages;
   in-article CTAs after the price summary and at the end of posts.
6. Price tables become card lists on phones (CSS only, same HTML).
7. Header: logo + call icon + menu on phones; menu with focus trap, Esc,
   `inert` background and focus return; keyboard-accessible desktop dropdown;
   desktop header shrinks on scroll with transform only (no layout shift).
8. Tap targets ≥ 48 px; nothing important in the top corners.
9. GA4 events `click_call`, `click_whatsapp`, `form_start`, `form_submit`,
   `cta_click` (with `page_path`, `section`, `lead_channel`), added to the
   existing listener. **`generate_lead` and `phone_call_click` keep firing**
   because GA4 key events may depend on them.
10. Image delivery: correct `sizes`, `fetchpriority="high"` + preload on the LCP
    image, AVIF after Phase 0.5, explicit dimensions everywhere, lazy below the
    fold.

**Phase 3: trust** (needs D2–D11)

1. Replace AI/stock images in "Meet Our Expert Repair Team", "Why Delhi trusts"
   and related-service cards with the real workshop photos or marked
   placeholders. Each new image gets descriptive alt text, listed in the
   commit notes.
2. Reviews block with the Google rating + verbatim Google quotes + link out.
   Stock headshots and invented names are removed (if D10 confirms).
3. Contradicting claims fixed exactly as you answer D2–D9.
4. Trust strip near CTAs.

**Phase 4: templates** (needs D12–D17). One commit each, in this order:
home → service → city/local (+ locality, brand) → blog index → blog post →
footer → remaining pages (about, contact, pricing, reviews, services, brands,
legal, 404, landing) restyled with no structural change.

**Phase 5: verification**

1. Crawler diff against `snapshots/baseline`: expected result is zero
   VIOLATIONs except approved items, each listed and justified.
2. JSON-LD unchanged byte-for-byte except approved items. Rich Results
   validation must be run by you or from a network that allows Google (it's
   blocked here); I'll provide the URLs.
3. Lighthouse on the same 5 pages: Performance, Accessibility and SEO
   ≥ baseline, target ≥ 90, LCP < 2.5 s in the lab.
4. Responsive audit at 360/390/414/768/1280/1440: no horizontal scroll; the
   sticky bar never covers content or a form submit button.
5. Keyboard + screen-reader pass on header menu, accordion and form (Playwright
   keyboard script + axe).

**Expected, approved-in-principle diff items** (so they don't surprise you in
Phase 5): sticky bar links (`tel:`, `wa.me`, "Book Visit" → `/contact`) on every
page; a "Skip to content" link; new CTA microcopy; TOC jump links on posts;
image changes from Phase 3; any heading/order changes you approve in D12–D17.
