// Repair price bands shown on the cost guides and the /pricing page.
//
// ---------------------------------------------------------------------------
// WHAT THESE NUMBERS ARE
// ---------------------------------------------------------------------------
// These are Delhi NCR MARKET RANGES, researched from published Indian sources
// (listed in `pricingSources` below) and triangulated against each other. They
// are presented on the site as market ranges, not as a GR Solution rate card,
// and every table carries the "confirmed after inspection" caption.
//
// Method: where a source gave parts-only prices (Samsung Parts India panel list,
// Great Bharat Spares backlight list), a typical labour component was added.
// Where sources disagreed widely, the range was anchored on parts cost + labour
// rather than on the highest quote found. Outliers from outside India were
// discarded.
//
// When GR Solution settles its own rate card, replace these values directly.
// Any band set back to PRICING_PLACEHOLDER hides its whole table again and
// shows the inspection-based notice instead, so no half-filled grid can render.
// Bump `pricingReviewedOn` whenever the figures are re-checked.
// ---------------------------------------------------------------------------

export const PRICING_PLACEHOLDER = 'TODO';

/** Rendered as "not typically made at this size" instead of a price. */
export const NOT_APPLICABLE = 'N/A';

export const pricingReviewedOn = '2026-09-25';

/** Screen-size buckets used as the columns of every price table. */
export const sizeBands = ['32" - 43"', '44" - 55"', '56" and above'];

/**
 * Diagnosis. GR Solution's own policy is a free diagnosis (confirmed by the
 * business, 2026-09-25). `marketRange` is shown only as a comparison: Urban
 * Company lists a TV check-up from Rs 249 in Delhi NCR, and independent
 * repairers commonly charge up to around Rs 500.
 */
export const diagnosisPolicy = {
  label: 'Free',
  note: 'GR Solution diagnoses your TV free of charge and gives you a firm estimate before any paid work begins.',
  marketRange: '249 - 500',
};

/**
 * Board- and component-level repairs, total cost (part + labour), by size.
 * `bands` maps 1:1 onto `sizeBands`.
 */
export const repairPriceBands = [
  {
    fault: 'Backlight / LED strip replacement',
    symptom: 'Sound works but the screen is black or unevenly lit',
    bands: ['3,000 - 8,000', '5,500 - 12,000', '8,500 - 18,000'],
  },
  {
    fault: 'Power supply board repair or replacement',
    symptom: 'No power, or a blinking standby light',
    bands: ['1,000 - 3,500', '1,800 - 5,000', '2,500 - 6,500'],
  },
  {
    fault: 'Mainboard / motherboard repair',
    symptom: 'Boot loops, no input detection, random shutdowns',
    bands: ['2,000 - 5,500', '3,000 - 8,000', '4,500 - 12,500'],
  },
  {
    fault: 'T-Con board repair or replacement',
    symptom: 'Half screen, double image, vertical lines',
    bands: ['1,500 - 4,000', '2,500 - 6,500', '4,000 - 12,000'],
  },
  {
    fault: 'Audio / speaker circuit repair',
    symptom: 'No sound, distorted sound, one speaker dead',
    bands: ['800 - 2,500', '1,000 - 3,500', '1,500 - 5,000'],
  },
  {
    fault: 'HDMI / input port repair',
    symptom: 'One or all inputs not detected',
    bands: ['700 - 2,500', '1,000 - 3,000', '1,500 - 4,000'],
  },
  {
    fault: 'Software / firmware reset on smart TVs',
    symptom: 'Apps crashing, stuck on logo, interface frozen',
    bands: ['500 - 1,500', '500 - 2,000', '800 - 2,500'],
  },
];

/**
 * Panel and screen replacement, total cost (panel + fitting), by size.
 * Anchored on the Samsung Parts India display-panel list (Jan 2026).
 */
export const panelPriceBands = [
  {
    fault: 'LED panel replacement',
    symptom: 'Cracked glass or internal panel damage',
    bands: ['6,000 - 18,000', '17,000 - 28,000', '25,000 - 48,000'],
  },
  {
    fault: 'QLED panel replacement',
    symptom: 'Cracked or damaged quantum-dot panel',
    bands: ['12,000 - 17,000', '15,000 - 35,000', '27,000 - 85,000'],
  },
  {
    fault: 'OLED panel replacement',
    symptom: 'Physical damage or severe burn-in',
    bands: [NOT_APPLICABLE, '45,000 - 1,05,000', '62,000 - 1,30,000'],
  },
];

/** Published sources the ranges above were researched from. */
export const pricingSources = [
  {
    name: 'Urban Company, TV repair in Delhi NCR',
    url: 'https://www.urbancompany.com/delhi-ncr-tv-repair',
    used: 'Visit charge and typical overall repair spend in Delhi NCR',
  },
  {
    name: 'Samsung Parts India, TV display panel price list (Jan 2026)',
    url: 'https://samsung-parts.trackit.co.in/india/tv/display-panel-price-list',
    used: 'LED, QLED and OLED panel part prices by screen size',
  },
  {
    name: 'Great Bharat Spares, TV backlight replacement cost guide (Jun 2026)',
    url: 'https://greatbharatspares.com/blogs/tv-fault-diagnosis-center/tv-backlight-replacement-cost-guide',
    used: 'Backlight strip part prices by screen size',
  },
  {
    name: 'Aman Repairing, TV repair cost by problem (Delhi NCR)',
    url: 'https://amanrepairing.in/tv-repair-cost-by-problem/',
    used: 'Delhi NCR repair ranges for power board, backlight, T-Con, audio and HDMI',
  },
  {
    name: 'Serve Hyderabad, average TV repair cost (2026)',
    url: 'https://servehyderabad.com/what-is-the-average-cost-of-tv-repair-in-hyderabad/',
    used: 'Cross-check for board, software, audio and HDMI repair ranges',
  },
];

function isFilled(band) {
  return Boolean(band) && band !== PRICING_PLACEHOLDER;
}

/** True only when every band in the supplied rows holds a real value. */
export function hasRealPricing(rows) {
  return Array.isArray(rows) && rows.length > 0 && rows.every((row) => row.bands.every(isFilled));
}

