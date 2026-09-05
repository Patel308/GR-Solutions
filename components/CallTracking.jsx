'use client';

import Script from 'next/script';
import { useEffect } from 'react';

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

    function handlePhoneClick(event) {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest('a[href^="tel:"]');
      if (!link) return;

      const callLocation = link.dataset.callLocation || link.getAttribute('aria-label') || 'phone_link';
      const eventParams = {
        method: 'phone',
        call_location: callLocation,
        page_path: window.location.pathname,
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', eventParams);
      }

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: 'phone_call_click', ...eventParams });
      }
    }

    document.addEventListener('click', handlePhoneClick, true);
    return () => document.removeEventListener('click', handlePhoneClick, true);
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
