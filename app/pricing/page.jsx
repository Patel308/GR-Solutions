import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ContentTable from '@/components/ContentTable';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import PriceTable from '@/components/PriceTable';
import SectionCTA from '@/components/SectionCTA';
import { HeroActions } from '@/components/page/PageHero';
import LinkTiles from '@/components/page/LinkTiles';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';
import { cities } from '@/data/localServicePages';
import { pageMetadata } from '@/data/pages';
import {
  diagnosisPolicy,
  panelPriceBands,
  pricingReviewedOn,
  pricingSources,
  repairPriceBands,
} from '@/data/pricing';
import { entityIds, siteConfig } from '@/data/siteConfig';

const meta = pageMetadata.pricing;
const pageUrl = `${siteConfig.url}${meta.path}`;

export const metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path },
};

const reviewedLabel = new Date(`${pricingReviewedOn}T00:00:00Z`).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const faqs = [
  {
    question: 'How much does TV repair cost in Delhi NCR?',
    answer:
      'It depends on the failed component. In the Delhi NCR market, software fixes run about ₹500–₹2,500, power board repairs ₹1,000–₹6,500, backlight replacement ₹3,000–₹18,000 and mainboard repairs ₹2,000–₹12,500, depending on screen size. Panel replacement is far more expensive.',
  },
  {
    question: 'Is there a charge for TV diagnosis?',
    answer: `Not with GR Solution — diagnosis is free, and you get a firm estimate before any paid work. For comparison, a doorstep TV inspection in the Delhi NCR market typically costs around ₹${diagnosisPolicy.marketRange}.`,
  },
  {
    question: 'Why can’t you give me an exact price over the phone?',
    answer:
      'Because the same symptom can have several causes at very different prices. A black screen can be a backlight strip or a cracked panel. The ranges on this page tell you what to expect; the firm figure comes after inspection.',
  },
  {
    question: 'Are these GR Solution’s fixed prices?',
    answer:
      'No. They are Delhi NCR market ranges researched from published sources, shown so you know what a fair quote looks like. GR Solution gives a firm estimate for your specific TV after diagnosis, before any paid work begins.',
  },
  {
    question: 'Is TV screen replacement worth it?',
    answer:
      'Usually only on large, recent, premium TVs. On most mid-range sets, a replacement panel costs a large share of a new television, so replacing the TV is often the better choice.',
  },
];

