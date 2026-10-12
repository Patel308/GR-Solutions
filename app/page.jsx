import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import BookingForm from '@/components/BookingForm';
import TrustStrip from '@/components/TrustStrip';
import { services } from '@/data/services';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';
import { brands } from '@/data/brandServicePages';
import { hasRealPricing, repairPriceBands } from '@/data/pricing';
import { PhoneLink } from '@/components/ContactChannel';

export const metadata = {
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: pageMetadata.home.title,
    description: pageMetadata.home.description,
    url: '/',
    images: [siteConfig.defaultOgImage],
  },
};

const faqs = [
  {
    question: 'Do you provide home service across Delhi, Noida & NCR?',
    answer: 'Yes, GR Solution provides doorstep repair services across Delhi, Noida, Greater Noida, Ghaziabad and nearby NCR areas.',
  },
  {
    question: 'How quickly can a technician visit?',
    answer: 'In most nearby service areas, we try to arrange same-day or next-day technician visits depending on availability and the repair issue.',
  },
  {
    question: 'Which TV types do you repair?',
    answer: 'We repair LED, LCD, OLED/QLED, Plasma, Curved and large-screen televisions from major brands.',
  },
  {
    question: 'Do you repair TV panels and display issues?',
    answer: 'Yes, we handle panel-related issues, display lines, backlight problems, no display, screen flickering and panel bonding cases where repair is possible.',
  },
  {
    question: 'Do you provide warranty after repair?',
    answer: 'Warranty depends on the repair type and parts used. Our team explains the warranty terms clearly before starting the repair.',
  },
  {
    question: 'Can I get an estimate before repair?',
    answer: 'Yes, after diagnosis we share the repair estimate clearly so you can approve the work before any paid repair begins.',
  },
  {
    question: 'Do you use genuine parts?',
    answer: 'We use genuine or high-quality compatible parts depending on availability, device model and customer approval.',
  },
  {
    question: 'How can I book a repair service?',
    answer: 'You can call directly, send a WhatsApp message, or submit the enquiry form on the website. Our team will contact you for details and scheduling.',
  },
];

// Kept in sync with data/brandServicePages.js -- every brand shown here has a
// real brand page behind it, and every brand page is represented here.
const brandNames = brands.map((brand) => brand.displayName.toUpperCase());

const whyChooseBenefits = [
  {
    title: 'Same Day Repair',
    text: 'Fast doorstep support is arranged based on technician availability and service location.',
  },
  {
    title: 'Experienced Technicians',
    text: 'Practical experience with LED, OLED/QLED, LCD, Plasma and Curved TV diagnosis.',
  },
  {
    title: 'Transparent Pricing',
    text: 'Free diagnosis and an upfront quote before any repair.',
  },
];

const popularLocationLinks = [
  { label: 'LED TV Repair Noida', href: '/services/led-tv-repair-noida' },
  { label: 'LED TV Repair Delhi', href: '/services/led-tv-repair-delhi' },
  { label: 'TV Repair Noida', href: '/services/tv-repair-noida' },
  { label: 'TV Repair Delhi', href: '/services/tv-repair-delhi' },
  { label: 'Sony TV Repair Noida', href: '/services/sony-tv-repair-noida' },
  { label: 'Samsung TV Repair Delhi', href: '/services/samsung-tv-repair-delhi' },
  { label: 'TV Repair Greater Noida', href: '/services/tv-repair-greater-noida' },
  { label: 'TV Repair Ghaziabad', href: '/services/tv-repair-ghaziabad' },
  { label: 'LCD TV Repair Delhi', href: '/services/lcd-tv-repair-delhi' },
  { label: 'LED TV Repair Ghaziabad', href: '/services/led-tv-repair-ghaziabad' },
  { label: 'TV Repair Near Me', href: '/services/tv-repair-near-me' },
  { label: 'Contact GR Solution', href: '/contact' },
];

// "How it works" restates commitments the site already makes (free diagnosis,
// firm estimate before paid work, warranty explained up front).
const steps = [
  { icon: 'fa-solid fa-phone-volume', title: 'Call, WhatsApp or book online', text: 'Tell us the TV brand, screen size and what is going wrong.' },
  { icon: 'fa-solid fa-magnifying-glass', title: 'Free doorstep diagnosis', text: 'The technician finds the part that failed and gives you a firm estimate.' },
  { icon: 'fa-solid fa-wrench', title: 'Approve, then we repair', text: 'No paid work starts until you approve it. Warranty terms are explained first.' },
];

