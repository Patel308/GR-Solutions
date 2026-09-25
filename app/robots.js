import { siteConfig } from '@/data/siteConfig';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Only /api/ is blocked. /_next/ must stay crawlable: every next/image
        // output is served from /_next/image, and Googlebot needs the CSS/JS
        // chunks under /_next/static to render pages.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
