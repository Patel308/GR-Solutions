# Mobile Lighthouse

Lighthouse 13.5.0, mobile, simulate throttling (RTT 150 ms, 1.6 Mbps, CPU x4). 5 runs per page, median run shown. Host benchmarkIndex 2648. Google Analytics blocked.

| Page | Perf | A11y | Best Pr. | SEO | FCP | LCP | TBT | CLS | SI | Weight | Perf runs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home (`/`) | 97 | 99 | 100 | 100 | 1.5 s | 2.6 s | 40 ms | 0.000 | 1.5 s | 299 KB | 96 / 97 / 96 / 97 / 98 |
| Service: OLED/QLED TV Repair (`/services/oled-qled-tv-repair`) | 99 | 98 | 100 | 100 | 1.5 s | 2.1 s | 43 ms | 0.000 | 1.5 s | 288 KB | 96 / 98 / 99 / 96 / 99 |
| City: TV Repair in Noida (`/services/tv-repair-noida`) | 96 | 99 | 100 | 100 | 1.5 s | 2.7 s | 60 ms | 0.000 | 1.5 s | 298 KB | 97 / 97 / 97 / 96 / 96 |
| Blog index (`/blog`) | 96 | 98 | 100 | 100 | 1.5 s | 2.7 s | 39 ms | 0.000 | 1.5 s | 301 KB | 96 / 96 / 99 / 97 / 98 |
| Blog post: TV Repair Cost in Delhi (`/blog/tv-repair-cost-delhi`) | 97 | 99 | 100 | 100 | 1.5 s | 2.5 s | 43 ms | 0.000 | 1.5 s | 297 KB | 97 / 97 / 97 / 98 / 97 |

## Home (`/`)

- LCP element: `<img alt="GR Solution technician repairing LED TV at home in Delhi NCR" fetchpriority="high" width="1024" height="1024" decoding="async" data-nimg="1" class="aspect-[4/3] w-full object-cover lg:aspect-[5/6]" style="color:transparent" sizes="(min-width: 992px) 560px, calc(100vw - 2rem)" srcset="/_next/image?url=%2Fimages%2Fhero.webp&amp;w=32&amp;q=75 32w, /_next/image?url=%2F…" src="http://localhost:3100/_next/image?url=%2Fimages%2Fhero.webp&amp;w=750&amp;q=75">` ("GR Solution technician repairing LED TV at home in Delhi NCR"), top 692px, height 285px
  - LCP subparts (ms): timeToFirstByte 17, resourceLoadDelay 15, resourceLoadDuration 11, elementRenderDelay 164
- Requests by type: total 29 (299 KB), script 10 (158 KB), other 12 (58 KB), image 4 (30 KB), document 1 (27 KB), stylesheet 1 (19 KB), font 1 (7 KB), media 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~300 ms, ~26 KB)
  - Improve image delivery — Est savings of 16 KiB (~150 ms)
  - Legacy JavaScript — Est savings of 14 KiB (~150 ms)
  - Network dependency tree
  - Render-blocking requests

## Service: OLED/QLED TV Repair (`/services/oled-qled-tv-repair`)

- LCP element: `<p class="answer-box mt-5">` ("GR Solution repairs OLED and QLED televisions across Delhi NCR, covering board,…"), top 263px, height 290px
  - LCP subparts (ms): timeToFirstByte 9, elementRenderDelay 138
- Requests by type: total 27 (288 KB), script 10 (158 KB), other 12 (58 KB), image 2 (24 KB), document 1 (22 KB), stylesheet 1 (19 KB), font 1 (7 KB), media 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: heading-order
- Top performance insights:
  - Reduce unused CSS — Est savings of 10 KiB (~10 KB)
  - Reduce unused JavaScript — Est savings of 26 KiB (~26 KB)
  - Improve image delivery — Est savings of 13 KiB
  - Legacy JavaScript — Est savings of 14 KiB
  - Network dependency tree
  - Render-blocking requests

## City: TV Repair in Noida (`/services/tv-repair-noida`)

- LCP element: `<p class="answer-box mt-5">` ("Need TV repair in Noida? GR Solution provides doorstep inspection, diagnosis, a…"), top 227px, height 208px
  - LCP subparts (ms): timeToFirstByte 15, elementRenderDelay 207
- Requests by type: total 27 (298 KB), script 10 (158 KB), other 12 (58 KB), document 1 (32 KB), image 2 (24 KB), stylesheet 1 (19 KB), font 1 (7 KB), media 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~300 ms, ~26 KB)
  - Legacy JavaScript — Est savings of 14 KiB (~150 ms)
  - Improve image delivery — Est savings of 13 KiB
  - Network dependency tree
  - Render-blocking requests

## Blog index (`/blog`)

- LCP element: `<img alt="GR Solution TV repair guide for Delhi NCR residents" fetchpriority="high" width="650" height="460" decoding="async" data-nimg="1" class="aspect-[650/460] w-full rounded-[1.25rem] object-cover shadow-card-hover r…" style="color:transparent" sizes="(min-width: 1280px) 540px, (min-width: 992px) 42vw, (min-width: 608px) 576…" srcset="/_next/image?url=%2Fimages%2Fhero.webp&amp;w=384&amp;q=75 384w, /_next/image?url=%…" src="http://localhost:3100/_next/image?url=%2Fimages%2Fhero.webp&amp;w=750&amp;q=75">` ("GR Solution TV repair guide for Delhi NCR residents"), top 374px, height 269px
  - LCP subparts (ms): timeToFirstByte 12, resourceLoadDelay 16, resourceLoadDuration 55, elementRenderDelay 136
- Requests by type: total 28 (301 KB), script 10 (158 KB), other 10 (52 KB), image 5 (46 KB), document 1 (19 KB), stylesheet 1 (19 KB), font 1 (7 KB), media 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~150 ms, ~26 KB)
  - Improve image delivery — Est savings of 16 KiB (~150 ms)
  - Reduce unused CSS — Est savings of 12 KiB (~12 KB)
  - Network dependency tree
  - Render-blocking requests

## Blog post: TV Repair Cost in Delhi (`/blog/tv-repair-cost-delhi`)

- LCP element: `<p class="answer-box mt-5">` ("TV repair cost in Delhi is decided by which component failed, not by the brand.…"), top 300px, height 317px
  - LCP subparts (ms): timeToFirstByte 13, elementRenderDelay 151
- Requests by type: total 26 (297 KB), script 11 (159 KB), other 10 (52 KB), image 2 (33 KB), document 1 (27 KB), stylesheet 1 (19 KB), font 1 (7 KB), media 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~300 ms, ~26 KB)
  - Reduce unused CSS — Est savings of 11 KiB (~150 ms, ~11 KB)
  - Legacy JavaScript — Est savings of 14 KiB (~150 ms)
  - Improve image delivery — Est savings of 19 KiB
  - Network dependency tree
  - Render-blocking requests

