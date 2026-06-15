import { services } from '@/data/services';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export default function sitemap() {
  const now = new Date();
  const staticPages = Object.values(pageMetadata).map((page) => ({
    url: `${siteConfig.url}${page.path}`,
    lastModified: now,
    changeFrequency: page.path === '/' ? 'weekly' : 'monthly',
    priority: page.path === '/' ? 1 : 0.8,
  }));

  const servicePages = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...staticPages, ...servicePages];
}
