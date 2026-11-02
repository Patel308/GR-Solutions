# Lead tracking and forwarding

How the site decides which phone number to show, what happens to every form
lead, and how to switch on the instant alerts. Code: `lib/leads/`,
`app/api/lead/route.js`, `components/ContactChannel.jsx`,
`components/forms/LeadForm.jsx`, `components/CallTracking.jsx`.

## 1. Which number a visitor sees

| Visitor | Number shown |
| --- | --- |
| Search engines and AI crawlers (they read the server HTML), organic Google / Bing, Google Maps, ChatGPT, Perplexity, Gemini, Copilot, social, referral, direct | **+91 93155 15700** (Kamlesh, the SEO/AIO/GEO line) |
| Arrived from a Google Ads click (`gclid`, `gbraid`, `wbraid`, `gad_source`), Microsoft Ads (`msclkid`) or a link tagged `utm_medium=cpc` (or another paid medium) in the last 90 days | **+91 99902 83890** (ads line) |
| The ads-only page `/landing` | ads line |

- Every page's HTML, the schema (`telephone`), `llms.txt` and the footer
  NAP carry the organic number, so Google, the Business Profile and AI
  answers all see one consistent number.
- The ads number is swapped in by the browser after the page loads, for that
  visitor only, and on every page they visit afterwards.
- The rule is "last non-direct visit wins, for 90 days" (the Google
  Analytics model): an ad visitor who comes back by typing the address still
  sees the ads number; if they come back from an organic Google result they
  see the organic number again. Stored in the visitor's browser
  (`localStorage`, key `gr_attribution_v1`), no cookies.
- Keep **auto-tagging on** in Google Ads (Admin → Account settings →
  Auto-tagging; it is on by default). Without it an ad click carries no
  `gclid`; add `utm_medium=cpc` to the final URL suffix in that case.
- **Google Business Profile:** set its primary phone to +91 93155 15700 so
  the profile and the site agree (local ranking uses this NAP match).

## 2. What happens to a form lead

Every lead form (home callback, contact appointment, landing, Quick Enquiry,
Book Visit, mobile-menu Enquiry) does this on submit:

1. Gives the lead an ID such as `GR-8HNUKELW` and attaches its attribution:
   source and medium (e.g. `google / cpc`, `chatgpt / ai`), campaign, the
   Google Ads click ID, landing page, first visit.
2. Sends it **two ways at once**:
   - **Email** through FormSubmit to kamleshg9569@gmail.com, CC
     deepeshpatelinfinix@gmail.com, as before, now with `lead_id`,
     `lead_channel`, `traffic_source`, `campaign`, `gclid` and
     `landing_page` rows.
   - **`/api/lead`** on our own server, which checks it (phone format,
     field sizes, same-site origin, 8 leads per IP per 10 minutes, hidden
     honeypot field, "typed too fast" flag) and forwards it to whichever of
     these are switched on: **Telegram** (instant phone alert), **Google
     Sheet** (lead log you can sort and mark up), **CRM webhook** (Zapier,
     Make, n8n or a CRM, signed with HMAC-SHA256).
3. Shows "Thank you" if **either** path delivered it. Only if both fail does
   the visitor see "Please call or WhatsApp us", with their input kept.

Every lead is also written as one JSON line to the server log
(`docker logs tv-wale | grep lead_received`), a last-resort copy if every
destination is down.

Analytics (GA4, and GTM via `dataLayer`): `form_submit` and
`generate_lead` (method `form`) with `lead_id`, `lead_channel`,
`traffic_source`, `traffic_medium`; `click_call` / `phone_call_click` /
`generate_lead` for call taps and `click_whatsapp` for WhatsApp taps, with
the same channel and source fields; `form_error` if a lead could not be
delivered. Form leads now count as GA4 key events alongside call taps.

## 3. Switching on the alerts (server settings)

Add the lines you want to the `.env` file the container reads
(`env_file: .env` in `docker-compose.yml` on the Hostinger server), then
restart the container. Nothing is needed in the code or in GitHub. Leave a
destination out to keep it off.

```bash
# Telegram: instant alert on Kamlesh's / Deepesh's phone
LEAD_TELEGRAM_BOT_TOKEN=123456789:AA...        # from @BotFather
LEAD_TELEGRAM_CHAT_ID=987654321,-1001234567890  # one or more chat/group IDs

# Google Sheet lead log
LEAD_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
LEAD_SHEET_SECRET=choose-a-long-random-string

# Any CRM / automation webhook (optional)
LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
LEAD_WEBHOOK_SECRET=another-long-random-string   # signs X-GR-Signature

# Optional: more than 8 leads per IP per 10 minutes
# LEAD_RATE_LIMIT=8
```

