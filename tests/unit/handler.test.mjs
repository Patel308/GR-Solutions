import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createLeadHandler, createRateLimiter } from '../../lib/leads/handler.mjs';
import { configuredDestinations, describeSource, telegramText } from '../../lib/leads/forward.mjs';

const LINES = {
  ads: { phone: '+91 99902 83890', owner: '' },
  seo: { phone: '+91 93155 15700', owner: 'Kamlesh' },
};
const ENV = {
  LEAD_TELEGRAM_BOT_TOKEN: '123:abc',
  LEAD_TELEGRAM_CHAT_ID: '-1001,-1002',
  LEAD_TELEGRAM_API_BASE: 'https://tg.test',
  LEAD_SHEET_WEBHOOK_URL: 'https://sheet.test/exec',
  LEAD_SHEET_SECRET: 's3cret',
  LEAD_WEBHOOK_URL: 'https://crm.test/hook',
  LEAD_WEBHOOK_SECRET: 'hmac-key',
};

function mockFetch(behaviour = () => ({ status: 200 })) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init, body: init?.body ? JSON.parse(init.body) : null });
    const result = behaviour(url, calls.length);
    if (result instanceof Error) throw result;
    return new Response('{}', { status: result.status });
  };
  fn.calls = calls;
  return fn;
}

const lead = (extra = {}) => ({
  lead_id: 'GR-TEST0001',
  phone: '9876543210',
  name: 'Ravi',
  issue: 'No picture but sound works',
  area: 'Noida',
  form_id: 'enquiryForm',
  source: 'Book Visit button',
  page: '/services/tv-repair-noida',
  lead_channel: 'ads',
  attribution: { source: 'google', medium: 'cpc', campaign: 'noida', click_id: 'G1', click_id_type: 'gclid' },
  elapsed_ms: 9000,
  ...extra,
});

function request(body, headers = {}) {
  return new Request('http://localhost:3100/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3100', host: 'localhost:3100', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function setup({ env = ENV, fetchImpl = mockFetch(), limiter } = {}) {
  const logs = [];
  const handler = createLeadHandler({ env, lines: LINES, fetchImpl, log: (entry) => logs.push(entry), limiter, now: () => Date.UTC(2026, 9, 12) });
  return { handler, fetchImpl, logs };
}

test('a valid lead reaches Telegram (each chat), the sheet and the webhook', async () => {
  const { handler, fetchImpl, logs } = setup();
  const response = await handler.post(request(lead()));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body, { ok: true, lead_id: 'GR-TEST0001', delivered: 3, configured: 3 });

  const urls = fetchImpl.calls.map((call) => call.url).sort();
  assert.deepEqual(urls, ['https://crm.test/hook', 'https://sheet.test/exec', 'https://tg.test/bot123:abc/sendMessage', 'https://tg.test/bot123:abc/sendMessage']);

  const telegram = fetchImpl.calls.filter((call) => call.url.includes('sendMessage'));
  assert.deepEqual(telegram.map((call) => call.body.chat_id).sort(), ['-1001', '-1002']);
  assert.match(telegram[0].body.text, /GR-TEST0001/);
  assert.match(telegram[0].body.text, /\+91 98765 43210/);
  assert.match(telegram[0].body.text, /Source: Google Ads · noida/);
  assert.match(telegram[0].body.text, /Line shown: Ads \+91 99902 83890/);
  assert.match(telegram[0].body.text, /gclid: G1/);

  const sheet = fetchImpl.calls.find((call) => call.url.includes('sheet'));
  assert.equal(sheet.body.secret, 's3cret');
  assert.equal(sheet.body.phone, '9876543210');
  assert.equal(sheet.body.click_id, 'G1');
  assert.equal(sheet.body.line_number, '+91 99902 83890');
  assert.equal(sheet.body.received_at, '2026-10-12T00:00:00.000Z');

  const hook = fetchImpl.calls.find((call) => call.url.includes('crm'));
  const expected = `sha256=${createHmac('sha256', 'hmac-key').update(hook.init.body).digest('hex')}`;
  assert.equal(hook.init.headers['X-GR-Signature'], expected);
  assert.equal(hook.body.event, 'lead.created');

  assert.equal(logs[0].event, 'lead_received');
  assert.equal(logs[0].phone, '9876543210');
  assert.ok(logs[0].destinations.every((d) => d.ok));
});

test('organic lead names Kamlesh line in Telegram', async () => {
  const { handler, fetchImpl } = setup({ env: { LEAD_TELEGRAM_BOT_TOKEN: 't', LEAD_TELEGRAM_CHAT_ID: '1', LEAD_TELEGRAM_API_BASE: 'https://tg.test' } });
  await handler.post(request(lead({ lead_channel: 'seo', attribution: { source: 'chatgpt', medium: 'ai' } })));
  const text = fetchImpl.calls[0].body.text;
  assert.match(text, /Line shown: SEO \(Kamlesh\) \+91 93155 15700/);
  assert.match(text, /Source: chatgpt \(AI assistant\)/);
});

test('one failing destination still delivers; all failing returns 502; retries once on 5xx', async () => {
  const partial = mockFetch((url) => (url.includes('sheet') ? { status: 500 } : { status: 200 }));
  let { handler } = setup({ fetchImpl: partial });
  let response = await handler.post(request(lead()));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).delivered, 2);
  assert.equal(partial.calls.filter((call) => call.url.includes('sheet')).length, 2, 'sheet retried once');

  const down = mockFetch(() => new Error('ECONNREFUSED'));
  ({ handler } = setup({ fetchImpl: down }));
  response = await handler.post(request(lead()));
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false, lead_id: 'GR-TEST0001', delivered: 0, configured: 3 });
});

