# Launch map: every URL, live site vs new build

Live: `snapshots/live-2026-11-02` · New: `snapshots/current`

- URLs: 111. Status code, sitemap membership, title, meta description, canonical, robots, H1–H3 (main content), internal links and image alt text identical on **101**; on the rest every difference is a signed-off change (rule named in the cell).
- Unapproved violations: **0**.
- \* JSON-LD: every difference is checked by diff.mjs; on this launch the only JSON-LD change is the telephone (owner decision D1, approved rule `owner-organic-number`). Any other JSON-LD change would be a violation.

| URL | Live | New | Title | Meta description | Canonical + robots | H1–H3 | Internal links | Images (file + alt) | JSON-LD | Diff items (violation / review / approved) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 200 | 200 | same | same | same | same | all kept | 20 changed (approved: stock-images) | phone only* | 0 / 4 / 29 |
| `/about` | 200 | 200 | same | same | same | changed (approved: owner-5-years) | all kept | 1 changed (approved: stock-images) | phone only* | 0 / 1 / 20 |
| `/blog` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 1 / 12 |
| `/blog/lcd-tv-repair-cost-delhi-ncr` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/led-tv-panel-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/led-tv-screen-repair-delhi-ncr` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/led-tv-screen-replacement-cost-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/prepare-for-doorstep-tv-repair` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-backlight-failure-symptoms` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-keeps-restarting` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-motherboard-diagnosis` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-not-turning-on` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-repair-cost-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-repair-cost-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-repair-cost-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-repair-cost-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-repair-vs-replacement-guide` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-screen-lines-vertical-horizontal` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-screen-replacement-cost-delhi-ncr` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/blog/tv-sound-but-no-picture` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 14 |
| `/contact` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 2 / 17 |
| `/landing` | 200 (not in sitemap) | 200 | same | same | same | same | all kept | 3 changed (approved: stock-images) | phone only* | 0 / 2 / 19 |
| `/pricing` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 14 |
| `/privacy` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/reviews` | 200 | 200 | same | same | same | same | all kept | 3 changed (approved: stock-images) | phone only* | 0 / 1 / 13 |
| `/services` | 200 | 200 | same | same | same | same | all kept | 5 changed (approved: stock-images) | phone only* | 0 / 1 / 17 |
| `/services/brands` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 14 |
| `/services/curved-tv-repair` | 200 | 200 | same | same | same | same | all kept | 3 changed (approved: stock-images) | phone only* | 0 / 2 / 18 |
| `/services/curved-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/curved-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/curved-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/curved-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/hisense-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/hisense-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/hisense-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/hisense-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/lcd-tv-repair` | 200 | 200 | same | same | same | same | all kept | 3 changed (approved: stock-images) | phone only* | 0 / 2 / 18 |
| `/services/lcd-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/lcd-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/lcd-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/lcd-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/led-tv-repair` | 200 | 200 | same | same | same | same | all kept | 3 changed (approved: stock-images) | phone only* | 0 / 2 / 18 |
| `/services/led-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/led-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/led-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/led-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/lg-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/lg-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/lg-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/lg-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/mi-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/mi-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/mi-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/mi-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/oled-qled-tv-repair` | 200 | 200 | same | same | same | same | all kept | 3 changed (approved: stock-images) | phone only* | 0 / 2 / 18 |
| `/services/oled-qled-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/oled-qled-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/oled-qled-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/oled-qled-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/oneplus-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/oneplus-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/oneplus-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/oneplus-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/panasonic-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/panasonic-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/panasonic-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/panasonic-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/philips-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/philips-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/philips-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/philips-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/plasma-tv-repair` | 200 | 200 | same | same | same | same | all kept | 3 changed (approved: stock-images) | phone only* | 0 / 2 / 18 |
| `/services/plasma-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/plasma-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/plasma-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/plasma-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/samsung-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/samsung-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/samsung-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/samsung-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/smart-tv-repair` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/sony-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/sony-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/sony-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/sony-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/tcl-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/tcl-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/tcl-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/tcl-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/toshiba-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/toshiba-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/toshiba-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/toshiba-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-dwarka` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/tv-repair-east-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-indirapuram` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-near-me` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-noida-sector-137` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-noida-sector-62` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-south-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-vasundhara` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/tv-repair-west-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 16 |
| `/services/vu-tv-repair-delhi` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/vu-tv-repair-ghaziabad` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/services/vu-tv-repair-greater-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
| `/services/vu-tv-repair-noida` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 17 |
| `/terms` | 200 | 200 | same | same | same | same | all kept | all kept | phone only* | 0 / 0 / 12 |
