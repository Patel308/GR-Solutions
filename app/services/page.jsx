import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { services } from '@/data/services';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export const metadata = {
  title: pageMetadata.services.title,
  description: pageMetadata.services.description,
  alternates: { canonical: '/services' },
  openGraph: { title: pageMetadata.services.title, description: pageMetadata.services.description, url: '/services' },
};

const tvServices = services.filter(
  (s) => !['laptop-repair', 'mobile-repair'].includes(s.slug)
);

const processSteps = [
  {
    icon: 'fa-solid fa-phone-volume',
    title: 'Contact GR Solution',
    text: 'Call, WhatsApp or submit the enquiry form with your repair requirement.',
  },
  {
    icon: 'fa-solid fa-clipboard-list',
    title: 'Share Device Issue',
    text: 'Tell us the model, symptoms and service location for better diagnosis.',
  },
  {
    icon: 'fa-solid fa-magnifying-glass',
    title: 'Get Diagnosis Visit',
    text: 'Our technician checks the device and explains the issue clearly.',
  },
  {
    icon: 'fa-solid fa-file-invoice',
    title: 'Approve Repair Estimate',
    text: 'You receive a transparent estimate before any paid repair work begins.',
  },
];

export default function ServicesPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'GR Solution Repair Services',
          url: `${siteConfig.url}/services`,
          hasPart: tvServices.map((service) => ({
            '@type': 'Service',
            name: service.title,
            url: `${siteConfig.url}/services/${service.slug}`,
          })),
        }}
      />

      {/* Hero */}
      <section className="section page-hero-next" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge">REPAIR SERVICES</span>
          <h1 style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Professional TV & Electronics{' '}
            <span className="primary-text">Repair Services</span>
          </h1>
          <p style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Explore GR Solution services for LED TV, OLED/QLED, panel bonding, Smart TV setup,
            CCTV security and DTH support across Delhi, Noida and NCR.
          </p>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container grid-3">
          {tvServices.map((service) => (
            <article className="card service-card-detailed" key={service.slug}>
              <div className="service-card-img-wrap">
                <Image
                  src={service.image}
                  alt={`${service.title} by GR Solution`}
                  width={520}
                  height={320}
                />
                <div className="service-card-img-overlay" />
              </div>
              <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                  {service.shortDescription}
                </p>
                {service.benefits?.length > 0 && (
                  <ul className="service-card-benefits">
                    {service.benefits.slice(0, 3).map((b) => (
                      <li key={b}>
                        <i className="fa-solid fa-check" /> {b}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/services/${service.slug}`}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                >
                  View Service
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4-Step Repair Process */}
      <section style={{ padding: '100px 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge mb-3">SERVICE FLOW</span>
            <h2>Our 4-Step Repair Process</h2>
            <p>A simple process from first contact to approved repair.</p>
          </div>
          <div className="grid-4" style={{ marginTop: '2rem' }}>
            {processSteps.map((step, index) => (
              <article className="card process-card" key={step.title}>
                <span className="process-step-badge">STEP {index + 1}</span>
                <div className="process-icon-box">
                  <i className={step.icon} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
