'use client';

import { useState } from 'react';
import RepairBookingActions from './RepairBookingActions';
import RepairIcon from './RepairIcon';
import styles from './RepairLandingPage.module.css';

export default function RepairPlanner({ page }) {
  const [ready, setReady] = useState([]);
  const [selected, setSelected] = useState(page.plannerOptions?.[0]?.id);
  const option = page.plannerOptions?.find((item) => item.id === selected);
  return <section className="section band-tint" aria-labelledby="planner-heading" id="prepare" data-section="repair_planner">
    <div className="container">
      <div className="section-head"><span className="eyebrow">{page.kind === 'local' ? 'Plan a useful visit' : 'Start with what you see'}</span><h2 id="planner-heading" className="mt-3">{page.plannerTitle}</h2><p className="lead mt-3">{page.plannerIntro}</p></div>
      {page.kind === 'local' ? <div className={styles.plannerGrid}>
        <fieldset className={styles.checklist}><legend className="sr-only">Details ready for your Dwarka repair enquiry</legend>{page.plannerItems.map((item, index) => <label key={item} className={styles.checkItem}><input type="checkbox" checked={ready.includes(index)} onChange={() => setReady((value) => value.includes(index) ? value.filter((i) => i !== index) : [...value, index])} /><span>{item}</span></label>)}</fieldset>
        <div className="card self-start p-5 sm:p-7"><span className={styles.counter} aria-live="polite">{ready.length}<span> / {page.plannerItems.length} details ready</span></span><h3>A clear handover starts here</h3><p className="mt-3 leading-relaxed text-body">Have the available details ready when you contact us. Missing a model number or access detail? Explain what you know and we can discuss the next step.</p><p className="mt-3 text-small text-muted">Ticking this checklist does not submit a request or confirm a visit.</p></div>
      </div> : <div>
        <div className={styles.choiceGrid} aria-label="Choose the Smart TV symptom">{page.plannerOptions.map((item) => <button type="button" aria-pressed={selected === item.id} aria-controls="smart-observation" key={item.id} className={`${styles.choice} ${selected === item.id ? styles.choiceActive : ''}`} onClick={() => setSelected(item.id)}><RepairIcon name={item.icon} /><span>{item.label}</span></button>)}</div>
        <div id="smart-observation" aria-live="polite" className={`card mt-5 p-5 sm:p-7 ${styles.observation}`}><span className="eyebrow">Useful information for diagnosis</span><h3 className="mt-3">{option.heading}</h3><p className="mt-3 leading-relaxed text-body">{option.text}</p><strong>{option.note}</strong></div>
      </div>}
      <RepairBookingActions contentId={page.slug} label={page.requestLabel} placement="planner" />
    </div>
  </section>;
}
