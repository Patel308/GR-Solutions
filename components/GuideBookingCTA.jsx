'use client';

import { useEffect, useRef } from 'react';
import { PhoneLink, WhatsAppLink, useContactChannel } from '@/components/ContactChannel';
import { OPEN_ENQUIRY_EVENT } from '@/components/MobileActionBar';

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
    window.dispatchEvent(new CustomEvent(OPEN_ENQUIRY_EVENT, { detail: { source: 'book_visit' } }));
  };
  const button = 'inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-black leading-snug transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

  return (
    <section ref={ctaRef} data-guide-cta={`${contentId}:${placement}`} aria-label="Get help with your TV" className="my-8 overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(125deg,#eff8ff,#f2fbf7)] p-5 sm:p-7">
      <p className="text-xs font-black uppercase tracking-widest text-primary">GR Solution · Independent TV repair</p>
      <h2 className="mt-3 text-2xl font-black leading-tight text-secondary">
        {pricing ? 'Find out what your TV actually needs' : intent === 'visit' ? 'Ready to arrange a TV inspection?' : 'Still need help with this TV fault?'}
      </h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-textMuted">
        {pricing
          ? 'Online price ranges cannot identify a failed part. GR Solution diagnoses your TV free of charge and gives an estimate before paid repair work begins.'
          : 'Share your TV model, symptom and city. Request free diagnosis and an estimate before approving paid repair work.'}
      </p>
      <ol className="mt-5 grid list-none gap-2 text-sm font-bold text-secondary sm:grid-cols-3">
        {['Share model & symptom', 'Confirm visit availability', 'Approve an estimate'].map((step, index) => (
          <li key={step} className="flex items-center gap-2 rounded-lg bg-white/80 p-3">
            <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={book} className={`${button} bg-primary text-white hover:bg-secondary`}>
          <i aria-hidden="true" className="fa-solid fa-calendar-check shrink-0" />Request free diagnosis
        </button>
        <WhatsAppLink onClick={() => track('whatsapp')} className={`${button} border border-[#14783e]/20 bg-white text-[#126435] hover:bg-[#e5f8eb]`}>
          <i aria-hidden="true" className="fa-brands fa-whatsapp shrink-0" />Discuss on WhatsApp
        </WhatsAppLink>
        <PhoneLink onClick={() => track('call')} callLocation={`guide_${placement}`} className={`${button} border border-primary/20 bg-white text-primary hover:bg-primary/5`}>
          <i aria-hidden="true" className="fa-solid fa-phone shrink-0" />Call about my TV
        </PhoneLink>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-textMuted">Delhi, Noida, Greater Noida & Ghaziabad. Visit timing, access and any handling requirements are confirmed before a visit. Sending a request does not confirm a booking.</p>
    </section>
  );
}
