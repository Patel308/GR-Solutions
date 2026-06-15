import Image from 'next/image';
import CTASection from '@/components/CTASection';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export const metadata = {
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  alternates: { canonical: '/about' },
  openGraph: { title: pageMetadata.about.title, description: pageMetadata.about.description, url: '/about' },
};

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
      <section className="section">
        <div className="container">
          <div className="section-title section-centered-title">
            <span className="badge">OUR VALUES</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="grid-3">
            {[
              ['Technical Precision', 'Careful diagnostics before repair decisions.'],
              ['Transparent Service', 'Clear guidance on fault, estimate and feasibility.'],
              ['Doorstep Convenience', 'Local technician support across Delhi, Noida and NCR.'],
              ['Customer Trust', 'Service built around communication and practical solutions.'],
              ['Modern Skills', 'Repair knowledge for LED, OLED, QLED and Smart TV systems.'],
              ['Responsible Repair', 'Honest advice when replacement is better than repair.'],
            ].map(([title, text]) => (
              <article className="card" key={title}>
                <i className="fa-solid fa-circle-check card-icon" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Talk to a repair expert today" />
    </main>
  );
}
