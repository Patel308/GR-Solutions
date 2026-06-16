import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import BookingForm from '@/components/BookingForm';
import { services } from '@/data/services';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

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
    answer: 'Yes, GR Solution provides doorstep repair services across Delhi, Noida, Gurgaon, Ghaziabad, Faridabad and nearby NCR areas.',
  },
  {
    question: 'How quickly can a technician visit?',
    answer: 'In most nearby service areas, we try to arrange same-day or next-day technician visits depending on availability and the repair issue.',
  },
  {
    question: 'Which TV types do you repair?',
    answer: 'We repair LED, LCD, OLED, QLED, Smart TV, Android TV and large-screen televisions from major brands.',
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

const brandNames = ['SAMSUNG', 'SONY', 'LG', 'XIAOMI', 'ONEPLUS', 'VU', 'TOSHIBA', 'PANASONIC'];

const whyChooseBenefits = [
  {
    title: 'Same Day Repair',
    text: '90% of our TV and mobile repairs are completed within 6 hours.',
  },
  {
    title: 'Certified Technicians',
    text: '10+ years of experience in high-end television technology.',
  },
  {
    title: 'Transparent Pricing',
    text: 'Fixed diagnostic fees and upfront quotes before repair.',
  },
];

export default function HomePage() {
  const carouselServices = [...services.slice(0, 6), ...services.slice(0, 6)];

  return (
    <main>
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
        description="Expert LCD, LED, OLED, and QLED TV repairs. We provide genuine parts, same-day service, and a 90-day warranty. Trusted by 15,000+ happy customers in Delhi, Noida & NCR."
      />

      {/* Services Carousel */}
      <section className="bg-bgLight py-[60px] pb-[100px]">
        <div className="container">
          <div className="mb-20 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">OUR REPAIR SOLUTIONS</span>
            <h2 className="text-4xl font-black text-secondary">Our Specialty Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">We handle major electronics and home technology repairs with professional diagnostics.</p>
          </div>
          <div className="specialty-carousel-next hidden overflow-hidden lg:block" aria-label="GR Solution specialty services">
            <div className="carousel-track">
              {carouselServices.map((service, index) => (
                <ServiceCard key={`${service.slug}-${index}`} service={service} featured={index === 1} carousel />
              ))}
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:hidden">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us — Redesigned */}
      <section className="bg-bgLight py-[100px]">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Image
                src="/images/team.webp"
                alt="GR Solution Expert Team"
                width={650}
                height={480}
                style={{ borderRadius: '20px', width: '100%' }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem' }}>
                Why Delhi, Noida & NCR Trusts <br />
                <span className="text-primary">GR Service Center</span>
              </h2>
              <ul style={{ marginTop: '2rem' }}>
                {whyChooseBenefits.map((benefit) => (
                  <li
                    key={benefit.title}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(0, 74, 173, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-check" />
                    </div>
                    <div>
                      <h4 style={{ marginBottom: 0 }}>{benefit.title}</h4>
                      <p style={{ color: 'var(--text-muted)' }}>{benefit.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Custom Electronics — Dark CTA Section */}
      <section
        style={{
          padding: '120px 0',
          background: "linear-gradient(rgba(8, 9, 28, 0.88), rgba(8, 9, 28, 0.92)), url('/images/hero.webp') center/cover",
          color: 'var(--white)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span
            style={{
              display: 'inline-block',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              marginBottom: '2rem',
              padding: '0.8rem 2rem',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
            }}
          >
            FOR CUSTOM ELECTRONICS
          </span>
          <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '2rem', lineHeight: 1.2 }}>
            Can&apos;t Find Your <span style={{ color: '#60a5fa' }}>Specific Issue?</span>
          </h2>
          <p
            style={{
              margin: '0 auto 4rem',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '1.25rem',
              maxWidth: '900px',
              lineHeight: 1.8,
            }}
          >
            Our laboratory is equipped with state-of-the-art diagnostic tools for complex board-level
            electronics. From panel bonding to chipset reballing, we handle it all.{' '}
            <br />
            <strong style={{ color: 'white' }}>Talk to an engineer for a free technical consultation.</strong>
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-3 rounded-full border-2 border-[#2563eb] bg-[#2563eb] px-10 py-4 text-[0.95rem] font-bold text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:border-[#1d4ed8] hover:bg-[#1d4ed8] hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)]"
            >
              <i className="fa-solid fa-phone" /> Call An Engineer
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full border-2 border-white/70 px-10 py-4 text-[0.95rem] font-bold text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              Submit Service Request &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Ready to Help — Premium Booking Section */}
      <section className="border-t border-slate-200 bg-slate-50 py-[100px]" id="quote">
        <div className="container">
          <div className="grid items-start gap-20 lg:grid-cols-2">
            {/* Left Column */}
            <div>
              <span
                className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary"
                style={{
                  background: 'rgba(0,74,173,0.1)',
                  color: 'var(--primary)',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  marginBottom: '2rem',
                  display: 'inline-block',
                }}
              >
                READY TO HELP
              </span>
              <h2
                className="text-[3.2rem]"
                style={{
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: 'var(--secondary)',
                  marginBottom: '3rem',
                }}
              >
                Book Your Premium <br />
                <span className="text-primary">Repair Service</span>
              </h2>

              {/* Feature Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '2rem' }}>
                <div className="flex items-start gap-6 transition duration-300">
                  <div className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                    <i className="fa-solid fa-truck-fast" />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.4rem', color: 'var(--secondary)', fontSize: '1.1rem', fontWeight: 700 }}>
                      90 Min Response
                    </h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                      Our lead engineers priority-dispatch to your location across Delhi NCR.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 transition duration-300">
                  <div className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                    <i className="fa-solid fa-shield-halved" />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.4rem', color: 'var(--secondary)', fontSize: '1.1rem', fontWeight: 700 }}>
                      Verified Guarantee
                    </h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                      All repairs come with an authorized certificate and 12-month warranty.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 transition duration-300">
                  <div className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                    <i className="fa-solid fa-headset" />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.4rem', color: 'var(--secondary)', fontSize: '1.1rem', fontWeight: 700 }}>
                      24/7 Priority Hotline
                    </h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                      Direct access to our technical desk for post-repair support and guidance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Row */}
              <div className="mt-16 flex gap-20 border-t border-slate-200 pt-12 max-md:flex-col max-md:gap-6">
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      display: 'block',
                      marginBottom: '0.6rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    CALL US NOW
                  </span>
                  <a
                    href={siteConfig.phoneHref}
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: 'var(--secondary)',
                      textDecoration: 'none',
                    }}
                  >
                    {siteConfig.phone}
                  </a>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      display: 'block',
                      marginBottom: '0.6rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    EMAIL US
                  </span>
                  <a
                    href={siteConfig.emailHref}
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: 'var(--secondary)',
                      textDecoration: 'none',
                    }}
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column — Form Card */}
            <div>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Authorized Service Expertise — Brands Carousel */}
      <section className="border-t border-[#eee] bg-bgLight py-[100px]">
        <div className="container">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black text-secondary">Authorized Service Expertise</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">We are certified experts in repairing products from all global giants.</p>
          </div>
          <div className="logo-carousel-container">
            <div className="logo-track">
              {[...brandNames, ...brandNames].map((brand, i) => (
                <div className="logo-item" key={`${brand}-${i}`}>
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Expert Repair Team */}
      <section className="bg-white py-[100px]">
        <div className="container grid items-center gap-20 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">
              EXPERT ENGINEERS
            </span>
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
              Meet Our <span className="text-primary">Expert Repair Team</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              At GR Solution, our team consists of 25+ certified electronics engineers who have worked
              with major global brands like Sony, Samsung, and LG. We specialize in precision board-level
              and panel repairs that most shops can&apos;t handle.
            </p>
            <div style={{ display: 'flex', gap: '3rem', marginTop: '2.5rem' }}>
              <div>
                <h2 style={{ marginBottom: 0, color: 'var(--secondary)' }}>15+</h2>
                <span style={{ color: 'var(--text-muted)' }}>Years Experience</span>
              </div>
              <div>
                <h2 style={{ marginBottom: 0, color: 'var(--secondary)' }}>25k+</h2>
                <span style={{ color: 'var(--text-muted)' }}>TVs Repaired</span>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/images/team.webp"
              alt="GR Solution Technical Team"
              width={650}
              height={480}
              style={{ borderRadius: '20px', width: '100%', boxShadow: 'var(--shadow-lg)' }}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ — moved to near the end */}
      <section className="bg-bgLight py-[120px]">
        <div className="container">
          <div className="mb-20 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FAQ</span>
            <h2 className="text-4xl font-black text-secondary">Common Questions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">Helpful answers about GR Solution repair services across Delhi, Noida and NCR.</p>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <FAQ faqs={faqs} />
          </div>
        </div>
      </section>

    </main>
  );
}
