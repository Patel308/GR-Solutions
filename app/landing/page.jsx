import HeroSection from '@/components/HeroSection';
import ContactForm from '@/components/ContactForm';
import ServiceCard from '@/components/ServiceCard';
import { services } from '@/data/services';
import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.landing.title,
  description: pageMetadata.landing.description,
  alternates: { canonical: '/landing' },
  openGraph: { title: pageMetadata.landing.title, description: pageMetadata.landing.description, url: '/landing' },
};

export default function LandingPage() {
  return (
    <main>
      <HeroSection
        eyebrow="SAME-DAY SERVICE"
        title="Book TV Repair"
        highlight="Across Delhi NCR"
        description="Fast repair consultation for LED, OLED, QLED and Smart TV faults with doorstep visit options."
        ctaHref="#book"
        ctaLabel="Book Now"
      />
      <section className="section">
        <div className="container grid-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
      <section className="section section-faq" id="book">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">FAST BOOKING</span>
            <h2>Request A Callback</h2>
            <p>Share the TV issue and our team will contact you with next steps.</p>
          </div>
          <ContactForm id="landingForm" title="Book Repair" />
        </div>
      </section>
    </main>
  );
}
