import Link from 'next/link';
import ContentTable from '@/components/ContentTable';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';
import { TrustBand } from '@/components/TrustStrip';
import PageHero, { HeroActions } from '@/components/page/PageHero';
import SectionHead from '@/components/page/SectionHead';
import LinkTiles from '@/components/page/LinkTiles';
import { siteConfig } from '@/data/siteConfig';
import { diagnosisPolicy } from '@/data/pricing';
import KeyFacts from '@/components/KeyFacts';

// Page-specific content for service, city and brand URLs (data/servicePageRevisions.js).
// The content varies by URL; the page shell and the business entity stay shared.
// Metadata remains owned by the existing route's generateMetadata function.
//
// 19 Nov 2026: moved onto the 2 Nov redesign components (PageHero, TrustBand,
// SectionHead, band/band-tint sections, panel/card surfaces, LinkTiles and the
// design tokens), matching the brand and city templates. Restyle only: heading
// text and order, copy, links and anchor text, image alt text and JSON-LD are
// unchanged (verified with tools/seo-audit). See docs/design-system.md.
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
  // Sections alternate white and tinted bands, as on the other templates.
  // KeyFacts above is tinted, so the first content section is white.
  const band = (index) => (index % 2 ? 'band-tint' : 'band');
  const sectionCount = content.sections.length;

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

      <PageHero
        section="revision_hero"
        breadcrumb={crumbs}
        eyebrow={page.cityName}
        title={page.h1}
        answer={content.answer}
        image={{ src: page.image, alt: `${page.title} by GR Solution` }}
        actions={
          <HeroActions>
            <PhoneLink callLocation={page.brand ? 'city_service_hero_call' : 'service_cta_call'} className="btn btn-primary btn-lg">
              <i className="fa-solid fa-phone" aria-hidden="true" /> Call GR Solution
            </PhoneLink>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              {page.brand ? 'Book Repair' : 'Book Inspection'}
            </Link>
            <WhatsAppLink className="btn btn-whatsapp btn-lg">
              <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
            </WhatsAppLink>
          </HeroActions>
        }
      />

      <TrustBand />

      <KeyFacts subject={page.h1} serviceSlug={page.parentServiceSlug} cityName={page.cityName} brand={page.brand} />

      {content.sections.map((section, index) => (
        <section key={section.heading} className={`section ${band(index)}`} data-section="revision_topic">
          <div className="container">
            <div className="max-w-prose">
              <SectionHead align="left" title={section.heading} className="mb-0" />
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[1.0625rem] leading-relaxed text-body">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className={`section ${band(sectionCount)}`} data-section="revision_table">
        <div className="container">
          <SectionHead align="left" title={content.table.caption} className="mb-0" />
          <ContentTable table={content.table} />
          <div className="panel mt-8 p-5 sm:p-7">
            <h2 className="heading-panel">{content.preparationHeading}</h2>
            <ul className="mt-4 grid gap-3">
              {content.preparation.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-body">
                  <i className="fa-solid fa-check mt-1.5 text-teal-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`section ${band(sectionCount + 1)}`} data-section="revision_cost">
        <div className="container grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <article className="card p-5 sm:p-7">
            <span className="icon-tile icon-tile-teal" aria-hidden="true">
              <i className="fa-solid fa-indian-rupee-sign" />
            </span>
            <h2 className="heading-panel mt-4">{content.costHeading}</h2>
            <p className="mt-3 font-semibold leading-relaxed text-ink">{diagnosisPolicy.note}</p>
            <p className="mt-3 leading-relaxed text-body">{content.cost}</p>
            {/* 48px tap targets (docs/design-system.md). */}
            <div className="mt-4 grid gap-1">
              <Link href={costGuide} className="text-link inline-flex min-h-12 items-center font-semibold">{page.cityName} repair cost guide &rarr;</Link>
              <Link href="/pricing" className="text-link inline-flex min-h-12 items-center font-semibold">GR Solution pricing and sources &rarr;</Link>
            </div>
          </article>
          <aside className="panel p-5 sm:p-7">
            <span className="icon-tile icon-tile-teal bg-white" aria-hidden="true">
              <i className="fa-solid fa-location-dot" />
            </span>
            <h2 className="heading-panel mt-4">{page.cityName} service arrangements</h2>
            <p className="mt-3 leading-relaxed text-body">{content.coverage}</p>
            <div className="mt-4 grid gap-1">
              <PhoneLink callLocation="city_service_contact_phone" className="inline-flex min-h-12 items-center font-semibold text-navy-600 hover:text-navy-800" />
              <a href={siteConfig.emailHref} className="inline-flex min-h-12 items-center break-all font-semibold text-navy-600 hover:text-navy-800">{siteConfig.email}</a>
              <Link href="/contact" className="text-link inline-flex min-h-12 items-center font-semibold">Contact and booking</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className={`section ${band(sectionCount + 2)}`} data-section="faq">
        <div className="container">
          <SectionHead align="left" title={`${page.h1}: your questions`} />
          <div className="max-w-[850px]">
            <FAQ faqs={content.faqs} name="revision-faq" />
          </div>
        </div>
      </section>

      <section className={`section ${band(sectionCount + 3)}`} data-section="revision_links">
        <div className="container">
          <SectionHead align="left" title="Related services and locations" />
          <LinkTiles className="sm:grid-cols-2 lg:grid-cols-3" icon="fa-solid fa-location-dot" links={links} />
        </div>
      </section>
      {guides}
      <PageCTA serviceName={page.brand ? `${page.brand} TV Repair` : page.serviceTitle} title={`Arrange ${page.h1}`} description={content.cta} />
    </main>
  );
}
