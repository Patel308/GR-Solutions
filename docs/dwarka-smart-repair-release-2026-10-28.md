# Dwarka and Smart TV repair — local replacement, 28 October 2026

## Scope and deletion

The user explicitly requested deleting the three rejected brand-hub drafts and replacing them with exactly two pages. The Sony/Samsung/LG hub component, data, CSS, obsolete draft audit script and draft-only reports are removed from the working tree; their route dispatch, sitemap/llms entries and backlinks are gone. The three never-published URLs return 404 locally. They are not hidden with noindex or redirected to unrelated pages. Historical local Git commits remain recoverable; no history rewrite or remote deletion was requested.

The branch is now `codex/dwarka-smart-tv-repair`. The replacement is based on latest checked remote main `8c7a04e4353b3bf99be1619171252880511ea21c`. Its expanded Sony Noida, Samsung Delhi and LG Delhi content remains intact. The subsequent user instruction authorises committing and pushing the feature branch to GitHub. Remote main and production deployment remain outside that instruction.

## New page ownership

| URL | Primary task | Supporting topics | Relationship to existing pages |
| --- | --- | --- | --- |
| `/services/tv-repair-dwarka` | Local Dwarka repair enquiry and visit planning | LED/LCD TV repair in Dwarka; Smart TV repair in Dwarka; mounted/large-screen inspection; estimates and collection | West Delhi retains the wider area task; Delhi retains city-wide repair. The Dwarka page provides model/sector/access preparation, actual workshop location and a local handover process. |
| `/services/smart-tv-repair` | App, connectivity, input and startup repair enquiries across the existing four cities | Smart TV repair near me; Android TV repair; Android TV repair near me; platform/model-dependent software versus hardware diagnosis | LED/OLED pages retain illumination, panel and display-technology intent. Brand-city pages retain branded local booking. No Smart-TV×city or additional brand permutations are generated. |

Fresh read-only Keyword Planner research from 28 October measures Dwarka repair at 110/month in the English Delhi city target, its LED variant at 70, and Smart TV repair at 50 in Delhi and separately 50 in Noida. These are non-additive rounded historical averages for October 2024–September 2026, not traffic forecasts or profit estimates. Source evidence is retained in `Keyword_Research/transactional-keyword-gap-discovery-2026-10-28.json` (raw local research, excluded from the Git commit) and the research shortlist files. Existing locality coverage already advertises Dwarka; the new page does not invent a branch, immediate arrival, operating capacity or completed local jobs.

## Competitor review and original implementation

Direct pages and result samples were reviewed on 28 October. General useful features were adapted into original wording and repo-native UI, not copied text or claims:

