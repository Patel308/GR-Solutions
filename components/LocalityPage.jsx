import Link from 'next/link';
import ContentTable from '@/components/ContentTable';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import PriceTable from '@/components/PriceTable';
import SectionCTA from '@/components/SectionCTA';
import { TrustBand } from '@/components/TrustStrip';
import PageHero, { HeroActions } from '@/components/page/PageHero';
import SectionHead from '@/components/page/SectionHead';
import LinkTiles from '@/components/page/LinkTiles';
import HeroMapArt from '@/components/page/HeroMapArt';
import { getLocalityPagesByCity } from '@/data/localityPages';
import { services } from '@/data/services';
import { repairPriceBands } from '@/data/pricing';
import { entityIds, siteConfig } from '@/data/siteConfig';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';

// The three faults that decide most locality enquiries; the full grid lives on
// /pricing and in the city cost guide.
const localityPriceRows = repairPriceBands.filter((row) =>
  ['Backlight / LED strip replacement', 'Power supply board repair or replacement', 'Mainboard / motherboard repair'].includes(row.fault),
);

export default function LocalityPage({ page }) {
  const pageUrl = `${siteConfig.url}/services/${page.slug}`;
  const siblings = getLocalityPagesByCity(page.citySlug).filter((item) => item.slug !== page.slug);

  return (
    <main data-wa-context={`TV repair in ${page.name}, ${page.cityName}`}>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: page.title,
            serviceType: 'TV repair service',
            description: page.metaDescription,
            url: pageUrl,
            provider: { '@id': entityIds.localBusiness },
            areaServed: {
              '@type': 'Place',
              name: page.name,
              containedInPlace: { '@type': 'City', name: page.cityName },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteConfig.url}/services` },
              { '@type': 'ListItem', position: 3, name: `TV Repair in ${page.cityName}`, item: `${siteConfig.url}${page.parentHref}` },
              { '@type': 'ListItem', position: 4, name: page.title, item: pageUrl },
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
        section="locality_hero"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: `TV Repair in ${page.cityName}`, href: page.parentHref },
          { label: page.name, href: null },
        ]}
        eyebrow={
          <>
            {page.name.toUpperCase()} &middot; {page.cityName.toUpperCase()}
          </>
        }
        title={page.h1}
        answer={page.directAnswer}
        art={<HeroMapArt className="w-full max-w-[22rem] drop-shadow-[0_24px_40px_rgb(15_23_42/0.12)]" />}
        actions={
          <HeroActions>
            <PhoneLink
              callLocation={`locality_${page.slug}_call`}
              className="btn btn-primary btn-lg"
              data-cta="locality_hero_call"
            >
              <i className="fa-solid fa-phone" aria-hidden="true" /> Call Now
            </PhoneLink>
            <WhatsAppLink className="btn btn-whatsapp btn-lg" data-cta="locality_hero_whatsapp">
              <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
            </WhatsAppLink>
          </HeroActions>
        }
      />

      <TrustBand />

      <section className="section band" data-section="locality_facts">
        <div className="container grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] lg:gap-12">
          <div className="min-w-0">
            <p className="max-w-prose text-[1.0625rem] leading-relaxed text-body">{page.intro}</p>
            <h2 className="mt-10">{page.name} at a glance</h2>
            <ContentTable table={{ caption: `${page.name} local facts`, columns: ['Fact', 'Detail'], rows: page.facts }} />
          </div>
          <aside className="panel self-start p-5 sm:p-7 lg:sticky lg:top-28">
            <h2 className="heading-panel">Areas covered</h2>
            <ul className="mt-5 grid gap-2.5">
              {page.areas.map((area) => (
                <li key={area} className="flex gap-3 leading-relaxed text-body">
                  <i className="fa-solid fa-location-dot mt-1 w-4 shrink-0 text-center text-teal-600" aria-hidden="true" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section band-tint" data-section="locality_angle">
        <div className="container">
          <div className="max-w-4xl">
            <h2>{page.angleHeading}</h2>
            {page.angle.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-body">
                {paragraph}
              </p>
            ))}
            <h3 className="mt-10 text-xl">{page.situations.caption}</h3>
            <ContentTable table={page.situations} />
            {page.completedJobs?.length ? (
              <>
                <h3 className="mt-10 text-xl">Recent jobs in {page.name}</h3>
                <ContentTable
                  table={{
                    caption: `Recent TV repair jobs in ${page.name}`,
                    columns: ['Month', 'TV', 'Symptom', 'What we found', 'Outcome'],
                    rows: page.completedJobs.map((job) => [job.month, job.tv, job.symptom, job.found, job.outcome]),
                  }}
                />
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section band" data-section="locality_visit">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="heading-panel">Before the visit</h2>
            <ul className="check-list mt-5 grid gap-3.5 text-[1.0625rem] leading-relaxed text-body">
              {page.tips.map((tip) => (
                <li key={tip}>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h2 className="heading-panel">What repairs typically cost</h2>
            <PriceTable rows={localityPriceRows} caption={`Typical TV repair costs in ${page.name}`} />
            <Link href={page.costGuideHref} className="link-arrow mt-2" data-cta="locality_cost_guide">
              Full {page.cityName} TV repair cost guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      <SectionCTA section="locality_mid_cta" className="pt-0 sm:pt-0" />

      <section className="section band-tint" data-section="faq">
        <div className="container">
          <SectionHead title={`${page.keyword} FAQs`} />
          <div className="mx-auto max-w-3xl">
            <FAQ faqs={page.faqs} name="locality-faq" />
          </div>
        </div>
      </section>

      <section className="section band" data-section="locality_links">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="heading-panel">TV repair services in {page.cityName}</h2>
            <LinkTiles
              className="mt-5"
              icon="fa-solid fa-tv"
              links={[
                { href: page.parentHref, label: `TV Repair in ${page.cityName}` },
                ...services.map((service) => ({
                  href: `/services/${service.slug}-${page.citySlug}`,
                  label: `${service.title} in ${page.cityName}`,
                })),
              ]}
            />
          </div>
          {siblings.length ? (
            <div>
              <h2 className="heading-panel">Other {page.cityName} areas</h2>
              <LinkTiles
                className="mt-5"
                icon="fa-solid fa-location-dot"
                links={siblings.map((item) => ({ href: `/services/${item.slug}`, label: item.title }))}
              />
            </div>
          ) : null}
        </div>
      </section>

      <PageCTA
        badge={`${page.name.toUpperCase()} TV REPAIR`}
        title={`TV not working in ${page.name}?`}
        description={`Share your TV model and the symptom, and GR Solution will plan a doorstep visit in ${page.name} with an estimate before any paid work begins.`}
      />
    </main>
  );
}
