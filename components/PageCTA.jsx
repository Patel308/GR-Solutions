import Link from 'next/link';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';

const assurances = ['Same-day visit available', 'Transparent estimate', 'Delhi NCR doorstep support'];

export default function PageCTA({ badge = 'FAST LOCAL SUPPORT', title, description, serviceName }) {
  const ctaTitle = title || (serviceName ? `Need Expert ${serviceName} in Delhi NCR?` : 'Need Repair Support?');
  const ctaDescription =
    description ||
    'Call GR Solution for quick doorstep diagnosis, transparent pricing and trusted repair support across Delhi, Noida and NCR.';

  return (
    <section className="section-tight" data-section="page_cta">
      <div className="container">
        <div className="surface-dark relative overflow-hidden rounded-[1.5rem] px-5 py-10 sm:px-10 md:py-14 lg:px-16">
          <div
            className="pointer-events-none absolute -right-24 -top-24 hidden size-72 rounded-full border border-white/10 md:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-10 -top-10 hidden size-44 rounded-full border border-white/10 md:block"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="eyebrow eyebrow-on-dark">{badge}</span>
            <h2 className="mx-auto mt-4 max-w-[24ch] text-white">{ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lead text-white/75">{ctaDescription}</p>
            <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-small font-semibold text-white/85">
              {assurances.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-teal-300" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-8 grid max-w-md gap-3 sm:max-w-none sm:grid-cols-3 md:inline-grid md:grid-cols-[auto_auto_auto]">
              <PhoneLink callLocation="page_cta_call_now" className="btn btn-light btn-lg" data-cta="page_cta_call">
                <i className="fa-solid fa-phone" aria-hidden="true" /> Call Now
              </PhoneLink>
              <WhatsAppLink className="btn btn-whatsapp btn-lg" data-cta="page_cta_whatsapp">
                <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp Us
              </WhatsAppLink>
              <Link href="/contact" className="btn btn-outline-light btn-lg" data-cta="page_cta_book">
                Book Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
