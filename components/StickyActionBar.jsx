'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';
import { useEnquiry } from '@/components/EnquiryContext';
import cx from '@/components/ui/cx';

// Phones and small tablets (<= 768px): Call / WhatsApp / Book Visit within thumb
// reach. It steps aside whenever it could cover something that matters: while
// the footer is on screen, while a lead form is on screen, and while the
// on-screen keyboard is up (a form field has focus). The footer also reserves
// its height at the bottom, so no content is ever permanently under it.
export default function StickyActionBar() {
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();
  const [footerVisible, setFooterVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    // Forms inside the enquiry dialog are ignored: the open dialog already
    // covers the page, and an inert bar would stop focus returning to "Book
    // Visit" when the dialog closes.
    const forms = [...document.querySelectorAll('[data-hide-sticky]')].filter((form) => !form.closest('dialog'));
    const visibleForms = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === footer) {
          setFooterVisible(entry.isIntersecting);
        } else if (entry.isIntersecting) {
          visibleForms.add(entry.target);
        } else {
          visibleForms.delete(entry.target);
        }
      }
      setFormVisible(visibleForms.size > 0);
    });
    if (footer) observer.observe(footer);
    forms.forEach((form) => observer.observe(form));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const isField = (element) =>
      element instanceof Element && element.matches('input, textarea, select') && !element.closest('dialog');
    const onFocusIn = (event) => {
      if (isField(event.target)) setTyping(true);
    };
    const onFocusOut = (event) => {
      if (isField(event.target)) setTyping(false);
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const hidden = footerVisible || formVisible || typing;

  return (
    <div
      data-sticky-bar
      data-section="sticky_bar"
      className={cx('sticky-bar fixed inset-x-0 bottom-0 z-[900] min-[769px]:hidden', hidden && 'is-hidden')}
      aria-hidden={hidden ? 'true' : undefined}
      inert={hidden ? true : undefined}
    >
      <nav aria-label="Quick contact" className="mx-auto grid max-w-lg grid-cols-3 gap-2">
        <PhoneLink callLocation="sticky_bar_call" className="btn btn-primary">
          <i className="fa-solid fa-phone" aria-hidden="true" /> <span>Call</span>
        </PhoneLink>
        <WhatsAppLink className="btn btn-whatsapp" data-cta="sticky_bar_whatsapp">
          <i className="fa-brands fa-whatsapp" aria-hidden="true" /> <span>WhatsApp</span>
        </WhatsAppLink>
        <a
          href="/contact"
          className="btn btn-secondary"
          data-cta="sticky_bar_book_visit"
          onClick={(event) => {
            event.preventDefault();
            openEnquiry('sticky_bar');
          }}
        >
          <i className="fa-solid fa-calendar-check" aria-hidden="true" /> <span>Book Visit</span>
        </a>
      </nav>
    </div>
  );
}