Check after a restart: open `https://grsolution.co.in/api/lead`. It lists
the destinations that are on (names only), e.g.
`{"ok":true,"destinations":["telegram","sheet"]}`.

### Telegram bot (5 minutes)

1. In Telegram, open **@BotFather**, send `/newbot`, pick a name. Copy the
   token into `LEAD_TELEGRAM_BOT_TOKEN`.
2. Kamlesh and Deepesh each send the new bot any message (or add the bot to
   a group with both of you and send a message there).
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and
   copy each `"chat":{"id": ...}` into `LEAD_TELEGRAM_CHAT_ID`
   (comma-separated; group IDs start with `-100`).

A lead then arrives as:

```
🔔 New TV repair lead GR-8HNUKELW
📞 +91 98765 43210
👤 Ravi
🛠 No picture but sound works
📍 Noida

Form: Book Visit button
Page: /services/tv-repair-noida
Source: Google Ads · noida-tv-repair
Line shown: Ads +91 99902 83890
gclid: Cj0KCQ...
```

### Google Sheet (10 minutes)

1. Create a Google Sheet. **Extensions → Apps Script**, replace the code
   with the script below, and set `SECRET` to the same value as
   `LEAD_SHEET_SECRET`.
2. **Deploy → New deployment → Web app**: execute as *Me*, access
   *Anyone*. Copy the `/exec` URL into `LEAD_SHEET_WEBHOOK_URL`.

```js
const SECRET = 'paste LEAD_SHEET_SECRET here';
const HEADERS = ['received_at', 'lead_id', 'phone', 'name', 'issue', 'brand', 'service', 'area', 'message',
  'form', 'page', 'lead_channel', 'line_number', 'line_owner', 'source', 'medium', 'campaign', 'term',
  'click_id', 'click_id_type', 'landing_page', 'referrer', 'first_source', 'first_medium', 'first_touch_at',
  'flags', 'status', 'notes'];

function doPost(e) {
  const reply = (body) => ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
  const data = JSON.parse(e.postData.contents);
  if (data.secret !== SECRET) return reply({ ok: false, error: 'bad secret' });
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('Leads') || book.insertSheet('Leads');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  // Leading apostrophe keeps the phone number as text.
  sheet.appendRow(HEADERS.map((key) => (key === 'phone' ? "'" + data.phone : data[key] ?? '')));
  return reply({ ok: true });
}
```

The `status` and `notes` columns are for you (e.g. *called*, *booked*,
*repaired*). Rows with a `click_id` can later be uploaded to Google Ads as
offline conversions (Tools → Conversions → Uploads), so Ads learns which
clicks turned into paid repairs, not just form fills.

## 4. Google Ads conversions (optional, build-time)

In GitHub: **Settings → Secrets and variables → Actions → Variables**, add:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | `AW-` followed by your conversion ID |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | label of the "Website lead form" conversion action |
| `NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL` | label of the "Call from website" (click) action |
| `NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL` | label of the "WhatsApp from website" action |

The label is the part after the slash in each action's
`send_to: 'AW-123456789/AbCdEf...'`. The next deploy picks them up. Form
conversions carry the lead ID (no double counting) and the customer's phone
for **enhanced conversions** (hashed by Google's tag in the browser; turn on
"Enhanced conversions for leads" in the conversion settings). Empty
variables leave Ads tracking off; GA4 is unaffected either way.

## 5. Testing

```bash
npm test                                  # 29 unit tests: attribution rules, validation, forwarding, API
npm run build && npm --prefix tools/seo-audit ci
node --test --test-concurrency=1 tests/e2e/leads.e2e.mjs   # 20 browser tests
```

The browser tests start the built site with test settings, use a local mock
for Telegram / Sheet / webhook and intercept FormSubmit, so nothing reaches
real inboxes or chats. They cover: the organic number in every page's HTML,
schema and `llms.txt`; organic, AI, social and direct visitors; a Google
Ads click (number kept across navigation and returns, switched back by a
later organic visit, expired after 90 days); `/landing`; a lead from each
of the six forms arriving by email, Telegram, Sheet and webhook with the
same lead ID and attribution; an organic lead; email down, network blocked,
destinations down, both down; invalid phone; honeypot; API origin, bad
input and rate limit; call and WhatsApp tap events.

After deploying, send one real test lead from the site and confirm the
email, the Telegram alert and the Sheet row show the same `GR-` ID.
