# Mobile Lighthouse

Lighthouse 13.5.0, mobile, simulate throttling (RTT 150 ms, 1.6 Mbps, CPU x4). 3 runs per page, median run shown. Host benchmarkIndex 2428. Google Analytics blocked.

| Page | Perf | A11y | Best Pr. | SEO | FCP | LCP | TBT | CLS | SI | Weight | Perf runs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home (`/`) | 95 | 90 | 96 | 100 | 1.5 s | 2.9 s | 34 ms | 0.000 | 1.5 s | 443 KB | 99 / 97 / 95 |
| Service: OLED/QLED TV Repair (`/services/oled-qled-tv-repair`) | 98 | 94 | 100 | 100 | 1.5 s | 2.3 s | 36 ms | 0.000 | 1.5 s | 317 KB | 98 / 96 / 98 |
| City: TV Repair in Noida (`/services/tv-repair-noida`) | 96 | 94 | 100 | 100 | 1.5 s | 2.7 s | 28 ms | 0.000 | 1.5 s | 327 KB | 96 / 98 / 98 |
| Blog index (`/blog`) | 96 | 94 | 100 | 100 | 1.5 s | 2.7 s | 37 ms | 0.000 | 1.5 s | 329 KB | 95 / 96 / 97 |
| Blog post: TV Repair Cost in Delhi (`/blog/tv-repair-cost-delhi`) | 97 | 95 | 100 | 100 | 1.5 s | 2.5 s | 53 ms | 0.000 | 1.5 s | 363 KB | 97 / 97 / 96 |

## Home (`/`)

- LCP element: `<img alt="GR Solution TV repair service logo" width="150" height="50" decoding="async" data-nimg="1" class="h-auto w-[116px] object-contain sm:w-[132px] lg:w-[150px]" style="color:transparent" srcset="/_next/image?url=%2Fimages%2Flogo.jpg&amp;w=256&amp;q=75 1x, /_next/image?url=%2Fi…" src="/_next/image?url=%2Fimages%2Flogo.jpg&amp;w=384&amp;q=75">` ("GR Solution TV repair service logo"), top 1px, height 63px
  - LCP subparts (ms): timeToFirstByte 10, resourceLoadDelay 12, resourceLoadDuration 17, elementRenderDelay 118
- Requests by type: total 36 (443 KB), image 3 (185 KB), script 11 (166 KB), other 20 (57 KB), document 1 (23 KB), stylesheet 1 (12 KB), media 0 (0 KB), font 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: color-contrast, heading-order, select-name
- Failing best-practices: image-aspect-ratio
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~300 ms, ~26 KB)
  - Improve image delivery — Est savings of 62 KiB
  - LCP request discovery
  - Network dependency tree
  - Render-blocking requests

## Service: OLED/QLED TV Repair (`/services/oled-qled-tv-repair`)

- LCP element: `<p class="mt-6 rounded-2xl border border-primary/10 bg-bgLight p-5 text-lg font-bold…">` ("GR Solution repairs OLED and QLED televisions across Delhi NCR, covering board,…"), top 422px, height 303px
  - LCP subparts (ms): timeToFirstByte 10, elementRenderDelay 136
- Requests by type: total 37 (317 KB), script 12 (167 KB), image 2 (63 KB), other 21 (57 KB), document 1 (18 KB), stylesheet 1 (12 KB), media 0 (0 KB), font 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: color-contrast, heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~26 KB)
  - Improve image delivery — Est savings of 38 KiB
  - Network dependency tree
  - Render-blocking requests — Est savings of 0 ms

## City: TV Repair in Noida (`/services/tv-repair-noida`)

- LCP element: `<p class="mt-6 rounded-2xl border border-primary/10 bg-white p-5 text-lg font-bold l…">` ("Need TV repair in Noida? GR Solution provides doorstep inspection, diagnosis, a…"), top 422px, height 216px
  - LCP subparts (ms): timeToFirstByte 13, elementRenderDelay 139
- Requests by type: total 37 (327 KB), script 12 (167 KB), image 2 (63 KB), other 21 (57 KB), document 1 (28 KB), stylesheet 1 (12 KB), media 0 (0 KB), font 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: color-contrast, heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~300 ms, ~26 KB)
  - Legacy JavaScript — Est savings of 14 KiB (~150 ms)
  - Improve image delivery — Est savings of 48 KiB
  - Network dependency tree
  - Render-blocking requests

## Blog index (`/blog`)

- LCP element: `<h1 class="mt-7 text-[clamp(3rem,5.5vw,5rem)] font-black leading-tight text-secondary">` ("TV Repair Tips & Guides for Delhi, Noida & NCR Residents"), top 224px, height 240px
  - LCP subparts (ms): timeToFirstByte 9, elementRenderDelay 132
- Requests by type: total 31 (329 KB), script 11 (166 KB), image 2 (85 KB), other 16 (50 KB), document 1 (16 KB), stylesheet 1 (12 KB), media 0 (0 KB), font 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: color-contrast, heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~300 ms, ~26 KB)
  - Improve image delivery — Est savings of 58 KiB
  - Network dependency tree
  - Render-blocking requests — Est savings of 0 ms

## Blog post: TV Repair Cost in Delhi (`/blog/tv-repair-cost-delhi`)

- LCP element: `<p class="mt-6 rounded-2xl border border-primary/10 bg-white p-5 text-lg font-bold l…">` ("TV repair cost in Delhi is decided by which component failed, not by the brand.…"), top 525px, height 333px
  - LCP subparts (ms): timeToFirstByte 15, elementRenderDelay 157
- Requests by type: total 33 (363 KB), script 12 (167 KB), image 2 (111 KB), other 17 (51 KB), document 1 (21 KB), stylesheet 1 (12 KB), media 0 (0 KB), font 0 (0 KB), third-party 2 (0 KB)
- Failing accessibility: color-contrast, heading-order
- Top performance insights:
  - Reduce unused JavaScript — Est savings of 26 KiB (~300 ms, ~26 KB)
  - Improve image delivery — Est savings of 90 KiB
  - Network dependency tree
  - Render-blocking requests

