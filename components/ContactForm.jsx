import LeadForm from '@/components/forms/LeadForm';

// Contact page appointment form, landing page form and the Quick Enquiry
// dialog. The appointment variant keeps the contact page's existing labels.
export default function ContactForm({ id = 'contactForm', compact = false, title, appointment = false }) {
  const form = appointment ? (
    <LeadForm
      formId={id}
      section="contact_appointment"
      subject="New GR Solution website enquiry"
      hidden={{ _template: 'table' }}
      fields={['area', 'message']}
      labels={{
        name: 'Your Name',
        phone: 'Phone Number',
        area: 'Service Area (Delhi, Noida & NCR)',
        message: 'Issue Description',
      }}
      submitLabel="Submit Inquiry"
    />
  ) : (
    <LeadForm
      formId={id}
      section={compact ? 'enquiry_dialog' : 'lead_form'}
      subject="New GR Solution website enquiry"
      hidden={{ _template: 'table' }}
      fields={['issue']}
    />
  );

  if (compact) return form;

  return (
    <div className="card p-5 sm:p-8">
      {title ? <h2 className="mb-5 text-h3 sm:text-[1.625rem]">{title}</h2> : null}
      {form}
    </div>
  );
}
