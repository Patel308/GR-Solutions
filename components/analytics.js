// GA4 / GTM event helper. Events are sent through gtag (when GA is configured)
// and always pushed to window.dataLayer, so a GTM container can pick them up too.
//
// Event names used on the site:
//   generate_lead   phone click (GA4 key event, unchanged)
//   click_call      any tel: link
//   click_whatsapp  any wa.me link
//   cta_click       any element with data-cta="<name>"
//   form_start      first interaction with a lead form
//   form_submit     lead form sent successfully (carries lead_id)
//   generate_lead   also sent for a form lead (method: 'form', lead_id,
//                   traffic_source / traffic_medium), so form leads count as
//                   GA4 key events alongside phone clicks
//   form_error      lead form could not be delivered by any path
// Every event carries page_path, and section where known.

export function sectionOf(element) {
  if (!element?.closest) return 'unknown';
  const tagged = element.closest('[data-section]');
  if (tagged) return tagged.getAttribute('data-section');
  if (element.closest('header')) return 'header';
  if (element.closest('footer')) return 'footer';
  if (element.closest('main')) return 'main';
  return 'other';
}

export function track(name, params = {}) {
  if (typeof window === 'undefined') return;
  const payload = { page_path: window.location.pathname, ...params };
  if (typeof window.gtag === 'function') window.gtag('event', name, payload);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

// Google Ads conversions (optional). Switched on at build time with
//   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789
//   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL / _CALL_LABEL / _WHATSAPP_LABEL
// (the "label" part of each conversion action's send_to value). Form leads
// also send the customer's phone as enhanced-conversion user data; gtag
// hashes it before it leaves the browser.
const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const googleAdsId = adsId && /^AW-\d+$/.test(adsId) ? adsId : null;
const adsLabels = {
  lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  call: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL,
  whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL,
};

export function adsConversion(kind, { transactionId, phone } = {}) {
  const label = adsLabels[kind];
  if (typeof window === 'undefined' || !googleAdsId || !label || typeof window.gtag !== 'function') return false;
  if (phone) window.gtag('set', 'user_data', { phone_number: `+91${phone}` });
  window.gtag('event', 'conversion', { send_to: `${googleAdsId}/${label}`, ...(transactionId ? { transaction_id: transactionId } : {}) });
  return true;
}
