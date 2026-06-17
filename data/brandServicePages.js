import { cities } from './localServicePages';

const siteContactAddress = 'C-4/102, Pocket C 3, New Kondli, Kondli, Delhi 110096';

// ---------------------------------------------------------------------------
// Brand profiles
// ---------------------------------------------------------------------------
// Each brand profile holds brand-specific repair language used to build
// unique, non-templated content for every brand x city combination.
// No "authorized service center" claims, no fake partnerships, no fake
// prices/ratings/reviews anywhere in this file.
// ---------------------------------------------------------------------------

export const brands = [
  {
    slug: 'samsung',
    slugSegment: 'samsung-tv-repair',
    name: 'Samsung',
    displayName: 'Samsung',
    image: '/images/service_tv.webp',
    techNote: 'LED, QLED and Crystal UHD display lines, along with Samsung Smart TV (Tizen) software',
    panelTypes: 'LED, QLED and Crystal UHD',
    commonIssues: [
      'Smart TV stuck in a boot loop or repeated restart cycle',
      'Backlight failure causing a dim or completely black screen',
      'Visible panel lines or banding across the QLED or Crystal UHD display',
      'Sound playing normally but no picture on screen',
      'TV not powering on or showing only a blinking standby light',
      'HDMI or input source not detected on LED and QLED models',
      'Smart Hub or app freezing on Tizen-based Smart TVs',
      'Motherboard or power board related shutdowns during use',
    ],
    repairGuidance:
      'Samsung LED and Crystal UHD sets generally use simpler backlight and panel layouts, so power, board and backlight faults are usually the first things checked. QLED models add a quantum dot filter layer behind the panel, so display-line and uniformity complaints need a more careful inspection before any part is assumed faulty. Tizen software issues such as Smart Hub freezing or boot loops are treated separately from hardware symptoms, since a software-side fix avoids unnecessary part replacement.',
    decisionGuidance:
      'A Samsung TV is usually worth repairing when the glass and panel are intact and the fault traces back to backlight, power board, mainboard or Smart Hub software. Replacement becomes the more sensible option when the QLED or Crystal UHD panel itself is cracked, water damaged, or when the repair estimate starts approaching the cost of a comparable new model.',
  },
  {
    slug: 'lg',
    slugSegment: 'lg-tv-repair',
    name: 'LG',
    displayName: 'LG',
    image: '/images/service_oled.webp',
    techNote: 'LED and OLED display lines, along with LG WebOS Smart TV software',
    panelTypes: 'LED and OLED',
    commonIssues: [
      'No display while the TV still powers on and shows a standby light',
      'OLED panel showing faint image retention or uneven brightness',
      'HDMI input not switching correctly between connected devices',
      'Backlight failure on LED models causing a dark or dim screen',
      'Sound output present but missing or distorted with picture issues',
      'WebOS home screen freezing, lagging or failing to load apps',
      'TV powering off on its own after a few minutes of use',
      'Visible lines, patches or flicker across the panel',
    ],
    repairGuidance:
      'LG LED TVs rely on a backlight and panel combination similar to most LED sets, so backlight strips, power supply and mainboard are the usual starting points for no-display complaints. LG OLED panels are self-emissive, so symptoms like image retention, uneven brightness or dark patches point toward the panel and driver board rather than a separate backlight unit, and are reviewed more cautiously since OLED panel replacement cost is significant. WebOS-related freezing or app crashes are usually a software-side issue and are checked separately from picture or sound hardware faults.',
    decisionGuidance:
      'Repair is usually the practical option for LG LED TVs when the fault sits in the backlight, power board or HDMI section and the panel glass is undamaged. For LG OLED TVs, repair makes sense for board, power or software issues, but panel-level OLED damage is compared honestly against replacement cost before recommending a repair path.',
  },
  {
    slug: 'sony',
    slugSegment: 'sony-tv-repair',
    name: 'Sony',
    displayName: 'Sony',
    image: '/images/service_tv.webp',
    techNote: 'Bravia LED and Android/Google TV display lines',
    panelTypes: 'Bravia LED and Android/Google TV',
    commonIssues: [
      'TV not turning on or showing no response to remote or power button',
      'Red or amber light blinking in a repeating pattern near standby',
      'Display lines, bands or color patches across the Bravia panel',
      'Sound and picture appearing out of sync or mismatched',
      'Android TV or Google TV interface freezing or restarting unexpectedly',
      'Backlight dimming unevenly across the screen',
      'HDMI or ARC audio input not being detected',
      'TV losing picture intermittently while sound continues normally',
    ],
    repairGuidance:
      'Sony Bravia TVs often use a blinking standby light as a built-in fault indicator, so the blink pattern is checked first to narrow down whether the issue is power supply, backlight, panel or mainboard related before opening the unit. Android TV and Google TV software issues such as interface freezing or app crashes are treated as a separate diagnostic path from picture and sound hardware faults, since many of these resolve without part replacement. Sound and picture mismatch on Bravia models is usually traced to the mainboard or HDMI processing rather than the speakers themselves.',
    decisionGuidance:
      'Repairing a Sony Bravia TV is generally worthwhile when the standby light pattern and symptoms point to power, backlight or board issues with the panel itself undamaged. Replacement becomes more sensible if the panel has physical damage, internal display lines spread further after initial diagnosis, or the repair estimate is close to current Bravia pricing for an equivalent screen size.',
  },
  {
    slug: 'mi',
    slugSegment: 'mi-tv-repair',
    name: 'Mi/Xiaomi',
    displayName: 'Mi/Xiaomi',
    image: '/images/service_panel.webp',
    techNote: 'Mi/Xiaomi Android TV display lines running PatchWall and Android TV software',
    panelTypes: 'Mi/Xiaomi Android TV LED',
    commonIssues: [
      'TV stuck on the boot logo or restarting in a loop',
      'PatchWall or Android TV home screen lagging, freezing or crashing',
      'WiFi disconnecting repeatedly or failing to stay connected',
      'Remote not pairing or losing Bluetooth connection with the TV',
      'Backlight failure causing a dim or fully black screen',
      'Motherboard related issues causing random restarts or shutdowns',
      'No sound or distorted audio output from built-in speakers',
      'HDMI input showing no signal from a connected device',
    ],
    repairGuidance:
      'Mi/Xiaomi Android TVs commonly bring boot loop, WiFi drop and remote pairing complaints that are largely software or connectivity related rather than panel faults, so these are checked before assuming a hardware problem. Backlight and motherboard issues are inspected separately, since Mi TV motherboards handle both display driving and smart features, and a board-level fault can present as several unrelated-looking symptoms at once. Remote pairing issues are usually resolved through re-pairing or battery checks rather than repair work.',
    decisionGuidance:
      'Repair is usually sensible for Mi/Xiaomi TVs when the issue is WiFi, software, remote pairing, motherboard or backlight related and the panel is physically fine. Replacement becomes more reasonable only when the panel itself is damaged or the motherboard fault repeats after a previous repair attempt, since board-level parts can be harder to source for older Mi TV models.',
  },
  {
    slug: 'oneplus',
    slugSegment: 'oneplus-tv-repair',
    name: 'OnePlus',
    displayName: 'OnePlus',
    image: '/images/service_panel.webp',
    techNote: 'OnePlus Android TV LED and QLED display lines',
    panelTypes: 'OnePlus Android TV LED and QLED',
    commonIssues: [
      'Built-in speakers producing distorted, low or no sound',
      'Screen flickering intermittently during normal viewing',
      'Power board issues causing the TV to shut down unexpectedly',
      'Android TV apps crashing or closing without warning',
      'Backlight unevenness on QLED models, especially near the edges',
      'TV not responding to the OnePlus remote or its Bluetooth pairing',
      'No display while audio continues to play normally',
      'HDMI input losing signal intermittently',
    ],
    repairGuidance:
      'OnePlus Android TVs combine standard LED or QLED panels with Android TV software, so sound and app-crash complaints are checked on the software side first before assuming a speaker or board fault. Screen flicker and backlight unevenness on QLED variants are inspected at the power supply and backlight driver level, since these symptoms often trace back there rather than the panel glass itself. Power board issues causing unexpected shutdowns are treated as a priority check given how directly they affect daily usability.',
    decisionGuidance:
      'OnePlus TV repair is usually worth pursuing when flicker, sound, power board or app-related issues are present and the panel is intact. Replacement is more reasonable if the QLED panel develops physical damage or persistent display lines that point to a panel-level fault rather than a backlight or board issue.',
  },
  {
    slug: 'tcl',
    slugSegment: 'tcl-tv-repair',
    name: 'TCL',
    displayName: 'TCL',
    image: '/images/service_tv.webp',
    techNote: 'LED and QLED display lines running Roku, Android TV or Google TV software',
    panelTypes: 'LED and QLED',
    commonIssues: [
      'No display on the screen despite the TV showing power',
      'Backlight failure leading to a dark or dim picture',
      'Screen flicker that worsens after the TV has been on for a while',
      'Motherboard related restarts or random shutdowns',
      'Roku, Android TV or Google TV interface freezing on startup',
      'HDMI input not detecting a connected set-top box or streaming device',
      'Sound cutting out intermittently during playback',
      'Visible lines or patches appearing across the LED or QLED panel',
    ],
    repairGuidance:
      'TCL TVs are sold with different smart platforms depending on the model, so the first useful detail is whether the unit runs Roku, Android TV or Google TV, since this changes how software-related freezing or interface issues are diagnosed. Backlight and motherboard checks are prioritized for no-display and flicker complaints, since TCL LED and QLED panels commonly show these as power-related symptoms rather than panel damage. HDMI detection issues are usually traced to the input board or a loose connection rather than the panel.',
    decisionGuidance:
      'Repairing a TCL TV is generally the better option when backlight, motherboard, HDMI or software symptoms are present and the panel itself shows no physical damage. Replacement is worth considering if the panel develops visible lines that spread over time or if the repair estimate approaches the price of a similarly sized new TCL model.',
  },
  {
    slug: 'panasonic',
    slugSegment: 'panasonic-tv-repair',
    name: 'Panasonic',
    displayName: 'Panasonic',
    image: '/images/service_tv.webp',
    techNote: 'LED and LCD display lines, including older Panasonic TV models',
    panelTypes: 'LED and LCD',
    commonIssues: [
      'Power board failure causing the TV to not switch on at all',
      'No signal or no channel detection on older LCD models',
      'Sound distortion or muffled audio from built-in speakers',
      'Visible lines appearing across the LED or LCD panel',
      'Backlight dimming unevenly over time',
      'TV taking unusually long to power on or display an image',
      'Remote not responding consistently to commands',
      'Capacitor or board-level faults common in older Panasonic units',
    ],
    repairGuidance:
      'Panasonic TVs in service today often include older LED and LCD models, so power board and capacitor-related faults are checked early, since these are common failure points as the unit ages. No-signal or no-channel complaints on older LCD sets are usually a tuner or board issue rather than a panel fault, and panel lines are inspected separately to rule out backlight versus glass-level damage. Slow power-on behavior is generally linked to a weakening power board rather than the panel itself.',
    decisionGuidance:
      'For older Panasonic LED or LCD TVs, repair is often the more economical choice when the fault is power board, capacitor, tuner or sound related, since these parts are usually straightforward to source and service. Replacement becomes more sensible if the panel itself is damaged or if the TV is old enough that repeated board failures make further repair impractical.',
  },
  {
    slug: 'vu',
    slugSegment: 'vu-tv-repair',
    name: 'Vu',
    displayName: 'Vu',
    image: '/images/service_panel.webp',
    techNote: 'LED and Smart TV display lines',
    panelTypes: 'LED and Smart TV',
    commonIssues: [
      'TV stuck during the boot or startup screen',
      'Display showing no picture while the TV remains powered on',
      'Sound that cuts in and out or plays at an inconsistent volume',
      'Motherboard related issues causing the TV to restart on its own',
      'Backlight failure resulting in a dim or black screen',
      'Smart TV apps lagging or failing to open',
      'HDMI input not switching properly between sources',
      'Remote pairing or response issues on Smart TV models',
    ],
    repairGuidance:
      'Vu TVs are checked first for boot and motherboard-related symptoms, since startup freezes and random restarts are among the more frequently reported issues on Vu Smart TV models. Backlight and display checks follow a similar inspection approach to other LED sets, focusing on separating panel damage from power or backlight driver faults. Smart TV app lag is treated as a software issue and diagnosed apart from picture and sound hardware faults.',
    decisionGuidance:
      'Repair is usually a reasonable option for Vu TVs when the issue is backlight, motherboard, sound or software related and the panel is undamaged. Replacement is worth considering when panel-level damage is confirmed or when board-level faults recur after an earlier repair.',
  },
  {
    slug: 'philips',
    slugSegment: 'philips-tv-repair',
    name: 'Philips',
    displayName: 'Philips',
    image: '/images/service_tv.webp',
    techNote: 'LED and Smart TV display lines',
    panelTypes: 'LED and Smart TV',
    commonIssues: [
      'No picture on the screen despite normal sound output',
      'Panel showing lines, patches or uneven brightness',
      'Audio distortion or low volume from built-in speakers',
      'Remote not responding or pairing issues on Smart TV models',
      'Smart TV apps freezing or failing to load on startup',
      'TV not powering on or showing only a standby indicator',
      'Backlight unevenness across the screen',
      'HDMI or input source switching problems',
    ],
    repairGuidance:
      'Philips LED and Smart TVs are checked for sound-but-no-picture complaints by isolating panel, backlight and board symptoms early, since this combination is one of the more frequently reported issues. Remote and Smart app issues on Philips Smart TV models are diagnosed as a separate software-side path, since these often resolve through pairing or software fixes rather than part replacement. Audio distortion is checked at the board and speaker level before assuming a deeper hardware fault.',
    decisionGuidance:
      'Repairing a Philips TV is generally worthwhile when backlight, board, audio or remote/app issues are present and the panel remains undamaged. Replacement becomes the more sensible choice if the panel shows physical damage or persistent display lines that point to a panel-level fault.',
  },
  {
    slug: 'hisense',
    slugSegment: 'hisense-tv-repair',
    name: 'Hisense',
    displayName: 'Hisense',
    image: '/images/service_panel.webp',
    techNote: 'LED, UHD and QLED display lines running Hisense Smart TV software',
    panelTypes: 'LED, UHD and QLED',
    commonIssues: [
      'No display on the screen while the TV appears to power on',
      'Backlight failure causing a dim or completely black picture',
      'Board-level issues leading to unexpected shutdowns',
      'Smart TV software freezing, lagging or failing to update',
      'Sound output that is distorted, low or missing entirely',
      'Visible lines or color patches across the LED, UHD or QLED panel',
      'HDMI input not detecting a connected device',
      'TV restarting on its own during normal use',
    ],
    repairGuidance:
      'Hisense LED, UHD and QLED TVs are checked for backlight and board-level faults first when a no-display or shutdown complaint is reported, since these are common across most Hisense model ranges. Smart TV software freezing or update failures are diagnosed separately from hardware symptoms, since a software reset or update often resolves the issue without opening the unit. Sound and HDMI complaints are checked at the board and connector level rather than assumed to be panel faults.',
    decisionGuidance:
      'Repair is usually the sensible choice for Hisense TVs when backlight, board, software or HDMI issues are present and the panel itself is intact. Replacement is worth considering if the panel develops physical damage or if board-level faults recur despite an earlier repair.',
  },
];

