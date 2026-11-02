# Interleaved mobile Lighthouse A/B

Builds: **Live site (606f612)** (`live`), **Launch candidate** (`new`). Runs alternate build by build, page by page.
Lighthouse default mobile settings (simulated slow 4G, 4× CPU), Google Analytics blocked.

| Page | Runs | Perf, median | LCP, median | LCP, mean | LCP, range | FCP, median | TBT, median | CLS, max | Weight, median |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | 7 / 7 | 96 / 98 | 2.73 / 2.27 s | 2.69 / 2.33 s | 2.29–3.02 / 2.26–2.57 s | 1.5 / 1.5 s | 49 / 50 ms | 0.000 / 0.000 | 449 KB / 307 KB |
| Service: OLED/QLED TV Repair | 7 / 7 | 98 / 96 | 2.15 / 2.66 s | 2.30 / 2.51 s | 2.09–2.73 / 2.15–2.72 s | 1.5 / 1.5 s | 46 / 56 ms | 0.000 / 0.000 | 328 KB / 301 KB |
| City: TV Repair in Noida | 7 / 7 | 97 / 98 | 2.44 / 2.15 s | 2.44 / 2.31 s | 2.13–2.75 / 2.13–2.74 s | 1.5 / 1.5 s | 53 / 60 ms | 0.000 / 0.000 | 338 KB / 312 KB |
| Blog index | 7 / 7 | 99 / 98 | 2.05 / 2.29 s | 2.24 / 2.40 s | 2.01–2.68 / 2.16–2.92 s | 1.5 / 1.5 s | 48 / 41 ms | 0.000 / 0.000 | 339 KB / 329 KB |
| Blog post: TV Repair Cost in Delhi | 7 / 7 | 96 / 98 | 2.63 / 2.14 s | 2.50 / 2.17 s | 2.07–2.69 / 2.13–2.22 s | 1.5 / 1.5 s | 48 / 53 ms | 0.000 / 0.000 | 309 KB / 299 KB |
| /services/lg-tv-repair-noida | 7 / 7 | 97 / 98 | 2.36 / 2.21 s | 2.36 / 2.31 s | 2.00–2.66 / 2.13–2.66 s | 1.5 / 1.5 s | 49 / 56 ms | 0.000 / 0.000 | 327 KB / 308 KB |
| /services/tv-repair-dwarka | 7 / 7 | 99 / 98 | 2.07 / 2.22 s | 2.20 / 2.36 s | 2.06–2.59 / 2.14–2.69 s | 1.5 / 1.5 s | 48 / 57 ms | 0.000 / 0.000 | 315 KB / 310 KB |

Each cell lists the builds in this order: Live site (606f612) / Launch candidate.

LCP of every run (ms):

- Home: Live site (606f612) 2730, 2289, 3024, 2592, 2667, 2803, 2738; Launch candidate 2270, 2269, 2320, 2340, 2257, 2568, 2267
- Service: OLED/QLED TV Repair: Live site (606f612) 2087, 2134, 2407, 2151, 2445, 2129, 2729; Launch candidate 2674, 2724, 2664, 2511, 2149, 2667, 2210
- City: TV Repair in Noida: Live site (606f612) 2753, 2295, 2733, 2128, 2131, 2593, 2438; Launch candidate 2147, 2156, 2153, 2742, 2142, 2712, 2132
- Blog index: Live site (606f612) 2011, 2048, 2008, 2007, 2684, 2460, 2470; Launch candidate 2163, 2296, 2291, 2584, 2917, 2228, 2289
- Blog post: TV Repair Cost in Delhi: Live site (606f612) 2630, 2290, 2511, 2690, 2069, 2658, 2665; Launch candidate 2139, 2135, 2134, 2211, 2220, 2223, 2133
- /services/lg-tv-repair-noida: Live site (606f612) 2002, 2067, 2360, 2360, 2410, 2641, 2663; Launch candidate 2142, 2206, 2226, 2132, 2141, 2660, 2641
- /services/tv-repair-dwarka: Live site (606f612) 2063, 2282, 2058, 2294, 2071, 2058, 2587; Launch candidate 2137, 2690, 2513, 2673, 2223, 2141, 2136
