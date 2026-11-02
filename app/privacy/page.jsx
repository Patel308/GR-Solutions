import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.privacy.title,
  description: pageMetadata.privacy.description,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="hero-surface border-b border-line" data-section="privacy_hero">
        <div className="container max-w-3xl pb-10 pt-10 lg:pb-14 lg:pt-16">
          <span className="eyebrow">POLICY</span>
          <h1 className="mt-3">Privacy Policy</h1>
          <p className="lead mt-4">
            GR Solution collects contact details submitted through enquiry forms only to respond to service requests,
            schedule repair visits and communicate about customer support.
          </p>
        </div>
      </section>
      <section className="section band" data-section="privacy_body">
        <div className="container max-w-3xl">
          <div className="grid gap-8">
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">Information We Collect</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">Name, phone number, service requirement, message details and email if provided by the customer.</p>
            </div>
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">How We Use Information</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">We use submitted information to contact customers, confirm bookings, diagnose service needs and improve support quality.</p>
            </div>
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">Third-Party Forms</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">Forms currently use FormSubmit for message delivery. Customers can also call or WhatsApp directly.</p>
            </div>
            <div className="border-b border-line pb-8 last:border-b-0 last:pb-0">
              <h2 className="heading-panel">Contact</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-body">For privacy questions, contact GR Solution through the phone or email listed on the contact page.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
