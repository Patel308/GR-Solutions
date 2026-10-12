# GR Solution redesign: Phase 5 verification report

Status: **Phases 0–5 are complete on branch `claude/lucid-brown-1dbtvs`.**
Nothing is merged: merging into `main` deploys the site (GitHub Actions), so
that step is yours.

Everything below was measured on production builds (`next build` +
`next start`) and compared against the pre-redesign baseline from `main` at
`595b6c7` (see `docs/redesign/phase-0-audit.md`).

## At a glance

- **SEO / AIO / GEO: no unapproved change on any of the 108 crawled pages.**
  Titles, meta descriptions, canonicals, robots, Open Graph, JSON-LD,
  sitemap, robots.txt, redirects and llms.txt are identical. All 2,328 H1–H3
  headings keep their text and order, all 6,339 internal links keep their
  URL and anchor text, and 13,120 of the 13,142 body-text blocks are
  unchanged word for word. The other 22 are listed in
  [section 2.3](#23-signed-off-changes); they are form labels and one
  capitalisation fix.
- **Speed: mobile Lighthouse is at or better than the old site on the five
  reference pages** (details in [section 3](#3-speed)). Page weight dropped
  by 8–33%.
- **Accessibility: Lighthouse accessibility 90–95 → 98–99.** 16 of 16
  keyboard checks pass. The one remaining automated finding is heading order
  from the H4 headings you asked me not to change (decision D13).
- **Conversion:** sticky Call / WhatsApp / Book Visit bar on phones, calls
  to action in the first screen, a short callback form with inline
  validation, prefilled WhatsApp messages and GA4 events. The Book Visit
  button was tested end to end ([section 6](#6-forms-book-visit-and-tracking)).
- **Needs you:** see [section 7](#7-still-open-your-decisions).

## 1. What shipped

| Commit | What it does |
| --- | --- |
| `29f372a` | Next.js 16.2.9 → 16.4.0, React 19.2.7, exact pinned versions (D19). Zero content diff. |
| `a3f8d62` | Design system: colour tokens, type scale, spacing, component classes, self-hosted heading font. |
| `d02062e` | Shared components: native accordion FAQ, tables that stack into cards on phones, trust strip, Google rating, CTA blocks, service drawings. |
| `3c80545` | Mobile conversion: sticky action bar, accessible header and menu, one lead form for every capture point, Quick Enquiry dialog, GA4 events. |
| `4c58221` | Home page. |
| `82253b4` | Service, city, brand and locality templates (79 pages). |
| `3430477` | Blog index and blog posts. |
| `9f59ed0` | About, contact, pricing, reviews, services, brands, privacy, terms, 404, landing. |
| `0238bd9` | `docs/design-system.md`. |
| `de54228` | AVIF images with WebP fallback. |
| `4a04262` | Speed fixes that keep mobile LCP at or below the baseline. |
| `b2582f6` | Book Visit: visit requests are labelled and ask for the service area. |
| `79806fe` | SEO diff tool: signed-off changes reported separately. |
| `d32fab5` | Accessibility and tap-target fixes from this audit. |

## 2. SEO, AIO and GEO checks

### 2.1 Method

`tools/seo-audit/crawl.mjs` fetched every sitemap URL plus `/landing` and a
404 probe from a production build and recorded the head tags, every heading,
every link with its anchor text, every image with filename and alt text, all
JSON-LD, the visible text, NAP occurrences and invariant checks.
`diff.mjs` compared that with the baseline snapshot. A second, rendered crawl
(Chromium, after JavaScript) confirmed that nothing depends on JavaScript.

### 2.2 Results

| Check | Result |
| --- | --- |
| Pages crawled | 108 (106 from the sitemap, `/landing`, 404 probe) |
| Title, meta description, canonical, robots | identical on 108 / 108 |
| Open Graph / Twitter tags | identical on 108 / 108 |
| JSON-LD | identical on 108 / 108 |
| sitemap.xml, robots.txt, llms.txt, redirects | identical |
| H1–H3 headings | 2,328 / 2,328 same text, same order; exactly one H1 on every page |
| Internal links | 6,339 / 6,339 kept with the same anchor text |
| Body text | 13,120 / 13,142 blocks unchanged word for word (the 22 others are in 2.3) |
| FAQ text vs FAQPage schema | 0 mismatches (98 pages have FAQ schema) |
| Visible breadcrumb vs BreadcrumbList | same as before (73 pages match) |
| Answer-first summary as first block after the H1 | 64 pages unchanged; on the 44 brand pages it now comes first (D15) |
| NAP: phone links, visible numbers, schema telephone | unchanged on 108 / 108 |
| Server HTML vs rendered page | identical content; only Google Analytics' script appears after load, as before |
| Image filenames and alt text | unchanged, except the stock images in 2.3 |
| Main-content word count | 142,452 → 150,568 (+5.7%, additions only) |

Result of the diff with the signed-off rules applied: **0 violations**, 1,450
approved items, 52 items for review (2.4), 709 informational (for example
image loading attributes). Full report:
`tools/seo-audit/reports/current/seo-diff.md` after a fresh crawl (see 8).

### 2.3 Signed-off changes

These are the only removals or edits, each matched by a rule in
`tools/seo-audit/approved-changes.json`:

| Change | Where | Why |
| --- | --- | --- |
| Old form labels replaced: FULL NAME, PHONE NUMBER, SELECT BRAND, ISSUE SUMMARY, PROCEED TO BOOKING; Name, Phone, Service Required, Select service, Message, Send Enquiry | Quick Enquiry dialog (all pages), home and landing forms | Report §9 "Callback form", approved with "implement everything". |
| Stock photos replaced: the same technician photo on service cards → one drawing per TV type (alt text kept); team "lab" photos → real workshop photos; stock customer headshots removed | Home, landing, /services, service pages, /about, /reviews | Brief, Phase 3. |
| "oled/qled tv repair" → "OLED/QLED TV repair" (and LED, LCD, plasma, curved) in one sentence | 5 service pages | D18. Headings, FAQs and schema with the same lower-case text were left alone (see 7). |
| Summary box moved directly under the H1 | 44 brand pages | D15. Text unchanged. |

Site-wide additions with their own rules: sticky action bar, skip link,
footer map link and WhatsApp button, the new form fields, the trust strip and
Google rating, the call/WhatsApp blocks, and the blog "On this page" list.

### 2.4 Additions for review (52 items on 27 pages)

All additive; nothing was removed:

- **Related guides** under each blog post: links to three other guides with
  their existing titles and descriptions.
- **"On this page"** links on blog posts repeat the post's own H2 texts.
- **Blog index cards** show the date and reading time, or "Service guide"
  for the six cards that link to service pages (D16).
- **Home**: "How it works" steps, price teaser (the same ranges as
  /pricing), links to /pricing and /services/brands, Google review quotes.
- **Images added**: the per-type drawings and the About drawing, all with
  descriptive alt text; two real workshop photos on the home page.
- **Reviews**: initials avatars (AS, PV, RM) in place of stock photos.
- **Contact and pricing**: call / WhatsApp / "Book a visit" buttons in the
  hero.

### 2.5 New wording for your sign-off

New interface text (79 distinct strings). It restates promises the site
already made; no new claims. Strings shown on many pages:

| Pages | Text |
| --- | --- |
| all | Book Visit · Call · WhatsApp · Skip to content · Open in Google Maps |
| all (form) | Phone number · Your name (optional) · What's wrong? (optional) · Choose the closest match · No picture but sound works · TV won't turn on · Lines or spots on screen · Dim or flickering picture · No sound · Restarting or stuck on logo · Cracked or damaged screen · Smart TV, apps or Wi-Fi · Something else · Service area · Request a callback · We only use your number to call you back about your TV. |
| 87 | Not sure what's wrong with your TV? Talk to a technician. Diagnosis is free and you approve the price before any paid work. |
| 86 | Doorstep service — Delhi, Noida, Greater Noida & Ghaziabad · 90-day service warranty — Where applicable, explained before work · Genuine or compatible parts — Chosen with your approval · 4.9 on Google · 9 reviews |
| 12 | Want a firm figure for your TV? Book a doorstep diagnosis and approve the price before any paid work. |
| 15 | On this page · Related guides |
| dialog | Doorstep visit request (shown when Book Visit opened the form) |

Home only: "How it works"; "Call, WhatsApp or book online / Tell us the TV
brand, screen size and what is going wrong."; "Free doorstep diagnosis / The
technician finds the part that failed and gives you a firm estimate.";
"Approve, then we repair / No paid work starts until you approve it.
Warranty terms are explained first."; "Typical repair costs in Delhi NCR /
Know the likely price before the technician arrives. / Market ranges
including part and labour, from the smallest to the largest screens.
Diagnosis is free and you get a firm figure before any paid work."; "See the
full price guide"; "Find your brand"; "From our Google reviews"; "Read all
reviews on Google". Landing only: "Firm estimate before any paid work",
"90-day service warranty where applicable".

The diagnosis, warranty and parts lines depend on the facts still open in
D2, D7 and D8 (section 7); they repeat what the site already says.

## 3. Speed

### 3.1 Mobile Lighthouse

Lighthouse 13.5, default mobile settings (simulated slow 4G, 4× CPU
slowdown), Google Analytics blocked so runs are comparable.

**Phase 0 baseline (old site) vs final (new site), median of runs:**

| Page | Perf old → new | LCP old → new | FCP | CLS | A11y old → new | Weight old → new |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 95 → 97 | 2.9 s → 2.6 s | 1.5 s → 1.5 s | 0 → 0 | 90 → 99 | 443 → 299 KB |
| Service (OLED/QLED) | 98 → 99 | 2.3 s → 2.1 s | 1.5 s → 1.5 s | 0 → 0 | 94 → 98 | 317 → 288 KB |
| City (Noida) | 96 → 96 | 2.7 s → 2.7 s | 1.5 s → 1.5 s | 0 → 0 | 94 → 99 | 327 → 298 KB |
| Blog index | 96 → 96 | 2.7 s → 2.7 s | 1.5 s → 1.5 s | 0 → 0 | 94 → 98 | 329 → 301 KB |
| Blog post | 97 → 97 | 2.5 s → 2.5 s | 1.5 s → 1.5 s | 0 → 0 | 95 → 99 | 363 → 297 KB |

Lighthouse's simulated LCP moves by up to ±0.5 s between batches on the same
build on this machine (the old site measured 2.0–2.7 s on the city page in
three batches), so small differences in either direction are noise.

Raw summaries: `tools/seo-audit/reports/phase-5/lighthouse/` (new) and
`tools/seo-audit/reports/phase-5/lighthouse-baseline-rerun/` (old site,
re-measured the same day).

### 3.2 What made it fast

- **One heading font file of 6.8 KB** (Plus Jakarta Sans 800, trimmed to the
  characters the site uses), preloaded. Body text uses the device's own font
  (Roboto on Android, San Francisco on iPhone), exactly as the old site did.
- **D20 changed after measuring.** Inter for body text (the approved D20
  option) added four font files that load before the largest text paints
  and pushed mobile LCP 0.3–0.6 s past the old site. The report's D20 entry
  promised to keep the variant that does not regress, so body text stayed
  on the system font (the D20 alternative). Say the word if you prefer Inter
  anyway; it is a one-file change.
- **AVIF images** with WebP fallback (the hero is 43% smaller).
- **Right-sized images**: every image has `sizes`, so phones download a
  640–750 px file instead of 1,920 px.
- **Hero photos on service, city, brand and blog pages** are preloaded at
  high priority on desktop only, where they are the largest element; on
  phones they sit below the fold and load at low priority.
- No new JavaScript libraries; the redesign ships 9 KB less JavaScript than
  before.

## 4. Responsive check

`tools/seo-audit/screenshots.mjs` at 360, 390, 414, 768, 1280 and 1440 px on
the five reference pages and /contact (36 measurements,
`reports/phase-5/responsive/responsive.md`):

- No horizontal scrolling at any width.
- CLS 0 everywhere.
- H1 is 32 px on phones (1–4 lines depending on the title), 50–52 px on
  desktop; no H1 takes more than 18% of a phone screen.
- A call button is inside the first screen on home, service, city and
  contact pages at every width. Blog pages rely on the sticky bar on phones
  and the header on desktop.
- The sticky bar hides while a form or the footer is on screen and while
  the keyboard is open, so it never covers a submit button or the NAP
  (tested on /contact).
- Tap targets: every button and link list is at least 48 × 48 px on phones
  and tablets. The exceptions are the skip link (invisible until focused)
  and two links inside sentences (blog byline, "See sources and method"),
  which WCAG exempts.

## 5. Accessibility

axe-core (WCAG 2.2 AA plus best practices) on 14 templates at 390, 1024,
1280 and 1440 px: the only finding is **heading-order**, caused by the H4
footer column titles and home feature titles sitting under H2s. Changing
them changes heading tags, which the guardrails freeze (D13, open).

Keyboard checks (scripted, all pass):

1. Skip link is the first Tab stop, visible, and moves focus to the content.
2. Mobile menu opens from the keyboard, keeps focus inside, Esc closes it
   and returns focus to the toggle.
3. Services dropdown opens from its button; Esc closes it and keeps focus.
4. FAQ items open and close with Enter and Space.
5. Book Visit and Quick Enquiry open the dialog with focus in the phone
   field; focus never reaches the page behind it; Esc closes it and returns
   focus to the button that opened it.
6. Submitting an empty form shows the error next to the phone field and
   moves focus there.
7. The sticky bar never covers the contact form's submit button or the
   footer.

## 6. Forms, Book Visit and tracking

Every form (Quick Enquiry dialog, Book Visit, contact page, home and landing)
posts to the existing FormSubmit inbox `kamleshg9569@gmail.com` with a copy
to `deepeshpatelinfinix@gmail.com` (`data/siteConfig.js`). The emails include
the page and whether the visitor came from an ad or search.

Book Visit was tested end to end in a browser with the FormSubmit request
intercepted (no real email sent): the dialog opens with a "Doorstep visit
request" badge, the request goes to the address above with `_cc`, subject
"New doorstep visit request (Book Visit)", `source: Book Visit button`, the
phone number normalised to 10 digits, the area, page and channel, and the
thank-you message appears. Note that `info@grsolution.co.in` does not
receive form emails; say if it should.

GA4 / GTM events (see `docs/design-system.md`): `click_call`,
`click_whatsapp`, `cta_click`, `form_start`, `form_submit`, each with the
page path and section. The existing `generate_lead` and `phone_call_click`
events are unchanged.

## 7. Still open: your decisions

| # | Decision | Status |
| --- | --- | --- |
| D1 | Which phone number is the NAP. Pages still show +91 93155 15700 (search) and +91 99902 83890 (ads, home, landing, schema) as before. | Unchanged; needs your call. |
| D2, D4, D7, D8 | Exact wording of "free diagnosis", visit/callback times, warranty terms, parts. | Copy unchanged; the trust strip repeats today's wording. |
| D3, D5, D6, D9 | "24/7", "#1", "15+ years / 15,000+ customers", "laboratory" claims. | Copy unchanged. |
| D10 | Are Amit Sharma, Priya Verma and Rahul Mehta real customers? | Their stock photos are removed; names and quotes kept until you confirm. |
| D11 | Real photos (shot list in `docs/design-system.md`). | Drawings stand in on the About hero and service cards. |
| D13 | H4 footer/feature titles (axe heading-order). | Unchanged; needs approval to change heading tags. |
| D16a | Blog "Featured" card links to a service page, not a post. | Kept. |
| D18 (rest) | Lower-case service names inside some H3s, FAQs and city summaries ("Safe handling for led tv repair"). | Not changed: they are frozen headings, FAQ schema and summaries. Approve and I will fix them with the schema. |
| D20 | Inter for body text cost 0.3–0.6 s of mobile LCP. | System font used instead; confirm. |
| Copy | New wording in 2.5. | Please confirm or edit. |

## 8. Re-running the checks

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0RQ8C75FPT npm run build && npx next start -p 3100 &
cd tools/seo-audit && npm ci
node crawl.mjs --base http://127.0.0.1:3100 --out snapshots/current --rendered
node diff.mjs --base snapshots/baseline --head snapshots/current --out reports/current/seo-diff.md
node lighthouse.mjs --base http://localhost:3100 --out reports/current/lighthouse --runs 5
node screenshots.mjs --base http://localhost:3100 --out reports/current/responsive
```

`diff.mjs` exits with an error if anything frozen changes that is not in
`approved-changes.json`.
