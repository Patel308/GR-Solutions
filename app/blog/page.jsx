import Image from 'next/image';
import Link from 'next/link';
import PageCTA from '@/components/PageCTA';
import { pageMetadata } from '@/data/pages';

export const metadata = {
  title: pageMetadata.blog.title,
  description: pageMetadata.blog.description,
  alternates: { canonical: '/blog' },
  openGraph: { title: pageMetadata.blog.title, description: pageMetadata.blog.description, url: '/blog' },
};

const posts = [
  {
    category: 'SMARTPHONE',
    title: 'How to Spot Fake Mobile Screens',
    text: "Don't get scammed. Learn the differences between OEM and duplicate displays before choosing a repair.",
    image: '/images/service_mobile.webp',
    link: '/services/mobile-repair',
  },
  {
    category: 'TV PANEL',
    title: 'Fixing Vertical Lines Without Replacing Screen',
    text: 'Discover COF bonding technology that can save repair cost when the panel condition allows recovery.',
    image: '/images/service_panel.webp',
    link: '/services/panel-bonding',
  },
  {
    category: 'OLED CARE',
    title: 'Preventing OLED Burn-In: 5 Golden Rules',
    text: 'Protect your high-end display with simple picture settings, viewing habits and maintenance steps.',
    image: '/images/service_oled.webp',
    link: '/services/oled-qled-repair',
  },
  {
    category: 'MINI-LED',
    title: 'The Future of Mini-LED & QLED Television Repair',
    text: 'A practical look at modern display technology, symptoms to watch for and when diagnosis matters.',
    image: '/images/hero.webp',
    link: '/services/oled-qled-repair',
  },
  {
    category: 'SMART TV',
    title: 'Smart TV Setup Tips For Better Streaming',
    text: 'Network, app and picture setting tips that help your Smart TV run smoother every day.',
    image: '/images/service_tv.webp',
    link: '/services/smart-tv-setup',
  },
  {
    category: 'DTH SIGNAL',
    title: 'DTH No Signal: Common Causes',
    text: 'Dish alignment, LNB, cable and weather-related checks before booking a service visit.',
    image: '/images/service_dth.webp',
    link: '/services/dth-services',
  },
];

export default function BlogPage() {
  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">REPAIR INSIGHTS</span>
            <h1 className="mt-7 text-[clamp(3rem,5.5vw,5rem)] font-black leading-tight text-secondary">
              Expert TV Care & <span className="text-primary">Technical Guides</span>
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-textMain">Maintenance tips, display technology explainers and repair guidance from GR Solution.</p>
          </div>
          <Image src="/images/hero.webp" alt="TV repair insights" width={650} height={460} className="w-full rounded-3xl object-cover shadow-cardPro" />
        </div>
      </section>
      <section className="py-24">
        <div className="container">
          <article className="mb-12 grid overflow-hidden rounded-card border border-black/5 bg-white p-0 shadow-cardPro lg:grid-cols-[1.2fr_1fr]">
            <Image src="/images/hero.webp" alt="Featured Mini LED and QLED repair article" width={760} height={420} className="h-full min-h-[360px] w-full object-cover" />
            <div className="p-10">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">FEATURED</span>
              <h2 className="mt-5 text-3xl font-black leading-tight text-secondary">The Future of Mini-LED & QLED Television Repair</h2>
              <p className="mt-4 text-lg leading-relaxed text-textMuted">
                Premium display technology gives better brightness and contrast, but it also needs accurate diagnosis
                when symptoms appear. GR Solution helps customers understand repair feasibility before major decisions.
              </p>
              <Link href="/services/oled-qled-repair" className="mt-6 inline-flex rounded-full bg-primary px-7 py-4 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary">
                Ask A Technician
              </Link>
            </div>
          </article>
          <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article className="flex min-h-[590px] flex-col overflow-hidden rounded-card border border-black/5 bg-white p-0 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg" key={post.title}>
                <Image src={post.image} alt={post.title} width={520} height={320} className="h-[290px] w-full object-cover" />
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
