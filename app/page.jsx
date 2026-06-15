import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import ContactForm from '@/components/ContactForm';
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
    answer: 'Many bookings can be handled the same day depending on location, technician availability and the repair type.',
  },
  {
    question: 'Which TV types do you repair?',
    answer: 'We handle LED, LCD, OLED, QLED and Smart TV issues including display, sound, power, backlight and panel faults.',
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
        description="Expert LCD, LED, OLED and QLED TV repairs with genuine parts where available, same-day service options and trusted doorstep support."
      />

      <section className="section section-hero-carousel">
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge mb-3">OUR REPAIR SOLUTIONS</span>
            <h2>Our Specialty Services</h2>
            <p>We handle major electronics and home technology repairs with professional diagnostics.</p>
          </div>
          <div className="carousel-container specialty-carousel-next" aria-label="GR Solution specialty services">
            <div className="carousel-track">
              {carouselServices.map((service, index) => (
                <ServiceCard key={`${service.slug}-${index}`} service={service} featured={index === 1} carousel />
              ))}
            </div>
          </div>
          <div className="services-mobile-grid-next">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">WHY CHOOSE US</span>
            <h2>
              Why Delhi, Noida & NCR Trusts <span className="primary-text">GR Solution</span>
            </h2>
            <p>
              Our repair process focuses on clear diagnosis, professional handling, transparent communication and practical
              repair options before any paid work begins.
            </p>
            <Link href="/about" className="btn btn-outline">
              About GR Solution
            </Link>
          </div>
          <div className="grid-2">
            {['Certified technicians', 'Doorstep diagnosis', 'Clear repair estimate', 'Local NCR coverage'].map((item) => (
              <article className="card" key={item}>
                <i className="fa-solid fa-circle-check card-icon" />
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="section section-faq">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">FAQ</span>
            <h2>Common Questions</h2>
            <p>Helpful answers about GR Solution repair services across Delhi, Noida and NCR.</p>
          </div>
          <FAQ faqs={faqs} />
        </div>
      </section>

      <section className="section" id="quote">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">BOOK SERVICE</span>
            <h2>Get A Free Repair Consultation</h2>
            <p>Share your device issue and our team will guide you on the next step.</p>
          </div>
          <ContactForm id="callbackForm" title="Request Callback" />
        </div>
      </section>

      <CTASection />
    </main>
  );
}
