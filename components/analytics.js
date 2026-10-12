// GA4 / GTM event helper. Events are sent through gtag (when GA is configured)
// and always pushed to window.dataLayer, so a GTM container can pick them up too.
//
// Event names used on the site:
//   generate_lead   phone click (GA4 key event, unchanged)
//   click_call      any tel: link
//   click_whatsapp  any wa.me link
//   cta_click       any element with data-cta="<name>"
//   form_start      first interaction with a lead form
//   form_submit     lead form sent successfully
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
