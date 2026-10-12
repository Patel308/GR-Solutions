import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { TrustBand } from '@/components/TrustStrip';
import { HeroActions } from '@/components/page/PageHero';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';

export const metadata = {
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  alternates: { canonical: '/contact' },
  openGraph: { title: pageMetadata.contact.title, description: pageMetadata.contact.description, url: '/contact' },
};

export default function ContactPage() {
  return (
    <main data-wa-context="TV repair in Delhi NCR">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact GR Solution',
            url: `${siteConfig.url}/contact`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Contact', item: `${siteConfig.url}/contact` },
            ],
          },
        ]}
      />
      <section className="hero-surface border-b border-line" data-section="contact_hero">
        <div className="container grid items-center gap-8 pb-10 pt-8 sm:pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pb-16 lg:pt-14">
          <div>
            <span className="eyebrow">REACH OUT</span>
            <h1 className="mt-3">
              Experience Premium <span className="heading-accent">At-Home TV Repair</span>
            </h1>
            <p className="lead mt-4 max-w-2xl">
              Delhi, Noida & NCR&apos;s trusted engineering team for OLED, QLED and LED TV repairs. Contact us for a free
              diagnostic consultation and professional doorstep service where available.
            </p>
            <div className="mt-6">
              <HeroActions>
                <PhoneLink callLocation="contact_hero_call" className="btn btn-primary btn-lg" data-cta="contact_hero_call">
                  <i className="fa-solid fa-phone" aria-hidden="true" /> Call now
                </PhoneLink>
                <WhatsAppLink className="btn btn-whatsapp btn-lg" data-cta="contact_hero_whatsapp">
                  <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
                </WhatsAppLink>
                <a href="#book-appointment" className="btn btn-secondary btn-lg" data-cta="contact_hero_book">
                  <i className="fa-solid fa-calendar-check" aria-hidden="true" /> Book a visit
                </a>
              </HeroActions>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[36rem] lg:max-w-none">
            <Image
              src="/images/service_tv.webp"
              alt="GR Solution technician repairing a TV at home in Delhi NCR"
              width={650}
              height={520}
              preload
              fetchPriority="high"
              sizes="(min-width: 1280px) 520px, (min-width: 992px) 40vw, (min-width: 608px) 576px, calc(100vw - 2rem)"
              className="aspect-[650/520] w-full rounded-[1.25rem] object-cover shadow-card-hover ring-1 ring-black/5"
            />
          </div>
        </div>
      </section>

      <TrustBand />

      <section className="section band" data-section="contact_main">
        <div className="container grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <h2>
              Have A Question? <br />
              <span className="heading-accent">Talk To Us</span>
            </h2>
            <p className="lead mt-4 max-w-xl">
              Have questions about a repair or want to book an appointment? Get in touch with our team and we&apos;ll get
              back to you quickly.
            </p>
            <div className="mt-8 grid gap-4">
              <article className="card flex items-start gap-4 p-5 sm:p-6">
                <span className="icon-tile size-12 text-lg" aria-hidden="true">
                  <i className="fa-solid fa-phone-volume" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg">Direct Call</h3>
                  <PhoneLink
                    callLocation="contact_direct_call"
                    className="inline-flex min-h-[2.75rem] items-center font-display text-xl font-bold text-navy-600 hover:text-navy-800"
                  />
                  <p className="text-small text-muted">Mon - Sun: 9:00 AM - 9:00 PM</p>
                </div>
              </article>
              <article className="card flex items-start gap-4 p-5 sm:p-6">
                <span className="icon-tile size-12 text-lg" aria-hidden="true">
                  <i className="fa-solid fa-location-dot" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg">Service Location</h3>
                  <a
                    href={siteConfig.googleBusinessProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-semibold leading-relaxed text-navy-600 underline decoration-navy-200 underline-offset-4 hover:decoration-current"
                  >
                    {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}
                  </a>
                  <p className="mt-1 text-small text-muted">{siteConfig.serviceAreas.join(', ')}</p>
                </div>
              </article>
              <article className="card flex items-start gap-4 p-5 sm:p-6">
                <span className="icon-tile size-12 text-lg" aria-hidden="true">
                  <i className="fa-solid fa-envelope" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg">Email Support</h3>
                  <a
                    href={siteConfig.emailHref}
                    className="inline-flex min-h-[2.75rem] items-center break-all font-semibold text-navy-600 hover:text-navy-800"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </article>
            </div>
          </div>
          <div id="book-appointment">
            <ContactForm id="appointmentForm" title="Book Your Appointment" appointment />
          </div>
        </div>
      </section>

      <section className="section band-tint" data-section="contact_map">
        <div className="container">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">LOCATION</span>
              <h2 className="mt-3">Locate Our Center</h2>
            </div>
            <Link
              href={siteConfig.googleBusinessProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              data-cta="contact_google_profile"
            >
              View Google Business Profile <i className="fa-solid fa-arrow-up-right-from-square text-sm" aria-hidden="true" />
            </Link>
          </div>
          {/* Pinned to the actual business address rather than the "Delhi NCR"
              region centroid, so the on-page location matches the NAP and the
              geo coordinates in the LocalBusiness schema. Uses the keyless
              address embed, so no Maps API key is needed. */}
          <div className="overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-card">
            <iframe
              title="Map to GR Solution, New Kondli, Delhi"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${siteConfig.name}, ${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality} ${siteConfig.address.postalCode}`,
              )}&z=16&output=embed`}
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full sm:h-[380px]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
