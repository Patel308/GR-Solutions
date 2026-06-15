import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';

export default function PageCTA({ badge = 'FAST LOCAL SUPPORT', title, description, serviceName }) {
  const ctaTitle = title || (serviceName ? `Need Expert ${serviceName} in Delhi NCR?` : 'Need Repair Support?');
  const ctaDescription =
    description ||
    'Call GR Solution for quick doorstep diagnosis, transparent pricing and trusted repair support across Delhi, Noida and NCR.';

  return (
    <section className="page-cta-section">
      <div className="container">
        <div className="page-cta-card">
          <span className="page-cta-badge">{badge}</span>
          <h2 className="page-cta-title">{ctaTitle}</h2>
          <p className="page-cta-text">{ctaDescription}</p>
          <div className="page-cta-trust-notes">
            <span><i className="fa-solid fa-circle-check" /> Same-day visit available</span>
            <span><i className="fa-solid fa-circle-check" /> Transparent estimate</span>
            <span><i className="fa-solid fa-circle-check" /> Delhi NCR doorstep support</span>
          </div>
          <div className="page-cta-actions">
            <a href={siteConfig.phoneHref} className="page-cta-btn page-cta-btn-primary">
              <i className="fa-solid fa-phone" /> Call Now
            </a>
            <a
              href={siteConfig.whatsappHref}
              className="page-cta-btn page-cta-btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp" /> WhatsApp Us
            </a>
            <Link href="/contact" className="page-cta-btn page-cta-btn-outline">
              Book Service
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
