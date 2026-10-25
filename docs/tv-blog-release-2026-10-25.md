# TV diagnosis and visit guides — 25 October 2026

## Research and scope

Source: `SEO_KEYWORD_RESEARCH_2026-10/GR_SOLUTION/ARTICLE_BRIEFS.csv`, extracted 25 October 2026, and its conversion-funnel and analytics notes. The research files remain user-owned input and are not bundled into this commit.

Selected proposed supporting guides:

| New URL | Research keyword | Distinct reader need |
| --- | --- | --- |
| `/blog/tv-motherboard-diagnosis` | tv motherboard repair cost | Evidence before ordering a board; useful symptom record and technician handover |
| `/blog/prepare-for-doorstep-tv-repair` | tv repair home service | Visit preparation, estimate approval and post-repair acceptance checklist |

These are separate informational intents supporting existing service and pricing pages. No new city or brand service pages were generated. Historical planner estimates are not actual traffic or a live GSC CTR/booking baseline. Proposed research topics are not claimed as validated PAA questions or proven ranking opportunities.

The clean keyword file reports historical monthly estimates of 10 for “tv motherboard repair cost” in each city partition. “tv repair home service” has estimates of 40 in Delhi and 10 in each other partition; its transactional destination remains the existing city service page. The visit article serves the narrower preparation/checklist question and links to those service owners. These partitioned estimates are not added together or treated as unique audiences. GSC CTR fields are empty.

The editorial byline identifies the existing organisation, not an invented individual specialist. Manufacturer no-power and warranty pages were checked directly on 25 October. The general guides do not claim a documented repair case, technician sign-off, manufacturer authorisation, ratings, guaranteed repairs, warranty duration or confirmed visit capacity.

## Original image assets

Generated first with the built-in imagegen tool, one call per asset. Outputs inspected visually. Format-only WebP exports preserve the image composition; no image editing was performed. The article captions disclose AI generation and distinguish illustrations from actual work/customer photographs.

- `public/images/blog/tv-motherboard-diagnosis.webp` — 166,660 bytes; original PNG retained beside it.
- `public/images/blog/doorstep-tv-repair.webp` — 181,554 bytes; original PNG retained beside it.

### Final prompt: motherboard illustration

Use case: scientific-educational. Asset type: original landscape editorial illustration for a TV repair diagnosis guide on a professional repair website. Primary request: show careful evidence-led TV motherboard diagnosis without pretending a visible symptom proves a failed board. Scene: clean electronics repair workbench; a large flat-screen TV shown from the back, unplugged power cord visibly resting on the bench, mainboard and separate power board visible as simplified realistic components; beside it a tablet displaying three clear pictograms for power indicator, input connection, and model label, and a technician's closed notebook with blank checklist rows. Style: premium editorial cutaway illustration with precise restrained technical details, soft blue and teal accents, warm neutral workbench, believable proportions, polished dimensional drawing. Composition: wide landscape 3:2, clear central subjects, generous margins, readable at small blog-card size. No hands inside powered equipment, no live voltage measurement, no repair instructions or wiring schematic, no brand logos, no readable text, no watermark. This is an explanatory illustration, not a claimed photograph of a real repair.

### Final prompt: visit illustration

Use case: illustration-story. Asset type: original landscape editorial illustration for a consumer guide to preparing for a doorstep TV repair visit. Scene: bright modest Indian living room with a large flat-screen television securely on its stand, customer and service technician discussing a clipboard estimate at a comfortable distance; customer holds a phone showing a simple photo of the TV model label; closed tool bag on the floor. Key visual detail: foreground clipboard has clean blank rows with small pictograms representing inspection, parts estimate, approval, and post-repair picture/audio checks, no readable text. Style: refined contemporary editorial illustration with warm natural light, gentle teal and blue accents, calm professional human expressions, believable anatomy, understated uncluttered furnishings. Composition: wide landscape 3:2, strong focal point on the discussion and checklist, generous margins, suitable for a trustworthy TV repair blog hero and thumbnail. No money changing hands, no ratings, stars, badges or warranty promises, no brand logos, no fake before/after evidence, no watermark. It must read as an explanatory illustration, not a photograph of an actual GR Solution customer.

## Conversion changes

Contextual diagnosis/WhatsApp/call cards on article pages; an additional decision point after the first price table where present; two placements on `/pricing`; one on the blog index. Blog-card titles and images also open their guides. Clear steps explain information needed, availability confirmation and estimate approval. Buttons wrap within their containers on small viewports.

The diagnosis button opens the existing enquiry modal with the existing `book_visit` source; it does not create or confirm an appointment. Channel-aware call and WhatsApp links retain the existing ads/organic number logic. No form is submitted during testing.

New GA events: `content_cta_view` (50% of card visible, once per mounted placement), and `content_cta_click` (`open_enquiry`, `whatsapp`, `call`). Parameters: public content ID, intent, placement, action, traffic-number channel and pathname. No form values, WhatsApp messages, personal contact details or addresses are included. Existing global phone events remain unchanged. A click is not treated as a qualified lead or confirmed booking. Compare clicks/views by content and placement; validate real enquiries/bookings separately. Google search-result CTR is a separate GSC metric and cannot be inferred from onsite CTA clicks.

## Preservation and verification

Existing titles, descriptions, H1s, canonicals, robots settings, schema, prices, source dates, article publication dates and destinations are preserved. The two new articles enter the existing blog index, sitemap and llms.txt through the existing data pipeline. Interlinks connect symptom/cost guides, the two checklists, relevant services and pricing. Service pages automatically show guides that link to them through the existing reverse index.

Read-only regression check: `python -B scripts/audit-blog-release.py --url http://127.0.0.1:3100 --baseline <pre-release-snapshot> --output <report>`. This checks all sitemap pages, existing search metadata/schema/link retention, original body-text retention, new article schemas and visible FAQs, image responses, sitemap/AI-guide discovery, noindex/404 handling and the previous nine service pages’ phrase overlap. This audit does not predict rankings, indexing, AI citations or conversion increases.

Validation completed:

- ESLint and the production build pass; 114 static routes generated.
- All 108 sitemap pages pass the rendered regression audit; existing 106 URL contracts and structured data preserved. Existing prices and article copy retained.
- Previous nine revised service pages remain at a maximum of 13.64% shared five-word phrases against other service pages.
- Twenty responsive cases across the two new articles, pricing, an existing city cost guide and an existing symptom guide: 320/375/768/1280 pixels; no horizontal page overflow, no CTA button overflow, images loaded.
- Pricing and both new guide buttons, plus the existing Delhi cost guide button, open the enquiry modal. No enquiry was submitted and no booking was created.
- Googlebot, OAI-SearchBot and GPTBot requests receive matching server-rendered headings and article text on the new articles and pricing, with HTTP 200 and self-canonicals.
- Raw reports: `blog-release-audit-2026-10-25.json` and `blog-ui-audit-2026-10-25.json`.

GA4 collection has not been verified in the account's reporting interface. Register the event parameters as custom dimensions if content/placement breakdowns are needed in standard reports. Compare onsite click/view rates after release; use GSC separately for search-result CTR and operational records for real booked work.
