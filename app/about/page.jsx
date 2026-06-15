import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export const metadata = {
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  alternates: { canonical: '/about' },
  openGraph: { title: pageMetadata.about.title, description: pageMetadata.about.description, url: '/about' },
};

const coreValues = [
  {
    icon: 'fa-solid fa-microchip',
    title: 'Technical Mastery',
    text: 'Expert repair knowledge backed by advanced diagnostic tools and hands-on technical experience.',
  },
  {
    icon: 'fa-solid fa-hand-holding-dollar',
    title: 'Honest Pricing',
    text: 'Clear diagnosis, transparent estimates and no hidden repair charges before work begins.',
  },
  {
    icon: 'fa-solid fa-certificate',
    title: 'Certified Excellence',
    text: 'Skilled technicians handling LED, OLED, QLED and Smart TV repair with professional care.',
  },
  {
    icon: 'fa-solid fa-headset',
    title: 'Priority Support',
    text: 'Fast communication, doorstep assistance and reliable support across Delhi, Noida and NCR.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'About Us', item: `${siteConfig.url}/about` },
          ],
        }}
      />
      <section className="section page-hero-next">
        <div className="container grid-2-alt">
          <div>
            <span className="badge">ABOUT GR SOLUTION</span>
            <h1>
              Excellence In <span className="primary-text">TV Repair Service</span>
            </h1>
            <p>
              GR Solution focuses on dependable LED, OLED, QLED and Smart TV repair support for families and businesses
              across Delhi, Noida and NCR.
            </p>
            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="stat-value">15+</span>
                <span className="text-muted">Years Experience</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-value">25k+</span>
                <span className="text-muted">Customers Served</span>
              </div>
            </div>
          </div>
          <Image src="/images/team.png" alt="GR Solution repair team" width={650} height={480} className="card-img-rounded" />
        </div>
      </section>
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge mb-3">OUR VALUES</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="grid-4">
            {coreValues.map((value) => (
              <article className="card core-value-card" key={value.title}>
                <div className="core-value-icon">
                  <i className={value.icon} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