// ---------------------------------------------------------------------------
// Slug helper
// ---------------------------------------------------------------------------
// Xiaomi uses the "mi-tv-repair-city" slug pattern explicitly while the
// visible page content can still say "Mi/Xiaomi TV Repair".
function makeBrandCitySlug(brand, city) {
  return `${brand.slugSegment}-${city.slug}`;
}

function makeFaqs(brand, city) {
  return [
    {
      question: `Do you provide ${brand.displayName} TV repair in ${city.name}?`,
      answer: `Yes, GR Solution provides doorstep inspection and repair support for ${brand.displayName} TVs across ${city.name} and nearby NCR areas.`,
    },
    {
      question: `Is GR Solution an authorized ${brand.displayName} service center?`,
      answer: `GR Solution is an independent TV repair service. We do not claim authorized brand service center status, and we provide repair support based on technician diagnosis and part availability.`,
    },
    {
      question: `What ${brand.displayName} TV problems can be repaired?`,
      answer: `${brand.commonIssues.slice(0, 3).join(' ')} A technician confirms the exact fault during inspection before any repair is approved.`,
    },
    {
      question: `Can a ${brand.displayName} TV be repaired at home in ${city.name}?`,
      answer: `Many ${brand.displayName} TV issues can be diagnosed and repaired at the doorstep. If a fault needs safer workshop-level handling, the technician explains this clearly before moving ahead.`,
    },
    {
      question: `How much does ${brand.displayName} TV repair cost in ${city.name}?`,
      answer: 'Final repair cost depends on the model, screen size, fault type and parts availability. GR Solution provides inspection-based guidance before repair instead of fixed pricing.',
    },
    {
      question: `Should I repair or replace my ${brand.displayName} TV?`,
      answer: brand.decisionGuidance,
    },
    {
      question: `Which areas in ${city.name} do you cover for ${brand.displayName} TV repair?`,
      answer: `Common coverage includes ${city.nearby.join(', ')} and nearby localities, subject to scheduling and service availability.`,
    },
    {
      question: `How do I book ${brand.displayName} TV repair in ${city.name}?`,
      answer: 'Call, WhatsApp or use the website contact form with your TV model, the issue you are facing and your service location in the city.',
    },
  ];
}

