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

      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">
              {article.category}
            </span>
            <h1 className="mt-6 text-[clamp(2.7rem,5vw,4.6rem)] font-black leading-tight text-secondary">{article.h1}</h1>
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
          <Image src={article.image} alt={`${article.h1} guide by GR Solution`} width={680} height={500} className="h-[min(520px,52vw)] min-h-[340px] w-full rounded-3xl object-cover shadow-cardPro" priority />
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-card border border-black/5 bg-white p-8 shadow-oldMd">
            <p className="text-lg leading-relaxed text-textMuted">{article.intro}</p>
            <div className="mt-10 grid gap-8">
              {article.sections.map((section) => (
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
                </section>
              ))}
            </div>
          </article>

          <aside className="rounded-card border border-primary/10 bg-bgLight p-8 shadow-oldMd">
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
      />
    </main>
  );
}
