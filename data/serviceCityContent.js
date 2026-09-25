// Hand-written content for each service x city page.
//
// Each entry covers what is specific to that TV type in that city -- the sets
// people there tend to own, how the housing affects handling, and the local
// situations that come up most. None of it is generated from a template, which
// is the point: the service-by-city pages were ~68% identical before this.
//
// `situations` rows describe common situations and how they are approached.
// They are deliberately NOT presented as completed customer jobs.

const cols = ['Situation', 'What we check first', 'Usual path'];

export const serviceCityContent = {
  // ------------------------------------------------------------------ LED
  'led-tv-repair-delhi': {
    heading: 'LED TVs in Delhi homes: what tends to go wrong',
    paragraphs: [
      'In Delhi the LED sets we are called to span a decade of models. A 2016 32-inch in a Laxmi Nagar builder floor and a 2023 55-inch 4K in a Mayur Vihar society flat are both "LED TVs", but they fail differently. Older edge-lit sets most often lose their backlight strips; newer direct-lit sets more often come to us with a mainboard or power-supply complaint after a voltage event.',
      'Delhi summers are the busiest season for LED power-board faults. A set that went dark during a storm, or failed the moment power returned after a cut, points us to the power section before anything else. Because we are based in New Kondli, East Delhi requests are usually the quickest to schedule; for South and West Delhi, a good symptom description lets the technician carry the right strip or board on the first trip.',
      "Before the visit: if the set shares an extension board with a set-top box and a router, note that. Delhi homes often run everything from one power strip, and a failing strip can mimic a TV power fault. Plug the TV straight into the wall socket once — if it starts, the strip was the problem and no repair is needed.",
    ],
    situations: {
      caption: 'Common LED TV situations in Delhi',
      columns: cols,
      rows: [
        ['Set went dark after a summer storm', 'Power board and surge damage', 'Board repair, usually on site'],
        ['Older 32" set, sound but black screen', 'Backlight strips with a torch test', 'Strip replacement if the panel is intact'],
        ['Wall-mounted set in a builder floor, no lift', 'Whether it can be fixed without dismounting', 'On-site repair preferred to avoid stairs'],
      ],
    },
    faqs: [
      {
        question: 'My LED TV stopped after the power came back in Delhi. Is it the screen?',
        answer: 'Rarely. A TV that fails the moment power returns after a cut is showing a classic power-board symptom. The panel is usually untouched, and a power-board repair costs a fraction of a screen replacement.',
      },
      {
        question: 'How fast can you reach East Delhi for LED TV repair?',
        answer: 'East Delhi is closest to our New Kondli base, so Mayur Vihar, Laxmi Nagar, Preet Vihar and nearby areas are usually the quickest visits to schedule, subject to the day’s bookings.',
      },
    ],
  },
  'led-tv-repair-noida': {
    heading: 'LED TVs in Noida societies: large screens, wall mounts',
    paragraphs: [
      'The typical Noida LED repair is a 50- to 65-inch set on a wall bracket in a high-rise flat. That combination shapes the job. Backlight replacement on a large direct-lit panel means taking the set off the wall and laying the panel face-down on a clean, padded surface. In a compact living room that is not always possible, and it is the main reason a Noida LED job sometimes moves to the workshop.',
      'Noida’s society generator changeovers are the other recurring theme. LED sets that fail at the moment backup kicks in usually have a power-supply fault, not a panel one. Sector 15, 16 and 18 are a short drive from our New Kondli base. For the Expressway sectors and Noida Extension, send the model number from the back sticker before the visit so the right board or strip can be matched in advance.',
      "Before the visit: note whether the TV failed during a power cut, when the generator took over, or when mains came back. That timing tells the technician which part of the power path to test first. If your society allows it, clear a two-metre stretch of floor near the TV in case the panel needs to be laid down.",
    ],
    situations: {
      caption: 'Common LED TV situations in Noida',
      columns: cols,
      rows: [
        ['Failed during a generator changeover', 'Power supply board', 'Board repair, often on site'],
        ['65" wall-mounted set, dim or dark picture', 'Backlight array after dismounting', 'Workshop if floor space is too tight'],
        ['Sector 62 office display not starting', 'Power, mainboard and input source', 'Scheduled office-hours visit'],
      ],
    },
    faqs: [
      {
        question: 'Can you repair a large wall-mounted LED TV inside a Noida flat?',
        answer: 'Often yes. Power board, mainboard and input repairs are done in place. Backlight work on a 55-inch-plus panel needs a clear, padded floor area; if the room cannot offer one, the set goes to the workshop instead of being opened in unsafe conditions.',
      },
      {
        question: 'Do you need a gate pass for LED TV repair visits in Noida societies?',
        answer: 'Most societies register visitors at the gate. Pre-approving the technician through your society app, and booking the service lift if the set may leave the flat, avoids delays.',
      },
    ],
  },
  'led-tv-repair-greater-noida': {
    heading: 'LED TV repair in Greater Noida: making one visit enough',
    paragraphs: [
      'Greater Noida is a long drive from our base, so an LED repair here depends on preparation more than anywhere else. The most useful thing you can send before the visit is a 20-second video: switch the TV on, show the standby light, and shine a phone torch at the screen at a sharp angle. That clip usually separates a backlight fault from a board fault before the technician leaves.',
      'Plotted houses in the Alpha, Beta and Gamma sectors make handling easy: there is space to lay a panel down, and stairs are short. In Greater Noida West townships the planning is more like Noida — gate registration and the service lift. Because moving a large LED panel over a long route adds crack risk, on-site repair is the default here whenever the fault allows it.',
      "Before the visit: if your home runs on an inverter, check whether the TV fails only on inverter power or on mains as well. A set that works fine on mains but dies on backup points at the inverter output, not the TV — and that saves you the cost of a board repair altogether.",
    ],
    situations: {
      caption: 'Common LED TV situations in Greater Noida',
      columns: cols,
      rows: [
        ['Villa on inverter backup, set dies on changeover', 'Power board and inverter output quality', 'Board repair plus inverter advice'],
        ['Faint picture visible under a torch', 'Backlight strips and driver', 'On-site strip replacement where space allows'],
        ['Greater Noida West flat, no picture, no sound', 'Power and mainboard', 'Parts matched from the model number first'],
      ],
    },
    faqs: [
      {
        question: 'What should I send before booking LED TV repair in Greater Noida?',
        answer: 'The model number from the back sticker and a short video showing the standby light and the screen under a torch. With those, the technician can usually bring the right part and finish in a single visit.',
      },
      {
        question: 'Can an inverter damage an LED TV?',
        answer: 'An ageing or undersized inverter can deliver unstable output that stresses the TV’s power supply. If your set fails at changeover, have the inverter output checked as well as the TV.',
      },
    ],
  },
  'led-tv-repair-ghaziabad': {
    heading: 'LED TVs in Ghaziabad: the family set that never switches off',
    paragraphs: [
      'The LED TVs we see in Ghaziabad are mostly the household’s main screen, on for most of the day — typically 32- to 43-inch sets in Vaishali and Vasundhara, larger 50- to 55-inch sets in Indirapuram societies. Long daily running hours wear backlight LEDs faster, so a gradually dimming picture, or a screen that goes dark while sound continues, is the single most common Ghaziabad LED complaint.',
      'For these mid-size sets the repair-or-replace maths is close, so we give an honest comparison against the price of a new equivalent TV. Kaushambi, Vaishali and Indirapuram are a short trip from New Kondli. Builder floors without lifts are common in the older Vaishali and Vasundhara sectors — mention the floor when booking.',
      "Before the visit: switch the TV to a bright, static menu screen and look at it from a metre away. Darker patches along the top or bottom edge suggest edge-lit strip wear; a dark grid pattern across the whole screen suggests a direct-lit array. Either detail helps the technician bring the right strip set.",
    ],
    situations: {
      caption: 'Common LED TV situations in Ghaziabad',
      columns: cols,
      rows: [
        ['Picture has dimmed gradually over months', 'Backlight LED wear', 'Strip replacement, usually worthwhile'],
        ['Indirapuram 55" set, lines after a knock', 'Panel damage versus T-Con', 'Honest replace-versus-repair comparison'],
        ['Set-top box not detected on HDMI', 'Cable, source, then HDMI port', 'Often fixed without opening the TV'],
      ],
    },
    faqs: [
      {
        question: 'Why has my LED TV picture got dimmer over time?',
        answer: 'Backlight LEDs lose brightness with running hours, and sets that are on most of the day wear faster. A backlight strip replacement restores brightness without touching the panel.',
      },
      {
        question: 'Is it worth repairing a 43-inch LED TV in Ghaziabad?',
        answer: 'If the panel is intact and the fault is backlight, power or a board, usually yes. If the panel is cracked, a new 43-inch set often costs about the same as the repair, and we will say so.',
      },
    ],
  },

  // ------------------------------------------------------------ OLED/QLED
  'oled-qled-tv-repair-delhi': {
    heading: 'OLED and QLED sets in Delhi: slow, careful diagnosis',
    paragraphs: [
      'Premium sets in Delhi are spread across very different homes — a South Delhi independent house with a 77-inch OLED in a dedicated room, or a 55-inch QLED in a Dwarka society flat. What they share is cost: an OLED panel is the most expensive component in consumer TV. So the first visit is spent proving what has failed before any expensive part is discussed.',
      'Delhi’s summer heat is relevant here. OLED sets run periodic panel-refresh cycles when switched off on standby, and sets that are unplugged at the wall every night never run them. That can make image retention look worse than it is. Before calling a panel failed, we check whether a refresh cycle clears it.',
      "Before the visit: leave the OLED on standby, not unplugged, overnight at least once. If retention fades by morning, the panel’s own refresh cycle was the fix. For QLED sets, switch off any eco or ambient-light brightness mode, which can make a healthy panel look unevenly dim.",
    ],
    situations: {
      caption: 'Common OLED and QLED situations in Delhi',
      columns: cols,
      rows: [
        ['OLED shows faint logo retention', 'Whether panel refresh has been running', 'Often cleared without any part'],
        ['QLED in a South Delhi home, sudden dark zones', 'Local-dimming backlight zones', 'Backlight repair, not panel replacement'],
        ['Premium set dead after a voltage spike', 'Power board and protection circuit', 'Board repair on site'],
      ],
    },
    faqs: [
      {
        question: 'Can OLED image retention in Delhi be fixed without a new panel?',
        answer: 'Often. Many OLED sets run a panel-refresh cycle on standby, and sets unplugged every night never get to run it. We check whether a refresh clears the retention before any panel discussion.',
      },
      {
        question: 'Do you handle large 65- and 77-inch OLED TVs in Delhi?',
        answer: 'Yes. Large premium panels are handled by two people and repaired on site wherever the fault allows, because moving them is the riskiest part of the job.',
      },
    ],
  },
  'oled-qled-tv-repair-noida': {
    heading: 'Premium TVs in Noida: the biggest share of OLED and QLED we see',
    paragraphs: [
      'Noida’s newer societies, especially along the Expressway, have the highest share of large QLED and OLED sets in our service area. Many are 65 inches or more and mounted flush on the wall. For these, the question that matters most is not the fault. It is whether the repair can be done without taking the set off the wall and down a lift.',
      'QLED sets are LED panels with a quantum-dot layer, so most of their faults — backlight zones, power, mainboard — are repairable in the same way as any LED set. OLED is different: with no separate backlight, a genuine panel fault is the whole panel. On a 55-inch OLED that can cost ₹45,000 or more, so for Noida premium sets we always price a new television alongside the repair.',
      "Before the visit: find the purchase invoice. Many premium sets in Noida’s newer societies are still inside the manufacturer warranty or an extended plan bought with the TV, and a covered fault should go to the brand first. If the warranty has lapsed, the invoice still helps identify the exact model variant.",
    ],
    situations: {
      caption: 'Common OLED and QLED situations in Noida',
      columns: cols,
      rows: [
        ['Flush-mounted 65" QLED, patchy brightness', 'Local-dimming zones and backlight driver', 'Repair; dismount only if needed'],
        ['OLED with a thin vertical line', 'Panel driver versus panel damage', 'Panel quote compared against a new set'],
        ['Premium set frozen on the logo', 'Firmware and mainboard', 'Software recovery first, board second'],
      ],
    },
    faqs: [
      {
        question: 'Is QLED TV repair in Noida cheaper than OLED repair?',
        answer: 'Usually, yes. A QLED is an LED panel with a quantum-dot layer, so backlight, power and board faults are repaired much like any LED set. A true OLED panel fault means replacing the whole panel, which is the most expensive repair there is.',
      },
      {
        question: 'Will my flush-mounted TV need to come off the wall?',
        answer: 'Not for software, power-board or input repairs. Backlight and panel-level work does need the set dismounted, and on a large premium set that is done by two people.',
      },
    ],
  },
  'oled-qled-tv-repair-greater-noida': {
    heading: 'OLED and QLED repair in Greater Noida: fix it where it hangs',
    paragraphs: [
      'For a premium panel, the riskiest part of a repair is transport, and Greater Noida visits involve the longest routes we drive. So the rule for OLED and QLED sets here is simple: repair on site whenever the fault allows. That covers the majority of premium faults, because most are in the power, mainboard or software sections rather than the panel.',
      'Villas in the plotted sectors make on-site work straightforward — there is room to support a large panel properly. In Greater Noida West townships, where rooms are smaller, we plan ahead. If a set truly must travel, it goes upright in a braced frame, never flat, and only after you have had the cost comparison against a new set.',
      "Before the visit: photograph the symptom on a plain grey or white test screen — most sets have one in their picture menu — and send it with the model number. On a premium panel, a clear photo separates a panel line from a board fault more reliably than any description.",
    ],
    situations: {
      caption: 'Common OLED and QLED situations in Greater Noida',
      columns: cols,
      rows: [
        ['Villa home cinema OLED, no picture', 'Power and mainboard before the panel', 'On-site board repair'],
        ['QLED colour tint across the whole screen', 'Picture settings, source, T-Con', 'Often settled without parts'],
        ['Greater Noida West flat, set must travel', 'Whether the fault truly needs a bench', 'Braced upright transport only if unavoidable'],
      ],
    },
    faqs: [
      {
        question: 'Do premium TVs from Greater Noida go to your workshop?',
        answer: 'Only when the fault genuinely needs a bench. Because routes are long and transport is the biggest risk to a premium panel, on-site repair is the default for OLED and QLED sets in Greater Noida.',
      },
      {
        question: 'My QLED has a colour tint everywhere. Is the panel failing?',
        answer: 'Not necessarily. A uniform tint is often a picture-mode, source or T-Con issue. Panel faults tend to show as localised patches or lines rather than an even cast across the whole screen.',
      },
    ],
  },
  'oled-qled-tv-repair-ghaziabad': {
    heading: 'OLED and QLED in Ghaziabad: getting a straight answer',
    paragraphs: [
      'Premium sets in Ghaziabad are concentrated in the high-rise societies of Indirapuram, Raj Nagar Extension and Crossings Republik, usually 55- or 65-inch QLEDs bought as the family’s upgrade TV. Because these sets are recent, owners should check the manufacturer warranty first — a fault covered by warranty should not be paid for.',
      'Outside warranty, the most common Ghaziabad QLED complaint is uneven brightness: bright corners, darker patches or a "cloudy" look on dark scenes. That is usually the local-dimming backlight, and it is repairable. The less common but more serious case is an impact line on a panel after a household knock. There we give a straight comparison, because a new panel on a mid-priced QLED can cost close to a new TV.',
      "Before the visit: check the warranty card and any extended-warranty paperwork from the retailer. Then note whether the fault appears on the TV’s own apps as well as the set-top box. A fault on only one HDMI source is usually the cable or the source device, not the premium panel.",
    ],
    situations: {
      caption: 'Common OLED and QLED situations in Ghaziabad',
      columns: cols,
      rows: [
        ['Recent QLED with a fault', 'Warranty status', 'Manufacturer first if still covered'],
        ['Cloudy or patchy dark scenes', 'Local-dimming backlight zones', 'Backlight repair'],
        ['Line across the screen after a knock', 'Panel damage', 'Repair-versus-replace comparison'],
      ],
    },
    faqs: [
      {
        question: 'Should I check the warranty before OLED or QLED repair?',
        answer: 'Yes. Many premium sets in Ghaziabad are only a few years old. If the fault is covered by the manufacturer warranty, use it — we will tell you if the symptom looks like a warranty case.',
      },
      {
        question: 'Why does my QLED look cloudy on dark scenes?',
        answer: 'Uneven dark-scene brightness usually comes from the local-dimming backlight rather than the quantum-dot panel, and it is generally repairable without replacing the screen.',
      },
    ],
  },

  // ------------------------------------------------------------------ LCD
  'lcd-tv-repair-delhi': {
    heading: 'LCD TVs in Delhi: older sets, practical decisions',
    paragraphs: [
      'Delhi still has a lot of working LCD televisions, especially in older colonies and DDA flats where a set bought over a decade ago has become the bedroom or kitchen TV. Older LCDs use CCFL tube backlights and inverter boards rather than LED strips, and a failed inverter is one of the most common — and most repairable — LCD faults.',
      'The honest part of LCD repair is parts availability. For popular models, inverter and power boards are still obtainable in Delhi’s component markets. For obscure or very old models, they may not be. We confirm availability before quoting, so you are never charged for a repair that cannot be finished.',
      "Before the visit: note the model number and roughly when the set was bought. For LCDs over ten years old, the model number decides everything, because it tells us immediately whether inverter and power boards are still obtainable. If they are not, we will say so on the phone.",
    ],
    situations: {
      caption: 'Common LCD TV situations in Delhi',
      columns: cols,
      rows: [
        ['Old LCD, picture flashes then goes dark', 'Inverter board and CCFL tubes', 'Inverter repair if parts exist'],
        ['Second-room set, slow to start', 'Ageing power-supply capacitors', 'Capacitor-level repair'],
        ['Rare model, board unavailable', 'Parts availability first', 'Honest advice not to spend'],
      ],
    },
    faqs: [
      {
        question: 'My old LCD TV flashes a picture and then goes dark. Can it be fixed?',
        answer: 'That is a classic inverter or CCFL backlight symptom on older LCDs, and it is often repairable. We confirm the inverter board is available for your model before quoting.',
      },
      {
        question: 'Are LCD TV parts still available in Delhi?',
        answer: 'For popular models, often yes — Delhi’s component markets still stock many inverter and power boards. For rare or very old models they may not exist, and we tell you that before any charge.',
      },
    ],
  },
  'lcd-tv-repair-noida': {
    heading: 'LCD TVs in Noida: usually the second TV',
    paragraphs: [
      'In Noida’s newer societies, an LCD is rarely the main screen. It is usually the older set that moved to a bedroom, a guest room or a small office in Sector 62 or 63 when the family bought a large LED. That changes the advice: a repair only makes sense if it costs well under the price of a small new TV.',
      'In the older plotted sectors near the Delhi border, LCDs are more often still in daily use, and the common faults are power-supply ageing and inverter failure. Both are affordable board-level repairs. What we do not do is recommend expensive work on a second-room LCD when a new 32-inch set would cost about the same.',
      "Before the visit: decide what the set is worth to you. For a second-room LCD we compare the estimate against a new 32-inch TV, and it helps to know your upper limit in advance. Also check that the TV’s own power switch, often on the side or underneath, is actually on.",
    ],
    situations: {
      caption: 'Common LCD TV situations in Noida',
      columns: cols,
      rows: [
        ['Bedroom LCD, no power', 'Power supply board', 'Repair if cheaper than a small new set'],
        ['Office LCD in Sector 62, no signal', 'Input ports and source device', 'Often resolved without parts'],
        ['LCD with a cracked panel', 'Physical damage', 'Replacement recommended'],
      ],
    },
    faqs: [
      {
        question: 'Is it worth repairing an old LCD TV in Noida?',
        answer: 'If the fault is the power board or inverter and the panel is intact, the repair is usually affordable. If the estimate approaches the price of a new 32-inch set, we will recommend replacing it.',
      },
      {
        question: 'Do you repair LCD monitors and displays in Noida offices?',
        answer: 'We focus on televisions, including LCD TVs used as office displays. Share the model number and whether the fault is power, picture or input related.',
      },
    ],
  },
  'lcd-tv-repair-greater-noida': {
    heading: 'LCD repair in Greater Noida: diagnose before the drive',
    paragraphs: [
      'For an older LCD set in Greater Noida, the economics are tight: a long visit to an older, lower-value TV only makes sense if the repair is likely to succeed. So we do more over the phone first. The model number tells us whether boards exist, and a description of the symptom tells us whether the fault is the kind LCDs usually recover from.',
      'LCDs are common in Knowledge Park staff housing and in older plotted-sector homes, often as a secondary set. When the answer from the phone check is that parts are unavailable or the repair would cost more than the set is worth, we say so before anyone makes the trip.',
      "Before the visit: read the model number off the back sticker and send it with a photo of the symptom. For older LCDs this phone step does most of the work: it confirms whether parts exist before anyone drives out, so a repair that cannot be completed never costs you a visit.",
    ],
    situations: {
      caption: 'Common LCD TV situations in Greater Noida',
      columns: cols,
      rows: [
        ['LCD with no display, sound working', 'Inverter or CCFL backlight', 'Repair if the board is available'],
        ['Very old model, no power', 'Parts check before the visit', 'Phone advice if parts do not exist'],
        ['Washed-out, faded colours', 'Backlight age and panel wear', 'Often not worth repairing'],
      ],
    },
    faqs: [
      {
        question: 'Can you tell me over the phone if my LCD TV is worth repairing?',
        answer: 'Often, yes. With the model number and a clear symptom, we can check part availability and whether the fault is usually recoverable before making the trip to Greater Noida.',
      },
      {
        question: 'Why do old LCD colours look washed out?',
        answer: 'Older CCFL backlights and panels fade with age. Unlike a failed inverter, general age-related fading is rarely worth repairing.',
      },
    ],
  },
  'lcd-tv-repair-ghaziabad': {
    heading: 'LCD TVs in Ghaziabad: many still in daily use',
    paragraphs: [
      'In the older sectors of Vaishali and Vasundhara, and in market-side homes around Sahibabad, LCD televisions are still often the main family set. They get daily use, so the faults we see are the ones that come with long running hours: tired power-supply capacitors, inverter boards and, eventually, backlight wear.',
      'Capacitor and inverter faults are among the cheapest TV repairs there are, so an LCD with a clear fault of that kind is usually worth fixing. Many of these homes are builder floors without lifts. Since most LCD repairs are board-level work done on site, the set rarely needs to be carried down the stairs.',
      "Before the visit: unplug the set for a full minute, then try it again and count the clicks if it clicks. A single click followed by nothing, versus repeated clicking, points to different stages of the power supply and helps the technician bring the right capacitors.",
    ],
    situations: {
      caption: 'Common LCD TV situations in Ghaziabad',
      columns: cols,
      rows: [
        ['Main family LCD, clicks but will not start', 'Power-supply capacitors', 'Low-cost on-site repair'],
        ['Picture flickers after warming up', 'Inverter board', 'Inverter repair'],
        ['Builder floor, no lift', 'Whether repair can stay on site', 'On-site board work'],
      ],
    },
    faqs: [
      {
        question: 'My LCD TV clicks but does not turn on. What is wrong?',
        answer: 'Repeated clicking without start-up usually points to ageing capacitors in the power supply — one of the cheapest TV repairs, and normally done on site.',
      },
      {
        question: 'Do LCD repairs in Ghaziabad need the TV taken away?',
        answer: 'Rarely. Most LCD faults are board-level and are repaired at your home, which matters in builder floors without a lift.',
      },
    ],
  },

  // --------------------------------------------------------------- Plasma
  'plasma-tv-repair-delhi': {
    heading: 'Plasma TVs in Delhi: heavy, hot and worth an honest check',
    paragraphs: [
      'Plasma televisions stopped being made years ago, but Delhi still has many in service, often large 42- to 50-inch sets in older homes that were premium purchases in their day. They are heavy — far heavier than an LED of the same size — and they run hot. Delhi summers put extra thermal stress on sustain and power boards.',
      'The deciding factor is parts. Sustain and power boards for popular plasma models can still sometimes be sourced in Delhi’s component markets; for others they cannot. We check before quoting. And because a plasma set is so heavy, in a builder floor without a lift, we repair on site whenever possible.',
      "Before the visit: check that the ventilation slots on the back and top of the plasma are clear of dust and not pressed against a wall or cabinet. In a Delhi summer, blocked vents alone can trigger heat shutdown. If clearing them fixes it, keep the set at least ten centimetres from the wall.",
    ],
    situations: {
      caption: 'Common plasma TV situations in Delhi',
      columns: cols,
      rows: [
        ['Shuts down after 20 minutes in summer', 'Heat, ventilation, sustain board', 'Board repair if parts exist'],
        ['Clicks repeatedly, no picture', 'Protection shutdown from a board fault', 'Diagnosis before any quote'],
        ['50" plasma in a no-lift builder floor', 'Whether repair can stay on site', 'On-site only; far too heavy for stairs'],
      ],
    },
    faqs: [
      {
        question: 'Why does my plasma TV shut down in the Delhi summer?',
        answer: 'Plasma sets run hot, and summer heat adds thermal stress to the sustain and power boards. Blocked vents make it worse. A set that shuts down after warming up needs a board and ventilation check.',
      },
      {
        question: 'Can plasma TV parts still be found in Delhi?',
        answer: 'For popular models, sometimes. Delhi’s component markets still carry some sustain and power boards. We confirm availability before quoting a repair.',
      },
    ],
  },
  'plasma-tv-repair-noida': {
    heading: 'Plasma TVs in Noida: mostly in the older sectors',
    paragraphs: [
      'Plasma sets in Noida are concentrated in the older plotted sectors, where homes were furnished before LED sets became standard. In the newer high-rise societies they are rare. When one does turn up there, lift access helps with the weight, which is the biggest practical problem with plasma.',
      'A plasma that clicks repeatedly and refuses to start is in protection mode — a board has detected a fault and is shutting the set down. Repeated power cycling can make things worse, so the best thing to do is unplug it and wait for a diagnosis. We then tell you plainly whether the parts exist and whether the repair is worth it for a set of that age.',
      "Before the visit: stop switching the set on and off. Note the colour of the standby light and how many times it blinks, because many plasma models report the failed board through that pattern. That single detail can confirm the fault before the back cover comes off.",
    ],
    situations: {
      caption: 'Common plasma TV situations in Noida',
      columns: cols,
      rows: [
        ['Older-sector home, plasma will not start', 'Protection mode and board fault', 'Repair only if parts are available'],
        ['Faint glow, no stable picture', 'Sustain and control boards', 'Board-level diagnosis'],
        ['Heavy set in a high-rise', 'Lift access for any move', 'On-site repair where possible'],
      ],
    },
    faqs: [
      {
        question: 'My plasma TV keeps clicking. Should I keep trying to turn it on?',
        answer: 'No. Repeated clicking is protection mode — a board has detected a fault. Unplug it and wait for diagnosis, because repeated power cycling can make the damage worse.',
      },
      {
        question: 'Is a plasma TV in Noida worth repairing?',
        answer: 'Only if parts are available and the fault is a single board. We check both before quoting, and will tell you if replacement makes more sense.',
      },
    ],
  },
  'plasma-tv-repair-greater-noida': {
    heading: 'Plasma repair in Greater Noida: parts first, then the trip',
    paragraphs: [
      'A plasma repair in Greater Noida combines the longest trip we make with the oldest TV technology we service. That is why the first step is always a parts check by model number. If the sustain or power board for your set cannot be sourced, there is no point in a long visit, and we will tell you before you pay anything.',
      'Where parts do exist, plotted-sector villas in Alpha, Beta and Gamma are well suited to on-site plasma work, with space to handle a heavy set safely. We do not transport plasma panels over long routes unless unavoidable: their weight and glass construction make them one of the riskiest sets to move.',
      "Before the visit: send the full model number from the back label. Plasma boards are identified by part codes that follow the model number exactly, and a near-match will not work. With the exact number we can confirm availability before committing to the long drive.",
    ],
    situations: {
      caption: 'Common plasma TV situations in Greater Noida',
      columns: cols,
      rows: [
        ['Plasma with no power at all', 'Model-number parts check first', 'Visit only if a board is available'],
        ['Picture with dark bands', 'Sustain and buffer boards', 'Board repair on site'],
        ['Large plasma, owner asks to take it away', 'Transport risk', 'On-site repair strongly preferred'],
      ],
    },
    faqs: [
      {
        question: 'Why do you check parts before visiting for plasma repair?',
        answer: 'Plasma boards are no longer manufactured for many models. Checking availability by model number first means you never pay for a long trip to a repair that cannot be completed.',
      },
      {
        question: 'Can a plasma TV be moved to a workshop safely?',
        answer: 'It can, but it is heavy and its glass panel is vulnerable, so we avoid long transport. On-site repair is the default in Greater Noida.',
      },
    ],
  },
  'plasma-tv-repair-ghaziabad': {
    heading: 'Plasma TVs in Ghaziabad: long-serving family sets',
    paragraphs: [
      'The plasma TVs still running in Ghaziabad are mostly in Vaishali, Vasundhara and Kaushambi homes, where a large set bought as a premium purchase years ago is still the family’s main screen. They have usually given long service, and when one fails the natural question is whether it is time to replace it.',
      'Our answer depends on the fault. A single failed power or sustain board, with parts available, is often worth repairing on a set that is otherwise working well. Multiple symptoms together — dark bands, heat shutdown and slow start — usually mean the set is at the end of its life. Kaushambi and Vaishali are a short trip from our base, so an inspection is quick to arrange.',
      "Before the visit: think about how much longer you expect to keep the set. A plasma that has served ten years may justify one more board repair, but not two. Knowing your plan helps us give advice that fits it, rather than a repair that only delays a replacement by months.",
    ],
    situations: {
      caption: 'Common plasma TV situations in Ghaziabad',
      columns: cols,
      rows: [
        ['Single fault, set otherwise fine', 'Power or sustain board', 'Repair if parts are available'],
        ['Several symptoms at once', 'Overall condition of the set', 'Replacement usually advised'],
        ['Builder floor, heavy set', 'Whether repair can stay on site', 'On-site board work'],
      ],
    },
    faqs: [
      {
        question: 'Should I repair or replace an old plasma TV?',
        answer: 'Repair makes sense for a single board fault with parts available. If the set shows several symptoms together, such as dark bands, heat shutdown and slow start, replacement is usually the better choice.',
      },
      {
        question: 'How quickly can you inspect a plasma TV in Vaishali or Kaushambi?',
        answer: 'Both are a short trip from our New Kondli base, so inspections there are usually quick to arrange, subject to the day’s bookings.',
      },
    ],
  },

  // --------------------------------------------------------------- Curved
  'curved-tv-repair-delhi': {
    heading: 'Curved TVs in Delhi: handling the panel with care',
    paragraphs: [
      'Curved televisions were a premium style for a few years, and Delhi still has plenty in use, mostly 49- to 65-inch sets. Their curved panel holds a permanent bend, and uneven pressure from a poorly fitted wall bracket or a careless lift can create lines or bright patches that look like electronic faults.',
      'That is why, in Delhi, we check the mounting before the electronics. A curved set on a flat bracket that was never designed for it is a common source of stress. If the fault turns out to be a board, the repair is like any LED set. If the stress has cracked the panel, curved panels are harder to source than flat ones, and we will be upfront about that.',
      "Before the visit: look along the edge of the screen from the side. A curved panel should follow a smooth, even arc; a visible kink or flat spot near the bracket points to mounting stress. If the set was remounted recently, note what bracket was used.",
    ],
    situations: {
      caption: 'Common curved TV situations in Delhi',
      columns: cols,
      rows: [
        ['Lines appeared after the set was re-mounted', 'Bracket fit and panel stress', 'Remount correctly, then re-test'],
        ['Dark screen, sound working', 'Backlight and power board', 'Board or backlight repair'],
        ['Cracked curved panel', 'Panel availability for the model', 'Honest replacement advice'],
      ],
    },
    faqs: [
      {
        question: 'Can a wall bracket cause lines on a curved TV?',
        answer: 'Yes. A bracket that puts uneven pressure on a curved panel can create lines or bright patches. We check the mounting first, because correcting it sometimes resolves the symptom without any repair.',
      },
      {
        question: 'Are curved TV panels still available in Delhi?',
        answer: 'Less readily than flat panels. For many models a replacement curved panel is hard to source, so we confirm availability before quoting any panel work.',
      },
    ],
  },
  'curved-tv-repair-noida': {
    heading: 'Curved TVs in Noida societies: bracket and lift planning',
    paragraphs: [
      'In Noida’s societies, curved TVs are usually wall-mounted in the living room, and many were fitted by general installers when the flat was furnished. A curved panel needs a bracket that matches its shape; a mismatched one leaves it under constant stress. We see this often enough that we inspect the mounting on every curved-TV visit.',
      'If the set has to come down, a curved panel must be lifted by two people and kept upright, never laid flat. That makes the service lift and a clear path to the door part of the plan. Most curved-TV electronic faults — power, mainboard, backlight — are repaired the same way as any LED set.',
      "Before the visit: check the bracket model if it is visible behind the set. Brackets designed for curved TVs usually say so in the model name or manual. If yours is a generic flat mount, mention it — correcting the mount may be part of the fix.",
    ],
    situations: {
      caption: 'Common curved TV situations in Noida',
      columns: cols,
      rows: [
        ['Bright patches near the bracket points', 'Mounting stress on the panel', 'Correct the mount, then diagnose'],
        ['Set restarts during use', 'Power board and mainboard', 'Board repair'],
        ['Curved set needs workshop repair', 'Two-person lift and service lift', 'Upright transport only'],
      ],
    },
    faqs: [
      {
        question: 'Why does my curved TV have bright patches near the edges?',
        answer: 'Patches near the mounting points often come from bracket pressure on the curved panel. We check the mount first, because correcting it can stop the symptom from getting worse.',
      },
      {
        question: 'Can a curved TV be carried flat to the lift?',
        answer: 'No. A curved panel should always be moved upright by two people. Laying it flat can crack the panel.',
      },
    ],
  },
  'curved-tv-repair-greater-noida': {
    heading: 'Curved TV repair in Greater Noida: repair in place',
    paragraphs: [
      'A curved panel is the hardest kind of TV to transport safely, and Greater Noida involves our longest drives. So for curved sets here, we plan to do everything on site. Power, mainboard, input and software faults do not require moving the panel at all, and backlight work can usually be done in a villa-sized room.',
      'Curved sets in Greater Noida are more often on stands than on walls, especially in the plotted sectors. That removes the bracket-stress problem but brings another: a stand knocked or leaned on can twist the panel slightly. If lines appeared after the set was bumped, mention it — it changes where we look first.',
      "Before the visit: if the set is on a stand, check that the stand sits level and that nothing leans on the panel from behind. A curved set on an uneven surface is under constant twist. Levelling the stand will not fix existing damage, but it stops the symptom from spreading.",
    ],
    situations: {
      caption: 'Common curved TV situations in Greater Noida',
      columns: cols,
      rows: [
        ['Stand-mounted set bumped, lines appeared', 'Panel twist and ribbon connections', 'Diagnosis before any part'],
        ['No power in a villa', 'Power board', 'On-site repair'],
        ['Owner asks to take the set away', 'Transport risk on a curved panel', 'On-site repair recommended'],
      ],
    },
    faqs: [
      {
        question: 'Can you repair a curved TV in Greater Noida without taking it away?',
        answer: 'In most cases, yes. Power, mainboard, input and software faults need no transport, and backlight work can usually be done on site if there is space.',
      },
      {
        question: 'Lines appeared after my curved TV stand was knocked. What does that mean?',
        answer: 'A knock can twist a curved panel slightly or loosen a panel ribbon. Mention the knock when booking; ribbon issues are repairable, while a cracked panel is a replacement conversation.',
      },
    ],
  },
  'curved-tv-repair-ghaziabad': {
    heading: 'Curved TVs in Ghaziabad: a straight repair-or-replace answer',
    paragraphs: [
      'Curved TVs in Ghaziabad are mostly in Indirapuram and Raj Nagar Extension societies, bought as a statement set a few years ago. Many are now out of warranty. Curved panels have become hard to source, so the value of a curved-TV repair depends heavily on where the fault is.',
      'The good news is that most curved-TV faults are not in the panel. A dark screen with sound, a set that will not power on, or apps that freeze are the same board and backlight faults any LED set gets, and they are repaired the same way. If the curved panel itself is damaged, we will tell you plainly that a flat replacement TV is usually the better buy.',
      "Before the visit: decide in advance what you would do if the panel is the problem. Curved panels are hard to source and a flat replacement TV is often better value. If you already know you would replace rather than repair a panel, tell us, and we can focus on confirming whether the fault is electronic.",
    ],
    situations: {
      caption: 'Common curved TV situations in Ghaziabad',
      columns: cols,
      rows: [
        ['Out-of-warranty set, dark screen', 'Backlight and power board', 'Standard LED-style repair'],
        ['Frozen smart apps', 'Firmware and mainboard', 'Software recovery first'],
        ['Damaged curved panel', 'Panel availability', 'Flat replacement TV usually advised'],
      ],
    },
    faqs: [
      {
        question: 'Is it worth repairing an out-of-warranty curved TV?',
        answer: 'If the fault is a board, backlight or software issue, usually yes — those repairs work like any LED set. If the curved panel is damaged, a new flat TV is typically better value.',
      },
      {
        question: 'Do curved TVs have different faults from flat TVs?',
        answer: 'Their electronics are much the same. The difference is the panel, which is sensitive to mounting pressure and harder to replace.',
      },
    ],
  },

  // ------------------------------------------------- Generic TV repair city
  'tv-repair-delhi': {
    heading: 'Which Delhi TV repair do you actually need?',
    paragraphs: [
      'Delhi households own every kind of television we repair, often in the same building. The page you need depends on the type: most sets bought in the last decade are LED; premium sets are OLED or QLED; older second-room sets are often LCD; and a few long-serving plasma and curved sets are still in use. The table below maps the most common Delhi symptoms to what usually causes them.',
      'If you are not sure what type you own, the model number on the back sticker answers it. Share it when you book, along with the area: East Delhi visits from our New Kondli base are the quickest to schedule, and South, West and North Delhi visits are booked into a time window.',
      "Before booking: check whether other appliances on the same circuit also misbehaved when the TV failed. If a fridge or router restarted at the same moment, a supply event is the likely trigger, and the power board is where the diagnosis starts.",
    ],
    situations: {
      caption: 'Common TV symptoms in Delhi and their usual causes',
      columns: ['Symptom', 'Usual cause', 'Typical outcome'],
      rows: [
        ['Dead after power returned from a cut', 'Power supply board', 'Affordable board repair'],
        ['Sound but no picture', 'Backlight (LED) or inverter (LCD)', 'Repairable if the panel is intact'],
        ['Lines across the screen', 'T-Con, ribbon or panel', 'Depends on whether the panel is damaged'],
      ],
    },
    faqs: [
      {
        question: 'How do I know what type of TV I have?',
        answer: 'Check the model number on the sticker at the back. Share it when booking and we will identify the panel type and match likely parts before the visit.',
      },
      {
        question: 'Which parts of Delhi can you reach fastest?',
        answer: 'East Delhi — New Kondli, Mayur Vihar, Laxmi Nagar and Preet Vihar — is closest to our base. Cross-city areas such as South Delhi, Dwarka and Rohini are booked into a time window.',
      },
    ],
  },
  'tv-repair-noida': {
    heading: 'TV repair in Noida: matching the fault to the right fix',
    paragraphs: [
      'Noida households lean towards large LED, QLED and OLED sets, typically wall-mounted in high-rise flats. That makes two questions central to any Noida repair: is the fault in the electronics or the panel, and can it be fixed without taking the set off the wall? Most faults are electronic, and most electronic faults are fixed in place.',
      'The table below covers the symptoms we see most in Noida. The older sectors near the Delhi border are a short drive from our New Kondli base; for the Expressway sectors and Noida Extension, sharing the model number in advance helps the technician bring the right part.',
      "Before booking: pre-register the visit in your society’s app if it has one, and tell us the tower and flat number. Many failed Noida visits are not repair problems at all — they are gate problems, and a registered entry avoids them.",
    ],
    situations: {
      caption: 'Common TV symptoms in Noida and their usual causes',
      columns: ['Symptom', 'Usual cause', 'Typical outcome'],
      rows: [
        ['Failed during a generator changeover', 'Power supply board', 'Board repair, usually on site'],
        ['Patchy brightness on a large set', 'Backlight or local-dimming zones', 'Repair, sometimes after dismounting'],
        ['Smart apps frozen, stuck on logo', 'Firmware or mainboard', 'Software recovery first'],
      ],
    },
    faqs: [
      {
        question: 'Do most Noida TV repairs happen at home?',
        answer: 'Yes, most electronic faults — power, mainboard, input and software — are fixed in place. Backlight and panel work on large sets sometimes needs a workshop bench.',
      },
      {
        question: 'Which Noida sectors are quickest to reach?',
        answer: 'The older sectors near the Delhi border, such as 15, 16 and 18, are closest to our New Kondli base. The Expressway sectors and Noida Extension are longer visits and are best booked ahead.',
      },
    ],
  },
  'tv-repair-greater-noida': {
    heading: 'TV repair in Greater Noida: prepare, then one visit',
    paragraphs: [
      'Because Greater Noida is the longest drive in our service area, a good repair here starts before the visit. With the model number and a clear symptom — ideally a short video showing the standby light and the screen under a torch — most faults can be narrowed down in advance, and the right part brought along.',
      'The table below lists the symptoms that come up most in Greater Noida homes, from villas in the lettered sectors to the high-rise townships of Greater Noida West. Wherever the fault allows, repair is done on site, because moving a large panel over a long route is the riskiest part of any TV job.',
      "Before booking: record a short video showing the standby light and the screen under a phone torch, and send it with the model number. In Greater Noida this is the single most useful thing you can do, because it turns a speculative long trip into a prepared one.",
    ],
    situations: {
      caption: 'Common TV symptoms in Greater Noida and their usual causes',
      columns: ['Symptom', 'Usual cause', 'Typical outcome'],
      rows: [
        ['Dies when the inverter takes over', 'Power board stressed by unstable output', 'Board repair plus inverter check'],
        ['Faint picture under a torch', 'Backlight failure', 'Backlight repair on site'],
        ['No power, standby light off', 'Power board or supply', 'Board repair'],
      ],
    },
    faqs: [
      {
        question: 'How can I avoid a second visit for TV repair in Greater Noida?',
        answer: 'Send the model number and a short video of the symptom when booking. That usually lets the technician bring the right part and finish in one trip.',
      },
      {
        question: 'Do you repair TVs in Greater Noida West?',
        answer: 'Yes. For Greater Noida West townships, share the tower number and arrange visitor entry in advance.',
      },
    ],
  },
  'tv-repair-ghaziabad': {
    heading: 'TV repair in Ghaziabad: fix it or replace it?',
    paragraphs: [
      'Most Ghaziabad repair calls are about the family’s main TV — usually a mid-size LED in daily use, sometimes an older LCD or plasma in the established sectors of Vaishali and Vasundhara, and premium QLEDs in the Indirapuram and Raj Nagar Extension societies. For mid-size sets, the repair-or-replace decision is close, so we give a straight comparison.',
      'The table covers the symptoms we see most. Kaushambi, Vaishali and Indirapuram sit right on the Delhi border and are a short trip from our New Kondli base; Raj Nagar Extension and Crossings Republik are longer visits.',
      "Before booking: find the TV’s screen size and roughly when it was bought. For the mid-size family sets common in Ghaziabad, those two facts decide whether a repair beats a new TV, and having them ready means the comparison can be made on the first call.",
    ],
    situations: {
      caption: 'Common TV symptoms in Ghaziabad and their usual causes',
      columns: ['Symptom', 'Usual cause', 'Typical outcome'],
      rows: [
        ['Picture dimming over months', 'Backlight wear from long daily use', 'Backlight repair, usually worthwhile'],
        ['Clicks but will not start', 'Power-supply capacitors', 'Low-cost repair'],
        ['Cracked or impact-damaged screen', 'Panel damage', 'Replacement often better value'],
      ],
    },
    faqs: [
      {
        question: 'Is TV repair in Ghaziabad usually worth it?',
        answer: 'For backlight, power and board faults with an intact panel, usually yes. For a cracked panel on a mid-size set, a new TV often costs about the same as the repair.',
      },
      {
        question: 'Which Ghaziabad areas are quickest to reach?',
        answer: 'Kaushambi, Vaishali and Indirapuram, which border East Delhi near our base. Raj Nagar Extension and Crossings Republik are longer visits.',
      },
    ],
  },
};

export function getServiceCityContent(slug) {
  return serviceCityContent[slug] || null;
}
