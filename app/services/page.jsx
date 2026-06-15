import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
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

export default function ServicesPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'GR Solution Repair Services',
          url: `${siteConfig.url}/services`,
          hasPart: services.map((service) => ({
            '@type': 'Service',
            name: service.title,
            url: `${siteConfig.url}/services/${service.slug}`,
          })),
        }}
      />
      <section className="section page-hero-next">
        <div className="container">
          <span className="badge">REPAIR SERVICES</span>
          <h1>
            Professional TV, Laptop & Mobile Repair <span className="primary-text">Services</span>
          </h1>
          <p>
            Explore GR Solution services for display repair, panel bonding, smart setup, security systems and everyday
            electronics support across Delhi, Noida and NCR.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
      <section className="section section-faq">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">SERVICE FLOW</span>
            <h2>How We Handle Repairs</h2>
          </div>
          <div className="grid-2">
            {['Contact GR Solution', 'Share device issue', 'Get diagnosis visit', 'Approve repair estimate'].map((step) => (
              <article className="card" key={step}>
                <h3>{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Not sure which service you need?" text="Send the issue details and our team will guide you to the right repair option." />
    </main>
  );
}
