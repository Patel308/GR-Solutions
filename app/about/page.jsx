import Image from 'next/image';
import Link from 'next/link';
import ContentTable from '@/components/ContentTable';
import GoogleRating from '@/components/GoogleRating';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import SectionCTA from '@/components/SectionCTA';
import ProcessSteps from '@/components/page/ProcessSteps';
import SectionHead from '@/components/page/SectionHead';
import { brands } from '@/data/brandServicePages';
import { cityTvRepairPages } from '@/data/localServicePages';
import { localityPages } from '@/data/localityPages';
import { pageMetadata } from '@/data/pages';
import { diagnosisPolicy } from '@/data/pricing';
import { entityIds, siteConfig } from '@/data/siteConfig';
import { PhoneNumber } from '@/components/ContactChannel';

export const metadata = {
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  alternates: { canonical: '/about' },
  openGraph: { title: pageMetadata.about.title, description: pageMetadata.about.description, url: '/about' },
};

const coreValues = [
  {
    icon: 'fa-solid fa-microchip',
    title: 'Technical Mastery',
    text: 'Expert repair knowledge backed by advanced diagnostic tools and hands-on technical experience.',
  },
  {
    icon: 'fa-solid fa-hand-holding-dollar',
    title: 'Honest Pricing',
    text: 'Free diagnosis, a firm estimate and no hidden repair charges before work begins.',
  },
  {
    icon: 'fa-solid fa-certificate',
    title: 'Repair Excellence',
    text: 'Skilled technicians handling LED, OLED/QLED, LCD, Plasma and Curved TV repair with professional care.',
  },
  {
    icon: 'fa-solid fa-headset',
    title: 'Priority Support',
    text: 'Fast communication, doorstep assistance and reliable support across Delhi, Noida and NCR.',
  },
];

// How a repair runs. Each step is a commitment the site already makes on its
// service and pricing pages, gathered here so the About page states it plainly.
const howWeWork = [
  {
    icon: 'fa-solid fa-magnifying-glass',
    title: 'Free diagnosis first',
    text: 'The technician inspects the TV and finds the fault before anything is charged.',
  },
  {
    icon: 'fa-solid fa-microchip',
    title: 'We name the failed part',
    text: 'You are told exactly what failed — backlight, power board, T-Con, mainboard or panel — not a vague "display problem".',
  },
  {
    icon: 'fa-solid fa-file-invoice',
    title: 'A firm estimate before work',
    text: 'You approve a specific figure for a specific repair. Nothing paid starts without that approval.',
  },
  {
    icon: 'fa-solid fa-comments',
    title: 'An honest repair-or-replace answer',
    text: 'If a new TV makes more sense than the repair, we say so rather than selling a repair that does not pay off.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Warranty explained up front',
    text: 'Warranty depends on the repair and the part used, and is explained before the work starts.',
  },
];

const workshopPhotos = [
  {
    src: '/images/workshop-repair-bench.webp',
    alt: 'GR Solution workshop repair bench with TV panels and diagnostic equipment',
    caption: 'The repair bench, where panel and board-level work is done',
    width: 1200,
    height: 900,
  },
  {
    src: '/images/workshop-tv-diagnosis.webp',
    alt: 'GR Solution technician inspecting a TV at the workshop',
    caption: 'Diagnosing a TV before any repair is quoted',
    width: 720,
    height: 960,
  },
  {
    src: '/images/workshop-interior.webp',
    alt: 'Interior view of the GR Solution TV repair workshop in New Kondli',
    caption: 'Inside the New Kondli workshop',
    width: 141,
    height: 118,
  },
];

