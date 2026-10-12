import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import SectionCTA from '@/components/SectionCTA';
import { TrustBand } from '@/components/TrustStrip';
import LinkTiles from '@/components/page/LinkTiles';
import ProcessSteps from '@/components/page/ProcessSteps';
import SectionHead from '@/components/page/SectionHead';
import { illustrationFor } from '@/components/serviceVisuals';
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

const nearbyRepairLinks = [
  { label: 'TV Repair Near Me', href: '/services/tv-repair-near-me' },
  { label: 'TV Repair in Delhi', href: '/services/tv-repair-delhi' },
  { label: 'TV Repair in Noida', href: '/services/tv-repair-noida' },
  { label: 'TV Repair in Ghaziabad', href: '/services/tv-repair-ghaziabad' },
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
    <main data-wa-context="TV repair in Delhi NCR">
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
      <section className="hero-surface border-b border-line" data-section="services_hero">
        <div className="container pb-10 pt-10 text-center sm:pb-12 lg:pb-16 lg:pt-16">
          <span className="eyebrow">REPAIR SERVICES</span>
          <h1 className="mx-auto mt-3 max-w-4xl">
            Professional TV{' '}
            <span className="heading-accent">Repair Services</span>
          </h1>
          <p className="lead mx-auto mt-4 max-w-2xl">
            Explore GR Solution services for LED, OLED/QLED, LCD, Plasma and Curved TV repair
            across Delhi, Noida, Greater Noida and Ghaziabad.
          </p>
        </div>
      </section>

      <TrustBand />

      {/* Service Cards Grid */}
      <section className="section band" data-section="services_grid">
        <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {tvServices.map((service) => (
            <article className="card card-interactive group relative flex overflow-hidden sm:flex-col" key={service.slug}>
              <div className="flex w-28 shrink-0 items-center justify-center bg-gradient-to-br from-navy-50 to-teal-50 p-3 sm:w-auto sm:px-6 sm:py-5">
                <Image
                  src={illustrationFor(service)}
                  alt={`${service.title} by GR Solution`}
                  width={520}
                  height={320}
                  unoptimized
                  className="h-auto w-full max-w-[240px] transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
                <h3 className="text-[1.0625rem] sm:text-h3">{service.title}</h3>
                <p className="mt-1.5 text-small leading-relaxed text-muted sm:mt-2 sm:text-[0.9375rem]">
                  {service.shortDescription}
                </p>
                {service.benefits?.length > 0 && (
                  <ul className="mt-3 grid flex-1 content-start gap-1.5 text-small text-body sm:mt-4 sm:gap-2">
                    {service.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2">
                        <i className="fa-solid fa-check mt-1 text-teal-600" aria-hidden="true" /> {b}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/services/${service.slug}`}
                  className="link-arrow mt-3 self-start after:absolute after:inset-0 after:content-['']"
                >
                  View Service <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionCTA section="services_mid_cta" className="pt-0 sm:pt-0" />

      <section className="section band-tint" data-section="services_nearby">
        <div className="container grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <span className="eyebrow">NEARBY SUPPORT</span>
            <h2 className="mt-3">How nearby TV repair requests work</h2>
            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-body">
              Searches such as TV repair nearby, nearest TV repairman, nearby TV service centre,
              nearest TV repair shop or TV repair shops in my area usually mean the customer wants
              quick local help. GR Solution provides independent doorstep inspection across its
              verified Delhi NCR service areas and does not claim unverified shop branches or brand authorization.
            </p>
            <p className="mt-4 max-w-prose leading-relaxed text-muted">
              Share your location, TV brand, screen size and exact symptom first. The team can then
              explain visit availability and whether the issue is suitable for doorstep diagnosis.
            </p>
          </div>
          <LinkTiles className="sm:grid-cols-2 lg:mt-12" icon="fa-solid fa-location-dot" links={nearbyRepairLinks} />
        </div>
      </section>

      {/* TV Repair by City */}
      <section className="section band" data-section="services_cities">
        <div className="container">
          <SectionHead
            eyebrow="LOCAL TV REPAIR"
            title="TV Repair by City"
            lead="Start with the city page if you need complete TV repair guidance for LED, OLED/QLED, LCD, Plasma and Curved TV issues."
          />
          <LinkTiles
            className="sm:grid-cols-2 xl:grid-cols-4"
            icon="fa-solid fa-map-location-dot"
            links={cityTvRepairPages.map((page) => ({ href: `/services/${page.slug}`, label: page.keyword }))}
          />
        </div>
      </section>

      <section className="section band-tint" data-section="services_popular">
        <div className="container">
          <SectionHead
            eyebrow="POPULAR SEARCHES"
            title="Top Local TV Repair Searches"
            lead="Quick links based on high-priority Google Keyword Planner opportunities for GR Solution."
          />
          <LinkTiles className="sm:grid-cols-2 lg:grid-cols-3" links={topLocalSearches} />
        </div>
      </section>

      <section className="section band" data-section="services_brands">
        <div className="container">
          <SectionHead
            eyebrow="BY BRAND"
            title="TV Repair by Brand"
            lead="GR Solution provides repair support for the following TV brands across Delhi, Noida, Greater Noida and Ghaziabad."
          />
          <LinkTiles className="sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6" links={brandHubLinks} />
        </div>
      </section>

      {/* 4-Step Repair Process */}
      <section className="section band-tint" data-section="services_process">
        <div className="container">
          <SectionHead
            eyebrow="SERVICE FLOW"
            title="Our 4-Step Repair Process"
            lead="A simple process from first contact to approved repair."
          />
          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      <SectionCTA section="services_end_cta" />
    </main>
  );
}
