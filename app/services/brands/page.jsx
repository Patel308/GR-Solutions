import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
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
    <main>
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

      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: 'TV Repair by Brand', href: null },
            ]}
          />
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-20">
        <div className="container max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
            ALL BRANDS
          </span>
          <h1 className="mt-6 text-[clamp(2.6rem,5vw,4.2rem)] font-black leading-tight text-secondary">
            TV Repair by Brand in Delhi NCR
          </h1>
          <p className="mt-6 rounded-2xl border border-primary/10 bg-white p-5 text-lg font-bold leading-relaxed text-secondary shadow-oldMd">
            GR Solution repairs {brands.length} television brands across Delhi, Noida, Greater Noida and
            Ghaziabad. Pick your brand and city below for the fault patterns specific to that
            brand&apos;s panels and smart platform, then book a doorstep inspection.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-secondary">Choose Your TV Brand</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-textMuted">
              Each brand page covers the display technology that brand uses, the faults we see most
              often on it, and how repair feasibility is judged before any part is replaced.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => (
              <article
                key={brand.slug}
                className="flex flex-col rounded-card border border-black/5 bg-white p-7 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg"
              >
                <h3 className="text-2xl font-black text-secondary">{brand.displayName} TV Repair</h3>
                <p className="mt-3 text-sm font-bold uppercase tracking-wide text-primary">
                  {brand.panelTypes}
                </p>
                <p className="mt-3 flex-1 leading-relaxed text-textMuted">{brand.techNote}.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/services/${brand.slugSegment}-${city.slug}`}
                      className="rounded-full border border-primary/20 bg-bgLight px-4 py-2 text-sm font-black text-primary transition hover:border-primary hover:bg-primary hover:text-white"
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

      <section className="bg-bgLight py-16">
        <div className="container">
          <h2 className="text-3xl font-black text-secondary">Not sure your brand is listed?</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-textMuted">
            The pages above cover the brands we are asked about most, but the diagnostic approach is
            the same for any LED, OLED, QLED, LCD, Plasma or Curved television. Power, backlight,
            panel, board and smart-platform faults behave similarly across manufacturers. If your
            brand is not listed, use the general city pages below or call with your model number.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/services/tv-repair-${city.slug}`}
                className="rounded-2xl border border-primary/10 bg-white px-5 py-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                TV Repair in {city.name}
              </Link>
            ))}
          </div>
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
