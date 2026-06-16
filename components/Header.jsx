'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { mainNavigation } from '@/data/navigation';
import { services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';
import EnquiryModal from './EnquiryModal';

const dropdownServices = services.filter(
  (s) => !['laptop-repair', 'mobile-repair'].includes(s.slug)
);

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-white shadow-nav">
        <div className="container navbar flex min-h-[96px] items-center justify-between">
          <Link href="/" className="logo" aria-label="GR Solution home">
            <Image src="/images/logo.jpg" alt="GR Solution Logo" width={150} height={50} className="nav-logo h-auto w-[150px] object-contain" priority />
          </Link>

          <ul className={`nav-links items-center gap-8 lg:flex ${menuOpen ? 'mobile-active flex' : 'hidden'}`}>
            {mainNavigation.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              if (item.href === '/services') {
                return (
                  <li key={item.href} className={`nav-item group relative ${dropdownOpen ? 'active-dropdown' : ''}`}>
                    <Link
                      href="/services"
                      className={`${active ? 'active text-primary' : 'text-secondary'} flex items-center gap-2 font-bold transition-colors duration-300 hover:text-primary`}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      Services <i className="fa-solid fa-chevron-down" />
                    </Link>
                    <ul className="dropdown-menu absolute left-1/2 top-full z-[1001] grid min-w-[310px] -translate-x-1/2 gap-1 rounded-2xl border border-black/5 bg-white p-5 opacity-0 shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ease-old group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {dropdownServices.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="flex items-center gap-4 rounded-xl px-4 py-3 font-semibold text-secondary transition-all duration-300 hover:bg-primary/5 hover:pl-6 hover:text-primary"
                            onClick={() => setMenuOpen(false)}
                          >
                            <i className={`${service.icon} w-5 text-center text-primary`} /> {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${active ? 'active text-primary' : 'text-secondary'} font-bold transition-colors duration-300 hover:text-primary`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-ctas flex items-center gap-4">
            <button
              type="button"
              className="btn btn-outline open-enquiry-modal inline-flex min-w-[190px] items-center justify-center gap-3 rounded-full border-2 border-primary bg-white px-6 py-4 font-extrabold leading-none text-primary shadow-cta transition duration-300 ease-old hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:text-white hover:shadow-ctaHover"
              onClick={() => setModalOpen(true)}
            >
              <i className="fa-solid fa-paper-plane" /> Quick Enquiry
            </button>
            <a
              href={siteConfig.phoneHref}
              className="btn btn-primary inline-flex min-w-[170px] items-center justify-center gap-3 rounded-full border-2 border-primary bg-primary px-6 py-4 font-extrabold leading-none text-white shadow-cta transition duration-300 ease-old hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:shadow-ctaHover"
            >
              <i className="fa-solid fa-phone" /> Call Now
            </a>
            <button type="button" className="mobile-menu-toggle text-2xl text-secondary lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </header>
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
