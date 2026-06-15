import Image from 'next/image';
import Link from 'next/link';
import { mainNavigation } from '@/data/navigation';
import { services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';

const footerServices = services.filter(
  (s) => !['laptop-repair', 'mobile-repair'].includes(s.slug)
);

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" className="logo" style={{ marginBottom: '1.5rem' }}>
              <Image
                src="/images/logo.jpg"
                alt="GR Solution Logo - Premium TV Repair Provider in Delhi, Noida & NCR"
                width={150}
                height={40}
                style={{ height: '40px', width: 'auto' }}
              />
            </Link>
            <p className="footer-brand-text">
              Delhi, Noida & NCR&apos;s #1 premium TV repair service provider with 15+ years of technical
              excellence and transparent pricing.
            </p>
            <div className="social-links">
              <a
                href="https://facebook.com"
                className="social-btn facebook"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a
                href="https://instagram.com"
                className="social-btn instagram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                href={siteConfig.whatsappHref}
                className="social-btn whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp" />
              </a>
              <a
                href="https://youtube.com"
                className="social-btn youtube"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fa-brands fa-youtube" />
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
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Services</h4>
            <ul className="footer-links">
              {footerServices.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading-underline">Contact Us</h4>
            <ul className="contact-info" style={{ marginTop: '1.5rem' }}>
              <li>
                <i className="fa-solid fa-location-dot" />
                <div className="info-text">
                  <strong style={{ color: 'white', display: 'block', marginBottom: '3px' }}>
                    Visit Center
                  </strong>
                  <span>
                    {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}{' '}
                    {siteConfig.address.postalCode}
                  </span>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-phone" />
                <div className="info-text">
                  <strong style={{ color: 'white', display: 'block', marginBottom: '3px' }}>
                    Call Support
                  </strong>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-envelope" />
                <div className="info-text">
                  <strong style={{ color: 'white', display: 'block', marginBottom: '3px' }}>
                    Email Us
                  </strong>
                  <a href={siteConfig.emailHref}>{siteConfig.email}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 GR Solution. All Rights Reserved.</p>
          <p>Mon - Sun: 09:30 AM - 07:30 PM</p>
          <div className="footer-bottom-links-row">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
