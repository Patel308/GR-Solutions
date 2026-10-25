import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import FAQ from '@/components/FAQ';
import { blogArticles, blogAuthor, getBlogArticleBySlug } from '@/data/blogArticles';
import { siteConfig, entityIds } from '@/data/siteConfig';
import PriceTable from '@/components/PriceTable';
import ContentTable from '@/components/ContentTable';
import GuideBookingCTA from '@/components/GuideBookingCTA';
import { getSupportingTrustGuides } from '@/data/repairTrustGuides';
import styles from './article.module.css';

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

// Dates are rendered in a fixed en-IN format so the static output stays
// identical regardless of where the build runs.
function formatDate(value) {
  if (!value) return '';
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `/blog/${article.slug}`,
      images: [article.image],
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);
  if (!article) notFound();

  const pageUrl = `${siteConfig.url}/blog/${article.slug}`;
  const supportingGuides = getSupportingTrustGuides(article);
  const ctaIntent = /cost|price/.test(article.slug) ? 'price' : article.slug === 'prepare-for-doorstep-tv-repair' ? 'visit' : 'symptom';
  const firstPriceSection = article.sections.findIndex((section) => section.priceTable);
  // The byline is a team, not an individual, so it is typed as an Organization.
  // Schema.org allows either for `author`; claiming Person for a group name is
  // the kind of mismatch that undermines E-E-A-T rather than supporting it.
  const authorSchema = {
    '@type': 'Organization',
    name: blogAuthor.name,
    url: `${siteConfig.url}${blogAuthor.profileUrl}`,
    ...(blogAuthor.linkedinUrl ? { sameAs: [blogAuthor.linkedinUrl] } : {}),
  };

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
              { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.h1,
            description: article.metaDescription,
            image: `${siteConfig.url}${article.image}`,
            url: pageUrl,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt || article.publishedAt,
            author: authorSchema,
            publisher: { '@id': entityIds.organization },
            mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
            inLanguage: 'en-IN',
            isPartOf: { '@id': entityIds.website },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]}
      />

      <section className="border-b border-[#eee] bg-white py-2">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: article.title, href: null },
            ]}
          />
        </div>
      </section>

      <section className={`${styles.hero} bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-12 md:py-24`}>
        <div className={`${styles.heroGrid} container grid items-center gap-8 lg:gap-10 lg:grid-cols-[0.9fr_1.1fr]`}>
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
              {article.category}
            </span>
            <h1 className={`mt-6 font-black leading-tight text-secondary ${article.trustGuide ? 'text-[clamp(2.2rem,4.2vw,3.5rem)]' : 'text-[clamp(2.7rem,5vw,4.6rem)]'}`}>{article.h1}</h1>
            <p className="mt-6 rounded-2xl border border-primary/10 bg-white p-5 text-lg font-bold leading-relaxed text-secondary shadow-oldMd">
              {article.directAnswer}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold text-textMuted">
              <span>
                By{' '}
                <Link href={blogAuthor.profileUrl} className="text-primary hover:text-secondary">
                  {blogAuthor.name}
                </Link>
              </span>
              <span aria-hidden="true">|</span>
              <span>{blogAuthor.role}</span>
              <span aria-hidden="true">|</span>
              <span>
                Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              {article.updatedAt && article.updatedAt !== article.publishedAt ? (
                <>
                  <span aria-hidden="true">|</span>
                  <span>
                    Last reviewed <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                  </span>
                </>
              ) : null}
            </div>
          </div>
          <figure className={styles.heroFigure}>
            <Image src={article.image} alt={article.imageAlt || `${article.h1} guide by GR Solution`} width={article.imageWidth || 1024} height={article.imageHeight || 1024} sizes="(min-width: 992px) 52vw, 100vw" className={`${styles.heroImage} rounded-2xl shadow-cardPro md:rounded-3xl`} priority />
          </figure>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="min-w-0 rounded-card border border-black/5 bg-white p-5 shadow-oldMd sm:p-8">
            <p className="text-lg leading-relaxed text-textMuted">{article.intro}</p>
            <GuideBookingCTA contentId={article.slug} intent={ctaIntent} placement="after_intro" />
            <div className="mt-10 grid gap-8">
              {article.sections.map((section, sectionIndex) => (
                <section key={section.heading}>
                  <h2 className="text-3xl font-black text-secondary">{section.heading}</h2>
                  {section.body ? (
                    <p className="mt-4 text-lg leading-relaxed text-textMuted">{section.body}</p>
                  ) : null}
                  {section.table ? <ContentTable table={section.table} /> : null}
                  {section.priceTable ? <PriceTable {...section.priceTable} /> : null}
                  {section.list?.length ? (
                    <ul className="mt-5 grid gap-3">
                      {section.list.map((item) => (
                        <li key={item} className="flex gap-3 text-lg leading-relaxed text-textMuted">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {section.closing ? (
                    <p className="mt-5 text-lg leading-relaxed text-textMuted">{section.closing}</p>
                  ) : null}
                  {section.links?.length ? (
                    <div className="mt-5 flex flex-wrap gap-4">
                      {section.links.map((link) => <Link key={link.href} href={link.href} className="font-bold text-primary underline decoration-primary/30 underline-offset-4">{link.label}</Link>)}
                    </div>
                  ) : null}
                  {sectionIndex === firstPriceSection ? <GuideBookingCTA contentId={article.slug} intent="price" placement="after_price_table" /> : null}
                </section>
              ))}
            </div>
            {article.sources?.length ? (
              <section className="mt-10 border-t border-black/10 pt-8" aria-label="Editorial sources">
                <h2 className="text-2xl font-black text-secondary">Sources and scope</h2>
                <p className="mt-3 leading-relaxed text-textMuted">Editorial guidance reviewed on 25 October 2026. Manufacturer instructions apply to the specified products; this guide does not claim manufacturer authorisation or document an actual repair case.</p>
                <ul className="mt-4 grid gap-4">
                  {article.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} className="font-bold text-primary underline decoration-primary/30 underline-offset-4">{source.label}</a>
                      <p className="mt-1 text-sm leading-relaxed text-textMuted">{source.note}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className="min-w-0 rounded-card border border-primary/10 bg-bgLight p-5 shadow-oldMd sm:p-8">
            <h2 className="text-2xl font-black text-secondary">Helpful Links</h2>
            <div className="mt-6 grid gap-3">
              {article.internalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-2xl border border-primary/10 bg-white p-4 font-black text-primary transition hover:-translate-y-1 hover:text-secondary">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-white p-5 text-sm leading-relaxed text-textMuted">
              Final cost depends on screen size, model, fault type, parts availability and whether repair is possible. GR Solution provides inspection-based guidance before work begins.
            </div>
            {supportingGuides.length ? (
              <nav aria-label="Related repair checklists" className="mt-8">
                <h2 className="text-xl font-black text-secondary">Before you approve a repair</h2>
                <div className="mt-4 grid gap-3">
                  {supportingGuides.map((guide) => (
                    <Link key={guide.slug} href={`/blog/${guide.slug}`} className="rounded-2xl border border-primary/10 bg-white p-4 font-bold leading-relaxed text-primary hover:text-secondary">{guide.title}</Link>
                  ))}
                </div>
              </nav>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FAQ</span>
            <h2 className="text-4xl font-black text-secondary">{article.title} FAQs</h2>
          </div>
          <div className="mx-auto max-w-[850px]">
            <FAQ faqs={article.faqs} />
          </div>
        </div>
      </section>

      <PageCTA
        title="Need TV Repair Guidance?"
        description="Call or WhatsApp GR Solution with your TV model, fault symptoms and location for inspection-based next steps."
        badge={article.trustGuide ? 'INSPECTION-BASED GUIDANCE' : undefined}
        benefits={article.trustGuide ? ['Independent repair provider', 'Estimate before paid work', 'Visit availability confirmed first'] : undefined}
      />
    </main>
  );
}
