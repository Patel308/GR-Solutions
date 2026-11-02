import Link from 'next/link';
import { NOT_APPLICABLE, hasRealPricing, pricingReviewedOn, sizeBands } from '@/data/pricing';

function formatReviewed(value) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Price grid. Renders ranges only when every band in the set holds a value
 * (see data/pricing.js). If any band is reset to the placeholder, the whole
 * table falls back to the inspection-based notice, so a half-filled grid can
 * never reach the page.
 *
 * On phones each fault becomes a card listing the three screen-size prices
 * (CSS only, same HTML), so no price is hidden behind a horizontal scroll.
 */
export default function PriceTable({ rows, caption, showSourcesLink = true }) {
  if (!hasRealPricing(rows)) {
    return (
      <div className="panel mt-6 p-5 sm:p-6">
        <p className="font-display text-lg font-bold leading-relaxed text-ink">
          GR Solution quotes after inspection, not before it.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          The faults below are the ones that decide what a repair costs. Which one you are dealing
          with can only be confirmed by checking the set, so the technician diagnoses first and gives
          you a firm figure before any paid work starts.
        </p>
        <ul className="mt-5 grid gap-3">
          {rows.map((row) => (
            <li key={row.fault} className="flex gap-3 leading-relaxed text-muted">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-400" />
              <span>
                <strong className="text-ink">{row.fault}</strong> &mdash; {row.symptom}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <figure className="m-0 mt-6">
      <div className="data-table-wrap stack-on-mobile stack-inline overflow-x-auto rounded-xl border border-line bg-white">
        <table className="data-table price-table" role="table">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">Fault</th>
              {sizeBands.map((band) => (
                <th key={band} scope="col" role="columnheader">{band}</th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {rows.map((row) => (
              <tr key={row.fault} role="row">
                <td role="cell" data-label="Fault">
                  {row.fault}
                  <span className="mt-1 block text-small font-normal text-muted">{row.symptom}</span>
                </td>
                {row.bands.map((band, i) => (
                  <td key={`${row.fault}-${i}`} role="cell" data-label={sizeBands[i]} className="whitespace-nowrap tabular-nums">
                    {band === NOT_APPLICABLE ? (
                      <span className="whitespace-normal text-small text-muted">Rarely made at this size</span>
                    ) : (
                      <span className="font-semibold text-ink">&#8377;{band}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-small leading-relaxed text-muted">
        Delhi NCR market ranges including part and labour, researched from published sources and
        last reviewed {formatReviewed(pricingReviewedOn)}. These are indicative, not a fixed quote:
        the final figure depends on the exact model, part availability and whether the job is done
        at home or at the workshop, and is confirmed after inspection.
        {showSourcesLink ? (
          <>
            {' '}
            <Link href="/pricing#sources" className="text-link">
              See sources and method
            </Link>
            .
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}
