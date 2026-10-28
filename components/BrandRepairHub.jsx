import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import FAQ from '@/components/FAQ';
import GuideBookingCTA from '@/components/GuideBookingCTA';
import JsonLd from '@/components/JsonLd';
import PriceTable from '@/components/PriceTable';
import { cities } from '@/data/localServicePages';
import { entityIds, siteConfig } from '@/data/siteConfig';
import { repairPriceBands } from '@/data/pricing';
import styles from './BrandRepairHub.module.css';

export function BrandHubLink({ brandSlug }) {
  if (!['sony', 'samsung', 'lg'].includes(brandSlug)) return null;
  const brand = brandSlug === 'lg' ? 'LG' : brandSlug === 'sony' ? 'Sony' : 'Samsung';
  return <div className="container py-5"><Link className="font-bold text-primary underline" href={`/services/${brandSlug}-tv-repair`}>{brand} model, repair options and estimate guide</Link></div>;
}

export default function BrandRepairHub({ page }) {
  const path = `/services/${page.slug}`;
  const url = siteConfig.url + path;
  return (
    <main className={styles.page}>
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`, name: page.h1, serviceType: `${page.brand} television repair`, description: page.description, url, provider: { '@id': entityIds.localBusiness }, areaServed: ['Delhi', 'Noida', 'Greater Noida', 'Ghaziabad'] },
        { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, url, name: page.h1, dateModified: page.reviewedAt, inLanguage: 'en-IN', isPartOf: { '@id': entityIds.website }, mainEntity: { '@id': `${url}#service` } },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url }, { '@type': 'ListItem', position: 2, name: 'TV Repair by Brand', item: `${siteConfig.url}/services/brands` }, { '@type': 'ListItem', position: 3, name: page.h1, item: url }] },
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
      ]} />
      <div className="container"><Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'TV Repair by Brand', href: '/services/brands' }, { label: page.h1 }]} /></div>
      <section className="bg-bgLight py-12 md:py-20">
        <div className={`container ${styles.hero}`}>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">Independent repair · Delhi NCR</p>
            <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-tight text-secondary">{page.h1}</h1>
            <p className="mt-6 text-lg font-bold leading-relaxed text-secondary">{page.answer}</p>
            <p className="mt-4 leading-relaxed text-textMuted">{page.intro}</p>
            <p className="mt-4 text-sm text-textMuted">Reviewed by GR Solution Editorial Team · 28 October 2026</p>
            <Link href="#request-diagnosis" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 font-black text-white">Request a {page.brand} diagnosis</Link>
          </div>
          <figure className={styles.photo}><Image src="/images/workshop-repair-bench.webp" alt="GR Solution workshop repair bench with TV panels and diagnostic equipment" width={1200} height={900} sizes="(min-width: 992px) 48vw, 100vw" priority /></figure>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-black text-secondary">Choose your {page.brand} repair service area</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-textMuted">Select your city for local booking details. Our workshop is in New Kondli, Delhi; these service areas are not separate physical branches.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => <Link className="rounded-xl border border-primary/20 bg-white p-5 font-black text-primary shadow-oldMd" key={city.slug} href={`${path}-${city.slug}`}>{page.brand} TV repair in {city.name} →</Link>)}
          </div>
        </div>
      </section>
      <section className="bg-bgLight py-12">
        <div className={`container ${styles.cards}`}>
          {page.sections.map((section) => <article key={section.title} className="min-w-0 rounded-2xl bg-white p-6 shadow-oldMd md:p-8"><h2 className="text-2xl font-black leading-tight text-secondary">{section.title}</h2>{section.paragraphs.map((text) => <p key={text} className="mt-4 leading-relaxed text-textMuted">{text}</p>)}</article>)}
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-black text-secondary">{page.brand} repair costs: compare the proposed work</h2>
          <p className="mt-4 max-w-4xl leading-relaxed text-textMuted">{page.priceNote}</p>
          <PriceTable rows={page.priceRows.map((index) => repairPriceBands[index])} caption={`${page.brand} component repair: indicative Delhi NCR market ranges by screen size`} />
          <p className="mt-4"><Link className="font-bold text-primary underline" href="/pricing">Full repair pricing, panel ranges and source methodology</Link></p>
        </div>
      </section>
      <section className="bg-bgLight py-12">
        <div className={`container ${styles.cards}`}>
          <div className="rounded-2xl bg-white p-6"><h2 className="text-2xl font-black text-secondary">{page.handoverTitle}</h2><ul className="mt-5 space-y-3 pl-5 text-textMuted">{page.handover.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-6 leading-relaxed text-textMuted">Request the part condition, full estimate, applicable warranty and a check of the original symptom before accepting completed work. For an active manufacturer warranty, confirm your options with the brand first.</p></div>
          <div className="rounded-2xl bg-white p-6"><h2 className="text-2xl font-black text-secondary">Read before approving a repair</h2><ul className="mt-5 grid gap-4">{page.guides.map((guide) => <li key={guide.href}><Link className="font-bold text-primary underline" href={guide.href}>{guide.label}</Link></li>)}</ul><p className="mt-6"><Link className="font-bold text-primary underline" href="/about">Meet the workshop and understand our repair process</Link></p><p className="mt-4"><Link className="font-bold text-primary underline" href="/contact">Contact GR Solution with your model and service locality</Link></p></div>
        </div>
      </section>
      <div className="container scroll-mt-28" id="request-diagnosis"><GuideBookingCTA contentId={page.slug} intent="visit" placement="brand_hub" /></div>
      <section className="py-12"><div className="container"><h2 className="mb-7 text-3xl font-black text-secondary">{page.brand} repair questions</h2><FAQ faqs={page.faqs} /></div></section>
      <section className="border-t border-slate-100 py-10"><div className="container"><h2 className="text-xl font-black text-secondary">Manufacturer references</h2><p className="mt-3 text-sm leading-relaxed text-textMuted">These resources explain model identification, display technology or manufacturer support. They do not imply that GR Solution is authorised by the brand.</p><ul className="mt-4 space-y-3">{page.sources.map((source) => <li key={source.href}><a className="font-bold text-primary underline" href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></div></section>
    </main>
  );
}
