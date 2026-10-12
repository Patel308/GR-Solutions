import LeadForm from '@/components/forms/LeadForm';

// Home page callback card: phone first, everything else optional.
export default function BookingForm() {
  return (
    <div className="card p-5 sm:p-8" data-section="home_callback">
      <h3 className="text-h3">Request A Callback</h3>
      <LeadForm
        className="mt-5"
        formId="callbackForm"
        section="home_callback"
        subject="New Callback Request!"
        hidden={{ _captcha: 'false' }}
        fields={['issue', 'brand']}
      />
    </div>
  );
}
