import GoogleRating from '@/components/GoogleRating';
import cx from '@/components/ui/cx';

// Proof points shown near calls to action. Every line restates a fact the site
// already publishes (service area, the warranty wording, the parts FAQ and the
// Google rating snapshot); nothing here adds a new claim.
const items = [
  { icon: 'fa-solid fa-location-dot', title: 'Doorstep service', text: 'Delhi, Noida, Greater Noida & Ghaziabad' },
  { icon: 'fa-solid fa-shield-halved', title: '90-day service warranty', text: 'Where applicable, explained before work' },
  { icon: 'fa-solid fa-microchip', title: 'Genuine or compatible parts', text: 'Chosen with your approval' },
];

export default function TrustStrip({ className, tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <ul
      aria-label="Why customers book GR Solution"
      className={cx('grid gap-3 sm:grid-cols-2 lg:grid-cols-4', className)}
      data-section="trust_strip"
    >
      {items.map((item) => (
        <li
          key={item.title}
          className={cx(
            'flex items-start gap-3 rounded-xl border p-3.5',
            dark ? 'border-white/10 bg-white/5' : 'border-line bg-white',
          )}
        >
          <span className={cx('icon-tile size-10', dark ? 'bg-white/10 text-teal-300' : 'icon-tile-teal')} aria-hidden="true">
            <i className={item.icon} />
          </span>
          <span className="min-w-0">
            <span className={cx('block font-semibold leading-snug', dark ? 'text-white' : 'text-ink')}>{item.title}</span>
            <span className={cx('block text-small', dark ? 'text-white/70' : 'text-muted')}>{item.text}</span>
          </span>
        </li>
      ))}
      <li
        className={cx(
          'flex items-center gap-3 rounded-xl border p-3.5',
          dark ? 'border-white/10 bg-white/5' : 'border-line bg-white',
        )}
      >
        <span className={cx('icon-tile size-10', dark ? 'bg-white/10 text-star' : 'bg-amber-50 text-star')} aria-hidden="true">
          <i className="fa-solid fa-star" />
        </span>
        <GoogleRating tone={tone} className="min-h-0 leading-snug" />
      </li>
    </ul>
  );
}

// Full-width band holding the strip, placed directly under a page hero.
export function TrustBand() {
  return (
    <section aria-label="Why customers choose GR Solution" className="border-b border-line bg-white py-5 sm:py-6">
      <div className="container">
        <TrustStrip />
      </div>
    </section>
  );
}
