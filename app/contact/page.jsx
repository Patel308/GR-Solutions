import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export const metadata = {
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  alternates: { canonical: '/contact' },
  openGraph: { title: pageMetadata.contact.title, description: pageMetadata.contact.description, url: '/contact' },
};

export default function ContactPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact GR Solution',
          url: `${siteConfig.url}/contact`,
        }}
      />
      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">REACH OUT</span>
            <h1 className="mt-7 text-[clamp(3rem,6vw,5.4rem)] font-black leading-[1.08] text-secondary">
              Experience Premium <span className="text-primary">At-Home TV Repair</span>
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-relaxed text-textMain">
              Delhi, Noida & NCR&apos;s trusted engineering team for OLED, QLED and LED TV repairs. Contact us for a free
              diagnostic consultation and professional same-day doorstep service.
            </p>
          </div>
          <Image src="/images/service_tv.webp" alt="GR Solution technician repairing a TV at home" width={650} height={520} className="h-[min(520px,52vw)] min-h-[360px] w-full rounded-3xl object-cover shadow-cardPro" priority />
        </div>
      </section>
      <section className="bg-white py-28">
        <div className="container grid items-start gap-20 lg:grid-cols-[1.25fr_0.85fr]">
          <div>
            <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-black leading-tight text-secondary">
              Have A Question? <br />
              <span className="text-primary">Talk To Us</span>
            </h2>
            <p className="mb-12 mt-6 max-w-3xl text-lg leading-relaxed text-textMain">
              Have questions about a repair or want to book an appointment? Get in touch with our team and we&apos;ll get
              back to you quickly.
            </p>
            <div className="grid gap-8">
              <article className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-5">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
                  <i className="fa-solid fa-phone-volume" />
                </span>
                <div>
                  <h3 className="mb-2 text-xl font-black text-secondary">Direct Call</h3>
                  <a href={siteConfig.phoneHref} className="text-lg font-black text-textMain">{siteConfig.phone}</a>
                  <p className="mt-1 text-textMuted">Mon - Sun: 9:00 AM - 9:00 PM</p>
                </div>
              </article>
              <article className="grid grid-cols-[56px_minmax(0,1fr)] items-start gap-5">
                <span className="mt-1 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
                  <i className="fa-solid fa-location-dot" />
                </span>
                <div>
                  <h3 className="mb-2 text-xl font-black text-secondary">Service Location</h3>
                  <a href={siteConfig.googleBusinessProfile} target="_blank" className="text-lg font-black leading-relaxed text-textMain">
                    {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}
                  </a>
                  <p className="mt-1 text-textMuted">{siteConfig.serviceAreas.join(', ')}</p>
                </div>
              </article>
              <article className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-5">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
                  <i className="fa-solid fa-envelope" />
                </span>
                <div>
                  <h3 className="mb-2 text-xl font-black text-secondary">Email Support</h3>
                  <a href={siteConfig.emailHref} className="text-lg font-black text-textMain">{siteConfig.email}</a>
                </div>
              </article>
            </div>
          </div>
          <div>
            <ContactForm id="appointmentForm" title="Book Your Appointment" appointment />
          </div>
        </div>
      </section>
      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-8">
            <div>
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">LOCATION</span>
              <h2 className="mt-3 text-4xl font-black text-secondary">Locate Our Center</h2>
            </div>
            <Link href={siteConfig.googleBusinessProfile} target="_blank" className="inline-flex rounded-full border-2 border-primary bg-white px-6 py-3 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white">
              View Google Business Profile
            </Link>
          </div>
          <iframe
            title="GR Solution service area map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112075.76219313936!2d77.1065171731608!3d28.613766785899995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf0154942ae45%3A0x6b107e33527a7187!2sDelhi%20NCR!5e0!3m2!1sen!2sin!4v1714571983054!5m2!1sen!2sin"
            width="100%"
            height="380"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
