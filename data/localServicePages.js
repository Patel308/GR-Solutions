import { services } from './services';

export const cities = [
  {
    slug: 'delhi',
    name: 'Delhi',
    areaServed: 'Delhi',
    nearby: ['New Kondli', 'Mayur Vihar', 'Laxmi Nagar', 'Preet Vihar', 'South Delhi', 'West Delhi'],
    localNote:
      'Delhi customers often need quick support for apartments, independent homes, rented flats and office displays where downtime is inconvenient.',
    areaProfile:
      'Service planning in Delhi has to account for dense streets, gated apartment entry, office timings and older residential wiring in many localities.',
    accessAdvice:
      'Customers in Delhi can speed up a visit by sharing the nearest landmark, parking/access details, floor number and whether the TV is wall mounted.',
    trust:
      'Because GR Solution is based at C-4/102, Pocket C 3, New Kondli, Kondli, Delhi 110096, Delhi requests can usually be assessed with clear local context and practical scheduling.',
  },
  {
    slug: 'noida',
    name: 'Noida',
    areaServed: 'Noida',
    nearby: ['Sector 18', 'Sector 62', 'Sector 75', 'Sector 137', 'Noida Extension access roads', 'film city side'],
    localNote:
      'Noida homes and offices commonly use wall-mounted smart displays, large LED units and premium TVs that need careful handling during inspection.',
    areaProfile:
      'Noida service calls often involve high-rise societies, offices, retail spaces and newer residential sectors where lift access and visitor entry can affect scheduling.',
    accessAdvice:
      'For Noida visits, keep the society tower, sector, gate instruction and TV mounting details ready so the technician can plan tools and handling safely.',
    trust:
      'GR Solution supports Noida customers with doorstep inspection planning, symptom-based diagnosis and clear communication before any repair is approved.',
  },
  {
    slug: 'greater-noida',
    name: 'Greater Noida',
    areaServed: 'Greater Noida',
    nearby: ['Alpha', 'Beta', 'Gamma', 'Pari Chowk', 'Knowledge Park', 'Noida Extension'],
    localNote:
      'Greater Noida service calls often involve larger homes, societies and older display units where transport risk should be avoided when possible.',
    areaProfile:
      'Greater Noida coverage may include longer travel between sectors, villa communities, societies and commercial pockets where appointment windows should be planned carefully.',
    accessAdvice:
      'Greater Noida customers should share the exact sector, society name, landmark near the gate and whether the TV needs two-person handling.',
    trust:
      'GR Solution helps Greater Noida customers understand whether a doorstep repair, workshop handling or replacement guidance is the sensible next step.',
  },
  {
    slug: 'ghaziabad',
    name: 'Ghaziabad',
    areaServed: 'Ghaziabad',
    nearby: ['Indirapuram', 'Vaishali', 'Vasundhara', 'Raj Nagar Extension', 'Kaushambi', 'Crossings Republik'],
    localNote:
      'Ghaziabad customers often contact us for no-picture, sound, power and display issues on TVs used daily in family living rooms.',
    areaProfile:
      'Ghaziabad has a mix of apartments, builder floors and busy market-side homes, so clear location details help avoid delays and support practical doorstep diagnosis.',
    accessAdvice:
      'For Ghaziabad service, share the locality, nearby road or society, parking constraints and whether the TV has recently been shifted or wall mounted.',
    trust:
      'GR Solution provides Ghaziabad repair support with a practical focus on diagnosis, estimate clarity and careful handling of screen-related faults.',
  },
];

