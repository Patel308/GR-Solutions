import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.terms.title,
  description: pageMetadata.terms.description,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <section className="hero-surface border-b border-line" data-section="terms_hero">
        <div className="container max-w-3xl pb-10 pt-10 lg:pb-14 lg:pt-16">
          <span className="eyebrow">TERMS</span>
          <h1 className="mt-3">Terms & Conditions</h1>
          <p className="lead mt-4">
            These terms apply to GR Solution repair enquiries, diagnosis visits, estimates, parts usage and customer
            communication.
          </p>
        </div>
      </section>
      <section className="section band" data-section="terms_body">
        <div className="container max-w-3xl">
          <div className="grid gap-8">
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">Diagnosis And Estimates</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">Repair feasibility and final cost depend on device condition, model, fault type and part availability.</p>
            </div>
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">Parts And Repair Time</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">Some repairs can be completed the same day. Panel, board-level and part-dependent work may take longer.</p>
            </div>
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">Warranty</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">Warranty terms vary by repair type and parts used. Confirm warranty details before approving the repair.</p>
            </div>
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">Customer Approval</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">Paid repair work should begin only after the customer approves the estimate and service scope.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
