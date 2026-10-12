import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import { pageMetadata } from '@/data/pages';
import { entityIds, siteConfig } from '@/data/siteConfig';
import { googleReviewSnapshot, testimonials } from '@/data/testimonials';

const meta = pageMetadata.reviews;
const pageUrl = `${siteConfig.url}${meta.path}`;

export const metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path },
};

// What customers can check GR Solution against. Every item is a commitment the
// site already makes elsewhere, collected here so feedback has a clear yardstick.
const initials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const commitmentIcons = ['fa-solid fa-magnifying-glass', 'fa-solid fa-microchip', 'fa-solid fa-comments', 'fa-solid fa-shield-halved'];

const commitments = [
  {
    title: 'Diagnosis before any paid work',
    text: 'The technician identifies the failed component and explains it before you are asked to approve anything.',
  },
  {
    title: 'A named component, not a vague fault',
    text: 'You are told which part failed — power board, backlight, T-Con — so you can compare the estimate fairly.',
  },
  {
    title: 'An honest repair-or-replace answer',
    text: 'If a new TV makes more sense than the repair, you are told so, rather than sold a repair that does not pay off.',
  },
  {
    title: 'Warranty explained up front',
    text: 'Warranty terms depend on the repair and the part used, and are explained before the work starts.',
  },
];

export default function ReviewsPage() {
  const hasGoogleProfile = Boolean(siteConfig.googleBusinessProfile);

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'GR Solution Customer Reviews',
            url: pageUrl,
            description: meta.description,
            isPartOf: { '@id': entityIds.website },
            about: { '@id': entityIds.localBusiness },
            inLanguage: 'en-IN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Customer Reviews', item: pageUrl },
            ],
          },
        ]}
      />

      <section className="hero-surface border-b border-line" data-section="reviews_hero">
        <div className="container pb-10 pt-2 sm:pb-12 lg:pb-16 lg:pt-4">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Customer Reviews', href: null }]} />
          <div className="mx-auto mt-4 max-w-3xl text-center lg:mt-8">
            <span className="eyebrow">CUSTOMER FEEDBACK</span>
            <h1 className="mt-3">GR Solution Customer Reviews</h1>
            <p className="lead mx-auto mt-4 max-w-2xl">
              Feedback from customers across Delhi, Noida and the NCR. For the complete, independent record — including
              reviews we have no control over — read our Google Business Profile.
            </p>
            {hasGoogleProfile ? (
              <a
                href={siteConfig.googleBusinessProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg mt-6"
                data-cta="reviews_hero_google"
              >
                <i className="fa-solid fa-location-dot" aria-hidden="true" /> Read reviews on Google
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section band" data-section="reviews_google">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2>On Google</h2>
            <p className="mt-4 font-display text-[3.5rem] font-extrabold leading-none text-ink">
              {googleReviewSnapshot.rating}
              <span className="ml-2 align-middle text-3xl text-star" aria-hidden="true">{'★'}</span>
            </p>
            <p className="mt-3 text-[1.0625rem] text-muted">
              from {googleReviewSnapshot.count} Google reviews, as of {googleReviewSnapshot.asOf}
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {googleReviewSnapshot.quotes.map((quote) => (
              <figure key={quote.text} className="card m-0 flex flex-col p-6">
                <p className="tracking-[0.12em] text-star" aria-label={`${quote.stars} out of 5 stars`}>
                  {'★'.repeat(quote.stars)}
                  <span className="text-line-strong">{'★'.repeat(5 - quote.stars)}</span>
                </p>
                <blockquote className="m-0 mt-3 flex-1 text-[1.0625rem] leading-relaxed text-ink">&ldquo;{quote.text}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-small font-semibold text-muted">
                  <i className="fa-solid fa-circle-check text-teal-600" aria-hidden="true" />
                  Google review
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-tint" data-section="reviews_testimonials">
        <div className="container">
          <h2 className="mb-10 text-center">What customers have told us</h2>
          {/* Stock headshots were removed: a portrait is only shown when it is
              the actual customer. Names and words are unchanged. */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {testimonials.map((item) => (
              <figure key={item.name} className="card m-0 flex flex-col p-6 sm:p-7">
                <i className="fa-solid fa-quote-left text-2xl text-teal-400" aria-hidden="true" />
                <blockquote className="m-0 mt-3 flex-1 text-[1.0625rem] leading-relaxed text-ink">&ldquo;{item.text}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold text-navy-700"
                    aria-hidden="true"
                  >
                    {initials(item.name)}
                  </span>
                  <span className="font-display text-lg font-bold text-ink">{item.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" data-section="reviews_commitments">
        <div className="container max-w-5xl">
          <h2>What you can hold us to</h2>
          <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-body">
            The fairest way to judge any repair service is against what it promised. These are the commitments that
            should show up in every review.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {commitments.map((item, index) => (
              <article key={item.title} className="card flex gap-4 p-5 sm:p-6">
                <span className="icon-tile icon-tile-teal" aria-hidden="true">
                  <i className={commitmentIcons[index] || 'fa-solid fa-check'} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight band-tint" data-section="reviews_leave">
        <div className="container">
          <div className="card mx-auto max-w-4xl p-6 text-center sm:p-10">
            <h2 className="heading-panel">Had your TV repaired by us?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-body">
              A short Google review helps other households in Delhi NCR decide who to trust with their TV. If something
              did not go right, tell us directly first so we can put it right.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {hasGoogleProfile ? (
                <a
                  href={siteConfig.googleBusinessProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                  data-cta="reviews_leave_google"
                >
                  Leave a Google review
                </a>
              ) : null}
              <Link href="/contact" className="btn btn-secondary btn-lg" data-cta="reviews_contact">
                Contact us about a repair
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PageCTA />
    </main>
  );
}
