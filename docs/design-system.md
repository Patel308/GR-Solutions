# GR Solution design system

The site's visual language: calm, premium and trustworthy, built for phones
first. Everything here is implemented in `app/globals.css` (tokens and
component classes), `tailwind.config.js` (utilities mapped to the tokens) and
the components listed below.

The redesign changed how pages look, never what they say to search engines.
Before you edit a page, read [Rules for future edits](#rules-for-future-edits).

## Tokens

Colours are CSS custom properties holding RGB channels
(`--c-navy-600: 13 71 161`), so Tailwind opacity modifiers such as
`bg-navy-600/10` work. Use the Tailwind names in markup; use
`rgb(var(--c-…))` only in CSS.

### Colour

| Token (Tailwind) | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `ink` | #0B1B33 | Headings, strong text | 17.2:1 on white, 16.2:1 on surface |
| `body` | #334155 | Body copy | 10.4:1 on white, 9.7:1 on surface |
| `muted` | #475569 | Secondary copy, captions | 7.6:1 on white, 7.1:1 on surface |
| `subtle` | #64748B | Placeholders, white backgrounds only | 4.8:1 on white |
| `navy-600` (`primary`) | #0D47A1 | Brand, links, primary buttons | 8.6:1 on white; white text on it 8.6:1 |
| `navy-700` | #0A3A85 | Hover, text on `navy-50` | 9.7:1 on navy-50 |
| `navy-50` | #EEF4FC | Tinted panels, icon tiles | navy-600 text 7.8:1 |
| `navy-950` | #0A1A33 | Dark panels, footer | white 17.4:1, white/75 about 10.1:1 |
| `teal-700` | #0B7285 | Eyebrows, small accent text | 5.6:1 on white, 5.2:1 on teal-50 |
| `teal-600` (`accent`) | #0E7C90 | Icons, accent text | 4.9:1 on white |
| `teal-400` | #1997AD | Logo teal, decorative lines only | not for text |
| `teal-300` | #5CC8DA | Accent text on dark panels | 8.9:1 on navy-950 |
| `wa` | #0F7A3D | WhatsApp buttons (white text) | 5.4:1 |
| `wa-brand` | #25D366 | WhatsApp icon tint only | never behind text |
| `star` | #D97706 | Rating stars (graphic) | 3.2:1, meets the 3:1 graphic minimum |
| `danger` | #B91C1C | Form errors | 6.5:1 on white |
| `warning` | #B45309 | "Most expensive" price label | 5.0:1 on white |
| `line` / `line-strong` | #E2E8F0 / #CBD5E1 | Borders, dividers | decorative |
| `field` | #74859E | Form field borders | 3.8:1, meets the 3:1 non-text minimum |
| `surface` / `surface-2` | #F5F8FC / #EEF3FA | Tinted section bands | |

Every text and background pair used on the site meets WCAG 2.2 AA (4.5:1 for
text, 3:1 for large text and UI graphics).

### Typography

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| Headings | Plus Jakarta Sans | 800 | `font-display`; one self-hosted file (about 7 KB), preloaded |
| Body, UI | The device's own UI font | 400, 600 | `font-sans`: Roboto on Android, San Francisco on Apple, Segoe UI on Windows; nothing to download |

The heading font is trimmed to the characters the site uses (ASCII plus
© · × – — ‘ ’ “ ” • … ₹ → ★ and a few symbols) with `font-display: swap` and
a metric-matched fallback, so nothing shifts when it loads. Headings that ask
for weight 700 use the 800 face. Licence: `app/fonts/LICENSE-PlusJakartaSans.txt`
(SIL OFL 1.1).

Why no web font for body text: Inter 400/600 (the font approved in D20) was
measured on the five reference pages and pushed mobile LCP 0.3-0.6 s past the
pre-redesign baseline, because every font file loads before the largest text
paints. The performance budget comes first, so body text uses the system font
(the alternative listed in D20). To try Inter again, add it to `app/fonts.js`
and re-run `tools/seo-audit/lighthouse.mjs` against the baseline numbers.

To re-trim the heading font (for example after adding a new symbol to the
copy), run `pyftsubset` from fonttools on the Fontsource Latin file:

```bash
pyftsubset plus-jakarta-sans-latin-800-normal.woff2 --flavor=woff2 \
  --unicodes="U+0020-007E,U+00A0,U+00A9,U+00AE,U+00B0,U+00B7,U+00D7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+20B9,U+2122,U+2192,U+2605" \
  --layout-features="kern,liga,calt,tnum,lnum,case,ccmp,locl,mark,mkmk" \
  --output-file=app/fonts/plus-jakarta-sans-latin-800-normal.woff2
```

Fluid sizes (smallest phone → desktop):

| Element | Size | Line height |
| --- | --- | --- |
| H1 (`text-display`) | 2rem → 3.25rem | 1.1 |
| H2 (`text-h2`) | 1.5rem → 2.25rem | 1.18 |
| H2 inside a card (`heading-panel`) | 1.3125rem → 1.625rem | 1.25 |
| H3 (`text-h3`) | 1.125rem → 1.375rem | 1.3 |
| Lead (`lead`) | 1.0625rem → 1.25rem | 1.6 |
| Body | 1rem → 1.0625rem | 1.65 |
| Article body (`prose-article`) | 1.0625rem → 1.125rem, max 70ch | 1.75 |
| Small (`text-small`) | 0.875rem | 1.5 |
| Eyebrow (`eyebrow`) | 0.75rem, uppercase, 0.08em tracking | 1.2 |

Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.

### Space, shape, depth, motion

- **Container:** `.container`, max 80rem, side padding 1rem (phones), 1.5rem
  (≥640px), 2rem (≥992px).
- **Section rhythm:** `.section` (3rem → 5.5rem vertical), `.section-tight`
  (2rem → 3.5rem). Alternate `band` (white) and `band-tint` (surface); two
  bands of the same colour in a row get a hairline automatically.
- **Breakpoints:** xs 400, smx 576, mobile 600, sm 640, md 768, lg 992, xl
  1200, 2xl 1536.
- **Radius:** 0.5 / 0.75 (buttons, fields) / 1rem (cards) / 1.25rem (heroes,
  images) / 1.5rem (dark CTA panel).
- **Shadows:** `shadow-xs`, `shadow-card`, `shadow-card-hover`, `shadow-float`
  (sticky bar). Keep them soft; no glows.
- **Motion:** 160-260 ms, `--ease-out`. Transforms and colour only, never
  layout. Everything respects `prefers-reduced-motion`. No entrance
  animations, carousels or animation libraries.
- **Tap targets:** at least 48px for buttons and the sticky bar, at least
  44px for inline links in lists.

## Components

| Component | File | Notes |
| --- | --- | --- |
| Header | `components/Header.jsx` | Sticky; desktop shrinks on scroll with transforms only. Mobile menu traps focus, closes on Esc, makes the page behind it inert. |
| Sticky action bar | `components/StickyActionBar.jsx` | ≤768px only: Call · WhatsApp · Book Visit. Hides over the footer, forms and while a field is focused. |
| Footer | `components/Footer.jsx` | Same links and NAP as before, restyled. |
| Page hero | `components/page/PageHero.jsx` | Breadcrumb, eyebrow, H1, `answer-box` summary, actions, supporting copy, photo (or `art`). |
| Hero actions | `HeroActions` in `PageHero.jsx` | Two buttons side by side on phones; `stack` for long labels. |
| Home hero | `components/HeroSection.jsx` | Home and landing. |
| Quick answer | `.answer-box` | The summary paragraph under every H1. The "Quick answer" label is CSS (`::before`), so the HTML text stays exactly the summary. |
| Section heading | `components/page/SectionHead.jsx` | Eyebrow + H2 + lead. Pass the existing heading text unchanged. |
| Link tiles | `components/page/LinkTiles.jsx` | Every internal link group. Anchor text is exactly `label`. |
| Process steps | `components/page/ProcessSteps.jsx` | Timeline; `titleAs="p"` where the original steps had no headings. |
| Trust strip / band | `components/TrustStrip.jsx` | Restates existing promises plus the Google rating. |
| Google rating | `components/GoogleRating.jsx` | From the dated snapshot in `data/testimonials.js`; not schema. |
| Section CTA | `components/SectionCTA.jsx` | Compact Call/WhatsApp block between sections. No heading tag. |
| Page CTA | `components/PageCTA.jsx` | Dark closing panel; its H2 text comes from each page. |
| FAQ | `components/FAQ.jsx` | Native `<details>`; text must match the FAQPage schema word for word. |
| Tables | `components/ContentTable.jsx`, `components/PriceTable.jsx` | Real tables; stack into cards on phones with CSS only. |
| Service card | `components/ServiceCard.jsx` | Row on phones, card from 640px; whole card is the link. |
| Forms | `components/forms/LeadForm.jsx` (+ `BookingForm`, `ContactForm`, `EnquiryModal`) | Phone required (`type=tel`, numeric keypad), inline validation, success state without reload, honeypot. |
| Breadcrumb | `components/Breadcrumb.jsx` | Must keep matching the BreadcrumbList schema. |
| Article contents | `components/blog/ArticleToc.jsx`, `TocSpy.jsx` | "On this page": collapsible on phones, sticky on desktop. |
| Map drawing | `components/page/HeroMapArt.jsx` | Decorative inline SVG for photo-less heroes. |

CSS classes: `btn` + `btn-primary | btn-secondary | btn-ghost | btn-whatsapp |
btn-light | btn-outline-light`, `btn-lg`, `card`, `card-interactive`,
`panel`, `surface-dark`, `icon-tile` (+ `icon-tile-teal`), `chip`, `badge`,
`link-tile`, `link-arrow`, `text-link`, `check-list`, `eyebrow`, `lead`,
`heading-accent`, `field-*`, `data-table`.

Icons: a 40-icon Font Awesome subset in `app/icons.css`. To add one, add its
name to `scripts/generate-icons.cjs` and run
`npm i --no-save @fortawesome/free-solid-svg-icons@6.7.2 @fortawesome/free-brands-svg-icons@6.7.2 && node scripts/generate-icons.cjs`.

## Analytics

`components/CallTracking.jsx` listens for clicks site-wide and sends GA4
events (plus a `dataLayer` push) with `page_path` and `section` (the nearest
`data-section`):

| Event | When | Extra parameters |
| --- | --- | --- |
| `click_call` | any `tel:` link | `call_location`, `lead_channel` |
| `click_whatsapp` | any `wa.me` link | `lead_channel`, `cta_location` |
| `cta_click` | any element with `data-cta` | `cta_name`, `link_url` |
| `form_start` | first interaction with a lead form | `form_id` |
| `form_submit` | successful submission | `form_id`, `lead_channel` |

The existing `generate_lead` (gtag) and `phone_call_click` (dataLayer) call
events are unchanged. WhatsApp links get a prefilled message from the page's
`<main data-wa-context="…">`, e.g. "Hi GR Solution, I need OLED/QLED TV
repair in Noida."

## Rules for future edits

These keep search, AI Overview and local rankings stable.

**Do**

- Restyle freely: classes, wrappers, layout, colours, spacing.
- Add new UI blocks without heading tags (use `<p class="eyebrow">` or an
  `aria-label`), like `SectionCTA` and the trust band.
- Keep the answer-first summary as the first block after the H1, as plain
  text in a `<p>`.
- Keep FAQ questions and answers identical to their schema.
- Give new images descriptive alt text, `width`/`height`, `sizes`, and
  `loading="lazy"` unless they are the largest element in the first screen.
- Run the SEO check after any template change (below).

**Don't**

- Change heading tags, heading text or heading order.
- Remove, merge or rename internal links or their anchor text.
- Edit body copy, prices, service areas, bylines or dates without sign-off.
- Change image filenames or alt text, titles, metas, canonicals, robots,
  JSON-LD, the sitemap or redirects.
- Hide content behind client-only JavaScript, tabs that load on click or
  iframes.
- Show a phone number other than the one `PhoneLink`/`PhoneNumber` render.

**SEO check**

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0RQ8C75FPT npm run build && npx next start -p 3100 &
cd tools/seo-audit
node crawl.mjs --base http://127.0.0.1:3100 --out snapshots/current
node diff.mjs --base snapshots/baseline --head snapshots/current --out reports/current/seo-diff.md
```

`diff.mjs` exits non-zero on any violation. The items approved during the
redesign are listed in `docs/redesign/phase-5-report.md`.

## Photos

Real photos beat any illustration for trust. The site now uses the three real
workshop photos where they matter most, drawings where a photo is still
missing, and no stock photos of people.

### Shot list (please supply)

| # | Photo | Replaces | Notes |
| --- | --- | --- | --- |
| 1 | Owner or team at the New Kondli workshop | About hero drawing (`app/about/page.jsx`, marked PHOTO PLACEHOLDER) | Landscape 4:3, at least 1600×1200, natural light, faces visible |
| 2 | Technician at a customer's home, TV on the wall | Service-page hero photos (`service_tv.webp`, `service_oled.webp`) | Landscape, no customer faces without permission |
| 3 | A sharper workshop interior | `workshop-interior.webp` (today 141×118 px) | Landscape 4:3, at least 1200×900 |
| 4 | One real repair per TV type: LED backlight strips, OLED/QLED panel, LCD board, plasma, curved | The per-type drawings on service cards | Square or 16:10, close-up of the actual part |
| 5 | Before/after of a real repair | Optional for blog posts | Same angle twice |

When a photo replaces an existing image, keep the existing filename and alt
text only if they still describe the photo; otherwise add it as a new file
with its own descriptive alt text and update the page.

### Placeholders in code

- `public/images/illustrations/tv-repair-workbench.svg`: About hero, until
  photo 1 arrives.
- `public/images/illustrations/{led,oled-qled,lcd,plasma,curved}-tv.svg`:
  service cards on home, /services, landing and "Explore More Services".
- `components/page/HeroMapArt.jsx`: locality heroes (decorative; can stay).
