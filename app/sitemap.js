import { repairLandingPages } from '@/data/repairLandingPages';
import { services } from '@/data/services';
import { localServicePages } from '@/data/localServicePages';
import { brandServicePages } from '@/data/brandServicePages';
import { localityPages } from '@/data/localityPages';
import { blogArticles } from '@/data/blogArticles';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';
import { getServicePageRevision, serviceContentReviewedAt } from '@/data/servicePageRevisions';
import { keyFactsReviewedAt } from '@/data/keyFacts';

// Google ignores <changefreq> and <priority>; it reads <lastmod>. These dates
// track the last substantive content revision for each page group, so bump the
// relevant constant whenever that group's copy actually changes.
// <lastmod> also drives IndexNow: after every deploy, scripts/indexnow.mjs
// submits each URL that is new or whose <lastmod> changed (deploy.yml).
const LAST_REVIEWED = {
  static: '2026-09-25',
  service: keyFactsReviewedAt,
  local: keyFactsReviewedAt,
  locality: '2026-09-25',
  brand: keyFactsReviewedAt,
};

// The later of two YYYY-MM-DD dates.
const latest = (a, b) => (a > b ? a : b);

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
    lastModified: getServicePageRevision(page.slug) ? latest(serviceContentReviewedAt, LAST_REVIEWED.local) : LAST_REVIEWED.local,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const localityUrls = localityPages.map((page) => ({
    url: `${siteConfig.url}/services/${page.slug}`,
    lastModified: page.reviewedAt || LAST_REVIEWED.locality,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const brandPages = brandServicePages.map((page) => ({
    url: `${siteConfig.url}/services/${page.slug}`,
    lastModified: getServicePageRevision(page.slug) ? latest(serviceContentReviewedAt, LAST_REVIEWED.brand) : LAST_REVIEWED.brand,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogArticlePages = blogArticles.map((article) => ({
    url: `${siteConfig.url}/blog/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const repairPages = repairLandingPages.map((page) => ({ url: `${siteConfig.url}/services/${page.slug}`, lastModified: page.reviewedAt, changeFrequency: 'monthly', priority: 0.85 }));
  return [...staticPages, ...servicePages, ...localPages, ...localityUrls, ...brandPages, ...blogArticlePages, ...repairPages];
}
