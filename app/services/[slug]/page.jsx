import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import FAQ from '@/components/FAQ';
import PageCTA from '@/components/PageCTA';
import JsonLd from '@/components/JsonLd';
import { getServiceBySlug, services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';

const genericProcess = [
  { icon: 'fa-solid fa-calendar-check', title: 'Book Service Visit', text: 'Call, WhatsApp or submit the enquiry form with your repair requirement.' },
  { icon: 'fa-solid fa-magnifying-glass', title: 'Technician Diagnosis', text: 'Our technician checks the issue and explains the repair options clearly.' },
  { icon: 'fa-solid fa-file-invoice', title: 'Transparent Estimate', text: 'You receive clear pricing before any repair work begins.' },
  { icon: 'fa-solid fa-wrench', title: 'Repair & Support', text: 'We complete the repair and guide you on care and warranty terms.' },
];

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/services/${service.slug}`,
      images: [service.image],
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const tvServices = services.filter((s) => !['laptop-repair', 'mobile-repair'].includes(s.slug));
  const related = tvServices.filter((item) => item.slug !== service.slug).slice(0, 3);
  const serviceUrl = `${siteConfig.url}/services/${service.slug}`;

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.metaDescription,
            provider: { '@type': 'LocalBusiness', name: siteConfig.name, telephone: siteConfig.phone },
            areaServed: siteConfig.serviceAreas,
            url: serviceUrl,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteConfig.url}/services` },
              { '@type': 'ListItem', position: 3, name: service.title, item: serviceUrl },
            ],
          },
          service.faqs?.length
            ? {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: service.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
              }
            : null,
        ].filter(Boolean)}
      />

      {/* Hero */}
      <section className="section service-detail-hero">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">{service.title.toUpperCase()}</span>
            <h1>{service.h1}</h1>
            <p>{service.fullDescription}</p>
            <div className="btn-group">
              <a href={siteConfig.phoneHref} className="btn btn-primary">
                <i className="fa-solid fa-phone" /> Call Now
              </a>
              <Link href="/contact" className="btn btn-outline">
                Book Service
              </Link>
            </div>
          </div>
          <Image src={service.image} alt={`${service.title} service in Delhi NCR`} width={680} height={500} className="card-img-rounded" priority />
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge mb-3">WHAT WE FIX</span>
            <h2>
              {service.title} <span className="primary-text">Benefits</span>
            </h2>
          </div>
          <div className="grid-3">
            {service.benefits.map((benefit) => (
              <article className="card" key={benefit} style={{ textAlign: 'center' }}>
                <i className={`${service.icon} card-icon`} />
                <h3>{benefit}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Repair Process */}
      <section style={{ padding: '80px 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge mb-3">PROCESS</span>
            <h2>Simple Repair Process</h2>
            <p>{service.shortDescription}</p>
          </div>
          <div className="grid-4" style={{ marginTop: '2rem' }}>
            {service.process.map((step, index) => (
              <article className="card process-card" key={step}>
                <span className="process-step-badge">STEP {index + 1}</span>
                <div className="process-icon-box">
                  <i className={genericProcess[index]?.icon || 'fa-solid fa-check'} />
                </div>
                <h3>{step}</h3>
                <p>{genericProcess[index]?.text || ''}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge mb-3">RELATED SERVICES</span>
            <h2>Explore More Services</h2>
            <p>Browse other GR Solution repair services available across Delhi, Noida and NCR.</p>
          </div>
          <div className="grid-3" style={{ marginTop: '1rem' }}>
            {related.map((item) => (
              <article className="card service-card-detailed" key={item.slug}>
                <div className="service-card-img-wrap">
                  <Image src={item.image} alt={`${item.title} by GR Solution`} width={520} height={320} />
                  <div className="service-card-img-overlay" />
                </div>
                <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
                    {item.shortDescription}
                  </p>
                  <Link href={`/services/${item.slug}`} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    View Service
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <PageCTA serviceName={service.title} />

      {/* FAQ — near the end */}
      {service.faqs?.length > 0 && (
        <section style={{ padding: '80px 0', background: 'var(--bg-light)' }}>
          <div className="container">
            <div className="section-title section-centered-title">
              <span className="badge mb-3">FAQ</span>
              <h2>{service.title} Questions</h2>
            </div>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <FAQ faqs={service.faqs} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
