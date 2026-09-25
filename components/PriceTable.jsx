import Link from 'next/link';
import { NOT_APPLICABLE, hasRealPricing, pricingReviewedOn, sizeBands } from '@/data/pricing';

const tableWrap = 'mt-6 overflow-x-auto rounded-2xl border border-black/10';
const thClass = 'whitespace-nowrap px-4 py-3 text-left text-sm font-black uppercase tracking-wide text-white';
const tdClass = 'border-t border-black/5 px-4 py-3 align-top text-textMuted';

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
 */
export default function PriceTable({ rows, caption, showSourcesLink = true }) {
  if (!hasRealPricing(rows)) {
    return (
      <div className="mt-6 rounded-2xl border border-primary/20 bg-bgLight p-6">
        <p className="text-lg font-black leading-relaxed text-secondary">
          GR Solution quotes after inspection, not before it.
        </p>
        <p className="mt-3 leading-relaxed text-textMuted">
          The faults below are the ones that decide what a repair costs. Which one you are dealing
          with can only be confirmed by checking the set, so the technician diagnoses first and gives
          you a firm figure before any paid work starts.
        </p>
        <ul className="mt-5 grid gap-3">
          {rows.map((row) => (
            <li key={row.fault} className="flex gap-3 leading-relaxed text-textMuted">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
              <span>
                <strong className="text-secondary">{row.fault}</strong> &mdash; {row.symptom}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <figure className="m-0">
      <div className={tableWrap}>
        <table className="w-full border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="bg-secondary">
            <tr>
              <th scope="col" className={thClass}>Fault</th>
              {sizeBands.map((band) => (
                <th key={band} scope="col" className={thClass}>{band}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.fault} className="odd:bg-white even:bg-bgLight">
                <td className={`${tdClass} font-black text-secondary`}>
                  {row.fault}
                  <span className="mt-1 block text-sm font-normal text-textMuted">{row.symptom}</span>
                </td>
                {row.bands.map((band, i) => (
                  <td key={`${row.fault}-${i}`} className={`${tdClass} whitespace-nowrap`}>
                    {band === NOT_APPLICABLE ? (
                      <span className="text-sm">Rarely made at this size</span>
                    ) : (
                      <>&#8377;{band}</>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-textMuted">
        Delhi NCR market ranges including part and labour, researched from published sources and
        last reviewed {formatReviewed(pricingReviewedOn)}. These are indicative, not a fixed quote:
        the final figure depends on the exact model, part availability and whether the job is done
        at home or at the workshop, and is confirmed after inspection.
        {showSourcesLink ? (
          <>
            {' '}
            <Link href="/pricing#sources" className="font-bold text-primary hover:text-secondary">
              See sources and method
            </Link>
            .
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}
