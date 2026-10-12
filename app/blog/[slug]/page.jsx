import { notFound } from 'next/navigation';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import FAQ from '@/components/FAQ';
import SectionCTA from '@/components/SectionCTA';
import PageHero from '@/components/page/PageHero';
import SectionHead from '@/components/page/SectionHead';
import LinkTiles from '@/components/page/LinkTiles';
import { TocDetails, TocNav, headingId } from '@/components/blog/ArticleToc';
import TocSpy from '@/components/blog/TocSpy';
import { formatDate, relatedArticles } from '@/components/blog/articleMeta';
import { blogArticles, blogAuthor, getBlogArticleBySlug } from '@/data/blogArticles';
import { siteConfig, entityIds } from '@/data/siteConfig';
import PriceTable from '@/components/PriceTable';
import ContentTable from '@/components/ContentTable';

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
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
  // The byline is a team, not an individual, so it is typed as an Organization.
  // Schema.org allows either for `author`; claiming Person for a group name is
  // the kind of mismatch that undermines E-E-A-T rather than supporting it.
  const authorSchema = {
    '@type': 'Organization',
    name: blogAuthor.name,
    url: `${siteConfig.url}${blogAuthor.profileUrl}`,
    ...(blogAuthor.linkedinUrl ? { sameAs: [blogAuthor.linkedinUrl] } : {}),
  };

  // Fragment ids for the existing H2s, used by the "On this page" list.
  const usedIds = new Set();
  const sections = article.sections.map((section) => ({ ...section, id: headingId(section.heading, usedIds) }));
  const toc = sections.map((section) => ({ id: section.id, label: section.heading }));

  // One call-to-action inside the article: straight after the price table on
  // cost and symptom guides, otherwise halfway through.
  const priceIndex = sections.findIndex((section) => section.priceTable);
  const ctaAfter = priceIndex >= 0 ? priceIndex : Math.max(0, Math.ceil(sections.length / 2) - 1);
  const related = relatedArticles(article, blogArticles, 3);

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

      <PageHero
        section="article_hero"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: article.title, href: null },
        ]}
        eyebrow={article.category}
        title={article.h1}
        answer={article.directAnswer}
        image={{ src: article.image, alt: `${article.h1} guide by GR Solution` }}
      >
        {/* Author and dates. The "|" separators are kept in the HTML for
            the byline text; the layout replaces them visually. */}
        <div className="mt-6 flex flex-col gap-3 text-small sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3">
            <span className="icon-tile size-10 bg-white text-navy-600 shadow-xs ring-1 ring-navy-100" aria-hidden="true">
              <i className="fa-solid fa-pen-nib" />
            </span>
            <span className="leading-snug">
              <span className="block font-semibold text-ink">
                By{' '}
                <Link href={blogAuthor.profileUrl} className="text-navy-600 underline-offset-4 hover:text-navy-800 hover:underline">
                  {blogAuthor.name}
                </Link>
              </span>
              <span aria-hidden="true" className="hidden">|</span>
              <span className="block text-muted">{blogAuthor.role}</span>
            </span>
          </div>
          <span aria-hidden="true" className="hidden">|</span>
          <div className="grid gap-1 font-semibold text-muted sm:border-l sm:border-line sm:pl-6">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-calendar-check w-4 text-center text-teal-600" aria-hidden="true" />
              <span>
                Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
            </span>
            {article.updatedAt && article.updatedAt !== article.publishedAt ? (
              <>
                <span aria-hidden="true" className="hidden">|</span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-check w-4 text-center text-teal-600" aria-hidden="true" />
                  <span>
                    Last reviewed <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                  </span>
                </span>
              </>
            ) : null}
          </div>
        </div>
      </PageHero>

      <section className="section band" data-section="article_body">
        <div className="container grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-16">
          <div className="min-w-0">
            <TocDetails items={toc} className="mb-8 xl:hidden" />
            <article className="prose-article">
              <p className="text-[1.125rem] leading-relaxed text-ink sm:text-[1.1875rem]">{article.intro}</p>
              <div className="mt-10 grid gap-10">
                {sections.map((section, index) => (
                  <div key={section.heading} className="min-w-0">
                    <section>
                      <h2 id={section.id} className="heading-panel">{section.heading}</h2>
                      {section.body ? <p className="mt-4">{section.body}</p> : null}
                      {section.table ? <ContentTable table={section.table} /> : null}
                      {section.priceTable ? <PriceTable {...section.priceTable} /> : null}
                      {section.list?.length ? (
                        <ul className="mt-5 grid gap-3">
                          {section.list.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {section.closing ? <p className="mt-5">{section.closing}</p> : null}
                    </section>
                    {index === ctaAfter ? (
                      priceIndex >= 0 ? (
                        <SectionCTA
                          section="article_cta"
                          withContainer={false}
                          className="mt-8 py-0 sm:py-0"
                          title="Want a firm figure for your TV?"
                          text="Book a doorstep diagnosis and approve the price before any paid work."
                        />
                      ) : (
                        <SectionCTA section="article_cta" withContainer={false} className="mt-8 py-0 sm:py-0" />
                      )
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="min-w-0">
            <aside className="card p-5 sm:p-6">
              <h2 className="heading-panel">Helpful Links</h2>
              <LinkTiles className="mt-4" links={article.internalLinks} />
              <p className="mt-5 rounded-xl bg-surface p-4 text-small leading-relaxed text-muted">
                Final cost depends on screen size, model, fault type, parts availability and whether repair is possible. GR Solution provides inspection-based guidance before work begins.
              </p>
            </aside>
            <TocNav items={toc} className="sticky top-28 mt-8 hidden xl:block" />
            <TocSpy ids={toc.map((item) => item.id)} />
          </div>
        </div>
      </section>

      {related.length ? (
        <section aria-labelledby="related-guides-label" className="section-tight band-tint" data-section="related_guides">
          <div className="container">
            <p id="related-guides-label" className="eyebrow">Related guides</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3 lg:gap-5">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="card card-interactive group flex flex-col p-5 sm:p-6"
                >
                  <span className="badge self-start uppercase tracking-[0.06em]">{item.category}</span>
                  <span className="mt-3 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-navy-700">
                    {item.title}
                  </span>
                  <span className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted">{item.metaDescription}</span>
                  <span className="mt-4 font-semibold text-navy-600">Read the guide &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section band" data-section="faq">
        <div className="container">
          <SectionHead eyebrow="FAQ" title={`${article.title} FAQs`} />
          <div className="mx-auto max-w-3xl">
            <FAQ faqs={article.faqs} name="article-faq" />
          </div>
        </div>
      </section>

      <PageCTA
        title="Need TV Repair Guidance?"
        description="Call or WhatsApp GR Solution with your TV model, fault symptoms and location for inspection-based next steps."
      />
    </main>
  );
}
