# Responsive audit

CSS pixels. "CTA top" is the first call/WhatsApp/booking link inside `<main>` (fixed floating buttons and the header excluded).

| Page | Width | H-scroll | H1 size / lines / height (% of screen) | H1 bottom | First CTA in main (top, above fold?) | Body text | Header | Tap targets < 48px | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 360 | no | 32px / 3 / 106px (13%) | 247 | 576 (yes) "Call now" | 17px / 1.63 | 64px | 1 of 76 | 0 |
| /services/oled-qled-tv-repair | 360 | no | 32px / 2 / 70px (9%) | 240 | 628 (yes) "Call Now" | 17.02px / 1.6 | 64px | 1 of 61 | 0 |
| /services/tv-repair-noida | 360 | no | 32px / 1 / 35px (4%) | 242 | 548 (yes) "Call GR Solution" | 17.02px / 1.6 | 64px | 1 of 76 | 0 |
| /blog | 360 | no | 32px / 4 / 141px (18%) | 275 | 8303 (**no**) "Call Now" | 16.008px / 1.63 | 64px | 1 of 57 | 0 |
| /blog/tv-repair-cost-delhi | 360 | no | 32px / 3 / 106px (13%) | 276 | 5973 (**no**) "Call now" | 17.02px / 1.6 | 64px | 3 of 60 | 0 |
| /contact | 360 | no | 32px / 2 / 70px (9%) | 204 | 381 (yes) "Call now" | 17.08px / 1.6 | 64px | 1 of 45 | 0 |
| / | 390 | no | 32.6px / 3 / 108px (13%) | 249 | 550 (yes) "Call now" | 17px / 1.63 | 64px | 1 of 76 | 0 |
| /services/oled-qled-tv-repair | 390 | no | 32.6px / 2 / 72px (9%) | 243 | 603 (yes) "Call Now" | 17.065px / 1.6 | 64px | 1 of 61 | 0 |
| /services/tv-repair-noida | 390 | no | 32.6px / 1 / 36px (4%) | 207 | 485 (yes) "Call GR Solution" | 17.065px / 1.6 | 64px | 1 of 76 | 0 |
| /blog | 390 | no | 32.6px / 3 / 108px (13%) | 243 | 7908 (**no**) "Call Now" | 16.062px / 1.62 | 64px | 1 of 57 | 0 |
| /blog/tv-repair-cost-delhi | 390 | no | 32.6px / 3 / 108px (13%) | 279 | 5790 (**no**) "Call now" | 17.065px / 1.6 | 64px | 3 of 60 | 0 |
| /contact | 390 | no | 32.6px / 2 / 72px (9%) | 207 | 384 (yes) "Call now" | 17.17px / 1.6 | 64px | 1 of 45 | 0 |
| / | 414 | no | 33.08px / 3 / 109px (12%) | 250 | 552 (yes) "Call now" | 17px / 1.63 | 64px | 1 of 76 | 0 |
| /services/oled-qled-tv-repair | 414 | no | 33.08px / 2 / 73px (8%) | 244 | 577 (yes) "Call Now" | 17.101px / 1.6 | 64px | 1 of 61 | 0 |
| /services/tv-repair-noida | 414 | no | 33.08px / 1 / 36px (4%) | 207 | 458 (yes) "Call GR Solution" | 17.101px / 1.6 | 64px | 1 of 76 | 0 |
| /blog | 414 | no | 33.08px / 3 / 109px (12%) | 244 | 7661 (**no**) "Call Now" | 16.1052px / 1.62 | 64px | 1 of 57 | 0 |
| /blog/tv-repair-cost-delhi | 414 | no | 33.08px / 3 / 109px (12%) | 280 | 5655 (**no**) "Call now" | 17.101px / 1.6 | 64px | 3 of 60 | 0 |
| /contact | 414 | no | 33.08px / 2 / 73px (8%) | 208 | 358 (yes) "Call now" | 17.242px / 1.6 | 64px | 1 of 45 | 0 |
| / | 768 | no | 40.16px / 2 / 88px (9%) | 222 | 414 (yes) "Call now" | 17px / 1.63 | 64px | 3 of 77 | 0 |
| /services/oled-qled-tv-repair | 768 | no | 40.16px / 1 / 44px (4%) | 216 | 480 (yes) "Call Now" | 17.632px / 1.6 | 64px | 3 of 62 | 0 |
| /services/tv-repair-noida | 768 | no | 40.16px / 1 / 44px (4%) | 216 | 423 (yes) "Call GR Solution" | 17.632px / 1.6 | 64px | 3 of 77 | 0 |
| /blog | 768 | no | 40.16px / 3 / 133px (13%) | 269 | 7878 (**no**) "Call Now" | 16.7424px / 1.63 | 64px | 3 of 58 | 0 |
| /blog/tv-repair-cost-delhi | 768 | no | 40.16px / 2 / 88px (9%) | 260 | 3666 (**no**) "Call now" | 17.632px / 1.6 | 64px | 5 of 61 | 0 |
| /contact | 768 | no | 40.16px / 2 / 88px (9%) | 224 | 352 (yes) "Call now" | 18.304px / 1.6 | 64px | 4 of 46 | 0 |
| / | 1280 | no | 50.4px / 3 / 166px (21%) | 398 | 619 (yes) "Call now" | 18px / 1.56 | 80px | 22 of 79 | 0 |
| /services/oled-qled-tv-repair | 1280 | no | 50.4px / 2 / 111px (14%) | 319 | 589 (yes) "Call Now" | 18.4px / 1.6 | 80px | 22 of 64 | 0 |
| /services/tv-repair-noida | 1280 | no | 50.4px / 1 / 55px (7%) | 263 | 475 (yes) "Call GR Solution" | 18.4px / 1.6 | 80px | 22 of 79 | 0 |
| /blog | 1280 | no | 50.4px / 3 / 166px (21%) | 384 | 5261 (**no**) "Call Now" | 17px / 1.63 | 80px | 22 of 60 | 0 |
| /blog/tv-repair-cost-delhi | 1280 | no | 50.4px / 3 / 166px (21%) | 374 | 3165 (**no**) "Call now" | 18.4px / 1.6 | 80px | 24 of 62 | 0 |
| /contact | 1280 | no | 50.4px / 2 / 111px (14%) | 327 | 462 (yes) "Call now" | 19.84px / 1.6 | 80px | 22 of 48 | 0 |
| / | 1440 | no | 52px / 3 / 172px (19%) | 401 | 622 (yes) "Call now" | 18px / 1.56 | 80px | 22 of 79 | 0 |
| /services/oled-qled-tv-repair | 1440 | no | 52px / 2 / 114px (13%) | 322 | 593 (yes) "Call Now" | 18.5008px / 1.6 | 80px | 22 of 64 | 0 |
| /services/tv-repair-noida | 1440 | no | 52px / 1 / 57px (6%) | 265 | 506 (yes) "Call GR Solution" | 18.5008px / 1.6 | 80px | 22 of 79 | 0 |
| /blog | 1440 | no | 52px / 3 / 172px (19%) | 387 | 5276 (**no**) "Call Now" | 17px / 1.63 | 80px | 22 of 60 | 0 |
| /blog/tv-repair-cost-delhi | 1440 | no | 52px / 3 / 172px (19%) | 380 | 3178 (**no**) "Call now" | 18.5008px / 1.6 | 80px | 24 of 62 | 0 |
| /contact | 1440 | no | 52px / 2 / 114px (13%) | 328 | 464 (yes) "Call now" | 20px / 1.6 | 80px | 22 of 48 | 0 |

