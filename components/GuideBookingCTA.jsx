'use client';

import { useEffect, useRef } from 'react';
import { PhoneLink, WhatsAppLink, useContactChannel } from '@/components/ContactChannel';
import { useEnquiry } from '@/components/EnquiryContext';

function trackContentEvent(name, contentId, intent, placement, channel, action) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, {
    content_id: contentId,
    content_intent: intent,
    cta_location: placement,
    ...(action ? { cta_action: action } : {}),
    lead_channel: channel,
    page_path: window.location.pathname,
  });
}

// A click is an expression of intent, not a completed booking or a qualified lead.
// Only public content identifiers go to analytics; never form/WhatsApp details.
export default function GuideBookingCTA({ contentId, intent = 'symptom', placement = 'after_answer' }) {
  const { channel } = useContactChannel();
  const { openEnquiry } = useEnquiry();
  const ctaRef = useRef(null);
  const viewed = useRef(new Set());
  const pricing = intent === 'price';
  const track = (action) => trackContentEvent('content_cta_click', contentId, intent, placement, channel, action);
  useEffect(() => {
    if (!ctaRef.current || typeof IntersectionObserver === 'undefined') return;
    const viewKey = `${contentId}:${placement}`;
    const observer = new IntersectionObserver((entries) => {
      if (viewed.current.has(viewKey) || !entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) return;
      // A view requires half the card to be visible, once per mounted placement.
      if (typeof window.gtag !== 'function') return;
      viewed.current.add(viewKey);
      trackContentEvent('content_cta_view', contentId, intent, placement, channel);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [contentId, intent, placement, channel]);
  const book = () => {
    track('open_enquiry');
    openEnquiry('guide');
  };
  // Redesign buttons (19 Nov 2026); labels wrap inside the article column.
  const button = 'btn min-w-0 whitespace-normal text-[0.9375rem] leading-snug';

  return (
    <section ref={ctaRef} data-guide-cta={`${contentId}:${placement}`} aria-label={/price_table/.test(placement) ? 'Get an estimate for your TV' : 'Get help with your TV'} className="my-8 overflow-hidden rounded-2xl border border-navy-100 bg-navy-50 p-5 sm:p-7">
      <p className="eyebrow">GR Solution · Independent TV repair</p>
      <h2 className="heading-panel mt-3">
        {pricing ? 'Find out what your TV actually needs' : intent === 'visit' ? 'Ready to arrange a TV inspection?' : 'Still need help with this TV fault?'}
      </h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-body">
        {pricing
          ? 'Online price ranges cannot identify a failed part. GR Solution diagnoses your TV free of charge and gives an estimate before paid repair work begins.'
          : 'Share your TV model, symptom and city. Request free diagnosis and an estimate before approving paid repair work.'}
      </p>
      <ol className="mt-5 grid list-none gap-2 p-0 text-small font-semibold text-ink sm:grid-cols-3">
        {['Share model & symptom', 'Confirm visit availability', 'Approve an estimate'].map((step, index) => (
          <li key={step} className="flex items-center gap-2 rounded-xl border border-line bg-white p-3">
            <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-600 text-xs font-bold text-white">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:[&>*:first-child]:col-span-2">
        <button type="button" onClick={book} className={`${button} btn-primary`}>
          <i aria-hidden="true" className="fa-solid fa-calendar-check shrink-0" />Request free diagnosis
        </button>
        <WhatsAppLink onClick={() => track('whatsapp')} className={`${button} btn-whatsapp`}>
          <i aria-hidden="true" className="fa-brands fa-whatsapp shrink-0" />Discuss on WhatsApp
        </WhatsAppLink>
        <PhoneLink onClick={() => track('call')} callLocation={`guide_${placement}`} className={`${button} btn-secondary`}>
          <i aria-hidden="true" className="fa-solid fa-phone shrink-0" />Call about my TV
        </PhoneLink>
      </div>
      <p className="mt-4 text-small leading-relaxed text-muted">Delhi, Noida, Greater Noida & Ghaziabad. Visit timing, access and any handling requirements are confirmed before a visit. Sending a request does not confirm a booking.</p>
    </section>
  );
}
