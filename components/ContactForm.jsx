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

  const inputClass = 'min-h-[56px] w-full rounded-xl border border-[#d9dde6] px-4 py-3 text-textMain outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10';

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={
        compact
          ? 'grid gap-4'
          : 'rounded-pro border border-primary/10 bg-white p-12 shadow-cardPro'
      }
    >
      {title ? <h2 className="mb-8 text-2xl font-extrabold text-secondary">{title}</h2> : null}
      <input type="hidden" name="_subject" value="New GR Solution website enquiry" />
      <input type="hidden" name="_template" value="table" />

      <div className="mb-4 grid gap-2">
        <label className="font-extrabold text-secondary">{appointment ? 'Your Name' : 'Name'}</label>
        <input type="text" name="name" required className={inputClass} />
      </div>
      <div className="mb-4 grid gap-2">
        <label className="font-extrabold text-secondary">{appointment ? 'Phone Number' : 'Phone'}</label>
        <input type="tel" name="phone" required className={inputClass} />
      </div>
      <div className="mb-4 grid gap-2">
        <label className="font-extrabold text-secondary">{appointment ? 'Service Area (Delhi, Noida & NCR)' : 'Service Required'}</label>
        <select name={appointment ? 'area' : 'service'} className={inputClass + ' bg-white'} defaultValue="">
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
      <div className="mb-4 grid gap-2">
        <label className="font-extrabold text-secondary">{appointment ? 'Issue Description' : 'Message'}</label>
        <textarea name="message" rows={compact ? 4 : 5} className={inputClass} />
      </div>
      <button type="submit" className="inline-flex w-full items-center justify-center gap-3 rounded-full border-2 border-primary bg-primary px-6 py-4 font-black text-white shadow-cta transition duration-300 hover:-translate-y-1 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70" disabled={pending}>
        <i className={pending ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'} />{' '}
        {pending ? 'Sending...' : appointment ? 'Submit Inquiry' : 'Send Enquiry'}
      </button>
      {status ? <p className="mt-4 font-bold text-success">{status}</p> : null}
    </form>
  );
}
