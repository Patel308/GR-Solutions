import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import { pageMetadata } from '@/data/pages';
import { entityIds, siteConfig } from '@/data/siteConfig';
import { testimonials } from '@/data/testimonials';

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

      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Customer Reviews', href: null }]} />
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-20">
        <div className="container max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
            CUSTOMER FEEDBACK
          </span>
          <h1 className="mt-6 text-[clamp(2.6rem,5vw,4.4rem)] font-black leading-tight text-secondary">
            GR Solution Customer Reviews
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-textMuted">
            Feedback from customers across Delhi, Noida and the NCR. For the complete, independent record — including
            reviews we have no control over — read our Google Business Profile.
          </p>
          {hasGoogleProfile ? (
            <a
              href={siteConfig.googleBusinessProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary"
            >
              <i className="fa-solid fa-location-dot" /> Read reviews on Google
            </a>
          ) : null}
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-4xl font-black text-secondary">What customers have told us</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.name} className="m-0 rounded-card border border-black/5 bg-white p-10 shadow-oldMd">
                <Image
                  src={item.image}
                  alt={`Photo of GR Solution customer ${item.name}`}
                  width={90}
                  height={90}
                  className="mb-6 rounded-full"
                />
                <blockquote className="m-0 text-lg leading-relaxed text-textMain">&ldquo;{item.text}&rdquo;</blockquote>
                <figcaption className="mt-4 text-xl font-black text-secondary">{item.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bgLight py-16">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-black text-secondary">What you can hold us to</h2>
          <p className="mt-4 text-lg leading-relaxed text-textMuted">
            The fairest way to judge any repair service is against what it promised. These are the commitments that
            should show up in every review.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {commitments.map((item) => (
              <article key={item.title} className="rounded-card bg-white p-7 shadow-oldMd">
                <h3 className="text-xl font-black text-secondary">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-textMuted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-black text-secondary">Had your TV repaired by us?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-textMuted">
            A short Google review helps other households in Delhi NCR decide who to trust with their TV. If something
            did not go right, tell us directly first so we can put it right.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {hasGoogleProfile ? (
              <a
                href={siteConfig.googleBusinessProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary"
              >
                Leave a Google review
              </a>
            ) : null}
            <Link
              href="/contact"
              className="inline-flex rounded-full border-2 border-primary bg-white px-7 py-4 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white"
            >
              Contact us about a repair
            </Link>
          </div>
        </div>
      </section>

      <PageCTA />
    </main>
  );
}
