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

    const servicePages = [
      'led-tv-repair',
      'oled-qled-repair',
      'panel-bonding',
      'smart-tv-setup',
      'cctv-repair',
      'dth-services',
      'laptop-repair',
      'mobile-repair',
    ];

    return [
      ...rootPages.map(([page, destination]) => ({
        source: `/${page}.html`,
        destination,
        permanent: true,
      })),
      ...servicePages.map((slug) => ({
        source: `/services/${slug}.html`,
        destination: `/services/${slug}`,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;