| Source | Useful observed pattern | Implementation here |
| --- | --- | --- |
| [OK Home Services](https://okhomeservices.com/) | Locality-specific doorstep context, appointment entry and practical FAQs | Dwarka-specific sector/access checklist, explicit availability confirmation and native expandable FAQs |
| [Urban Company locality service page](https://www.urbancompany.com/delhi-ncr-tv-repair-rohini-new-delhi) | Clear service choices and distinction between inspection and repair pricing | Symptom-based preparation, clear diagnosis/estimate boundaries and visible sourced market ranges |
| [EPair services](https://epair.in/services/) | Prominent phone/WhatsApp and quote entry | Channel-aware call/WhatsApp and the existing enquiry modal at four useful decision points |
| [GSM service catalogue](https://www.gsmcaresolution.in/services.html) | Crawlable links to distinct repair tasks | Focused cross-links among new pages, current service parents and diagnosis/cost guides |

A direct RR Electronics Smart TV page fetch returned 502; its search snippet was an intent sample only, not claimed as a fully inspected page. Rival ratings, warranties, parts guarantees, staff credentials and arrival claims were not adopted. No customer or competitor form was submitted.

Manufacturer references checked for technical accuracy:

- [Google TV device troubleshooting](https://support.google.com/googletv/answer/10070482?hl=en)
- [Google TV unresponsive-device guidance](https://support.google.com/googletv/answer/12360626?hl=en)
- [Samsung India app troubleshooting](https://www.samsung.com/in/support/tv-audio-video/how-to-troubleshoot-apps-that-are-not-working-on-the-samsung-smart-tv/)

These support model-specific guidance and reset/account implications. The site does not diagnose a board from an app failure, tell visitors to open powered equipment, promise discontinued apps will work, or present outside-network faults as automatic TV hardware repairs.

## UI and booking flow

The Dwarka page includes a five-item readiness checklist. It stores only checkbox state in the current page; no details are collected or submitted, and completion is not required to request help. The Smart TV page has four observation choices with an accessible pressed state and live summary. This is a handover organiser, not an automated fault diagnosis. Key issue explanations and a symptom table remain server-rendered independently of the selector.

Both pages have answer-first introductions, real workshop photography, visible service facts, four substantive repair sections, an observation table, indicative prices, estimate inclusions, four process steps, six contextual related links, six native FAQ disclosures, final contact entry and dated manufacturer references. Existing optimised 1200×900 WebP workshop photography is reused without cropping, including near-full-width phone delivery. No new image was generated. The actual New Kondli workshop is labelled above the image; no image caption or false Dwarka location is added.

Enquiry actions open the current modal using the existing `book_visit` source. Call/WhatsApp retain paid-versus-organic routing. Public `content_cta_click` parameters reuse the existing analytics convention; checklist states, observation choices, form values and personal details are not transmitted as event parameters. No new fixed contact bar was added and no test lead was submitted.

## Interlinking and SEO/AEO/GEO

The two pages link directly to one another and to relevant current guides, price sources, workshop/about and contact. Incoming discovery links are added only to `/services`, `/services/tv-repair-west-delhi`, `/services/tv-repair-delhi` and `/services/led-tv-repair`. Existing links and original text remain. Existing brand and city titles, H1s, descriptions, schemas and canonicals are preserved. The broader West Delhi route is the Dwarka parent, while Smart TV support links back to the relevant hardware service rather than duplicating its primary task.

Each new route is statically generated with a descriptive primary-keyword URL, one H1, unique metadata/Open Graph and self-canonical. Service and WebPage markup reference the existing LocalBusiness/WebSite IDs. Dwarka is a service area in Delhi, not a new address or separate business entity. FAQ schema matches the visible native disclosures; breadcrumbs reflect actual navigation. Only the two new sitemap dates are added; existing dates and robots stay unchanged. llms.txt preserves all previous entries and adds the two services.

Pricing reuses the existing researched Delhi NCR market bands and their original September review date. These are not newly verified fixed operator prices. No ratings, completed jobs, manufacturer authorisation, guaranteed same-day visits or new warranty durations are invented.

## Verification

ESLint and the production build pass, with 116 static routes. `audit-repair-landings.py` checks all 110 sitemap pages against the 108-page production baseline: original metadata, schema, canonical/crawl settings, body retention, links and sitemap dates are preserved. Only four existing pages receive additive contextual links. New page anchors, mutual links, FAQ agreement, provider identity and all internal destinations pass. All three removed draft routes return 404 and are absent from the sitemap, llms and navigation.

The new pages share at most 17.18% (Dwarka) and 12.81% (Smart TV) of distinct five-word phrases with another service page under the prior audit metric. The previous nine rewritten service pages remain at a maximum of 13.64%. These figures are text-similarity observations, not a Google threshold or proof that query competition cannot occur.

Initial responsive checks cover both pages at 320, 390, 768 and 1440px: one H1, four topic sections, six FAQs, loaded uncropped images and no page or action overflow. Phone gutters were corrected to approximately 8px on each side and rechecked on both pages at 320/390px. Functional checks cover all eight enquiry placements, checklist updates, all four Smart TV observation choices and native FAQ expansion. No enquiry was submitted.

Crawler checks compare a normal browser user-agent, Googlebot, OAI-SearchBot and GPTBot on both routes: same server-rendered text/H1, HTTP 200, self-canonical and index/follow. User-agent parity is not proof of real crawler visits, inclusion, AI citations or rankings. No GSC performance baseline is available; keyword ownership needs measurement if the pages are later published.

Reports: `dwarka-smart-repair-audit-2026-10-28.json`, `dwarka-smart-repair-ui-2026-10-28.json` and `dwarka-smart-bot-check-2026-10-28.json`.


Final presentation follow-up (29 October): the new UI uses small inline SVG icons rather than an external icon-font dependency. The user subsequently authorised committing and pushing to GitHub. The push is to the feature branch for review; the earlier instruction not to deploy remains in effect, so remote main and production are not changed.
