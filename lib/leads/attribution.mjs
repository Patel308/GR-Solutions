// Visit attribution for phone-number routing and lead tracking.
//
// Pure functions (no window/document access) so they run in the browser, on
// the server and in unit tests alike.
//
// Model: "last non-direct touch" with a 90-day window, the same idea Google
// Analytics uses. A visit from an ad click, a search engine, an AI assistant,
// a referral link or a tagged campaign replaces the stored touch; a direct
// visit (typed URL, bookmark, internal link) keeps whatever was stored until
// it is 90 days old.

export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;
export const STORAGE_KEY = 'gr_attribution_v1';

// Routes that only receive paid traffic. Everything else renders the organic
// (SEO/AIO/GEO) number, which is what search engines and AI crawlers read.
export const AD_ONLY_PATHS = ['/landing'];

const GOOGLE_CLICK_IDS = ['gclid', 'gbraid', 'wbraid'];
const PAID_MEDIUMS = ['cpc', 'ppc', 'paid', 'paidsearch', 'paid_search', 'paid_social', 'display', 'cpm', 'banner'];
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

// Hosts are matched against the referrer hostname, most specific first.
const AI_HOSTS = [
  ['chatgpt.com', 'chatgpt'],
  ['chat.openai.com', 'chatgpt'],
  ['perplexity.ai', 'perplexity'],
  ['gemini.google.com', 'gemini'],
  ['bard.google.com', 'gemini'],
  ['copilot.microsoft.com', 'copilot'],
  ['claude.ai', 'claude'],
  ['you.com', 'you.com'],
  ['meta.ai', 'meta-ai'],
  ['deepseek.com', 'deepseek'],
];
const SEARCH_HOSTS = [
  ['google.', 'google'],
  ['bing.com', 'bing'],
  ['duckduckgo.com', 'duckduckgo'],
  ['search.yahoo.', 'yahoo'],
  ['yahoo.com', 'yahoo'],
  ['yandex.', 'yandex'],
  ['ecosia.org', 'ecosia'],
  ['search.brave.com', 'brave'],
  ['baidu.com', 'baidu'],
];
const SOCIAL_HOSTS = [
  ['facebook.com', 'facebook'],
  ['instagram.com', 'instagram'],
  ['t.co', 'twitter'],
  ['x.com', 'twitter'],
  ['linkedin.com', 'linkedin'],
  ['youtube.com', 'youtube'],
  ['whatsapp.com', 'whatsapp'],
];

const clip = (value, max = 200) => (value == null ? '' : String(value).slice(0, max));

function hostMatch(hostname, table) {
  const host = hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
  for (const [pattern, name] of table) {
    if (pattern.endsWith('.')) {
      if (host.startsWith(pattern) || host.includes(`.${pattern}`)) return name;
    } else if (host === pattern || host.endsWith(`.${pattern}`)) {
      return name;
    }
  }
  return null;
}

function referrerHost(referrer) {
  if (!referrer) return '';
  try {
    return new URL(referrer).hostname;
  } catch {
    return '';
  }
}

/**
 * Classifies one page load.
 * @param {{ search?: string, referrer?: string, host?: string, pathname?: string, now?: number }} visit
 * @returns {object|null} a touch, or null for a direct/internal visit
 */