## Fixed overlays and overflow details

- `/` @360: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":731,"width":360,"height":69}]
- `/services/oled-qled-tv-repair` @360: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":731,"width":360,"height":69}]
- `/services/tv-repair-noida` @360: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":731,"width":360,"height":69}]
- `/blog` @360: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":731,"width":360,"height":69}]
- `/blog/tv-repair-cost-delhi` @360: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":731,"width":360,"height":69}]
- `/contact` @360: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":731,"width":360,"height":69}]
- `/` @390: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":775,"width":390,"height":69}]
- `/services/oled-qled-tv-repair` @390: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":775,"width":390,"height":69}]
- `/services/tv-repair-noida` @390: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":775,"width":390,"height":69}]
- `/blog` @390: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":775,"width":390,"height":69}]
- `/blog/tv-repair-cost-delhi` @390: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":775,"width":390,"height":69}]
- `/contact` @390: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":775,"width":390,"height":69}]
- `/` @414: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":827,"width":414,"height":69}]
- `/services/oled-qled-tv-repair` @414: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":827,"width":414,"height":69}]
- `/services/tv-repair-noida` @414: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":827,"width":414,"height":69}]
- `/blog` @414: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":827,"width":414,"height":69}]
- `/blog/tv-repair-cost-delhi` @414: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":827,"width":414,"height":69}]
- `/contact` @414: fixed [{"what":"Call WhatsApp Book Visit","left":0,"top":827,"width":414,"height":69}]
