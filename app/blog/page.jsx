import Image from 'next/image';
import Link from 'next/link';
import PageCTA from '@/components/PageCTA';
import JsonLd from '@/components/JsonLd';
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
      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">REPAIR INSIGHTS</span>
            <h1 className="mt-7 text-[clamp(3rem,5.5vw,5rem)] font-black leading-tight text-secondary">
              TV Repair Tips & Guides for <span className="text-primary">Delhi, Noida & NCR Residents</span>
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-textMain">Maintenance tips, display technology explainers and repair guidance from GR Solution.</p>
          </div>
          <Image src="/images/hero.webp" alt="GR Solution TV repair guide for Delhi NCR residents" width={650} height={460} className="w-full rounded-3xl object-cover shadow-cardPro" />
        </div>
      </section>
      <section className="py-24">
        <div className="container">
          <article className="mb-12 grid overflow-hidden rounded-card border border-black/5 bg-white p-0 shadow-cardPro lg:grid-cols-[1.2fr_1fr]">
            <Image src="/images/hero.webp" alt="OLED and QLED TV repair diagnosis guide by GR Solution" width={760} height={420} className="h-full min-h-[360px] w-full object-cover" />
            <div className="p-10">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FEATURED</span>
              <h2 className="mt-5 text-3xl font-black leading-tight text-secondary">OLED/QLED Television Repair Needs Careful Diagnosis</h2>
              <p className="mt-4 text-lg leading-relaxed text-textMuted">
                Premium display technology gives better brightness and contrast, but it also needs accurate diagnosis
                when symptoms appear. GR Solution helps customers understand repair feasibility before major decisions.
              </p>
              <Link href="/services/oled-qled-tv-repair" className="mt-6 inline-flex rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary">
                Ask A Technician
              </Link>
            </div>
          </article>
          <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article className="flex min-h-[590px] flex-col overflow-hidden rounded-card border border-black/5 bg-white p-0 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg" key={post.title}>
                <Image src={post.image} alt={`${post.title} by GR Solution`} width={520} height={320} className="h-[290px] w-full object-cover" />
                <div className="flex flex-1 flex-col gap-4 p-10">
                  <span className="inline-flex self-start rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">{post.category}</span>
                  <h3 className="text-2xl font-black leading-tight text-secondary">{post.title}</h3>
                  <p className="text-lg leading-relaxed text-textMuted">{post.text}</p>
                  <Link href={post.link} className="mt-auto font-black text-primary hover:text-secondary">
                    Read More <span aria-hidden="true">-&gt;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PageCTA title="Need Help With Your TV Repair Issue?" />
    </main>
  );
}
