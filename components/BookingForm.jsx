'use client';

import { useState } from 'react';
import { siteConfig } from '@/data/siteConfig';

const brands = ['Samsung', 'Sony', 'LG', 'MI/Xiaomi', 'OnePlus', 'Vu', 'TCL', 'Panasonic', 'Other'];

export default function BookingForm() {
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
    <div className="booking-form-card">
      <h3>Request A Callback</h3>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="_subject" value="New Callback Request!" />
        <input type="hidden" name="_captcha" value="false" />

        <div className="booking-field">
          <label>FULL NAME</label>
          <input type="text" name="name" placeholder="e.g. Rahul Sharma" required />
        </div>

        <div className="booking-field">
          <label>PHONE NUMBER</label>
          <input type="tel" name="phone" placeholder="+91 00000 00000" required />
        </div>

        <div className="booking-field">
          <label>SELECT BRAND</label>
          <div className="booking-select-wrap">
            <select name="brand" required defaultValue="">
              <option value="" disabled>Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down" />
          </div>
        </div>

        <div className="booking-field">
          <label>ISSUE SUMMARY</label>
          <textarea name="message" rows="4" placeholder="Explain the problem..." required />
        </div>

        <button type="submit" className="btn-booking-submit" disabled={pending}>
          {pending ? 'SENDING...' : 'PROCEED TO BOOKING'}
        </button>
        {status ? <p className="form-status">{status}</p> : null}
      </form>
    </div>
  );
}