const serviceLocalProfiles = {
  'led-tv-repair': {
    keywordBase: 'LED TV Repair',
    image: '/images/service_tv.webp',
    intro:
      'LED TVs are reliable, but backlight, power board, mainboard and display faults can make the screen go black, flicker or lose sound unexpectedly.',
    diagnosticDetail:
      'A proper LED TV inspection separates backlight failure from power board, mainboard, T-Con and panel symptoms. The same black-screen complaint can have different causes, so GR Solution checks sound output, standby behavior, input response, panel glow and visible screen patches before suggesting repair.',
    handlingCare:
      'LED TVs are usually lighter than older display types, but thin panels can still flex during movement. Wall-mounted units should be lifted carefully and tested on stable power before any internal check begins.',
    costFactors:
      'LED TV repair cost mainly depends on screen size, backlight condition, board availability, brand model and whether the fault can be handled at home or needs workshop tools.',
    qualityChecks: ['picture brightness', 'sound output', 'remote response', 'HDMI/source switching', 'final heat and stability check'],
    problemFocus: [
      'Sound is working but there is no picture on the screen.',
      'Backlight glow is weak, uneven or completely failed.',
      'The TV turns on and off repeatedly or does not power up.',
      'HDMI, USB, remote or smart input behavior is unstable.',
      'The screen shows flicker, patches, lines or brightness drops.',
    ],
    repairReplace:
      'LED TV repair is usually worth checking when the screen glass is intact and the fault is linked to backlight, power, audio or board sections. Replacement may be wiser if the panel is cracked, heavily damaged or the repair estimate is close to a new TV.',
    beforeCalling:
      'Check the power socket, try a different input source, confirm the remote batteries, note whether sound is present, and keep the TV model number ready.',
  },
  'oled-qled-tv-repair': {
    keywordBase: 'OLED/QLED TV Repair',
    image: '/images/service_oled.webp',
    intro:
      'OLED and QLED TVs need premium diagnostics because panel, brightness, processor and color issues can look similar but require different repair decisions.',
    diagnosticDetail:
      'OLED/QLED TV diagnosis should be slower and more careful because premium display symptoms can overlap. Black patches, color shift, dimming, vertical lines, HDMI faults and smart processor failures must be separated from true panel damage before any expensive decision is made.',
    handlingCare:
      'Premium OLED and QLED panels are sensitive to pressure, heat and poor handling. GR Solution focuses on safe movement, careful visual inspection and practical repair feasibility before recommending board work or panel-related guidance.',
    costFactors:
      'OLED/QLED repair cost is influenced by panel condition, model year, board complexity, display size, premium part availability and whether symptoms are electronic or panel-level.',
    qualityChecks: ['uniform brightness', 'color accuracy', 'panel line inspection', 'smart app response', 'HDMI and audio testing'],
    problemFocus: [
      'OLED black spots, retention marks or burn-in-like symptoms are visible.',
      'QLED brightness, color tone or local dimming looks incorrect.',
      'The premium TV powers on but has no usable picture.',
      'Vertical lines, half-screen display or flicker appears suddenly.',
      'Smart apps, HDMI switching or mainboard functions behave inconsistently.',
    ],
    repairReplace:
      'OLED/QLED repair should start with careful diagnosis. Board, power and software-related issues may be practical, while panel damage or severe burn-in needs realistic cost guidance before spending.',
    beforeCalling:
      'Note the model, screen size, exact display symptom, whether menus are visible, and whether the issue appears across all apps and input sources.',
  },
  'lcd-tv-repair': {
    keywordBase: 'LCD TV Repair',
    image: '/images/service_tv.webp',
    intro:
      'LCD TVs can develop age-related display, power and audio faults, so the first step is checking whether repair is still practical for the model.',
    diagnosticDetail:
      'LCD TV diagnosis begins with practicality. Older LCD units may have power, inverter, backlight, audio or input-board faults, but panel condition and part availability decide whether repair makes sense. GR Solution checks symptoms before letting customers spend blindly on ageing hardware.',
    handlingCare:
      'LCD televisions can be heavier and less forgiving than newer LED units. They should be moved on a stable surface, kept away from pressure on the screen and checked for age-related heat or cable issues.',
    costFactors:
      'LCD TV repair cost depends on age, screen size, part availability, power section condition, audio fault type and whether the display panel itself is healthy.',
    qualityChecks: ['standby and power test', 'screen brightness', 'speaker output', 'input ports', 'longer stability check'],
    problemFocus: [
      'The LCD TV has no display or a dim picture.',
      'Lines, patches or washed-out colors appear on the screen.',
      'The TV does not turn on or shuts down after a few minutes.',
      'Sound works intermittently or speakers are distorted.',
      'Input ports, remote response or display timing is unstable.',
    ],
    repairReplace:
      'LCD TV repair can be sensible for power, sound or board issues. If the display panel itself is physically damaged or parts are unavailable, replacement guidance may save money.',
    beforeCalling:
      'Check if the standby light is on, test another socket, note whether sound works, and share the approximate age and brand of the LCD TV.',
  },
  'plasma-tv-repair': {
    keywordBase: 'Plasma TV Repair',
    image: '/images/service_tv.webp',
    intro:
      'Plasma TVs are older and often need specialist feasibility checks for power, sustain board, heating and panel-related symptoms before repair is approved.',
    diagnosticDetail:
      'Plasma TV repair needs realistic inspection because older plasma displays can have sustain board, power supply, overheating, protection shutdown or panel issues. GR Solution checks whether the TV is repairable, whether parts can be sourced and whether the estimated repair is sensible for the model age.',
    handlingCare:
      'Plasma televisions are heavy, heat-prone and more delicate to transport than they look. Safe handling, cooling time and careful power testing matter before opening the set or repeating power cycles.',
    costFactors:
      'Plasma TV repair cost depends on board availability, age, heating behavior, screen condition, power symptoms and whether the fault is economical compared with replacement.',
    qualityChecks: ['power cycling behavior', 'heat and shutdown check', 'sound/display sync', 'board condition', 'extended stability testing'],
    problemFocus: [
      'The plasma TV does not power on or clicks repeatedly.',
      'The screen glows but does not show a stable picture.',
      'The TV heats up, shuts down or shows protection behavior.',
      'Sound works but the display remains dark.',
      'Ageing board symptoms cause flicker, patches or unstable picture.',
    ],
    repairReplace:
      'Plasma TV repair depends heavily on part availability and condition. Inspection is useful before spending because some older panel or board faults are no longer economical.',
    beforeCalling:
      'Allow the TV to cool, avoid repeated power cycling, note the blink pattern if any, and share the brand, screen size and age estimate.',
  },
  'curved-tv-repair': {
    keywordBase: 'Curved TV Repair',
    image: '/images/service_oled.webp',
    intro:
      'Curved TVs need careful handling because screen stress, mounting pressure, panel issues and display board faults can affect repair feasibility.',
    diagnosticDetail:
      'Curved TV diagnosis looks at both electronics and physical stress. Distortion, uneven brightness, line symptoms, sound-without-picture faults and mounting pressure can point to different issues, so GR Solution checks how the TV is installed, moved and powered before suggesting repair.',
    handlingCare:
      'Curved displays should not be pressed flat, carried by the screen edge or forced into tight mounts. Careful two-handed movement and checking stand or wall-mount pressure helps reduce additional panel stress.',
    costFactors:
      'Curved TV repair cost depends on screen condition, mounting impact, board availability, model size, display symptoms and whether the fault is electronic rather than physical panel damage.',
    qualityChecks: ['screen curvature inspection', 'mounting pressure check', 'picture uniformity', 'sound and input testing', 'post-repair stability'],
    problemFocus: [
      'The curved screen shows distortion, lines or uneven brightness.',
      'The TV has sound but no display.',
      'Wall mounting or stand pressure may have affected the panel.',
      'Color, input or smart functions behave incorrectly.',
      'The TV powers on briefly and then shuts down.',
    ],
    repairReplace:
      'Curved TV repair is worth inspecting when the display glass is intact and the fault may be electronic. Physical curved panel damage can be expensive, so clear feasibility guidance matters.',
    beforeCalling:
      'Do not press the curved screen, avoid moving it alone, check all inputs, and keep details about mounting, recent movement or impact ready.',
  },
};

