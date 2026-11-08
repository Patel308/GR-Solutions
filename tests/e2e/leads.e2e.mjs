// End-to-end tests for phone-number routing, lead capture and lead
// forwarding, against a production build in real Chromium.
//
//   npm run build && npm --prefix tools/seo-audit ci
//   node --test tests/e2e/leads.e2e.mjs
//
// The script starts `next start` itself with test settings, runs a local mock
// for Telegram / Google Sheet / webhook, and intercepts FormSubmit in the
// browser, so no real email, message or row is ever sent.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createHmac } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'tools/seo-audit/package.json'));
const { chromium } = require('playwright-core');

const SITE_PORT = Number(process.env.E2E_SITE_PORT || 3150);
const MOCK_PORT = Number(process.env.E2E_MOCK_PORT || 4545);
const SITE = `http://127.0.0.1:${SITE_PORT}`;
const MOCK = `http://127.0.0.1:${MOCK_PORT}`;
const ORGANIC = { tel: 'tel:+919315515700', wa: 'https://wa.me/919315515700' };
const ADS = { tel: 'tel:+919990283890', wa: 'https://wa.me/919990283890' };
// The home page's own line (the business's original number), shown on / to
// direct visitors only. Same digits as the ads line.
const HOME = ADS;
// Second organic line: organic and direct visitors on pricing, the brands hub
// and every brand page except Sony.
const SEO2 = { tel: 'tel:+918449820270', wa: 'https://wa.me/918449820270' };
const WEBHOOK_SECRET = 'e2e-hmac';
const DAY = 864e5;

// ---------------------------------------------------------------- mocks

const received = []; // destination calls
let destinationsFail = false;
const mock = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    let kind = 'other';
    if (req.url.startsWith('/tg/')) kind = 'telegram';
    else if (req.url === '/sheet') kind = 'sheet';
    else if (req.url === '/hook') kind = 'webhook';
    received.push({ kind, url: req.url, headers: req.headers, raw: body, body: body ? JSON.parse(body) : null });
    res.writeHead(destinationsFail ? 500 : 200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
  });
});

let site;
let browser;
let formsubmitMode = 'ok'; // ok | error | abort
const formsubmitPosts = [];

