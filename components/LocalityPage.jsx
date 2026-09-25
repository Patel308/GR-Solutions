import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ContentTable from '@/components/ContentTable';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import PriceTable from '@/components/PriceTable';
import { getLocalityPagesByCity } from '@/data/localityPages';
import { services } from '@/data/services';
import { repairPriceBands } from '@/data/pricing';
import { entityIds, siteConfig } from '@/data/siteConfig';

// The three faults that decide most locality enquiries; the full grid lives on
// /pricing and in the city cost guide.
const localityPriceRows = repairPriceBands.filter((row) =>
  ['Backlight / LED strip replacement', 'Power supply board repair or replacement', 'Mainboard / motherboard repair'].includes(row.fault),
);

export default function LocalityPage({ page }) {
  const pageUrl = `${siteConfig.url}/services/${page.slug}`;
  const siblings = getLocalityPagesByCity(page.citySlug).filter((item) => item.slug !== page.slug);

  return (
    <main>
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

      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: `TV Repair in ${page.cityName}`, href: page.parentHref },
              { label: page.name, href: null },
            ]}
          />
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-20">
        <div className="container max-w-5xl">
          <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
            {page.name.toUpperCase()} &middot; {page.cityName.toUpperCase()}
          </span>
          <h1 className="mt-6 text-[clamp(2.6rem,5vw,4.4rem)] font-black leading-tight text-secondary">{page.h1}</h1>
          <p className="mt-6 rounded-2xl border border-primary/10 bg-white p-5 text-lg font-bold leading-relaxed text-secondary shadow-oldMd">
            {page.directAnswer}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={siteConfig.phoneHref}
              data-call-location={`locality_${page.slug}_call`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary"
            >
              <i className="fa-solid fa-phone" /> Call Now
            </a>
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-7 py-4 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white"
            >
              <i className="fa-brands fa-whatsapp" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-lg leading-relaxed text-textMuted">{page.intro}</p>
            <h2 className="mt-10 text-3xl font-black text-secondary">{page.name} at a glance</h2>
            <ContentTable table={{ caption: `${page.name} local facts`, columns: ['Fact', 'Detail'], rows: page.facts }} />
          </div>
          <aside className="self-start rounded-card border border-primary/10 bg-bgLight p-8">
            <h2 className="text-2xl font-black text-secondary">Areas covered</h2>
            <ul className="mt-5 grid gap-2">
              {page.areas.map((area) => (
                <li key={area} className="flex gap-3 text-textMuted">
                  <i className="fa-solid fa-location-dot mt-1 text-primary" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-bgLight py-16">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-black leading-tight text-secondary md:text-4xl">{page.angleHeading}</h2>
          {page.angle.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-5 text-lg leading-relaxed text-textMuted">
              {paragraph}
            </p>
          ))}
          <h3 className="mt-10 text-2xl font-black text-secondary">{page.situations.caption}</h3>
          <ContentTable table={page.situations} />
          {page.completedJobs?.length ? (
            <>
              <h3 className="mt-10 text-2xl font-black text-secondary">Recent jobs in {page.name}</h3>
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
      </section>

      <section className="py-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-secondary">Before the visit</h2>
            <ul className="mt-6 grid gap-4">
              {page.tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-lg leading-relaxed text-textMuted">
                  <i className="fa-solid fa-circle-check mt-1 text-success" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-black text-secondary">What repairs typically cost</h2>
            <PriceTable rows={localityPriceRows} caption={`Typical TV repair costs in ${page.name}`} />
            <Link href={page.costGuideHref} className="mt-4 inline-flex font-black text-primary hover:text-secondary">
              Full {page.cityName} TV repair cost guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-bgLight py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black text-secondary">{page.keyword} FAQs</h2>
          </div>
          <div className="mx-auto max-w-4xl">
            <FAQ faqs={page.faqs} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-secondary">TV repair services in {page.cityName}</h2>
            <div className="mt-6 grid gap-3">
              <Link href={page.parentHref} className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary">
                TV Repair in {page.cityName}
              </Link>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}-${page.citySlug}`}
                  className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary"
                >
                  {service.title} in {page.cityName}
                </Link>
              ))}
            </div>
          </div>
          {siblings.length ? (
            <div>
              <h2 className="text-3xl font-black text-secondary">Other {page.cityName} areas</h2>
              <div className="mt-6 grid gap-3">
                {siblings.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
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