// Price teaser: the same Delhi NCR market ranges as /pricing (smallest to
// largest screen band for each fault).
const teaserFaults = [
  ['Backlight / LED strip replacement', 'Backlight / LED strips'],
  ['Power supply board repair or replacement', 'Power supply board'],
  ['Mainboard / motherboard repair', 'Mainboard'],
];
const teaserRows = teaserFaults.map(([fault]) => repairPriceBands.find((item) => item.fault === fault)).filter(Boolean);
// Hidden automatically if the price data is ever reset to placeholders.
const priceTeaser = hasRealPricing(teaserRows)
  ? teaserRows.map((row, index) => ({
      label: teaserFaults[index][1],
      range: `₹${row.bands[0].split(' - ')[0]} – ₹${row.bands[row.bands.length - 1].split(' - ')[1]}`,
    }))
  : [];

export default function HomePage() {
  return (
    <main data-wa-context="TV repair in Delhi NCR">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <HeroSection
        eyebrow="#1 TV Repair in Delhi, Noida & NCR"
        title="Premium TV Repair Services"
        highlight="At Your Doorstep"
        description="Expert LCD, LED, OLED, and QLED TV repairs with careful diagnosis, transparent estimates and a 90-day service warranty where applicable. Trusted by 15,000+ happy customers in Delhi, Noida & NCR."
      />

      <section aria-label="Why customers choose GR Solution" className="border-y border-line bg-white py-5 sm:py-6">
        <div className="container">
          <TrustStrip />
        </div>
      </section>

      {/* Services */}
      <section className="section bg-surface" data-section="services">
        <div className="container">
          <div className="section-head section-head-center">
            <span className="eyebrow">OUR REPAIR SOLUTIONS</span>
            <h2 className="mt-3">Our Specialty Services</h2>
            <p className="lead mt-3">We handle major electronics and home technology repairs with professional diagnostics.</p>
          </div>
          {/* The old marquee rendered the list twice more; those cards stay in
              the HTML (unchanged page outline) but are never shown. */}
          <div className="specialty-carousel-next hidden" aria-hidden="true">
            {[...services.slice(0, 6), ...services.slice(0, 6)].map((service, index) => (
              <ServiceCard key={`${service.slug}-${index}`} service={service} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
            {services.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
                className="w-full sm:basis-[calc(50%-0.625rem)] lg:basis-[calc(33.333%-0.84rem)]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-it-works-label" className="section-tight bg-white" data-section="how_it_works">
        <div className="container">
          <p id="how-it-works-label" className="eyebrow">How it works</p>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 rounded-2xl border border-line bg-white p-5">
                <span className="icon-tile icon-tile-teal" aria-hidden="true">
                  <i className={step.icon} />
                </span>
                <div>
                  <p className="font-display text-[1.0625rem] font-bold text-ink">
                    <span className="mr-1.5 text-teal-600">{index + 1}.</span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-small leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Real workshop photos */}
      <section className="section border-y border-line bg-surface" data-section="workshop">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <span className="eyebrow">REAL WORKSHOP PHOTOS</span>
              <h2 className="mt-3">See the Care Behind Every TV Repair</h2>
              <p className="lead mt-4 max-w-xl">
                These are photos from the GR Solution workshop, where technicians inspect TV display, power and board-level issues before discussing the available repair options with you.
              </p>
              <div className="mt-6 grid gap-4">
                <div className="flex items-start gap-3">
                  <span className="icon-tile icon-tile-teal size-9" aria-hidden="true">
                    <i className="fa-solid fa-magnifying-glass text-sm" />
                  </span>
                  <p className="leading-relaxed text-muted"><strong className="text-ink">Inspection-led diagnosis:</strong> We check the reported symptom before suggesting a repair path.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="icon-tile icon-tile-teal size-9" aria-hidden="true">
                    <i className="fa-solid fa-comments text-sm" />
                  </span>
                  <p className="leading-relaxed text-muted"><strong className="text-ink">Clear repair discussion:</strong> Feasibility and next steps are explained before paid work begins.</p>
                </div>
              </div>
              <Link href="/contact" className="link-arrow mt-4">
                Discuss your TV issue with GR Solution <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(140px,0.75fr)] gap-3 sm:gap-4">
              <figure className="relative col-span-2 overflow-hidden rounded-2xl bg-navy-50 shadow-card">
                <Image
                  src="/images/workshop-repair-bench.webp"
                  alt="GR Solution workshop repair bench with TV panels and diagnostic equipment"
                  width={1200}
                  height={900}
                  sizes="(min-width: 992px) 58vw, 100vw"
                  className="aspect-[4/3] h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-lg bg-ink/90 px-3 py-2 text-xs font-semibold text-white sm:bottom-4 sm:left-4 sm:text-sm">
                  TV diagnostics at our workshop
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl bg-navy-50 shadow-card">
                <Image
                  src="/images/workshop-tv-diagnosis.webp"
                  alt="GR Solution technician inspecting a TV at the workshop"
                  width={720}
                  height={960}
                  sizes="(min-width: 1024px) 32vw, 62vw"
                  className="aspect-[3/4] h-full w-full object-cover"
                />
              </figure>
              <figure className="flex min-h-0 flex-col justify-between rounded-2xl border border-line bg-white p-3 shadow-card sm:p-4">
                <Image
                  src="/images/workshop-interior.webp"
                  alt="Interior view of the GR Solution TV repair workshop"
                  width={141}
                  height={118}
                  sizes="141px"
                  className="h-auto w-full rounded-lg object-cover"
                />
                <figcaption className="mt-3">
                  <span className="eyebrow text-[0.6875rem]">Our workspace</span>
                  <p className="mt-1 text-small font-semibold leading-snug text-ink">Practical support for TV repair work.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Price transparency */}
      {priceTeaser.length ? (
      <section aria-labelledby="price-teaser-label" className="section-tight bg-white" data-section="price_teaser">
        <div className="container">
          <div className="grid gap-6 rounded-[1.25rem] border border-line bg-white p-5 shadow-card sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-12">
            <div>
              <p id="price-teaser-label" className="eyebrow">Typical repair costs in Delhi NCR</p>
              <p className="mt-3 font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
                Know the likely price before the technician arrives.
              </p>
              <p className="mt-2 text-small leading-relaxed text-muted">
                Market ranges including part and labour, from the smallest to the largest screens. Diagnosis is free and you get a firm figure before any paid work.
              </p>
              <Link href="/pricing" className="link-arrow mt-2" data-cta="home_price_guide">
                See the full price guide <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
            <ul className="divide-y divide-line rounded-xl border border-line">
              {priceTeaser.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
                  <span className="font-semibold text-ink">{item.label}</span>
                  <span className="whitespace-nowrap font-display font-bold tabular-nums text-primary">{item.range}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      ) : null}

      {/* Popular searches */}
      <section className="section bg-surface" data-section="popular_searches">
        <div className="container">
          <div className="section-head section-head-center">
            <span className="eyebrow">POPULAR SEARCHES</span>
            <h2 className="mt-3">Popular TV Repair Searches in Delhi NCR</h2>
            <p className="lead mt-3">
              Quick links to the most requested GR Solution TV repair pages across Delhi NCR.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularLocationLinks.map((item) => (
              <Link key={item.href} href={item.href} className="link-tile">
                <span>{item.label}</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why customers trust GR Solution */}
      <section className="section bg-white" data-section="why_trust">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-[1.25rem] bg-navy-50 shadow-card">
              <Image
                src="/images/workshop-tv-diagnosis.webp"
                alt="GR Solution technician opening the back panel of a TV on the padded workshop bench"
                width={720}
                height={960}
                sizes="(min-width: 992px) 560px, calc(100vw - 2rem)"
                className="aspect-[4/3] w-full object-cover object-[50%_35%] lg:aspect-[5/4]"
              />
            </div>
            <div>
              <h2>
                Why Delhi, Noida & NCR Trusts <br />
                <span className="heading-accent">GR Solution</span>
              </h2>
              <ul className="mt-6 grid gap-5">
                {whyChooseBenefits.map((benefit) => (
                  <li key={benefit.title} className="flex items-start gap-4">
                    <span className="icon-tile icon-tile-teal size-10" aria-hidden="true">
                      <i className="fa-solid fa-check" />
                    </span>
                    <div>
                      <h4>{benefit.title}</h4>
                      <p className="mt-1 leading-relaxed text-muted">{benefit.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For custom electronics */}
      <section className="surface-dark section text-center" data-section="engineer_cta">
        <div className="container max-w-4xl">
          <span className="eyebrow eyebrow-on-dark justify-center">FOR CUSTOM ELECTRONICS</span>
          <h2 className="mx-auto mt-4 max-w-3xl">
            Can&apos;t Find Your <span className="text-teal-300">Specific Issue?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/80">
            Our laboratory is equipped with state-of-the-art diagnostic tools for complex board-level
            electronics. From panel bonding to chipset reballing, we handle it all.{' '}
            <br />
            <strong className="text-white">Talk to an engineer for a free technical consultation.</strong>
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PhoneLink callLocation="homepage_engineer_cta" className="btn btn-light btn-lg">
              <i className="fa-solid fa-phone" aria-hidden="true" /> Call An Engineer
            </PhoneLink>
            <Link href="/contact" className="btn btn-outline-light btn-lg">
              Submit Service Request &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Ready to help: booking */}
      <section className="section bg-surface" id="quote" data-section="booking">
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="eyebrow">READY TO HELP</span>
              <h2 className="mt-3">
                Book Your Premium <br />
                <span className="heading-accent">Repair Service</span>
              </h2>

              <div className="mt-8 grid gap-6">
                <div className="flex items-start gap-4">
                  <span className="icon-tile" aria-hidden="true">
                    <i className="fa-solid fa-truck-fast" />
                  </span>
                  <div>
                    <h4>90 Min Response</h4>
                    <p className="mt-1 leading-relaxed text-muted">
                      Our lead engineers priority-dispatch to your location across Delhi NCR.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="icon-tile" aria-hidden="true">
                    <i className="fa-solid fa-shield-halved" />
                  </span>
                  <div>
                    <h4>Verified Guarantee</h4>
                    <p className="mt-1 leading-relaxed text-muted">
                      Warranty terms are explained before approval, with a 90-day service warranty where applicable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="icon-tile" aria-hidden="true">
                    <i className="fa-solid fa-headset" />
                  </span>
                  <div>
                    <h4>24/7 Priority Hotline</h4>
                    <p className="mt-1 leading-relaxed text-muted">
                      Direct access to our technical desk for post-repair support and guidance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
                <div>
                  <span className="block text-eyebrow font-semibold uppercase text-muted">
                    CALL US NOW
                  </span>
                  <PhoneLink
                    callLocation="homepage_callback_phone"
                    className="mt-1 inline-flex min-h-[3rem] items-center font-display text-2xl font-bold text-ink hover:text-primary"
                  />
                </div>
                <div>
                  <span className="block text-eyebrow font-semibold uppercase text-muted">
                    EMAIL US
                  </span>
                  <a href={siteConfig.emailHref} className="mt-1 inline-flex min-h-[3rem] items-center break-all font-display text-xl font-bold text-ink hover:text-primary sm:text-2xl">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Brand repair experience */}
      <section className="section bg-white" data-section="brands">
        <div className="container">
          <div className="section-head section-head-center">
            <h2>TV Brand Repair Experience</h2>
            <p className="lead mt-3">We provide independent TV repair support for popular brands after technician diagnosis and part availability checks.</p>
          </div>
          <ul className="logo-carousel-container mx-auto flex max-w-4xl flex-wrap justify-center gap-2.5 sm:gap-3" aria-label="TV brands we repair">
            {[...brandNames, ...brandNames].map((brand, i) => (
              <li
                key={`${brand}-${i}`}
                className={i < brandNames.length ? 'chip min-h-[2.75rem] px-4 font-display tracking-[0.06em] text-ink' : 'hidden'}
                aria-hidden={i < brandNames.length ? undefined : 'true'}
              >
                {brand}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center">
            <Link href="/services/brands" className="link-arrow" data-cta="home_brands">
              Find your brand <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Meet the team */}
      <section className="section border-t border-line bg-surface" data-section="team">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow">EXPERT ENGINEERS</span>
            <h2 className="mt-3">
              Meet Our <span className="heading-accent">Expert Repair Team</span>
            </h2>
            <p className="lead mt-4">
              At GR Solution, our team focuses on practical TV diagnosis for common and complex display,
              power, sound and board-level symptoms. We explain repair feasibility clearly before work begins.
            </p>
            <div className="mt-8 flex gap-10">
              <div>
                <span className="block font-display text-4xl font-extrabold text-ink">5+</span>
                <span className="text-muted">Years Experience</span>
              </div>
              <div>
                <span className="block font-display text-4xl font-extrabold text-ink">15,000+</span>
                <span className="text-muted">Happy Customers</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.25rem] bg-navy-50 shadow-card">
            <Image
              src="/images/workshop-repair-bench.webp"
              alt="TVs on the foam-padded repair bench at the GR Solution workshop in New Kondli"
              width={1200}
              height={900}
              sizes="(min-width: 992px) 560px, calc(100vw - 2rem)"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <Testimonials />

      {/* FAQ */}
      <section className="section bg-surface" data-section="faq">
        <div className="container">
          <div className="section-head section-head-center">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3">Common Questions</h2>
            <p className="lead mt-3">Helpful answers about GR Solution repair services across Delhi, Noida and NCR.</p>
          </div>
          <div className="mx-auto max-w-3xl">
            <FAQ faqs={faqs} name="home-faq" />
          </div>
        </div>
      </section>
    </main>
  );
}
