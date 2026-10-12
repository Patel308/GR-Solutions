# Interleaved mobile Lighthouse A/B

Builds: **Live site (main / Next 16.2.9)** (`base`), **Old design on Next 16.4 (turbopackSharedRuntime off)** (`fw`), **New site** (`new`). Runs alternate build by build, page by page.
Lighthouse default mobile settings (simulated slow 4G, 4× CPU), Google Analytics blocked.

| Page | Runs | Perf, median | LCP, median | LCP, mean | LCP, range | FCP, median | TBT, median | CLS, max | Weight, median |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | 7 / 7 / 7 | 97 / 95 / 98 | 2.59 / 2.82 / 2.37 s | 2.58 / 2.79 / 2.47 s | 2.18–2.96 / 2.45–3.39 / 2.15–3.24 s | 1.5 / 1.5 / 1.5 s | 43 / 55 / 48 ms | 0.000 / 0.000 / 0.000 | 443 KB / 427 KB / 299 KB |
| Service: OLED/QLED TV Repair | 7 / 7 / 7 | 96 / 97 / 97 | 2.53 / 2.41 / 2.52 s | 2.44 / 2.43 / 2.41 s | 2.00–2.71 / 2.24–2.58 / 2.07–2.71 s | 1.5 / 1.5 / 1.5 s | 38 / 62 / 37 ms | 0.000 / 0.000 / 0.000 | 317 KB / 301 KB / 288 KB |
| City: TV Repair in Noida | 7 / 7 / 7 | 96 / 97 / 98 | 2.53 / 2.51 / 2.23 s | 2.46 / 2.35 / 2.36 s | 2.00–2.76 / 2.01–2.63 / 2.07–2.67 s | 1.5 / 1.5 / 1.5 s | 40 / 40 / 51 ms | 0.000 / 0.000 / 0.000 | 327 KB / 310 KB / 298 KB |
| Blog index | 7 / 7 / 7 | 96 / 98 / 98 | 2.63 / 2.24 / 2.36 s | 2.56 / 2.28 / 2.41 s | 2.01–2.85 / 2.15–2.52 / 2.01–2.78 s | 1.5 / 1.5 / 1.5 s | 33 / 45 / 40 ms | 0.000 / 0.000 / 0.000 | 329 KB / 315 KB / 312 KB |
| Blog post: TV Repair Cost in Delhi | 7 / 7 / 7 | 97 / 97 / 96 | 2.48 / 2.50 / 2.63 s | 2.44 / 2.41 / 2.46 s | 2.02–2.79 / 2.17–2.54 / 2.21–2.68 s | 1.5 / 1.5 / 1.5 s | 41 / 49 / 41 ms | 0.000 / 0.000 / 0.000 | 363 KB / 347 KB / 297 KB |

Each cell lists the builds in this order: Live site (main / Next 16.2.9) / Old design on Next 16.4 (turbopackSharedRuntime off) / New site.

LCP of every run (ms):

- Home: Live site (main / Next 16.2.9) 2301, 2595, 2958, 2589, 2914, 2179, 2514; Old design on Next 16.4 (turbopackSharedRuntime off) 3392, 2855, 2853, 2691, 2468, 2454, 2819; New site 2145, 2379, 3237, 2358, 2365, 2514, 2304
- Service: OLED/QLED TV Repair: Live site (main / Next 16.2.9) 2531, 2297, 2004, 2302, 2568, 2712, 2691; Old design on Next 16.4 (turbopackSharedRuntime off) 2403, 2518, 2406, 2490, 2382, 2584, 2238; New site 2224, 2517, 2516, 2073, 2625, 2710, 2211
- City: TV Repair in Noida: Live site (main / Next 16.2.9) 2528, 2754, 2001, 2532, 2045, 2628, 2764; Old design on Next 16.4 (turbopackSharedRuntime off) 2628, 2013, 2514, 2238, 2534, 2533, 2022; New site 2513, 2067, 2215, 2230, 2630, 2217, 2671
- Blog index: Live site (main / Next 16.2.9) 2826, 2373, 2627, 2007, 2642, 2851, 2618; Old design on Next 16.4 (turbopackSharedRuntime off) 2186, 2238, 2516, 2306, 2153, 2386, 2188; New site 2255, 2627, 2780, 2291, 2360, 2006, 2584
- Blog post: TV Repair Cost in Delhi: Live site (main / Next 16.2.9) 2237, 2245, 2015, 2657, 2475, 2668, 2792; Old design on Next 16.4 (turbopackSharedRuntime off) 2165, 2509, 2311, 2502, 2306, 2536, 2536; New site 2636, 2214, 2211, 2632, 2230, 2650, 2680