function makeCommonProblemsSection(brand) {
  return brand.commonIssues;
}

function makeRepairProcess(brand, city) {
  return [
    `Share your ${brand.displayName} TV issue and ${city.name} location with GR Solution.`,
    'Get a visit schedule or next-step guidance based on the symptoms described.',
    `Technician inspects the ${brand.panelTypes} display, power, sound and board behavior.`,
    'Receive a clear, inspection-based repair estimate before any work begins.',
    'Approved repair is completed and tested for stable picture and sound before handover.',
  ];
}

function makeWhyChoose(brand, city) {
  return [
    `GR Solution follows a symptom-led approach for ${brand.displayName} TV repair, so the visit starts with what the TV is actually doing rather than a rushed assumption.`,
    `Business details stay consistent for local trust: GR Solution, ${siteContactAddress}, phone +91 99902 83890 and email info@grsolution.co.in.`,
    `${city.trust}`,
    `For ${brand.displayName} TVs specifically, the team explains whether the issue is repairable at home, needs safer workshop handling, or should be weighed against replacement before money is spent.`,
  ];
}

export const brandServicePages = brands.flatMap((brand) =>
  cities.map((city) => {
    const slug = makeBrandCitySlug(brand, city);
    const title = `${brand.displayName} TV Repair in ${city.name}`;
    const h1 = `${brand.displayName} TV Repair in ${city.name}`;
    const keyword = `${brand.displayName} TV repair in ${city.name}`;
    const otherCities = cities.filter((item) => item.slug !== city.slug);
    const otherBrands = brands.filter((item) => item.slug !== brand.slug);

    return {
      slug,
      brandSlug: brand.slug,
      brand: brand.displayName,
      citySlug: city.slug,
      city: city.name,
      cityName: city.name,
      title,
      h1,
      metaTitle: `${brand.displayName} TV Repair ${city.name} | Doorstep Service | GR Solution`,
      metaDescription: `Need ${brand.displayName} TV repair in ${city.name}? GR Solution provides doorstep inspection and repair support for ${brand.displayName} TV issues across ${city.name} and nearby NCR areas.`,
      image: brand.image,
      heroIntro: `Need ${keyword}? GR Solution provides doorstep inspection and repair support for ${brand.displayName} ${brand.panelTypes} and Smart TV issues across ${city.name} and nearby NCR areas.`,
      directAnswer: `GR Solution offers doorstep ${brand.displayName} TV repair service in ${city.name}, covering ${brand.techNote}. A technician inspects the reported issue and shares a clear, inspection-based estimate before any repair work begins.`,
      intro: `${brand.displayName} TVs use ${brand.techNote}, and faults can range from simple software glitches to backlight, power or board-level issues. If you are looking for ${keyword}, GR Solution helps you understand the actual fault before approving repair, instead of guessing or replacing parts unnecessarily.`,
      cityExplanation: `${city.localNote} Our ${brand.displayName} TV repair support in ${city.name} is built around symptom-first inspection, so customers do not have to guess whether the issue is a power board, panel, backlight, software or input problem.`,
      commonIssues: makeCommonProblemsSection(brand),
      repairProcess: makeRepairProcess(brand, city),
      cityCoverage: `Service coverage for ${keyword} includes ${city.nearby.join(', ')} and nearby NCR pockets. Availability depends on technician schedule, TV size, access and part requirements.`,
      repairVsReplace: brand.decisionGuidance,
      repairGuidance: brand.repairGuidance,
      beforeCallingChecklist: [
        'Check that the power socket and switch are working normally.',
        'Try the remote with fresh batteries to rule out a remote-side issue.',
        'Switch to a different HDMI or input source to confirm the symptom.',
        'Restart the TV using the power button rather than only the remote.',
        'Note whether sound is present even when the picture is not.',
        `Keep the exact ${brand.displayName} model number ready before calling.`,
      ],
      pricingNote:
        'Final repair cost depends on model, screen size, fault type, and parts availability. GR Solution provides inspection-based guidance before repair, and does not publish fixed prices for complex faults.',
      whyChoose: makeWhyChoose(brand, city),
      faqs: makeFaqs(brand, city),
      relatedBrandCityLinks: otherCities.map((item) => ({
        label: `${brand.displayName} TV Repair in ${item.name}`,
        href: `/services/${makeBrandCitySlug(brand, item)}`,
      })),
      relatedCityServiceLinks: otherBrands.slice(0, 6).map((item) => ({
        label: `${item.displayName} TV Repair in ${city.name}`,
        href: `/services/${makeBrandCitySlug(item, city)}`,
      })),
      panelTypes: brand.panelTypes,
      techNote: brand.techNote,
    };
  })
);

export function getBrandServicePageBySlug(slug) {
  return brandServicePages.find((page) => page.slug === slug);
}

export function getBrandServicePagesByBrand(brandSlug) {
  return brandServicePages.filter((page) => page.brandSlug === brandSlug);
}

export function getBrandServicePagesByCity(citySlug) {
  return brandServicePages.filter((page) => page.citySlug === citySlug);
}

export function getPrimaryBrandCityPage(brandSlug) {
  // Used for the "TV Repair by Brand" section on /services — links each
  // brand card to its Delhi page as the primary entry point.
  return brandServicePages.find((page) => page.brandSlug === brandSlug && page.citySlug === 'delhi');
}