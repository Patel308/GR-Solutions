# Keyword Optimization Pass 2

This pass maps the next 35 Keyword Planner opportunities to one canonical page per intent. The goal is to strengthen existing pages first and create only useful supporting blog pages where the intent is informational or cost-focused.

## Keyword-To-Page Mapping

| # | Keyword | Canonical page | Action |
|---:|---|---|---|
| 1 | samsung led tv repair in delhi | `/services/samsung-tv-repair-delhi` | Optimize existing brand page |
| 2 | tv repair ghaziabad | `/services/tv-repair-ghaziabad` | Optimize existing city page |
| 3 | samsung tv service centre noida | `/services/samsung-tv-repair-noida` | Optimize existing brand page with safe service-centre wording |
| 4 | vu tv repair near me | `/services/tv-repair-near-me` | Optimize existing near-me page |
| 5 | lcd tv repair noida | `/services/lcd-tv-repair-noida` | Optimize existing service-city page |
| 6 | sony led tv service center near me | `/services/tv-repair-near-me` | Map to near-me canonical page |
| 7 | near me tv repair shop | `/services/tv-repair-near-me` | Map to near-me canonical page |
| 8 | samsung tv repair noida | `/services/samsung-tv-repair-noida` | Optimize existing brand page |
| 9 | led tv repair service in delhi | `/services/led-tv-repair-delhi` | Optimize existing service-city page |
| 10 | mi tv repair delhi | `/services/mi-tv-repair-delhi` | Optimize existing brand page |
| 11 | lg led tv repair near me | `/services/tv-repair-near-me` | Map to near-me canonical page |
| 12 | best tv repair near me | `/services/tv-repair-near-me` | Map to near-me canonical page |
| 13 | led tv repair in vaishali ghaziabad | `/services/led-tv-repair-ghaziabad` | Optimize existing service-city page |
| 14 | tv repair service in delhi | `/services/tv-repair-delhi` | Optimize existing city page |
| 15 | mi tv repair noida | `/services/mi-tv-repair-noida` | Optimize existing brand page |
| 16 | smart tv repair near me | `/services/tv-repair-near-me` | Map to near-me canonical page |
| 17 | samsung tv repair delhi | `/services/samsung-tv-repair-delhi` | Optimize existing brand page |
| 18 | lg led tv repair in delhi | `/services/lg-tv-repair-delhi` | Optimize existing brand page |
| 19 | plasma tv repair delhi | `/services/plasma-tv-repair-delhi` | Optimize existing service-city page |
| 20 | led tv screen replacement cost in delhi | `/blog/led-tv-screen-replacement-cost-delhi` | Create useful blog guide |
| 21 | led tv panel repair delhi | `/blog/led-tv-panel-repair-delhi` | Create useful blog guide |
| 22 | lg oled tv repair near me | `/services/tv-repair-near-me` | Map to near-me canonical page |
| 23 | led tv screen repair in delhi | `/blog/led-tv-screen-repair-delhi-ncr` | Create useful blog guide |
| 24 | curved tv repair near me | `/services/tv-repair-near-me` | Map to near-me canonical page |
| 25 | qled tv repair delhi | `/services/oled-qled-tv-repair-delhi` | Optimize existing OLED/QLED canonical page |
| 26 | lcd tv repair cost delhi | `/blog/lcd-tv-repair-cost-delhi-ncr` | Create useful Delhi NCR cost guide |
| 27 | lcd tv repair cost ghaziabad | `/blog/lcd-tv-repair-cost-delhi-ncr` | Map to shared cost guide |
| 28 | lcd tv repair cost greater noida | `/blog/lcd-tv-repair-cost-delhi-ncr` | Map to shared cost guide |
| 29 | lcd tv repair cost noida | `/blog/lcd-tv-repair-cost-delhi-ncr` | Map to shared cost guide |
| 30 | led tv screen repair ghaziabad | `/blog/led-tv-screen-repair-delhi-ncr` | Map to shared screen repair guide |
| 31 | led tv screen repair greater noida | `/blog/led-tv-screen-repair-delhi-ncr` | Map to shared Delhi NCR screen repair guide |
| 32 | led tv screen repair noida | `/blog/led-tv-screen-repair-delhi-ncr` | Map to shared Delhi NCR screen repair guide |
| 33 | tv backlight repair delhi | `/services/led-tv-repair-delhi` | Optimize LED Delhi canonical page |
| 34 | tv backlight repair ghaziabad | `/services/led-tv-repair-ghaziabad` | Optimize LED Ghaziabad canonical page |
| 35 | tv backlight repair greater noida | `/services/led-tv-repair-greater-noida` | Optimize LED Greater Noida canonical page |

## Cannibalization Rules

- No duplicate `service-centre` URLs are created for Samsung, Sony, or LG.
- No duplicate `qled-tv-repair-delhi` page is created; QLED maps to the existing OLED/QLED Delhi page.
- All near-me brand and type variants map to `/services/tv-repair-near-me`.
- Cost variants are grouped into two useful guides instead of separate thin city pages.
