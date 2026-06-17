/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    const rootPages = [
      ['index', '/'],
      ['about', '/about'],
      ['services', '/services'],
      ['blog', '/blog'],
      ['contact', '/contact'],
      ['landing', '/landing'],
      ['privacy', '/privacy'],
      ['terms', '/terms'],
    ];

    const serviceHtmlRedirects = [
      ['led-tv-repair', '/services/led-tv-repair'],
      ['oled-qled-tv-repair', '/services/oled-qled-tv-repair'],
      ['lcd-tv-repair', '/services/lcd-tv-repair'],
      ['plasma-tv-repair', '/services/plasma-tv-repair'],
      ['curved-tv-repair', '/services/curved-tv-repair'],
      ['oled-qled-repair', '/services/oled-qled-tv-repair'],
      ['panel-bonding', '/services/led-tv-repair'],
      ['smart-tv-setup', '/services/led-tv-repair'],
      ['cctv-repair', '/services'],
      ['dth-services', '/services'],
      ['laptop-repair', '/services'],
      ['mobile-repair', '/services'],
    ];

    const legacyServiceRedirects = [
      ['/services/oled-qled-repair', '/services/oled-qled-tv-repair'],
      ['/services/panel-bonding', '/services/led-tv-repair'],
      ['/services/smart-tv-setup', '/services/led-tv-repair'],
      ['/services/cctv-repair', '/services'],
      ['/services/dth-services', '/services'],
      ['/services/laptop-repair', '/services'],
      ['/services/mobile-repair', '/services'],
    ];

    return [
      ...rootPages.map(([page, destination]) => ({
        source: `/${page}.html`,
        destination,
        permanent: true,
      })),
      ...serviceHtmlRedirects.map(([slug, destination]) => ({
        source: `/services/${slug}.html`,
        destination,
        permanent: true,
      })),
      ...legacyServiceRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;
