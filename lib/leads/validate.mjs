// Lead validation shared by the browser form and the /api/lead endpoint.

// Accepts "+91 98765 43210", "098765 43210", "9876543210", spaces or dashes.
// Returns the 10 digits, or null.
export function normalisePhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[1-9]\d{9}$/.test(digits) ? digits : null;
}

// Short, readable, unique enough for a small business: GR-<time><random>.
export function newLeadId(now = Date.now(), random = Math.random) {
  const time = now.toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(random() * 36 ** 3).toString(36).toUpperCase().padStart(3, '0');
  return `GR-${time}${rand}`;
}

const LEAD_ID = /^GR-[A-Z0-9]{6,12}$/;

const TEXT_LIMITS = {
  name: 80,
  issue: 80,
  brand: 40,
  service: 80,
  area: 60,
  message: 1000,
  form_id: 40,
  source: 80,
  subject: 120,
  page: 200,
};

const ATTRIBUTION_KEYS = [
  'source', 'medium', 'campaign', 'term', 'content', 'click_id', 'click_id_type', 'landing_page',
  'referrer', 'touch_at', 'first_source', 'first_medium', 'first_touch_at',
];

// Humans need a moment to type a phone number; most bots post instantly.
export const MIN_FILL_MS = 1500;

const text = (value, max) =>
  typeof value === 'string' || typeof value === 'number'
    ? String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max)
    : '';

/**
 * @returns {{ ok: true, lead: object, spam: boolean, flags: string[] } | { ok: false, errors: Record<string, string> }}
 */
export function validateLead(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, errors: { body: 'Expected a JSON object.' } };

  const errors = {};
  const phone = normalisePhone(body.phone);
  if (!phone) errors.phone = 'Enter a 10-digit phone number.';
  const leadId = text(body.lead_id, 20);
  if (!LEAD_ID.test(leadId)) errors.lead_id = 'Invalid lead id.';
  if (Object.keys(errors).length) return { ok: false, errors };

  const lead = { lead_id: leadId, phone };
  for (const [key, max] of Object.entries(TEXT_LIMITS)) lead[key] = text(body[key], max);
  if (lead.page && !lead.page.startsWith('/')) lead.page = '';
  lead.lead_channel = body.lead_channel === 'ads' ? 'ads' : 'seo';

  const attribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};
  lead.attribution = Object.fromEntries(ATTRIBUTION_KEYS.map((key) => [key, text(attribution[key], 200)]));

  const flags = [];
  const spam = Boolean(text(body._honey, 200));
  if (spam) flags.push('honeypot');
  const elapsed = Number(body.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) flags.push('fast_submit');
  if (/https?:\/\//i.test(lead.message) && (lead.message.match(/https?:\/\//gi) || []).length > 2) flags.push('links');

  return { ok: true, lead, spam, flags };
}
