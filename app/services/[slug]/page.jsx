import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import FAQ from '@/components/FAQ';
import PageCTA from '@/components/PageCTA';
import JsonLd from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
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

      {/* Breadcrumb */}
      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: service.title, href: null },
          ]} />
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">{service.title.toUpperCase()}</span>
            <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-tight text-secondary">{service.h1}</h1>
            <p className="mt-6 text-lg leading-relaxed text-textMuted">{service.fullDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={siteConfig.phoneHref} className="inline-flex rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary">
                <i className="fa-solid fa-phone" /> Call Now
              </a>
              <Link href="/contact" className="inline-flex rounded-full border-2 border-primary bg-white px-7 py-4 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white">
                Book Service
              </Link>
            </div>
          </div>
          <Image src={service.image} alt={`${service.title} service in Delhi NCR`} width={680} height={500} className="w-full rounded-3xl object-cover shadow-cardPro" priority />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container">
          <div className="mb-20 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">WHAT WE FIX</span>
            <h2 className="text-4xl font-black text-secondary">
              {service.title} <span className="text-primary">Benefits</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((benefit) => (
              <article className="rounded-card border border-black/5 bg-white p-10 text-center shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg" key={benefit}>
                <i className={`${service.icon} mb-5 text-4xl text-primary`} />
                <h3 className="text-xl font-black text-secondary">{benefit}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Repair Process */}
      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-20 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">PROCESS</span>
            <h2 className="text-4xl font-black text-secondary">Simple Repair Process</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">{service.shortDescription}</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {service.process.map((step, index) => (
              <article className="rounded-card border border-primary/10 bg-white p-8 text-center shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg" key={step}>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">STEP {index + 1}</span>
                <div className="mx-auto my-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-2xl text-white">
                  <i className={genericProcess[index]?.icon || 'fa-solid fa-check'} />
                </div>
                <h3 className="text-xl font-black text-secondary">{step}</h3>
                <p className="mt-3 leading-relaxed text-textMuted">{genericProcess[index]?.text || ''}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20">
        <div className="container">
          <div className="mb-20 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">RELATED SERVICES</span>
            <h2 className="text-4xl font-black text-secondary">Explore More Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">Browse other GR Solution repair services available across Delhi, Noida and NCR.</p>
          </div>
          <div className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <article className="flex flex-col overflow-hidden rounded-card border border-black/5 bg-white p-0 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg" key={item.slug}>
                <div className="relative overflow-hidden">
                  <Image src={item.image} alt={`${item.title} by GR Solution`} width={520} height={320} className="h-60 w-full object-cover transition duration-500 hover:scale-105" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent opacity-0 transition duration-300 hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-8">
                  <h3 className="text-lg font-black text-secondary">{item.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-textMuted">
                    {item.shortDescription}
                  </p>
                  <Link href={`/services/${item.slug}`} className="self-start rounded-full bg-primary px-6 py-3 font-black text-white transition hover:-translate-y-1 hover:bg-secondary">
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
        <section className="bg-bgLight py-20">
          <div className="container">
            <div className="mb-20 text-center">
              <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FAQ</span>
              <h2 className="text-4xl font-black text-secondary">{service.title} Questions</h2>
            </div>
            <div className="mx-auto max-w-[800px]">
              <FAQ faqs={service.faqs} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