test('4xx from a destination is not retried', async () => {
  const fetchImpl = mockFetch(() => ({ status: 400 }));
  const { handler } = setup({ env: { LEAD_WEBHOOK_URL: 'https://crm.test/hook' }, fetchImpl });
  const response = await handler.post(request(lead()));
  assert.equal(response.status, 502);
  assert.equal(fetchImpl.calls.length, 1);
});

test('no destinations configured: accepted, logged, delivered 0', async () => {
  const { handler, logs } = setup({ env: {} });
  const response = await handler.post(request(lead()));
  assert.deepEqual(await response.json(), { ok: true, lead_id: 'GR-TEST0001', delivered: 0, configured: 0 });
  assert.equal(logs[0].event, 'lead_received');
});

test('honeypot: answers ok but forwards nothing', async () => {
  const { handler, fetchImpl, logs } = setup();
  const response = await handler.post(request(lead({ _honey: 'http://spam' })));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).delivered, 0);
  assert.equal(fetchImpl.calls.length, 0);
  assert.equal(logs[0].event, 'lead_dropped');
});

test('fast submits are delivered but flagged', async () => {
  const { handler, fetchImpl } = setup({ env: { LEAD_WEBHOOK_URL: 'https://crm.test/hook' } });
  await handler.post(request(lead({ elapsed_ms: 300 })));
  assert.equal(fetchImpl.calls[0].body.lead.flags, 'fast_submit');
});

test('rejects foreign origins, missing origin, wrong content type, bad JSON, bad fields, oversize', async () => {
  const { handler } = setup();
  assert.equal((await handler.post(request(lead(), { origin: 'https://evil.example' }))).status, 403);
  const noOrigin = new Request('http://localhost:3100/api/lead', { method: 'POST', headers: { 'content-type': 'application/json', host: 'localhost:3100' }, body: '{}' });
  assert.equal((await handler.post(noOrigin)).status, 403);
  assert.equal((await handler.post(request(lead(), { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await handler.post(request('{nope'))).status, 400);
  const invalid = await handler.post(request(lead({ phone: '12' })));
  assert.equal(invalid.status, 400);
  assert.ok((await invalid.json()).errors.phone);
  assert.equal((await handler.post(request(lead({ message: 'x'.repeat(20000) })))).status, 413);
});

test('production origins are allowed behind the proxy', async () => {
  const { handler } = setup({ env: {} });
  const response = await handler.post(request(lead(), { origin: 'https://grsolution.co.in', host: '127.0.0.1:3000' }));
  assert.equal(response.status, 200);
  const www = await handler.post(request(lead(), { origin: 'https://www.grsolution.co.in', host: '127.0.0.1:3000' }));
  assert.equal(www.status, 200);
});

test('rate limit: 8 per IP per window, other IPs unaffected', async () => {
  const { handler } = setup({ env: {}, limiter: createRateLimiter({ limit: 8, windowMs: 60000 }) });
  const statuses = [];
  for (let i = 0; i < 10; i += 1) statuses.push((await handler.post(request(lead(), { 'x-forwarded-for': '1.2.3.4' }))).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 200, 200, 200, 429, 429]);
  assert.equal((await handler.post(request(lead(), { 'x-forwarded-for': '5.6.7.8' }))).status, 200);
});

test('status lists destination names only', async () => {
  const { handler } = setup();
  const body = await (await handler.status()).json();
  assert.deepEqual(body, { ok: true, destinations: ['telegram', 'sheet', 'webhook'] });
  assert.equal(JSON.stringify(body).includes('123:abc'), false);
});

test('helpers: destinations need both Telegram vars; source labels', () => {
  assert.deepEqual(configuredDestinations({ LEAD_TELEGRAM_BOT_TOKEN: 'x' }), []);
  assert.equal(describeSource({ source: 'google', medium: 'organic' }), 'google (organic search)');
  assert.equal(describeSource({ source: 'direct' }), 'direct / unknown');
  const text = telegramText({ lead_id: 'GR-1', phone: '9876543210', lead_channel: 'seo', line_number: '+91 93155 15700', line_owner: 'Kamlesh', source: 'google', medium: 'organic' });
  assert.equal(text.includes('undefined'), false);
  assert.equal(text.includes('\n\n\n'), false);
});

test('sheet webhook that answers 200 with ok:false counts as a failure', async () => {
  const fetchImpl = async () => new Response('{"ok":false,"error":"bad secret"}', { status: 200 });
  const { handler, logs } = setup({ env: { LEAD_SHEET_WEBHOOK_URL: 'https://sheet.test/exec' }, fetchImpl });
  const response = await handler.post(request(lead()));
  assert.equal(response.status, 502);
  assert.match(logs[0].destinations[0].error, /bad secret/);
});
