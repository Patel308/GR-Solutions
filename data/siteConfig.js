// The business phone: Deepanshu's +91 84498 20270 is the one number on every
// page, for every visitor (owner decision, 25 Nov 2026; replaces Kamlesh's
// number, which was the organic/NAP number from 12 Oct). It is what
// the server HTML, schema (telephone), llms.txt and the footer NAP carry, so
// search engines and AI assistants read it too.
const primaryLine = {
  phone: '+91 84498 20270',
  phoneHref: 'tel:+918449820270',
  whatsapp: '+91 84498 20270',
  whatsappHref: 'https://wa.me/918449820270',
  owner: 'Deepanshu',
};

// Per-traffic lines. The routing still runs (lib/leads/attribution.mjs,
// components/ContactChannel.jsx) and every lead and call/WhatsApp tap still
// records its channel (seo / ads) and line, but all lines now use the primary
// number. To split numbers again, give a line its own number here:
//   seo:  organic search, Google Maps, AI assistants, referrals, direct.
//   ads:  visitors from an ad click in the last 90 days, and /landing.
//   home: direct visitors on the home page.
//   seo2: search/AI/direct visitors on pricing and most /services pages.
export const contactChannels = {
  ads: primaryLine,
  seo: primaryLine,
  seo2: primaryLine,
  home: primaryLine,
};

export const siteConfig = {
  name: 'GR Solution',
  legalName: 'GR Solution',
  description:
    'Premium LED TV, OLED/QLED TV, LCD TV, Plasma TV and Curved TV repair services across Delhi, Noida, Greater Noida, Ghaziabad and NCR.',
  url: 'https://grsolution.co.in',
  ...contactChannels.seo,
  email: 'info@grsolution.co.in',
  emailHref: 'mailto:info@grsolution.co.in',
  formEndpoint: 'https://formsubmit.co/ajax/kamleshg9569@gmail.com',
  formNotificationEmail: 'deepeshpatelinfinix@gmail.com',
  googleBusinessProfile: 'https://share.google/iyXemxWlZ7gIQwDAr',
  address: {
    streetAddress: 'C-4/102, Pocket C 3, New Kondli, Kondli',
    addressLocality: 'Delhi',
    postalCode: '110096',
    addressRegion: 'Delhi NCR',
    addressCountry: 'IN',
  },
  serviceAreas: ['Delhi NCR', 'Delhi', 'Noida', 'Greater Noida', 'Ghaziabad'],
  // Cities with same-day doorstep visits (owner confirmed for Ghaziabad, 18 Nov 2026).
  // Shown in the key-facts block, the Ghaziabad locality pages and llms.txt. Add a
  // city here only when the business confirms it.
  sameDayVisitAreas: ['Ghaziabad'],
  geo: {
    latitude: 28.6244,
    longitude: 77.3185,
  },
  openingHours: {
    opens: '09:00',
    closes: '21:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  socialLinks: {
    // TODO: Replace with verified GR Solution profiles if available.
    facebook: '',
    instagram: '',
  },
  // Business details for /about and the Organization schema. Leave a field
  // empty until it is confirmed -- empty fields are simply not rendered.
  aboutDetails: {
    founderName: '',
    foundedYear: '', // four-digit year, e.g. '2010'
    technicianCount: '', // number of technicians, e.g. '4'
  },
  logo: '/images/logo.jpg',
  defaultOgImage: '/images/logo.jpg',
};

// Entity identifiers for the JSON-LD graph. Keeping the @id values stable lets
// every page reference the same Organization/LocalBusiness/WebSite nodes
// instead of re-declaring detached copies.
export const entityIds = {
  organization: `${siteConfig.url}/#organization`,
  localBusiness: `${siteConfig.url}/#localbusiness`,
  website: `${siteConfig.url}/#website`,
};

// Verified external profiles for schema `sameAs`. Only the Google Business
// Profile is confirmed today; social handles stay out until they are verified,
// because an unverified sameAs weakens entity resolution rather than helping it.
export const sameAsProfiles = [
  siteConfig.googleBusinessProfile,
  siteConfig.socialLinks.facebook,
  siteConfig.socialLinks.instagram,
].filter(Boolean);
