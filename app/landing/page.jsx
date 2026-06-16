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
      <section className="py-24">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
      <section className="bg-bgLight py-[120px]" id="book">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FAST BOOKING</span>
            <h2 className="mt-5 text-4xl font-black text-secondary">Request A Callback</h2>
            <p className="mt-4 text-lg leading-relaxed text-textMuted">Share the TV issue and our team will contact you with next steps.</p>
          </div>
          <ContactForm id="landingForm" title="Book Repair" />
        </div>
      </section>
    </main>
  );
}
