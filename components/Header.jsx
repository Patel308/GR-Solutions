'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mainNavigation } from '@/data/navigation';
import { services } from '@/data/services';
import { siteConfig } from '@/data/siteConfig';
import EnquiryModal from './EnquiryModal';
import { useEnquiry } from './EnquiryContext';
import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';
import cx from '@/components/ui/cx';

const dropdownServices = services;

// "09:00" -> "9 AM", "21:00" -> "9 PM"
const toClock = (value) => {
  const [h] = value.split(':').map(Number);
  return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
};
const { opens, closes, days } = siteConfig.openingHours;
const hoursLabel = `${days.length === 7 ? 'Mon–Sun' : `${days[0].slice(0, 3)}–${days[days.length - 1].slice(0, 3)}`}, ${toClock(opens)}–${toClock(closes)}`;

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const servicesItemRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { open: enquiryOpen, openEnquiry, closeEnquiry } = useEnquiry();

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  // Desktop: the header visually tightens once the page scrolls. Done with a
  // data attribute and CSS transforms only, so nothing re-renders on scroll and
  // no layout shifts.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    let ticking = false;
    const update = () => {
      header.dataset.scrolled = window.scrollY > 24 ? 'true' : 'false';
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, make the page behind it inert, trap focus inside
  // the menu (plus its toggle), close on Escape and return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const outside = [document.querySelector('main'), document.querySelector('footer'), document.querySelector('[data-sticky-bar]')].filter(Boolean);
    outside.forEach((element) => {
      element.inert = true;
    });
    menuRef.current?.querySelector(FOCUSABLE)?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setServicesOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [toggleRef.current, ...(menuRef.current?.querySelectorAll(FOCUSABLE) || [])].filter(
        (element) => element && element.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      outside.forEach((element) => {
        element.inert = false;
      });
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Desktop services dropdown (disclosure pattern): opens on hover (CSS) and
  // from the chevron button; Escape closes it and returns focus to that button.
  const onDropdownKeyDown = (event) => {
    if (event.key === 'Escape' && dropdownOpen) {
      setDropdownOpen(false);
      servicesItemRef.current?.querySelector('button[aria-controls="services-dropdown"]')?.focus();
    }
  };
  const onDropdownBlur = (event) => {
    if (!servicesItemRef.current?.contains(event.relatedTarget)) setDropdownOpen(false);
  };

  const navLink = (active) =>
    cx(
      'relative inline-flex min-h-12 items-center rounded-lg px-3 text-[0.9375rem] font-semibold transition-colors',
      active ? 'text-primary' : 'text-ink hover:text-primary',
      'after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-200',
      active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
    );

  return (
    <>
      <header
        ref={headerRef}
        data-scrolled="false"
        data-section="header"
        className="site-header sticky top-0 z-[1000] h-16 bg-white shadow-[0_1px_0_rgb(15_23_42/0.06)] lg:h-20 lg:bg-transparent lg:shadow-none"
      >
        <div className="site-header-row container flex h-full items-center justify-between gap-3">
          <Link href="/" aria-label="GR Solution home" className="site-header-logo inline-flex shrink-0 items-center" onClick={closeMenu}>
            <Image
              src="/images/logo.jpg"
              alt="GR Solution TV repair service logo"
              width={150}
              height={81}
              className="h-auto w-[104px] object-contain sm:w-[116px] lg:w-[132px]"
              loading="eager"
              fetchPriority="low"
              sizes="(min-width: 992px) 132px, 116px"
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNavigation.map((item) => {
                const active = isActive(item.href);
                if (item.href === '/services') {
                  return (
                    <li
                      key={item.href}
                      ref={servicesItemRef}
                      className="group relative flex items-center"
                      onKeyDown={onDropdownKeyDown}
                      onBlur={onDropdownBlur}
                    >
                      <Link href="/services" className={cx(navLink(active), 'pr-1')}>
                        Services
                      </Link>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-lg text-ink transition hover:bg-navy-50 hover:text-primary"
                        aria-expanded={dropdownOpen}
                        aria-controls="services-dropdown"
                        aria-label="Show the list of services"
                        onClick={() => setDropdownOpen((value) => !value)}
                      >
                        <i className={cx('fa-solid fa-chevron-down text-[0.7rem] transition-transform duration-200 group-hover:rotate-180', dropdownOpen && 'rotate-180')} />
                      </button>
                      <ul
                        id="services-dropdown"
                        className={cx(
                          'absolute left-1/2 top-full z-[1001] grid min-w-[300px] -translate-x-1/2 gap-0.5 rounded-2xl border border-line bg-white p-2 shadow-card-hover transition duration-200 ease-out',
                          dropdownOpen
                            ? 'visible translate-y-0 opacity-100'
                            : 'invisible -translate-y-1 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
                        )}
                      >
                        {dropdownServices.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold text-ink transition hover:bg-navy-50 hover:text-primary"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span className="icon-tile size-8 rounded-lg text-sm" aria-hidden="true">
                                <i className={service.icon} />
                              </span>{' '}
                              {service.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={navLink(active)} aria-current={active ? 'page' : undefined}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="btn btn-secondary hidden min-h-12 md:inline-flex"
              onClick={() => openEnquiry('header')}
              data-cta="header_quick_enquiry"
            >
              <i className="fa-solid fa-paper-plane" aria-hidden="true" /> Quick Enquiry
            </button>

            {/* Compact "Call" on phones, full "Call Now" from md up */}
            <PhoneLink
              callLocation="header_call_now"
              className="btn btn-primary min-h-12 gap-2 px-4 md:px-5"
            >
              <i className="fa-solid fa-phone text-[0.9em]" aria-hidden="true" />
              <span className="md:hidden">Call</span>
              <span className="hidden md:inline">Call Now</span>
            </PhoneLink>

            <button
              ref={toggleRef}
              type="button"
              className="relative inline-flex size-12 items-center justify-center rounded-xl border border-line bg-white text-ink transition hover:border-navy-300 hover:text-primary active:scale-95 lg:hidden"
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3.5 w-[18px]" aria-hidden="true">
                <span className={cx('absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300', menuOpen ? 'top-1.5 rotate-45' : 'top-0')} />
                <span className={cx('absolute left-0 top-1.5 block h-0.5 w-full rounded-full bg-current transition-opacity duration-200', menuOpen ? 'opacity-0' : 'opacity-100')} />
                <span className={cx('absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300', menuOpen ? 'top-1.5 -rotate-45' : 'top-3')} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile / tablet menu */}
        <nav
          id="mobile-menu"
          ref={menuRef}
          aria-label="Mobile"
          className={cx(
            'absolute inset-x-0 top-full z-[999] max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white shadow-card-hover transition duration-300 ease-out lg:hidden',
            menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
          )}
        >
          <div className="container py-3">
            <ul className="grid gap-0.5">
              {mainNavigation.map((item) => {
                const active = isActive(item.href);
                const rowClass = cx(
                  'flex min-h-[3.25rem] w-full items-center justify-between rounded-xl px-4 text-left text-base font-semibold transition',
                  active ? 'bg-navy-50 text-primary' : 'text-ink hover:bg-surface',
                );

                if (item.href === '/services') {
                  return (
                    <li key={item.href}>
                      <button type="button" className={rowClass} onClick={() => setServicesOpen((open) => !open)} aria-expanded={servicesOpen}>
                        Services
                        <i className={cx('fa-solid fa-chevron-down text-xs transition-transform duration-300', servicesOpen && 'rotate-180')} aria-hidden="true" />
                      </button>
                      <div className={cx('grid transition-all duration-300 ease-out', servicesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                        <ul className="overflow-hidden">
                          <li className="pt-1">
                            <Link href="/services" onClick={closeMenu} className="flex min-h-[3rem] items-center gap-3 rounded-xl pl-8 pr-4 text-[0.9375rem] font-semibold text-primary">
                              All services <i className="fa-solid fa-arrow-right text-[0.7em]" aria-hidden="true" />
                            </Link>
                          </li>
                          {dropdownServices.map((service) => (
                            <li key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                onClick={closeMenu}
                                className="flex min-h-[3rem] items-center gap-3 rounded-xl pl-8 pr-4 text-[0.9375rem] font-medium text-ink transition hover:bg-surface hover:text-primary"
                              >
                                <i className={cx(service.icon, 'w-4 text-center text-teal-600')} aria-hidden="true" />
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
                    <Link href={item.href} onClick={closeMenu} className={rowClass} aria-current={active ? 'page' : undefined}>
                      {item.label}
                      <i className="fa-solid fa-arrow-right text-[0.7em] opacity-40" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openEnquiry('mobile_menu');
                }}
                className="btn btn-secondary"
                data-cta="menu_enquiry"
              >
                <i className="fa-solid fa-paper-plane" aria-hidden="true" /> Enquiry
              </button>
              <WhatsAppLink className="btn btn-whatsapp" data-cta="menu_whatsapp">
                <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
              </WhatsAppLink>
            </div>
            <p className="mt-4 pb-1 text-center text-small font-medium text-muted">
              {hoursLabel} &middot; Free diagnosis &middot; Delhi NCR
            </p>
          </div>
        </nav>
      </header>
      {/* Tap-outside backdrop, kept outside <header> so it always covers the
          full viewport beneath the sticky header. */}
      <div
        className={cx(
          'fixed inset-0 z-[999] bg-ink/40 transition-opacity duration-300 lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </>
  );
}
