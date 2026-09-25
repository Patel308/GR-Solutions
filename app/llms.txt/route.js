import { services } from '@/data/services';
import { cities, cityTvRepairPages } from '@/data/localServicePages';
import { brands } from '@/data/brandServicePages';
import { localityPages } from '@/data/localityPages';
import { blogArticles } from '@/data/blogArticles';
import { siteConfig } from '@/data/siteConfig';

export const dynamic = 'force-static';

// /llms.txt -- a plain-text map of the site for AI crawlers and answer engines.
// Generated from the same data that builds the pages, so it cannot drift out of
// sync the way a hand-maintained file would.
export function GET() {
  const { url, name, phone, email, address, openingHours, serviceAreas } = siteConfig;

  const lines = [
    `# ${name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    '## Business',
    '',
    `- Name: ${name}`,
    `- Service: Television repair (LED, OLED, QLED, LCD, Plasma, Curved)`,
    `- Address: ${address.streetAddress}, ${address.addressLocality} ${address.postalCode}, ${address.addressCountry}`,
    `- Phone: ${phone}`,
    `- Email: ${email}`,
    `- Hours: ${openingHours.days.length === 7 ? 'Monday to Sunday' : openingHours.days.join(', ')}, ${openingHours.opens} to ${openingHours.closes} IST`,
    `- Service areas: ${serviceAreas.join(', ')}`,
    `- Diagnosis: free. A doorstep diagnosis identifies the failed component, then a firm estimate is given before any paid work begins.`,
    `- Price guide: ${url}/pricing`,
    '',
    '## Services',
    '',
    ...services.map((service) => `- [${service.title}](${url}/services/${service.slug}): ${service.shortDescription}`),
    '',
    '## Service areas',
    '',
    ...cityTvRepairPages.map((page) => `- [TV Repair in ${page.cityName}](${url}/services/${page.slug})`),
    `- [TV Repair Near Me](${url}/services/tv-repair-near-me)`,
    ...localityPages.map((page) => `- [${page.title}](${url}/services/${page.slug}): ${page.cityName}`),
    '',
    '## Brands serviced',
    '',
    `Brand pages exist for each brand in each of: ${cities.map((c) => c.name).join(', ')}.`,
    '',
    ...brands.map(
      (brand) => `- [${brand.displayName} TV Repair](${url}/services/${brand.slugSegment}-delhi): ${brand.panelTypes} panels`,
    ),
    `- [All brands](${url}/services/brands)`,
    '',
    '## Guides',
    '',
    ...blogArticles.map((article) => `- [${article.title}](${url}/blog/${article.slug}): ${article.directAnswer}`),
    '',
    '## Key facts',
    '',
    '- Repair cost is determined by which component failed, not by the TV brand.',
    '- A black screen with working sound most often indicates backlight failure, not a dead panel.',
    '- Shining a torch at the screen at a sharp angle reveals whether the panel is still alive.',
    '- Panel replacement is the most expensive TV repair and is frequently not economical.',
    '- Board, backlight, power and software faults are usually worth repairing when the panel is intact.',
    '',
    '## Contact',
    '',
    `- [Contact and booking](${url}/contact)`,
    `- [About ${name}](${url}/about)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
