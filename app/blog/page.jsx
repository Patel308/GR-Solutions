import Image from 'next/image';
import Link from 'next/link';
import CTASection from '@/components/CTASection';
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
    image: '/images/service_mobile.png',
  },
  {
    category: 'TV PANEL',
    title: 'Fixing Vertical Lines Without Replacing Screen',
    text: 'Discover COF bonding technology that can save repair cost when the panel condition allows recovery.',
    image: '/images/service_panel.png',
  },
  {
    category: 'OLED CARE',
    title: 'Preventing OLED Burn-In: 5 Golden Rules',
    text: 'Protect your high-end display with simple picture settings, viewing habits and maintenance steps.',
    image: '/images/service_oled.png',
  },
  {
    category: 'MINI-LED',
    title: 'The Future of Mini-LED & QLED Television Repair',
    text: 'A practical look at modern display technology, symptoms to watch for and when diagnosis matters.',
    image: '/images/hero.png',
  },
  {
    category: 'SMART TV',
    title: 'Smart TV Setup Tips For Better Streaming',
    text: 'Network, app and picture setting tips that help your Smart TV run smoother every day.',
    image: '/images/service_tv.png',
  },
  {
    category: 'DTH SIGNAL',
    title: 'DTH No Signal: Common Causes',
    text: 'Dish alignment, LNB, cable and weather-related checks before booking a service visit.',
    image: '/images/service_dth.png',
  },
];

export default function BlogPage() {
  return (
    <main>
      <section className="section page-hero-next">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">REPAIR INSIGHTS</span>
            <h1>
              Expert TV Care & <span className="primary-text">Technical Guides</span>
            </h1>
            <p>Maintenance tips, display technology explainers and repair guidance from GR Solution.</p>
          </div>
          <Image src="/images/hero.png" alt="TV repair insights" width={650} height={460} className="card-img-rounded" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <article className="card featured-post-next">
            <Image src="/images/hero.png" alt="Featured Mini LED and QLED repair article" width={760} height={420} />
            <div className="card-content">
              <span className="badge">FEATURED</span>
              <h2>The Future of Mini-LED & QLED Television Repair</h2>
              <p>
                Premium display technology gives better brightness and contrast, but it also needs accurate diagnosis
                when symptoms appear. GR Solution helps customers understand repair feasibility before major decisions.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Ask A Technician
              </Link>
            </div>
          </article>
          <div className="grid-3 blog-grid-next">
            {posts.map((post) => (
              <article className="card blog-card-next" key={post.title}>
                <Image src={post.image} alt={post.title} width={520} height={320} />
                <div className="card-content">
                  <span className="badge">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.text}</p>
                  <Link href="/contact" className="read-more-next">
                    Read More <span aria-hidden="true">-&gt;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Need a repair instead of a guide?" />
    </main>
  );
}
