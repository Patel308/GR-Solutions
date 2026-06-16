'use client';

import { useState } from 'react';

export default function FAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs?.length) return null;

  return (
    <div className="grid gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className={`overflow-hidden rounded-[18px] border bg-white shadow-oldMd transition duration-300 ${
              isOpen
                ? 'border-primary shadow-cardPro'
                : 'border-primary/10 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-oldLg'
            }`}
          >
            <button
              type="button"
              className={`flex w-full items-center justify-between px-6 py-5 text-left text-lg font-black transition duration-300 ${
                isOpen ? 'bg-[#f0f7ff] text-primary' : 'bg-white text-secondary'
              }`}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{faq.question}</span>
              <i
                className={`fa-solid fa-chevron-down transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-primary' : 'text-textMuted'
                }`}
              />
            </button>
            <div
              className={`overflow-hidden px-6 transition-all duration-300 ${
                isOpen ? 'max-h-60 pb-5' : 'max-h-0'
              }`}
            >
              <p className="text-base leading-relaxed text-textMuted">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
