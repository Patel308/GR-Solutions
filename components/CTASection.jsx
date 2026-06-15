import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';

export default function CTASection({ title = 'Need expert repair support?', text = 'Call GR Solution for fast doorstep service across Delhi, Noida and NCR.' }) {
  return (
    <section className="section cta-section-next">
      <div className="container grid-2-alt">
        <div>
          <span className="badge">FAST SUPPORT</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="btn-group">
          <a href={siteConfig.phoneHref} className="btn btn-primary btn-lg">
            <i className="fa-solid fa-phone" /> Call Now
          </a>
          <Link href="/contact" className="btn btn-outline btn-lg">
            Book Service
          </Link>
        </div>
      </div>
    </section>
  );
}
