import { repairPriceBands, panelPriceBands } from './pricing';

// Symptom-first guides. These answer the question people actually type -- or
// ask an AI assistant -- when a TV fails ("sound but no picture", "keeps
// restarting"), so they are written city-agnostic and open with a direct
// answer plus a symptom -> cause -> fix table, the format answer engines lift.

const rows = (...faults) => repairPriceBands.filter((row) => faults.includes(row.fault));

const BACKLIGHT = 'Backlight / LED strip replacement';
const POWER = 'Power supply board repair or replacement';
const MAINBOARD = 'Mainboard / motherboard repair';
const TCON = 'T-Con board repair or replacement';
const SOFTWARE = 'Software / firmware reset on smart TVs';

export const symptomGuideArticles = [
  // -------------------------------------------------------------------------
  {
    slug: 'tv-sound-but-no-picture',
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    title: 'TV Has Sound but No Picture',
    metaTitle: 'TV Sound but No Picture? Causes, Fixes & Cost',
    metaDescription:
      'Why a TV plays sound with a black screen, the one-minute torch test that tells you the cause, and what each fix typically costs in Delhi NCR.',
    h1: 'TV Has Sound but No Picture: Causes and Fixes',
    category: 'Symptom Guide',
    image: '/images/service_tv.webp',
    primaryKeyword: 'tv sound but no picture',
    directAnswer:
      'A TV with sound but no picture usually has a failed backlight, not a dead screen. Shine a phone torch at the screen at a sharp angle: if you can faintly see the picture, the panel is working and the backlight has failed — typically ₹3,000–₹8,000 to fix on a 32”–43” set. If you see nothing, the fault is further back.',
    intro:
      'Sound with a black screen is the most common TV fault there is, and the most commonly misread. Because the screen is dark, people assume the screen has died, and a screen is the most expensive part of any television. In most cases the screen is fine. What has failed is the light behind it, or one of the boards that drives the picture. You can narrow it down yourself in about a minute, before anyone visits.',
    sections: [
      {
        heading: 'What causes sound but no picture?',
        body:
          'Sound proves the TV is powered and the mainboard is running, so the fault sits somewhere in the picture path. There are four places it can be, and they differ enormously in cost.',
        table: {
          caption: 'Causes of a TV with sound but no picture',
          columns: ['Cause', 'How common', 'What you see', 'Repair cost level'],
          rows: [
            ['Backlight failure', 'Most common', 'Faint image visible under a torch', 'Low to moderate'],
            ['Backlight driver / power board section', 'Common', 'Faint image under torch, backlight never lights', 'Low'],
            ['T-Con board', 'Less common', 'Nothing under torch; sometimes lines before failure', 'Low to moderate'],
            ['Panel failure', 'Least common', 'Nothing under torch, often after an impact', 'High'],
          ],
        },
      },
      {
        heading: 'The torch test: a one-minute diagnosis',
        list: [
          'Turn the TV on and play something with sound, ideally a bright scene or the home menu.',
          'Darken the room if you can.',
          'Hold a phone torch 5–10 cm from the screen, angled sharply, almost parallel to the glass.',
          'Look closely where the light hits. If you can faintly make out menus or moving images, the panel is alive and the backlight has failed.',
          'If you see nothing at all, try the TV’s own menu button: a menu that appears only under the torch still points to backlight.',
        ],
        closing:
          'A positive torch test is good news. It rules out the most expensive fault and points to one of the most affordable repairs.',
      },
      {
        heading: 'What does the fix cost?',
        body:
          'Delhi NCR market ranges for the two repairs that fix most sound-but-no-picture faults:',
        priceTable: { rows: rows(BACKLIGHT, TCON), caption: 'Cost of fixing sound but no picture' },
      },
      {
        heading: 'Things to check before calling anyone',
        list: [
          'Picture settings: an energy-saving or "screen off" mode can blank the picture on some smart TVs while audio continues.',
          'Input: switch to the TV’s own home screen. If that shows, the fault is the source device or HDMI cable, not the TV.',
          'Brightness and backlight settings in the picture menu, in case they were turned to zero.',
          'A full power cycle: unplug at the wall for 60 seconds, then restart.',
        ],
      },
      {
        heading: 'Is it worth repairing?',
        body:
          'If the torch test shows a picture, almost always yes. Backlight repair costs a fraction of a new set at any screen size, and the panel you keep is the most valuable part of the TV. If the torch shows nothing and the set has taken a knock, get the panel checked before assuming the worst, but also price a new TV before approving panel work.',
      },
    ],
    internalLinks: [
      { label: 'LED TV Repair', href: '/services/led-tv-repair' },
      { label: 'TV Repair Near Me', href: '/services/tv-repair-near-me' },
      { label: 'Contact GR Solution', href: '/contact' },
    ],
    faqs: [
      {
        question: 'Why does my TV have sound but no picture?',
        answer:
          'Usually because the backlight has failed. The panel is still producing an image, but there is no light behind it. Shine a torch at the screen at a sharp angle: a faint image confirms it.',
      },
      {
        question: 'Can I fix sound but no picture myself?',
        answer:
          'You can rule out settings, inputs and a stuck standby state yourself. Replacing backlight strips means separating the panel, which is easy to crack, so that part is best left to a technician.',
      },
      {
        question: 'How much does it cost to fix a TV with no picture?',
        answer:
          'In the Delhi NCR market, backlight replacement runs roughly ₹3,000–₹8,000 on 32”–43” sets and ₹5,500–₹12,000 on 44”–55” sets. A T-Con fault is often cheaper. Panel replacement is the expensive exception.',
      },
      {
        question: 'Does sound but no picture mean the screen is broken?',
        answer:
          'Rarely. A broken panel usually follows an impact and shows cracks or bleeding colour. A dark screen with normal sound is far more often a backlight or board fault.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: 'tv-not-turning-on',
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    title: 'TV Not Turning On',
    metaTitle: 'TV Not Turning On? Standby Light Blinking Explained',
    metaDescription:
      'What it means when a TV will not turn on, how to read the standby light, the checks to do first, and the typical repair cost in Delhi NCR.',
    h1: 'TV Not Turning On: What the Standby Light Is Telling You',
    category: 'Symptom Guide',
    image: '/images/service_tv.webp',
    primaryKeyword: 'tv not turning on',
    directAnswer:
      'A TV that will not turn on most often has a power supply board fault, especially after a storm or power cut. Check the standby light first: no light points to power supply or socket; a steady light points to the mainboard or remote; a blinking light is the TV reporting an error. Power board repair usually costs ₹1,000–₹6,500 in Delhi NCR.',
    intro:
      'When a TV refuses to start, the standby light is the most useful clue you have. It tells you whether power is reaching the set, whether the TV thinks it is on, and — on many models — which board has failed, through a blink pattern. Before anyone opens the TV, a few minutes spent reading that light and ruling out the simple causes can save a visit.',
    sections: [
      {
        heading: 'What does the standby light mean?',
        table: {
          caption: 'Standby light behaviour and likely cause',
          columns: ['Standby light', 'Likely cause', 'First check'],
          rows: [
            ['Off completely', 'No power reaching the set, or power board failed', 'Try another wall socket and cable'],
            ['Steady, but TV will not wake', 'Remote, IR receiver, or mainboard', 'Use the button on the TV itself'],
            ['Blinking in a repeating pattern', 'TV reporting an internal error code', 'Count the blinks and note the colour'],
            ['Comes on, then goes off', 'Power board protection or mainboard fault', 'Unplug 60 seconds and retry once'],
            ['Clicks repeatedly', 'Power supply protection mode', 'Stop retrying; unplug and wait for diagnosis'],
          ],
        },
      },
      {
        heading: 'Checks to do before calling',
        list: [
          'Plug the TV directly into a wall socket you know works, bypassing any extension board or stabiliser.',
          'Unplug it for a full 60 seconds to let the power supply discharge, then try again.',
          'Press the power button on the TV itself, not the remote — it rules out a dead remote in seconds.',
          'Replace the remote batteries anyway; weak batteries are a surprisingly common cause.',
          'If the set has a physical power switch on the side or underneath, make sure it is on.',
        ],
      },
      {
        heading: 'Why TVs fail to start after a power cut',
        body:
          'Power supply boards are the part of a TV most exposed to voltage events. A spike when power returns after a cut, a surge during a storm, or unstable output from an ageing inverter can damage components on the board. That is why "it stopped working when the light came back" is one of the most common descriptions we hear, and why it usually points to an affordable board repair rather than anything more serious.',
      },
      {
        heading: 'What does the repair cost?',
        body: 'Delhi NCR market ranges for the faults that stop a TV from starting:',
        priceTable: { rows: rows(POWER, MAINBOARD), caption: 'Cost of fixing a TV that will not turn on' },
      },
      {
        heading: 'Preventing it happening again',
        body:
          'Once a TV has lost a power board to a voltage event, it is worth protecting it. A surge protector is inexpensive; a voltage stabiliser suits areas with frequent fluctuation. If your home runs on an inverter, have its output checked — a weak inverter can stress a TV every time it takes over.',
      },
    ],
    internalLinks: [
      { label: 'LED TV Repair', href: '/services/led-tv-repair' },
      { label: 'LCD TV Repair', href: '/services/lcd-tv-repair' },
      { label: 'TV Repair Near Me', href: '/services/tv-repair-near-me' },
    ],
    faqs: [
      {
        question: 'Why is my TV not turning on but the red light is on?',
        answer:
          'A steady standby light means power is reaching the TV. Try the power button on the set itself. If it still will not start, the mainboard or the power board’s main supply section is the likely fault.',
      },
      {
        question: 'What does a blinking standby light mean?',
        answer:
          'Many TVs report internal faults by blinking the standby light in a pattern. Count the blinks and note the colour before calling — on many models it identifies the failed board.',
      },
      {
        question: 'My TV stopped working after a power cut. Is it the screen?',
        answer:
          'Almost never. Voltage spikes damage the power supply board, not the screen. Power board repair is one of the more affordable TV repairs.',
      },
      {
        question: 'How much does it cost to fix a TV that will not turn on?',
        answer:
          'In Delhi NCR, a power supply board repair typically costs ₹1,000–₹3,500 on 32”–43” sets and ₹1,800–₹5,000 on 44”–55” sets. Mainboard repairs cost somewhat more.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: 'tv-screen-lines-vertical-horizontal',
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    title: 'Lines on TV Screen',
    metaTitle: 'Vertical or Horizontal Lines on TV Screen: Fixable?',
    metaDescription:
      'What vertical and horizontal lines on a TV screen mean, how to tell a board fault from panel damage, and when the repair is worth it.',
    h1: 'Vertical or Horizontal Lines on a TV Screen: What They Mean',
    category: 'Symptom Guide',
    image: '/images/service_panel.webp',
    primaryKeyword: 'lines on tv screen',
    directAnswer:
      'Lines on a TV screen come from either a board fault or panel damage. Open the TV’s own menu: if the lines also appear over the menu, the fault is inside the TV. Lines that changed or flickered, or half the screen affected, usually point to the T-Con board or a loose panel ribbon — often repairable. Lines that appeared after a knock usually mean panel damage.',
    intro:
      'Lines are a frightening symptom because they look like the screen itself is broken. Sometimes it is. Often it is not. A single thin line, a band of colour, a half-dark screen and a grid of lines can each come from different parts of the TV, and the difference between a board repair and a panel replacement is the difference between an affordable fix and buying a new set.',
    sections: [
      {
        heading: 'What causes lines on a TV screen?',
        table: {
          caption: 'Line patterns and their usual causes',
          columns: ['What you see', 'Usual cause', 'Usually repairable?'],
          rows: [
            ['Lines on one input only', 'Cable or source device', 'Yes — often no TV repair needed'],
            ['Lines that flicker or change with warm-up', 'T-Con board or panel ribbon connection', 'Usually'],
            ['Half the screen dark or doubled', 'T-Con board', 'Usually'],
            ['One fixed, sharp coloured line', 'Panel driver (COF) or panel', 'Sometimes'],
            ['Lines after an impact or pressure', 'Physical panel damage', 'Rarely worth it'],
            ['Lines plus cracks or colour bleed', 'Cracked panel', 'No — panel replacement'],
          ],
        },
      },
      {
        heading: 'The menu test',
        body:
          'Press the Menu or Settings button on the remote. If the lines run across the TV’s own menu as well as the picture, the fault is inside the TV. If the menu is clean and the lines appear only on the set-top box or one HDMI device, the problem is the cable or the source, and the TV itself is fine. Swap the HDMI cable before anything else.',
      },
      {
        heading: 'Board fault or panel damage?',
        list: [
          'Board faults tend to be dynamic: lines flicker, move, change after the TV warms up, or disappear when the frame is pressed gently near the bottom edge.',
          'Panel damage tends to be static: a fixed line that never changes, often traceable to a knock, a fall or pressure on the screen.',
          'A line that appeared after the set was moved or remounted suggests a loosened ribbon cable, which is often repairable.',
          'Colour bleeding outward from one point, like ink, is internal panel damage.',
        ],
      },
      {
        heading: 'What does the repair cost?',
        body: 'Delhi NCR market ranges for T-Con repair and, where the panel itself is damaged, panel replacement:',
        priceTable: { rows: [...rows(TCON), panelPriceBands[0]], caption: 'Cost of fixing lines on a TV screen' },
      },
      {
        heading: 'When is it worth repairing?',
        body:
          'A T-Con or ribbon fault is almost always worth repairing. A panel fault is worth repairing only when the panel costs well under the price of a comparable new TV — typically on large, recent, premium sets. On mid-range sets more than five years old, panel damage usually means replacement.',
      },
    ],
    internalLinks: [
      { label: 'LED TV Repair', href: '/services/led-tv-repair' },
      { label: 'OLED/QLED TV Repair', href: '/services/oled-qled-tv-repair' },
      { label: 'Curved TV Repair', href: '/services/curved-tv-repair' },
    ],
    faqs: [
      {
        question: 'Can vertical lines on a TV screen be fixed?',
        answer:
          'Often, yes. Lines caused by the T-Con board or a loose panel ribbon are repairable. Lines caused by physical panel damage need a panel replacement, which is often not economical.',
      },
      {
        question: 'Why did lines appear on my TV suddenly?',
        answer:
          'Sudden lines without any impact usually point to a failing T-Con board or panel driver. Lines that appeared after the set was moved suggest a loosened ribbon cable.',
      },
      {
        question: 'Are horizontal lines worse than vertical lines?',
        answer:
          'Not necessarily. Direction depends on how the panel is driven. What matters more is whether the lines change over time, which points to a board, or stay fixed, which points to the panel.',
      },
      {
        question: 'Will lines on my TV get worse?',
        answer:
          'Board-related lines often spread or multiply as the component degrades. Getting it diagnosed early can keep it a board repair rather than a larger job.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: 'tv-backlight-failure-symptoms',
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    title: 'TV Backlight Failure Symptoms',
    metaTitle: 'TV Backlight Failure: Symptoms, Test & Repair Cost',
    metaDescription:
      'The signs of a failing TV backlight, how to confirm it with a torch, backlight repair costs by screen size in Delhi NCR, and how long repairs last.',
    h1: 'TV Backlight Failure: Symptoms, Test and Repair Cost',
    category: 'Symptom Guide',
    image: '/images/service_tv.webp',
    primaryKeyword: 'tv backlight repair',
    directAnswer:
      'The main signs of TV backlight failure are a black screen with working sound, a picture that dims over months, dark patches or uneven brightness, and a screen that lights briefly then goes dark. Confirm it with a torch held at a sharp angle to the screen. Backlight repair in Delhi NCR typically costs ₹3,000–₹8,000 on 32”–43” sets.',
    intro:
      'Every LED, QLED and LCD television makes its picture by shining light through a panel. The panel creates the image; the backlight makes it visible. Backlights wear out with running hours, and when they fail the TV looks dead even though the most valuable part of it, the panel, is perfectly healthy. That makes backlight failure one of the most worthwhile repairs in television.',
    sections: [
      {
        heading: 'What are the symptoms of backlight failure?',
        table: {
          caption: 'Backlight failure symptoms',
          columns: ['Symptom', 'What is happening'],
          rows: [
            ['Sound works, screen black', 'Backlight completely off; panel still working'],
            ['Picture dims gradually over months', 'LEDs losing brightness with running hours'],
            ['Dark patches or bands', 'One strip or LED group has failed'],
            ['Screen lights for a second then goes dark', 'Backlight protection cutting out after a failed LED'],
            ['Blue or purple tint to the whole picture', 'LEDs degrading unevenly as they age'],
            ['Flicker that changes after warm-up', 'Failing LED or backlight driver'],
          ],
        },
      },
      {
        heading: 'Edge-lit versus direct-lit backlights',
        body:
          'Slim and budget sets usually use edge-lit backlights: strips along the top or bottom edge, with a diffuser spreading light across the screen. Failures there show as darker bands near one edge. Larger and higher-end sets usually use direct-lit arrays: rows of LEDs behind the whole panel, sometimes grouped into local-dimming zones. Failures there show as dark spots or zones. The type decides how many strips need replacing and how much work is involved.',
      },
      {
        heading: 'What does backlight repair cost?',
        body: 'Delhi NCR market ranges, including strips and labour:',
        priceTable: { rows: rows(BACKLIGHT), caption: 'TV backlight repair cost by screen size' },
      },
      {
        heading: 'Should all the strips be replaced?',
        body:
          'Usually, yes. LEDs in the same set age together, and when one strip fails the others are often close behind. Replacing only the failed strip is cheaper today but often means reopening the panel months later, and every panel separation carries a small risk. A full set of strips is the more economical repair over the life of the TV.',
      },
      {
        heading: 'How to make a backlight last longer',
        list: [
          'Lower the backlight or brightness setting: running LEDs below maximum extends their life significantly.',
          'Avoid "vivid" or "dynamic" picture modes for everyday viewing; they drive the backlight hardest.',
          'Keep the ventilation clear; heat shortens LED life.',
          'Switch the TV off rather than leaving it running as background noise for hours.',
        ],
      },
    ],
    internalLinks: [
      { label: 'LED TV Repair', href: '/services/led-tv-repair' },
      { label: 'LED TV Repair in Delhi', href: '/services/led-tv-repair-delhi' },
      { label: 'LED TV Repair in Noida', href: '/services/led-tv-repair-noida' },
      { label: 'LED TV Repair in Greater Noida', href: '/services/led-tv-repair-greater-noida' },
      { label: 'LED TV Repair in Ghaziabad', href: '/services/led-tv-repair-ghaziabad' },
    ],
    faqs: [
      {
        question: 'How do I know if my TV backlight is broken?',
        answer:
          'Shine a phone torch at the screen at a sharp angle while the TV is on. If you can faintly see the picture, the panel is working and the backlight has failed.',
      },
      {
        question: 'How much does TV backlight repair cost?',
        answer:
          'In the Delhi NCR market, roughly ₹3,000–₹8,000 for 32”–43” sets, ₹5,500–₹12,000 for 44”–55” sets, and ₹8,500–₹18,000 for larger sets.',
      },
      {
        question: 'Is TV backlight repair worth it?',
        answer:
          'Usually, yes. The backlight costs a fraction of the panel, and the repair keeps the most valuable part of the TV in service.',
      },
      {
        question: 'Do OLED TVs have backlight problems?',
        answer:
          'No. OLED pixels produce their own light, so there is no backlight to fail. A dark OLED screen points to a board, power or panel fault instead.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: 'tv-keeps-restarting',
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    title: 'TV Keeps Restarting',
    metaTitle: 'TV Keeps Turning Off and On? Causes and Fixes',
    metaDescription:
      'Why a TV keeps restarting or switching itself off and on, which causes you can fix yourself, and when the power board or mainboard needs repair.',
    h1: 'TV Keeps Restarting or Turning Off and On',
    category: 'Symptom Guide',
    image: '/images/service_oled.webp',
    primaryKeyword: 'tv keeps turning off and on',
    directAnswer:
      'A TV that keeps restarting has either a software problem or a power fault. If it reaches the home screen before restarting, suspect software or a connected device — often fixed with an update or factory reset. If it restarts on the logo or before, suspect the power board or mainboard. A power board repair typically costs ₹1,000–₹6,500 in Delhi NCR.',
    intro:
      'A restarting TV is maddening, but it is also one of the more diagnosable faults, because exactly when it restarts narrows the cause. A set that loops on the manufacturer’s logo is failing in a different place from one that runs for twenty minutes and then switches itself off. Several of the common causes can be fixed without a technician at all.',
    sections: [
      {
        heading: 'When does it restart? That is the clue',
        table: {
          caption: 'Restart timing and likely cause',
          columns: ['When it restarts', 'Likely cause', 'Try first'],
          rows: [
            ['Stuck looping on the brand logo', 'Corrupted firmware or mainboard', 'Firmware recovery or factory reset'],
            ['After reaching the home screen', 'Smart TV software or a connected device', 'Disconnect all HDMI and USB devices'],
            ['After 10–30 minutes of use', 'Heat, or a power board component failing warm', 'Check ventilation'],
            ['When a bright scene appears', 'Power board unable to supply peak load', 'Lower brightness to test'],
            ['At random, sometimes turning itself on', 'HDMI-CEC control from another device', 'Disable HDMI-CEC in settings'],
          ],
        },
      },
      {
        heading: 'Fixes you can try yourself',
        list: [
          'Disconnect every HDMI and USB device, then use the TV alone for a day. A faulty set-top box or console can force restarts through HDMI-CEC.',
          'Turn off HDMI-CEC (called Anynet+, SimpLink, Bravia Sync and other names by different brands) to stop other devices controlling the TV.',
          'Check for a software update in the settings menu, and install it.',
          'Clear space: smart TVs with nearly full storage can crash and restart. Uninstall apps you do not use.',
          'As a last step before calling, perform a factory reset. It erases your settings and logins, so note them first.',
        ],
      },
      {
        heading: 'When it is a hardware fault',
        body:
          'If the TV restarts before reaching the home screen, restarts with nothing connected, or restarts after warming up, the fault is almost certainly hardware. The power supply board is the most frequent culprit, particularly when restarts are triggered by bright scenes that demand more power. Mainboard faults tend to show as logo loops that a firmware reset does not cure.',
        priceTable: { rows: rows(POWER, MAINBOARD, SOFTWARE), caption: 'Cost of fixing a TV that keeps restarting' },
      },
    ],
    internalLinks: [
      { label: 'LED TV Repair', href: '/services/led-tv-repair' },
      { label: 'OLED/QLED TV Repair', href: '/services/oled-qled-tv-repair' },
      { label: 'TV Repair Near Me', href: '/services/tv-repair-near-me' },
    ],
    faqs: [
      {
        question: 'Why does my smart TV keep restarting?',
        answer:
          'The most common causes are corrupted software, nearly full storage, a connected device using HDMI-CEC, or a failing power board. Disconnect all devices and update the software first.',
      },
      {
        question: 'Why does my TV turn itself on and off?',
        answer:
          'Often it is another device controlling it through HDMI-CEC. Disable HDMI-CEC in the TV settings. If the problem continues with nothing connected, the power board is the likely cause.',
      },
      {
        question: 'Will a factory reset fix a TV that keeps restarting?',
        answer:
          'It fixes software-caused restarts, which are common on smart TVs. It will not fix a power board or mainboard fault.',
      },
      {
        question: 'Why does my TV turn off after 20 minutes?',
        answer:
          'A shutdown after warming up usually points to heat or a power-board component that fails when warm. Check that the vents are clear; if they are, the board needs diagnosis.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: 'tv-repair-vs-replacement-guide',
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    title: 'TV Repair vs Replacement',
    metaTitle: 'Repair or Replace Your TV? A Practical Decision Guide',
    metaDescription:
      'A practical way to decide whether to repair or replace a broken TV, using fault type, age, screen size and repair cost against a new set.',
    h1: 'Should You Repair or Replace Your TV?',
    category: 'Decision Guide',
    image: '/images/service_panel.webp',
    primaryKeyword: 'tv repair vs replacement',
    directAnswer:
      'Repair your TV if the screen is intact and the fault is the backlight, power board, mainboard, T-Con or software — these repairs usually cost a fraction of a new set. Consider replacing it if the panel is cracked, the set is over eight years old with several faults, or the repair estimate reaches about half the price of an equivalent new TV.',
    intro:
      'The repair-or-replace decision is simpler than it feels, once you separate the one question that matters most — is the panel damaged? — from everything else. The panel is the most expensive part of any television. When it is intact, almost every other fault is economical to repair. When it is damaged, the maths usually favours a new set.',
    sections: [
      {
        heading: 'The decision in five questions',
        table: {
          caption: 'Repair or replace: decision table',
          columns: ['Question', 'Points to repair', 'Points to replacement'],
          rows: [
            ['Is the screen glass intact?', 'Yes', 'No — cracked or impact-damaged'],
            ['How old is the TV?', 'Under 6 years', 'Over 8 years'],
            ['How many problems at once?', 'One clear fault', 'Several unrelated faults'],
            ['Repair cost vs an equivalent new TV?', 'Under a third', 'Half or more'],
            ['Parts available for the model?', 'Yes', 'Discontinued or hard to source'],
          ],
          note: 'Two or more answers in the right-hand column usually means replacement is the better choice.',
        },
      },
      {
        heading: 'Typical repair costs against a new TV',
        body:
          'The comparison that matters is the repair estimate against what an equivalent TV costs today, not what you paid originally. TV prices have fallen considerably, so a repair that looks reasonable against the original price can look marginal against a new set. Delhi NCR market ranges for common repairs:',
        priceTable: { rows: rows(BACKLIGHT, POWER, MAINBOARD, TCON), caption: 'Common TV repair costs in Delhi NCR' },
      },
      {
        heading: 'When repair is clearly the right answer',
        list: [
          'Backlight failure on any size of TV with an intact panel.',
          'A power board failure after a power cut or storm.',
          'Software faults: boot loops, frozen apps, restarts that a firmware reset fixes.',
          'A single failed HDMI port or audio fault.',
          'Large premium sets, where an equivalent new TV is genuinely expensive.',
        ],
      },
      {
        heading: 'When replacement usually makes more sense',
        list: [
          'A cracked or impact-damaged panel on a mid-range TV.',
          'An older set with several unrelated faults appearing together.',
          'Models whose boards are discontinued and cannot be sourced.',
          'Plasma and early LCD sets where the energy saving from a modern TV adds to the case.',
        ],
      },
      {
        heading: 'Why an honest diagnosis matters',
        body:
          'The whole decision rests on knowing which component actually failed. A black screen that is diagnosed as "panel gone" when it is really a backlight fault turns an affordable repair into an unnecessary purchase. Ask what component has failed, ask to see physical damage if a panel is blamed, and be wary of any diagnosis that always concludes the TV is repairable — or never does.',
      },
    ],
    internalLinks: [
      { label: 'TV Repair in Delhi', href: '/services/tv-repair-delhi' },
      { label: 'TV Repair in Noida', href: '/services/tv-repair-noida' },
      { label: 'TV Repair in Greater Noida', href: '/services/tv-repair-greater-noida' },
      { label: 'TV Repair in Ghaziabad', href: '/services/tv-repair-ghaziabad' },
    ],
    faqs: [
      {
        question: 'Is it worth repairing a 5-year-old TV?',
        answer:
          'Usually, if the screen is intact. Backlight, power board and software faults on a five-year-old TV are generally worth fixing. A cracked panel on the same set usually is not.',
      },
      {
        question: 'At what point is TV repair not worth it?',
        answer:
          'When the repair estimate reaches about half the price of an equivalent new TV, when the panel is cracked, or when an older set develops several faults at once.',
      },
      {
        question: 'Is it cheaper to fix a TV screen or buy a new TV?',
        answer:
          'On most mid-range TVs, buying a new TV. Panel replacement costs a large share of a new set. On large, recent premium TVs, panel replacement can still make sense.',
      },
      {
        question: 'How long does a TV last after repair?',
        answer:
          'A repaired backlight or power board can give years of further use. Longevity depends more on the age and condition of the rest of the set than on the repair itself.',
      },
    ],
  },
];
