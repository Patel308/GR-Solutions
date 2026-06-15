'use client';

import ContactForm from './ContactForm';

export default function EnquiryModal({ open, onClose }) {
  return (
    <div className={`modal ${open ? 'active' : ''}`} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-content">
        <button type="button" className="close-modal" onClick={onClose} aria-label="Close enquiry form">
          &times;
        </button>
        <div className="modal-header">
          <h2>Quick Enquiry</h2>
          <p>Fill in the details below and we will contact you shortly.</p>
        </div>
        <ContactForm id="enquiryForm" compact />
      </div>
    </div>
  );
}
