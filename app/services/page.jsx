import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { services } from '@/data/services';
import { cityTvRepairPages } from '@/data/localServicePages';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export const metadata = {
  title: pageMetadata.services.title,
  description: pageMetadata.services.description,
  alternates: { canonical: '/services' },
  openGraph: { title: pageMetadata.services.title, description: pageMetadata.services.description, url: '/services' },
};

const tvServices = services;

const topLocalSearches = [
  { label: 'LED TV Repair Noida', href: '/services/led-tv-repair-noida' },
  { label: 'LED TV Repair Delhi', href: '/services/led-tv-repair-delhi' },
  { label: 'Sony TV Repair Noida', href: '/services/sony-tv-repair-noida' },
  { label: 'Samsung TV Service Centre Delhi', href: '/services/samsung-tv-repair-delhi' },
  { label: 'LG TV Service Center in Delhi', href: '/services/lg-tv-repair-delhi' },
  { label: 'TV Repair in Indirapuram Ghaziabad', href: '/services/tv-repair-ghaziabad' },
];

const brandHubLinks = [
  { label: 'Sony TV Repair', href: '/services/sony-tv-repair-delhi' },
  { label: 'Samsung TV Repair', href: '/services/samsung-tv-repair-delhi' },
  { label: 'LG TV Repair', href: '/services/lg-tv-repair-delhi' },
  { label: 'Mi/Xiaomi TV Repair', href: '/services/mi-tv-repair-delhi' },
  { label: 'Vu TV Repair', href: '/services/vu-tv-repair-delhi' },
  { label: 'OnePlus TV Repair', href: '/services/oneplus-tv-repair-delhi' },
];

const processSteps = [
  {
    icon: 'fa-solid fa-phone-volume',
    title: 'Contact GR Solution',
    text: 'Call, WhatsApp or submit the enquiry form with your repair requirement.',
  },
  {
    icon: 'fa-solid fa-clipboard-list',
    title: 'Share Device Issue',
    text: 'Tell us the model, symptoms and service location for better diagnosis.',
  },
  {
    icon: 'fa-solid fa-magnifying-glass',
    title: 'Get Diagnosis Visit',
    text: 'Our technician checks the device and explains the issue clearly.',
  },
  {
    icon: 'fa-solid fa-file-invoice',
    title: 'Approve Repair Estimate',
    text: 'You receive a transparent estimate before any paid repair work begins.',
  },
];

export default function ServicesPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'GR Solution Repair Services',
          url: `${siteConfig.url}/services`,
          hasPart: tvServices.map((service) => ({
            '@type': 'Service',
            name: service.title,
            url: `${siteConfig.url}/services/${service.slug}`,
          })),
        }}
      />

      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] pb-20 pt-24">
        <div className="container text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">REPAIR SERVICES</span>
          <h1 className="mx-auto mt-6 max-w-5xl text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-tight text-secondary">
            Professional TV{' '}
            <span className="text-primary">Repair Services</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-textMuted">
            Explore GR Solution services for LED, OLED/QLED, LCD, Plasma and Curved TV repair
            across Delhi, Noida, Greater Noida and Ghaziabad.
          </p>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="bg-white py-20">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tvServices.map((service) => (
            <article className="flex flex-col overflow-hidden rounded-card border border-black/5 bg-white p-0 shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg" key={service.slug}>
              <div className="relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={`${service.title} by GR Solution`}
                  width={520}
                  height={320}
                  className="h-60 w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent opacity-0 transition duration-300 hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-8">
                <h3 className="text-xl font-black text-secondary">{service.title}</h3>
                <p className="flex-1 text-[0.95rem] leading-relaxed text-textMuted">
                  {service.shortDescription}
                </p>
                {service.benefits?.length > 0 && (
                  <ul className="grid gap-2 text-sm text-textMuted">
                    {service.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2">
                        <i className="fa-solid fa-check mt-1 text-success" /> {b}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-2 inline-flex self-start rounded-full bg-primary px-6 py-3 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary"
                >
                  View Service
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TV Repair by Brand */}
      <section className="bg-bgLight py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">LOCAL TV REPAIR</span>
            <h2 className="mt-4 text-4xl font-black text-secondary">TV Repair by City</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">
              Start with the city page if you need complete TV repair guidance for LED, OLED/QLED, LCD, Plasma and Curved TV issues.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cityTvRepairPages.map((page) => (
              <Link
                key={page.slug}
                href={`/services/${page.slug}`}
                className="rounded-2xl border border-primary/10 bg-white p-6 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                {page.keyword}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">POPULAR SEARCHES</span>
            <h2 className="mt-4 text-4xl font-black text-secondary">Top Local TV Repair Searches</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">
              Quick links based on high-priority Google Keyword Planner opportunities for GR Solution.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topLocalSearches.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-primary/10 bg-bgLight p-5 font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">BY BRAND</span>
            <h2 className="mt-4 text-4xl font-black text-secondary">TV Repair by Brand</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">
              GR Solution provides repair support for the following TV brands across Delhi, Noida, Greater Noida and Ghaziabad.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {brandHubLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-primary/10 bg-bgLight p-5 text-center font-black text-secondary shadow-oldMd transition hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Repair Process */}
      <section className="bg-bgLight py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">SERVICE FLOW</span>
            <h2 className="mt-4 text-4xl font-black text-secondary">Our 4-Step Repair Process</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">A simple process from first contact to approved repair.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <article className="rounded-card border border-primary/10 bg-white p-8 text-center shadow-oldMd transition hover:-translate-y-1 hover:shadow-oldLg" key={step.title}>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">STEP {index + 1}</span>
                <div className="mx-auto my-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-2xl text-white">
                  <i className={step.icon} />
                </div>
                <h3 className="text-xl font-black text-secondary">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-textMuted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
