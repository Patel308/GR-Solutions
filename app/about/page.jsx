import Image from 'next/image';
import Link from 'next/link';
import ContentTable from '@/components/ContentTable';
import JsonLd from '@/components/JsonLd';
import PageCTA from '@/components/PageCTA';
import { brands } from '@/data/brandServicePages';
import { cityTvRepairPages } from '@/data/localServicePages';
import { localityPages } from '@/data/localityPages';
import { pageMetadata } from '@/data/pages';
import { diagnosisPolicy } from '@/data/pricing';
import { entityIds, siteConfig } from '@/data/siteConfig';

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
    title: 'Free diagnosis first',
    text: 'The technician inspects the TV and finds the fault before anything is charged.',
  },
  {
    title: 'We name the failed part',
    text: 'You are told exactly what failed — backlight, power board, T-Con, mainboard or panel — not a vague "display problem".',
  },
  {
    title: 'A firm estimate before work',
    text: 'You approve a specific figure for a specific repair. Nothing paid starts without that approval.',
  },
  {
    title: 'An honest repair-or-replace answer',
    text: 'If a new TV makes more sense than the repair, we say so rather than selling a repair that does not pay off.',
  },
  {
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
    ['Phone and WhatsApp', siteConfig.phone],
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

      <section className="py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">ABOUT GR SOLUTION</span>
            <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-tight text-secondary">
              Delhi&apos;s Expert TV Repair Team <span className="text-primary">15+ Years of Service</span>
            </h1>
            <p className="mt-6 rounded-2xl border border-primary/10 bg-bgLight p-5 text-lg font-bold leading-relaxed text-secondary">
              GR Solution is an independent TV repair workshop in New Kondli, East Delhi. We repair LED, OLED, QLED, LCD,
              Plasma and Curved televisions at customers&apos; homes across Delhi, Noida, Greater Noida and Ghaziabad, with a
              free diagnosis and a firm estimate before any paid work begins.
            </p>
            <div className="mt-8 flex flex-wrap gap-8">
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-secondary">15+</span>
                <span className="text-textMuted">Years Experience</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-secondary">15,000+</span>
                <span className="text-textMuted">Happy Customers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-secondary">{diagnosisPolicy.label}</span>
                <span className="text-textMuted">Diagnosis</span>
              </div>
            </div>
          </div>
          <Image src="/images/team.webp" alt="GR Solution TV repair team in Delhi NCR" width={650} height={480} className="w-full rounded-[20px] shadow-oldLg" priority />
        </div>
      </section>

      <section className="bg-bgLight py-20">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-black text-secondary md:text-4xl">Who we are</h2>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">
              We are a local repair business, not a brand-authorised service centre and not a marketplace that dispatches
              whoever is free. Every job is handled from our own workshop in New Kondli, on the eastern edge of Delhi
              where the city meets Noida and Ghaziabad. That location is why East Delhi, Indirapuram and the older Noida
              sectors are our quickest visits, and why Greater Noida and West Delhi are planned a day ahead.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">
              Most TV faults are repaired at the customer&apos;s home. When a fault genuinely needs a bench — panel
              ribbons, fine board work, some backlight jobs on very large sets — the set comes to the workshop, and we
              explain why before it is moved.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-black text-secondary md:text-4xl">GR Solution at a glance</h2>
            <ContentTable table={{ caption: 'GR Solution business details', columns: ['Detail', 'Information'], rows: facts }} />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mb-12 max-w-3xl">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">REAL WORKSHOP</span>
            <h2 className="mt-4 text-3xl font-black text-secondary md:text-4xl">Inside our workshop</h2>
            <p className="mt-4 text-lg leading-relaxed text-textMuted">
              These photos are from the GR Solution workshop in New Kondli, where bench-level repairs are carried out.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workshopPhotos.map((photo) => (
              <figure key={photo.src} className="m-0 overflow-hidden rounded-card bg-white shadow-oldMd">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-[4/3] h-auto w-full object-cover"
                />
                <figcaption className="p-5 font-bold text-secondary">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bgLight py-20">
        <div className="container">
          <h2 className="text-3xl font-black text-secondary md:text-4xl">How every repair works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {howWeWork.map((step, index) => (
              <li key={step.title} className="rounded-card bg-white p-6 shadow-oldMd">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">STEP {index + 1}</span>
                <h3 className="mt-4 text-lg font-black text-secondary">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-textMuted">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-lg leading-relaxed text-textMuted">
            Want to know what a repair usually costs before you call? See the{' '}
            <Link href="/pricing" className="font-black text-primary hover:text-secondary">TV repair price guide</Link>.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">OUR VALUES</span>
            <h2 className="text-4xl font-black text-secondary">Our Core Values</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {coreValues.map((value) => (
              <article className="group rounded-card border border-black/5 bg-white p-8 shadow-oldMd transition duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:shadow-oldLg" key={value.title}>
                <div className="mb-6 flex size-[70px] items-center justify-center rounded-[18px] bg-primary/10 text-2xl text-primary transition duration-300 group-hover:bg-white group-hover:text-primary">
                  <i className={value.icon} />
                </div>
                <h3 className="text-xl font-black text-secondary transition duration-300 group-hover:text-white">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-textMuted transition duration-300 group-hover:text-white/90">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bgLight py-20">
        <div className="container">
          <h2 className="text-3xl font-black text-secondary md:text-4xl">Where we work</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {[...cityTvRepairPages, ...localityPages].map((page) => (
              <Link
                key={page.slug}
                href={`/services/${page.slug}`}
                className="rounded-full border border-primary/20 bg-white px-5 py-3 font-black text-primary transition hover:bg-primary hover:text-white"
              >
                {page.title.replace(/ Service$/, '')}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-lg leading-relaxed text-textMuted">
            Read what customers say on our{' '}
            <Link href="/reviews" className="font-black text-primary hover:text-secondary">reviews page</Link>
            {siteConfig.googleBusinessProfile ? (
              <>
                {' '}or on our{' '}
                <a href={siteConfig.googleBusinessProfile} target="_blank" rel="noopener noreferrer" className="font-black text-primary hover:text-secondary">
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
