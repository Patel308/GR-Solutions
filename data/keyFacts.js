// "Key facts" block shown near the top of every service, city and brand page.
//
// Why it exists: AI answer engines (ChatGPT, Perplexity, Google AI Mode) cite
// pages that state concrete facts -- prices, coverage, hours, warranty -- in a
// short, extractable form. /pricing is the most-cited page on the site for
// exactly that reason, so every money page now carries the same kind of facts.
//
// Everything here is derived from data that already exists (siteConfig and
// data/pricing.js). Do not add a claim here that is not confirmed elsewhere on
// the site. New pages get this block automatically through the page templates;
// to change what a TV type shows, edit `serviceFaultRows` below.

import { siteConfig } from './siteConfig';
import { diagnosisPolicy, repairPriceBands, sizeBands } from './pricing';

/** Date the key-facts block was added or last changed; feeds sitemap <lastmod>. */
export const keyFactsReviewedAt = '2026-11-17';

const FAULT = {
  backlight: 'Backlight / LED strip replacement',
  power: 'Power supply board repair or replacement',
  mainboard: 'Mainboard / motherboard repair',
  tcon: 'T-Con board repair or replacement',
  audio: 'Audio / speaker circuit repair',
  hdmi: 'HDMI / input port repair',
  software: 'Software / firmware reset on smart TVs',
};

// The faults that decide most enquiries for each TV type, most common first.
const serviceFaultRows = {
  'led-tv-repair': [FAULT.backlight, FAULT.power, FAULT.tcon, FAULT.mainboard],
  'oled-qled-tv-repair': [FAULT.mainboard, FAULT.power, FAULT.tcon, FAULT.software],
  'lcd-tv-repair': [FAULT.power, FAULT.backlight, FAULT.tcon, FAULT.mainboard],
  'plasma-tv-repair': [FAULT.power, FAULT.mainboard, FAULT.audio, FAULT.hdmi],
  'curved-tv-repair': [FAULT.backlight, FAULT.tcon, FAULT.power, FAULT.mainboard],
};

// Generic TV, near-me and brand pages: the five faults behind most TV repairs.
const defaultFaultRows = [FAULT.backlight, FAULT.power, FAULT.mainboard, FAULT.tcon, FAULT.software];

/** Price rows (from data/pricing.js) for a TV type, or the default set. */
export function getKeyFactPriceRows(serviceSlug) {
  const faults = serviceFaultRows[serviceSlug] || defaultFaultRows;
  return faults.map((fault) => repairPriceBands.find((row) => row.fault === fault)).filter(Boolean);
}

function formatHour(value) {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
}

function hoursLine() {
  const { days, opens, closes } = siteConfig.openingHours;
  const dayText = days.length === 7 ? 'Monday to Sunday' : days.join(', ');
  return `${dayText}, ${formatHour(opens)} to ${formatHour(closes)}`;
}

function areaLine(cityName) {
  const areas = siteConfig.serviceAreas.filter((area) => area !== 'Delhi NCR');
  if (!cityName || cityName === 'Delhi NCR' || !areas.includes(cityName)) {
    return `Doorstep visits across ${areas.slice(0, -1).join(', ')} and ${areas.at(-1)}`;
  }
  const others = areas.filter((area) => area !== cityName);
  return `Doorstep visits across ${cityName}, plus ${others.slice(0, -1).join(', ')} and ${others.at(-1)}`;
}

/**
 * Facts for one page. Returns [{ label, value }], in display order.
 * `brand` adds an independence note so no page implies authorised status.
 */
export function getKeyFacts({ serviceSlug, cityName, brand } = {}) {
  const rows = getKeyFactPriceRows(serviceSlug);
  const lead = rows[0];
  const facts = [
    { label: 'Diagnosis', value: `${diagnosisPolicy.label}. You get a firm estimate before any paid work starts.` },
  ];
  if (lead) {
    facts.push({
      label: 'Most common repair',
      value: `${lead.fault}: about ₹${lead.bands[0]} on ${sizeBands[0]} TVs, ₹${lead.bands[1]} on ${sizeBands[1]} (Delhi NCR market range, parts and labour).`,
    });
  }
  facts.push({ label: 'Service area', value: areaLine(cityName) });
  if (cityName && (siteConfig.sameDayVisitAreas || []).includes(cityName)) {
    facts.push({ label: 'Same-day visits', value: `Same-day doorstep visits are available across ${cityName}. We confirm the time slot when you call.` });
  }
  facts.push(
    { label: 'Hours', value: hoursLine() },
    { label: 'Warranty', value: '90-day service warranty on the repair, where applicable. Terms are confirmed with your estimate.' },
  );
  if (brand) {
    facts.push({
      label: 'Who repairs it',
      value: `GR Solution is an independent TV repair service, not an authorised ${brand} service centre.`,
    });
  }
  return facts;
}
