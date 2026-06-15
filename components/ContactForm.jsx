'use client';

import { useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { services } from '@/data/services';

export default function ContactForm({ id = 'contactForm', compact = false, title, appointment = false }) {
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setStatus('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(siteConfig.formEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');
      form.reset();
      setStatus('Thank you. We will contact you shortly.');
    } catch {
      setStatus('Message could not be sent right now. Please call or WhatsApp us.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit} className={compact ? 'enquiry-form' : 'card lead-form form-appointment'}>
      {title ? <h2>{title}</h2> : null}
      <input type="hidden" name="_subject" value="New GR Solution website enquiry" />
      <input type="hidden" name="_template" value="table" />

      <div className={compact ? 'form-group' : 'form-group-alt'}>
        <label>{appointment ? 'Your Name' : 'Name'}</label>
        <input type="text" name="name" required className={compact ? '' : 'form-input-alt'} />
      </div>
      <div className={compact ? 'form-group' : 'form-group-alt'}>
        <label>{appointment ? 'Phone Number' : 'Phone'}</label>
        <input type="tel" name="phone" required className={compact ? '' : 'form-input-alt'} />
      </div>
      <div className={compact ? 'form-group' : 'form-group-alt'}>
        <label>{appointment ? 'Service Area (Delhi, Noida & NCR)' : 'Service Required'}</label>
        <select name={appointment ? 'area' : 'service'} className={compact ? '' : 'form-input-alt'} defaultValue="">
          <option value="" disabled>
            {appointment ? 'Select area' : 'Select service'}
          </option>
          {(appointment ? ['West Delhi', 'South Delhi', 'East Delhi', 'North Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'] : services).map((item) => (
            <option key={appointment ? item : item.slug} value={appointment ? item : item.title}>
              {appointment ? item : item.title}
            </option>
          ))}
        </select>
      </div>
      <div className={compact ? 'form-group' : 'form-group-alt'}>
        <label>{appointment ? 'Issue Description' : 'Message'}</label>
        <textarea name="message" rows={compact ? 4 : 5} className={compact ? '' : 'form-input-alt'} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        <i className={pending ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'} />{' '}
        {pending ? 'Sending...' : appointment ? 'Submit Inquiry' : 'Send Enquiry'}
      </button>
      {status ? <p className="form-status">{status}</p> : null}
    </form>
  );
}
