import { notFound } from 'next/navigation';
import Link from 'next/link';
import FAQ from '@/components/FAQ';
import PageCTA from '@/components/PageCTA';
import JsonLd from '@/components/JsonLd';
import ServiceCard from '@/components/ServiceCard';
import SectionCTA from '@/components/SectionCTA';
import { TrustBand } from '@/components/TrustStrip';
import PageHero, { HeroActions } from '@/components/page/PageHero';
import SectionHead from '@/components/page/SectionHead';
import LinkTiles from '@/components/page/LinkTiles';
import ProcessSteps from '@/components/page/ProcessSteps';
import { lowerServiceTitle } from '@/components/ui/text';
import { getServiceBySlug, services } from '@/data/services';
import {
  getLocalPagesByCity,
  getLocalPagesByService,
  getLocalServicePageBySlug,
  localServicePages,
  getServiceIntentTopics,
  getServiceLocalProfile,
} from '@/data/localServicePages';
import {
  brandServicePages,
  getBrandServicePageBySlug,
} from '@/data/brandServicePages';
import { siteConfig, contactChannels } from '@/data/siteConfig';
import { getArticlesLinkingTo } from '@/data/blogArticles';
import ContentTable from '@/components/ContentTable';
import LocalityPage from '@/components/LocalityPage';
import { getLocalityPageBySlug, getLocalityPagesByCity, localityPages } from '@/data/localityPages';
import { PhoneLink, PhoneNumber, WhatsAppLink } from '@/components/ContactChannel';

// Page copy is written with the SEO number; swap it for the visitor's channel
// number so ad visitors browsing these pages never see the SEO line.
function withChannelPhone(text) {
  const [before, ...rest] = text.split(contactChannels.seo.phone);
  if (!rest.length) return text;
  return (
    <>
      {before}
      <PhoneNumber />
      {rest.join(contactChannels.seo.phone)}
    </>
  );
}

