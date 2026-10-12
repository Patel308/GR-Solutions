// Native <details> accordion. No JavaScript, keyboard and screen-reader
// accessible out of the box, answers are never clipped, and every question and
// answer stays in the server HTML word for word (it must match the FAQPage
// schema on the page). The shared `name` makes it a one-open-at-a-time
// accordion in browsers that support it; others simply allow several open.
export default function FAQ({ faqs, name = 'faq' }) {
  if (!faqs?.length) return null;

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
      {faqs.map((faq, index) => (
        <details key={faq.question} name={name} open={index === 0} className="group">
          <summary className="flex min-h-[3.5rem] items-start justify-between gap-4 px-5 py-4 text-left font-display text-[1.0625rem] font-bold leading-snug text-ink transition-colors hover:bg-surface hover:text-primary group-open:text-primary sm:px-6 sm:py-5">
            <span>{faq.question}</span>
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-primary transition-transform duration-200 group-open:rotate-180"
            >
              <i className="fa-solid fa-chevron-down text-[0.7rem]" />
            </span>
          </summary>
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="leading-relaxed text-muted">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
