import Image from 'next/image';
import Link from 'next/link';
import { mainNavigation } from '@/data/navigation';
import { services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';

export default function Footer() {
  return (
    <footer className="site-footer-pro">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand-pro">
            <Link href="/" className="footer-logo-card" aria-label="GR Solution home">
              <Image src="/images/logo.jpg" alt="GR Solution" width={150} height={82} className="footer-logo" />
            </Link>
            <p>
              Delhi, Noida & NCR&apos;s #1 premium TV repair service provider with 15+ years of technical excellence and
              transparent pricing.
            </p>
            <div className="social-links">
              <a href={siteConfig.googleBusinessProfile} className="social-btn" target="_blank" aria-label="Google Business Profile">
                <i className="fa-brands fa-google" />
              </a>
              <a href={siteConfig.whatsappHref} className="social-btn" target="_blank" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" />
              </a>
              <a href={siteConfig.phoneHref} className="social-btn" aria-label="Call GR Solution">
                <i className="fa-solid fa-phone" />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul className="footer-links">
              {services.slice(0, 8).map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col footer-contact-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="footer-contact-icon"><i className="fa-solid fa-location-dot" /></span>
                <div>
                  <strong>Visit Center</strong>
                  <a href={siteConfig.googleBusinessProfile} target="_blank">
                    {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}
                  </a>
                </div>
              </li>
              <li>
                <span className="footer-contact-icon"><i className="fa-solid fa-phone" /></span>
                <div>
                  <strong>Call Support</strong>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                </div>
              </li>
              <li>
                <span className="footer-contact-icon"><i className="fa-solid fa-envelope" /></span>
                <div>
                  <strong>Email Us</strong>
                  <a href={siteConfig.emailHref}>{siteConfig.email}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 GR Solution. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
