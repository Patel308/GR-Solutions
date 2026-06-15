'use client';

import { useState } from 'react';

export default function FAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs?.length) return null;

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <div key={faq.question} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
          <button type="button" className="faq-question" onClick={() => setOpenIndex(openIndex === index ? -1 : index)}>
            <span>{faq.question}</span>
            <i className="fa-solid fa-chevron-down" />
          </button>
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
