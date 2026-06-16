'use client';

import ContactForm from './ContactForm';

export default function EnquiryModal({ open, onClose }) {
  return (
    <div
      className={`modal fixed inset-0 z-[2000] flex items-center justify-center bg-secondary/65 p-4 backdrop-blur-sm transition duration-300 ${open ? 'active visible opacity-100' : 'invisible opacity-0'}`}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="modal-content relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-modal bg-white p-8 shadow-cardPro transition duration-300">
        <button type="button" className="close-modal absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-bgLight text-2xl font-bold text-secondary transition hover:bg-primary hover:text-white" onClick={onClose} aria-label="Close enquiry form">
          &times;
        </button>
        <div className="modal-header mb-7 pr-10">
          <h2 className="text-3xl font-extrabold text-secondary">Quick Enquiry</h2>
          <p className="mt-2 text-textMuted">Fill in the details below and we will contact you shortly.</p>
        </div>
        <ContactForm id="enquiryForm" compact />
      </div>
    </div>
  );
}
