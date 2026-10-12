import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import { TrustBand } from '@/components/TrustStrip';
import LinkTiles from '@/components/page/LinkTiles';
import SectionHead from '@/components/page/SectionHead';
import { brands, brandServicePages } from '@/data/brandServicePages';
import { cities } from '@/data/localServicePages';
import { siteConfig, entityIds } from '@/data/siteConfig';
import { buildTitle, clampDescription } from '@/data/seo';

const pageUrl = `${siteConfig.url}/services/brands`;

export const metadata = {
  title: buildTitle('TV Repair by Brand in Delhi NCR', 'All Brands'),
  description: clampDescription(
    'Brand-wise TV repair support across Delhi, Noida, Greater Noida and Ghaziabad for Samsung, LG, Sony, Mi, OnePlus, TCL, Panasonic, Vu, Philips, Hisense and Toshiba.',
  ),
  alternates: { canonical: '/services/brands' },
  openGraph: {
    title: 'TV Repair by Brand in Delhi NCR | GR Solution',
    description:
      'Brand-wise TV repair support across Delhi NCR for every major television brand GR Solution services.',
    url: '/services/brands',
  },
};

export default function BrandsHubPage() {
  return (
    <main data-wa-context="TV repair in Delhi NCR">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'TV Repair by Brand in Delhi NCR',
            url: pageUrl,
            isPartOf: { '@id': entityIds.website },
            about: { '@id': entityIds.localBusiness },
            hasPart: brands.map((brand) => ({
              '@type': 'Service',
              name: `${brand.displayName} TV Repair`,
              serviceType: `${brand.displayName} TV repair`,
              provider: { '@id': entityIds.localBusiness },
              areaServed: siteConfig.serviceAreas,
              url: `${siteConfig.url}/services/${brand.slugSegment}-delhi`,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteConfig.url}/services` },
              { '@type': 'ListItem', position: 3, name: 'TV Repair by Brand', item: pageUrl },
            ],
          },
        ]}
      />

      <section className="hero-surface border-b border-line" data-section="brands_hero">
        <div className="container pb-10 pt-2 sm:pb-12 lg:pb-16 lg:pt-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: 'TV Repair by Brand', href: null },
            ]}
          />
          <div className="mx-auto mt-4 max-w-3xl text-center lg:mt-8">
            <span className="eyebrow">ALL BRANDS</span>
            <h1 className="mt-3">TV Repair by Brand in Delhi NCR</h1>
            <p className="answer-box mt-5 text-left">
              GR Solution repairs {brands.length} television brands across Delhi, Noida, Greater Noida and
              Ghaziabad. Pick your brand and city below for the fault patterns specific to that
              brand&apos;s panels and smart platform, then book a doorstep inspection.
            </p>
          </div>
        </div>
      </section>

      <TrustBand />

      <section className="section band" data-section="brands_grid">
        <div className="container">
          <SectionHead
            title="Choose Your TV Brand"
            lead="Each brand page covers the display technology that brand uses, the faults we see most often on it, and how repair feasibility is judged before any part is replaced."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {brands.map((brand) => (
              <article key={brand.slug} className="card flex flex-col p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="icon-tile shrink-0" aria-hidden="true">
                    <i className="fa-solid fa-tv" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-h3">{brand.displayName} TV Repair</h3>
                    <p className="mt-1 text-eyebrow font-semibold uppercase tracking-[0.06em] text-teal-700">
                      {brand.panelTypes}
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{brand.techNote}.</p>
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-4">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/services/${brand.slugSegment}-${city.slug}`}
                      className="chip min-h-12 justify-center px-3 text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-tint" data-section="brands_other">
        <div className="container">
          <h2>Not sure your brand is listed?</h2>
          <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-body">
            The pages above cover the brands we are asked about most, but the diagnostic approach is
            the same for any LED, OLED, QLED, LCD, Plasma or Curved television. Power, backlight,
            panel, board and smart-platform faults behave similarly across manufacturers. If your
            brand is not listed, use the general city pages below or call with your model number.
          </p>
          <LinkTiles
            className="mt-8 sm:grid-cols-2 lg:grid-cols-4"
            icon="fa-solid fa-location-dot"
            links={cities.map((city) => ({ href: `/services/tv-repair-${city.slug}`, label: `TV Repair in ${city.name}` }))}
          />
        </div>
      </section>

      <PageCTA
        badge="BRAND TV REPAIR"
        title="Know your TV brand and model? Get it inspected."
        description={`GR Solution covers ${brandServicePages.length} brand and city combinations across Delhi NCR with doorstep inspection and an estimate before any paid work begins.`}
      />
    </main>
  );
}
