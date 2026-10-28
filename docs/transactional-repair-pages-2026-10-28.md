# Transactional repair hubs — 28 October 2026

## Evidence reviewed before implementation

The latest research package found locally is `SEO_KEYWORD_RESEARCH_2026-10/GR_SOLUTION/`, extracted 25 October 2026. Reviewed its technical SEO/AEO/GEO audit, landing-page priorities, article briefs, assumptions/gaps, competitor/SERP report and clean keyword rows. The older `Keyword_Research/` export was not used as the primary selection source. This is a review of the latest saved research, not a claim that Keyword Planner was rerun on 28 October.

Also pulled and fast-forwarded the newer GitHub revision `8c7a04e4353b3bf99be1619171252880511ea21c` before implementation. Its Sony Noida, Samsung Delhi and LG Delhi supporting-topic improvements are retained. A broken internal Codex checkpoint ref caused normal fetch validation to fail; the remote commit objects were checked for completeness and the verified fast-forward applied without changing or deleting internal checkpoint refs.

New web-search samples on 28 October checked brand repair intent and manufacturer references. These are not controlled-location Google rankings or measured organic difficulty. Search samples show independent repair providers alongside official support and directories; the new pages explicitly identify GR Solution as independent. Sources:

- https://www.sony.co.in/electronics/support/televisions-projectors
- https://www.samsung.com/in/support/tv-audio-video/how-to-find-your-samsung-smart-tvs-model-number/
- https://www.samsung.com/in/support/tv-spare-part-price/
- https://www.lg.com/in/magazine/what-makes-lg-oled-different-from-led-tvs/
- https://www.lg.com/in/support/product-support/

The Sony support result was discovered in search; one direct connector fetch timed out. No inference of missing support content is made from that timeout.

## Selection and intent

| Main keyword / URL slug | Delhi monthly estimate | Four related repair-intent keywords and Delhi estimates |
| --- | ---: | --- |
| sony tv repair / `sony-tv-repair` | 390 | sony bravia tv repair (110); sony television repair (390); sony tv led repair (140); sony tv repair near me (140) |
| samsung tv repair / `samsung-tv-repair` | 320 | samsung television repair (320); repairing samsung tv (320); samsung qled tv repair (10); samsung tv repair near me (90) |
| lg tv repair / `lg-tv-repair` | 170 | lg television repair (170); lg led tv repair (20); lg oled tv repair (10); lg tv repair near me (50) |

All estimates above use the English Delhi partition, Google Ads API historical metrics, October 2024–September 2026. They are rounded historical estimates, not current-month demand, expected visitors, leads or unique NCR totals. Close variants and overlapping audiences must not be added. Secondary OLED/QLED terms have strong repair intent but lower measured volume; they are not labelled high-volume individually.

Primary Delhi auction bid bands, converted from INR micros: Sony TV repair approximately ₹5.68–26.27, Samsung ₹14.84–39.63, LG ₹3.84–21.47. These are ad-auction estimates, not repair charges, profitability or evidence of organic ranking ease. Some premium subtopics carry higher bid signals, but no repair margin or CRM outcomes are available. The choice combines measured demand, direct service intent, existing supported brands and useful model/estimate decisions rather than claiming proven high-profit customers.

The broader highest-volume city/near-me terms already have canonical destinations. The three new regional brand hubs are one level above city booking pages, not another city synonym page. Hubs cover model identification, display-specific repair choices, estimating and repair acceptance; the four linked city pages retain local booking, route and access intent. Existing URLs, titles, H1s, canonicals and schemas are not replaced. Three priority city pages link back to the relevant hub; `/services` and `/services/brands` provide discovery. Broad-query overlap is still a hypothesis that needs GSC query-to-page measurement; adding a hub cannot guarantee zero cannibalisation.

## Overlooked wording

The baseline owner pages did not contain these exact phrases in title or main body: Sony television repair (390), repairing Samsung TV (320), LG television repair (170), TV display repair (90), TV repair home service near me (110), television repair near me (3,600), TV repair shop near me (720). These are Delhi historical estimates, not additive demand.

Exact-string absence is a wording opportunity, not proof a page is unoptimised: search engines can already understand the existing synonyms. The first three are integrated naturally in the new brand hubs. The generic display/doorstep/near-me/shop terms remain mapped to existing local pages; no extra competing routes or awkward keyword lists were generated for them. GSC data is unavailable, so they are not claimed as newly discovered impressions, rankings or traffic losses.

Full per-term provenance, original research destinations and baseline wording checks are saved in `transactional-keyword-selection-2026-10-28.json`.

## Content and conversion

Each hub has a distinct answer, four substantive repair sections, a model handover checklist, brand-specific estimate guidance, relevant existing market-range rows, three supporting guides, four city destinations, visible FAQs and manufacturer references. The existing price source date stays September 2026; no new fixed price, margin, repair guarantee, technician case, manufacturer authorisation or branch is invented. OLED is distinguished from backlit LED/LCD/QLED. Existing optimised workshop photography is reused with intrinsic dimensions, responsive delivery and natural proportions; no new image was generated.

The existing booking component opens the current enquiry modal and keeps source-aware Call/WhatsApp routing. Testing must not submit an enquiry or create an appointment. Existing analytics event semantics are reused, with public content identifiers only.

SEO/AEO/GEO implementation: server-rendered answers and copy; exact primary keyword in the route and H1; unique title/description; self-canonical and Open Graph; Service and WebPage entities referencing the existing LocalBusiness ID; accurate service areas; visible FAQ/schema agreement; breadcrumb links; sitemap and llms.txt additions with real review dates. No new business-address entities, ratings or unsupported offers are added. FAQ or llms.txt availability does not establish rich results or AI citations. Pages target existing demand; publishing cannot itself create search demand.

## Verification

`scripts/audit-brand-hubs.py` compares the live pre-edit 108-page snapshot against the local production build. It checks the three additions, retained original metadata/schema/body/link contracts, unchanged existing sitemap dates and robots, new page completeness/FAQ/provider/canonical links, all internal destinations and five-word phrase overlap. Final results and browser validation are recorded alongside this document after checks complete.


Final local validation: ESLint and production build passed (117 static routes). The rendered audit covered 111 sitemap pages and preserved all 108 existing page contracts with zero failures. Only five existing pages received additive discovery links; original words, link destinations, metadata and schemas were retained. The three hubs have maximum shared five-word phrase overlap of 24.46%, 24.31% and 24.46%; this is a text-similarity metric, not a cannibalisation test or Google threshold. The earlier nine revised services remain at a maximum of 13.64%.

Browser verification passed 12 cases across three hubs at 320/390/768/1440px: one H1, four topic sections, four city links, loaded full-proportion images, no page or CTA overflow. All three enquiry buttons open the existing modal at 390px; no request was submitted. Local requests using Googlebot, OAI-SearchBot, GPTBot and a normal browser user-agent return identical text/H1s, HTTP 200, self-canonicals and index/follow. Reports: `transactional-repair-audit-2026-10-28.json`, `transactional-repair-ui-2026-10-28.json`, `transactional-repair-bot-check-2026-10-28.json`.

Release boundary: the user explicitly instructed not to deploy. Work remains local; no main push or production workflow is authorised for this change. A subsequent request authorises a local commit, fetching latest remote main, and a cannibalisation review before any publication.
