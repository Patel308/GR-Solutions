# Google index coverage: 18 November 2026

URL Inspection API (repo read-only access) for all 112 sitemap URLs, plus the
live-site crawl (`tools/seo-audit`, 18 Nov) and GSC search analytics (90 days).

## Summary

| Status | URLs |
| --- | --- |
| Submitted and indexed | 95 (85%) |
| Crawled - currently not indexed | 10 |
| Discovered - currently not indexed | 4 |
| URL is unknown to Google | 3 |

No URL has a Google-selected canonical that differs from ours, and none is
blocked by robots.txt or noindex.

## Not indexed

| URL | Status | Last crawl | Internal links in | GSC impressions (90d) |
| --- | --- | --- | --- | --- |
| /services/samsung-tv-repair-noida | Crawled, not indexed | 2026-10-17 | 16 | 0 |
| /services/tcl-tv-repair-ghaziabad | Crawled, not indexed | 2026-10-08 | 14 | 0 |
| /services/oled-qled-tv-repair-delhi | Crawled, not indexed | 2026-11-03 | 12 | 0 |
| /services/panasonic-tv-repair-delhi | Crawled, not indexed | 2026-10-21 | 11 | 0 |
| /services/plasma-tv-repair-ghaziabad | Crawled, not indexed | 2026-10-16 | 11 | 0 |
| /services/lcd-tv-repair-greater-noida | Crawled, not indexed | 2026-11-02 | 10 | 0 |
| /services/panasonic-tv-repair-greater-noida | Crawled, not indexed | 2026-08-06 | 10 | 0 |
| /services/oled-qled-tv-repair-greater-noida | Crawled, not indexed | 2026-10-06 | 9 | 0 |
| /services/hisense-tv-repair-ghaziabad | Crawled, not indexed | 2026-11-06 | 4 | 0 |
| /services/vu-tv-repair-greater-noida | Crawled, not indexed | 2026-09-25 | 4 | 0 |
| /blog/authorised-service-centre-vs-local-tv-repair | Discovered, not crawled | - | 11 | 0 (published 17 Nov) |
| /services/smart-tv-repair | Discovered, not crawled | - | 5 | 0 (published 29 Oct) |
| /services/tv-repair-dwarka | Discovered, not crawled | - | 5 | 0 (published 29 Oct) |
| /services/toshiba-tv-repair-delhi | Discovered, not crawled | - | 4 | 0 |
| /blog/how-to-choose-tv-repair-service-delhi-ncr | Unknown to Google | - | 11 | 0 (published 17 Nov) |
| /services/brands | Unknown to Google | - | 114 (site-wide nav) | 0 |
| /services/tv-repair-noida-sector-137 | Unknown to Google | - | 3 | 0 (published 25 Sep) |

## Causes

1. **Templated brand x city pages are near-duplicates of each other.**
   Rendered main copy, 5-word-sequence overlap: the same brand across its four
   cities averages 75% (Panasonic 74.8%, maximum 77.8%). All brand x city pairs
   average 35.7%, service x city pages 22.6%, locality pages 17.2%. Google indexes
   some pages from a near-duplicate set and leaves the rest "crawled, not
   indexed". 6 of the 10 crawled-not-indexed URLs are brand x city pages.
2. **Recrawl lag.** Several pages were last crawled before they were improved:
   Panasonic Greater Noida on 6 Aug and Vu Greater Noida on 25 Sep (both before
   the 25 Oct content revision), and every page before the 17 Nov key-facts
   block. Google has not yet seen the current versions. IndexNow does not reach
   Google.
3. **Weak internal linking and crawl priority on a small site.** The "discovered"
   and "unknown" pages have 3-5 internal links (Sector 137 has 3 after nearly two
   months). Google knows the URLs but has not prioritised crawling them.
4. **New pages.** The two decision guides were published on 17 Nov.

None of the not-indexed URLs had impressions in the last 90 days, so no current
traffic is being lost. The commercially important ones to recover are Samsung
Noida, OLED/QLED Delhi, Smart TV repair, Dwarka and the two guides.

## Actions

1. In Search Console, resubmit `sitemap.xml`, then request indexing (about 10 a
   day) in this order: the two guides, /services/smart-tv-repair,
   /services/tv-repair-dwarka, /services/samsung-tv-repair-noida,
   /services/oled-qled-tv-repair-delhi, /services/tv-repair-noida-sector-137,
   /services/brands, /services/toshiba-tv-repair-delhi,
   /services/plasma-tv-repair-ghaziabad.
2. Add contextual internal links to the under-linked pages from strong indexed
   pages (for example Smart TV repair from the core service pages, Dwarka and
   Sector 137 from their city hubs), keeping every change additive.
3. Do not add more brand x city combinations. Differentiate the brand pages
   that have demand (Samsung, Sony) with brand-specific facts, as the Sony
   out-of-warranty note does. Consider consolidating low-demand brand x city
   pages only with evidence, and after the 15 Dec measurement.
4. Re-run this inspection after about four weeks and compare.