function makeSlug(serviceSlug, citySlug) {
  return `${serviceSlug}-${citySlug}`;
}

function makeFaqs(service, city, profile) {
  return [
    {
      question: `Do you provide ${service.title} in ${city.name}?`,
      answer: `Yes, GR Solution provides doorstep inspection and repair support for ${service.title.toLowerCase()} across ${city.name} and nearby NCR areas.`,
    },
    {
      question: `How quickly can I book ${profile.keywordBase} ${city.name}?`,
      answer: `Visit timing depends on technician availability and location, but GR Solution tries to arrange quick support after you share the TV model, symptom and address.`,
    },
    {
      question: `What problems are common in ${service.title.toLowerCase()}?`,
      answer: `${profile.problemFocus.slice(0, 3).join(' ')} A technician checks the actual fault before suggesting repair.`,
    },
    {
      question: `Can you repair the TV at home in ${city.name}?`,
      answer: `Many diagnosis and repair tasks can start at home. If workshop handling is safer, the technician explains why before moving ahead.`,
    },
    {
      question: `How much does ${service.title.toLowerCase()} cost in ${city.name}?`,
      answer: `Cost depends on TV size, model, fault type and parts. GR Solution shares an estimate after inspection instead of quoting blindly.`,
    },
    {
      question: 'Should I repair or replace my TV?',
      answer: profile.repairReplace,
    },
    {
      question: `Which ${city.name} areas do you cover?`,
      answer: `Common coverage includes ${city.nearby.join(', ')} and nearby localities, subject to scheduling and service availability.`,
    },
  ];
}

