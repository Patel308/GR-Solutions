import HeroSection from '@/components/HeroSection';
import ContactForm from '@/components/ContactForm';
import ServiceCard from '@/components/ServiceCard';
import { TrustBand } from '@/components/TrustStrip';
import { services } from '@/data/services';
import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.landing.title,
  description: pageMetadata.landing.description,
  alternates: { canonical: '/landing' },
  // Paid/conversion landing page: duplicates /contact intent with no unique
  // organic value, so it is kept out of the index and out of the sitemap.
  robots: { index: false, follow: true },
  openGraph: { title: pageMetadata.landing.title, description: pageMetadata.landing.description, url: '/landing' },
};

const bookingPoints = [
  { icon: 'fa-solid fa-magnifying-glass', text: 'Free doorstep diagnosis' },
  { icon: 'fa-solid fa-file-invoice', text: 'Firm estimate before any paid work' },
  { icon: 'fa-solid fa-shield-halved', text: '90-day service warranty where applicable' },
];

export default function LandingPage() {
  return (
    <main data-wa-context="TV repair in Delhi NCR">
      <HeroSection
        eyebrow="SAME-DAY SERVICE"
        title="Book TV Repair"
        highlight="Across Delhi NCR"
        description="Fast repair consultation for LED, OLED/QLED, LCD, Plasma and Curved TV faults with doorstep visit options."
        ctaHref="#book"
        ctaLabel="Book Now"
      />
      <TrustBand />
      <section className="section band-tint" data-section="landing_services">
        <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
      <section className="section band" id="book" data-section="landing_booking">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow">FAST BOOKING</span>
            <h2 className="mt-3">Request A Callback</h2>
            <p className="lead mt-4">Share the TV issue and our team will contact you with next steps.</p>
            <ul className="mt-6 grid gap-3">
              {bookingPoints.map((point) => (
                <li key={point.text} className="flex items-center gap-3 font-semibold text-ink">
                  <span className="icon-tile icon-tile-teal size-10" aria-hidden="true">
                    <i className={point.icon} />
                  </span>
                  {point.text}
                </li>
              ))}
            </ul>
          </div>
          <ContactForm id="landingForm" title="Book Repair" />
        </div>
      </section>
    </main>
  );
}
