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
    <footer className="bg-[#09091b] py-[100px] pb-7 text-white">
      <div className="container">
        <div className="grid items-start gap-16 md:grid-cols-2 xl:grid-cols-[1.6fr_0.9fr_1.1fr_1.25fr]">
          <div>
            <Link href="/" className="mb-6 inline-flex rounded-[10px] bg-white px-5 py-3 shadow-oldLg">
              <Image
                src="/images/logo.jpg"
                alt="GR Solution Logo - Premium TV Repair Provider in Delhi, Noida & NCR"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mb-8 max-w-[430px] text-[1.1rem] leading-[1.7] text-white">
              Delhi, Noida & NCR&apos;s #1 premium TV repair service provider with 15+ years of technical
              excellence and transparent pricing.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                className="inline-flex size-[50px] items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1877f2]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a
                href="https://instagram.com"
                className="inline-flex size-[50px] items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#e4405f]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                href={siteConfig.whatsappHref}
                className="inline-flex size-[50px] items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#25d366]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp" />
              </a>
              <a
                href="https://youtube.com"
                className="inline-flex size-[50px] items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#ff0000]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fa-brands fa-youtube" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xl font-black text-white">Quick Links</h4>
            <ul className="grid gap-4">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[#b9c3d8] transition duration-300 hover:pl-1 hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xl font-black text-white">Our Services</h4>
            <ul className="grid gap-4">
              {footerServices.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="text-[#b9c3d8] transition duration-300 hover:pl-1 hover:text-white">{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-sm:w-full">
            <h4 className="mb-6 inline-block border-b-2 border-primary pb-1 text-xl font-black text-white max-sm:block max-sm:text-center">Contact Us</h4>
            <ul className="mx-auto mt-6 grid max-w-[340px] gap-5 sm:max-w-none">
              <li className="grid grid-cols-[46px_minmax(0,1fr)] items-start gap-4 text-left">
                <i className="fa-solid fa-location-dot inline-flex size-[46px] items-center justify-center rounded-xl bg-primary/25 text-accent" />
                <div>
                  <strong className="mb-1 block text-white">
                    Visit Center
                  </strong>
                  <span className="leading-relaxed text-[#b9c3d8]">
                    {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}{' '}
                    {siteConfig.address.postalCode}
                  </span>
                </div>
              </li>
              <li className="grid grid-cols-[46px_minmax(0,1fr)] items-start gap-4 text-left">
                <i className="fa-solid fa-phone inline-flex size-[46px] items-center justify-center rounded-xl bg-primary/25 text-accent" />
                <div>
                  <strong className="mb-1 block text-white">
                    Call Support
                  </strong>
                  <a href={siteConfig.phoneHref} className="text-[#b9c3d8] hover:text-white">{siteConfig.phone}</a>
                </div>
              </li>
              <li className="grid grid-cols-[46px_minmax(0,1fr)] items-start gap-4 text-left">
                <i className="fa-solid fa-envelope inline-flex size-[46px] items-center justify-center rounded-xl bg-primary/25 text-accent" />
                <div>
                  <strong className="mb-1 block text-white">
                    Email Us
                  </strong>
                  <a href={siteConfig.emailHref} className="text-[#b9c3d8] hover:text-white">{siteConfig.email}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pb-28 pt-10 text-[#b9c3d8] md:pb-0">
          <p>&copy; 2026 GR Solution. All Rights Reserved.</p>
          <p>Mon - Sun: 09:00 AM - 09:00 PM</p>
          <div className="flex gap-8 max-md:flex-col max-md:items-center max-md:gap-2">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
