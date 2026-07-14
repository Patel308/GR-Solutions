import { services } from '@/data/services';
import { localServicePages } from '@/data/localServicePages';
import { brandServicePages } from '@/data/brandServicePages';
import { blogArticles } from '@/data/blogArticles';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export default function sitemap() {
  const staticPages = Object.values(pageMetadata).map((page) => ({
    url: `${siteConfig.url}${page.path}`,
    changeFrequency: page.path === '/' ? 'weekly' : 'monthly',
    priority: page.path === '/' ? 1 : 0.8,
  }));

  const servicePages = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const localPages = localServicePages.map((page) => ({
    url: `${siteConfig.url}/services/${page.slug}`,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const brandPages = brandServicePages.map((page) => ({
    url: `${siteConfig.url}/services/${page.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogArticlePages = blogArticles.map((article) => ({
    url: `${siteConfig.url}/blog/${article.slug}`,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticPages, ...servicePages, ...localPages, ...brandPages, ...blogArticlePages];
}
