import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.privacy.title,
  description: pageMetadata.privacy.description,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="section page-hero-next legal-page-next">
        <div className="container">
          <span className="badge">POLICY</span>
          <h1>Privacy Policy</h1>
          <p>
            GR Solution collects contact details submitted through enquiry forms only to respond to service requests,
            schedule repair visits and communicate about customer support.
          </p>
          <h2>Information We Collect</h2>
          <p>Name, phone number, service requirement, message details and email if provided by the customer.</p>
          <h2>How We Use Information</h2>
          <p>We use submitted information to contact customers, confirm bookings, diagnose service needs and improve support quality.</p>
          <h2>Third-Party Forms</h2>
          <p>Forms currently use FormSubmit for message delivery. Customers can also call or WhatsApp directly.</p>
          <h2>Contact</h2>
          <p>For privacy questions, contact GR Solution through the phone or email listed on the contact page.</p>
        </div>
      </section>
    </main>
  );
}
