import { siteConfig } from '@/data/siteConfig';
import { googleReviewSnapshot } from '@/data/testimonials';
import cx from '@/components/ui/cx';

// Google rating link built from the dated snapshot in data/testimonials.js.
// Not marked up as schema on purpose (self-served LocalBusiness reviews are not
// eligible for rich results); it simply links to the independent profile.
export default function GoogleRating({ className, tone = 'light', showCount = true }) {
  const { rating, count } = googleReviewSnapshot;
  const href = siteConfig.googleBusinessProfile;
  const content = (
    <>
      <span aria-hidden="true" className="tracking-[0.12em] text-star">★★★★★</span>
      <span>
        <strong className={tone === 'dark' ? 'text-white' : 'text-ink'}>{rating}</strong> on Google
        {showCount ? <span className={tone === 'dark' ? 'text-white/70' : 'text-muted'}> · {count} reviews</span> : null}
      </span>
    </>
  );

  const classes = cx(
    'inline-flex min-h-12 items-center gap-2 text-small font-semibold',
    tone === 'dark' ? 'text-white' : 'text-ink',
    className,
  );

  if (!href) return <span className={classes}>{content}</span>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(classes, 'underline-offset-4 hover:underline')}
      aria-label={`${rating} on Google · ${count} reviews (opens our Google Business Profile)`}
      data-cta="google_rating"
    >
      {content}
    </a>
  );
}