function makeContentBlocks(service, city, profile, keyword) {
  return [
    {
      title: `Diagnosis approach for ${keyword}`,
      text: `${profile.diagnosticDetail} For ${city.name} customers, the first useful detail is not only the TV brand but the exact behavior: standby light, sound, menu visibility, screen glow, line pattern, power cycling and whether the problem appears on all sources. This makes the first inspection more accurate and reduces guesswork.`,
    },
    {
      title: `Local service planning in ${city.name}`,
      text: `${city.areaProfile} ${city.accessAdvice} GR Solution uses this information to decide whether the visit needs basic diagnostic tools, careful demounting support, or a recommendation for workshop-level handling after the first inspection.`,
    },
    {
      title: `Safe handling for ${service.title.toLowerCase()}`,
      text: `${profile.handlingCare} Customers should avoid pressing the screen, opening the back cover, repeated power cycling, or moving larger TVs alone. Small handling mistakes can turn a repairable issue into a panel risk, especially when the original fault is only power, board or backlight related.`,
    },
    {
      title: `How pricing is discussed`,
      text: `${profile.costFactors} GR Solution does not publish fake fixed prices for complex TV faults because two TVs with the same symptom can need completely different work. The safer approach is inspection first, then a clear estimate, approval, and repair only when the customer understands the option.`,
    },
    {
      title: `What makes the page useful`,
      text: `This ${keyword} page is built for people comparing repair options before calling. It explains likely symptoms, local service coverage, repair-versus-replace thinking, contact details and practical preparation steps, so the customer can describe the problem clearly and avoid unnecessary part replacement.`,
    },
    {
      title: `After-repair checks`,
      text: `After an approved repair, the useful checks include ${profile.qualityChecks.join(', ')}. These checks help confirm that the TV is not only turning on but also behaving normally under real viewing conditions. GR Solution also explains simple care steps based on the repaired fault and TV type.`,
    },
  ];
}

function makeWhyChoose(service, city, profile) {
  return [
    `GR Solution focuses on symptom-led ${service.title.toLowerCase()} diagnosis, so the visit starts with what the TV is actually doing rather than a rushed assumption.`,
    `The business details stay consistent for local trust: GR Solution, ${siteContactAddress}, phone +91 99902 83890 and email info@grsolution.co.in.`,
    `${city.trust} This matters when a customer wants local support without losing clarity on estimate, handling and next steps.`,
    `For ${profile.keywordBase.toLowerCase()}, the team explains whether the issue appears repairable at home, needs safer workshop handling, or should be compared with replacement before money is spent.`,
  ];
}

