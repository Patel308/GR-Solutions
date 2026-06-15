import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection({ eyebrow, title, highlight, description, image = '/images/hero.png', ctaHref = '/contact', ctaLabel = 'Get Free Quote' }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="badge-group">
            {eyebrow ? <span className="badge">{eyebrow}</span> : null}
            <span className="badge"><i className="fa-solid fa-star" /> 4.9/5 Rating</span>
          </div>
          <h1>
            {title} <br />
            {highlight ? <span className="primary-text">{highlight}</span> : null}
          </h1>
          <p>{description}</p>
          <div className="hero-ctas">
            <Link href={ctaHref} className="btn btn-primary">
              {ctaLabel}
            </Link>
            <Link href="/services" className="btn btn-outline">
              Explore Services
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="stat-value">Same-Day</span>
              <span className="text-muted">Quick Repair</span>
            </div>
            <div className="hero-stat-item">
              <span className="stat-value">90-Day</span>
              <span className="text-muted">Warranty</span>
            </div>
            <div className="hero-stat-item">
              <span className="stat-value">Free</span>
              <span className="text-muted">Diagnostic</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <Image src={image} alt={`${title} ${highlight || ''}`} width={720} height={560} priority />
          <div className="hero-image-badge">
            <p>
              <i className="fa-solid fa-shield-halved" /> Certified Techs Only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
