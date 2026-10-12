// The five reference pages the redesign is measured on (Phase 0 and Phase 5).
export const REFERENCE_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Service: OLED/QLED TV Repair', path: '/services/oled-qled-tv-repair' },
  { name: 'City: TV Repair in Noida', path: '/services/tv-repair-noida' },
  { name: 'Blog index', path: '/blog' },
  { name: 'Blog post: TV Repair Cost in Delhi', path: '/blog/tv-repair-cost-delhi' },
];

// Breakpoints from the brief. Heights are common device viewports.
export const VIEWPORTS = [
  { width: 360, height: 800, mobile: true },
  { width: 390, height: 844, mobile: true },
  { width: 414, height: 896, mobile: true },
  { width: 768, height: 1024, mobile: true },
  { width: 1280, height: 800, mobile: false },
  { width: 1440, height: 900, mobile: false },
];

export const slugFor = (pathname) => (pathname === '/' ? 'home' : pathname.replace(/^\//, '').replace(/\//g, '__'));
