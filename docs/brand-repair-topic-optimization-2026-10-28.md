# Priority brand repair topic optimization — 2026-10-28

## Scope

Expand the existing supporting-topic content on three canonical pages:
- /services/sony-tv-repair-noida
- /services/samsung-tv-repair-delhi
- /services/lg-tv-repair-delhi

The change lives in data/brandServicePages.js. Each target keeps its two existing topic headings and all original topic text, adds model-specific explanation to those topics, and gains two more topics. No new routes are created.

## Page ownership and content

| Existing page | Four supporting topics |
| --- | --- |
| Sony Noida | Bravia, Android TV, OLED, LED |
| Samsung Delhi | QLED, Smart Hub, Neo QLED, LED |
| LG Delhi | OLED, WebOS, LED, Smart TV / large-screen handling |

These topics remain sections on the parent brand-city page, not separate keyword landing pages. City and brand pages continue to own their current broad service queries. Existing symptom and cost guides retain their informational purpose.

Content distinguishes OLED from backlit LCD/QLED technology, explains conditional diagnosis and repair feasibility, requests model and symptom details, and describes safe visit/collection planning. It does not invent completed repairs, ratings, manufacturer authorization, part availability, fixed prices or warranty promises. The added phrases are not presented as newly measured high-volume keywords.

## SEO, AI-answer and local-search preservation

No changes to URLs, static route generation, titles, meta descriptions, H1s, hero text, direct answers, FAQ data, canonical generation, structured-data renderer or its inputs, contact details, service-area copy, tracking, existing internal links, sitemap, robots or llms.txt.

The existing server-rendered topic headings carry the additional explanatory text. Local context is specific to the existing page's city, including Noida society access and Delhi large-screen handling. Short explanations separate symptoms from confirmed faults and clarify independent repair support.

## Validation

Base commit: b4a543b88dc9de270d5ebc6c4fb7e9527be63dff

- Node syntax check passed for the updated module.
- Evaluated original and updated brand-page generation with the same existing cities, contact channels and SEO helper functions.
- All 44 generated brand URLs and ordering are unchanged.
- All fields on the other 41 brand pages are deeply equal.
- On the three targets, every field except supportingTopics is deeply equal.
- Existing topic titles and keywords are unchanged; existing text is retained as the prefix of each expanded topic.
- Each target has four unique topic keywords and headings.
- Confirmed that the target pages use the existing SupportingTopicsSection renderer rather than ServicePageRevision overrides.
- Full npm lint, Next.js build, browser rendering and live crawl were not run: the local environment cannot reach the network proxy to clone/install dependencies. This draft must receive those checks before merge.
- The existing GitHub workflow triggers on main pushes or manual dispatch and includes production deployment; it was not triggered for draft validation.

## Release boundary

This branch is for review. It has not been merged or deployed. Rankings and AI/search visibility are not guaranteed by unchanged technical signals; compare Search Console query-to-page performance after any approved release.
