import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import PageCTA from '@/components/PageCTA';
import JsonLd from '@/components/JsonLd';
import { formatDate, readingMinutes } from '@/components/blog/articleMeta';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';
import { blogArticles } from '@/data/blogArticles';

export const metadata = {
  title: pageMetadata.blog.title,
  description: pageMetadata.blog.description,
  alternates: { canonical: '/blog' },
  openGraph: { title: pageMetadata.blog.title, description: pageMetadata.blog.description, url: '/blog' },
};

const posts = [
  ...blogArticles.map((article) => ({
    category: article.category,
    title: article.title,
    text: article.metaDescription,
    image: article.image,
    link: `/blog/${article.slug}`,
    publishedAt: article.publishedAt,
    minutes: readingMinutes(article),
  })),
  {
    category: 'LED TV',
    title: 'Why LED TVs Lose Picture But Keep Sound',
    text: 'Learn why backlight, T-Con, power and panel faults can create a black screen while audio still works.',
    image: '/images/service_tv.webp',
    link: '/services/led-tv-repair',
  },
  {
    category: 'OLED/QLED',
    title: 'OLED and QLED Display Symptoms Explained',
    text: 'Understand burn-in-like marks, color shifts, brightness problems and when premium TV diagnosis matters.',
    image: '/images/service_oled.webp',
    link: '/services/oled-qled-tv-repair',
  },
  {
    category: 'LCD TV',
    title: 'Is LCD TV Repair Still Worth It?',
    text: 'A practical guide to age, part availability, display faults and repair-versus-replace decisions.',
    image: '/images/service_tv.webp',
    link: '/services/lcd-tv-repair',
  },
  {
    category: 'PLASMA TV',
    title: 'Common Plasma TV Power and Heating Issues',
    text: 'Older plasma TVs need realistic inspection for power boards, sustain boards, heating and shutdown symptoms.',
    image: '/images/hero.webp',
    link: '/services/plasma-tv-repair',
  },
  {
    category: 'CURVED TV',
    title: 'Curved TV Handling and Screen Care Tips',
    text: 'Curved screens need careful movement, mounting and inspection to avoid panel stress and display distortion.',
    image: '/images/service_oled.webp',
    link: '/services/curved-tv-repair',
  },
  {
    category: 'LOCAL REPAIR',
    title: 'How To Prepare Before A TV Technician Visit',
    text: 'Simple checks for power, inputs, symptoms and model details before booking doorstep TV repair.',
    image: '/images/hero.webp',
    link: '/services/led-tv-repair-delhi',
  },
];

// The hero photo is the first screen's largest element from 640px up, so it is
// preloaded at high priority there. Phones skip it: the featured card right
// below shows the same photo, and without it the heading and summary are the
// largest things on a phone's first screen (they paint as soon as the CSS
// arrives, like the old page's heading did). The "1px" slot makes a phone
// fetch only the 16px rendition of the hidden photo.
const BLOG_HERO_SIZES = '(min-width: 992px) 540px, (min-width: 640px) 576px, 1px';

function BlogHeroImage() {
  const alt = 'GR Solution TV repair guide for Delhi NCR residents';
  const { props } = getImageProps({ src: '/images/hero.webp', alt, width: 650, height: 460, sizes: BLOG_HERO_SIZES, loading: 'eager' });
  return (
    <>
      <link
        rel="preload"
        as="image"
        imageSrcSet={props.srcSet}
        imageSizes={props.sizes}
        fetchPriority="high"
        media="(min-width: 640px)"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        alt={alt}
        fetchPriority="low"
        className="aspect-[650/460] w-full rounded-[1.25rem] object-cover shadow-card-hover ring-1 ring-black/5"
      />
    </>
  );
}

