export const siteConfig = {
  name: 'GR Solution',
  legalName: 'GR Solution',
  description:
    'Premium LED TV, OLED/QLED TV, LCD TV, Plasma TV and Curved TV repair services across Delhi, Noida, Greater Noida, Ghaziabad and NCR.',
  url: 'https://grsolution.co.in',
  phone: '+91 99902 83890',
  phoneHref: 'tel:+919990283890',
  whatsapp: '+91 99902 83890',
  whatsappHref: 'https://wa.me/919990283890',
  email: 'info@grsolution.co.in',
  emailHref: 'mailto:info@grsolution.co.in',
  formEndpoint: 'https://formsubmit.co/ajax/kamleshg9569@gmail.com',
  formNotificationEmail: 'deepeshpatelinfinix@gmail.com',
  googleBusinessProfile: 'https://share.google/dl2v9Ju9KJjnoN5K6',
  address: {
    streetAddress: 'C-4/102, Pocket C 3, New Kondli, Kondli',
    addressLocality: 'Delhi',
    postalCode: '110096',
    addressRegion: 'Delhi NCR',
    addressCountry: 'IN',
  },
  serviceAreas: ['Delhi NCR', 'Delhi', 'Noida', 'Greater Noida', 'Ghaziabad'],
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
