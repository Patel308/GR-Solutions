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

const serviceCityPages = services.flatMap((service) => {
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

const genericTvCityProfiles = {
  delhi: {
    keyword: 'TV Repair Delhi',
    h1: 'TV Repair in Delhi',
    metaTitle: 'TV Repair Delhi | Doorstep TV Service | GR Solution',
    metaDescription: 'Need TV repair in Delhi? GR Solution provides doorstep LED, OLED/QLED, LCD, Plasma and Curved TV diagnosis across Delhi.',
    image: '/images/service_tv.webp',
    intro:
      'Delhi TV repair requests can come from apartments, offices, shops, rented flats and independent homes, so the first step is understanding the exact TV symptom and access situation. GR Solution helps customers compare LED, OLED/QLED, LCD, Plasma and Curved TV repair options before approving any work.',
    cityExplanation:
      'For TV repair in Delhi, common service planning areas include East Delhi, South Delhi, West Delhi, North Delhi, New Kondli, Laxmi Nagar, Preet Vihar, Mayur Vihar, Dwarka and Rohini. The same no-display issue can mean a backlight fault in one LED TV, a board issue in another, or panel damage in a premium display, so diagnosis matters more than guessing.',
    localFocus:
      'Because GR Solution is based in New Kondli, Delhi requests can usually be discussed with strong local context. Customers should share nearby landmarks, floor number, parking or society entry instructions and whether the TV is wall mounted.',
    nearbyText: 'East Delhi, South Delhi, West Delhi, North Delhi, New Kondli, Laxmi Nagar, Preet Vihar, Mayur Vihar, Dwarka and Rohini',
    urgency:
      'Delhi customers often want fast repair because the TV is used daily in family rooms, offices or waiting areas. GR Solution prioritizes clear scheduling, diagnosis-first communication and practical repair-versus-replacement guidance.',
  },
  noida: {
    keyword: 'TV Repair Noida',
    h1: 'TV Repair in Noida',
    metaTitle: 'TV Repair Noida | Doorstep TV Technician | GR Solution',
    metaDescription: 'Book TV repair in Noida with GR Solution for LED, OLED/QLED, LCD, Plasma and Curved TV issues with doorstep diagnosis.',
    image: '/images/service_oled.webp',
    intro:
      'Noida homes and offices often use large wall-mounted smart TVs, premium displays and daily-use LED sets. GR Solution provides TV repair support in Noida with a practical diagnosis-first approach for display, sound, power, backlight, motherboard and smart TV issues.',
    cityExplanation:
      'For TV repair Noida searches, customers commonly ask from Sector 18, Sector 62, Sector 63, Sector 75, Sector 76, Sector 104, Sector 137 and Noida Extension access areas. High-rise societies need entry and lift planning, while offices may need appointment windows that avoid work disruption.',
    localFocus:
      'If you are searching for tv repair near me Noida, share the sector, society tower, gate instruction, TV brand, screen size and whether the display is wall mounted. These details help the technician prepare safe handling and the right first diagnostic path.',
    nearbyText: 'Sector 18, Sector 62, Sector 63, Sector 75, Sector 76, Sector 104, Sector 137 and Noida Extension',
    urgency:
      'Noida service calls often need efficient coordination because large screens are difficult to move and transport can add panel risk. Doorstep inspection helps decide whether repair can be handled at home or needs safer workshop handling.',
  },
  'greater-noida': {
    keyword: 'TV Repair Greater Noida',
    h1: 'TV Repair in Greater Noida',
    metaTitle: 'TV Repair Greater Noida | Doorstep Support | GR Solution',
    metaDescription: 'GR Solution provides TV repair in Greater Noida for LED, OLED/QLED, LCD, Plasma and Curved TV issues with doorstep support.',
    image: '/images/service_tv.webp',
    intro:
      'Greater Noida TV repair calls often involve larger homes, societies, villas and commercial spaces where moving a big TV without diagnosis can create unnecessary risk. GR Solution provides doorstep inspection support for LED, OLED/QLED, LCD, Plasma and Curved TV faults.',
    cityExplanation:
      'For TV repair Greater Noida requests, useful local details include Pari Chowk, Alpha, Beta, Gamma, Knowledge Park, Techzone and Greater Noida West. Appointment planning matters because sectors and societies can be spread out, and large TVs may require careful handling.',
    localFocus:
      'Customers should share the exact sector, society name, tower, landmark, screen size and whether two-person handling is required. This helps GR Solution recommend a realistic visit window and avoid unnecessary transport before diagnosis.',
    nearbyText: 'Pari Chowk, Alpha, Beta, Gamma, Knowledge Park, Techzone and Greater Noida West',
    urgency:
      'Greater Noida customers often need a clear answer on whether an older or larger TV is worth repairing. The page explains the decision factors before the customer spends on board, backlight, display or panel-related work.',
  },
  ghaziabad: {
    keyword: 'TV Repair Ghaziabad',
    h1: 'TV Repair in Ghaziabad',
    metaTitle: 'TV Repair Ghaziabad | Indirapuram & Vaishali | GR Solution',
    metaDescription: 'Need TV repair in Ghaziabad or Indirapuram? GR Solution supports LED, OLED/QLED, LCD, Plasma and Curved TV diagnosis.',
    image: '/images/service_tv.webp',
    intro:
      'Ghaziabad TV repair requests commonly involve daily-use family TVs with no picture, sound problems, power faults, screen lines or smart TV behavior issues. GR Solution provides diagnosis-first support so customers understand repair feasibility before approving work.',
    cityExplanation:
      'For tv repair in Indirapuram Ghaziabad and nearby areas, coverage may include Indirapuram, Vaishali, Vasundhara, Raj Nagar Extension, Kaushambi, Crossings Republik and Sahibabad. These areas include apartments, builder floors and busy market-side homes, so clear location details help scheduling.',
    localFocus:
      'Customers in Ghaziabad should share the locality, society name, nearby road, parking constraints and whether the TV was recently shifted or wall mounted. These details help separate handling-related symptoms from power, board, backlight or panel faults.',
    nearbyText: 'Indirapuram, Vaishali, Vasundhara, Raj Nagar Extension, Kaushambi, Crossings Republik and Sahibabad',
    urgency:
      'Ghaziabad customers often search for quick TV repair when the main family TV fails suddenly. GR Solution focuses on clear inspection, practical estimates and safe guidance for repair versus replacement.',
  },
};

const tvTypesCovered = [
  'LED TV backlight, power board, sound and no-picture faults',
  'OLED/QLED TV color, brightness, line and premium panel symptoms',
  'LCD TV ageing display, audio, power and input issues',
  'Plasma TV power, sustain board, heating and older-model feasibility checks',
  'Curved TV display distortion, mounting pressure and panel handling concerns',
];

function makeGenericTvFaqs(city, profile) {
  return [
    {
      question: `Do you provide TV repair in ${city.name}?`,
      answer: `Yes, GR Solution provides doorstep TV inspection and repair support in ${city.name}, including LED, OLED/QLED, LCD, Plasma and Curved TV issues.`,
    },
    {
      question: `Which ${city.name} areas do you cover?`,
      answer: `Common coverage includes ${profile.nearbyText} and nearby NCR areas, subject to technician schedule and access details.`,
    },
    {
      question: 'Can a TV with sound but no picture be repaired?',
      answer: 'Often yes. Sound-without-picture can come from backlight, T-Con, panel, power or mainboard issues, so inspection is needed before deciding.',
    },
    {
      question: 'Do you repair Smart TV app and HDMI issues?',
      answer: 'Yes, GR Solution checks smart TV software, HDMI input, source switching, remote response and motherboard-related behavior during diagnosis.',
    },
    {
      question: 'How much does TV repair cost?',
      answer: 'Cost depends on TV type, screen size, brand, fault type and part availability. GR Solution shares an inspection-based estimate before repair.',
    },
    {
      question: 'Should I repair or replace my TV?',
      answer: 'Repair is usually worth checking when the screen is intact and the issue is backlight, board, audio, power or software related. Replacement may be better for severe panel damage or very high repair estimates.',
    },
    {
      question: 'What should I check before calling?',
      answer: 'Check the power socket, try another input, note whether sound is present, avoid pressing the screen and keep the TV model number ready.',
    },
    {
      question: 'How can I book TV repair?',
      answer: 'Call GR Solution, send a WhatsApp message or use the contact form with the TV brand, size, issue and service location.',
    },
  ];
}

function makeGenericTvContentBlocks(city, profile) {
  return [
    {
      title: `Best answer for ${profile.keyword}`,
      text: `Need TV repair in ${city.name}? GR Solution provides doorstep inspection, diagnosis and repair support for LED, OLED/QLED, LCD, Plasma and Curved TV issues across ${city.name} and nearby NCR areas. The useful first step is to describe the exact symptom: no display, sound without picture, blinking light, display lines, dim screen, app freezing, HDMI issue or sudden power failure.`,
    },
    {
      title: 'Common problems we solve',
      text: `Common TV faults include backlight failure, power board issues, motherboard symptoms, vertical or horizontal lines, HDMI or input faults, smart TV app lag, no sound, distorted picture, panel patches and screen flicker. GR Solution checks the actual behavior before recommending repair so customers do not spend on unnecessary parts.`,
    },
    {
      title: 'TV types covered',
      text: `GR Solution supports LED, OLED/QLED, LCD, Plasma and Curved TVs. LED sets often need backlight or board diagnosis, OLED/QLED TVs need careful panel-aware inspection, LCD and Plasma models need repair-feasibility checks, and Curved TVs need handling care because screen pressure can affect the panel.`,
    },
    {
      title: `Local coverage in ${city.name}`,
      text: `Coverage includes ${profile.nearbyText}. Availability depends on technician schedule, TV size, building access, parking, wall-mount status and whether the issue looks safe for doorstep inspection or needs workshop-level tools after diagnosis.`,
    },
    {
      title: 'Repair versus replacement guidance',
      text: 'Repair is often sensible when the panel glass is intact and the fault is linked to backlight, power, audio, HDMI, motherboard or software behavior. Replacement may be wiser if the panel is cracked, water damaged, heavily lined, or if the repair estimate comes close to the cost of a suitable new TV.',
    },
    {
      title: 'Pricing guidance',
      text: 'GR Solution does not publish fake fixed repair prices for complex TV faults. Final cost depends on brand, model, screen size, part availability, fault type and whether the work can be completed at home. The technician explains diagnosis and estimate before paid repair work begins.',
    },
  ];
}

function makeGenericWhyChoose(city) {
  return [
    `GR Solution uses symptom-led TV diagnosis for ${city.name}, so the technician checks what the TV is actually doing before suggesting repair.`,
    `Business details remain consistent: GR Solution, ${siteContactAddress}, phone +91 99902 83890 and email info@grsolution.co.in.`,
    `${city.trust}`,
    'Customers receive practical repair-versus-replace guidance instead of fake fixed-price claims or unverified brand authorization claims.',
  ];
}

export const cityTvRepairPages = cities.map((city) => {
  const profile = genericTvCityProfiles[city.slug];
  const otherCities = cities.filter((item) => item.slug !== city.slug);
  const serviceLinks = services.map((service) => ({
    label: `${service.title} ${city.name}`,
    href: `/services/${service.slug}-${city.slug}`,
  }));

  return {
    slug: `tv-repair-${city.slug}`,
    isGenericTvRepair: true,
    parentServiceSlug: null,
    citySlug: city.slug,
    cityName: city.name,
    serviceTitle: 'TV Repair',
    schemaServiceType: 'TV repair service',
    keyword: profile.keyword,
    title: `${profile.keyword} Service`,
    h1: profile.h1,
    metaTitle: profile.metaTitle,
    metaDescription: profile.metaDescription,
    image: profile.image,
    directAnswer: `Need TV repair in ${city.name}? GR Solution provides doorstep inspection, diagnosis, and repair support for LED, OLED/QLED, LCD, Plasma and Curved TV issues across ${city.name} and nearby NCR areas.`,
    intro: profile.intro,
    cityExplanation: profile.cityExplanation,
    localTrust: profile.localFocus,
    commonProblems: [
      'TV has sound but no picture or a completely black screen.',
      'Backlight is dim, uneven, flickering or not working.',
      'Screen shows vertical lines, patches, color distortion or half display.',
      'TV does not power on, restarts repeatedly or shuts down after heating.',
      'Smart TV apps, HDMI inputs, WiFi, remote or source switching fail.',
      'Panel, motherboard, power board, speaker or T-Con symptoms need diagnosis.',
    ],
    contentBlocks: makeGenericTvContentBlocks(city, profile),
    whyChoose: makeGenericWhyChoose(city),
    qualityChecks: ['picture and brightness test', 'sound output check', 'HDMI/source switching', 'smart app response', 'stability after repair'],
    repairReplace:
      'Repair is worth checking when the display glass is intact and the fault appears related to backlight, board, power, audio, input or software behavior. Replacement may be better when the panel is physically damaged, parts are unavailable, or the repair estimate is too close to a new TV.',
    beforeCalling:
      'Check the power socket, try a different input source, confirm whether sound is present, avoid pressing the screen, keep the TV model number ready, and share a short photo or video of the symptom if possible.',
    coverage: `TV repair coverage in ${city.name} includes ${profile.nearbyText} and nearby NCR locations, subject to technician schedule and service feasibility.`,
    pricing:
      'Pricing depends on screen size, brand, model, part availability and fault type. GR Solution gives an inspection-based estimate before any paid repair is started.',
    emergency: profile.urgency,
    process: [
      `Share your TV brand, size, symptom and ${city.name} location.`,
      'Get a call or WhatsApp response for visit planning.',
      'Technician checks display, sound, power, input and board symptoms.',
      'Repair feasibility and estimate are explained clearly.',
      'Approved repair is completed and checked for stable picture and sound.',
    ],
    faqs: makeGenericTvFaqs(city, profile),
    sameServiceOtherCities: otherCities.map((item) => ({
      label: `TV Repair ${item.name}`,
      href: `/services/tv-repair-${item.slug}`,
    })),
    otherServicesSameCity: serviceLinks,
    relatedServiceLinks: serviceLinks,
    brandCityLinks: [
      { label: `Sony TV Repair ${city.name}`, href: `/services/sony-tv-repair-${city.slug}` },
      { label: `Samsung TV Repair ${city.name}`, href: `/services/samsung-tv-repair-${city.slug}` },
      { label: `LG TV Repair ${city.name}`, href: `/services/lg-tv-repair-${city.slug}` },
      { label: `Mi/Xiaomi TV Repair ${city.name}`, href: `/services/mi-xiaomi-tv-repair-${city.slug}` },
    ],
    tvTypesCovered,
  };
});

export const nearMeServicePage = {
  slug: 'tv-repair-near-me',
  isGenericTvRepair: true,
  isNearMePage: true,
  parentServiceSlug: null,
  citySlug: 'delhi-ncr',
  cityName: 'Delhi NCR',
  serviceTitle: 'TV Repair Near Me',
  schemaServiceType: 'nearby TV repair service',
  keyword: 'TV Repair Near Me',
  title: 'TV Repair Near Me',
  h1: 'TV Repair Near Me in Delhi NCR',
  metaTitle: 'TV Repair Near Me | Doorstep TV Service | GR Solution',
  metaDescription: 'Looking for TV repair near me? GR Solution provides nearby doorstep TV diagnosis across Delhi, Noida, Greater Noida and Ghaziabad.',
  image: '/images/service_tv.webp',
  directAnswer:
    'Need TV repair near you in Delhi NCR? GR Solution provides doorstep inspection, diagnosis, and repair support for Smart TV, LED, OLED/QLED, LCD, Plasma and Curved TV issues across Delhi, Noida, Greater Noida, Ghaziabad and nearby NCR areas.',
  intro:
    'Near-me TV repair searches usually come from customers who need quick help but still want a trustworthy diagnosis. GR Solution handles nearby TV repair requests by first collecting the TV brand, size, symptom and service location, then planning whether the issue can start with doorstep inspection.',
  cityExplanation:
    'The near-me service page covers Delhi NCR, including Delhi, Noida, Greater Noida and Ghaziabad. It is built for searches such as smart tv repair near me, near me tv repair shop, best tv repair near me, Vu TV repair near me, Sony LED TV service center near me, LG LED TV repair near me and curved TV repair near me, while keeping the wording natural and non-spammy.',
  localTrust:
    'GR Solution is located at C-4/102, Pocket C 3, New Kondli, Kondli, Delhi 110096 and provides nearby doorstep TV repair support with inspection-based estimates, clear communication and safe handling guidance.',
  commonProblems: [
    'Smart TV apps are freezing, not loading or restarting.',
    'LED TV has sound but no picture or a weak backlight.',
    'OLED/QLED TV has lines, brightness problems or color distortion.',
    'TV does not power on or keeps shutting down.',
    'Remote, HDMI, WiFi, input source or sound is not working correctly.',
    'Curved TV display distortion or panel handling concerns need checking.',
  ],
  contentBlocks: [
    {
      title: 'How nearby TV repair requests work',
      text: 'When you contact GR Solution for nearby TV repair, share your location, TV brand, model, screen size and exact symptom. The team uses this information to plan doorstep inspection, explain whether the issue sounds like display, power, sound, software or board-related behavior, and avoid unnecessary TV movement before diagnosis.',
    },
    {
      title: 'Service areas across Delhi NCR',
      text: 'GR Solution supports Delhi, Noida, Greater Noida, Ghaziabad and nearby NCR locations. Availability depends on technician schedule, TV size, access, wall-mount status and whether the fault appears suitable for home inspection or safer workshop-level handling.',
    },
    {
      title: 'Common near-me search intents',
      text: 'Customers searching smart TV repair near me, Vu TV repair near me, LG LED TV repair near me or Sony LED TV service center near me usually want a fast answer. GR Solution provides independent doorstep repair support and does not claim official brand authorization unless separately verified.',
    },
    {
      title: 'What information to share',
      text: 'Share the symptom, whether sound is present, whether the screen glows, whether the TV recently fell or shifted, the model number, your local area and a short photo or video if useful. These details help the technician prepare the right inspection approach.',
    },
    {
      title: 'Repair versus replacement',
      text: 'Repair may be sensible for backlight, power, sound, HDMI, software or board faults. Replacement may be better for cracked panels, liquid damage, unavailable parts or estimates close to the cost of a new TV.',
    },
    {
      title: 'Pricing guidance',
      text: 'Nearby TV repair cost depends on screen size, brand, fault type, part availability and whether the issue can be handled at home. GR Solution provides an inspection-based estimate before repair work starts.',
    },
  ],
  whyChoose: [
    'Nearby support across Delhi NCR with clear location and scheduling communication.',
    `Consistent NAP details: GR Solution, ${siteContactAddress}, phone +91 99902 83890 and email info@grsolution.co.in.`,
    'Independent TV repair support without fake authorized service center claims.',
    'Practical guidance for Smart TV, LED, OLED/QLED, LCD, Plasma and Curved TV faults.',
  ],
  qualityChecks: ['power stability', 'picture and brightness', 'sound output', 'smart app response', 'HDMI/source switching'],
  repairReplace:
    'Repair is worth checking when the panel is intact and the symptom points to power, backlight, board, sound, input or software behavior. Replacement may be better when the panel is cracked, water damaged or too expensive to restore.',
  beforeCalling:
    'Keep the TV brand, model number, size, location and symptom ready. Check another socket and input source, note whether sound is present, and avoid opening the TV yourself.',
  coverage:
    'Nearby TV repair coverage includes Delhi, Noida, Greater Noida, Ghaziabad and nearby NCR areas, subject to technician route, access and repair feasibility.',
  pricing:
    'Pricing is inspection-based and depends on brand, size, fault type and parts. GR Solution avoids fake fixed-price claims for complex TV faults.',
  emergency:
    'For faster support, call or WhatsApp with your location, model number and symptom. A short video can help the team understand no display, lines, sound or power behavior before the visit.',
  process: [
    'Share your location, TV brand, model and issue.',
    'GR Solution checks nearby availability and visit feasibility.',
    'Technician inspects display, sound, power, board and smart TV behavior.',
    'You receive repair-versus-replace guidance and an estimate.',
    'Approved repair is completed and tested for stable use.',
  ],
  faqs: [
    {
      question: 'Does GR Solution provide TV repair near me?',
      answer: 'GR Solution provides nearby doorstep TV repair support across Delhi NCR, including Delhi, Noida, Greater Noida and Ghaziabad, subject to technician availability.',
    },
    {
      question: 'Do you handle smart TV repair near me?',
      answer: 'Yes, smart TV app, WiFi, HDMI, input, software and motherboard-related symptoms can be checked during diagnosis.',
    },
    {
      question: 'Can you repair Vu, Sony, LG and Samsung TVs?',
      answer: 'Yes, GR Solution provides independent repair support for major TV brands including Vu, Sony, LG, Samsung, Mi/Xiaomi, OnePlus, TCL, Panasonic, Philips and Hisense.',
    },
    {
      question: 'Are you an authorized brand service center?',
      answer: 'GR Solution provides independent doorstep TV repair support and does not claim official authorized brand service center status unless separately verified.',
    },
    {
      question: 'What TV issues can be checked at home?',
      answer: 'Many no-display, sound, power, backlight, HDMI, remote, smart app and board-related symptoms can start with doorstep inspection.',
    },
    {
      question: 'How much does nearby TV repair cost?',
      answer: 'Cost depends on model, size, fault and parts. GR Solution shares an inspection-based estimate before paid repair work begins.',
    },
    {
      question: 'What should I send before booking?',
      answer: 'Send your location, TV brand, model number, screen size, symptom and a short photo or video if the fault is visible.',
    },
    {
      question: 'How do I book support?',
      answer: 'Call, WhatsApp or submit the contact form and GR Solution will respond with next-step guidance.',
    },
  ],
  sameServiceOtherCities: cities.map((city) => ({
    label: `TV Repair ${city.name}`,
    href: `/services/tv-repair-${city.slug}`,
  })),
  otherServicesSameCity: [],
  relatedServiceLinks: cities.map((city) => ({
    label: `TV Repair ${city.name}`,
    href: `/services/tv-repair-${city.slug}`,
  })),
  brandCityLinks: [
    { label: 'Sony TV Repair Noida', href: '/services/sony-tv-repair-noida' },
    { label: 'Samsung TV Repair Delhi', href: '/services/samsung-tv-repair-delhi' },
    { label: 'LG TV Repair Delhi', href: '/services/lg-tv-repair-delhi' },
    { label: 'Vu TV Repair Delhi', href: '/services/vu-tv-repair-delhi' },
  ],
  tvTypesCovered,
};

export const localServicePages = [...serviceCityPages, ...cityTvRepairPages, nearMeServicePage];

export function getLocalServicePageBySlug(slug) {
  return localServicePages.find((page) => page.slug === slug);
}

export function getLocalPagesByService(serviceSlug) {
  return localServicePages.filter((page) => page.parentServiceSlug === serviceSlug);
}

export function getLocalPagesByCity(citySlug) {
  return localServicePages.filter((page) => page.citySlug === citySlug);
}
