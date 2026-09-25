import { buildTitle, clampDescription } from './seo';

// Locality pages: one level below the four city hubs.
//
// These target sub-city demand found in the keyword research ("tv repair in
// south delhi", "tv repair in vasundhara ghaziabad", "sony tv service center in
// west delhi" ...) that a single city page cannot serve well.
//
// Guard-rails, so these never become doorway pages:
//  - Every fact is specific to the locality and checkable: the neighbourhoods
//    it includes, which electricity distributor serves it, its housing stock
//    and its route from the New Kondli base.
//  - No invented customer jobs, reviews or statistics.
//  - GR Solution is an independent repairer. Pages that mention "service
//    centre" searches say plainly that it is not a brand-authorised centre.
//  - Measure similarity after any edit; keep every pair under 35%.

const cols = ['Situation', 'What we check first', 'Usual path'];

const localities = [
  // ---------------------------------------------------------------- Delhi
  {
    slug: 'tv-repair-east-delhi',
    name: 'East Delhi',
    citySlug: 'delhi',
    cityName: 'Delhi',
    keyword: 'TV Repair East Delhi',
    metaDescription:
      'TV repair in East Delhi from our New Kondli base — Mayur Vihar, Laxmi Nagar, Preet Vihar, Patparganj and IP Extension. LED, OLED, QLED and LCD.',
    directAnswer:
      'GR Solution is based in New Kondli, East Delhi, so East Delhi — Mayur Vihar, Laxmi Nagar, Preet Vihar, Patparganj, IP Extension and Kondli — is the shortest trip we make and usually the quickest to schedule. We repair LED, OLED, QLED, LCD, plasma and curved TVs at home, with a firm estimate before any paid work.',
    intro:
      'East Delhi is home ground. Our workshop address is C-4/102, Pocket C 3, New Kondli, which sits on the eastern edge of the city where Delhi meets Noida and Ghaziabad. For customers here, that proximity changes the practical side of a repair: shorter waits, and when a set genuinely needs a bench, a short and low-risk trip to the workshop rather than a long drive across the city.',
    areas: ['New Kondli', 'Kondli', 'Mayur Vihar Phase 1, 2 and 3', 'Laxmi Nagar', 'Preet Vihar', 'Patparganj', 'IP Extension', 'Shakarpur', 'Pandav Nagar', 'Vinod Nagar'],
    facts: [
      ['Distance from our base', 'A few kilometres — the shortest trips we make'],
      ['Electricity distributor', 'BSES Yamuna Power'],
      ['Typical housing', 'DDA flats, group housing societies in Patparganj and IP Extension, builder floors around Laxmi Nagar and Shakarpur'],
      ['Workshop handling', 'Short, low-risk trip when a bench is genuinely needed'],
    ],
    angleHeading: 'Why East Delhi repairs are usually the simplest',
    angle: [
      'Distance is the biggest variable in any doorstep repair, and in East Delhi it barely registers. That has a knock-on effect on large and premium sets: the usual reason to insist on repairing a big panel on site is to avoid transporting it a long way. Here, if a fault truly needs workshop tools, the trip is short enough that it stops being a serious risk.',
      'The housing mix is dense and varied. Patparganj and IP Extension are known for their group housing societies with lifts and gate registers. Laxmi Nagar and Shakarpur lean towards builder floors above busy market streets, where parking is the main obstacle and stairs are narrow. Mayur Vihar mixes DDA pockets with societies. Tell us which kind of building you live in and the floor, and the visit is planned around it.',
    ],
    situations: {
      caption: 'Common situations in East Delhi',
      columns: cols,
      rows: [
        ['Builder floor above a Laxmi Nagar market, no lift', 'Whether the fault can be fixed in place', 'On-site repair; parking arranged in advance'],
        ['Society flat in IP Extension, large LED dark', 'Backlight with the torch test', 'Backlight repair on site or a short workshop trip'],
        ['Set failed when power returned after a cut', 'Power supply board', 'Board repair, usually same visit'],
      ],
    },
    tips: [
      'For market-side homes in Laxmi Nagar and Shakarpur, suggest where the technician can park — it is usually the slowest part of the visit.',
      'In Patparganj and IP Extension societies, register the visit at the gate in advance.',
      'Because the workshop is close, ask whether a bench repair would be safer for a large panel; here it often is.',
    ],
    faqs: [
      {
        question: 'Is TV repair faster in East Delhi?',
        answer: 'Usually, yes. Our base is in New Kondli, so East Delhi localities are our shortest trips and generally the quickest to schedule.',
      },
      {
        question: 'Do you have a TV service centre in East Delhi?',
        answer: 'GR Solution is an independent TV repair workshop in New Kondli, East Delhi — not a brand-authorised service centre. We repair all major brands at home or at our workshop.',
      },
      {
        question: 'Which East Delhi areas do you cover?',
        answer: 'New Kondli, Kondli, Mayur Vihar Phases 1–3, Laxmi Nagar, Preet Vihar, Patparganj, IP Extension, Shakarpur, Pandav Nagar, Vinod Nagar and nearby localities.',
      },
    ],
  },
  {
    slug: 'tv-repair-south-delhi',
    name: 'South Delhi',
    citySlug: 'delhi',
    cityName: 'Delhi',
    keyword: 'TV Repair South Delhi',
    metaDescription:
      'Doorstep TV repair in South Delhi — Lajpat Nagar, Greater Kailash, Saket, Malviya Nagar, Kalkaji, Sarita Vihar. LED, OLED and QLED. Estimate first.',
    directAnswer:
      'GR Solution provides doorstep TV repair across South Delhi — Lajpat Nagar, Greater Kailash, Saket, Malviya Nagar, Hauz Khas, Kalkaji, Defence Colony and Sarita Vihar. South Delhi is a cross-city trip from our New Kondli base, so visits are booked into a time window, and large premium sets are repaired on site wherever the fault allows.',
    intro:
      'South Delhi has some of the largest and most expensive televisions we service: big OLED and QLED sets in independent houses and builder floors, often wall-mounted in dedicated living or media rooms. It is also a cross-city journey from New Kondli, across the Yamuna and down the Ring Road or through the DND corridor. Both facts shape how a South Delhi repair is planned.',
    areas: ['Lajpat Nagar', 'Greater Kailash', 'Saket', 'Malviya Nagar', 'Hauz Khas', 'Kalkaji', 'Defence Colony', 'Sarita Vihar', 'Jangpura', 'Vasant Kunj'],
    facts: [
      ['Distance from our base', 'Cross-city — roughly 15–25 km depending on the locality'],
      ['Electricity distributor', 'BSES Rajdhani Power'],
      ['Typical housing', 'Independent houses, multi-storey builder floors, DDA flats in Kalkaji, Sarita Vihar and Vasant Kunj'],
      ['Workshop handling', 'Avoided for large premium panels unless the fault needs a bench'],
    ],
    angleHeading: 'Large premium sets and cross-city planning',
    angle: [
      'Because South Delhi owners tend to have larger and more premium sets, the diagnosis has to be especially careful. A dark 75-inch QLED might be a local-dimming zone failure, not a panel fault, and those two outcomes are tens of thousands of rupees apart. On an OLED, apparent image retention often clears once the set is allowed to run its standby panel-refresh cycle. We establish exactly what has failed before any expensive part is discussed.',
      'The builder floors common in Greater Kailash, Lajpat Nagar and Defence Colony often have lifts that are too small for a large TV in its carton, or no lift at all. That makes on-site repair the strong default for big sets. Because South Delhi is a cross-city trip, sending the model number and a short video in advance matters: it lets the technician arrive with the right strip or board and finish in one visit.',
    ],
    situations: {
      caption: 'Common situations in South Delhi',
      columns: cols,
      rows: [
        ['75" QLED with dark zones in a media room', 'Local-dimming backlight zones', 'Backlight repair on site, not panel replacement'],
        ['OLED showing faint logo retention', 'Whether the panel refresh has been running', 'Often cleared without any part'],
        ['Builder floor with a small lift, set needs a bench', 'Whether the fault truly requires it', 'Two-person upright move only if unavoidable'],
      ],
    },
    tips: [
      'Send the model number and a 20-second video before the visit — it is a cross-city trip, and preparation is what makes one visit enough.',
      'Check the manufacturer warranty first on premium sets under a few years old.',
      'For builder floors, mention the lift size or that there is none.',
    ],
    faqs: [
      {
        question: 'Do you repair TVs in South Delhi?',
        answer: 'Yes. We cover Lajpat Nagar, Greater Kailash, Saket, Malviya Nagar, Hauz Khas, Kalkaji, Defence Colony, Sarita Vihar and nearby areas. As a cross-city trip, visits are booked into a time window.',
      },
      {
        question: 'Is there a Samsung or Sony service centre in South Delhi you represent?',
        answer: 'No. GR Solution is an independent repairer, not a brand-authorised service centre. We repair Samsung, Sony, LG and other brands, and recommend using the brand if your TV is still under warranty.',
      },
      {
        question: 'Can a large OLED be repaired without moving it?',
        answer: 'Most faults, yes. Power, mainboard and software faults are fixed on site. Genuine panel work needs a bench, and we compare that cost against a new set before recommending it.',
      },
    ],
  },
  {
    slug: 'tv-repair-west-delhi',
    name: 'West Delhi',
    citySlug: 'delhi',
    cityName: 'Delhi',
    keyword: 'TV Repair West Delhi',
    metaDescription:
      'TV repair in West Delhi — Janakpuri, Rajouri Garden, Tilak Nagar, Vikaspuri, Uttam Nagar and Dwarka. Doorstep diagnosis, estimate before work.',
    directAnswer:
      'GR Solution repairs TVs across West Delhi — Janakpuri, Rajouri Garden, Tilak Nagar, Vikaspuri, Uttam Nagar, Paschim Vihar and Dwarka. West Delhi is on the opposite side of the city from our New Kondli base, so visits are planned a day ahead and we ask for the model number first so the right part travels with the technician.',
    intro:
      'West Delhi is the far side of the city for us — roughly 30 km or more from New Kondli. That is not a reason to avoid a visit, but it is a reason to plan it properly. The goal for every West Delhi repair is to diagnose as much as possible before the trip, so the technician arrives with the part most likely to be needed and the job finishes in one visit.',
    areas: ['Janakpuri', 'Rajouri Garden', 'Tilak Nagar', 'Vikaspuri', 'Uttam Nagar', 'Paschim Vihar', 'Punjabi Bagh', 'Dwarka'],
    facts: [
      ['Distance from our base', 'The far side of the city — typically 30 km or more'],
      ['Electricity distributor', 'Mostly BSES Rajdhani Power; some areas bordering North-West Delhi are served by Tata Power-DDL'],
      ['Typical housing', 'Planned residential blocks and builder floors in Janakpuri and Vikaspuri, sector societies in Dwarka, dense colonies around Uttam Nagar'],
      ['Workshop handling', 'Avoided where possible because of the distance'],
    ],
    angleHeading: 'Preparing a far-side repair properly',
    angle: [
      'West Delhi’s housing is split. Janakpuri, Vikaspuri and Paschim Vihar are planned areas with builder floors and independent houses. Dwarka is a sub-city of numbered sectors filled largely with society apartments. Uttam Nagar is denser, with narrower lanes. Each changes the visit: parking in Uttam Nagar, gate registration in Dwarka societies, stairs in Janakpuri builder floors.',
      'Because of the distance, a speculative first visit is the thing to avoid. A clear photo of the model sticker on the back, a note of whether the standby light is on, off or blinking, and a torch test on the screen let us narrow the fault to one or two parts before setting out. For the few faults that truly need a bench, we explain the options, including transport, before anything is moved.',
    ],
    situations: {
      caption: 'Common situations in West Delhi',
      columns: cols,
      rows: [
        ['Dwarka society flat, TV will not power on', 'Power supply board', 'Board carried on the first visit if the model is known'],
        ['Janakpuri builder floor, dark screen with sound', 'Backlight strips', 'On-site strip replacement'],
        ['Unknown fault, no model number shared', 'Remote diagnosis before travel', 'Photo and video requested first'],
      ],
    },
    tips: [
      'Photograph the model sticker on the back of the TV and send it when you book.',
      'Note the standby light: on, off, or blinking — and if blinking, how many times.',
      'For Dwarka societies, arrange visitor entry in advance.',
    ],
    faqs: [
      {
        question: 'Do you cover Dwarka and Janakpuri?',
        answer: 'Yes. West Delhi coverage includes Dwarka, Janakpuri, Rajouri Garden, Tilak Nagar, Vikaspuri, Uttam Nagar, Paschim Vihar and Punjabi Bagh, with visits planned a day ahead.',
      },
      {
        question: 'Is GR Solution a Sony service centre in West Delhi?',
        answer: 'No. GR Solution is an independent TV repairer based in East Delhi, not a brand-authorised service centre. We repair Sony and other major brands at your home.',
      },
      {
        question: 'Why do you ask for the model number before visiting West Delhi?',
        answer: 'Because it is a long trip. The model number lets us match the likely board or backlight strip in advance, so the repair can usually be finished in a single visit.',
      },
    ],
  },

  // -------------------------------------------------------------- Ghaziabad
  {
    slug: 'tv-repair-indirapuram',
    name: 'Indirapuram',
    citySlug: 'ghaziabad',
    cityName: 'Ghaziabad',
    keyword: 'TV Repair Indirapuram',
    metaDescription:
      'TV repair in Indirapuram, Ghaziabad — Nyay Khand, Shakti Khand, Ahinsa Khand, Niti Khand and nearby societies. A short trip from our New Kondli base.',
    directAnswer:
      'GR Solution provides doorstep TV repair in Indirapuram, Ghaziabad — across Nyay Khand, Shakti Khand, Ahinsa Khand, Niti Khand, Gyan Khand and Vaibhav Khand. Indirapuram borders East Delhi and is one of the shortest trips from our New Kondli base. We repair LED, QLED, OLED and LCD TVs, with an estimate before any paid work.',
    intro:
      'Indirapuram sits right against the eastern edge of Delhi, a few minutes from our base in New Kondli. It is organised into "khands" rather than numbered sectors, and it is almost entirely high-rise group housing. That combination — close by, and dominated by society towers — makes Indirapuram one of the most straightforward areas we serve, provided the society entry is sorted out in advance.',
    areas: ['Nyay Khand', 'Shakti Khand', 'Ahinsa Khand', 'Niti Khand', 'Gyan Khand', 'Vaibhav Khand', 'Abhay Khand', 'Kaushambi border'],
    facts: [
      ['Distance from our base', 'Short — Indirapuram borders East Delhi'],
      ['Electricity distributor', 'PVVNL (Paschimanchal Vidyut Vitran Nigam Limited)'],
      ['Typical housing', 'High-rise group housing societies organised into khands'],
      ['Workshop handling', 'Short trip, so a bench repair is a practical option when needed'],
    ],
    angleHeading: 'Society towers, generator backup and large screens',
    angle: [
      'Most Indirapuram homes are society apartments with diesel-generator backup. The changeover between mains and backup during a power cut is a moment when electronics see a transient, and a TV that dies exactly at that moment usually has a power supply fault rather than anything wrong with the screen. It is one of the most common and most affordable repairs we do here.',
      'Society living also means larger, often wall-mounted, TVs — typically 50 to 65 inches — and gate and lift rules. Pre-registering the technician, booking the service lift if the set may need to leave the flat, and noting the tower and flat number make the visit smooth. Because the workshop is close, a bench repair for a large panel is a realistic, low-risk option rather than a last resort.',
    ],
    situations: {
      caption: 'Common situations in Indirapuram',
      columns: cols,
      rows: [
        ['TV died during a generator changeover', 'Power supply board', 'Board repair, usually on site'],
        ['55" QLED with cloudy dark scenes', 'Local-dimming backlight zones', 'Backlight repair'],
        ['Wall-mounted set, fault needs a bench', 'Service lift and handling plan', 'Short upright trip to the workshop'],
      ],
    },
    tips: [
      'Pre-approve the technician in your society’s visitor app and share the tower and flat number.',
      'Note whether the TV failed on mains, on generator, or at the changeover.',
      'Book the service lift if the TV might need to leave the flat.',
    ],
    faqs: [
      {
        question: 'Do you repair TVs in Indirapuram?',
        answer: 'Yes. Indirapuram is one of our shortest trips, covering Nyay Khand, Shakti Khand, Ahinsa Khand, Niti Khand, Gyan Khand, Vaibhav Khand and nearby societies.',
      },
      {
        question: 'My TV stopped when the society generator started. What failed?',
        answer: 'Almost always the power supply board. The changeover between mains and generator produces a transient that power boards are most exposed to. The screen is rarely affected.',
      },
      {
        question: 'Can a large TV from Indirapuram go to your workshop?',
        answer: 'Yes, when a fault needs a bench. Because our New Kondli workshop is close, the trip is short and the set is carried upright by two people.',
      },
    ],
  },
  {
    slug: 'tv-repair-vasundhara',
    name: 'Vasundhara',
    citySlug: 'ghaziabad',
    cityName: 'Ghaziabad',
    keyword: 'TV Repair Vasundhara',
    metaDescription:
      'TV repair in Vasundhara, Ghaziabad — all sectors, including independent houses, builder floors and apartment blocks. LED and LCD repair at home.',
    directAnswer:
      'GR Solution provides doorstep TV repair across Vasundhara, Ghaziabad, including all its numbered sectors. Vasundhara is a planned area of independent houses, builder floors and apartment blocks close to our New Kondli base. Many TVs here are long-serving family sets, so we give a straight repair-or-replace comparison along with the estimate.',
    intro:
      'Vasundhara is a planned residential area in Ghaziabad, laid out in numbered sectors and developed over several decades. Unlike the tower-dominated Indirapuram next door, much of Vasundhara is low-rise: independent houses, builder floors and apartment blocks, many without lifts. The TVs here are often the family’s main set, kept running for years, which shapes both the faults we see and the advice we give.',
    areas: ['Vasundhara sectors 1–19', 'Vasundhara Enclave border', 'Vaishali border', 'Indirapuram border'],
    facts: [
      ['Distance from our base', 'Short — close to the East Delhi border'],
      ['Electricity distributor', 'PVVNL (Paschimanchal Vidyut Vitran Nigam Limited)'],
      ['Typical housing', 'Independent houses, builder floors and low-rise apartment blocks across numbered sectors'],
      ['Workshop handling', 'Short trip, but stairs without lifts favour on-site repair'],
    ],
    angleHeading: 'Long-serving sets and honest repair-or-replace advice',
    angle: [
      'Vasundhara households tend to keep a TV for a long time, which means we see more older LED sets and a fair number of LCDs still in daily use. Long running hours wear out backlight LEDs, so a picture that has dimmed gradually over months, or a screen that goes dark while the sound carries on, is one of the most common complaints. It is also one of the most repairable.',
      'For an older mid-size set, a repair has real competition from the price of a new entry-level TV, so every Vasundhara estimate comes with a direct comparison. In the low-rise buildings, many homes have no lift. That makes on-site board and backlight work the norm, sparing a heavy older set a trip down the stairs.',
    ],
    situations: {
      caption: 'Common situations in Vasundhara',
      columns: cols,
      rows: [
        ['Picture dimmed gradually on an older LED', 'Backlight LED wear', 'Backlight repair, usually worthwhile'],
        ['LCD clicks but will not start', 'Power-supply capacitors', 'Low-cost on-site repair'],
        ['Cracked screen on a 43" family set', 'Panel damage', 'Replacement usually better value'],
      ],
    },
    tips: [
      'Mention the floor and whether there is a lift — many Vasundhara buildings have neither lifts nor wide stairs.',
      'Have a rough idea of the TV’s age and screen size so the repair-or-replace comparison can be made straight away.',
      'For LCDs that click, count the clicks and stop retrying until the visit.',
    ],
    faqs: [
      {
        question: 'Do you repair TVs in Vasundhara, Ghaziabad?',
        answer: 'Yes, across all Vasundhara sectors, including independent houses, builder floors and apartment blocks.',
      },
      {
        question: 'Is it worth repairing an older LED TV in Vasundhara?',
        answer: 'If the screen is intact and the fault is the backlight, power board or a single board, usually yes. If the panel is cracked, a new TV is typically better value.',
      },
      {
        question: 'Do you repair LED TVs in Vasundhara at home?',
        answer: 'Yes. Most LED faults, including backlight and power board repairs, are done at home, which matters in buildings without a lift.',
      },
    ],
  },

  // ----------------------------------------------------------------- Noida
  {
    slug: 'tv-repair-noida-sector-62',
    name: 'Noida Sector 62',
    citySlug: 'noida',
    cityName: 'Noida',
    keyword: 'TV Repair Noida Sector 62',
    metaDescription:
      'TV repair in Noida Sector 62 and nearby sectors for homes and offices — LED displays, smart TVs and meeting-room screens. Office-hours visits.',
    directAnswer:
      'GR Solution repairs TVs and display screens in Noida Sector 62 and the neighbouring sectors, for both offices and homes. Sector 62 is one of Noida’s main IT and institutional hubs, so we schedule office visits around working hours and check network and input issues on meeting-room displays as well as hardware faults.',
    intro:
      'Sector 62 is different from most of the areas we cover. It is one of Noida’s major IT and institutional sectors, with office campuses, educational institutions and the Sector 62 and Noida Electronic City stations on the Delhi Metro Blue Line — and it is surrounded by residential sectors. A Sector 62 call is as likely to be a meeting-room display as a living-room TV, and those two need different kinds of visit.',
    areas: ['Sector 62', 'Sector 63', 'Sector 61', 'Sector 71', 'Sector 73', 'Sector 58', 'Sector 59'],
    facts: [
      ['Distance from our base', 'A moderate drive from New Kondli along NH-24'],
      ['Electricity distributor', 'PVVNL (Paschimanchal Vidyut Vitran Nigam Limited)'],
      ['Typical premises', 'IT and office campuses, institutions, and residential societies in adjoining sectors'],
      ['Visit timing', 'Office visits scheduled within working hours; home visits as usual'],
    ],
    angleHeading: 'Office displays and home TVs need different visits',
    angle: [
      'Meeting-room and reception displays in Sector 62 offices usually run long hours on fixed inputs, and many of their faults are not hardware at all: an HDMI switcher, a casting dongle, a wrong input or a network setting. We check the signal chain before opening anything, because the cheapest repair is the one that turns out to be a cable. When it is hardware, long running hours mean backlight wear and power-supply faults are the usual suspects.',
      'Office visits need a fixed slot, building access and often a contact at reception, so we schedule them around working hours. For homes in the neighbouring residential sectors, the visit works like any other Noida society call: gate registration, the tower and flat number, and a note of whether the set is wall-mounted.',
    ],
    situations: {
      caption: 'Common situations in and around Sector 62',
      columns: cols,
      rows: [
        ['Meeting-room display shows no signal', 'HDMI switcher, casting device and input', 'Often fixed without opening the display'],
        ['Reception screen dimmed after long daily use', 'Backlight wear', 'Backlight repair, scheduled out of hours'],
        ['Home TV in a nearby society will not start', 'Power supply board', 'Board repair on site'],
      ],
    },
    tips: [
      'For offices, share a building contact and the access process, and pick a slot that avoids meetings.',
      'Note whether the display fails on every input or only through a switcher or casting device.',
      'For homes, pre-register the visit in the society app.',
    ],
    faqs: [
      {
        question: 'Do you repair office TVs and displays in Noida Sector 62?',
        answer: 'Yes. We repair LED displays and smart TVs used in offices and meeting rooms, scheduling visits within working hours.',
      },
      {
        question: 'Our meeting-room screen says no signal. Is the TV broken?',
        answer: 'Often not. Switchers, casting devices, cables and input settings cause most no-signal faults on office displays. We check the signal chain before any hardware repair.',
      },
      {
        question: 'Do you cover homes near Sector 62 as well?',
        answer: 'Yes. Coverage includes Sectors 58, 59, 61, 63, 71 and 73, among others.',
      },
    ],
  },
];

export const localityPages = localities.map((item) => ({
  ...item,
  isLocalityPage: true,
  h1: `TV Repair in ${item.name}`,
  title: `TV Repair in ${item.name}`,
  metaTitle: buildTitle(`TV Repair in ${item.name}`, `${item.cityName} Doorstep Service`),
  metaDescription: clampDescription(item.metaDescription),
  parentHref: `/services/tv-repair-${item.citySlug}`,
  costGuideHref: `/blog/tv-repair-cost-${item.citySlug}`,
  image: '/images/service_tv.webp',
}));

export function getLocalityPageBySlug(slug) {
  return localityPages.find((page) => page.slug === slug);
}

export function getLocalityPagesByCity(citySlug) {
  return localityPages.filter((page) => page.citySlug === citySlug);
}
