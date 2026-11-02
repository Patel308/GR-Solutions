// Lead forwarding. Every destination is optional and switched on by server
// environment variables (see docs/lead-tracking.md). Destinations run in
// parallel; each gets a timeout and one retry on a network error or a 5xx.

import { createHmac } from 'node:crypto';

const TIMEOUT_MS = 6000;

const SOURCE_LABELS = { cpc: 'Google Ads', organic: 'organic search', ai: 'AI assistant', referral: 'referral', social: 'social' };

export function describeSource(attribution = {}) {
  if (!attribution.source || attribution.source === 'direct') return 'direct / unknown';
  const medium = SOURCE_LABELS[attribution.medium] || attribution.medium;
  const name = attribution.medium === 'cpc' && attribution.source === 'google' ? 'Google Ads' : attribution.source;
  return name === medium ? name : `${name} (${medium})`;
}

/** One flat record: the Google Sheet row and the webhook payload. */
export function leadRecord(lead, { receivedAt, lines = {}, flags = [] }) {
  const line = lines[lead.lead_channel] || {};
  const a = lead.attribution || {};
  return {
    received_at: receivedAt,
    lead_id: lead.lead_id,
    phone: lead.phone,
    name: lead.name,
    issue: lead.issue,
    brand: lead.brand,
    service: lead.service,
    area: lead.area,
    message: lead.message,
    form: lead.source || lead.form_id,
    page: lead.page,
    lead_channel: lead.lead_channel,
    line_number: line.phone || '',
    line_owner: line.owner || '',
    source: a.source,
    medium: a.medium,
    campaign: a.campaign,
    term: a.term,
    click_id: a.click_id,
    click_id_type: a.click_id_type,
    landing_page: a.landing_page,
    referrer: a.referrer,
    first_source: a.first_source,
    first_medium: a.first_medium,
    first_touch_at: a.first_touch_at,
    flags: flags.join(','),
  };
}

export function telegramText(record) {
  const opt = (value, line) => (value ? line : null);
  const rows = [
    `🔔 New TV repair lead ${record.lead_id}`,
    `📞 +91 ${record.phone.slice(0, 5)} ${record.phone.slice(5)}`,
    opt(record.name, `👤 ${record.name}`),
    opt(record.issue, `🛠 ${record.issue}`),
    opt(record.brand, `📺 ${record.brand}`),
    opt(record.service, `🔧 ${record.service}`),
    opt(record.area, `📍 ${record.area}`),
    opt(record.message, `💬 ${record.message}`),
    '',
    `Form: ${record.form || 'website form'}`,
    `Page: ${record.page || '/'}`,
    `Source: ${describeSource(record)}${record.campaign ? ` · ${record.campaign}` : ''}`,
    `Line shown: ${record.lead_channel === 'ads' ? 'Ads' : 'SEO'}${record.line_owner ? ` (${record.line_owner})` : ''} ${record.line_number}`,
    opt(record.click_id, `${record.click_id_type}: ${record.click_id}`),
    opt(record.flags, `⚠️ Check: ${record.flags}`),
  ];
  return rows.filter((row) => row !== null).join('\n').slice(0, 4000);
}

async function postWithRetry(fetchImpl, url, init) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
      if (response.status < 500) break; // a 4xx will not fix itself
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function configuredDestinations(env = {}) {
  const list = [];

  if (env.LEAD_TELEGRAM_BOT_TOKEN && env.LEAD_TELEGRAM_CHAT_ID) {
    const base = (env.LEAD_TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/$/, '');
    const chatIds = env.LEAD_TELEGRAM_CHAT_ID.split(',').map((id) => id.trim()).filter(Boolean);
    list.push({
      name: 'telegram',
      send: (record, fetchImpl) =>
        Promise.all(
          chatIds.map((chatId) =>
            postWithRetry(fetchImpl, `${base}/bot${env.LEAD_TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatId, text: telegramText(record), disable_web_page_preview: true }),
            }),
          ),
        ),
    });
  }

  if (env.LEAD_SHEET_WEBHOOK_URL) {
    list.push({
      name: 'sheet',
      send: async (record, fetchImpl) => {
        const response = await postWithRetry(fetchImpl, env.LEAD_SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Apps Script web apps cannot read headers, so the secret travels in the body.
          body: JSON.stringify({ secret: env.LEAD_SHEET_SECRET || '', ...record }),
          redirect: 'follow',
        });
        // Apps Script answers 200 even when the script rejects the row.
        const reply = await response.json().catch(() => null);
        if (reply && reply.ok === false) throw new Error(`sheet rejected: ${reply.error || 'unknown'}`);
        return response;
      },
    });
  }

  if (env.LEAD_WEBHOOK_URL) {
    list.push({
      name: 'webhook',
      send: (record, fetchImpl) => {
        const body = JSON.stringify({ event: 'lead.created', lead: record });
        const headers = { 'Content-Type': 'application/json' };
        if (env.LEAD_WEBHOOK_SECRET) {
          headers['X-GR-Signature'] = `sha256=${createHmac('sha256', env.LEAD_WEBHOOK_SECRET).update(body).digest('hex')}`;
        }
        return postWithRetry(fetchImpl, env.LEAD_WEBHOOK_URL, { method: 'POST', headers, body });
      },
    });
  }

  return list;
}

/** Sends the record everywhere; never throws. */
export async function forwardLead(record, destinations, fetchImpl = fetch) {
  const settled = await Promise.allSettled(destinations.map((destination) => destination.send(record, fetchImpl)));
  return destinations.map((destination, index) => ({
    name: destination.name,
    ok: settled[index].status === 'fulfilled',
    error: settled[index].status === 'rejected' ? String(settled[index].reason?.message || settled[index].reason) : undefined,
  }));
}
