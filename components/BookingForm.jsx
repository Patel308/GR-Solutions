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

  const inputClass = 'min-h-[56px] w-full rounded-xl border border-[#d9dde6] px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10';

  return (
    <div className="rounded-[32px] border border-primary/10 bg-white p-8 shadow-cardPro">
      <h3 className="mb-7 text-2xl font-extrabold text-secondary">Request A Callback</h3>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <input type="hidden" name="_subject" value="New Callback Request!" />
        <input type="hidden" name="_cc" value={siteConfig.formNotificationEmail} />
        <input type="hidden" name="_captcha" value="false" />

        <div className="grid gap-2">
          <label className="text-xs font-black uppercase tracking-[0.08em] text-primary">FULL NAME</label>
          <input type="text" name="name" placeholder="e.g. Rahul Sharma" required className={inputClass} />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-black uppercase tracking-[0.08em] text-primary">PHONE NUMBER</label>
          <input type="tel" name="phone" placeholder="+91 00000 00000" required className={inputClass} />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-black uppercase tracking-[0.08em] text-primary">SELECT BRAND</label>
          <div className="relative">
            <select name="brand" required defaultValue="" className={inputClass + ' appearance-none bg-white'}>
              <option value="" disabled>Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-black uppercase tracking-[0.08em] text-primary">ISSUE SUMMARY</label>
          <textarea name="message" rows="4" placeholder="Explain the problem..." required className={inputClass} />
        </div>

        <button type="submit" className="rounded-full bg-primary px-6 py-4 font-black text-white shadow-cta transition duration-300 hover:-translate-y-1 hover:bg-secondary disabled:opacity-70" disabled={pending}>
          {pending ? 'SENDING...' : 'PROCEED TO BOOKING'}
        </button>
        {status ? <p className="font-bold text-success">{status}</p> : null}
      </form>
    </div>
  );
}
