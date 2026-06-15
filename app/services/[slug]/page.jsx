import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import JsonLd from '@/components/JsonLd';
import { getServiceBySlug, services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';

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

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
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
      <section className="section service-detail-hero">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">{service.title.toUpperCase()}</span>
            <h1>{service.h1}</h1>
            <p>{service.fullDescription}</p>
            <div className="btn-group">
              <a href={siteConfig.phoneHref} className="btn btn-primary btn-lg">
                <i className="fa-solid fa-phone" /> Call Now
              </a>
              <Link href="/contact" className="btn btn-outline btn-lg">
                Book Service
              </Link>
            </div>
          </div>
          <Image src={service.image} alt={`${service.title} service in Delhi NCR`} width={680} height={500} className="card-img-rounded" priority />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge">WHAT WE FIX</span>
            <h2>
              {service.title} <span className="primary-text">Benefits</span>
            </h2>
          </div>
          <div className="grid-3">
            {service.benefits.map((benefit) => (
              <article className="card" key={benefit}>
                <i className={`${service.icon} card-icon`} />
                <h3>{benefit}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-faq">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">PROCESS</span>
            <h2>Simple Repair Process</h2>
            <p>{service.shortDescription}</p>
          </div>
          <div className="repair-process">
            {service.process.map((step, index) => (
              <article className="card" key={step}>
                <span className="process-number">{index + 1}</span>
                <h3>{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">FAQ</span>
            <h2>{service.title} Questions</h2>
          </div>
          <FAQ faqs={service.faqs} />
        </div>
      </section>
      <section className="section related-services-next">
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge">RELATED SERVICES</span>
            <h2>Explore More Services</h2>
          </div>
          <div className="grid-3">
            {related.map((item) => (
              <article className="card" key={item.slug}>
                <h3>{item.title}</h3>
                <p>{item.shortDescription}</p>
                <Link href={`/services/${item.slug}`} className="btn btn-outline">
                  View Service
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTASection title={`Need ${service.title}?`} />
    </main>
  );
}
