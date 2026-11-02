'use client';

import { useEffect, useRef } from 'react';
import ContactForm from './ContactForm';
import { useEnquiry } from './EnquiryContext';

// Native <dialog> opened with showModal(): the browser provides the focus trap,
// Escape to close and an inert page behind it. Focus returns to whatever
// opened it. Bottom sheet on phones, centred card on larger screens.
export default function EnquiryModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const { source } = useEnquiry();
  const bookingVisit = source === 'sticky_bar';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current = document.activeElement;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      dialog.querySelector('input[name="phone"]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const handleClose = () => {
      document.documentElement.style.overflow = '';
      onClose();
      openerRef.current?.focus?.();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="enquiry-title"
      aria-describedby="enquiry-description"
      className="mb-0 mt-auto max-h-[92dvh] w-full max-w-full overflow-y-auto rounded-t-modal bg-white p-0 text-body shadow-card-hover backdrop:bg-ink/60 backdrop:backdrop-blur-sm sm:mb-auto sm:w-[calc(100%-2rem)] sm:max-w-[34rem] sm:rounded-modal"
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="relative p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-8">
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex size-12 items-center justify-center rounded-full text-2xl font-semibold text-ink transition hover:bg-surface"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close enquiry form"
        >
          &times;
        </button>
        <div className="mb-5 pr-12">
          <h2 id="enquiry-title" className="text-h3 sm:text-[1.625rem]">
            Quick Enquiry
          </h2>
          <p id="enquiry-description" className="mt-1.5 text-muted">
            Fill in the details below and we will contact you shortly.
          </p>
          {bookingVisit ? (
            <p className="badge mt-3">
              <i className="fa-solid fa-calendar-check" aria-hidden="true" /> Doorstep visit request
            </p>
          ) : null}
        </div>
        <ContactForm id="enquiryForm" compact source={source} />
      </div>
    </dialog>
  );
}
