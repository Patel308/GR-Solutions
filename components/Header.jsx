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
      <header>
        <div className="container navbar">
          <Link href="/" className="logo" aria-label="GR Solution home">
            <Image src="/images/logo.jpg" alt="GR Solution Logo" width={150} height={50} className="nav-logo" priority />
          </Link>

          <ul className={`nav-links ${menuOpen ? 'mobile-active' : ''}`}>
            {mainNavigation.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              if (item.href === '/services') {
                return (
                  <li key={item.href} className={`nav-item ${dropdownOpen ? 'active-dropdown' : ''}`}>
                    <Link href="/services" className={active ? 'active' : ''} onClick={() => setDropdownOpen(!dropdownOpen)}>
                      Services <i className="fa-solid fa-chevron-down" />
                    </Link>
                    <ul className="dropdown-menu">
                      {dropdownServices.map((service) => (
                        <li key={service.slug}>
                          <Link href={`/services/${service.slug}`} onClick={() => setMenuOpen(false)}>
                            <i className={service.icon} /> {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link href={item.href} className={active ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-ctas">
            <button type="button" className="btn btn-outline open-enquiry-modal" onClick={() => setModalOpen(true)}>
              <i className="fa-solid fa-paper-plane" /> Quick Enquiry
            </button>
            <a href={siteConfig.phoneHref} className="btn btn-primary">
              <i className="fa-solid fa-phone" /> Call Now
            </a>
            <button type="button" className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </header>
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
