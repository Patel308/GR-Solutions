'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mainNavigation } from '@/data/navigation';
import { services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';
import EnquiryModal from './EnquiryModal';

const dropdownServices = services;

// "09:00" -> "9 AM", "21:00" -> "9 PM"
const toClock = (value) => {
  const [h] = value.split(':').map(Number);
  return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
};
const { opens, closes, days } = siteConfig.openingHours;
const hoursLabel = `${days.length === 7 ? 'Mon–Sun' : `${days[0].slice(0, 3)}–${days[days.length - 1].slice(0, 3)}`}, ${toClock(opens)}–${toClock(closes)}`;

const desktopLink =
  'relative flex items-center gap-2 font-bold transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  // Lock page scroll behind the open mobile menu, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-[1000] border-b border-black/5 bg-white shadow-nav">
        <div className="container relative flex h-16 items-center justify-between gap-3 md:h-20 lg:h-24">
          <Link href="/" aria-label="GR Solution home" className="shrink-0" onClick={closeMenu}>
            <Image
              src="/images/logo.jpg"
              alt="GR Solution TV repair service logo"
              width={150}
              height={50}
              className="h-auto w-[116px] object-contain sm:w-[132px] lg:w-[150px]"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {mainNavigation.map((item) => {
                const active = isActive(item.href);
                if (item.href === '/services') {
                  return (
                    <li key={item.href} className="group relative">
                      <Link
                        href="/services"
                        className={`${desktopLink} ${active ? 'text-primary after:w-full' : 'text-secondary after:w-0'}`}
                      >
                        Services <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180" />
                      </Link>
                      <ul className="invisible absolute left-1/2 top-full z-[1001] grid min-w-[310px] -translate-x-1/2 -translate-y-3 gap-1 rounded-2xl border border-black/5 bg-white p-5 opacity-0 shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ease-old group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        {dropdownServices.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              className="flex items-center gap-4 rounded-xl px-4 py-3 font-semibold text-secondary transition-all duration-300 hover:bg-primary/5 hover:pl-6 hover:text-primary"
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
                      className={`${desktopLink} ${active ? 'text-primary after:w-full' : 'text-secondary after:w-0'}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
            <button
              type="button"
              className="hidden min-w-[190px] items-center justify-center gap-3 rounded-full border-2 border-primary bg-white px-6 py-4 font-extrabold leading-none text-primary shadow-cta transition duration-300 ease-old hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:text-white hover:shadow-ctaHover md:inline-flex"
              onClick={() => setModalOpen(true)}
            >
              <i className="fa-solid fa-paper-plane" /> Quick Enquiry
            </button>

            {/* Compact pill on phones, full "Call Now" button from md up */}
            <a
              href={siteConfig.phoneHref}
              data-call-location="header_call_now"
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 text-sm font-extrabold leading-none text-white shadow-cta transition duration-300 ease-old hover:bg-secondary active:scale-[0.97] md:h-auto md:min-w-[170px] md:gap-3 md:border-2 md:border-primary md:px-6 md:py-4 md:text-base md:hover:-translate-y-1 md:hover:border-secondary md:hover:shadow-ctaHover"
            >
              <i className="fa-solid fa-phone text-[0.85em]" />
              <span className="md:hidden">Call</span>
              <span className="hidden md:inline">Call Now</span>
            </a>

            <button
              type="button"
              className="relative inline-flex size-10 items-center justify-center rounded-xl border border-solid border-black/10 bg-white text-secondary outline-none transition hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 lg:hidden"
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3.5 w-[18px]" aria-hidden="true">
                <span className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-1.5 block h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile / tablet menu */}
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className={`absolute inset-x-0 top-full z-[999] max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-b-3xl border-t border-black/5 bg-white shadow-[0_24px_48px_rgba(13,12,34,0.14)] transition-all duration-300 ease-old lg:hidden ${
            menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          <div className="container py-4">
            <ul className="grid gap-1">
              {mainNavigation.map((item) => {
                const active = isActive(item.href);
                // Tailwind preflight is disabled in this project, so the <button> row needs
                // its browser border and background reset explicitly.
                const rowClass = `flex w-full appearance-none items-center justify-between rounded-2xl border-0 px-4 py-3.5 text-left text-[15px] font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  active ? 'bg-primary/5 text-primary' : 'bg-transparent text-secondary hover:bg-bgLight'
                }`;

                if (item.href === '/services') {
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        className={rowClass}
                        onClick={() => setServicesOpen((open) => !open)}
                        aria-expanded={servicesOpen}
                      >
                        Services
                        <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`grid transition-all duration-300 ease-old ${servicesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <ul className="overflow-hidden">
                          <li className="pt-1">
                            <Link
                              href="/services"
                              onClick={closeMenu}
                              className="flex items-center gap-3 rounded-xl py-2.5 pl-8 pr-4 text-sm font-bold text-primary"
                            >
                              All services <i className="fa-solid fa-arrow-right text-[0.7em]" />
                            </Link>
                          </li>
                          {dropdownServices.map((service) => (
                            <li key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                onClick={closeMenu}
                                className="flex items-center gap-3 rounded-xl py-2.5 pl-8 pr-4 text-sm font-semibold text-secondary transition hover:bg-bgLight hover:text-primary"
                              >
                                <i className={`${service.icon} w-4 text-center text-primary`} />
                                {service.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={closeMenu} className={rowClass}>
                      {item.label}
                      <i className="fa-solid fa-arrow-right text-[0.7em] opacity-40" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/5 pt-4">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setModalOpen(true);
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-solid border-primary bg-white text-sm font-extrabold text-primary outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.97]"
              >
                <i className="fa-solid fa-paper-plane" /> Enquiry
              </button>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25d366] text-sm font-extrabold text-white transition active:scale-[0.97]"
              >
                <i className="fa-brands fa-whatsapp" /> WhatsApp
              </a>
            </div>
            <p className="mt-4 text-center text-xs font-semibold text-textMuted">
              {hoursLabel} &middot; Free diagnosis &middot; Delhi NCR
            </p>
          </div>
        </nav>
      </header>
      {/* Tap-outside backdrop, kept outside <header> so it always covers the
          full viewport beneath the sticky header. */}
      <div
        className={`fixed inset-0 z-[999] bg-secondary/30 transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
