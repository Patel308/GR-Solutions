import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.terms.title,
  description: pageMetadata.terms.description,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <section className="section page-hero-next legal-page-next">
        <div className="container">
          <span className="badge">TERMS</span>
          <h1>Terms & Conditions</h1>
          <p>
            These terms apply to GR Solution repair enquiries, diagnosis visits, estimates, parts usage and customer
            communication.
          </p>
          <h2>Diagnosis And Estimates</h2>
          <p>Repair feasibility and final cost depend on device condition, model, fault type and part availability.</p>
          <h2>Parts And Repair Time</h2>
          <p>Some repairs can be completed the same day. Panel, board-level and part-dependent work may take longer.</p>
          <h2>Warranty</h2>
          <p>Warranty terms vary by repair type and parts used. Confirm warranty details before approving the repair.</p>
          <h2>Customer Approval</h2>
          <p>Paid repair work should begin only after the customer approves the estimate and service scope.</p>
        </div>
      </section>
    </main>
  );
}