export function classifyVisit({ search = '', referrer = '', host = '', pathname = '/', now = Date.now() } = {}) {
  const params = new URLSearchParams(search);
  const utm = Object.fromEntries(UTM_KEYS.map((key) => [key, clip(params.get(key), 120)]));
  const refHost = referrerHost(referrer);
  const sameSite = refHost && host && refHost.replace(/^www\./, '') === host.replace(/^www\./, '');
  const base = {
    at: now,
    landing_page: clip(pathname, 200),
    referrer: sameSite ? '' : refHost,
    campaign: utm.utm_campaign,
    term: utm.utm_term,
    content: utm.utm_content,
    click_id: '',
    click_id_type: '',
  };

  // 1. Google Ads click (auto-tagging adds gclid, or gbraid/wbraid on iOS).
  const googleId = GOOGLE_CLICK_IDS.find((key) => params.get(key));
  if (googleId || params.has('gad_source')) {
    return {
      ...base,
      channel: 'ads',
      source: utm.utm_source || 'google',
      medium: utm.utm_medium || 'cpc',
      click_id: googleId ? clip(params.get(googleId), 200) : '',
      click_id_type: googleId || 'gad_source',
    };
  }

  // 2. Microsoft Ads click.
  if (params.get('msclkid')) {
    return {
      ...base,
      channel: 'ads',
      source: utm.utm_source || 'bing',
      medium: utm.utm_medium || 'cpc',
      click_id: clip(params.get('msclkid')),
      click_id_type: 'msclkid',
    };
  }

  // 3. Tagged campaign links (utm_*). Paid mediums count as ads.
  if (utm.utm_source || utm.utm_medium) {
    const medium = (utm.utm_medium || 'referral').toLowerCase();
    return {
      ...base,
      channel: PAID_MEDIUMS.includes(medium) ? 'ads' : 'seo',
      source: utm.utm_source || refHost || 'unknown',
      medium,
    };
  }

  // 4. Untagged arrivals from another site. Facebook adds fbclid to every
  // outbound link (organic posts too), so it is social, not paid.
  if (refHost && !sameSite) {
    const ai = hostMatch(refHost, AI_HOSTS);
    if (ai) return { ...base, channel: 'seo', source: ai, medium: 'ai' };
    const search = hostMatch(refHost, SEARCH_HOSTS);
    if (search) return { ...base, channel: 'seo', source: search, medium: 'organic' };
    const social = hostMatch(refHost, SOCIAL_HOSTS);
    if (social) return { ...base, channel: 'seo', source: social, medium: 'social' };
    return { ...base, channel: 'seo', source: refHost, medium: 'referral' };
  }
  if (params.get('fbclid')) return { ...base, channel: 'seo', source: 'facebook', medium: 'social' };

  return null; // direct or internal
}

const isFresh = (touch, now) => Boolean(touch && typeof touch.at === 'number' && now - touch.at < ATTRIBUTION_TTL_MS);

/**
 * Applies a touch to the stored state.
 * @returns {{ first: object|null, last: object|null }}
 */
export function applyTouch(stored, touch, now = Date.now()) {
  const first = isFresh(stored?.first, now) ? stored.first : null;
  const last = isFresh(stored?.last, now) ? stored.last : null;
  if (!touch) return { first, last };
  return { first: first || touch, last: touch };
}

export const channelForPath = (pathname) => (AD_ONLY_PATHS.includes(pathname) ? 'ads' : 'seo');

/** The number set to show: the latest non-direct touch, else the route default. */
export function channelFor(state, pathname, now = Date.now()) {
  const last = isFresh(state?.last, now) ? state.last : null;
  return last?.channel === 'ads' || last?.channel === 'seo' ? last.channel : channelForPath(pathname);
}

export function parseStored(raw) {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return value && typeof value === 'object' ? { first: value.first || null, last: value.last || null } : null;
  } catch {
    return null;
  }
}

/** Flat fields attached to every lead and conversion. */
export function leadAttribution(state, pathname, now = Date.now()) {
  const last = isFresh(state?.last, now) ? state.last : null;
  const first = isFresh(state?.first, now) ? state.first : null;
  return {
    lead_channel: channelFor(state, pathname, now),
    source: last?.source || 'direct',
    medium: last?.medium || '(none)',
    campaign: last?.campaign || '',
    term: last?.term || '',
    content: last?.content || '',
    click_id: last?.click_id || '',
    click_id_type: last?.click_id_type || '',
    landing_page: last?.landing_page || '',
    referrer: last?.referrer || '',
    touch_at: last ? new Date(last.at).toISOString() : '',
    first_source: first?.source || '',
    first_medium: first?.medium || '',
    first_touch_at: first ? new Date(first.at).toISOString() : '',
  };
}
