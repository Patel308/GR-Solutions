import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ContentTable from '@/components/ContentTable';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import PriceTable from '@/components/PriceTable';
import { cities } from '@/data/localServicePages';
import { pageMetadata } from '@/data/pages';
import {
  diagnosisCharge,
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
    question: 'What is the visit charge for TV repair?',
    answer: `A doorstep TV inspection in the Delhi NCR market typically costs around ₹${diagnosisCharge.amount}, and most providers adjust it against the final bill if the repair goes ahead. Confirm GR Solution’s current visit terms when you book.`,
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
    <main>
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

      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Repair Prices', href: null }]} />
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-20">
        <div className="container max-w-5xl">
          <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
            PRICE GUIDE &middot; REVIEWED {reviewedLabel.toUpperCase()}
          </span>
          <h1 className="mt-6 text-[clamp(2.6rem,5vw,4.4rem)] font-black leading-tight text-secondary">
            TV Repair Prices in Delhi NCR
          </h1>
          <p className="mt-6 rounded-2xl border border-primary/10 bg-white p-5 text-lg font-bold leading-relaxed text-secondary shadow-oldMd">
            In the Delhi NCR market, a TV power board repair typically costs {'₹'}1,000{'–'}{'₹'}6,500, backlight
            replacement {'₹'}3,000{'–'}{'₹'}18,000 and a software fix {'₹'}500{'–'}{'₹'}2,500, depending on
            screen size. Panel replacement is the expensive exception. What decides your price is which component
            failed {'—'} not the brand.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-card border border-primary/10 bg-bgLight p-6">
              <h2 className="text-lg font-black uppercase tracking-wide text-primary">Visit / inspection</h2>
              <p className="mt-3 text-3xl font-black text-secondary">{'₹'}{diagnosisCharge.amount}</p>
              <p className="mt-3 text-sm leading-relaxed text-textMuted">{diagnosisCharge.note}</p>
            </article>
            <article className="rounded-card border border-primary/10 bg-bgLight p-6">
              <h2 className="text-lg font-black uppercase tracking-wide text-primary">Most common repair</h2>
              <p className="mt-3 text-3xl font-black text-secondary">Backlight</p>
              <p className="mt-3 text-sm leading-relaxed text-textMuted">
                Sound with a black screen is usually the backlight, not the panel. Check with a torch at a sharp angle.
              </p>
            </article>
            <article className="rounded-card border border-primary/10 bg-bgLight p-6">
              <h2 className="text-lg font-black uppercase tracking-wide text-primary">Most expensive</h2>
              <p className="mt-3 text-3xl font-black text-secondary">Panel</p>
              <p className="mt-3 text-sm leading-relaxed text-textMuted">
                Often a large share of a new TV. Always compare against a new set before approving.
              </p>
            </article>
          </div>

          <h2 className="mt-16 text-3xl font-black text-secondary">Board and component repairs</h2>
          <p className="mt-4 text-lg leading-relaxed text-textMuted">
            These fix the large majority of TV faults, and on a set with an intact screen they are almost always worth doing.
          </p>
          <PriceTable rows={repairPriceBands} caption="TV repair prices by fault and screen size in Delhi NCR" showSourcesLink={false} />

          <h2 className="mt-16 text-3xl font-black text-secondary">Screen and panel replacement</h2>
          <p className="mt-4 text-lg leading-relaxed text-textMuted">
            Panel replacement is priced very differently, because the panel is the single most expensive part of a television.
            Before paying for one, make sure the panel has actually failed {'—'}{' '}
            <Link href="/blog/tv-screen-replacement-cost-delhi-ncr" className="font-bold text-primary hover:text-secondary">
              here is how to check
            </Link>
            .
          </p>
          <PriceTable rows={panelPriceBands} caption="TV panel replacement prices in Delhi NCR" showSourcesLink={false} />

          <h2 className="mt-16 text-3xl font-black text-secondary">What changes the price</h2>
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

          <h2 className="mt-16 text-3xl font-black text-secondary">Cost guides by city</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/blog/tv-repair-cost-${city.slug}`}
                className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:text-primary"
              >
                TV repair cost in {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="sources" className="bg-bgLight py-16">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-black text-secondary">Sources and method</h2>
          <p className="mt-4 text-lg leading-relaxed text-textMuted">
            These are Delhi NCR market ranges, not a GR Solution rate card. They were researched from the published sources
            below and cross-checked against each other. Where a source listed part prices only, a typical labour component
            was added. Where sources disagreed, ranges were anchored on part cost plus labour rather than the highest quote
            found, and sources from outside India were excluded. Last reviewed {reviewedLabel}.
          </p>
          <ul className="mt-6 grid gap-4">
            {pricingSources.map((source) => (
              <li key={source.url} className="rounded-2xl bg-white p-5 shadow-oldMd">
                <a
                  href={source.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="font-black text-primary hover:text-secondary"
                >
                  {source.name}
                </a>
                <p className="mt-1 text-sm leading-relaxed text-textMuted">Used for: {source.used}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-center text-4xl font-black text-secondary">Pricing FAQs</h2>
          <FAQ faqs={faqs} />
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
