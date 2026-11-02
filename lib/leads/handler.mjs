// /api/lead request handling, written against the standard Request/Response
// API so it can be unit-tested without starting Next.js.

import { validateLead } from './validate.mjs';
import { configuredDestinations, forwardLead, leadRecord } from './forward.mjs';

const MAX_BODY_BYTES = 16 * 1024;
const DEFAULT_ORIGINS = ['https://grsolution.co.in', 'https://www.grsolution.co.in'];

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Fixed-window limiter kept in memory (one server process). */
export function createRateLimiter({ limit = 8, windowMs = 10 * 60 * 1000 } = {}) {
  const hits = new Map();
  return {
    check(key, now = Date.now()) {
      const entry = hits.get(key);
      if (!entry || now - entry.start >= windowMs) {
        hits.set(key, { start: now, count: 1 });
        if (hits.size > 5000) {
          for (const [k, v] of hits) if (now - v.start >= windowMs) hits.delete(k);
        }
        return true;
      }
      entry.count += 1;
      return entry.count <= limit;
    },
  };
}

function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function allowedOrigin(request, env) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  // Same host as the request (covers localhost, staging and production).
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (host && originHost === host) return true;
  const extra = (env.LEAD_ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
  const site = env.NEXT_PUBLIC_SITE_URL ? [env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')] : [];
  return [...DEFAULT_ORIGINS, ...site, ...extra].includes(origin);
}

/**
 * @param {{ env?: object, lines?: object, fetchImpl?: typeof fetch, now?: () => number,
 *           limiter?: ReturnType<typeof createRateLimiter>, log?: (entry: object) => void }} options
 */
export function createLeadHandler({
  env = {},
  lines = {},
  fetchImpl = (...args) => fetch(...args),
  now = () => Date.now(),
  limiter = createRateLimiter({ limit: Number(env.LEAD_RATE_LIMIT) || 8 }),
  log = (entry) => console.log(JSON.stringify(entry)),
} = {}) {
  const destinations = configuredDestinations(env);

  async function post(request) {
    if (!allowedOrigin(request, env)) return json(403, { ok: false, error: 'forbidden' });
    if (!(request.headers.get('content-type') || '').includes('application/json')) {
      return json(415, { ok: false, error: 'expected application/json' });
    }
    const declared = Number(request.headers.get('content-length') || 0);
    if (declared > MAX_BODY_BYTES) return json(413, { ok: false, error: 'too large' });

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'too large' });

    if (!limiter.check(clientIp(request), now())) return json(429, { ok: false, error: 'too many requests' });

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: 'invalid json' });
    }

    const result = validateLead(body);
    if (!result.ok) return json(400, { ok: false, errors: result.errors });

    const receivedAt = new Date(now()).toISOString();
    const record = leadRecord(result.lead, { receivedAt, lines, flags: result.flags });

    // A filled honeypot is a bot: answer like a success so it moves on.
    if (result.spam) {
      log({ event: 'lead_dropped', reason: 'honeypot', lead_id: record.lead_id, received_at: receivedAt });
      return json(200, { ok: true, lead_id: record.lead_id, delivered: 0, configured: destinations.length });
    }

    const results = await forwardLead(record, destinations, fetchImpl);
    const delivered = results.filter((item) => item.ok).length;
    // The log line is the last-resort record (docker logs) if every destination fails.
    log({ event: 'lead_received', ...record, destinations: results });

    if (destinations.length && !delivered) {
      return json(502, { ok: false, lead_id: record.lead_id, delivered, configured: destinations.length });
    }
    return json(200, { ok: true, lead_id: record.lead_id, delivered, configured: destinations.length });
  }

  // Lets you confirm after a deploy which destinations are switched on
  // (names only, never the secrets).
  function status() {
    return json(200, { ok: true, destinations: destinations.map((item) => item.name) });
  }

  return { post, status };
}