// Surfaces the in-depth guides that already point at this page, so link equity
// flows in both directions instead of only blog -> services.
function RelatedGuides({ path, cityName, tone = 'band-tint' }) {
  const articles = getArticlesLinkingTo(path);
  if (!articles.length) return null;

  return (
    <section className={`section ${tone}`} data-section="related_guides">
      <div className="container">
        <SectionHead
          align="left"
          eyebrow="IN-DEPTH GUIDES"
          title={`Read Before You Book${cityName ? ` in ${cityName}` : ''}`}
          lead="Detailed cost and diagnosis guides covering what actually drives the price and which faults are worth repairing."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="card card-interactive group flex flex-col p-5 sm:p-6"
            >
              <span className="badge self-start uppercase tracking-[0.06em]">{article.category}</span>
              <h3 className="mt-3 text-lg leading-snug transition-colors group-hover:text-navy-700">{article.title}</h3>
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted">{article.metaDescription}</p>
              <span className="mt-4 font-semibold text-navy-600">Read the guide &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// "GR Solution Contact" card beside the opening guidance on city and brand pages.
function ContactAside({ callLocation, links }) {
  return (
    <aside className="card self-start p-5 sm:p-6 lg:sticky lg:top-28">
      <h3 className="text-lg">GR Solution Contact</h3>
      <ul className="mt-4 grid gap-3 text-[0.9375rem] leading-relaxed text-muted">
        <li className="flex gap-3">
          <i className="fa-solid fa-phone mt-1 w-4 shrink-0 text-center text-teal-600" aria-hidden="true" />
          <span>
            Phone: <PhoneLink callLocation={callLocation} className="font-semibold text-navy-600 hover:text-navy-800" />
          </span>
        </li>
        <li className="flex gap-3">
          <i className="fa-solid fa-envelope mt-1 w-4 shrink-0 text-center text-teal-600" aria-hidden="true" />
          <span>
            Email: <a href={siteConfig.emailHref} className="break-all font-semibold text-navy-600 hover:text-navy-800">{siteConfig.email}</a>
          </span>
        </li>
        <li className="flex gap-3">
          <i className="fa-solid fa-location-dot mt-1 w-4 shrink-0 text-center text-teal-600" aria-hidden="true" />
          <span>
            Address: {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}
          </span>
        </li>
      </ul>
      <div className="mt-4 grid border-t border-line pt-2">
        {links.map((link, index) => (
          <Link key={`${link.href}-${index}`} href={link.href} className="link-arrow min-h-[2.75rem] text-[0.9375rem]">
            {link.label} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </aside>
  );
}

// A heading and text card used for the paired panels on city and brand pages.
function Panel({ children, tone = 'card', className = '' }) {
  return <article className={`${tone} p-5 sm:p-7 ${className}`}>{children}</article>;
}

const genericProcess = [
  { icon: 'fa-solid fa-calendar-check', title: 'Book Service Visit', text: 'Call, WhatsApp or submit the enquiry form with your repair requirement.' },
  { icon: 'fa-solid fa-magnifying-glass', title: 'Technician Diagnosis', text: 'Our technician checks the issue and explains the repair options clearly.' },
  { icon: 'fa-solid fa-file-invoice', title: 'Transparent Estimate', text: 'You receive clear pricing before any repair work begins.' },
  { icon: 'fa-solid fa-wrench', title: 'Repair & Support', text: 'We complete the repair and guide you on care and warranty terms.' },
];

export function generateStaticParams() {
  return [...services, ...localServicePages, ...localityPages, ...brandServicePages].map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const localityPage = getLocalityPageBySlug(slug);
  if (localityPage) {
    return {
      title: localityPage.metaTitle,
      description: localityPage.metaDescription,
      alternates: { canonical: `/services/${localityPage.slug}` },
      openGraph: {
        title: localityPage.metaTitle,
        description: localityPage.metaDescription,
        url: `/services/${localityPage.slug}`,
        images: [localityPage.image],
      },
    };
  }

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
  const localityPage = getLocalityPageBySlug(slug);
  if (localityPage) return <LocalityPage page={localityPage} />;

  const localPage = getLocalServicePageBySlug(slug);
  if (localPage) return <LocalServicePage page={localPage} />;

  const brandPage = getBrandServicePageBySlug(slug);
  if (brandPage) return <BrandServicePage page={brandPage} />;

  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const cityPages = getLocalPagesByService(service.slug);
  const serviceUrl = `${siteConfig.url}/services/${service.slug}`;
  const serviceName = lowerServiceTitle(service.title);

  return (
    <main data-wa-context={`${serviceName} in Delhi NCR`}>
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

      <PageHero
        section="service_hero"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.title, href: null },
        ]}
        eyebrow={service.title.toUpperCase()}
        title={service.h1}
        // Extractable direct answer, matching the pattern already used on the
        // local and brand pages. Answer engines lift this block.
        answer={service.directAnswer}
        image={{ src: service.image, alt: `${service.title} service in Delhi NCR` }}
        actions={
          <HeroActions>
            <PhoneLink callLocation="service_hero_call" className="btn btn-primary btn-lg" data-cta="service_hero_call">
              <i className="fa-solid fa-phone" aria-hidden="true" /> Call Now
            </PhoneLink>
            <Link href="/contact" className="btn btn-secondary btn-lg" data-cta="service_hero_book">
              Book Service
            </Link>
          </HeroActions>
        }
      >
        <p className="mt-6 max-w-[62ch] leading-relaxed text-muted">{service.fullDescription}</p>
      </PageHero>

      <TrustBand />

      {/* Benefits */}
      <section className="section band" data-section="service_benefits">
        <div className="container">
          <SectionHead
            eyebrow="WHAT WE FIX"
            title={
              <>
                {service.title} <span className="heading-accent">Benefits</span>
              </>
            }
          />
          <ul className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-3 sm:gap-5">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="card flex items-center gap-4 p-4 sm:flex-col sm:items-start sm:p-6">
                <span className="icon-tile size-12 text-lg" aria-hidden="true">
                  <i className={service.icon} />
                </span>
                <h3 className="text-[1.0625rem] sm:text-lg">{benefit}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section band-tint" data-section="service_areas">
        <div className="container">
          <SectionHead
            eyebrow="AVAILABLE IN"
            title={`${service.title} Service Areas`}
            lead={`Explore city-specific guidance for ${serviceName} across Delhi NCR.`}
          />
          <LinkTiles
            icon="fa-solid fa-location-dot"
            className="mx-auto max-w-5xl sm:grid-cols-2 xl:grid-cols-4"
            links={cityPages.map((page) => ({ href: `/services/${page.slug}`, label: page.keyword }))}
          />
        </div>
      </section>

      {/* Repair Process */}
      <section className="section band" data-section="service_process">
        <div className="container">
          <SectionHead eyebrow="PROCESS" title="Simple Repair Process" lead={service.shortDescription} />
          <ProcessSteps
            steps={service.process.map((step, index) => ({
              title: step,
              text: genericProcess[index]?.text || '',
              icon: genericProcess[index]?.icon,
            }))}
          />
        </div>
      </section>

      <SectionCTA section="service_mid_cta" className="pt-0 sm:pt-0" />

      {/* Related Services */}
      <section className="section band-tint" data-section="related_services">
        <div className="container">
          <SectionHead
            eyebrow="RELATED SERVICES"
            title="Explore More Services"
            lead="Browse other GR Solution repair services available across Delhi, Noida and NCR."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {related.map((item) => (
              <ServiceCard key={item.slug} service={item} alt={`${item.title} by GR Solution`} />
            ))}
          </div>
        </div>
      </section>

      <ServiceFaultsSection serviceSlug={service.slug} serviceTitle={service.title} cityPages={cityPages} />

      <RelatedGuides path={`/services/${service.slug}`} />

      {/* CTA */}
      <PageCTA serviceName={service.title} />

      {/* FAQ — near the end */}
      {service.faqs?.length > 0 && (
        <section className="section band-tint" data-section="faq">
          <div className="container">
            <SectionHead eyebrow="FAQ" title={`${service.title} Questions`} />
            <div className="mx-auto max-w-3xl">
              <FAQ faqs={service.faqs} name="service-faq" />
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
  const waContext = `${service ? lowerServiceTitle(service.title) : 'TV repair'} in ${page.cityName}`;

  return (
    <main data-wa-context={waContext}>
      <JsonLd
        data={[
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

      <PageHero
        section="city_hero"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: parentServiceTitle, href: parentServiceHref },
          { label: page.cityName, href: null },
        ]}
        eyebrow={page.keyword.toUpperCase()}
        title={page.h1}
        answer={page.directAnswer}
        image={{ src: page.image, alt: `${page.keyword} by GR Solution` }}
        actions={
          <HeroActions stack>
            <PhoneLink callLocation="service_cta_call" className="btn btn-primary btn-lg" data-cta="city_hero_call">
              <i className="fa-solid fa-phone" aria-hidden="true" /> Call GR Solution
            </PhoneLink>
            <Link href="/contact" className="btn btn-secondary btn-lg" data-cta="city_hero_book">
              Book Inspection
            </Link>
          </HeroActions>
        }
      >
        <ul className="mt-5 flex flex-wrap gap-2">
          {['Doorstep inspection', 'Transparent estimate', 'Delhi NCR support'].map((item) => (
            <li key={item} className="chip">
              <i className="fa-solid fa-circle-check text-teal-600" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </PageHero>

      <TrustBand />

      <section className="section band" data-section="city_guidance">
        <div className="container grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.85fr)] lg:gap-12">
          <article className="max-w-prose">
            <h2>Useful {page.keyword} Guidance</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">{page.intro}</p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-body">{page.cityExplanation}</p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-body">{page.localTrust}</p>
          </article>
          <ContactAside
            callLocation="service_contact_phone"
            links={[
              { href: '/', label: 'Visit GR Solution homepage' },
              { href: parentServiceHref, label: `Explore main ${parentServiceTitle}` },
              { href: '/contact', label: 'Open contact and booking page' },
            ]}
          />
        </div>
      </section>

      <LocalAngleSection content={page.localContent} />
      <CityFactsSection
        facts={page.cityFacts}
        cityName={page.cityName}
        focus={page.isGenericTvRepair ? null : cityFactFocus[page.parentServiceSlug]}
      />
      {page.isGenericTvRepair ? <LocalityLinks citySlug={page.citySlug} cityName={page.cityName} /> : null}

      <section className="section band" data-section="city_detailed_guidance">
        <div className="container">
          <SectionHead
            eyebrow="LOCAL REPAIR GUIDE"
            title={`Detailed ${page.keyword} Guidance`}
            lead="Practical answers for diagnosis, local scheduling, safe handling, repair feasibility and after-repair checks."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {page.contentBlocks.map((block) => (
              <article key={block.title} className="card p-5 sm:p-6">
                <h3 className="text-lg leading-snug">{block.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-tint" data-section="city_problems">
        <div className="container grid gap-5 lg:grid-cols-2">
          <Panel>
            <h2 className="heading-panel">Common Problems We Solve</h2>
            <ul className="check-list mt-5 grid gap-3 leading-relaxed text-body">
              {page.commonProblems.map((problem) => (
                <li key={problem}>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h2 className="heading-panel">What To Check Before Calling</h2>
            <p className="mt-4 leading-relaxed text-body">{page.beforeCalling}</p>
            <h3 className="mt-7 text-lg">Repair vs Replace</h3>
            <p className="mt-2 leading-relaxed text-body">{page.repairReplace}</p>
          </Panel>
        </div>
      </section>

      <SectionCTA section="city_mid_cta" />

      <SupportingTopicsSection topics={page.supportingTopics} cityName={page.cityName} />

      <section className="section band-tint" data-section="city_why_choose">
        <div className="container grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <Panel>
            <h2 className="heading-panel">Why Choose GR Solution In {page.cityName}</h2>
            <ul className="check-list mt-5 grid gap-3 leading-relaxed text-body">
              {page.whyChoose.map((point) => (
                <li key={point}>
                  <span>{withChannelPhone(point)}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h2 className="heading-panel">Quality Checks</h2>
            <p className="mt-4 leading-relaxed text-muted">
              The final check depends on the TV type and approved repair, but these checkpoints help confirm that the fault is stable after service.
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {page.qualityChecks.map((check) => (
                <li key={check} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-3 font-semibold leading-snug text-ink">
                  <i className="fa-solid fa-check mt-0.5 text-teal-600" aria-hidden="true" />
                  {check}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      <section className="section band" data-section="city_process">
        <div className="container">
          <SectionHead eyebrow="SERVICE PROCESS" title={`How ${page.keyword} Works`} />
          <ProcessSteps titleAs="p" steps={page.process.map((step) => ({ title: step }))} />
        </div>
      </section>

      <section className="section band-tint" data-section="city_coverage">
        <div className="container grid gap-5 lg:grid-cols-3">
          <Panel>
            <span className="icon-tile icon-tile-teal" aria-hidden="true">
              <i className="fa-solid fa-map-location-dot" />
            </span>
            <h2 className="heading-panel mt-4">Local Coverage</h2>
            <p className="mt-3 leading-relaxed text-muted">{page.coverage}</p>
          </Panel>
          <Panel>
            <span className="icon-tile icon-tile-teal" aria-hidden="true">
              <i className="fa-solid fa-indian-rupee-sign" />
            </span>
            <h2 className="heading-panel mt-4">Cost Guidance</h2>
            <p className="mt-3 leading-relaxed text-muted">{page.pricing}</p>
            {page.costGuideHref ? (
              <Link href={page.costGuideHref} className="link-arrow mt-2" data-cta="city_cost_guide">
                Full {page.cityName} TV repair cost guide &rarr;
              </Link>
            ) : null}
          </Panel>
          <Panel>
            <span className="icon-tile icon-tile-teal" aria-hidden="true">
              <i className="fa-solid fa-bolt" />
            </span>
            <h2 className="heading-panel mt-4">Quick Support</h2>
            <p className="mt-3 leading-relaxed text-muted">{page.emergency}</p>
          </Panel>
        </div>
      </section>

      <section className="section band" data-section="city_links">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="heading-panel">Same Service In Other Cities</h2>
            <LinkTiles className="mt-5" icon="fa-solid fa-location-dot" links={page.sameServiceOtherCities} />
          </div>
          <div>
            <h2 className="heading-panel">Related TV Repair Services In {page.cityName}</h2>
            <LinkTiles className="mt-5" icon="fa-solid fa-tv" links={relatedSameCityPages} />
          </div>
        </div>
      </section>

      <RelatedGuides path={`/services/${page.slug}`} cityName={page.cityName} />

      {(page.tvTypesCovered?.length > 0 || page.brandCityLinks?.length > 0) && (
        <section className="section band" data-section="city_tv_types">
          <div className="container grid gap-5 lg:grid-cols-2">
            {page.tvTypesCovered?.length > 0 && (
              <Panel>
                <h2 className="heading-panel">{page.isNearMePage ? 'TV Types We Support' : 'TV Types Covered'}</h2>
                <ul className="check-list mt-5 grid gap-3 leading-relaxed text-body">
                  {page.tvTypesCovered.map((item) => (
                    <li key={item}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
            {page.brandCityLinks?.length > 0 && (
              <Panel>
                <h2 className="heading-panel">{page.isNearMePage ? 'TV Brands We Commonly Repair' : 'Brand Repair Links'}</h2>
                <LinkTiles className="mt-5" links={page.brandCityLinks} />
              </Panel>
            )}
          </div>
        </section>
      )}

      <section className="section band-tint" data-section="faq">
        <div className="container">
          <SectionHead eyebrow="FAQ" title={`${page.keyword} FAQs`} />
          <div className="mx-auto max-w-3xl">
            <FAQ faqs={page.faqs} name="city-faq" />
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
    <main data-wa-context={`${page.brand} TV repair in ${page.cityName}`}>
      <JsonLd
        data={[
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

      {/* The quick-answer summary sits directly under the H1, as on every
          other template; the hero intro follows the calls to action. */}
      <PageHero
        section="brand_hero"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: `${page.brand} TV Repair in ${page.cityName}`, href: null },
        ]}
        eyebrow={`${page.brand.toUpperCase()} TV REPAIR`}
        title={page.h1}
        answer={page.directAnswer}
        image={{ src: page.image, alt: `${page.brand} TV repair service by GR Solution in ${page.cityName}` }}
        actions={
          <HeroActions>
            <PhoneLink callLocation="city_service_hero_call" className="btn btn-primary btn-lg" data-cta="brand_hero_call">
              <i className="fa-solid fa-phone" aria-hidden="true" /> Call Now
            </PhoneLink>
            <Link href="/contact" className="btn btn-secondary btn-lg" data-cta="brand_hero_book">
              Book Repair
            </Link>
            <WhatsAppLink className="btn btn-whatsapp btn-lg" data-cta="brand_hero_whatsapp">
              <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
            </WhatsAppLink>
          </HeroActions>
        }
      >
        <p className="mt-6 max-w-[62ch] leading-relaxed text-muted">{page.heroIntro}</p>
      </PageHero>

      <TrustBand />

      {/* Intro + city explanation */}
      <section className="section band" data-section="brand_intro">
        <div className="container grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.85fr)] lg:gap-12">
          <article className="max-w-prose">
            <h2>
              Is It Worth Repairing A {page.brand} TV In {page.cityName}?
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">{page.intro}</p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-body">{page.cityExplanation}</p>
          </article>
          <ContactAside
            callLocation="city_service_contact_phone"
            links={[
              { href: '/', label: 'Visit GR Solution homepage' },
              { href: '/services', label: 'Explore all TV repair services' },
              { href: '/contact', label: 'Open contact and booking page' },
              ...(page.priorityInternalLinks?.slice(0, 2) || []),
            ]}
          />
        </div>
      </section>

      {/* Common problems */}
      <section className="section band-tint" data-section="brand_problems">
        <div className="container">
          <SectionHead
            eyebrow="COMMON PROBLEMS"
            title={`What Problems Can Be Fixed In A ${page.brand} TV?`}
          />
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 xl:gap-4">
            {page.commonIssues.map((issue) => (
              <li key={issue} className="card flex items-start gap-3 p-4 sm:p-5 xl:flex-col">
                <span className="icon-tile size-10 shrink-0" aria-hidden="true">
                  <i className="fa-solid fa-circle-exclamation" />
                </span>
                <p className="font-semibold leading-relaxed text-ink">{issue}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Brand-specific repair guidance */}
      <SupportingTopicsSection topics={page.supportingTopics} cityName={page.cityName} />

      <section className="section band" data-section="brand_inspection">
        <div className="container grid gap-5 lg:grid-cols-2">
          <Panel>
            <span className="icon-tile icon-tile-teal" aria-hidden="true">
              <i className="fa-solid fa-magnifying-glass" />
            </span>
            <h2 className="heading-panel mt-4">
              How Does GR Solution Inspect A {page.brand} TV?
            </h2>
            <p className="mt-3 leading-relaxed text-body">{page.repairGuidance}</p>
          </Panel>
          <Panel tone="panel">
            <span className="icon-tile icon-tile-teal bg-white" aria-hidden="true">
              <i className="fa-solid fa-wrench" />
            </span>
            <h2 className="heading-panel mt-4">Repair vs Replace</h2>
            <p className="mt-3 leading-relaxed text-body">{page.repairVsReplace}</p>
          </Panel>
        </div>
      </section>

      {/* Repair process */}
      <section className="section band-tint" data-section="brand_process">
        <div className="container">
          <SectionHead eyebrow="PROCESS" title={`${page.brand} TV Repair Process`} />
          <ProcessSteps titleAs="p" steps={page.repairProcess.map((step) => ({ title: step }))} />
        </div>
      </section>

      <SectionCTA section="brand_mid_cta" />

      {/* Why choose + before calling checklist */}
      <section className="section band" data-section="brand_why_choose">
        <div className="container grid gap-5 lg:grid-cols-2">
          <Panel>
            <h2 className="heading-panel">Why Choose GR Solution In {page.cityName}</h2>
            <ul className="check-list mt-5 grid gap-3 leading-relaxed text-body">
              {page.whyChoose.map((point) => (
                <li key={point}>
                  <span>{withChannelPhone(point)}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel tone="panel">
            <h2 className="heading-panel">What To Check Before Calling</h2>
            <ul className="check-list mt-5 grid gap-3 leading-relaxed text-body">
              {page.beforeCallingChecklist.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      {/* City coverage + pricing */}
      <section className="section band-tint" data-section="brand_coverage">
        <div className="container grid gap-5 lg:grid-cols-2">
          <Panel>
            <span className="icon-tile icon-tile-teal" aria-hidden="true">
              <i className="fa-solid fa-map-location-dot" />
            </span>
            <h2 className="heading-panel mt-4">Service Coverage In {page.cityName}</h2>
            <p className="mt-3 leading-relaxed text-muted">{page.cityCoverage}</p>
          </Panel>
          <Panel>
            <span className="icon-tile icon-tile-teal" aria-hidden="true">
              <i className="fa-solid fa-indian-rupee-sign" />
            </span>
            <h2 className="heading-panel mt-4">Pricing Guidance</h2>
            <p className="mt-3 leading-relaxed text-muted">{page.pricingNote}</p>
          </Panel>
        </div>
      </section>

      {/* Related links */}
      <section className="section band" data-section="brand_links">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="heading-panel">{page.brand} TV Repair In Other Cities</h2>
            <LinkTiles className="mt-5" icon="fa-solid fa-location-dot" links={page.relatedBrandCityLinks} />
          </div>
          <div>
            <h2 className="heading-panel">Other TV Brands In {page.cityName}</h2>
            <LinkTiles className="mt-5" icon="fa-solid fa-tv" links={page.relatedCityServiceLinks} />
            <Link href="/services" className="link-tile mt-3 border-navy-100 bg-navy-50 text-navy-700">
              <span>View All TV Repair Services</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <RelatedGuides path={`/services/${page.slug}`} cityName={page.cityName} />

      {/* FAQ */}
      <section className="section band-tint" data-section="faq">
        <div className="container">
          <SectionHead eyebrow="FAQ" title={`${page.brand} TV Repair FAQs`} />
          <div className="mx-auto max-w-3xl">
            <FAQ faqs={page.faqs} name="brand-faq" />
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

// The full service-level explanations. These used to be repeated verbatim on
// all four city pages; they now live once, here on the parent service page, and
// each city page carries the keyword label with a short summary.
function ServiceFaultsSection({ serviceSlug, serviceTitle, cityPages }) {
  const topics = getServiceIntentTopics(serviceSlug);
  const profile = getServiceLocalProfile(serviceSlug);
  if (!topics.length || !profile) return null;

  return (
    <section className="section band" data-section="service_faults">
      <div className="container">
        <SectionHead
          align="left"
          className="max-w-4xl"
          eyebrow="FAULTS EXPLAINED"
          title={`${serviceTitle} Faults Explained`}
          lead={profile.diagnosticDetail}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <article key={topic.label} className="card p-5 sm:p-6">
              <h3 className="text-lg leading-snug">{topic.label}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{topic.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="panel flex gap-4 p-5 sm:p-6">
            <span className="icon-tile icon-tile-teal bg-white" aria-hidden="true">
              <i className="fa-solid fa-shield-halved" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg">Safe handling</h3>
              <p className="mt-2 leading-relaxed text-muted">{profile.handlingCare}</p>
            </div>
          </article>
          <article className="panel flex gap-4 p-5 sm:p-6">
            <span className="icon-tile icon-tile-teal bg-white" aria-hidden="true">
              <i className="fa-solid fa-clipboard-list" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg">After-repair checks</h3>
              <p className="mt-2 leading-relaxed text-muted">
                After an approved repair, the checks include {profile.qualityChecks.join(', ')}, confirming the TV
                behaves normally under real viewing conditions rather than simply turning on.
              </p>
            </div>
          </article>
        </div>
        {cityPages?.length ? (
          <div className="mt-8 flex flex-wrap gap-2.5">
            {cityPages.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="chip min-h-[2.75rem] px-4 text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <i className="fa-solid fa-location-dot text-teal-600" aria-hidden="true" />
                {item.keyword}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

// Hand-written local angle for this exact service and city (data/serviceCityContent.js).
function LocalAngleSection({ content }) {
  if (!content) return null;

  return (
    <section className="section band-tint" data-section="local_angle">
      <div className="container">
        <div className="max-w-4xl">
          <span className="eyebrow">LOCAL INSIGHT</span>
          <h2 className="mt-3">{content.heading}</h2>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-body">
              {paragraph}
            </p>
          ))}
          {content.situations ? (
            <>
              <h3 className="mt-10 text-xl">{content.situations.caption}</h3>
              <ContentTable table={content.situations} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// City hubs link down to their dedicated locality pages.
function LocalityLinks({ citySlug, cityName }) {
  const items = getLocalityPagesByCity(citySlug);
  if (!items.length) return null;

  return (
    <section className="section band-tint" data-section="locality_links">
      <div className="container">
        <div className="section-head">
          <h2>{cityName} areas with their own guide</h2>
          <p className="lead mt-3">
            Local detail for the parts of {cityName} we are asked about most: housing, access, electricity supply and
            how a visit is planned there.
          </p>
        </div>
        <LinkTiles
          className="sm:grid-cols-2 lg:grid-cols-3"
          icon="fa-solid fa-location-dot"
          links={items.map((item) => ({ href: `/services/${item.slug}`, label: item.title }))}
        />
      </div>
    </section>
  );
}

// Which city fact matters most for each TV type. The city hub shows every fact
// and the locality table; each service page shows only its most relevant fact,
// so six pages in the same city do not repeat the same block.
const cityFactFocus = {
  'led-tv-repair': { key: 'power', title: 'Power supply and your TV', icon: 'fa-solid fa-bolt' },
  'oled-qled-tv-repair': { key: 'housing', title: 'Homes and handling', icon: 'fa-solid fa-house' },
  'lcd-tv-repair': { key: 'baseNote', title: 'Visit planning', icon: 'fa-solid fa-calendar-check' },
  'plasma-tv-repair': { key: 'housing', title: 'Homes and handling', icon: 'fa-solid fa-house' },
  'curved-tv-repair': { key: 'baseNote', title: 'Visit planning', icon: 'fa-solid fa-calendar-check' },
};

// Verifiable facts about the city itself (data/cityLocalFacts.js).
function CityFactsSection({ facts, cityName, focus }) {
  if (!facts) return null;

  if (focus) {
    return (
      <section className="section-tight band" data-section="city_facts">
        <div className="container">
          <div className="flex max-w-4xl flex-col gap-4 rounded-[1.25rem] border border-teal-100 bg-teal-50/60 p-5 sm:flex-row sm:gap-6 sm:p-8">
            <span className="icon-tile size-12 bg-white text-lg text-teal-700 shadow-xs" aria-hidden="true">
              <i className={focus.icon} />
            </span>
            <div className="min-w-0">
              <span className="eyebrow">{cityName.toUpperCase()} AT A GLANCE</span>
              <h2 className="heading-panel mt-3">
                {focus.title} in {cityName}
              </h2>
              <p className="mt-3 leading-relaxed text-body">{facts[focus.key]}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const cards = [
    { title: 'Visit planning', text: facts.baseNote, icon: 'fa-solid fa-calendar-check' },
    { title: 'Power supply and your TV', text: facts.power, icon: 'fa-solid fa-bolt' },
    { title: 'Homes and handling', text: facts.housing, icon: 'fa-solid fa-house' },
  ];

  return (
    <section className="section band" data-section="city_facts">
      <div className="container">
        <div className="section-head max-w-4xl">
          <span className="eyebrow">{cityName.toUpperCase()} AT A GLANCE</span>
          <h2 className="mt-3">{facts.heading}</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="card p-5 sm:p-6">
              <span className="icon-tile icon-tile-teal" aria-hidden="true">
                <i className={card.icon} />
              </span>
              <h3 className="mt-4 text-lg">{card.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{card.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 max-w-5xl">
          <h3 className="text-xl">{facts.localityTable.caption}</h3>
          <ContentTable table={facts.localityTable} />
        </div>
      </div>
    </section>
  );
}

function SupportingTopicsSection({ topics, cityName }) {
  if (!topics?.length) return null;

  return (
    <section className="section band" data-section="supporting_topics">
      <div className="container">
        <SectionHead
          eyebrow="HELPFUL TOPICS"
          title={`TV Repair Topics for ${cityName}`}
          lead="Concise guidance for common search questions, diagnosis decisions and safe next steps."
        />
        <div className={`grid gap-4 ${topics.length === 1 ? 'mx-auto max-w-3xl' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
          {topics.map((topic) => (
            <article key={topic.keyword} className="card p-5 sm:p-6">
              <h3 className="text-lg leading-snug">{topic.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{topic.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