export default function PricingPage() {
  return (
    <main data-wa-context="a TV repair estimate in Delhi NCR">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'TV Repair Prices in Delhi NCR',
            url: pageUrl,
            description: meta.description,
            dateModified: pricingReviewedOn,
            isPartOf: { '@id': entityIds.website },
            about: { '@id': entityIds.localBusiness },
            inLanguage: 'en-IN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Repair Prices', item: pageUrl },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />

      <section className="hero-surface border-b border-line" data-section="pricing_hero">
        <div className="container pb-10 pt-2 sm:pb-12 lg:pb-16 lg:pt-4">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Repair Prices', href: null }]} />
          <div className="mt-3 grid gap-8 lg:mt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
            <div>
              <span className="eyebrow">
                PRICE GUIDE &middot; REVIEWED {reviewedLabel.toUpperCase()}
              </span>
              <h1 className="mt-3">
                TV Repair Prices in Delhi NCR
              </h1>
              <p className="answer-box mt-5">
                In the Delhi NCR market, a TV power board repair typically costs {'₹'}1,000{'–'}{'₹'}6,500, backlight
                replacement {'₹'}3,000{'–'}{'₹'}18,000 and a software fix {'₹'}500{'–'}{'₹'}2,500, depending on
                screen size. Panel replacement is the expensive exception. What decides your price is which component
                failed {'—'} not the brand.
              </p>
              <div className="mt-6">
                <HeroActions>
                  <PhoneLink callLocation="pricing_hero_call" className="btn btn-primary btn-lg" data-cta="pricing_hero_call">
                    <i className="fa-solid fa-phone" aria-hidden="true" /> Call now
                  </PhoneLink>
                  <WhatsAppLink className="btn btn-whatsapp btn-lg" data-cta="pricing_hero_whatsapp">
                    <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
                  </WhatsAppLink>
                </HeroActions>
              </div>
            </div>

            {/* Price snapshot */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <article className="card flex gap-4 p-5">
                <span className="icon-tile icon-tile-teal size-11 shrink-0" aria-hidden="true">
                  <i className="fa-solid fa-magnifying-glass" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-teal-700">Diagnosis</h2>
                  <p className="mt-1 font-display text-2xl font-extrabold text-ink">{diagnosisPolicy.label}</p>
                  <p className="mt-1.5 text-small leading-relaxed text-muted">
                    {diagnosisPolicy.note} Market inspection charges typically run {'₹'}{diagnosisPolicy.marketRange}.
                  </p>
                </div>
              </article>
              <article className="card flex gap-4 p-5">
                <span className="icon-tile size-11 shrink-0" aria-hidden="true">
                  <i className="fa-solid fa-bolt" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-600">Most common repair</h2>
                  <p className="mt-1 font-display text-2xl font-extrabold text-ink">Backlight</p>
                  <p className="mt-1.5 text-small leading-relaxed text-muted">
                    Sound with a black screen is usually the backlight, not the panel. Check with a torch at a sharp angle.
                  </p>
                </div>
              </article>
              <article className="card flex gap-4 p-5">
                <span className="icon-tile size-11 shrink-0 bg-amber-50 text-warning" aria-hidden="true">
                  <i className="fa-solid fa-display" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-warning">Most expensive</h2>
                  <p className="mt-1 font-display text-2xl font-extrabold text-ink">Panel</p>
                  <p className="mt-1.5 text-small leading-relaxed text-muted">
                    Often a large share of a new TV. Always compare against a new set before approving.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section band" data-section="pricing_tables">
        <div className="container max-w-5xl">
          <h2>Board and component repairs</h2>
          <p className="mt-3 max-w-prose text-[1.0625rem] leading-relaxed text-body">
            These fix the large majority of TV faults, and on a set with an intact screen they are almost always worth doing.
          </p>
          <PriceTable rows={repairPriceBands} caption="TV repair prices by fault and screen size in Delhi NCR" showSourcesLink={false} />

          <h2 className="mt-14">Screen and panel replacement</h2>
          <p className="mt-3 max-w-prose text-[1.0625rem] leading-relaxed text-body">
            Panel replacement is priced very differently, because the panel is the single most expensive part of a television.
            Before paying for one, make sure the panel has actually failed {'—'}{' '}
            <Link href="/blog/tv-screen-replacement-cost-delhi-ncr" className="text-link">
              here is how to check
            </Link>
            .
          </p>
          <PriceTable rows={panelPriceBands} caption="TV panel replacement prices in Delhi NCR" showSourcesLink={false} />

          <SectionCTA
            section="pricing_mid_cta"
            withContainer={false}
            className="mt-10 py-0 sm:py-0"
            title="Want a firm figure for your TV?"
            text="Book a doorstep diagnosis and approve the price before any paid work."
          />

          <h2 className="mt-14">What changes the price</h2>
          <ContentTable
            table={{
              caption: 'Factors that change TV repair price',
              columns: ['Factor', 'Effect', 'Why'],
              rows: [
                ['Which component failed', 'Very high', 'Separates a cheap strip swap from a panel replacement'],
                ['Screen size', 'High', 'Larger panels, boards and backlight arrays cost more'],
                ['Panel type', 'High for panels', 'OLED panels cost far more than LED panels of the same size'],
                ['Part availability', 'Moderate', 'Discontinued parts must be sourced or substituted'],
                ['Brand', 'Low', 'Matters mostly through panel type and size, not the badge'],
              ],
            }}
          />

          <h2 className="mt-14">Cost guides by city</h2>
          <LinkTiles
            className="mt-5 sm:grid-cols-2"
            icon="fa-solid fa-location-dot"
            links={cities.map((city) => ({ href: `/blog/tv-repair-cost-${city.slug}`, label: `TV repair cost in ${city.name}` }))}
          />
        </div>
      </section>

      <section id="sources" className="section band-tint" data-section="pricing_sources">
        <div className="container max-w-5xl">
          <h2>Sources and method</h2>
          <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-body">
            These are Delhi NCR market ranges, not a GR Solution rate card. They were researched from the published sources
            below and cross-checked against each other. Where a source listed part prices only, a typical labour component
            was added. Where sources disagreed, ranges were anchored on part cost plus labour rather than the highest quote
            found, and sources from outside India were excluded. Last reviewed {reviewedLabel}.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {pricingSources.map((source) => (
              <li key={source.url} className="card flex gap-3 p-4 sm:p-5">
                <i className="fa-solid fa-arrow-up-right-from-square mt-1.5 text-sm text-teal-600" aria-hidden="true" />
                <div className="min-w-0">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="font-semibold text-navy-600 underline decoration-navy-200 underline-offset-4 hover:decoration-current"
                  >
                    {source.name}
                  </a>
                  <p className="mt-1 text-small leading-relaxed text-muted">Used for: {source.used}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section band" data-section="faq">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center">Pricing FAQs</h2>
          <FAQ faqs={faqs} name="pricing-faq" />
        </div>
      </section>

      <PageCTA
        badge="FIRM ESTIMATE FIRST"
        title="Get a firm price for your TV"
        description="Share your TV model and symptom. GR Solution diagnoses the fault and gives you a firm estimate before any paid work begins."
      />
    </main>
  );
}