const siteContactAddress = 'C-4/102, Pocket C 3, New Kondli, Kondli, Delhi 110096';

export const localServicePages = services.flatMap((service) => {
  const profile = serviceLocalProfiles[service.slug];
  return cities.map((city) => {
    const keyword = `${profile.keywordBase} ${city.name}`;
    const slug = makeSlug(service.slug, city.slug);
    const otherCities = cities.filter((item) => item.slug !== city.slug);
    const otherServices = services.filter((item) => item.slug !== service.slug);

    return {
      slug,
      parentServiceSlug: service.slug,
      citySlug: city.slug,
      cityName: city.name,
      serviceTitle: service.title,
      keyword,
      title: `${profile.keywordBase} in ${city.name}`,
      h1: `${profile.keywordBase} in ${city.name}`,
      metaTitle: `${keyword} | Doorstep TV Repair | GR Solution`,
      metaDescription: `Need ${keyword}? GR Solution provides doorstep TV inspection, diagnosis and repair support across ${city.name} and nearby NCR areas.`,
      image: profile.image,
      directAnswer: `Need ${profile.keywordBase} in ${city.name}? GR Solution provides doorstep inspection, diagnosis and repair support for ${service.title.toLowerCase()} issues across ${city.name} and nearby NCR areas.`,
      intro: `${profile.intro} If you are searching for ${keyword}, GR Solution helps you understand the issue clearly before approving repair. We focus on practical diagnosis, transparent guidance and careful handling of screen, sound, power and display-related faults.`,
      cityExplanation: `${city.localNote} Our ${profile.keywordBase.toLowerCase()} support in ${city.name} is built around symptom-first inspection, so customers do not have to guess whether the issue is a power board, panel, backlight, software or input problem.`,
      localTrust: city.trust,
      commonProblems: profile.problemFocus,
      contentBlocks: makeContentBlocks(service, city, profile, keyword),
      whyChoose: makeWhyChoose(service, city, profile),
      qualityChecks: profile.qualityChecks,
      repairReplace: profile.repairReplace,
      beforeCalling: profile.beforeCalling,
      coverage: `Service coverage for ${keyword} includes ${city.nearby.join(', ')} and nearby NCR pockets. Availability depends on technician schedule, TV size, access and part requirements.`,
      pricing:
        'Pricing depends on the exact TV model, screen size, fault type, part availability and whether the repair can be completed on-site. GR Solution avoids fake fixed-price claims and shares a clear estimate after diagnosis.',
      emergency:
        'For urgent TV issues, call or WhatsApp GR Solution with the model number, symptom, location and a short photo or video if useful. This helps the team plan the visit and carry the right diagnostic approach.',
      process: [
        `Share your ${service.title.toLowerCase()} issue and ${city.name} location.`,
        'Get a visit schedule or next-step guidance from GR Solution.',
        'Technician checks power, display, sound and board symptoms.',
        'Receive repair feasibility, estimate and approval options.',
        'Approved repair is completed and tested for stable picture and sound.',
      ],
      faqs: makeFaqs(service, city, profile),
      sameServiceOtherCities: otherCities.map((item) => ({
        label: `${profile.keywordBase} ${item.name}`,
        href: `/services/${makeSlug(service.slug, item.slug)}`,
      })),
      otherServicesSameCity: otherServices.map((item) => {
        const otherProfile = serviceLocalProfiles[item.slug];
        return {
          label: `${otherProfile.keywordBase} ${city.name}`,
          href: `/services/${makeSlug(item.slug, city.slug)}`,
        };
      }),
    };
  });
});

export function getLocalServicePageBySlug(slug) {
  return localServicePages.find((page) => page.slug === slug);
}

export function getLocalPagesByService(serviceSlug) {
  return localServicePages.filter((page) => page.parentServiceSlug === serviceSlug);
}

export function getLocalPagesByCity(citySlug) {
  return localServicePages.filter((page) => page.citySlug === citySlug);
}
