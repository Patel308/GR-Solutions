'use client';

import { useState } from 'react';
import RepairBookingActions from './RepairBookingActions';
import RepairIcon from './RepairIcon';
import styles from './RepairLandingPage.module.css';

export default function RepairPlanner({ page }) {
  const [ready, setReady] = useState([]);
  const [selected, setSelected] = useState(page.plannerOptions?.[0]?.id);
  const option = page.plannerOptions?.find((item) => item.id === selected);
  return <section className={styles.planner} aria-labelledby="planner-heading" id="prepare">
    <div className="container">
      <div className={styles.sectionHeading}><span className={styles.eyebrow}>{page.kind === 'local' ? 'Plan a useful visit' : 'Start with what you see'}</span><h2 id="planner-heading">{page.plannerTitle}</h2><p>{page.plannerIntro}</p></div>
      {page.kind === 'local' ? <div className={styles.plannerGrid}>
        <fieldset className={styles.checklist}><legend className="sr-only">Details ready for your Dwarka repair enquiry</legend>{page.plannerItems.map((item, index) => <label key={item} className={styles.checkItem}><input type="checkbox" checked={ready.includes(index)} onChange={() => setReady((value) => value.includes(index) ? value.filter((i) => i !== index) : [...value, index])} /><span>{item}</span></label>)}</fieldset>
        <div className={styles.plannerResult}><span className={styles.counter} aria-live="polite">{ready.length}<span> / {page.plannerItems.length} details ready</span></span><h3>A clear handover starts here</h3><p>Have the available details ready when you contact us. Missing a model number or access detail? Explain what you know and we can discuss the next step.</p><p className={styles.smallText}>Ticking this checklist does not submit a request or confirm a visit.</p></div>
      </div> : <div>
        <div className={styles.choiceGrid} aria-label="Choose the Smart TV symptom">{page.plannerOptions.map((item) => <button type="button" aria-pressed={selected === item.id} aria-controls="smart-observation" key={item.id} className={`${styles.choice} ${selected === item.id ? styles.choiceActive : ''}`} onClick={() => setSelected(item.id)}><RepairIcon name={item.icon} /><span>{item.label}</span></button>)}</div>
        <div id="smart-observation" aria-live="polite" className={styles.observation}><span className={styles.eyebrow}>Useful information for diagnosis</span><h3>{option.heading}</h3><p>{option.text}</p><strong>{option.note}</strong></div>
      </div>}
      <RepairBookingActions contentId={page.slug} label={page.requestLabel} placement="planner" />
    </div>
  </section>;
}
