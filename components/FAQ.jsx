'use client';

import { useState } from 'react';

export default function FAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs?.length) return null;

  return (
    <div className="faq-list grid gap-4">
      {faqs.map((faq, index) => (
        <div key={faq.question} className={`faq-item overflow-hidden rounded-[18px] border border-primary/10 bg-white shadow-oldMd ${openIndex === index ? 'active border-primary shadow-cardPro' : ''}`}>
          <button
            type="button"
            className={`faq-question flex w-full items-center justify-between px-6 py-5 text-left text-lg font-black transition duration-300 ${openIndex === index ? 'bg-[#f0f7ff] text-primary' : 'bg-white text-secondary'}`}
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            <span>{faq.question}</span>
            <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-textMuted'}`} />
          </button>
          <div className={`faq-answer overflow-hidden px-6 transition-all duration-300 ${openIndex === index ? 'max-h-60 pb-5' : 'max-h-0'}`}>
            <p className="text-base leading-relaxed text-textMuted">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