export default function BlogPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
          ],
        }}
      />
      <section className="hero-surface border-b border-line" data-section="blog_hero">
        <div className="container grid items-center gap-8 pb-10 pt-8 sm:pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pb-16 lg:pt-14">
          <div>
            <span className="eyebrow">REPAIR INSIGHTS</span>
            <h1 className="mt-3 max-w-[18ch]">
              TV Repair Tips & Guides for <span className="heading-accent">Delhi, Noida & NCR Residents</span>
            </h1>
            <p className="lead mt-4 max-w-2xl">Maintenance tips, display technology explainers and repair guidance from GR Solution.</p>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[36rem] sm:block lg:max-w-none">
            <BlogHeroImage />
          </div>
        </div>
      </section>

      <section className="section band" data-section="blog_posts">
        <div className="container">
          {/* Phones: text first, photo last, so the first screen stays text. */}
          <article className="card mb-10 grid overflow-hidden lg:mb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="relative order-last aspect-[760/420] bg-navy-50 sm:order-none lg:aspect-auto lg:min-h-[22rem]">
              <Image
                src="/images/hero.webp"
                alt="OLED and QLED TV repair diagnosis guide by GR Solution"
                width={760}
                height={420}
                sizes="(min-width: 992px) 660px, calc(100vw - 2rem)"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="badge self-start uppercase tracking-[0.06em]">FEATURED</span>
              <h2 className="heading-panel mt-4 sm:text-[1.875rem]">OLED/QLED Television Repair Needs Careful Diagnosis</h2>
              <p className="mt-3 leading-relaxed text-muted">
                Premium display technology gives better brightness and contrast, but it also needs accurate diagnosis
                when symptoms appear. GR Solution helps customers understand repair feasibility before major decisions.
              </p>
              <Link href="/services/oled-qled-tv-repair" className="btn btn-primary mt-6 self-start" data-cta="blog_featured">
                Ask A Technician
              </Link>
            </div>
          </article>

          <div className="grid items-stretch gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {posts.map((post) => (
              // Phones: a compact row with a thumbnail beside the title. From
              // 640px: a vertical card with the photo on top. Same HTML order.
              <article
                className="card card-interactive group relative grid grid-cols-[minmax(0,1fr)_5.5rem] items-start gap-x-4 overflow-hidden p-4 sm:flex sm:flex-col sm:p-0"
                key={post.title}
              >
                <div className="col-start-2 row-span-2 row-start-1 overflow-hidden rounded-xl bg-navy-50 sm:w-full sm:rounded-none">
                  <Image
                    src={post.image}
                    alt={`${post.title} by GR Solution`}
                    width={520}
                    height={320}
                    sizes="(min-width: 1280px) 400px, (min-width: 992px) 30vw, (min-width: 768px) 46vw, (min-width: 640px) calc(100vw - 3rem), 88px"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:aspect-[520/320]"
                  />
                </div>
                <div className="col-start-1 row-start-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:px-6 sm:pt-6">
                  <span className="badge uppercase tracking-[0.06em]">{post.category}</span>
                  {post.publishedAt ? (
                    <span className="text-small text-muted">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'short')}</time> · {post.minutes} min read
                    </span>
                  ) : (
                    <span className="text-small text-muted">Service guide</span>
                  )}
                </div>
                <h3 className="col-start-1 row-start-2 mt-2 text-[1.0625rem] leading-snug transition-colors group-hover:text-navy-700 sm:mt-3 sm:px-6 sm:text-lg">
                  {post.title}
                </h3>
                <p className="col-span-2 mt-2 text-[0.9375rem] leading-relaxed text-muted sm:flex-1 sm:px-6">{post.text}</p>
                <Link
                  href={post.link}
                  className="link-arrow col-span-2 mt-1 self-start after:absolute after:inset-0 after:content-[''] sm:mx-6 sm:mb-3"
                >
                  Read More <span aria-hidden="true" className="sr-only">-&gt;</span>
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PageCTA title="Need Help With Your TV Repair Issue?" />
    </main>
  );
}
