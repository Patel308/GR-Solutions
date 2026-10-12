'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { sectionOf, track } from '@/components/analytics';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const validMeasurementId = measurementId && /^G-[A-Z0-9]+$/i.test(measurementId) ? measurementId : null;

export default function CallTracking() {
  useEffect(() => {
    if (validMeasurementId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', validMeasurementId, { send_page_view: true });
    }

    // One delegated listener for every call, WhatsApp and CTA click.
    function handleClick(event) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest('a, button');
      if (!element) return;

      const href = element.getAttribute('href') || '';
      const section = sectionOf(element);
      const leadChannel = element.dataset.leadChannel || 'unknown';

      if (href.startsWith('tel:')) {
        const callLocation = element.dataset.callLocation || element.getAttribute('aria-label') || 'phone_link';
        const eventParams = {
          method: 'phone',
          call_location: callLocation,
          lead_channel: leadChannel,
          page_path: window.location.pathname,
        };

        // Unchanged since launch: GA4 key event + GTM-compatible push.
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', eventParams);
        }
        if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push({ event: 'phone_call_click', ...eventParams });
        }

        track('click_call', { call_location: callLocation, lead_channel: leadChannel, section });
      } else if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) {
        track('click_whatsapp', { lead_channel: leadChannel, section, cta_location: element.dataset.cta || section });
      }

      if (element.dataset.cta) {
        track('cta_click', { cta_name: element.dataset.cta, section, link_url: href || null });
      }
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  if (!validMeasurementId) return null;

  return (
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`}
      strategy="afterInteractive"
    />
  );
}
