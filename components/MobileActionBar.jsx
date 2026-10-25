'use client';

import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';

// Fixed Call / WhatsApp / Book Visit bar for phones and small tablets (below
// 768px), where it replaces the round floating buttons. Call and WhatsApp use
// the same channel-aware numbers as the rest of the site; Book Visit opens the
// existing Quick Enquiry form (the Header owns it) through a window event.
export const OPEN_ENQUIRY_EVENT = 'gr:open-enquiry';

function trackEvent(name, params) {
  const payload = { page_path: window.location.pathname, cta_location: 'mobile_action_bar', ...params };
  if (typeof window.gtag === 'function') window.gtag('event', name, payload);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...payload });
}

const buttonClass =
  'flex min-h-[48px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-[12px] font-extrabold leading-tight transition active:scale-[0.98] min-[360px]:flex-row min-[360px]:text-[13px] sm:gap-2 sm:text-[15px]';

export default function MobileActionBar() {
  const openBookVisit = () => {
    trackEvent('book_visit_click', {});
    window.dispatchEvent(new CustomEvent(OPEN_ENQUIRY_EVENT, { detail: { source: 'book_visit' } }));
  };

  return (
    <>
      {/* Keeps the end of the page (footer contact details) clear of the bar. */}
      <div className="h-[76px] bg-[#09091b] md:hidden" aria-hidden="true" />
      <nav
        aria-label="Quick contact"
        data-mobile-action-bar
        className="fixed inset-x-0 bottom-0 z-[950] grid grid-cols-3 gap-2 border-t border-black/10 bg-white px-3 pt-2 shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.25)] md:hidden"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        <PhoneLink callLocation="mobile_action_bar_call" className={`${buttonClass} bg-primary text-white`}>
          <i className="fa-solid fa-phone shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Call</span>
        </PhoneLink>
        <WhatsAppLink
          className={`${buttonClass} bg-[#25d366] text-white`}
          onClick={() => trackEvent('click_whatsapp', {})}
        >
          <i className="fa-brands fa-whatsapp shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">WhatsApp</span>
        </WhatsAppLink>
        <button type="button" className={`${buttonClass} border-2 border-primary bg-white text-primary`} onClick={openBookVisit}>
          <i className="fa-solid fa-calendar-check shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Book Visit</span>
        </button>
      </nav>
    </>
  );
}
