// Two supporting topics selected from the 25 October 2026 research briefs.
// These are editorial guides, not claimed repair case studies or technician certification.
import { repairPriceBands } from './pricing';

export const repairTrustGuides = [
  {
    slug: 'tv-motherboard-diagnosis',
    trustGuide: true,
    publishedAt: '2026-10-25',
    title: 'TV Motherboard Diagnosis: Evidence Before Replacement',
    h1: 'TV Motherboard Diagnosis: Check Before You Replace',
    metaTitle: 'TV Motherboard Diagnosis & Repair Cost Guide | GR Solution',
    metaDescription: 'A TV restart loop or dead HDMI port does not prove a bad motherboard. Learn safe checks, technician handover details and what to ask before replacement.',
    category: 'DIAGNOSIS GUIDE',
    primaryKeyword: 'tv motherboard repair cost',
    image: '/images/blog/tv-motherboard-diagnosis.webp',
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt: 'Illustration of an unplugged TV with separate power and main boards, model information and a diagnostic notebook',
    directAnswer: 'A TV stuck on its logo, restarting or losing HDMI input may have a motherboard fault, but those symptoms can also come from software, connected devices or the power supply. Record the model and repeatable symptoms, try only the manufacturer’s external checks, and ask what diagnostic evidence supports a board repair before approving replacement.',
    intro: 'The mainboard processes inputs, runs the TV software and controls many of its functions. It is not the same as the power supply board, a backlight driver or the display panel. Replacing it because a symptom sounds familiar can leave the original fault unresolved. This guide helps owners and repair mechanics organise observations and agree on the next diagnostic step; it does not replace a model-specific service manual or electrical safety training.',
    sections: [
      {
        heading: 'Start with a symptom record, not a replacement part',
        body: 'Write down what happens from a cold start: whether the standby indicator changes, whether a logo appears, whether audio continues and how long the TV runs before failing. Note whether the fault affects the TV’s own menu and built-in apps as well as an external source. A symptom that only affects one set-top box is a different starting point from a fault present on every input.',
        table: {
          caption: 'TV symptoms and the evidence still needed before blaming a mainboard',
          columns: ['Observation', 'Other possibilities', 'Useful next evidence'],
          rows: [
            ['Logo appears, then TV restarts', 'Software, external-device behaviour, unstable supply or a board fault', 'Timing of restarts; result with external devices disconnected'],
            ['One HDMI input has no picture', 'Source selection, cable, connected device, settings or that port', 'A known-working cable and source; whether the TV menu is visible'],
            ['Sound continues with a black screen', 'Backlight on suitable LCD/LED sets, display circuitry or other faults', 'Display technology; whether the built-in menu can be seen'],
            ['No standby indicator', 'Socket, power cord, supply or an internal fault', 'Safe socket/cord checks recommended for the exact model'],
            ['Apps freeze but broadcast TV works', 'App, network, storage or software issues', 'Which apps fail; installed software version; available official updates'],
          ],
          note: 'These are diagnostic branches, not fault probabilities. OLED TVs do not use the separate backlight found in LCD/LED TVs.',
        },
      },
      {
        heading: 'Safe checks before a technician opens the television',
        body: 'Use the support instructions for your exact model. Samsung’s no-power guide, for example, includes a 30-second unplugging step; do not assume one reset procedure suits every TV. If the television is updating, follow the manufacturer’s update instructions rather than interrupting power.',
        list: [
          'Check that the correct input is selected and that the external source is powered on.',
          'With devices switched off as their manuals require, disconnect optional HDMI and USB accessories, then check whether the TV’s own menu works.',
          'Try a known-working external cable or source if it is safe and accessible. Record the result rather than repeatedly changing settings.',
          'Use only official model-specific software instructions. Photograph settings you need before an advised reset, which may erase apps and preferences.',
          'Stop if there is a burning smell, liquid entry, damaged wiring or sparking. Arrange professional inspection; do not keep trying to start the TV.',
        ],
        closing: 'Do not remove the cover, bridge connections, heat a board or copy voltage tests from another model. Internal circuits can remain hazardous after unplugging. Wall-mounted sets should not be lifted or tilted by one person to reach a label.',
        links: [{ label: 'Read the TV restart-loop guide', href: '/blog/tv-keeps-restarting' }, { label: 'Explore sound-without-picture symptoms', href: '/blog/tv-sound-but-no-picture' }],
      },
      {
        heading: 'A diagnostic handover for TV repair mechanics',
        body: 'A useful handover separates what was observed from what was inferred. Record the full model suffix, display type and the customer’s account of the first failure. Reproduce the fault under documented conditions before proposing a part. Internal testing belongs with a qualified technician using the applicable service documentation and safe equipment.',
        list: [
          'Create separate fields for symptom, test conditions, result and interpretation. “Restarts after the logo” is an observation; “mainboard defective” is a conclusion requiring evidence.',
          'Check the relationship between the power supply, mainboard and display system using the exact model’s diagnostic information. A visually intact board does not establish that it works.',
          'Before ordering a replacement, verify the board part number and revision, model/panel compatibility and any required manufacturer configuration. A similar connector layout is insufficient.',
          'After the approved work, reproduce the original use case and check picture, audio, inputs and stability. Explain any functions or faults that were outside the repair scope.',
        ],
        closing: 'Ask the technician to explain the conclusion in plain language. A photograph of a board alone is not evidence that replacement is necessary.',
      },
      {
        heading: 'What changes TV motherboard repair cost?',
        body: 'There is no reliable universal motherboard price. Component repair and a complete board replacement are different jobs. The full TV model, board revision, part condition and availability, software requirements and other faults all affect the estimate. The published pricing guide gives indicative market ranges; it is not a fixed quote for your television.',
        table: {
          caption: 'Questions to compare TV mainboard repair estimates',
          columns: ['Ask about', 'What the estimate should clarify'],
          rows: [
            ['Diagnosis', 'Why the mainboard is implicated and what remains uncertain'],
            ['Proposed work', 'Component repair or replacement of the board assembly'],
            ['Replacement part', 'Matching part/revision and whether the part is new, refurbished or used'],
            ['Total payable', 'Parts, labour, transport, handling and any applicable taxes or additional charges'],
            ['Repair terms', 'Written coverage, exclusions and what happens if the same symptom returns'],
          ],
        },
        closing: 'GR Solution’s published policy provides free diagnosis and an estimate before paid repair work begins. Ask for visit availability and handling arrangements for your location. If the set may still be under manufacturer warranty, check that route before independent repair.',
        links: [{ label: 'Compare the published TV repair price bands', href: '/pricing' }, { label: 'Prepare for your repair visit', href: '/blog/prepare-for-doorstep-tv-repair' }],
      },
      {
        heading: 'Indicative mainboard repair prices by screen size',
        body: 'For a budget reference, the existing Delhi NCR pricing research places mainboard repair at about ₹2,000–₹12,500 across the screen sizes below. These market ranges were reviewed in September 2026; they are not a newly verified supplier price list, a fixed GR Solution charge or a promise that a complete replacement board fits the same range. Diagnosis and an actual parts quote still decide the cost.',
        priceTable: { rows: repairPriceBands.filter((row) => row.fault === 'Mainboard / motherboard repair'), caption: 'Indicative Delhi NCR mainboard repair prices, reviewed September 2026' },
      },
      {
        heading: 'Decide whether to repair after the fault is established',
        body: 'Compare the complete estimate with a genuinely comparable replacement TV, allowing for the current set’s age, panel condition, other faults and part availability. A repairable mainboard with a healthy panel is a different decision from a set needing both a board and a panel. No single percentage rule makes that choice for every owner.',
        closing: 'Before calling, prepare the model, screen size, city, symptom timeline and the external checks already tried. Share model-label photos privately with the repair provider rather than publishing serial numbers in comments or reviews.',
      },
    ],
    internalLinks: [
      { label: 'TV repair prices and free diagnosis policy', href: '/pricing' },
      { label: 'TV keeps restarting: symptom guide', href: '/blog/tv-keeps-restarting' },
      { label: 'TV will not turn on: safe checks', href: '/blog/tv-not-turning-on' },
      { label: 'Sound but no picture: other diagnostic routes', href: '/blog/tv-sound-but-no-picture' },
      { label: 'Repair or replace your TV?', href: '/blog/tv-repair-vs-replacement-guide' },
      { label: 'Prepare for a doorstep TV repair visit', href: '/blog/prepare-for-doorstep-tv-repair' },
      { label: 'LED TV repair service', href: '/services/led-tv-repair' },
      { label: 'Contact GR Solution', href: '/contact' },
    ],
    sources: [
      { label: 'Samsung India: what to do when a TV will not turn on', href: 'https://www.samsung.com/in/support/tv-audio-video/what-to-do-when-the-samsung-tv-is-not-turning-on/', note: 'External no-power checks for Samsung TVs. Procedures depend on the model.' },
      { label: 'Samsung India: product warranty information', href: 'https://www.samsung.com/in/support/warranty/', note: 'Check the applicable manufacturer terms before arranging independent work.' },
    ],
    faqs: [
      { question: 'Does a restart loop prove the TV motherboard has failed?', answer: 'No. Software, external devices, power supply issues and other internal faults can cause similar behaviour. A repeatable symptom and model-specific diagnosis are needed before replacing a board.' },
      { question: 'Can I identify a bad TV mainboard without opening the TV?', answer: 'External checks can narrow the problem and provide useful evidence, but they usually cannot confirm a failed internal board. Leave internal testing to a qualified technician.' },
      { question: 'Is the motherboard the same as the power board?', answer: 'No. The mainboard processes inputs and runs TV functions; the power board supplies operating power. Some designs combine functions, so the exact model matters.' },
      { question: 'Can GR Solution quote a motherboard repair from a symptom alone?', answer: 'A symptom alone is not enough for a firm repair quote. GR Solution provides free diagnosis and an estimate before paid work, with part suitability and availability checked for the television.' },
    ],
  },
  {
    slug: 'prepare-for-doorstep-tv-repair',
    trustGuide: true,
    publishedAt: '2026-10-25',
    title: 'Doorstep TV Repair: A Customer’s Visit Checklist',
    h1: 'Doorstep TV Repair: Your Visit Checklist',
    metaTitle: 'Doorstep TV Repair Visit Checklist | GR Solution',
    metaDescription: 'Know what to share when booking TV repair at home, what an estimate should include and what to check after repair in Delhi, Noida, Greater Noida and Ghaziabad.',
    category: 'CUSTOMER CHECKLIST',
    primaryKeyword: 'tv repair home service',
    image: '/images/blog/doorstep-tv-repair.webp',
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt: 'Illustration of a customer and TV repair technician discussing a model photo, estimate and final-check checklist at home',
    directAnswer: 'Before a doorstep TV repair visit, share the TV’s model, screen size, symptom, city and mounting details. Confirm visit availability and any handling or transport charges. After diagnosis, approve the scope and total estimate before paid work, then check the original fault, picture, sound and inputs before accepting completion.',
    intro: 'A clear repair process gives you something more useful than a promise that every TV can be fixed: you know what is being checked, what you are approving and what to do if the fault returns. This checklist is for households arranging independent TV repair in Delhi, Noida, Greater Noida and Ghaziabad. It also helps avoid a visit delayed by missing model information or inaccessible wall mounting.',
    sections: [
      {
        heading: 'First check whether the manufacturer should handle the repair',
        body: 'Find the purchase invoice and check the manufacturer’s warranty terms for your model and fault. If a warranty may apply, contact the manufacturer before commissioning independent repair. Coverage, exclusions and the effect of outside work depend on the applicable terms; do not assume all faults or accidental damage are covered.',
        closing: 'GR Solution is an independent TV repair provider. A brand name in a service description identifies the televisions discussed; it does not mean the business is that manufacturer’s authorised service centre.',
      },
      {
        heading: 'Send the details that make a visit easier to plan',
        body: 'A short, precise description is more useful than “screen problem”. Describe what first failed and whether the TV still produces sound, shows a menu or responds to its remote. A brief video can help show an intermittent symptom, but it does not confirm the failed part.',
        table: {
          caption: 'Information to share privately when requesting TV repair at home',
          columns: ['Detail', 'Why it helps', 'Example'],
          rows: [
            ['Full model and screen size', 'Identifies the display type and potential parts', 'Model-label photo and approximate purchase year'],
            ['Symptom and timing', 'Helps the technician plan diagnosis', 'Starts normally; picture disappears after ten minutes'],
            ['City and locality', 'Allows a realistic route and visit discussion', 'Noida, with the sector or neighbourhood'],
            ['Wall mounting and access', 'Shows whether handling help or access arrangements are needed', 'Wall bracket; limited space behind the TV'],
            ['Previous work or damage', 'Avoids missing a relevant part of the history', 'Earlier board replacement, liquid entry or impact'],
          ],
          note: 'Send your address and model-label photos through the private booking channel. Do not post personal details or serial numbers publicly.',
        },
      },
      {
        heading: 'Confirm arrangements before the technician travels',
        body: 'Request a visit rather than assuming an online enquiry reserves a time slot. Confirm availability for your locality, a suitable time window and how the technician will contact you. For a tower or gated community, explain entry rules, lift access and parking restrictions that affect carrying equipment or a large TV.',
        list: [
          'Explain whether the television is wall-mounted, on a stand or already removed. Do not attempt a heavy or awkward unmounting alone.',
          'Ask whether unmounting, remounting, transport or workshop handling may be needed and whether any of these carry a separate charge.',
          'Keep the remote and relevant connected device available so the original symptom can be demonstrated.',
          'Clear a safe working area. If there is liquid damage, sparking or a burning smell, stop using the TV and explain this when requesting help.',
        ],
        closing: 'GR Solution’s published diagnosis policy is free diagnosis with an estimate before paid repair work. Confirm the specific visit arrangements and any other applicable charges in advance. A symptom, locality or brand does not guarantee same-day repair or part availability.',
      },
      {
        heading: 'Approve a clear estimate, not just a part name',
        body: 'Ask what the diagnosis established and whether anything remains uncertain. “Panel problem” or “board problem” is not a complete scope of work. The estimate should distinguish repair from replacement and explain the proposed part, labour, handling and any other charges before work starts.',
        list: [
          'Ask for the total payable and what would trigger a revised estimate. Additional paid work should need your approval.',
          'If a replacement part is proposed, ask whether it is new, refurbished or used and how compatibility is checked.',
          'Confirm whether work can be completed at home or whether workshop testing is required. For collection, request a written receipt identifying the TV, accessories and visible condition.',
          'Request the repair-specific warranty or service terms in writing, including duration, exclusions and the process for reporting the same fault again. Do not assume a standard duration applies to every repair.',
        ],
        closing: 'If a panel replacement is costly or parts are scarce, compare the complete quote with a suitable replacement TV. You can ask questions or decline a repair after reviewing the estimate; do not approve work simply because a visit has occurred.',
        links: [{ label: 'Check motherboard diagnosis before replacing a board', href: '/blog/tv-motherboard-diagnosis' }, { label: 'Compare repair with replacement', href: '/blog/tv-repair-vs-replacement-guide' }],
      },
      {
        heading: 'Run these checks before accepting completion',
        body: 'Test the condition that originally caused trouble, rather than accepting a brief start-up screen as the only check. An intermittent issue may need longer observation; agree how an unresolved or recurring symptom will be handled. Only test inputs and features relevant to your TV and the approved repair.',
        table: {
          caption: 'External checks after an approved TV repair',
          columns: ['Check', 'What to confirm'],
          rows: [
            ['Original fault', 'Repeat the same source, app or use case that previously failed'],
            ['Picture', 'Watch normal content and the TV menu for the reported lines, flicker or loss of picture'],
            ['Sound', 'Confirm the intended speakers or sound system work at a comfortable volume'],
            ['Inputs and remote', 'Check the connected devices and remote functions involved in the repair'],
            ['Physical setup', 'Ask the technician to confirm safe stand or mounting arrangements and cable routing'],
            ['Documentation', 'Keep the invoice, approved work description, part details and written repair terms'],
          ],
        },
        closing: 'These checks help you confirm the agreed outcome; they cannot guarantee that an older television will never develop another fault. Keep a record of the repair date and report a recurrence promptly through the agreed contact channel.',
      },
      {
        heading: 'Request a visit with the right expectations',
        body: 'GR Solution serves Delhi, Noida, Greater Noida and Ghaziabad. Share the city, model and symptoms to discuss availability and inspection-based next steps. A phone conversation can help plan a visit, but a final diagnosis and firm estimate depend on checking the TV. There is no need to guess the failed component before you contact the service provider.',
      },
    ],
    internalLinks: [
      { label: 'Free diagnosis policy and indicative repair prices', href: '/pricing' },
      { label: 'TV motherboard diagnosis: evidence before replacement', href: '/blog/tv-motherboard-diagnosis' },
      { label: 'Compare repair with replacement', href: '/blog/tv-repair-vs-replacement-guide' },
      { label: 'Understand screen replacement costs', href: '/blog/tv-screen-replacement-cost-delhi-ncr' },
      { label: 'TV repair in Delhi', href: '/services/tv-repair-delhi' },
      { label: 'TV repair in Noida', href: '/services/tv-repair-noida' },
      { label: 'TV repair in Greater Noida', href: '/services/tv-repair-greater-noida' },
      { label: 'TV repair in Ghaziabad', href: '/services/tv-repair-ghaziabad' },
      { label: 'About the independent GR Solution team', href: '/about' },
      { label: 'Request TV repair guidance', href: '/contact' },
    ],
    sources: [
      { label: 'Samsung India: manufacturer warranty information', href: 'https://www.samsung.com/in/support/warranty/', note: 'An example of manufacturer-specific terms. Check your own brand, model, invoice and applicable coverage.' },
    ],
    faqs: [
      { question: 'What should I share when booking TV repair at home?', answer: 'Share the full model, screen size, symptom, city or locality and whether the TV is wall-mounted. Confirm availability, access requirements and any handling arrangements before the visit.' },
      { question: 'Is GR Solution an authorised manufacturer service centre?', answer: 'GR Solution is an independent TV repair provider. If manufacturer warranty may apply, check with the manufacturer before arranging independent work.' },
      { question: 'Does requesting free diagnosis confirm a visit?', answer: 'No. The team must confirm locality coverage, availability and visit arrangements. GR Solution’s published policy provides free diagnosis and an estimate before paid repair work begins.' },
      { question: 'Will every TV repair be completed at my home?', answer: 'No. The fault, safe access, equipment and part availability determine whether work can be completed at home or needs workshop handling. Confirm the proposed process and any charges before approval.' },
      { question: 'What should I check after a TV repair?', answer: 'Reproduce the original fault conditions, check picture, sound and relevant inputs, and keep the invoice, work description and written repair terms. Agree how any unresolved or recurring symptom will be reported.' },
    ],
  },
];

// Give existing symptom/cost guides a contextual route into the new checklists.
// Existing article copy, primary keywords, titles and canonical URLs stay intact.
export function getSupportingTrustGuides(article) {
  const path = `/blog/${article.slug}`;
  return repairTrustGuides.filter((guide) => guide.slug !== article.slug
    && !(article.internalLinks || []).some((link) => link.href === `/blog/${guide.slug}`) && (
    guide.internalLinks.some((link) => link.href === path)
    || (guide.slug === 'prepare-for-doorstep-tv-repair' && /cost|screen-repair|panel-repair/.test(article.slug))
  ));
}
