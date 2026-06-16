import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.terms.title,
  description: pageMetadata.terms.description,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <section className="py-24">
        <div className="container max-w-4xl">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">TERMS</span>
          <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-tight text-secondary">Terms & Conditions</h1>
          <p className="mt-6 text-lg leading-relaxed text-textMuted">
            These terms apply to GR Solution repair enquiries, diagnosis visits, estimates, parts usage and customer
            communication.
          </p>
          <h2 className="mt-10 text-2xl font-black text-secondary">Diagnosis And Estimates</h2>
          <p className="mt-3 leading-relaxed text-textMuted">Repair feasibility and final cost depend on device condition, model, fault type and part availability.</p>
          <h2 className="mt-10 text-2xl font-black text-secondary">Parts And Repair Time</h2>
          <p className="mt-3 leading-relaxed text-textMuted">Some repairs can be completed the same day. Panel, board-level and part-dependent work may take longer.</p>
          <h2 className="mt-10 text-2xl font-black text-secondary">Warranty</h2>
          <p className="mt-3 leading-relaxed text-textMuted">Warranty terms vary by repair type and parts used. Confirm warranty details before approving the repair.</p>
          <h2 className="mt-10 text-2xl font-black text-secondary">Customer Approval</h2>
          <p className="mt-3 leading-relaxed text-textMuted">Paid repair work should begin only after the customer approves the estimate and service scope.</p>
        </div>
      </section>
    </main>
  );
}
