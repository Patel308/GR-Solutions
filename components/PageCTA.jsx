import Link from 'next/link';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';

export default function PageCTA({ badge = 'FAST LOCAL SUPPORT', title, description, serviceName, benefits }) {
  const ctaTitle = title || (serviceName ? `Need Expert ${serviceName} in Delhi NCR?` : 'Need Repair Support?');
  const ctaDescription =
    description ||
    'Call GR Solution for quick doorstep diagnosis, transparent pricing and trusted repair support across Delhi, Noida and NCR.';

  return (
    <section className="py-24">
      <div className="container">
        <div className="rounded-[32px] bg-secondary p-10 text-center text-white shadow-cardPro md:p-14">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-white">
            {badge}
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
            {ctaTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            {ctaDescription}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4 text-sm font-bold text-white/85">
            {benefits?.length ? benefits.map((benefit) => (
              <span key={benefit}><i className="fa-solid fa-circle-check text-success" /> {benefit}</span>
            )) : <>
            <span><i className="fa-solid fa-circle-check text-success" /> Same-day visit available</span>
            <span><i className="fa-solid fa-circle-check text-success" /> Transparent estimate</span>
            <span><i className="fa-solid fa-circle-check text-success" /> Delhi NCR doorstep support</span>
            </>}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PhoneLink
              callLocation="page_cta_call_now"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition duration-300 hover:-translate-y-1 hover:bg-accent"
            >
              <i className="fa-solid fa-phone" /> Call Now
            </PhoneLink>
            <WhatsAppLink
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25d366] px-7 py-4 font-black text-white shadow-cta transition duration-300 hover:-translate-y-1"
            >
              <i className="fa-brands fa-whatsapp" /> WhatsApp Us
            </WhatsAppLink>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/35 px-7 py-4 font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-primary"
            >
              Book Service
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
