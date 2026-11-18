import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from './Breadcrumb';
import ContentTable from './ContentTable';
import JsonLd from './JsonLd';
import PriceTable from './PriceTable';
import RepairBookingActions from './RepairBookingActions';
import RepairPlanner from './RepairPlanner';
import { repairPriceBands } from '@/data/pricing';
import { entityIds, siteConfig } from '@/data/siteConfig';
import RepairIcon from './RepairIcon';
import { TrustBand } from './TrustStrip';
import SectionHead from './page/SectionHead';
import styles from './RepairLandingPage.module.css';

const discovery = {
  '/services/tv-repair-west-delhi': [{ href: '/services/tv-repair-dwarka', label: 'Dwarka visit planning and TV repair', detail: 'Sector, society access, mounting and estimate guidance for a Dwarka enquiry.' }],
  '/services/tv-repair-delhi': [{ href: '/services/tv-repair-dwarka', label: 'TV repair in Dwarka', detail: 'Plan the local visit with model and access details.' }, { href: '/services/smart-tv-repair', label: 'Smart TV apps, Wi-Fi and startup repair', detail: 'A focused service for smart-platform and connected-device complaints.' }],
  '/services/led-tv-repair': [{ href: '/services/smart-tv-repair', label: 'When the picture works but smart features fail', detail: 'Explore Smart TV app, network, input and startup diagnosis.' }],
  // 18 Nov 2026 (docs/index-coverage-2026-11-18.md): links into pages Google has
  // not crawled or indexed yet, from relevant indexed pages. Additions only.
  '/services/oled-qled-tv-repair': [{ href: '/services/smart-tv-repair', label: 'Smart TV apps, Wi-Fi and startup repair', detail: 'For premium sets where the panel is fine but apps, HDMI or startup misbehave.' }],
  '/services/tv-repair-noida': [{ href: '/services/smart-tv-repair', label: 'Smart TV apps, Wi-Fi and startup repair', detail: 'A focused service for smart-platform and connected-device complaints.' }],
  '/services/tv-repair-ghaziabad': [{ href: '/services/smart-tv-repair', label: 'Smart TV apps, Wi-Fi and startup repair', detail: 'A focused service for smart-platform and connected-device complaints.' }],
  '/services/tv-repair-near-me': [{ href: '/services/tv-repair-dwarka', label: 'TV repair in Dwarka', detail: 'Plan the local visit with sector, model and access details.' }, { href: '/services/smart-tv-repair', label: 'Smart TV apps, Wi-Fi and startup repair', detail: 'When the picture works but smart features fail.' }],
  '/services/tv-repair-south-delhi': [{ href: '/services/tv-repair-dwarka', label: 'TV repair in Dwarka', detail: 'South-west Delhi visit planning: sector, society access and mounting details.' }],
  '/services/sony-tv-repair-noida': [{ href: '/services/tv-repair-noida-sector-137', label: 'TV repair in Noida Sector 137', detail: 'Expressway high-rise societies: tower access and in-flat repairs.' }, { href: '/services/tv-repair-noida-sector-62', label: 'TV repair in Noida Sector 62', detail: 'Visit planning for Sector 62 and its neighbouring sectors.' }],
  '/services/led-tv-repair-noida': [{ href: '/services/tv-repair-noida-sector-137', label: 'TV repair in Noida Sector 137', detail: 'Expressway high-rise societies: tower access and in-flat repairs.' }, { href: '/services/tv-repair-noida-sector-62', label: 'TV repair in Noida Sector 62', detail: 'Visit planning for Sector 62 and its neighbouring sectors.' }],
};

// "More specific repair support" links, shown at the foot of the pages listed
// in `discovery`. Redesign card tiles (19 Nov 2026); link text and targets unchanged.
export function RepairPageLinks({ path }) {
  const links = discovery[path];
  if (!links) return null;
  return <section className="section band" data-section="repair_page_links"><div className="container"><SectionHead align="left" title="More specific repair support" className="mb-0" /><div className={`${styles.linkGrid} mt-6`}>{links.map((item) => <Link key={item.href} className="card card-interactive flex flex-col gap-2 p-5 text-ink sm:p-6" href={item.href}><strong className="text-[1.0625rem] leading-snug text-navy-700">{item.label} →</strong><span className="text-small leading-relaxed text-muted">{item.detail}</span></Link>)}</div></div></section>;
}