async function waitFor(check, { timeout = 10000, interval = 100, message = 'condition' } = {}) {
  const end = Date.now() + timeout;
  let last;
  while (Date.now() < end) {
    last = await check();
    if (last) return last;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Timed out waiting for ${message}`);
}

function parseMultipart(buffer, contentType) {
  const boundary = /boundary=(.+)$/.exec(contentType || '')?.[1];
  const fields = {};
  if (!boundary) return fields;
  for (const part of buffer.toString('utf8').split(`--${boundary}`)) {
    const match = /name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/.exec(part);
    if (match) fields[match[1]] = match[2];
  }
  return fields;
}

before(async () => {
  await new Promise((r) => mock.listen(MOCK_PORT, '127.0.0.1', r));
  site = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(SITE_PORT), '-H', '127.0.0.1'], {
    cwd: root,
    env: {
      ...process.env,
      LEAD_TELEGRAM_BOT_TOKEN: 'e2e-token',
      LEAD_TELEGRAM_CHAT_ID: '111',
      LEAD_TELEGRAM_API_BASE: `${MOCK}/tg`,
      LEAD_SHEET_WEBHOOK_URL: `${MOCK}/sheet`,
      LEAD_SHEET_SECRET: 'e2e-sheet',
      LEAD_WEBHOOK_URL: `${MOCK}/hook`,
      LEAD_WEBHOOK_SECRET: WEBHOOK_SECRET,
      LEAD_RATE_LIMIT: '40',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  site.logs = '';
  site.stdout.on('data', (d) => { site.logs += d; });
  site.stderr.on('data', (d) => { site.logs += d; });
  await waitFor(async () => (await fetch(`${SITE}/api/health`).catch(() => null))?.ok, { timeout: 30000, message: 'next start' });
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium' });
});

after(async () => {
  await browser?.close();
  site?.kill();
  await new Promise((r) => mock.close(r));
});

async function newContext({ mobile = true } = {}) {
  const context = await browser.newContext(
    mobile
      ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
      : { viewport: { width: 1280, height: 900 } },
  );
  await context.route('**/googletagmanager.com/**', (route) => route.abort());
  await context.route('https://formsubmit.co/**', async (route) => {
    const request = route.request();
    formsubmitPosts.push(parseMultipart(request.postDataBuffer() || Buffer.alloc(0), request.headers()['content-type']));
    if (formsubmitMode === 'abort') return route.abort('failed');
    return route.fulfill({
      status: formsubmitMode === 'error' ? 500 : 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: formsubmitMode === 'ok' ? 'true' : 'false' }),
    });
  });
  // Keep tel: and WhatsApp clicks on the page (the site's own listener still runs).
  await context.addInitScript(() => {
    window.addEventListener('click', (event) => {
      const link = event.target instanceof Element && event.target.closest('a[href^="tel:"], a[href*="wa.me/"]');
      if (link) event.preventDefault();
    }, true);
  });
  return context;
}

async function openPage(context, url, { referer } = {}) {
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', (error) => page.errors.push(error.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/ERR_FAILED|ERR_TUNNEL|googletagmanager|Failed to load resource/.test(msg.text())) page.errors.push(msg.text());
  });
  await page.goto(`${SITE}${url}`, { waitUntil: 'load', referer });
  return page;
}

const contactLinks = (page) =>
  page.evaluate(() => ({
    tel: [...new Set([...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')))],
    wa: [...new Set([...document.querySelectorAll('a[href*="wa.me/"]')].map((a) => a.getAttribute('href').split('?')[0]))],
  }));

async function expectLinks(page, expected, label) {
  await waitFor(async () => {
    const links = await contactLinks(page);
    return links.tel.length && links.tel.every((h) => h === expected.tel) && links.wa.every((h) => h === expected.wa);
  }, { message: `${label}: every call/WhatsApp link on ${expected.tel}` });
}

// The home page shows the same digits before and after hydration, so wait
// for the client to record the touch (attribution stored, channel resolved).
async function expectChannel(page, channel) {
  await waitFor(
    () => page.evaluate((c) => {
      const marks = [...new Set([...document.querySelectorAll('[data-lead-channel]')].map((el) => el.dataset.leadChannel))];
      return marks.length === 1 && marks[0] === c && Boolean(localStorage.getItem('gr_attribution_v1'));
    }, channel),
    { message: `channel ${channel} resolved after hydration` },
  );
}

const events = (page, name) =>
  page.evaluate((n) => (window.dataLayer || []).filter((e) => e && e.event === n).map((e) => ({ ...e })), name);

async function fillAndSubmit(page, form, { phone = '+91 98765-43210', name = 'E2E Tester', service } = {}) {
  const phoneField = form.locator('input[name="phone"]');
  await phoneField.click();
  await page.waitForTimeout(1700); // a human-ish pause (anti-bot timer)
  await phoneField.fill(phone);
  await form.locator('input[name="name"]').fill(name);
  if (service) await form.locator('select[name="service"]').selectOption(service);
  await form.locator('button[type="submit"]').click();
}

// ------------------------------------------------------- number routing

test('server HTML: every page carries the organic number; schema and llms.txt too', async () => {
  for (const url of ['/', '/services/samsung-tv-repair-delhi', '/services/lg-tv-repair-delhi', '/services/brands', '/services/sony-tv-repair-noida', '/services/tv-repair-noida', '/services/oled-qled-tv-repair', '/blog/tv-repair-cost-delhi', '/contact', '/about', '/pricing']) {
    const html = await (await fetch(`${SITE}${url}`)).text();
    assert.ok(html.includes('tel:+919315515700'), `${url} has the organic tel link`);
    assert.ok(!html.includes('9990283890'), `${url} never mentions the ads number`);
    assert.ok(!html.includes('8449820270'), `${url} server HTML never carries the second SEO line`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('');
    assert.ok(ld.includes('+91 93155 15700'), `${url} JSON-LD telephone is the organic number`);
  }
  const llms = await (await fetch(`${SITE}/llms.txt`)).text();
  assert.match(llms, /- Phone: \+91 93155 15700/);
  const landing = await (await fetch(`${SITE}/landing`)).text();
  assert.ok(landing.includes('tel:+919990283890'), '/landing (ads-only page) shows the ads number');
});

test('organic, AI, social and direct visitors see the organic number after hydration (direct on the home page: its own line)', async () => {
  const cases = [
    ['/', undefined, HOME],
    ['/', 'https://www.google.com/', ORGANIC],
    ['/', 'https://www.bing.com/', ORGANIC],
    ['/?utm_source=chatgpt.com', undefined, ORGANIC],
    ['/', 'https://www.perplexity.ai/', ORGANIC],
    ['/', 'https://gemini.google.com/', ORGANIC],
    ['/?fbclid=IwAR123', 'https://l.facebook.com/', ORGANIC],
    ['/services/tv-repair-noida', undefined, ORGANIC],
    ['/services/tv-repair-noida', 'https://chatgpt.com/', ORGANIC],
    ['/blog/tv-repair-cost-delhi', 'https://www.perplexity.ai/', ORGANIC],
  ];
  for (const [url, referer, expected] of cases) {
    const context = await newContext();
    const page = await openPage(context, url, { referer });
    await page.waitForTimeout(600);
    await expectLinks(page, expected, `${url} from ${referer || 'direct'}`);
    assert.deepEqual(page.errors, [], `no console errors on ${url}`);
    await context.close();
  }
});

test('Google Ads click: ads number everywhere, kept across navigation, reloads and direct returns', async () => {
  const context = await newContext();
  const page = await openPage(context, '/?gclid=E2E-GCLID-1&utm_campaign=delhi-tv', { referer: 'https://www.google.com/' });
  await expectLinks(page, ADS, 'landing with gclid');
  await expectChannel(page, 'ads');
  assert.deepEqual(page.errors, [], 'no hydration or console errors');

  // Client-side navigation to a service page.
  await page.locator('a[href="/services"]:visible').first().click();
  await page.waitForURL('**/services');
  await expectLinks(page, ADS, 'after client navigation');

  // A new page load with no parameters and no referrer (direct return).
  const again = await openPage(context, '/blog/tv-repair-cost-delhi');
  await expectLinks(again, ADS, 'direct return');

  // Later arrival from organic Google search switches back to organic.
  const organic = await openPage(context, '/services/tv-repair-noida', { referer: 'https://www.google.co.in/' });
  await expectLinks(organic, ORGANIC, 'later organic visit');
  await context.close();
});

test('the ads attribution expires after 90 days', async () => {
  const context = await newContext();
  const page = await openPage(context, '/?gbraid=E2E-GBRAID');
  await expectLinks(page, ADS, 'gbraid click');
  await expectChannel(page, 'ads');
  await page.evaluate((day) => {
    const state = JSON.parse(localStorage.getItem('gr_attribution_v1'));
    state.last.at -= 91 * day;
    state.first.at -= 91 * day;
    localStorage.setItem('gr_attribution_v1', JSON.stringify(state));
  }, DAY);
  const later = await openPage(context, '/services/tv-repair-noida');
  await expectLinks(later, ORGANIC, '91 days later');
  await context.close();
});

test('home page: original number for a direct visitor, then the organic number one click away', async () => {
  const context = await newContext();
  const page = await openPage(context, '/');
  await page.waitForTimeout(600);
  await expectLinks(page, HOME, '/ direct');
  const marks = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-lead-line]')].map((el) => `${el.dataset.leadChannel}/${el.dataset.leadLine}`))]);
  assert.deepEqual(marks, ['seo/home'], 'channel stays seo, line is home');
  await page.locator('a[href="/services"]:visible').first().click();
  await page.waitForURL('**/services');
  await expectLinks(page, ORGANIC, 'after client navigation to /services');
  const back = await openPage(context, '/');
  await expectLinks(back, HOME, 'direct return to /');
  assert.deepEqual(page.errors, []);
  await context.close();
});

test('home page: a visitor who found the site through search or AI keeps Kamlesh line, even on a later direct return', async () => {
  const context = await newContext();
  const page = await openPage(context, '/', { referer: 'https://www.google.co.in/' });
  await page.waitForTimeout(600);
  await expectLinks(page, ORGANIC, '/ from Google');
  const marks = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-lead-line]')].map((el) => `${el.dataset.leadChannel}/${el.dataset.leadLine}`))]);
  assert.deepEqual(marks, ['seo/seo']);
  const later = await openPage(context, '/');
  await page.waitForTimeout(600);
  await expectLinks(later, ORGANIC, 'later direct return to /');
  await context.close();

  // A direct visitor who first lands on a service page, then opens the home page.
  const other = await newContext();
  const service = await openPage(other, '/services/tv-repair-noida');
  await expectLinks(service, ORGANIC, 'direct on a service page');
  await service.locator('a[href="/"]:visible').first().click();
  await service.waitForURL(`${SITE}/`);
  await expectLinks(service, HOME, 'then the home page');
  await other.close();
});

test('/landing shows the ads number for direct and ad visitors', async () => {
  const context = await newContext();
  const page = await openPage(context, '/landing');
  await page.waitForTimeout(600);
  await expectLinks(page, ADS, '/landing direct');
  await context.close();
});

test('seo2 pages: organic, AI and direct visitors see the second SEO line; ad visitors the ads line; Sony stays on Kamlesh', async () => {
  const cases = [
    ['/pricing', 'https://www.google.com/', SEO2],
    ['/pricing', 'https://chatgpt.com/', SEO2],
    ['/pricing', undefined, SEO2],
    ['/pricing?gclid=E2E-PRICING', 'https://www.google.com/', ADS],
    ['/services/sony-tv-repair-noida', 'https://www.google.com/', ORGANIC],
    ['/services/samsung-tv-repair-delhi', 'https://www.google.com/', SEO2],
    ['/services/samsung-tv-repair-delhi', 'https://chatgpt.com/', SEO2],
    ['/services/samsung-tv-repair-delhi?utm_source=chatgpt.com', undefined, SEO2],
    ['/services/samsung-tv-repair-delhi', undefined, SEO2],
    ['/services/oneplus-tv-repair-delhi', 'https://www.perplexity.ai/', SEO2],
    ['/services/lg-tv-repair-delhi', 'https://www.bing.com/', SEO2],
    ['/services/brands', 'https://www.google.com/', SEO2],
    ['/services/samsung-tv-repair-delhi?gclid=E2E-BRAND', 'https://www.google.com/', ADS],
  ];
  for (const [url, referer, expected] of cases) {
    const context = await newContext();
    const page = await openPage(context, url, { referer });
    await page.waitForTimeout(600);
    await expectLinks(page, expected, `${url} from ${referer || 'direct'}`);
    assert.deepEqual(page.errors, [], `no console errors on ${url}`);
    await context.close();
  }
});

test('the second SEO line follows the page: Samsung, services hub, pricing, Sony, LG', async () => {
  const context = await newContext();
  const page = await openPage(context, '/services/samsung-tv-repair-delhi', { referer: 'https://www.google.co.in/' });
  await expectLinks(page, SEO2, 'Samsung page from Google');
  const marks = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-lead-line]')].map((el) => `${el.dataset.leadChannel}/${el.dataset.leadLine}`))]);
  assert.deepEqual(marks, ['seo/seo2']);
  await page.locator('a[href="/services"]:visible').first().click();
  await page.waitForURL('**/services');
  await expectLinks(page, ORGANIC, 'services hub after client navigation');
  const pricing = await openPage(context, '/pricing');
  await expectLinks(pricing, SEO2, 'pricing');
  const sony = await openPage(context, '/services/sony-tv-repair-delhi');
  await expectLinks(sony, ORGANIC, 'Sony page (Kamlesh)');
  const lg = await openPage(context, '/services/lg-tv-repair-noida');
  await expectLinks(lg, SEO2, 'another seo2 brand page');
  await context.close();
});

test('an organic lead from the Samsung page names the second SEO line', async () => {
  formsubmitMode = 'ok';
  destinationsFail = false;
  const context = await newContext({ mobile: true });
  const page = await openPage(context, '/services/samsung-tv-repair-delhi', { referer: 'https://www.google.com/' });
  await expectLinks(page, SEO2, 'Samsung page');
  const before = received.length;
  await page.click('[data-sticky-bar] [data-cta="sticky_bar_book_visit"]');
  const form = page.locator('dialog[open] form');
  await form.waitFor({ state: 'visible' });
  await fillAndSubmit(page, form);
  await page.getByText('Thank you. We will contact you shortly.').waitFor();
  const email = formsubmitPosts.at(-1);
  assert.equal(email.lead_channel, 'seo');
  assert.equal(email.lead_line, 'seo2');
  assert.equal(email.page, '/services/samsung-tv-repair-delhi');
  const calls = await waitFor(() => {
    const fresh = received.slice(before).filter((c) => c.body && JSON.stringify(c.body).includes(email.lead_id));
    return fresh.length >= 2 ? fresh : null;
  });
  assert.match(calls.find((c) => c.kind === 'telegram').body.text, /Line shown: SEO line 2 \+91 84498 20270/);
  assert.equal(calls.find((c) => c.kind === 'sheet').body.line_number, '+91 84498 20270');
  await context.close();
});

// ------------------------------------------------------- lead capture

const FORMS = [
  { name: 'home callback form', url: '/', mobile: false, open: async (page) => page.locator('#callbackForm') },
  { name: 'contact appointment form', url: '/contact', mobile: false, open: async (page) => page.locator('#appointmentForm') },
  { name: 'landing page form', url: '/landing', mobile: false, open: async (page) => page.locator('#landingForm') },
  {
    name: 'header Quick Enquiry dialog',
    url: '/services/oled-qled-tv-repair',
    mobile: false,
    subject: 'New GR Solution website enquiry',
    source: 'Quick Enquiry button (header)',
    open: async (page) => {
      await page.click('[data-cta="header_quick_enquiry"]');
      return page.locator('dialog[open] form');
    },
  },
  {
    name: 'sticky bar Book Visit dialog',
    url: '/blog/tv-repair-cost-delhi',
    mobile: true,
    subject: 'New doorstep visit request (Book Visit)',
    source: 'Book Visit button',
    open: async (page) => {
      await page.click('[data-sticky-bar] [data-cta="sticky_bar_book_visit"]');
      return page.locator('dialog[open] form');
    },
  },
  {
    name: 'mobile menu Enquiry dialog',
    url: '/pricing',
    mobile: true,
    source: 'Enquiry button (mobile menu)',
    open: async (page) => {
      await page.click('button[aria-controls="mobile-menu"]');
      await page.click('[data-cta="menu_enquiry"]');
      return page.locator('dialog[open] form');
    },
  },
  {
    name: 'guide booking prompt (motherboard guide), New TV Purchase Enquiry',
    url: '/blog/tv-motherboard-diagnosis',
    mobile: true,
    subject: 'New doorstep visit request (Book Visit)',
    source: 'Guide: Request free diagnosis',
    service: 'New TV Purchase Enquiry',
    open: async (page) => {
      await page.click('[data-guide-cta$=":after_intro"] button');
      return page.locator('dialog[open] form');
    },
  },
  {
    name: 'Dwarka repair page booking button, premium OLED option',
    url: '/services/tv-repair-dwarka',
    mobile: false,
    subject: 'New doorstep visit request (Book Visit)',
    source: 'Repair page: Request free diagnosis',
    service: 'Premium OLED TV Repair (LG, Sony, Samsung)',
    open: async (page) => {
      await page.click('[data-repair-actions$=":hero"] button');
      return page.locator('dialog[open] form');
    },
  },
];

for (const spec of FORMS) {
  test(`lead from the ${spec.name} reaches email, Telegram, Sheet and webhook with the same lead ID`, async () => {
    formsubmitMode = 'ok';
    destinationsFail = false;
    const context = await newContext({ mobile: spec.mobile });
    const page = await openPage(context, `${spec.url}${spec.url.includes('?') ? '&' : '?'}gclid=E2E-${spec.url.length}`, { referer: 'https://www.google.com/' });
    await page.waitForTimeout(500);
    const form = await spec.open(page);
    await form.waitFor({ state: 'visible' });

    const emailBefore = formsubmitPosts.length;
    const receivedBefore = received.length;
    await fillAndSubmit(page, form, { service: spec.service });
    await page.getByText('Thank you. We will contact you shortly.').waitFor({ timeout: 10000 });

    // Email (FormSubmit) copy.
    const email = formsubmitPosts.slice(emailBefore).at(-1);
    assert.ok(email, 'FormSubmit received the lead');
    assert.match(email.lead_id, /^GR-[A-Z0-9]{8}$/);
    assert.equal(email.phone, '9876543210');
    assert.equal(email.name, 'E2E Tester');
    assert.equal(email._cc, 'deepeshpatelinfinix@gmail.com');
    assert.equal(email.lead_channel, 'ads');
    assert.equal(email.traffic_source, 'google / cpc');
    assert.match(email.gclid, /^E2E-/);
    assert.equal(email.page, new URL(page.url()).pathname);
    if (spec.subject) assert.equal(email._subject, spec.subject);
    if (spec.source) assert.equal(email.source, spec.source);
    if (spec.service) assert.equal(email.service, spec.service);

    // Server-side forwarding.
    const calls = await waitFor(() => {
      const fresh = received.slice(receivedBefore).filter((c) => c.body && JSON.stringify(c.body).includes(email.lead_id));
      return fresh.length >= 3 ? fresh : null;
    }, { message: 'three destinations' });
    const telegram = calls.find((c) => c.kind === 'telegram');
    const sheet = calls.find((c) => c.kind === 'sheet');
    const hook = calls.find((c) => c.kind === 'webhook');
    assert.equal(telegram.url, '/tg/bote2e-token/sendMessage');
    assert.equal(telegram.body.chat_id, '111');
    assert.match(telegram.body.text, new RegExp(`New TV repair lead ${email.lead_id}`));
    assert.match(telegram.body.text, /\+91 98765 43210/);
    assert.match(telegram.body.text, /Source: Google Ads/);
    assert.equal(email.lead_line, 'ads');
    assert.match(telegram.body.text, /Line shown: Ads \+91 99902 83890/);
    assert.equal(sheet.body.line_number, '+91 99902 83890');
    assert.equal(sheet.body.secret, 'e2e-sheet');
    assert.equal(sheet.body.lead_id, email.lead_id);
    assert.equal(sheet.body.click_id_type, 'gclid');
    assert.equal(sheet.body.flags, '', 'a human-paced submit is not flagged');
    const signature = `sha256=${createHmac('sha256', WEBHOOK_SECRET).update(hook.raw).digest('hex')}`;
    assert.equal(hook.headers['x-gr-signature'], signature);

    // Analytics.
    const submits = await events(page, 'form_submit');
    assert.equal(submits.at(-1).lead_id, email.lead_id);
    assert.equal(submits.at(-1).delivery, 'email+api');
    const leads = (await events(page, 'generate_lead')).filter((e) => e.method === 'form');
    assert.equal(leads.at(-1).lead_id, email.lead_id);
    assert.equal(leads.at(-1).traffic_source, 'google');
    assert.equal(leads.at(-1).traffic_medium, 'cpc');
    assert.deepEqual(page.errors, []);
    await context.close();
  });
}

test('an organic (ChatGPT) lead is tagged seo and names Kamlesh line', async () => {
  formsubmitMode = 'ok';
  destinationsFail = false;
  const context = await newContext({ mobile: false });
  const page = await openPage(context, '/contact', { referer: 'https://chatgpt.com/' });
  const before = received.length;
  await fillAndSubmit(page, page.locator('#appointmentForm'));
  await page.getByText('Thank you. We will contact you shortly.').waitFor();
  const email = formsubmitPosts.at(-1);
  assert.equal(email.lead_channel, 'seo');
  assert.equal(email.traffic_source, 'chatgpt / ai');
  const telegram = await waitFor(() => received.slice(before).find((c) => c.kind === 'telegram'));
  assert.match(telegram.body.text, /Line shown: SEO \(Kamlesh\) \+91 93155 15700/);
  assert.match(telegram.body.text, /Source: chatgpt \(AI assistant\)/);
  await context.close();
});

test('a direct visitor lead from the home page names the home line', async () => {
  formsubmitMode = 'ok';
  destinationsFail = false;
  const context = await newContext({ mobile: false });
  const page = await openPage(context, '/');
  await expectLinks(page, HOME, '/ direct');
  const before = received.length;
  await fillAndSubmit(page, page.locator('#callbackForm'));
  await page.getByText('Thank you. We will contact you shortly.').waitFor();
  const email = formsubmitPosts.at(-1);
  assert.equal(email.lead_channel, 'seo');
  assert.equal(email.lead_line, 'home');
  const telegram = await waitFor(() => received.slice(before).find((c) => c.kind === 'telegram'));
  assert.match(telegram.body.text, /Line shown: Home page \+91 99902 83890/);
  assert.match(telegram.body.text, /Source: direct \/ unknown/);
  await context.close();
});

// ------------------------------------------------------- failure modes

async function submitHomeForm(context) {
  const page = await openPage(context, '/');
  const form = page.locator('#callbackForm');
  await fillAndSubmit(page, form);
  return page;
}

test('email down, API up: the visitor still sees success (delivery: api)', async () => {
  formsubmitMode = 'error';
  destinationsFail = false;
  const context = await newContext({ mobile: false });
  const page = await submitHomeForm(context);
  await page.getByText('Thank you. We will contact you shortly.').waitFor();
  assert.equal((await events(page, 'form_submit')).at(-1).delivery, 'api');
  await context.close();
});

test('email request blocked by the network, API up: success (delivery: api)', async () => {
  formsubmitMode = 'abort';
  destinationsFail = false;
  const context = await newContext({ mobile: false });
  const page = await submitHomeForm(context);
  await page.getByText('Thank you. We will contact you shortly.').waitFor();
  assert.equal((await events(page, 'form_submit')).at(-1).delivery, 'api');
  await context.close();
});

test('every forwarding destination down, email up: success (delivery: email)', async () => {
  formsubmitMode = 'ok';
  destinationsFail = true;
  const context = await newContext({ mobile: false });
  const page = await submitHomeForm(context);
  await page.getByText('Thank you. We will contact you shortly.').waitFor();
  assert.equal((await events(page, 'form_submit')).at(-1).delivery, 'email');
  await context.close();
});

test('both paths down: the visitor is told to call or WhatsApp, and the input is kept', async () => {
  formsubmitMode = 'error';
  destinationsFail = true;
  const context = await newContext({ mobile: false });
  const page = await submitHomeForm(context);
  await page.getByText('Message could not be sent right now. Please call or WhatsApp us.').waitFor();
  assert.equal(await page.locator('#callbackForm input[name="phone"]').inputValue(), '+91 98765-43210');
  assert.equal((await events(page, 'form_error')).length, 1);
  assert.equal((await events(page, 'form_submit')).length, 0);
  formsubmitMode = 'ok';
  destinationsFail = false;
  await context.close();
});

// ------------------------------------------------------- validation and abuse

test('invalid phone: inline error, focus on the field, nothing is sent', async () => {
  const context = await newContext({ mobile: false });
  const page = await openPage(context, '/');
  const emailBefore = formsubmitPosts.length;
  const receivedBefore = received.length;
  const form = page.locator('#callbackForm');
  await form.locator('input[name="phone"]').fill('12345');
  await form.locator('button[type="submit"]').click();
  await page.getByText('Enter a 10-digit phone number so we can call you back.').waitFor();
  assert.equal(await page.evaluate(() => document.activeElement?.name), 'phone');
  await page.waitForTimeout(800);
  assert.equal(formsubmitPosts.length, emailBefore);
  assert.equal(received.length, receivedBefore);
  await context.close();
});

test('honeypot filled by a bot: API forwards nothing', async () => {
  formsubmitMode = 'ok';
  destinationsFail = false;
  const context = await newContext({ mobile: false });
  const page = await openPage(context, '/');
  await page.evaluate(() => { document.querySelector('#callbackForm input[name="_honey"]').value = 'http://spam.example'; });
  const receivedBefore = received.length;
  await fillAndSubmit(page, page.locator('#callbackForm'));
  await page.getByText('Thank you. We will contact you shortly.').waitFor();
  await page.waitForTimeout(1000);
  assert.equal(received.length, receivedBefore, 'no Telegram/Sheet/webhook call for a bot');
  assert.match(site.logs, /"event":"lead_dropped","reason":"honeypot"/);
  await context.close();
});

test('API: status endpoint, foreign origin, bad input and rate limiting', async () => {
  const status = await (await fetch(`${SITE}/api/lead`)).json();
  assert.deepEqual(status, { ok: true, destinations: ['telegram', 'sheet', 'webhook'] });

  const lead = { lead_id: 'GR-RATE0001', phone: '9876543210' };
  const post = (headers, body = JSON.stringify(lead)) =>
    fetch(`${SITE}/api/lead`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: SITE, ...headers }, body });

  assert.equal((await post({ Origin: 'https://evil.example' })).status, 403);
  assert.equal((await post({}, '{bad json')).status, 400);
  assert.equal((await post({}, JSON.stringify({ ...lead, phone: '1' }))).status, 400);

  const statuses = [];
  for (let i = 0; i < 42; i += 1) statuses.push((await post({ 'X-Forwarded-For': '203.0.113.9' })).status);
  assert.equal(statuses.filter((s) => s === 200).length, 40);
  assert.deepEqual(statuses.slice(-2), [429, 429]);
});

// ------------------------------------------------------- call and WhatsApp tracking

test('call and WhatsApp taps are tracked with channel and traffic source', async () => {
  const context = await newContext();
  const page = await openPage(context, '/services/tv-repair-noida?gclid=E2E-CLICKS', { referer: 'https://www.google.com/' });
  await expectLinks(page, ADS, 'service page from an ad');
  await page.click('[data-sticky-bar] a[href^="tel:"]');
  const call = (await events(page, 'click_call')).at(-1);
  assert.equal(call.lead_channel, 'ads');
  assert.equal(call.traffic_source, 'google');
  const keyEvent = (await events(page, 'phone_call_click')).at(-1);
  assert.equal(keyEvent.lead_channel, 'ads');

  await page.click('[data-sticky-bar] [data-cta="sticky_bar_whatsapp"]');
  const wa = (await events(page, 'click_whatsapp')).at(-1);
  assert.equal(wa.lead_channel, 'ads');
  const href = await page.getAttribute('[data-sticky-bar] [data-cta="sticky_bar_whatsapp"]', 'href');
  assert.match(href, /^https:\/\/wa\.me\/919990283890\?text=Hi%20GR%20Solution/);
  await context.close();
});
