// Two decision guides chosen from the 17 November 2026 AI-visibility research:
// - Otterly query fan-outs: ChatGPT, Google and Google AI Mode follow "best TV
//   repair in Delhi NCR" with searches about how to choose a repair service,
//   authorised service centre vs local repair, warranty and repair time.
// - Otterly citations: AI answers already cite guides on these questions
//   (Reliance Digital, Mannubhai, Samsung India warranty, Quora "company or
//   local service").
// - Google Ads Keyword Planner (India): "samsung service center near me"
//   135,000/mo, "samsung service center" 90,500, "sony service center" 18,100,
//   "lg service center" 18,100, "tv repair shop near me" 33,100.
// Editorial guides, not case studies. Manufacturer facts are limited to what the
// cited Samsung India pages state; prices come from data/pricing.js.
import { repairPriceBands, diagnosisPolicy } from './pricing';

const priceRows = (...faults) => repairPriceBands.filter((row) => faults.includes(row.fault));
// Price band for the smallest screen-size bucket (32"–43"), e.g. "3,000 - 8,000".
const smallScreenBand = (fault) => repairPriceBands.find((row) => row.fault === fault)?.bands[0] || '';

export const decisionGuides = [
  {
    slug: 'authorised-service-centre-vs-local-tv-repair',
    trustGuide: true,
    // Do not displace the scored "Related guides" cards existing articles already show.
    excludeFromRelated: true,
    publishedAt: '2026-11-17',
    title: 'Authorised Service Centre vs Local TV Repair',
    h1: 'Authorised Service Centre vs Local TV Repair: Which Should You Call?',
    metaTitle: 'Service Centre vs Local TV Repair: Cost & Warranty',
    metaDescription: 'Under warranty, use the brand’s authorised service centre. Out of warranty, compare it with an independent repairer on diagnosis, parts, price and repair terms.',
    category: 'DECISION GUIDE',
    primaryKeyword: 'authorised service centre vs local tv repair',
    // Real photo of GR Solution's independent workshop (shared with the home page gallery).
    image: '/images/workshop-repair-bench.webp',
    imageWidth: 1200,
    imageHeight: 900,
    imageAlt: 'GR Solution’s independent TV repair workshop in New Kondli, Delhi, with televisions on padded repair benches',
    directAnswer: 'If your TV is still under the manufacturer’s warranty, contact the brand’s authorised service centre first. Samsung India, for example, states that repair attempts by third parties are not covered by its warranty. Once the warranty has ended, compare the authorised centre with an independent repairer on the diagnosis, whether the part will be repaired or replaced, the total price and the written repair terms, and choose the clearer offer.',
    intro: 'Many people searching for a Samsung, Sony or LG “service center” really want one thing: a working TV at a fair price. The right route depends mostly on warranty status, then on the fault and the estimate. This guide explains when to stay with the manufacturer, when an independent repairer can make sense, and what to ask either of them before approving work. GR Solution is an independent TV repair provider in Delhi NCR, not an authorised service centre for any brand.',
    sections: [
      {
        heading: 'Step one: check whether the TV is still under warranty',
        body: 'Find the purchase invoice and the warranty card, then check the brand’s own warranty terms for your model. Standard TV warranty periods are set by each manufacturer, and some brands sell or bundle extended plans. Samsung India lists a 12-month standard warranty for its LED and other TVs, and a three-year programme (one year standard plus two years additional) on selected models.',
        list: [
          'Note the purchase date on the invoice and any extended-warranty registration you completed.',
          'Look up the terms on the manufacturer’s official website or app, not on a listing or advert.',
          'If the TV may still be covered, raise the request with the manufacturer before anyone opens it.',
        ],
        closing: 'Samsung India states that “repair due to misuse/third party repair attempts are not covered in warranty”. Other brands publish their own conditions, so read the warranty card for your model. While coverage may apply, an independent repair can cost you that coverage.',
      },
      {
        heading: 'Authorised service centre or independent repairer: how they compare',
        body: 'Both routes can fix a television. They differ in how warranty, charges and repair terms work. Use the table to compare the offers you receive, not to assume one route is always cheaper.',
        table: {
          caption: 'Authorised service centre vs independent TV repair',
          columns: ['Question', 'Brand authorised service centre', 'Independent repairer (for example GR Solution)'],
          rows: [
            ['Best suited to', 'TVs under manufacturer warranty or an active extended plan', 'TVs out of warranty, older models, or a second opinion on an estimate'],
            ['Effect on manufacturer warranty', 'Keeps warranty claims with the manufacturer', 'Can affect coverage if the TV is still under warranty; check the brand’s terms first'],
            ['Inspection or visit charge', 'Samsung India: a visiting charge towards inspection applies “as applicable”; check your brand', `GR Solution: diagnosis is ${diagnosisPolicy.label.toLowerCase()}, with an estimate before any paid work`],
            ['Out-of-warranty pricing', 'Samsung India publishes out-of-warranty labour charges; parts and taxes are extra', 'Ask for parts, labour and any handling charges in one written estimate'],
            ['Type of repair', 'Ask whether the board or panel will be repaired or replaced', 'Ask whether the board or panel will be repaired or replaced'],
            ['After the repair', 'Samsung India: limited warranty on repaired parts with the repair invoice', 'GR Solution: 90-day service warranty where applicable, confirmed with the estimate'],
          ],
          note: 'Samsung details are taken from Samsung India’s published warranty and out-of-warranty pages (see sources). Other manufacturers’ terms differ.',
        },
      },
      {
        heading: 'When an independent repair is worth comparing',
        body: 'After the warranty ends, an independent repairer can be worth a quote when the panel is intact and the fault sits in a board, the backlight or the power supply. These parts can often be repaired or replaced without changing the whole display. A physically cracked panel is different: replacement is the most expensive TV repair and is often not economical.',
        list: [
          'The authorised centre has quoted a full board or panel replacement and you want a second opinion.',
          'The model is several years old and the manufacturer quote is close to the price of a new TV.',
          'The symptom suggests a common, repairable fault, for example sound with a black screen (often the backlight) or no power (often the power supply board).',
        ],
        closing: 'Typical Delhi NCR market ranges for these repairs are shown below. They are indicative ranges researched from published sources, not a fixed quote.',
        priceTable: {
          rows: priceRows('Backlight / LED strip replacement', 'Power supply board repair or replacement', 'Mainboard / motherboard repair', 'T-Con board repair or replacement'),
          caption: 'Indicative Delhi NCR repair prices for common out-of-warranty faults',
        },
        links: [{ label: 'Full price guide and sources', href: '/pricing' }, { label: 'Repair or replace your TV?', href: '/blog/tv-repair-vs-replacement-guide' }],
      },
      {
        heading: 'Reach the real authorised service centre',
        body: 'Searches for a brand “service center” return a mix of official support, booking platforms and independent repairers. If you want the manufacturer, use the support pages or app on the brand’s official website to book. A business that only calls itself a “service center” is not necessarily authorised by the brand. GR Solution says plainly that it is independent, and so should any repairer you call.',
        list: [
          'Book through the manufacturer’s official website, app or the contact details printed on the warranty card.',
          'Ask any provider directly: “Are you authorised by the brand?” and, if yes, how you can confirm it.',
          'Do not share OTPs or make advance payments to secure a manufacturer booking.',
        ],
      },
      {
        heading: 'Questions to ask before approving any repair',
        body: 'The same questions work for an authorised centre and an independent repairer. Clear answers are a better guide than a brand name or a low headline price.',
        table: {
          caption: 'Questions to ask before approving a TV repair',
          columns: ['Ask', 'Why it matters'],
          rows: [
            ['What exactly has failed, and how did you confirm it?', 'A symptom alone does not prove which part has failed'],
            ['Will the part be repaired or replaced, and is the replacement new, refurbished or used?', 'This changes the price and how long the repair lasts'],
            ['What is the total: parts, labour, visit, transport and taxes?', 'Headline labour or part prices may leave out other charges'],
            ['What do the repair terms cover, for how long, and what is excluded?', 'Ask for the terms in writing with the invoice'],
            ['Will the work be done at home or in a workshop?', 'Some faults need workshop handling; confirm transport and timing'],
          ],
        },
        closing: 'If you are in Delhi, Noida, Greater Noida or Ghaziabad and the TV is out of warranty, GR Solution can diagnose it free and give a firm estimate before any paid work, so you can compare it with the manufacturer’s quote.',
        links: [{ label: 'TV repair in Delhi', href: '/services/tv-repair-delhi' }, { label: 'Book a free diagnosis', href: '/contact' }],
      },
    ],
    internalLinks: [
      { label: 'TV repair prices and free diagnosis policy', href: '/pricing' },
      { label: 'How to choose a TV repair service in Delhi NCR', href: '/blog/how-to-choose-tv-repair-service-delhi-ncr' },
      { label: 'Repair or replace your TV?', href: '/blog/tv-repair-vs-replacement-guide' },
      { label: 'TV motherboard diagnosis: evidence before replacement', href: '/blog/tv-motherboard-diagnosis' },
      { label: 'Samsung TV repair in Delhi', href: '/services/samsung-tv-repair-delhi' },
      { label: 'Sony TV repair in Noida', href: '/services/sony-tv-repair-noida' },
      { label: 'LG TV repair in Delhi', href: '/services/lg-tv-repair-delhi' },
      { label: 'Contact GR Solution', href: '/contact' },
    ],
    sources: [
      { label: 'Samsung India: product warranty information', href: 'https://www.samsung.com/in/support/warranty/', note: 'Standard TV warranty period, selected-model extended programme, third-party repair exclusion and visiting charge.' },
      { label: 'Samsung India: out-of-warranty repair charges', href: 'https://www.samsung.com/in/support/out-of-warranty-repair-charges/', note: 'Published labour charges; taxes, transport and parts are extra.' },
    ],
    faqs: [
      { question: 'Should I take my TV to the authorised service centre or a local repair shop?', answer: 'If the TV is under the manufacturer’s warranty, contact the authorised service centre first, because independent repair can affect coverage. Once the warranty has ended, compare both on the diagnosis, the total price and the written repair terms.' },
      { question: 'Does a local TV repair void my warranty?', answer: 'It can. Samsung India, for example, states that third-party repair attempts are not covered by its warranty. Check your own brand’s terms before an independent repairer opens a TV that may still be covered.' },
      { question: 'Is GR Solution an authorised service centre?', answer: 'No. GR Solution is an independent TV repair provider in Delhi NCR. It repairs out-of-warranty TVs of all major brands and recommends the manufacturer route while warranty may apply.' },
      { question: 'Is an independent TV repair cheaper than the service centre?', answer: 'Not always. It depends on the fault, the part and whether it is repaired or replaced. Get a written total from both and compare like for like.' },
      { question: 'What does a diagnosis cost?', answer: `Manufacturers set their own visiting and inspection charges; Samsung India applies a visiting charge “as applicable”. GR Solution’s diagnosis is ${diagnosisPolicy.label.toLowerCase()}, with a firm estimate before any paid work.` },
    ],
  },
  {
    slug: 'how-to-choose-tv-repair-service-delhi-ncr',
    trustGuide: true,
    // Do not displace the scored "Related guides" cards existing articles already show.
    excludeFromRelated: true,
    publishedAt: '2026-11-17',
    title: 'How to Choose a TV Repair Service in Delhi NCR',
    h1: 'How to Choose a TV Repair Service in Delhi NCR',
    metaTitle: 'How to Choose a TV Repair Service in Delhi NCR',
    metaDescription: 'A 7-point checklist for choosing a TV repair service in Delhi NCR: diagnosis, written estimate, parts, repair warranty, repair time and red flags to avoid.',
    category: 'BUYER’S CHECKLIST',
    primaryKeyword: 'how to choose a tv repair service',
    // Landscape crop of the real workshop photo /images/workshop-tv-diagnosis.webp.
    image: '/images/blog/how-to-choose-tv-repair-service-delhi-ncr.webp',
    imageWidth: 720,
    imageHeight: 480,
    imageAlt: 'GR Solution technician opening the back panel of a TV at the workshop to diagnose the fault',
    directAnswer: 'Choose a TV repair service that diagnoses the fault before quoting, gives a written estimate covering parts, labour and any visit charge, tells you whether parts will be repaired or replaced, and puts its repair warranty in writing. Avoid anyone who asks for advance payment before diagnosis, will not name what has failed, or claims to be a brand’s authorised centre without proof.',
    intro: 'A TV repair goes wrong in predictable ways: a part replaced on a guess, a bill that grows after the work starts, or a “warranty” nobody wrote down. Most of these can be avoided before you approve anything, with a few direct questions. This checklist works for any provider in Delhi, Noida, Greater Noida or Ghaziabad, including GR Solution.',
    sections: [
      {
        heading: 'The 7-point checklist',
        body: 'Use these checks on the phone and at the visit. A good provider answers them without hesitation.',
        table: {
          caption: 'Seven checks before you choose a TV repair service',
          columns: ['Check', 'What a good answer looks like'],
          rows: [
            ['1. Diagnosis before quote', 'The technician checks the TV, names the failed part and explains how it was confirmed'],
            ['2. Diagnosis charge stated upfront', `Any visit or inspection fee is stated before the visit (GR Solution: ${diagnosisPolicy.label.toLowerCase()})`],
            ['3. Written total estimate', 'Parts, labour, transport and taxes in one figure, approved by you before work starts'],
            ['4. Repair or replace, new or used', 'You are told whether the board or panel is repaired or replaced, and the part’s condition'],
            ['5. Repair warranty in writing', 'Duration, what is covered (part, labour or both) and exclusions, on the invoice'],
            ['6. Where and how long', 'Whether the job is done at home or in a workshop, and what decides the timing'],
            ['7. Honest about warranty and status', 'Tells you to use the manufacturer if your TV may still be covered, and does not claim to be authorised if it is not'],
          ],
        },
        links: [{ label: 'Authorised service centre vs local repair', href: '/blog/authorised-service-centre-vs-local-tv-repair' }],
      },
      {
        heading: 'What to tell the repair service when you call',
        body: 'Clear details get you a more useful first answer and help the technician bring the right equipment.',
        list: [
          'Brand, full model number (from the label on the back) and screen size.',
          'The symptom and when it started: no power, sound but no picture, lines, restarts, app or HDMI problems.',
          'Whether sound works and whether the standby light comes on.',
          'Your locality, and whether the TV is wall-mounted.',
          'Whether the TV is still under warranty, with the purchase date.',
        ],
        links: [{ label: 'Prepare for a doorstep repair visit', href: '/blog/prepare-for-doorstep-tv-repair' }],
      },
      {
        heading: 'Red flags to avoid',
        body: 'One of these alone is a reason to slow down. Two or more is a reason to call someone else.',
        list: [
          'Asks for advance payment before anyone has seen the TV.',
          'Quotes a firm price for a specific part from a phone description alone.',
          'Cannot or will not say which part has failed and how it was tested.',
          'Starts work, or adds parts, without your approval of the total.',
          'Calls itself a brand’s “authorised service center” but cannot show how you can verify it.',
          'Offers a repair warranty only verbally.',
          'Pushes a full panel replacement without showing why the backlight or boards are ruled out.',
        ],
      },
      {
        heading: 'What a fair estimate looks like',
        body: 'Prices depend on the fault and screen size. The common faults below cover most TV repairs that are worth doing, so use these ranges to judge whether an estimate is in a reasonable band. They are Delhi NCR market ranges researched from published sources, not a fixed quote.',
        priceTable: {
          rows: priceRows('Backlight / LED strip replacement', 'Power supply board repair or replacement', 'Mainboard / motherboard repair', 'T-Con board repair or replacement', 'Software / firmware reset on smart TVs'),
          caption: 'Indicative Delhi NCR TV repair prices by fault and screen size',
        },
        closing: `For example, backlight repair on a 32–43 inch TV typically falls in the ₹${smallScreenBand('Backlight / LED strip replacement')} range. Panel replacement is priced separately and is the most expensive repair.`,
        links: [{ label: 'Full price guide, panel prices and sources', href: '/pricing' }],
      },
      {
        heading: 'Repair warranty: what to get in writing',
        body: 'A repair warranty is only as good as what is written on the invoice. Ask for these details before you pay.',
        list: [
          'How long the cover lasts from the repair date.',
          'Whether it covers the replaced part, the labour, or both.',
          'What is excluded, for example physical damage, liquid or a different fault.',
          'How to report the problem if the same symptom comes back.',
        ],
        closing: 'GR Solution offers a 90-day service warranty where applicable, and confirms the terms with your estimate. Keep the invoice and the written description of the work.',
      },
      {
        heading: 'How long does a TV repair take?',
        body: 'There is no single answer. The time depends mostly on whether the part is in hand and whether the job can be done safely at home. Ask the provider which of these situations applies to your TV.',
        table: {
          caption: 'What decides how long a TV repair takes',
          columns: ['Situation', 'What decides the timing'],
          rows: [
            ['Settings, software or connection fault', 'Often resolved during the diagnosis visit itself'],
            ['Board or backlight repair, part in hand', 'Usually completed once you approve the estimate, at home or at the workshop'],
            ['Part has to be ordered', 'Depends on the part’s availability for your exact model'],
            ['Panel replacement', 'Depends on panel availability; often the longest and most expensive route'],
            ['Workshop handling needed', 'Depends on safe transport, testing and return of the TV'],
          ],
        },
        closing: 'Ask for the expected timing with the estimate, and agree how you will be updated if a part is delayed.',
      },
    ],
    internalLinks: [
      { label: 'TV repair prices and free diagnosis policy', href: '/pricing' },
      { label: 'Authorised service centre vs local TV repair', href: '/blog/authorised-service-centre-vs-local-tv-repair' },
      { label: 'Prepare for a doorstep TV repair visit', href: '/blog/prepare-for-doorstep-tv-repair' },
      { label: 'Repair or replace your TV?', href: '/blog/tv-repair-vs-replacement-guide' },
      { label: 'TV repair in Delhi', href: '/services/tv-repair-delhi' },
      { label: 'TV repair in Noida', href: '/services/tv-repair-noida' },
      { label: 'TV repair in Greater Noida', href: '/services/tv-repair-greater-noida' },
      { label: 'TV repair in Ghaziabad', href: '/services/tv-repair-ghaziabad' },
      { label: 'TV repair near me', href: '/services/tv-repair-near-me' },
    ],
    sources: [
      { label: 'Samsung India: product warranty information', href: 'https://www.samsung.com/in/support/warranty/', note: 'An example of manufacturer terms: check warranty status before independent repair.' },
    ],
    faqs: [
      { question: 'How do I choose a good TV repair service?', answer: 'Pick one that diagnoses before quoting, gives a written total estimate, says whether parts are repaired or replaced, and puts the repair warranty in writing. Avoid advance payment before diagnosis.' },
      { question: 'Should I pay for TV repair in advance?', answer: 'Avoid paying in advance before the TV has been diagnosed and you have approved a written estimate. Any visit or inspection charge should be stated before the visit.' },
      { question: 'How long does a TV repair take?', answer: 'It depends on the fault and part availability. Settings or software faults are often fixed at the diagnosis visit; repairs needing an ordered part or a panel take longer. Ask for the expected timing with the estimate.' },
      { question: 'What warranty should a TV repair have?', answer: 'Get the duration, what is covered (part, labour or both) and the exclusions on the invoice. GR Solution offers a 90-day service warranty where applicable.' },
      { question: 'Is the cheapest TV repair quote the best?', answer: 'Not necessarily. Compare what each quote includes: the diagnosis, whether the part is new, refurbished or used, and the written repair terms.' },
    ],
  },
];
