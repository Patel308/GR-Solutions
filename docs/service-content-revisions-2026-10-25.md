# Service content revisions — 25 October 2026

Nine URLs from the supplied Search Console screenshots now use individually
authored repair guidance. Four Toshiba city URLs appeared under **Discovered —
currently not indexed**; LG Noida, LG Greater Noida, Vu Greater Noida, Plasma
Ghaziabad and OLED/QLED Noida appeared under **Crawled — currently not indexed**.
Those screenshots establish the reported historical status, not current indexing.
Other city URLs were comparison pages and were not assumed to be unindexed.

The revisions distinguish actual display technologies, symptom comparisons,
parts compatibility, safe access, repair economics, local appointment planning
and warranty routes. They do not invent completed jobs, local branches,
authorisation, reviews, prices or neighbourhood fault statistics. The existing
free-diagnosis policy is drawn from `data/pricing.js`.

| Original comparison | Before | Revised |
| --- | ---: | ---: |
| Toshiba city pages, all six pairs | 82.15–85.15% | 9.23–11.05% |
| LG Noida / LG Greater Noida | 85.13% | 11.14% |
| Vu Greater Noida / other Vu cities | 81.59–81.95% | 3.72–4.47% |
| LG Greater Noida / Vu Greater Noida | 63.58% | 12.90% |
| Plasma Ghaziabad / other Plasma cities | 50.32–51.12% | 2.71–3.10% |
| OLED/QLED Noida / other OLED/QLED cities | 51.56–52.28% | 3.22–3.56% |

Metric: intersecting distinct five-word phrases divided by the smaller phrase
set. Only rendered `<main>` text is measured; scripts, header and footer are
excluded. Case and punctuation are normalised; brand and city names are retained.
Shared pricing notices, related links and calls to action inside `<main>` remain
in the measurement. These are phrase-overlap percentages, not percentages of
all words, semantic uniqueness scores or Google spam scores.

Every revised URL was compared with all **81 other service URLs** in the
82-page service corpus. The highest resulting overlap was **13.64%**. All nine
are below the requested 25%; Google publishes no corresponding compliance
threshold and lower overlap does not guarantee indexing or ranking improvements.

The automated audit checks HTTP status, title, H1, description, canonical,
robots directives, existing link destinations and unchanged Service/Breadcrumb
schema. Revised FAQ schema must exactly match the rendered questions and
answers. It also compares every untargeted service page with the original
snapshot. Only the nine revised URLs receive a new sitemap `lastmod`; the URL
set and robots.txt remain intact. See `service-content-audit-2026-10-25.json`.

Latest GitHub main `dc015ab` was incorporated with a fast-forward merge,
including the mobile contact bar and grouped enquiry options. Content edits
were backed up and verified unchanged across that merge. This work remains
ready for the production release through the existing GitHub Actions workflow
on `main`.

Validation: full lint and production build passed after the merge; the rendered
82-page audit reported no failures. The imported mobile contact bar was then
adjusted to stack icons and labels below 360px, keeping its WhatsApp label
inside the button. DOM bounds checks passed at 280, 320, 360, 375, 414 and 767px;
the bar correctly hides at the 768px desktop breakpoint. Its call routing,
WhatsApp destination and Book Visit event remain unchanged. A further
production build and targeted lint passed for that adjustment.

The final release check compared all 106 sitemap pages with the live site.
Only the nine intended main-content blocks changed. Titles, descriptions,
H1s, canonicals, index directives, existing links and non-FAQ structured data
were preserved. All revised FAQ schema matched the rendered copy. robots.txt
and llms.txt stayed identical, and Googlebot, OAI-SearchBot and GPTBot received
the same server-rendered sample page. Health, the legacy OLED destination and
intentional landing-page exclusion passed. See
`final-seo-aio-geo-audit-2026-10-25.json` for the result and its limits.

To repeat the audit, save a baseline before editing and compare a production
preview afterward:

```powershell
python scripts/audit-service-content.py --url https://grsolution.co.in --snapshot C:/path/before.json
python scripts/audit-service-content.py --url http://127.0.0.1:3100 --baseline C:/path/before.json --output C:/path/audit.json
```
