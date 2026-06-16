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
  const ctaBase =
    'inline-flex items-center justify-center gap-3 rounded-full border-2 px-6 py-4 font-extrabold leading-none shadow-cta transition duration-300 ease-old hover:-translate-y-1 hover:shadow-ctaHover';

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-white shadow-nav">
        <div className="container relative flex min-h-[96px] items-center justify-between">
          <Link href="/" aria-label="GR Solution home">
            <Image src="/images/logo.jpg" alt="GR Solution Logo" width={150} height={50} className="h-auto w-[150px] object-contain" priority />
          </Link>

          <ul
            className={`absolute left-0 right-0 top-full z-[999] flex-col gap-0 bg-white p-5 shadow-oldLg lg:static lg:z-auto lg:flex lg:flex-row lg:items-center lg:gap-8 lg:bg-transparent lg:p-0 lg:shadow-none ${
              menuOpen ? 'flex' : 'hidden'
            }`}
          >
            {mainNavigation.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              if (item.href === '/services') {
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href="/services"
                      className={`${active ? 'text-primary after:w-full' : 'text-secondary after:w-0'} relative flex items-center gap-2 py-3 font-bold transition-colors duration-300 after:absolute after:bottom-1 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full lg:py-0`}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      Services <i className="fa-solid fa-chevron-down" />
                    </Link>
                    <ul
                      className={`${dropdownOpen ? 'grid' : 'hidden'} z-[1001] mt-3 min-w-0 gap-1 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ease-old lg:invisible lg:absolute lg:left-1/2 lg:top-full lg:mt-0 lg:grid lg:min-w-[310px] lg:-translate-x-1/2 lg:-translate-y-3 lg:p-5 lg:opacity-0 lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100`}
                    >
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
                    className={`${active ? 'text-primary after:w-full' : 'text-secondary after:w-0'} relative block py-3 font-bold transition-colors duration-300 after:absolute after:bottom-1 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full lg:py-0`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`${ctaBase} hidden min-w-[190px] border-primary bg-white text-primary hover:border-secondary hover:bg-secondary hover:text-white sm:inline-flex`}
              onClick={() => setModalOpen(true)}
            >
              <i className="fa-solid fa-paper-plane" /> Quick Enquiry
            </button>
            <a
              href={siteConfig.phoneHref}
              className={`${ctaBase} min-w-[132px] border-primary bg-primary text-white hover:border-secondary hover:bg-secondary sm:min-w-[170px]`}
            >
              <i className="fa-solid fa-phone" /> Call Now
            </a>
            <button type="button" className="text-2xl text-secondary lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </header>
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
