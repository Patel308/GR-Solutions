# Cannibalisation review — 28 October 2026

## Decision

**Do not publish the three new brand hubs as currently drafted.** They are technically valid local drafts, but their primary and supporting transactional keyword groups already have existing canonical service destinations. The initial selection gave a regional brand-hub hierarchy too much weight relative to the explicit existing-page ownership map. The safer recommendation is to strengthen the existing owners with genuinely useful additions instead of introducing three new acquisition URLs for the same repair intent.

This is **potential keyword/intent competition**, not proof that Google has split rankings or that traffic has fallen. The new pages have not been pushed or deployed, so they cannot already have caused production cannibalisation. No authenticated GSC query/page performance, index-selection or AI-citation dataset was available in this review.

## Git state checked in the requested order

1. Committed the full draft and its keyword/technical/browser evidence locally as `e81f6de`, on `codex/transactional-repair-hubs`.
2. Checked remote main and performed a fresh isolated bare fetch from the same GitHub repository. Latest remote main is `8c7a04e4353b3bf99be1619171252880511ea21c` (`Improve repair guidance on three existing priority brand pages (#3)`). The draft is based on that commit; no newer remote work was missing.
3. Normal fetch in the primary checkout fails because of a pre-existing invalid internal Codex checkpoint ref. The isolated fetch succeeded; no checkpoint refs were removed, no credentials printed, and no remote write occurred.

Remote main's latest changes already expand Sony Noida, Samsung Delhi and LG Delhi with four supporting topics each. Those changes are preserved in the local branch and baseline.

## High-priority findings

| Local draft | Existing primary owner for the Delhi research partition | Additional competing family | Finding |
| --- | --- | --- | --- |
| `/services/sony-tv-repair` | `/services/sony-tv-repair-delhi` | Sony Noida / Greater Noida / Ghaziabad city pages | Sony TV repair, Bravia repair, Sony television repair, LED repair and near-me terms are already mapped to brand-city pages. The latest Sony Noida page also covers Bravia, Android TV, OLED and LED repair. The draft offers the same diagnosis, quote and booking journey to the same service audience. |
| `/services/samsung-tv-repair` | `/services/samsung-tv-repair-delhi` | Samsung's other three city pages | Generic Samsung repair and QLED terms already map to the Delhi owner. Remote main now covers QLED, Smart Hub, Neo QLED and LED repair on that page; the draft's technology/estimate sections overlap that need. |
| `/services/lg-tv-repair` | `/services/lg-tv-repair-delhi` | LG's other three city pages | LG repair, television repair, OLED/LED and near-me keyword groups have existing destinations. Remote main already covers OLED, webOS, LED and Smart TV/large-screen handling on the Delhi page. |

For every selected primary and supporting keyword in the English Delhi partition, `KEYWORDS_CLEAN.csv` says `OPTIMIZE_EXISTING` and assigns the respective brand's Delhi URL. The original research remains heuristic and needs GSC/SERP validation, but this is material evidence against treating those phrases as an uncovered acquisition intent. Full per-keyword records are saved in `cannibalisation-review-2026-10-28.json`.

### Why the model-hub distinction is insufficient in this draft

The new H1s use the broad brand-repair terms, the pages include diagnosis/repair prices, they use Service markup and enquiry CTAs, and their coverage includes all four cities. Existing city pages offer those same repairs, model checks, estimates and booking options. City selectors and different prose create a hierarchy, but do not by themselves establish a separate search task. Preserving each page's self-canonical also leaves both URLs as indexable candidates for overlapping queries.

The measured five-word phrase overlap of 24.46% or less is only a text-similarity check. **Google has no 25% cannibalisation threshold.** Two substantially different texts can still compete for the same query and intent. Passing metadata/schema tests does not establish that the new URL is strategically necessary.

## AEO/AIO and GEO assessment

Technical foundations pass: server-rendered answers, matching visible FAQ/schema, correct canonicals, stable existing LocalBusiness references and accurate service areas. No new branches, ratings, manufacturer authorisation or fixed repair rates were invented. The drafts distinguish OLED from backlit display technologies and reference manufacturer guidance.

Those facts do not resolve ownership. Equivalent repair answers under a regional hub and city acquisition pages can give search/answer systems several candidate URLs for the same business and task. No AI-citation loss is established. A new broad regional URL also competes for a subset of the local audience already addressed by the city URLs; a Delhi NCR label does not create another independent service market. llms.txt inclusion and repeated Service markup are discovery signals, not de-duplication controls or citation guarantees.

## Existing architecture watchlist

Two pre-existing patterns deserve query/page measurement, but are not caused by this local draft:

- `/services/tv-repair-delhi` versus `/services/led-tv-repair-delhi`: the parent service and device page can both match generic LED/TV local queries. Keep their distinct roles and review query ownership rather than merging automatically.
- `/blog/led-tv-screen-replacement-cost-delhi` versus `/blog/tv-screen-replacement-cost-delhi-ncr`: related screen-cost intent and nested regions can overlap. Inspect actual query landing pages, demand, user value and selected canonicals before changing any established URL.

No redirects, removals, noindex changes or canonical rewrites were made to resolve these hypotheses.

## Recommended next content decision

Keep the three new pages as committed local drafts. Retain current canonical brand-city URLs as transactional query owners. Review which draft paragraphs add information beyond today's existing-page enhancements, then incorporate only those useful additions into the appropriate current page or existing diagnosis guide. Do not paste all three drafts into every city template.

If a regional brand navigation page is still desired, first define a distinct comparison/navigation task and its query evidence; a different URL alone is insufficient. Do not canonicalise genuinely different city pages to one broad hub simply to hide competition. New acquisition pages should require a distinct service/user need, confirmed operational scope and keyword/SERP evidence that the existing owner cannot adequately serve.

The alleged hidden terms such as `sony television repair`, `repairing samsung tv` and `lg television repair` are close variants of the existing brand repair concepts. Exact phrase absence does not prove missing semantic coverage or justify another URL. Broader near-me, shop, doorstep and display variants similarly belong with existing service owners unless evidence establishes a different task. Do not add their rounded Planner volumes together.

## Evidence needed to confirm an actual ranking problem

Use the GSC query-to-page report for each brand/market over comparable complete periods: clicks, impressions, CTR and average position with low-volume uncertainty retained. Check whether the same query repeatedly changes landing URL, whether the wrong page serves it and whether combined performance worsens. Several URLs earning impressions is not, by itself, harmful cannibalisation. URL Inspection can check Google's selected canonical and rendering. AI citation ownership needs separate observed citation data; local results need location-controlled observations.

## Validation versus strategic judgement

The local 111-page regression audit, production build, 12 responsive cases and crawler user-agent parity checks passed. All 108 existing page contracts and today's remote edits are retained. These checks establish implementation preservation only. The strategic recommendation remains **do not deploy the new hub drafts as-is** because the keyword ownership and repair intent overlap is unresolved.
