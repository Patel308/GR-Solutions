// Out-of-warranty notes for brand pages where search demand is mostly
// "<brand> service center" (people who want the authorised centre) but many
// searchers own a TV that is already out of warranty.
//
// Evidence (18 Nov 2026):
// - GSC 90d, /services/sony-tv-repair-noida: ~990 impressions, 4 clicks across
//   "sony tv repair noida", "sony tv service center", "sony service center near me",
//   "sony tv service center/centre noida" (positions 6-10).
// - Keyword Planner (India): "sony service center noida" 880/mo (+51% in 3 months),
//   "sony tv repair noida" 390, "sony tv service center noida" 210,
//   "sony led tv repair" 5,400 (+656% YoY).
// - Otterly, "Sony TV repair in Noida out of warranty" (17 Nov): engines name Sony's
//   official support for warranty cases, then independent repairers that say plainly
//   they handle out-of-warranty Sony TVs and are not authorised.
//
// Rules: say plainly GR Solution is independent and not brand-authorised; send
// warranty cases to the manufacturer; state only facts already published on the
// site (free diagnosis, estimate before paid work, 90-day service warranty where
// applicable). Rendered by components/BrandWarrantyNote.jsx without heading tags.
import { diagnosisPolicy } from './pricing';

const notes = {
  sony: {
    label: 'Out-of-warranty Sony TV repair',
    lead: (city) => `Sony TV out of warranty in ${city}? GR Solution repairs out-of-warranty Sony Bravia LED, Android TV and Google TV sets at home across ${city}. We are an independent repairer, not a Sony-authorised service centre.`,
    points: [
      'Still under warranty or a Sony extended plan: book through Sony India’s official support first, because an independent repair can affect that cover.',
      `Out of warranty: diagnosis is ${diagnosisPolicy.label.toLowerCase()}, and you get a firm estimate before any paid work starts, with a 90-day service warranty where applicable.`,
      'Before you call, note the model number from the label on the back (Sony TV models usually start with KD, KDL or XR) and the screen size.',
      'If the standby light blinks red, count the blinks and tell us. Many Bravia models signal the type of fault this way, which helps us bring the right part.',
    ],
    guide: { label: 'Authorised service centre or local repair: how to decide', href: '/blog/authorised-service-centre-vs-local-tv-repair' },
    // Snippet aimed at out-of-warranty owners; titles and H1s are unchanged.
    // Kept under 160 characters for every city so nothing gets trimmed mid-phrase.
    metaDescription: (city) => `Out-of-warranty Sony Bravia TV repair in ${city}: free diagnosis, written estimate and 90-day service warranty. Independent, not a Sony service centre.`,
  },
};

export function getBrandWarrantyNote(brandSlug) {
  return notes[brandSlug] || null;
}
