import Image from 'next/image';
import Link from 'next/link';
import { mainNavigation } from '@/data/navigation';
import { services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';

const footerServices = services;

const footerExtraLinks = [
  { label: 'Repair Prices', href: '/pricing' },
  { label: 'Customer Reviews', href: '/reviews' },
];

// Sitewide links for the highest-intent local pages. Without these, the 25 local
// and 40 brand pages receive no sitewide link equity and the near-me page sits
// on just two inbound links.
const footerLocations = [
  { label: 'TV Repair Near Me', href: '/services/tv-repair-near-me' },
  { label: 'TV Repair in Delhi', href: '/services/tv-repair-delhi' },
  { label: 'TV Repair in Noida', href: '/services/tv-repair-noida' },
  { label: 'TV Repair in Greater Noida', href: '/services/tv-repair-greater-noida' },
  { label: 'TV Repair in Ghaziabad', href: '/services/tv-repair-ghaziabad' },
  { label: 'TV Repair by Brand', href: '/services/brands' },
];

const columnTitle = 'mb-3 font-display text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-teal-300';
const footerLink =
  'inline-flex min-h-[3rem] min-w-12 items-center text-[0.9375rem] text-[#C7D2E3] transition hover:text-white lg:min-h-[2.25rem]';

export default function Footer() {
  return (
    <footer className="surface-dark pb-[calc(var(--sticky-bar-h)+env(safe-area-inset-bottom)+1.5rem)] pt-14 sm:pt-16 md:pb-8" data-section="footer">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
          <div className="max-w-md">
            <Link href="/" className="inline-flex rounded-xl bg-white px-4 py-2.5 shadow-xs">
              <Image
                src="/images/logo.jpg"
                alt="GR Solution Logo - Premium TV Repair Provider in Delhi, Noida & NCR"
                width={150}
                height={81}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 leading-relaxed text-[#C7D2E3]">
              Delhi, Noida & NCR&apos;s #1 premium TV repair service provider with 15+ years of technical
              excellence and transparent pricing.
            </p>

            <div className="mt-8">
              <h4 className={columnTitle}>Contact Us</h4>
              <ul className="grid gap-4">
                <li className="flex items-start gap-3">
                  <span className="icon-tile size-10 bg-white/10 text-teal-300" aria-hidden="true">
                    <i className="fa-solid fa-location-dot" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block text-white">Visit Center</strong>
                    <span className="leading-relaxed text-[#C7D2E3]">
                      {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}{' '}
                      {siteConfig.address.postalCode}
                    </span>
                    {siteConfig.googleBusinessProfile ? (
                      <a
                        href={siteConfig.googleBusinessProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex min-h-12 items-center gap-2 font-semibold text-teal-300 hover:text-white"
                        data-cta="footer_map"
                      >
                        <i className="fa-solid fa-map-location-dot" aria-hidden="true" /> Open in Google Maps
                      </a>
                    ) : null}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="icon-tile size-10 bg-white/10 text-teal-300" aria-hidden="true">
                    <i className="fa-solid fa-phone" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block text-white">Call Support</strong>
                    <PhoneLink callLocation="footer_call_support" className="inline-flex min-h-12 items-center text-[#C7D2E3] hover:text-white" />
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="icon-tile size-10 bg-white/10 text-teal-300" aria-hidden="true">
                    <i className="fa-solid fa-envelope" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block text-white">Email Us</strong>
                    <a href={siteConfig.emailHref} className="inline-flex min-h-12 items-center text-[#C7D2E3] hover:text-white">{siteConfig.email}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="icon-tile size-10 bg-white/10 text-teal-300" aria-hidden="true">
                    <i className="fa-solid fa-clock" />
                  </span>
                  <div className="min-w-0 pt-2">
                    <p className="text-[#C7D2E3]">Mon - Sun: 09:00 AM - 09:00 PM</p>
                  </div>
                </li>
              </ul>
              <WhatsAppLink
                className="btn btn-whatsapp mt-6"
                aria-label="WhatsApp"
                data-cta="footer_whatsapp"
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            <div>
              <h4 className={columnTitle}>Quick Links</h4>
              <ul>
                {[...mainNavigation, ...footerExtraLinks].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={footerLink}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={columnTitle}>Our Services</h4>
              <ul>
                {footerServices.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className={footerLink}>{service.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className={columnTitle}>Popular Locations</h4>
              <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-1">
                {footerLocations.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={footerLink}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-small text-[#A9B6CA] md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 GR Solution. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="inline-flex min-h-[3rem] items-center hover:text-white lg:min-h-0">Privacy Policy</Link>
            <Link href="/terms" className="inline-flex min-h-[3rem] items-center hover:text-white lg:min-h-0">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
