import LeadForm from '@/components/forms/LeadForm';

// Which button opened the Quick Enquiry dialog, written into the notification
// email so a visit booking is easy to tell apart from a general question.
const DIALOG_SOURCES = {
  sticky_bar: { label: 'Book Visit button', subject: 'New doorstep visit request (Book Visit)' },
  header: { label: 'Quick Enquiry button (header)', subject: 'New GR Solution website enquiry' },
  mobile_menu: { label: 'Enquiry button (mobile menu)', subject: 'New GR Solution website enquiry' },
};

// Contact page appointment form, landing page form and the Quick Enquiry
// dialog. Every variant posts to the same FormSubmit inbox (with the CC in
// siteConfig). The appointment variant keeps the contact page's labels.
export default function ContactForm({ id = 'contactForm', compact = false, title, appointment = false, source }) {
  const dialogSource = compact ? DIALOG_SOURCES[source] : null;
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
      subject={dialogSource?.subject || 'New GR Solution website enquiry'}
      hidden={{ _template: 'table', ...(dialogSource ? { source: dialogSource.label } : {}) }}
      fields={compact ? ['issue', 'area'] : ['issue']}
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
