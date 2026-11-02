# Launch readiness: redesign to production

Prepared 2 November 2026 on branch `claude/lucid-brown-1dbtvs`. Nothing is
merged: merging into `main` deploys the site, and that decision is yours.

## 1. What goes live

The launch candidate is the redesign plus everything the live site gained
since September, merged and re-verified against **today's live site**
(`origin/main` 606f612), not the September baseline.

- **Redesign** (Phases 1–5): design system, every template, sticky
  Call / WhatsApp / Book Visit bar, accessible header, menu and enquiry
  dialog, AVIF images, speed work. Report: `docs/redesign/phase-5-report.md`.
- **Owner decisions since then:** organic (SEO/AIO/GEO) traffic and the NAP
  use +91 93155 15700 (Kamlesh), Google Ads visitors see +91 99902 83890
  (D1); "15+ years" corrected to "5+ years" (D5).
- **Lead tracking and forwarding:** every lead gets an ID and its source
  (incl. the Google Ads click ID) and is sent by email and to `/api/lead`
  (Telegram / Google Sheet / CRM webhook when switched on). Set-up:
  `docs/lead-tracking.md`.
- **Live changes merged in** (25–29 Oct): Dwarka and Smart TV repair pages,
  the motherboard-diagnosis and doorstep-visit guides, revised content on
  nine local service pages, brand-page guidance, full-size uncropped
  workshop and blog images, booking prompts in guides and on the pricing
  page, the grouped enquiry options (premium TVs, new-TV purchase). Each is
  carried into the redesign with the same headings, links, anchor text and
  image alt text.
- **Next.js 16.4.3.** Versions 16.0.0–16.4.0 are affected by two critical
  advisories (remote code execution in the image optimizer with SVG files,
  and in `use cache` functions) and a high denial-of-service advisory.
  **The live site (16.2.9) is affected today.** `npm audit` (production)
  on the branch: 0 vulnerabilities.

## 2. End-to-end mapping against the live site

Every sitemap URL of the live site was crawled (raw HTML and after
JavaScript) and compared with the launch candidate, field by field.

| Check | Result |
| --- | --- |
| URLs (110 in the sitemap + `/landing`) | All present, all 200, same sitemap membership; none removed, none added |
| Titles, meta descriptions, canonicals, robots | Identical on all 111 |
| H1–H3 text and order | Identical on 110; `/about` H1 reads "5+ Years" (owner decision) |
| Internal links and anchor text | All kept on all 111 (the live build's dropped word spaces, e.g. "DelhiTV", are restored) |
| Image files and alt text | All kept, except the signed-off stock-photo swaps (same alt text) |
| JSON-LD | Identical except the telephone (D1) |
| FAQ text vs FAQPage schema, breadcrumb vs BreadcrumbList, first block after H1 | Checked on every page by the crawler; no violation |
| Raw HTML vs rendered (what crawlers without JavaScript see) | Same content; only the Google Analytics script is added after load |
| Unapproved differences | **0** |
| Review items | 56, the same kinds signed off in the Phase 5 report: related-guide cards, "how it works", reviewer initials, new section labels, the redesign's extra links |

Full table, one row per URL: `tools/seo-audit/reports/launch-2026-11/launch-map.md`.
Item-level diff: `tools/seo-audit/reports/launch-2026-11/seo-diff-vs-live.md`.

## 3. Tests on the launch candidate

| Test | Result |
| --- | --- |
| Unit tests (attribution, validation, forwarding, API) | 29 / 29 pass |
| Browser tests, phone routing and lead capture (Playwright, production build) | 22 / 22 pass, incl. the guide booking prompt and the Dwarka page button, and the "New TV Purchase Enquiry" / premium OLED options reaching email, Telegram, Sheet and webhook with one lead ID |
| Accessibility (axe, 19 pages × 4 widths) | Only the known footer H4 heading-order item (D13). Fixed on the way: duplicate landmark names on pages with two booking prompts, low-contrast WhatsApp button on the revised service pages |
| Keyboard (skip link, menu, dialog, dropdown, FAQ) | 16 / 16 |
| Layout, 10 pages × 7 widths (320–1440 px) | No horizontal scroll, layout shift 0 |
| Mobile Lighthouse vs live, interleaved | Running; results to follow |

## 4. Before you merge (owner)

1. **Google Business Profile:** set the primary phone to +91 93155 15700,
   the same day, so the profile and the site's NAP match.
2. **Optional alerts:** Telegram / Google Sheet settings in the server
   `.env` (`docs/lead-tracking.md`, section 3). Without them, leads still
   arrive by email exactly as today.
3. **Optional Google Ads conversions:** GitHub repository variables
   (`docs/lead-tracking.md`, section 4). Keep Ads auto-tagging on.
4. **Merge with a normal merge commit** (not squash), so one revert undoes
   the launch.

## 5. After the deploy (first hour)

- GitHub Actions run green, including "Verify the Hostinger origin".
- Open on a phone: home, a service page, a city page, the Dwarka page, a
  guide, `/contact`. Check the bottom bar, Book Visit and the menu.
- View source of any page: `tel:+919315515700`, and `"telephone":"+91 93155 15700"`.
- `https://grsolution.co.in/api/lead` lists the alerts you switched on.
- Send one real test lead: the email (and Telegram / Sheet, if on) carry
  the same `GR-` ID.
- Search Console → URL Inspection → Test live URL on the home page and two
  service pages; request indexing.

## 6. Watching and rollback

- Days 1–7: Search Console **Pages** report (no rise in "not indexed" or
  errors) and the Generative AI report you track.
- Days 7–28: clicks and impressions against the previous period; PageSpeed
  Insights 3–5 runs per page, compared by median.
- Roll back if indexing errors appear, or clicks fall more than 20–25% for
  7+ days after the first week without another explanation:

  ```bash
  git revert -m 1 <merge commit>
  git push origin main     # redeploys the previous site in about 10–15 minutes
  ```

## 7. Re-running the checks

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0RQ8C75FPT npm run build && npx next start -p 3100 &
npm test
node --test --test-concurrency=1 tests/e2e/leads.e2e.mjs
cd tools/seo-audit
node crawl.mjs --base http://127.0.0.1:3100 --out snapshots/current --rendered
node diff.mjs --base snapshots/live-2026-11-02 --head snapshots/current --out reports/current/seo-diff-vs-live.md
node launch-map.mjs --base snapshots/live-2026-11-02 --head snapshots/current \
  --diff reports/current/seo-diff-vs-live.json --out reports/current/launch-map.md
```
