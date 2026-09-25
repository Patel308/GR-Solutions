// Verifiable local facts per city, rendered on that city's local pages.
//
// Why this file exists: the service-by-city pages were ~68% identical because
// almost all of their copy came from service-level text with the city name
// swapped in. Everything here is specific to one city and cannot be produced by
// find-and-replace -- distance and route from the New Kondli base, which
// electricity distributor serves the area, the housing stock, and what those
// mean for getting a television repaired there.
//
// Keep these factual. Distances are approximate road distances from New Kondli
// and are phrased as ranges on purpose.

export const cityLocalFacts = {
  delhi: {
    heading: 'Getting a TV repaired in Delhi: the local picture',
    baseNote:
      'GR Solution works out of New Kondli in East Delhi, on the Noida border near Mayur Vihar Phase 3. That makes East Delhi the shortest trip we make. South, West and North Delhi are cross-city journeys, so those visits are booked into a time window rather than promised within the hour.',
    power:
      'Delhi’s electricity is distributed by different companies depending on the area — BSES Yamuna in East and Central Delhi, BSES Rajdhani in South and West Delhi, Tata Power-DDL in North and North-West Delhi, and NDMC in the New Delhi area. Whoever supplies your home, summer peak demand and monsoon storms are the two periods when voltage dips and spikes are most likely, and a spike is one of the classic ways a TV power board fails.',
    housing:
      'Delhi’s housing is unusually mixed: DDA flats, group housing societies in the planned sub-cities, builder floors, independent houses and older colonies can all sit within a couple of kilometres of each other. Builder floors and older buildings often have no lift, which matters when a large set has to be carried to the workshop.',
    localityTable: {
      caption: 'Delhi service areas and visit planning',
      columns: ['Area', 'Typical housing', 'Visit planning'],
      rows: [
        ['New Kondli, Kondli, Mayur Vihar', 'DDA flats, group housing societies', 'Closest to our base — shortest wait'],
        ['Laxmi Nagar, Preet Vihar', 'Builder floors, market-side homes', 'Short trip; parking is tight near the markets'],
        ['South Delhi', 'Independent houses, builder floors, older colonies', 'Cross-city; booked into a time window'],
        ['Dwarka', 'Sector-based society apartments', 'Far side of the city; plan the day ahead'],
        ['Rohini', 'Sector housing, builder floors', 'Cross-city; plan the day ahead'],
      ],
      note: 'If the building has no lift and the TV is above 50 inches, mention it when booking so two people are sent.',
    },
  },

  noida: {
    heading: 'Getting a TV repaired in Noida: the local picture',
    baseNote:
      'Noida is next door to our New Kondli base — the older sectors near the Delhi border, such as Sector 15, 16 and 18, are among the shortest trips we make. The Sector 62–63 office belt is a moderate drive, while the Expressway sectors around 128–137 and Noida Extension are the longer Noida visits.',
    power:
      'Noida’s electricity is distributed by PVVNL (Paschimanchal Vidyut Vitran Nigam Limited). Most high-rise societies here switch to diesel-generator backup during a power cut, and the changeover between mains and backup is a moment when electronics see a transient. A TV that has lost its power board once is worth putting behind a surge protector.',
    housing:
      'Noida is laid out in numbered sectors, with a mix of plotted houses in the older sectors and high-rise group housing societies across the newer ones. Society living means gate passes, visitor registration and service-lift rules, and it also means a high share of wall-mounted large-screen sets.',
    localityTable: {
      caption: 'Noida service areas and visit planning',
      columns: ['Area', 'Typical housing', 'Visit planning'],
      rows: [
        ['Sector 15, 16, 18', 'Plotted houses, older apartments, retail', 'Near the Delhi border — short trip'],
        ['Sector 62, 63', 'Offices, IT campuses, nearby societies', 'Moderate drive; office visits need a slot'],
        ['Sector 75, 76, 104', 'High-rise group housing', 'Gate pass and lift booking help'],
        ['Sector 128–137 (Expressway)', 'Newer high-rise towers', 'Longer Noida visit; book ahead'],
        ['Noida Extension', 'Large high-rise townships', 'Longest Noida visit; confirm tower and gate'],
      ],
      note: 'Share the tower number and whether the society requires a pre-approved visitor entry — it saves a wasted trip at the gate.',
    },
  },

  'greater-noida': {
    heading: 'Getting a TV repaired in Greater Noida: the local picture',
    baseNote:
      'Greater Noida is the furthest of our regular service areas — typically a 35–45 km drive from New Kondli down the Noida–Greater Noida Expressway. That distance is why we ask for a precise symptom description before setting out: the goal is to arrive with the right parts and finish in one trip.',
    power:
      'Greater Noida is unusual in the NCR because its electricity is supplied by a private distributor, NPCL (Noida Power Company Limited), rather than the state distributor that serves Noida and Ghaziabad. Villas and plotted houses here often run on inverter backup rather than society generators, and a weak or ageing inverter can deliver unstable output that stresses a TV’s power supply.',
    housing:
      'Greater Noida has a distinctive layout: plotted residential sectors named after Greek letters (Alpha, Beta, Gamma, Delta), institutional areas such as Knowledge Park, and — in Greater Noida West — large high-rise townships. Plotted houses make access easy; the high-rise townships bring the same gate and lift planning as Noida.',
    localityTable: {
      caption: 'Greater Noida service areas and visit planning',
      columns: ['Area', 'Typical housing', 'Visit planning'],
      rows: [
        ['Alpha, Beta, Gamma, Delta', 'Plotted houses and villas', 'Easy access; long drive — book ahead'],
        ['Pari Chowk', 'Commercial hub and nearby sectors', 'Central reference point for scheduling'],
        ['Knowledge Park', 'Institutions, hostels, staff housing', 'Confirm campus entry rules in advance'],
        ['Techzone', 'Offices and adjoining housing', 'Office visits need a fixed slot'],
        ['Greater Noida West', 'High-rise townships', 'Gate pass and lift booking help'],
      ],
      note: 'Because distances are long, on-site repair is preferred wherever the fault allows — it avoids transporting a large panel over a long route.',
    },
  },

  ghaziabad: {
    heading: 'Getting a TV repaired in Ghaziabad: the local picture',
    baseNote:
      'The Ghaziabad localities along the Delhi border — Kaushambi, Vaishali and Indirapuram — are only a short drive from our New Kondli base, closer in practice than much of South Delhi. Raj Nagar Extension and Crossings Republik are the longer Ghaziabad visits.',
    power:
      'Ghaziabad’s electricity is distributed by PVVNL (Paschimanchal Vidyut Vitran Nigam Limited). Like elsewhere in the NCR, storms and peak-load periods bring voltage fluctuation, and older buildings with ageing internal wiring are more exposed to it. A TV that fails at the moment power returns after a cut is a strong hint that the power board, not the screen, is the problem.',
    housing:
      'Ghaziabad mixes large high-rise societies (Indirapuram, Raj Nagar Extension, Crossings Republik) with planned sector housing in Vaishali and Vasundhara that includes independent houses, builder floors and low-rise apartment blocks. Market-side homes around Kaushambi and Sahibabad bring tight parking and narrow access.',
    localityTable: {
      caption: 'Ghaziabad service areas and visit planning',
      columns: ['Area', 'Typical housing', 'Visit planning'],
      rows: [
        ['Kaushambi', 'Apartments and commercial blocks', 'Right on the Delhi border — short trip'],
        ['Vaishali, Vasundhara', 'Sector housing, builder floors, low-rise blocks', 'Short trip; mention floor and lift'],
        ['Indirapuram', 'High-rise group housing', 'Short trip; gate pass helps'],
        ['Sahibabad', 'Residential pockets beside industrial areas', 'Share a clear landmark'],
        ['Raj Nagar Extension, Crossings Republik', 'Newer high-rise townships', 'Longer Ghaziabad visit; book ahead'],
      ],
      note: 'For builder floors without a lift, tell us the floor number when booking if the set is 50 inches or larger.',
    },
  },
};
