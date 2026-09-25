import { services } from '@/data/services';
import { localServicePages } from '@/data/localServicePages';
import { brandServicePages } from '@/data/brandServicePages';
import { localityPages } from '@/data/localityPages';
import { blogArticles } from '@/data/blogArticles';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

// Google ignores <changefreq> and <priority>; it reads <lastmod>. These dates
// track the last substantive content revision for each page group, so bump the
// relevant constant whenever that group's copy actually changes.
const LAST_REVIEWED = {
  static: '2026-09-25',
  service: '2026-09-25',
  local: '2026-09-25',
  brand: '2026-09-25',
};

export default function sitemap() {
  const staticPages = Object.values(pageMetadata)
    // /landing is a conversion page with no unique organic value and no internal
    // inbound links. It is noindex, so it must not appear in the sitemap.
    .filter((page) => !page.excludeFromSitemap)
    .map((page) => ({
      url: `${siteConfig.url}${page.path}`,
      lastModified: LAST_REVIEWED.static,
      changeFrequency: page.path === '/' ? 'weekly' : 'monthly',
      priority: page.path === '/' ? 1 : 0.8,
    }));

  const servicePages = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    lastModified: LAST_REVIEWED.service,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const localPages = localServicePages.map((page) => ({
    url: `${siteConfig.url}/services/${page.slug}`,
    lastModified: LAST_REVIEWED.local,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const localityUrls = localityPages.map((page) => ({
    url: `${siteConfig.url}/services/${page.slug}`,
    lastModified: LAST_REVIEWED.local,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const brandPages = brandServicePages.map((page) => ({
    url: `${siteConfig.url}/services/${page.slug}`,
    lastModified: LAST_REVIEWED.brand,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogArticlePages = blogArticles.map((article) => ({
    url: `${siteConfig.url}/blog/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticPages, ...servicePages, ...localPages, ...localityUrls, ...brandPages, ...blogArticlePages];
}
