import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import FAQ from '@/components/FAQ';
import PageCTA from '@/components/PageCTA';
import JsonLd from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import { getServiceBySlug, services } from '@/data/services';
import {
  getLocalPagesByCity,
  getLocalPagesByService,
  getLocalServicePageBySlug,
  localServicePages,
} from '@/data/localServicePages';
import {
  brandServicePages,
  getBrandServicePageBySlug,
} from '@/data/brandServicePages';
import { siteConfig } from '@/data/siteConfig';

const genericProcess = [
  { icon: 'fa-solid fa-calendar-check', title: 'Book Service Visit', text: 'Call, WhatsApp or submit the enquiry form with your repair requirement.' },
  { icon: 'fa-solid fa-magnifying-glass', title: 'Technician Diagnosis', text: 'Our technician checks the issue and explains the repair options clearly.' },
  { icon: 'fa-solid fa-file-invoice', title: 'Transparent Estimate', text: 'You receive clear pricing before any repair work begins.' },
  { icon: 'fa-solid fa-wrench', title: 'Repair & Support', text: 'We complete the repair and guide you on care and warranty terms.' },
];

export function generateStaticParams() {
  return [...services, ...localServicePages, ...brandServicePages].map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const localPage = getLocalServicePageBySlug(slug);
  if (localPage) {
    return {
      title: localPage.metaTitle,
      description: localPage.metaDescription,
      alternates: { canonical: `/services/${localPage.slug}` },
      openGraph: {
        title: localPage.metaTitle,
        description: localPage.metaDescription,
        url: `/services/${localPage.slug}`,
        images: [localPage.image],
      },
    };
  }

  const brandPage = getBrandServicePageBySlug(slug);
  if (brandPage) {
    return {
      title: brandPage.metaTitle,
      description: brandPage.metaDescription,
      alternates: { canonical: `/services/${brandPage.slug}` },
      openGraph: {
        title: brandPage.metaTitle,
        description: brandPage.metaDescription,
        url: `/services/${brandPage.slug}`,
        images: [brandPage.image],
      },
    };
  }

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
  const localPage = getLocalServicePageBySlug(slug);
  if (localPage) return <LocalServicePage page={localPage} />;

  const brandPage = getBrandServicePageBySlug(slug);
  if (brandPage) return <BrandServicePage page={brandPage} />;

  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const cityPages = getLocalPagesByService(service.slug);
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
            serviceType: service.serviceType,
            provider: {
              '@type': 'LocalBusiness',
              name: siteConfig.name,
              telephone: siteConfig.phone,
              email: siteConfig.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteConfig.address.streetAddress,
                addressLocality: siteConfig.address.addressLocality,
                addressRegion: siteConfig.address.addressRegion,
                postalCode: siteConfig.address.postalCode,
                addressCountry: siteConfig.address.addressCountry,
              },
            },
            areaServed: siteConfig.serviceAreas,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              description: 'Inspection-based estimate after diagnosis',
            },
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

      {/* Service Areas */}
      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">AVAILABLE IN</span>
            <h2 className="text-4xl font-black text-secondary">{service.title} Service Areas</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">
              Explore city-specific guidance for {service.title.toLowerCase()} across Delhi NCR.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cityPages.map((page) => (
              <Link
                key={page.slug}
                href={`/services/${page.slug}`}
                className="rounded-2xl border border-primary/10 bg-white p-5 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                {page.keyword}
              </Link>
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

function LocalServicePage({ page }) {
  const service = getServiceBySlug(page.parentServiceSlug);
  const parentServiceTitle = service?.title || 'TV Repair Services';
  const parentServiceHref = service ? `/services/${service.slug}` : '/services';
  const schemaServiceType = page.schemaServiceType || service?.serviceType || 'TV repair service';
  const sameCityPages = getLocalPagesByCity(page.citySlug).filter((item) => item.slug !== page.slug);
  const relatedSameCityPages = sameCityPages.length
    ? sameCityPages.map((item) => ({ label: item.keyword, href: `/services/${item.slug}` }))
    : page.relatedServiceLinks || [];
  const pageUrl = `${siteConfig.url}/services/${page.slug}`;

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: siteConfig.name,
            url: siteConfig.url,
            telephone: siteConfig.phone,
            email: siteConfig.email,
            priceRange: 'Inspection-based estimate',
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteConfig.address.streetAddress,
              addressLocality: siteConfig.address.addressLocality,
              addressRegion: siteConfig.address.addressRegion,
              postalCode: siteConfig.address.postalCode,
              addressCountry: siteConfig.address.addressCountry,
            },
            areaServed: [page.cityName, ...siteConfig.serviceAreas],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: page.title,
            serviceType: schemaServiceType,
            description: page.metaDescription,
            url: pageUrl,
            areaServed: page.cityName,
            provider: {
              '@type': 'LocalBusiness',
              name: siteConfig.name,
              telephone: siteConfig.phone,
              email: siteConfig.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteConfig.address.streetAddress,
                addressLocality: siteConfig.address.addressLocality,
                addressRegion: siteConfig.address.addressRegion,
                postalCode: siteConfig.address.postalCode,
                addressCountry: siteConfig.address.addressCountry,
              },
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              description: 'Inspection-based estimate after diagnosis',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: service
              ? [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
                  { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteConfig.url}/services` },
                  { '@type': 'ListItem', position: 3, name: service.title, item: `${siteConfig.url}/services/${service.slug}` },
                  { '@type': 'ListItem', position: 4, name: page.title, item: pageUrl },
                ]
              : [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
                  { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteConfig.url}/services` },
                  { '@type': 'ListItem', position: 3, name: page.title, item: pageUrl },
                ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: page.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />

      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: parentServiceTitle, href: parentServiceHref },
              { label: page.cityName, href: null },
            ]}
          />
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
              {page.keyword.toUpperCase()}
            </span>
            <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.6rem)] font-black leading-tight text-secondary">{page.h1}</h1>
            <p className="mt-6 rounded-2xl border border-primary/10 bg-white p-5 text-lg font-bold leading-relaxed text-secondary shadow-oldMd">
              {page.directAnswer}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={siteConfig.phoneHref} className="inline-flex rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary">
                <i className="fa-solid fa-phone" /> Call GR Solution
              </a>
              <Link href="/contact" className="inline-flex rounded-full border-2 border-primary bg-white px-7 py-4 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white">
                Book Inspection
              </Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-black text-primary sm:grid-cols-3">
              <span className="rounded-full bg-white px-4 py-3 shadow-oldMd">Doorstep inspection</span>
              <span className="rounded-full bg-white px-4 py-3 shadow-oldMd">Transparent estimate</span>
              <span className="rounded-full bg-white px-4 py-3 shadow-oldMd">Delhi NCR support</span>
            </div>
          </div>
          <Image src={page.image} alt={`${page.keyword} by GR Solution`} width={680} height={500} className="h-[min(520px,52vw)] min-h-[340px] w-full rounded-3xl object-cover shadow-cardPro" priority />
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-card border border-black/5 bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">Useful {page.keyword} Guidance</h2>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">{page.intro}</p>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">{page.cityExplanation}</p>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">{page.localTrust}</p>
          </article>
          <aside className="rounded-card border border-primary/10 bg-bgLight p-8">
            <h3 className="text-2xl font-black text-secondary">GR Solution Contact</h3>
            <p className="mt-4 leading-relaxed text-textMuted">
              Phone: <a href={siteConfig.phoneHref} className="font-black text-primary">{siteConfig.phone}</a>
              <br />
              Email: <a href={siteConfig.emailHref} className="font-black text-primary">{siteConfig.email}</a>
              <br />
              Address: {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}
            </p>
            <div className="mt-6 grid gap-3">
              <Link href="/" className="font-black text-primary hover:text-secondary">Visit GR Solution homepage</Link>
              <Link href={parentServiceHref} className="font-black text-primary hover:text-secondary">Explore main {parentServiceTitle}</Link>
              <Link href="/contact" className="font-black text-primary hover:text-secondary">Open contact and booking page</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">LOCAL REPAIR GUIDE</span>
            <h2 className="text-4xl font-black text-secondary">Detailed {page.keyword} Guidance</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-textMuted">
              Practical answers for diagnosis, local scheduling, safe handling, repair feasibility and after-repair checks.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {page.contentBlocks.map((block) => (
              <article key={block.title} className="rounded-card border border-primary/10 bg-white p-7 shadow-oldMd">
                <h3 className="text-xl font-black leading-tight text-secondary">{block.title}</h3>
                <p className="mt-4 leading-relaxed text-textMuted">{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bgLight py-20">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div className="rounded-card bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">Common Problems We Solve</h2>
            <ul className="mt-6 grid gap-4">
              {page.commonProblems.map((problem) => (
                <li key={problem} className="flex gap-3 leading-relaxed text-textMuted">
                  <i className="fa-solid fa-circle-check mt-1 text-success" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">What To Check Before Calling</h2>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">{page.beforeCalling}</p>
            <h3 className="mt-8 text-2xl font-black text-secondary">Repair vs Replace</h3>
            <p className="mt-4 text-lg leading-relaxed text-textMuted">{page.repairReplace}</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <article className="rounded-card border border-black/5 bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">Why Choose GR Solution In {page.cityName}</h2>
            <ul className="mt-6 grid gap-4">
              {page.whyChoose.map((point) => (
                <li key={point} className="flex gap-3 leading-relaxed text-textMuted">
                  <i className="fa-solid fa-shield-halved mt-1 text-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-card border border-primary/10 bg-bgLight p-8">
            <h2 className="text-3xl font-black text-secondary">Quality Checks</h2>
            <p className="mt-4 leading-relaxed text-textMuted">
              The final check depends on the TV type and approved repair, but these checkpoints help confirm that the fault is stable after service.
            </p>
            <ul className="mt-6 grid gap-3">
              {page.qualityChecks.map((check) => (
                <li key={check} className="rounded-2xl bg-white px-4 py-3 font-bold text-secondary shadow-oldMd">
                  <i className="fa-solid fa-check mr-2 text-success" />
                  {check}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">SERVICE PROCESS</span>
            <h2 className="text-4xl font-black text-secondary">How {page.keyword} Works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {page.process.map((step, index) => (
              <article key={step} className="rounded-card border border-primary/10 bg-white p-6 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">STEP {index + 1}</span>
                <p className="mt-4 font-bold leading-relaxed text-secondary">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bgLight py-20">
        <div className="container grid gap-8 lg:grid-cols-3">
          <article className="rounded-card bg-white p-8 shadow-oldMd">
            <h2 className="text-2xl font-black text-secondary">Local Coverage</h2>
            <p className="mt-4 leading-relaxed text-textMuted">{page.coverage}</p>
          </article>
          <article className="rounded-card bg-white p-8 shadow-oldMd">
            <h2 className="text-2xl font-black text-secondary">Cost Guidance</h2>
            <p className="mt-4 leading-relaxed text-textMuted">{page.pricing}</p>
          </article>
          <article className="rounded-card bg-white p-8 shadow-oldMd">
            <h2 className="text-2xl font-black text-secondary">Quick Support</h2>
            <p className="mt-4 leading-relaxed text-textMuted">{page.emergency}</p>
          </article>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-secondary">Same Service In Other Cities</h2>
            <div className="mt-6 grid gap-3">
              {page.sameServiceOtherCities.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-secondary">Related TV Repair Services In {page.cityName}</h2>
            <div className="mt-6 grid gap-3">
              {relatedSameCityPages.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(page.tvTypesCovered?.length > 0 || page.brandCityLinks?.length > 0) && (
        <section className="bg-bgLight py-20">
          <div className="container grid gap-8 lg:grid-cols-2">
            {page.tvTypesCovered?.length > 0 && (
              <article className="rounded-card bg-white p-8 shadow-oldMd">
                <h2 className="text-3xl font-black text-secondary">{page.isNearMePage ? 'TV Types We Support' : 'TV Types Covered'}</h2>
                <ul className="mt-6 grid gap-3">
                  {page.tvTypesCovered.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-textMuted">
                      <i className="fa-solid fa-circle-check mt-1 text-success" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )}
            {page.brandCityLinks?.length > 0 && (
              <article className="rounded-card bg-white p-8 shadow-oldMd">
                <h2 className="text-3xl font-black text-secondary">{page.isNearMePage ? 'TV Brands We Commonly Repair' : 'Brand Repair Links'}</h2>
                <div className="mt-6 grid gap-3">
                  {page.brandCityLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-2xl border border-primary/10 bg-bgLight p-4 font-black text-secondary transition hover:-translate-y-1 hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </article>
            )}
          </div>
        </section>
      )}

      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FAQ</span>
            <h2 className="text-4xl font-black text-secondary">{page.keyword} FAQs</h2>
          </div>
          <div className="mx-auto max-w-[850px]">
            <FAQ faqs={page.faqs} />
          </div>
        </div>
      </section>

      <PageCTA
        serviceName={page.serviceTitle}
        title={`Need ${page.keyword}?`}
        description={`Call GR Solution for doorstep diagnosis, transparent repair guidance and TV service support across ${page.cityName}.`}
      />
    </main>
  );
}

function BrandServicePage({ page }) {
  const pageUrl = `${siteConfig.url}/services/${page.slug}`;

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: siteConfig.name,
            url: siteConfig.url,
            telephone: siteConfig.phone,
            email: siteConfig.email,
            priceRange: 'Inspection-based estimate',
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteConfig.address.streetAddress,
              addressLocality: siteConfig.address.addressLocality,
              addressRegion: siteConfig.address.addressRegion,
              postalCode: siteConfig.address.postalCode,
              addressCountry: siteConfig.address.addressCountry,
            },
            areaServed: [page.cityName, ...siteConfig.serviceAreas],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: page.title,
            serviceType: `${page.brand} TV Repair in ${page.cityName}`,
            description: page.metaDescription,
            url: pageUrl,
            areaServed: page.cityName,
            provider: {
              '@type': 'LocalBusiness',
              name: siteConfig.name,
              telephone: siteConfig.phone,
              email: siteConfig.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteConfig.address.streetAddress,
                addressLocality: siteConfig.address.addressLocality,
                addressRegion: siteConfig.address.addressRegion,
                postalCode: siteConfig.address.postalCode,
                addressCountry: siteConfig.address.addressCountry,
              },
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              description: 'Inspection-based estimate after diagnosis',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteConfig.url}/services` },
              { '@type': 'ListItem', position: 3, name: page.title, item: pageUrl },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: page.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />

      {/* Breadcrumb */}
      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: `${page.brand} TV Repair in ${page.cityName}`, href: null },
            ]}
          />
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
              {page.brand.toUpperCase()} TV REPAIR
            </span>
            <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.6rem)] font-black leading-tight text-secondary">{page.h1}</h1>
            <p className="mt-6 leading-relaxed text-textMuted">{page.heroIntro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary">
                <i className="fa-solid fa-phone" /> Call Now
              </a>
              <Link href="/contact" className="inline-flex rounded-full border-2 border-primary bg-white px-7 py-4 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white">
                Book Repair
              </Link>
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1">
                <i className="fa-brands fa-whatsapp" /> WhatsApp
              </a>
            </div>
          </div>
          <Image
            src={page.image}
            alt={`${page.brand} TV repair service by GR Solution in ${page.cityName}`}
            width={680}
            height={500}
            className="h-[min(520px,52vw)] min-h-[340px] w-full rounded-3xl object-cover shadow-cardPro"
            priority
          />
        </div>
      </section>

      {/* Quick answer box */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/10 bg-bgLight p-7 text-lg font-bold leading-relaxed text-secondary shadow-oldMd">
            {page.directAnswer}
          </div>
        </div>
      </section>

      {/* Intro + city explanation */}
      <section className="py-4">
        <div className="container grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-card border border-black/5 bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">
              Is It Worth Repairing A {page.brand} TV In {page.cityName}?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">{page.intro}</p>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">{page.cityExplanation}</p>
          </article>
          <aside className="rounded-card border border-primary/10 bg-bgLight p-8">
            <h3 className="text-2xl font-black text-secondary">GR Solution Contact</h3>
            <p className="mt-4 leading-relaxed text-textMuted">
              Phone: <a href={siteConfig.phoneHref} className="font-black text-primary">{siteConfig.phone}</a>
              <br />
              Email: <a href={siteConfig.emailHref} className="font-black text-primary">{siteConfig.email}</a>
              <br />
              Address: {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}
            </p>
            <div className="mt-6 grid gap-3">
              <Link href="/" className="font-black text-primary hover:text-secondary">Visit GR Solution homepage</Link>
              <Link href="/services" className="font-black text-primary hover:text-secondary">Explore all TV repair services</Link>
              <Link href="/contact" className="font-black text-primary hover:text-secondary">Open contact and booking page</Link>
              {page.priorityInternalLinks?.slice(0, 2).map((link) => (
                <Link key={link.href} href={link.href} className="font-black text-primary hover:text-secondary">
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Common problems */}
      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">COMMON PROBLEMS</span>
            <h2 className="text-4xl font-black text-secondary">
              What Problems Can Be Fixed In A {page.brand} TV?
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {page.commonIssues.map((issue) => (
              <article key={issue} className="rounded-card border border-primary/10 bg-white p-6 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg">
                <i className="fa-solid fa-circle-exclamation mb-3 text-2xl text-primary" />
                <p className="font-bold leading-relaxed text-secondary">{issue}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Brand-specific repair guidance */}
      <section className="py-20">
        <div className="container grid gap-8 lg:grid-cols-2">
          <article className="rounded-card border border-black/5 bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">
              How Does GR Solution Inspect A {page.brand} TV?
            </h2>
            <p className="mt-5 leading-relaxed text-textMuted">{page.repairGuidance}</p>
          </article>
          <article className="rounded-card border border-primary/10 bg-bgLight p-8">
            <h2 className="text-3xl font-black text-secondary">Repair vs Replace</h2>
            <p className="mt-5 leading-relaxed text-textMuted">{page.repairVsReplace}</p>
          </article>
        </div>
      </section>

      {/* Repair process */}
      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">PROCESS</span>
            <h2 className="text-4xl font-black text-secondary">{page.brand} TV Repair Process</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {page.repairProcess.map((step, index) => (
              <article key={step} className="rounded-card border border-primary/10 bg-white p-6 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">STEP {index + 1}</span>
                <p className="mt-4 font-bold leading-relaxed text-secondary">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose + before calling checklist */}
      <section className="py-20">
        <div className="container grid gap-8 lg:grid-cols-2">
          <article className="rounded-card border border-black/5 bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">Why Choose GR Solution In {page.cityName}</h2>
            <ul className="mt-6 grid gap-4">
              {page.whyChoose.map((point) => (
                <li key={point} className="flex gap-3 leading-relaxed text-textMuted">
                  <i className="fa-solid fa-shield-halved mt-1 text-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-card border border-primary/10 bg-bgLight p-8">
            <h2 className="text-3xl font-black text-secondary">What To Check Before Calling</h2>
            <ul className="mt-6 grid gap-3">
              {page.beforeCallingChecklist.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-textMuted">
                  <i className="fa-solid fa-circle-check mt-1 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* City coverage + pricing */}
      <section className="bg-bgLight py-20">
        <div className="container grid gap-8 lg:grid-cols-2">
          <article className="rounded-card bg-white p-8 shadow-oldMd">
            <h2 className="text-2xl font-black text-secondary">Service Coverage In {page.cityName}</h2>
            <p className="mt-4 leading-relaxed text-textMuted">{page.cityCoverage}</p>
          </article>
          <article className="rounded-card bg-white p-8 shadow-oldMd">
            <h2 className="text-2xl font-black text-secondary">Pricing Guidance</h2>
            <p className="mt-4 leading-relaxed text-textMuted">{page.pricingNote}</p>
          </article>
        </div>
      </section>

      {/* Related links */}
      <section className="py-20">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-secondary">{page.brand} TV Repair In Other Cities</h2>
            <div className="mt-6 grid gap-3">
              {page.relatedBrandCityLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-secondary">Other TV Brands In {page.cityName}</h2>
            <div className="mt-6 grid gap-3">
              {page.relatedCityServiceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              <Link href="/services" className="rounded-2xl border border-primary/10 bg-bgLight p-4 font-black text-primary shadow-oldMd transition hover:-translate-y-1">
                View All TV Repair Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FAQ</span>
            <h2 className="text-4xl font-black text-secondary">{page.brand} TV Repair FAQs</h2>
          </div>
          <div className="mx-auto max-w-[850px]">
            <FAQ faqs={page.faqs} />
          </div>
        </div>
      </section>

      <PageCTA
        serviceName={`${page.brand} TV Repair`}
        title={`Need ${page.brand} TV Repair in ${page.cityName}?`}
        description={`Call GR Solution for doorstep diagnosis, transparent repair guidance and ${page.brand} TV service support across ${page.cityName}.`}
      />
    </main>
  );
}
