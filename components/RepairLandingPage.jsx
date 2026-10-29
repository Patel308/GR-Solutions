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
import styles from './RepairLandingPage.module.css';

const discovery = {
  '/services/tv-repair-west-delhi': [{ href: '/services/tv-repair-dwarka', label: 'Dwarka visit planning and TV repair', detail: 'Sector, society access, mounting and estimate guidance for a Dwarka enquiry.' }],
  '/services/tv-repair-delhi': [{ href: '/services/tv-repair-dwarka', label: 'TV repair in Dwarka', detail: 'Plan the local visit with model and access details.' }, { href: '/services/smart-tv-repair', label: 'Smart TV apps, Wi-Fi and startup repair', detail: 'A focused service for smart-platform and connected-device complaints.' }],
  '/services/led-tv-repair': [{ href: '/services/smart-tv-repair', label: 'When the picture works but smart features fail', detail: 'Explore Smart TV app, network, input and startup diagnosis.' }],
};

export function RepairPageLinks({ path }) {
  const links = discovery[path];
  if (!links) return null;
  return <section className="py-12"><div className="container"><h2 className="text-2xl font-black text-secondary">More specific repair support</h2><div className={styles.linkGrid}>{links.map((item) => <Link key={item.href} className={styles.linkCard} href={item.href}><strong>{item.label} →</strong><span>{item.detail}</span></Link>)}</div></div></section>;
}

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
    <div className="container"><Breadcrumb items={breadcrumb} /></div>
    <section className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div><span className={styles.eyebrow}>{page.eyebrow}</span><h1>{page.h1}</h1><p className={styles.answer}>{page.answer}</p><p className={styles.intro}>{page.intro}</p><RepairBookingActions contentId={page.slug} label={page.requestLabel} /><p className={styles.smallText}>Availability confirmed first · Estimate before paid work</p><div className={styles.trustStrip}>{[['fa-solid fa-magnifying-glass', 'Free diagnosis'], ['fa-solid fa-file-invoice', 'Approve the estimate'], ['fa-solid fa-screwdriver-wrench', 'Independent repair']].map(([icon, text]) => <span className={styles.trustItem} key={text}><RepairIcon name={icon} />{text}</span>)}</div></div>
        <figure className={styles.photo}><div className={styles.photoLabel}><RepairIcon name="fa-location-dot" />Our New Kondli workshop</div><Image src={page.photo} alt={page.photoAlt} width={page.photoWidth} height={page.photoHeight} sizes="(min-width: 992px) 48vw, 100vw" priority /></figure>
      </div>
    </section>
    <nav aria-label="On this page" className={styles.quickNav}><div className="container">{[['#prepare', page.kind === 'local' ? 'Plan your visit' : 'Choose a symptom'], ['#repair-options', 'Repair options'], ['#estimate', 'Cost & estimate'], ['#questions', 'Questions']].map(([href, label]) => <a key={href} href={href}>{label}</a>)}</div></nav>
    <RepairPlanner page={{ kind: page.kind, slug: page.slug, requestLabel: page.requestLabel, plannerTitle: page.plannerTitle, plannerIntro: page.plannerIntro, plannerItems: page.plannerItems, plannerOptions: page.plannerOptions }} />
    <section className={styles.section}><div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Know the service</span><h2>{page.kind === 'local' ? 'Dwarka service details, clearly explained' : 'What this Smart TV service covers'}</h2></div><div className={styles.factsGrid}><dl className={styles.facts}>{page.facts.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl><aside className={styles.checkPanel}><h3>{page.checklistTitle}</h3><ul>{page.checklist.map((item) => <li key={item}><RepairIcon name="fa-check" /><span>{item}</span></li>)}</ul><p className="mt-6"><Link className="font-bold text-primary underline" href="/about">See our workshop and repair process →</Link></p></aside></div></div></section>
    <section className={styles.mutedSection} id="repair-options"><div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Diagnosis before parts</span><h2>{page.scopeTitle}</h2><p>{page.scopeIntro}</p></div><div className={styles.cards}>{page.sections.map((section) => <article key={section.id} className={styles.card}><RepairIcon name={section.icon} className={styles.cardIcon} /><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>)}</div></div></section>
    <section className={styles.section}><div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Make the fault repeatable</span><h2>{page.matrixTitle}</h2></div><ContentTable table={page.matrix} /></div></section>
    <section className={styles.mutedSection} id="estimate"><div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Understand the estimate</span><h2>{page.priceTitle}</h2><p>{page.priceIntro}</p></div><PriceTable rows={page.priceRows.map((index) => repairPriceBands[index])} caption={`${page.h1}: indicative Delhi NCR component repair ranges by screen size`} /><div className={`${styles.factsGrid} mt-8`}><aside className={styles.checkPanel}><h3>What to agree before paid work</h3><ul>{page.priceChecklist.map((item) => <li key={item}><RepairIcon name="fa-check" /><span>{item}</span></li>)}</ul></aside><div className={styles.card}><h3>Compare the full repair, not just a part price</h3><p>A listed component price may not be the fitted total. Ask what work is included, whether handling is needed and which warranty applies. If diagnosis points outside the television, that should be clear before a repair is sold.</p><p><Link className="font-bold text-primary underline" href="/pricing">Full TV repair price guide and sources →</Link></p><RepairBookingActions contentId={page.slug} label="Ask about an estimate" placement="estimate" /></div></div></div></section>
    <section className={styles.section}><div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>A clear repair process</span><h2>{page.processTitle}</h2></div><ol className={styles.process}>{page.process.map((step, index) => <li key={step.title}><span className={styles.step}>{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></div></section>
    <section className={styles.mutedSection}><div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Related repair support</span><h2>Choose the next page for your situation</h2></div><div className={styles.linkGrid}>{page.links.map((item) => <Link className={styles.linkCard} key={item.href} href={item.href}><strong>{item.label} →</strong><span>{item.detail}</span></Link>)}</div></div></section>
    <section className={styles.section} id="questions"><div className="container"><div className={styles.sectionHeading}><span className={styles.eyebrow}>Before you book</span><h2>{page.h1}: common questions</h2></div>{page.faqs.map((faq, index) => <details className={styles.faq} key={faq.question} open={index === 0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>
    <section className={styles.section}><div className="container"><div className={styles.closing}><span className="text-sm font-bold text-sky-200">GR Solution · Independent TV repair</span><h2 className="mt-4">{page.kind === 'local' ? 'Let’s plan your Dwarka repair visit' : 'Tell us what your Smart TV stops doing'}</h2><p>Share the model, symptom and location. We will discuss availability, diagnosis and the next step before you approve paid work.</p><RepairBookingActions contentId={page.slug} label={page.requestLabel} placement="closing" /><p className={styles.smallText}>Prefer a written enquiry? <Link className="font-bold text-white underline" href="/contact">Open the contact page</Link>.</p></div></div></section>
    <footer className={styles.sources}><div className="container"><p className={styles.smallText}>Reviewed by GR Solution Editorial Team · 28 October 2026. Model-specific manufacturer guidance and the pricing source dates should be checked when arranging work.</p><ul>{page.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></div></footer>
  </main>;
}
