import Link from 'next/link';
import { getBrandWarrantyNote } from '@/data/brandWarranty';

/**
 * Out-of-warranty note on brand pages (content rules in data/brandWarranty.js).
 * Per docs/design-system.md it adds no heading tags: an eyebrow label and an
 * aria-label, so the page's heading outline is unchanged.
 */
export default function BrandWarrantyNote({ brandSlug, cityName }) {
  const note = getBrandWarrantyNote(brandSlug);
  if (!note) return null;

  return (
    <section aria-label={`${note.label} in ${cityName}`} className="section-tight band" data-section="brand_warranty_note">
      <div className="container">
        <div className="panel max-w-4xl p-5 sm:p-7">
          <p className="eyebrow">{note.label}</p>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-ink">{note.lead(cityName)}</p>
          <ul className="mt-5 grid gap-3">
            {note.points.map((point) => (
              <li key={point} className="flex gap-3 leading-relaxed text-body">
                <i className="fa-solid fa-check mt-1.5 text-teal-600" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5">
            <Link href={note.guide.href} className="text-link inline-flex min-h-12 items-center font-semibold">
              {note.guide.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