export default function AboutPage() {
  const { founderName, foundedYear, technicianCount } = siteConfig.aboutDetails || {};
  const fullAddress = `${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality} ${siteConfig.address.postalCode}`;

  // Only confirmed details are shown; empty fields in siteConfig are skipped.
  const facts = [
    ['Business', siteConfig.name],
    founderName ? ['Founder', founderName] : null,
    foundedYear ? ['Established', foundedYear] : null,
    technicianCount ? ['Technicians', technicianCount] : null,
    ['Workshop', fullAddress],
    ['Service areas', 'Delhi, Noida, Greater Noida and Ghaziabad'],
    ['TVs we repair', 'LED, OLED, QLED, LCD, Plasma and Curved'],
    ['Brands', `${brands.length} major brands, including Samsung, LG, Sony and Mi`],
    ['Diagnosis', `${diagnosisPolicy.label} — estimate given before any paid work`],
    ['Hours', 'Monday to Sunday, 9:00 AM to 9:00 PM'],
    ['Phone and WhatsApp', <PhoneNumber key="phone" />],
  ].filter(Boolean);

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About GR Solution',
            url: `${siteConfig.url}/about`,
            isPartOf: { '@id': entityIds.website },
            mainEntity: { '@id': entityIds.organization },
            inLanguage: 'en-IN',
          },
          ...(founderName || foundedYear || technicianCount
            ? [
          {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': entityIds.organization,
                ...(founderName ? { founder: { '@type': 'Person', name: founderName } } : {}),
                ...(foundedYear ? { foundingDate: foundedYear } : {}),
                ...(technicianCount
                  ? { numberOfEmployees: { '@type': 'QuantitativeValue', value: Number(technicianCount) } }
                  : {}),
              },
              ]
            : []),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
              { '@type': 'ListItem', position: 2, name: 'About Us', item: `${siteConfig.url}/about` },
            ],
          },
        ]}
      />

      <section className="hero-surface border-b border-line" data-section="about_hero">
        <div className="container grid items-center gap-10 pb-10 pt-8 sm:pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pb-16 lg:pt-14">
          <div>
            <span className="eyebrow">ABOUT GR SOLUTION</span>
            <h1 className="mt-3">
              Delhi&apos;s Expert TV Repair Team <span className="heading-accent">15+ Years of Service</span>
            </h1>
            <p className="answer-box mt-5">
              GR Solution is an independent TV repair workshop in New Kondli, East Delhi. We repair LED, OLED, QLED, LCD,
              Plasma and Curved televisions at customers&apos; homes across Delhi, Noida, Greater Noida and Ghaziabad, with a
              free diagnosis and a firm estimate before any paid work begins.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">
              <div className="flex flex-col rounded-xl border border-line bg-white p-3 shadow-xs sm:p-4">
                <span className="font-display text-[1.125rem] font-extrabold text-ink min-[400px]:text-xl sm:text-[1.75rem]">15+</span>
                <span className="text-small leading-snug text-muted">Years Experience</span>
              </div>
              <div className="flex flex-col rounded-xl border border-line bg-white p-3 shadow-xs sm:p-4">
                <span className="font-display text-[1.125rem] font-extrabold text-ink min-[400px]:text-xl sm:text-[1.75rem]">15,000+</span>
                <span className="text-small leading-snug text-muted">Happy Customers</span>
              </div>
              <div className="flex flex-col rounded-xl border border-line bg-white p-3 shadow-xs sm:p-4">
                <span className="font-display text-[1.125rem] font-extrabold text-teal-700 min-[400px]:text-xl sm:text-[1.75rem]">{diagnosisPolicy.label}</span>
                <span className="text-small leading-snug text-muted">Diagnosis</span>
              </div>
            </div>
            <GoogleRating className="mt-4" />
          </div>
          {/* PHOTO PLACEHOLDER: replace this drawing with a real photo of the
              GR Solution team or owner at the workshop (shot list in
              docs/design-system.md). The stock "team" image was removed. */}
          <div className="relative mx-auto w-full max-w-[36rem] lg:max-w-none">
            <Image
              src="/images/illustrations/tv-repair-workbench.svg"
              alt="Illustration of a TV repair bench with a test pattern on the screen, a multimeter, a circuit board and hand tools"
              width={640}
              height={480}
              preload
              fetchPriority="high"
              unoptimized
              className="aspect-[4/3] w-full rounded-[1.25rem] object-cover shadow-card-hover ring-1 ring-black/5"
            />
          </div>
        </div>
      </section>

      <section className="section band" data-section="about_who">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-prose">
            <h2>Who we are</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
              We are a local repair business, not a brand-authorised service centre and not a marketplace that dispatches
              whoever is free. Every job is handled from our own workshop in New Kondli, on the eastern edge of Delhi
              where the city meets Noida and Ghaziabad. That location is why East Delhi, Indirapuram and the older Noida
              sectors are our quickest visits, and why Greater Noida and West Delhi are planned a day ahead.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-body">
              Most TV faults are repaired at the customer&apos;s home. When a fault genuinely needs a bench — panel
              ribbons, fine board work, some backlight jobs on very large sets — the set comes to the workshop, and we
              explain why before it is moved.
            </p>
          </div>
          <div className="min-w-0">
            <h2>GR Solution at a glance</h2>
            <ContentTable table={{ caption: 'GR Solution business details', columns: ['Detail', 'Information'], rows: facts }} />
          </div>
        </div>
      </section>

      <section className="section band-tint" data-section="about_workshop">
        <div className="container">
          <SectionHead
            align="left"
            eyebrow="REAL WORKSHOP"
            title="Inside our workshop"
            lead="These photos are from the GR Solution workshop in New Kondli, where bench-level repairs are carried out."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-5">
            {workshopPhotos.map((photo) => {
              const small = photo.width < 400;
              return (
                <figure
                  key={photo.src}
                  className={`card m-0 flex flex-col overflow-hidden ${small ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className={small ? 'flex flex-1 items-center justify-center bg-surface p-6' : 'flex-1 bg-navy-50'}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes={small ? `${photo.width}px` : '(min-width: 992px) 34vw, (min-width: 640px) 50vw, 100vw'}
                      className={
                        small
                          ? 'h-auto w-full max-w-[141px] rounded-lg object-cover'
                          : 'aspect-[4/3] h-full w-full object-cover'
                      }
                    />
                  </div>
                  <figcaption className="flex items-start gap-2.5 p-4 font-semibold leading-snug text-ink sm:p-5">
                    <i className="fa-solid fa-location-dot mt-1 text-teal-600" aria-hidden="true" />
                    {photo.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section band" data-section="about_process">
        <div className="container">
          <SectionHead align="left" title="How every repair works" />
          <ProcessSteps steps={howWeWork} />
          <p className="mt-10 text-[1.0625rem] leading-relaxed text-body">
            Want to know what a repair usually costs before you call? See the{' '}
            <Link href="/pricing" className="text-link">TV repair price guide</Link>.
          </p>
        </div>
      </section>

      <SectionCTA section="about_mid_cta" className="pt-0 sm:pt-0" />

      <section className="section band-tint" data-section="about_values">
        <div className="container">
          <SectionHead eyebrow="OUR VALUES" title="Our Core Values" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {coreValues.map((value) => (
              <article className="card card-interactive p-5 sm:p-6" key={value.title}>
                <span className="icon-tile size-12 text-lg" aria-hidden="true">
                  <i className={value.icon} />
                </span>
                <h3 className="mt-4 text-lg">{value.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" data-section="about_areas">
        <div className="container">
          <h2>Where we work</h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {[...cityTvRepairPages, ...localityPages].map((page) => (
              <Link
                key={page.slug}
                href={`/services/${page.slug}`}
                className="chip min-h-[2.75rem] px-4 text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <i className="fa-solid fa-location-dot text-teal-600" aria-hidden="true" />
                {page.title.replace(/ Service$/, '')}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-[1.0625rem] leading-relaxed text-body">
            Read what customers say on our{' '}
            <Link href="/reviews" className="text-link">reviews page</Link>
            {siteConfig.googleBusinessProfile ? (
              <>
                {' '}or on our{' '}
                <a href={siteConfig.googleBusinessProfile} target="_blank" rel="noopener noreferrer" className="text-link">
                  Google Business Profile
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      </section>

      <PageCTA />
    </main>
  );
}
