import GoogleRating from '@/components/GoogleRating';
import { googleReviewSnapshot, testimonials } from '@/data/testimonials';
import { siteConfig } from '@/data/siteConfig';

const initials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Customer feedback plus the independent Google record. Stock headshots were
// removed: a portrait is only shown when it is the actual customer.
export default function Testimonials() {
  return (
    <section className="section bg-white" data-section="reviews">
      <div className="container">
        <div className="section-head section-head-center">
          <span className="eyebrow">CUSTOMER TRUST</span>
          <h2 className="mt-3">What Customers Say</h2>
          <p className="lead mt-3">Real feedback from customers across Delhi, Noida and NCR.</p>
          <div className="mt-3 flex justify-center">
            <GoogleRating />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {testimonials.map((item) => (
            <article className="card flex flex-col p-6" key={item.name}>
              <i className="fa-solid fa-quote-left text-2xl text-teal-400" aria-hidden="true" />
              <p className="mt-3 flex-1 leading-relaxed text-body">&quot;{item.text}&quot;</p>
              <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold text-navy-700" aria-hidden="true">
                  {initials(item.name)}
                </span>
                <h3 className="text-base">{item.name}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.25rem] border border-line bg-surface p-5 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="eyebrow">From our Google reviews</p>
            <p className="text-small text-muted">
              {googleReviewSnapshot.rating} out of 5 from {googleReviewSnapshot.count} reviews, as of {googleReviewSnapshot.asOf}
            </p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {googleReviewSnapshot.quotes.map((quote) => (
              <figure key={quote.text} className="m-0 rounded-xl border border-line bg-white p-5">
                <p className="tracking-[0.12em] text-star" aria-label={`${quote.stars} out of 5 stars`}>
                  {'★'.repeat(quote.stars)}
                  <span className="text-line-strong">{'★'.repeat(5 - quote.stars)}</span>
                </p>
                <blockquote className="m-0 mt-2 leading-relaxed text-body">&ldquo;{quote.text}&rdquo;</blockquote>
                <figcaption className="mt-3 text-small font-semibold text-muted">Google review</figcaption>
              </figure>
            ))}
          </div>
          {siteConfig.googleBusinessProfile ? (
            <a
              href={siteConfig.googleBusinessProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow mt-3"
              data-cta="home_read_google_reviews"
            >
              Read all reviews on Google <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