// Dwarka and Smart TV repair pages (data/repairLandingPages.js). 19 Nov 2026:
// moved onto the 2 Nov redesign (hero surface with the breadcrumb inside,
// eyebrow, H1, answer box, trust band, section bands, card/panel surfaces,
// redesign buttons and tokens, global heading styles). Restyle only: headings,
// copy, links, anchor text, ids, image alt text and JSON-LD are unchanged.
export default function RepairLandingPage({ page }) {
  const path = `/services/${page.slug}`, url = siteConfig.url + path;
  const breadcrumb = [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, ...(page.kind === 'local' ? [page.parent] : []), { label: page.h1 }];
  return <main className={styles.page}>
    <JsonLd data={[
      { '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`, name: page.h1, serviceType: page.kind === 'local' ? 'Doorstep television diagnosis and repair in Dwarka' : 'Smart TV app, connectivity, input and startup diagnosis and repair', description: page.description, url, provider: { '@id': entityIds.localBusiness }, areaServed: page.kind === 'local' ? { '@type': 'Place', name: 'Dwarka', containedInPlace: { '@type': 'City', name: 'Delhi' } } : ['Delhi', 'Noida', 'Greater Noida', 'Ghaziabad'] },
      { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, name: page.h1, url, inLanguage: 'en-IN', dateModified: page.reviewedAt, mainEntity: { '@id': `${url}#service` }, isPartOf: { '@id': entityIds.website } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumb.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: item.href ? siteConfig.url + item.href : url })) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ]} />
    <section className="hero-surface border-b border-line" data-section="repair_hero">
      <div className="container pb-10 pt-2 sm:pb-12 lg:pb-16 lg:pt-4">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-3 grid gap-8 lg:mt-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-14">
          <div><span className="eyebrow">{page.eyebrow}</span><h1 className="mt-3">{page.h1}</h1><p className="answer-box mt-5">{page.answer}</p><p className="mt-5 leading-relaxed text-body">{page.intro}</p><RepairBookingActions contentId={page.slug} label={page.requestLabel} /><p className="mt-3 text-small text-muted">Availability confirmed first · Estimate before paid work</p><div className={styles.trustStrip}>{[['fa-solid fa-magnifying-glass', 'Free diagnosis'], ['fa-solid fa-file-invoice', 'Approve the estimate'], ['fa-solid fa-screwdriver-wrench', 'Independent repair']].map(([icon, text]) => <span className={styles.trustItem} key={text}><RepairIcon name={icon} />{text}</span>)}</div></div>
          <figure className="relative m-0 mx-auto w-full min-w-0 max-w-[36rem] lg:max-w-none"><div className={styles.photoLabel}><RepairIcon name="fa-location-dot" />Our New Kondli workshop</div><div className="relative"><div className="absolute -inset-3 hidden rounded-[1.75rem] bg-gradient-to-br from-teal-100/60 via-transparent to-navy-100/70 lg:block" aria-hidden="true" /><Image src={page.photo} alt={page.photoAlt} width={page.photoWidth} height={page.photoHeight} sizes="(min-width: 992px) 48vw, 100vw" priority className="relative block h-auto w-full rounded-[1.25rem] shadow-card-hover ring-1 ring-black/5" /></div></figure>
        </div>
      </div>
    </section>
    <TrustBand />
    <nav aria-label="On this page" className={styles.quickNav}><div className="container">{[['#prepare', page.kind === 'local' ? 'Plan your visit' : 'Choose a symptom'], ['#repair-options', 'Repair options'], ['#estimate', 'Cost & estimate'], ['#questions', 'Questions']].map(([href, label]) => <a key={href} href={href}>{label}</a>)}</div></nav>
    <RepairPlanner page={{ kind: page.kind, slug: page.slug, requestLabel: page.requestLabel, plannerTitle: page.plannerTitle, plannerIntro: page.plannerIntro, plannerItems: page.plannerItems, plannerOptions: page.plannerOptions }} />
    <section className="section band" data-section="repair_facts"><div className="container"><SectionHead align="left" eyebrow="Know the service" title={page.kind === 'local' ? 'Dwarka service details, clearly explained' : 'What this Smart TV service covers'} /><div className={styles.factsGrid}><dl className={`card ${styles.facts}`}>{page.facts.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl><aside className="panel p-5 sm:p-7"><h3>{page.checklistTitle}</h3><ul className={styles.checkList}>{page.checklist.map((item) => <li key={item}><RepairIcon name="fa-check" /><span>{item}</span></li>)}</ul><p className="mt-6"><Link className="text-link" href="/about">See our workshop and repair process →</Link></p></aside></div></div></section>
    <section className="section band-tint" id="repair-options" data-section="repair_options"><div className="container"><SectionHead align="left" eyebrow="Diagnosis before parts" title={page.scopeTitle} lead={page.scopeIntro} /><div className={styles.cards}>{page.sections.map((section) => <article key={section.id} className="card min-w-0 p-5 sm:p-7"><span className="icon-tile icon-tile-teal" aria-hidden="true"><RepairIcon name={section.icon} /></span><h2 className="heading-panel mt-4">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 leading-relaxed text-body">{paragraph}</p>)}</article>)}</div></div></section>
    <section className="section band" data-section="repair_matrix"><div className="container"><SectionHead align="left" eyebrow="Make the fault repeatable" title={page.matrixTitle} className="mb-0" /><ContentTable table={page.matrix} /></div></section>
    <section className="section band-tint" id="estimate" data-section="repair_estimate"><div className="container"><SectionHead align="left" eyebrow="Understand the estimate" title={page.priceTitle} lead={page.priceIntro} /><PriceTable rows={page.priceRows.map((index) => repairPriceBands[index])} caption={`${page.h1}: indicative Delhi NCR component repair ranges by screen size`} /><div className={`${styles.factsGrid} mt-8`}><aside className="panel bg-white p-5 sm:p-7"><h3>What to agree before paid work</h3><ul className={styles.checkList}>{page.priceChecklist.map((item) => <li key={item}><RepairIcon name="fa-check" /><span>{item}</span></li>)}</ul></aside><div className="card min-w-0 p-5 sm:p-7"><h3>Compare the full repair, not just a part price</h3><p className="mt-3 leading-relaxed text-body">A listed component price may not be the fitted total. Ask what work is included, whether handling is needed and which warranty applies. If diagnosis points outside the television, that should be clear before a repair is sold.</p><p className="mt-3"><Link className="text-link inline-flex min-h-12 items-center" href="/pricing">Full TV repair price guide and sources →</Link></p><RepairBookingActions contentId={page.slug} label="Ask about an estimate" placement="estimate" /></div></div></div></section>
    <section className="section band" data-section="repair_process"><div className="container"><SectionHead align="left" eyebrow="A clear repair process" title={page.processTitle} /><ol className={styles.process}>{page.process.map((step, index) => <li key={step.title} className="panel p-5 sm:p-6"><span className={styles.step}>{index + 1}</span><h3>{step.title}</h3><p className="mb-0 mt-3 leading-relaxed text-body">{step.text}</p></li>)}</ol></div></section>
    <section className="section band-tint" data-section="repair_links"><div className="container"><SectionHead align="left" eyebrow="Related repair support" title="Choose the next page for your situation" className="mb-0" /><div className={`${styles.linkGrid} mt-6`}>{page.links.map((item) => <Link className="card card-interactive flex flex-col gap-2 p-5 text-ink sm:p-6" key={item.href} href={item.href}><strong className="text-[1.0625rem] leading-snug text-navy-700">{item.label} →</strong><span className="text-small leading-relaxed text-muted">{item.detail}</span></Link>)}</div></div></section>
    <section className="section band" id="questions" data-section="faq"><div className="container"><SectionHead align="left" eyebrow="Before you book" title={`${page.h1}: common questions`} className="mb-0" /><div className="mt-6 max-w-[850px]">{page.faqs.map((faq, index) => <details className={`card ${styles.faq}`} key={faq.question} open={index === 0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div></section>
    <section className="section band-tint" data-section="repair_closing"><div className="container"><div className="surface-dark rounded-[1.5rem] p-6 sm:p-9"><span className="eyebrow eyebrow-on-dark">GR Solution · Independent TV repair</span><h2 className="mt-4">{page.kind === 'local' ? 'Let’s plan your Dwarka repair visit' : 'Tell us what your Smart TV stops doing'}</h2><p className="mt-4 max-w-[760px] leading-relaxed text-navy-100">Share the model, symptom and location. We will discuss availability, diagnosis and the next step before you approve paid work.</p><RepairBookingActions contentId={page.slug} label={page.requestLabel} placement="closing" /><p className="mt-4 text-small text-navy-100">Prefer a written enquiry? <Link className="font-semibold text-white underline underline-offset-4" href="/contact">Open the contact page</Link>.</p></div></div></section>
    <footer className={styles.sources}><div className="container"><p className="text-small text-muted">Reviewed by GR Solution Editorial Team · 28 October 2026. Model-specific manufacturer guidance and the pricing source dates should be checked when arranging work.</p><ul>{page.sources.map((source) => <li key={source.href}><a className="text-link" href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></div></footer>
  </main>;
}
