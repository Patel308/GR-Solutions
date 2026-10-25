import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ContentTable from '@/components/ContentTable';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';
import { siteConfig } from '@/data/siteConfig';
import { diagnosisPolicy } from '@/data/pricing';

// The content varies by URL; the page shell and the business entity stay shared.
// Metadata remains owned by the existing route's generateMetadata function.
export default function ServicePageRevision({ page, content, service, relatedLinks, guides }) {
  const pageUrl = `${siteConfig.url}/services/${page.slug}`;
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    ...(service ? [{ label: service.title, href: `/services/${service.slug}` }] : []),
    { label: page.brand ? page.title : page.cityName, href: null },
  ];
  const schemaCrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    ...(service ? [{ name: service.title, url: `${siteConfig.url}/services/${service.slug}` }] : []),
    { name: page.title, url: pageUrl },
  ];
  const links = [...new Map(relatedLinks.map((link) => [link.href, link])).values()];
  const costGuide = page.costGuideHref || `/blog/tv-repair-cost-${page.citySlug}`;

  return (
    <main>
      <JsonLd data={[
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: page.title,
          serviceType: page.brand
            ? `${page.brand} TV Repair in ${page.cityName}`
            : page.schemaServiceType || service?.serviceType || 'TV repair service',
          description: page.metaDescription,
          url: pageUrl,
          areaServed: page.cityName,
          provider: {
            '@type': 'LocalBusiness',
            name: siteConfig.name,
            telephone: siteConfig.phone,
            email: siteConfig.email,
            address: { '@type': 'PostalAddress', ...siteConfig.address },
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
          itemListElement: schemaCrumbs.map((crumb, index) => ({
            '@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.url,
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: content.faqs.map((faq) => ({
            '@type': 'Question', name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        },
      ]} />

      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container"><Breadcrumb items={crumbs} /></div>
      </section>

      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-24">
        <div className="container grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black uppercase tracking-wide text-primary">
              {page.cityName}
            </span>
            <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.6rem)] font-black leading-tight text-secondary">{page.h1}</h1>
            <p className="mt-6 rounded-2xl border border-primary/10 bg-white p-6 text-lg font-bold leading-relaxed text-secondary shadow-oldMd">
              {content.answer}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PhoneLink callLocation={page.brand ? 'city_service_hero_call' : 'service_cta_call'} className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta">
                <i className="fa-solid fa-phone" /> Call GR Solution
              </PhoneLink>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-white px-7 py-4 font-black text-primary">
                {page.brand ? 'Book Repair' : 'Book Inspection'}
              </Link>
              <WhatsAppLink className="inline-flex items-center gap-3 rounded-full bg-[#25d366] px-7 py-4 font-black text-white">
                <i className="fa-brands fa-whatsapp" /> WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <Image src={page.image} alt={`${page.title} by GR Solution`} width={680} height={500} className="h-[min(520px,52vw)] min-h-[340px] w-full rounded-3xl object-cover shadow-cardPro" priority />
        </div>
      </section>

      {content.sections.map((section, index) => (
        <section key={section.heading} className={index % 2 ? 'bg-bgLight py-16' : 'py-16'}>
          <div className="container max-w-5xl">
            <h2 className="text-3xl font-black leading-tight text-secondary md:text-4xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-lg leading-relaxed text-textMuted">{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-black text-secondary">{content.table.caption}</h2>
          <ContentTable table={content.table} />
          <div className="mt-12 rounded-card border border-primary/10 bg-bgLight p-7 md:p-9">
            <h2 className="text-2xl font-black text-secondary">{content.preparationHeading}</h2>
            <ul className="mt-5 list-disc space-y-3 pl-6 text-lg leading-relaxed text-textMuted">
              {content.preparation.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-bgLight py-16">
        <div className="container grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-card border border-black/5 bg-white p-8 shadow-oldMd">
            <h2 className="text-3xl font-black text-secondary">{content.costHeading}</h2>
            <p className="mt-5 font-bold leading-relaxed text-secondary">{diagnosisPolicy.note}</p>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">{content.cost}</p>
            <Link href={costGuide} className="mt-5 inline-flex font-black text-primary">{page.cityName} repair cost guide &rarr;</Link>
            <div className="mt-4"><Link href="/pricing" className="font-black text-primary">GR Solution pricing and sources &rarr;</Link></div>
          </article>
          <aside className="rounded-card border border-primary/10 bg-white p-8">
            <h2 className="text-2xl font-black text-secondary">{page.cityName} service arrangements</h2>
            <p className="mt-5 leading-relaxed text-textMuted">{content.coverage}</p>
            <div className="mt-6 grid gap-3">
              <PhoneLink callLocation="city_service_contact_phone" className="font-black text-primary" />
              <a href={siteConfig.emailHref} className="break-all font-black text-primary">{siteConfig.email}</a>
              <Link href="/contact" className="font-black text-primary">Contact and booking</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="mb-8 text-3xl font-black text-secondary">{page.h1}: your questions</h2>
          <FAQ faqs={content.faqs} />
        </div>
      </section>

      <section className="bg-bgLight py-16">
        <div className="container">
          <h2 className="text-3xl font-black text-secondary">Related services and locations</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl border border-primary/10 bg-white p-4 font-bold text-primary shadow-oldMd">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
      {guides}
      <PageCTA serviceName={page.brand ? `${page.brand} TV Repair` : page.serviceTitle} title={`Arrange ${page.h1}`} description={content.cta} />
    </main>
  );
}
