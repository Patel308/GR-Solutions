import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.privacy.title,
  description: pageMetadata.privacy.description,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="py-24">
        <div className="container max-w-4xl">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">POLICY</span>
          <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-tight text-secondary">Privacy Policy</h1>
          <p className="mt-6 text-lg leading-relaxed text-textMuted">
            GR Solution collects contact details submitted through enquiry forms only to respond to service requests,
            schedule repair visits and communicate about customer support.
          </p>
          <h2 className="mt-10 text-2xl font-black text-secondary">Information We Collect</h2>
          <p className="mt-3 leading-relaxed text-textMuted">Name, phone number, service requirement, message details and email if provided by the customer.</p>
          <h2 className="mt-10 text-2xl font-black text-secondary">How We Use Information</h2>
          <p className="mt-3 leading-relaxed text-textMuted">We use submitted information to contact customers, confirm bookings, diagnose service needs and improve support quality.</p>
          <h2 className="mt-10 text-2xl font-black text-secondary">Third-Party Forms</h2>
          <p className="mt-3 leading-relaxed text-textMuted">Forms currently use FormSubmit for message delivery. Customers can also call or WhatsApp directly.</p>
          <h2 className="mt-10 text-2xl font-black text-secondary">Contact</h2>
          <p className="mt-3 leading-relaxed text-textMuted">For privacy questions, contact GR Solution through the phone or email listed on the contact page.</p>
        </div>
      </section>
    </main>
  );
}
