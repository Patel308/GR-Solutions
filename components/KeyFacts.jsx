import Link from 'next/link';
import PriceTable from '@/components/PriceTable';
import { PhoneLink } from '@/components/ContactChannel';
import { getKeyFactPriceRows, getKeyFacts } from '@/data/keyFacts';

/**
 * Answer-first facts and a Delhi NCR price table, placed under the trust band
 * on every service, city and brand page. AI answer engines cite pages that
 * state prices, coverage, hours and warranty plainly, which is why /pricing is
 * the most-cited page on the site; this puts the same facts on every money page.
 *
 * Shared by the templates in app/services/[slug]/page.jsx and
 * components/ServicePageRevision.jsx, so a new page built from them gets it
 * automatically. Content rules live in data/keyFacts.js.
 *
 * Per docs/design-system.md it adds no heading tags (eyebrow labels and an
 * aria-label instead), so every page's heading outline stays as it was.
 */
export default function KeyFacts({ subject, serviceSlug, cityName, brand, tone = 'band-tint' }) {
  const facts = getKeyFacts({ serviceSlug, cityName, brand });
  const rows = getKeyFactPriceRows(serviceSlug);

  return (
    <section id="key-facts" aria-label={`${subject}: key facts and typical prices`} className={`section-tight ${tone}`} data-section="key_facts">
      <div className="container">
        <p className="eyebrow">Key facts</p>
        <p className="mt-3 max-w-3xl font-display text-h3 text-ink">{subject}: key facts and typical prices</p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl border border-line bg-white p-4">
              <dt className="eyebrow">{fact.label}</dt>
              <dd className="mt-2 leading-relaxed text-body">{fact.value}</dd>
            </div>
          ))}
          <div className="rounded-xl border border-line bg-white p-4">
            <dt className="eyebrow">Book</dt>
            <dd className="mt-2 leading-relaxed text-body">
              Call or WhatsApp{' '}
              <PhoneLink callLocation="key_facts_call" className="font-semibold text-navy-600 hover:text-navy-800" />{' '}
              with your TV brand, screen size and the fault.
            </dd>
          </div>
        </dl>

        {rows.length ? (
          <>
            <p className="eyebrow mt-8">Typical costs by fault and screen size</p>
            <PriceTable rows={rows} caption={`${subject}: typical Delhi NCR repair costs by fault and screen size`} showSourcesLink={false} />
            <p className="mt-4">
              <Link href="/pricing" className="text-link">
                Full TV repair price guide, panel prices and sources
              </Link>
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}
