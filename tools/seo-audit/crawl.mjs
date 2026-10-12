#!/usr/bin/env node
// Crawl every URL in the sitemap and save one JSON snapshot per page.
//
//   node crawl.mjs --base http://127.0.0.1:3100 --out snapshots/baseline [--rendered] [--concurrency 6]
//
// Snapshots hold what the redesign must not change: title, meta description,
// canonical, robots, Open Graph/Twitter, H1-H6 in order, every link with its
// anchor text, every image with its alt, all JSON-LD, the visible copy (as
// ordered text blocks) and the main-content word count. Run it again after a
// change and compare with diff.mjs.
//
// --rendered additionally loads each page in Chromium and snapshots the DOM
// after hydration (pages-rendered/). Diffing pages/ against pages-rendered/
// shows anything that only exists once client-side JavaScript has run.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { extractSnapshot } from './lib/extract.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');

const SITE_ORIGIN = 'https://grsolution.co.in';
// Routes outside the sitemap that still carry guardrails (e.g. /landing must
// stay noindex) plus a deliberate 404.
const EXTRA_PATHS = ['/landing', '/__seo-audit-missing-page'];

function parseArgs(argv) {
  const args = { base: 'http://127.0.0.1:3100', out: 'snapshots/current', rendered: false, concurrency: 6 };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--base') args.base = argv[++i];
    else if (key === '--out') args.out = argv[++i];
    else if (key === '--rendered') args.rendered = true;
    else if (key === '--concurrency') args.concurrency = Number(argv[++i]);
    else if (key === '--chrome') args.chrome = argv[++i];
  }
  args.base = args.base.replace(/\/$/, '');
  args.out = path.resolve(here, args.out);
  return args;
}

export const pageKey = (pathname) =>
  pathname === '/' ? 'index' : pathname.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '__');

const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

async function fetchText(url, init = {}) {
  const response = await fetch(url, { redirect: 'manual', ...init });
  return { status: response.status, location: response.headers.get('location'), text: await response.text(), headers: response.headers };
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: /<loc>([^<]+)<\/loc>/.exec(block)?.[1]?.trim(),
    lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1]?.trim() ?? null,
    changefreq: /<changefreq>([^<]+)<\/changefreq>/.exec(block)?.[1]?.trim() ?? null,
    priority: /<priority>([^<]+)<\/priority>/.exec(block)?.[1]?.trim() ?? null,
  }));
}

async function pool(items, size, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

// Raw request with an explicit Host header (fetch() forbids overriding Host),
// used to test the www -> apex redirect.
function requestWithHost(base, pathname, host) {
  const target = new URL(pathname, base);
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: target.hostname, port: target.port, path: target.pathname, method: 'GET', headers: { host } },
      (res) => {
        res.resume();
        resolve({ status: res.statusCode, location: res.headers.location ?? null });
      },
    );
    req.on('error', reject);
    req.end();
  });
}

async function snapshotRedirects(base) {
  const require = createRequire(import.meta.url);
  const nextConfig = require(path.join(repoRoot, 'next.config.js'));
  const rules = await nextConfig.redirects();
  const results = [];
  for (const rule of rules) {
    if (rule.has?.some((condition) => condition.type === 'host')) {
      const host = rule.has.find((condition) => condition.type === 'host').value;
      const probe = await requestWithHost(base, '/about', host);
      results.push({ source: `${host}${rule.source}`, probedPath: '/about', destination: rule.destination, permanent: rule.permanent, ...probe });
      continue;
    }
    const { status, location } = await fetchText(`${base}${rule.source}`);
    const normalized = location ? location.replace(base, '').replace(SITE_ORIGIN, '') : null;
    results.push({ source: rule.source, destination: rule.destination, permanent: rule.permanent, status, location: normalized });
  }
  return results;
}

async function renderPages(urls, args) {
  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({
    executablePath: args.chrome || process.env.CHROME_PATH || '/opt/pw-browsers/chromium',
    args: ['--no-sandbox'],
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  // Keep the run hermetic: only the site under test is loaded.
  const baseOrigin = new URL(args.base).origin;
  await context.route('**/*', (route) =>
    new URL(route.request().url()).origin === baseOrigin ? route.continue() : route.abort(),
  );
  const rendered = await pool(urls, Math.min(args.concurrency, 4), async (item) => {
    // A fresh tab per URL: the contact-channel logic keeps state in
    // sessionStorage, which is per tab.
    const page = await context.newPage();
    try {
      await page.goto(item.fetchUrl, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(250);
      return await page.content();
    } finally {
      await page.close();
    }
  });
  await browser.close();
  return rendered;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const internalOrigins = [new URL(args.base).origin, SITE_ORIGIN, 'https://www.grsolution.co.in'];

  await rm(args.out, { recursive: true, force: true });
  await mkdir(path.join(args.out, 'pages'), { recursive: true });
  await mkdir(path.join(args.out, 'site'), { recursive: true });

  // ---- site-level files ------------------------------------------------------
  const sitemapResponse = await fetchText(`${args.base}/sitemap.xml`);
  if (sitemapResponse.status !== 200) throw new Error(`sitemap.xml returned ${sitemapResponse.status}`);
  const sitemap = parseSitemap(sitemapResponse.text);
  await writeFile(path.join(args.out, 'site', 'sitemap.json'), stableJson(sitemap));

  for (const file of ['robots.txt', 'llms.txt']) {
    const response = await fetchText(`${args.base}/${file}`);
    await writeFile(path.join(args.out, 'site', file), response.text);
  }
  await writeFile(path.join(args.out, 'site', 'redirects.json'), stableJson(await snapshotRedirects(args.base)));

  // ---- pages -----------------------------------------------------------------
  const urls = [
    ...sitemap.map((entry) => {
      const parsed = new URL(entry.loc);
      return { path: parsed.pathname, inSitemap: true, fetchUrl: `${args.base}${parsed.pathname}` };
    }),
    ...EXTRA_PATHS.map((pathname) => ({ path: pathname, inSitemap: false, fetchUrl: `${args.base}${pathname}` })),
  ];

  const summaries = await pool(urls, args.concurrency, async (item) => {
    const response = await fetchText(item.fetchUrl);
    const snapshot = extractSnapshot(response.text, { pageUrl: item.fetchUrl, internalOrigins });
    const record = {
      path: item.path,
      inSitemap: item.inSitemap,
      status: response.status,
      location: response.location,
      xRobotsTag: response.headers.get('x-robots-tag'),
      htmlBytes: Buffer.byteLength(response.text),
      ...snapshot,
    };
    await writeFile(path.join(args.out, 'pages', `${pageKey(item.path)}.json`), stableJson(record));
    return {
      path: item.path,
      inSitemap: item.inSitemap,
      status: response.status,
      title: snapshot.head.title,
      h1: snapshot.headings.filter((heading) => heading.level === 1).map((heading) => heading.text),
      wordCount: snapshot.wordCount,
      headings: snapshot.headings.length,
      internalLinks: snapshot.links.filter((link) => link.kind === 'internal').length,
      images: snapshot.images.length,
      jsonLdTypes: snapshot.jsonLdTypes,
      faqQuestions: snapshot.checks.faq.questions,
      faqNotExact: snapshot.checks.faq.notExact.length,
      breadcrumbMatches: snapshot.checks.breadcrumb.matches,
      htmlBytes: Buffer.byteLength(response.text),
    };
  });

  await writeFile(path.join(args.out, 'index.json'), stableJson(summaries));

  if (args.rendered) {
    await mkdir(path.join(args.out, 'pages-rendered'), { recursive: true });
    const pages = urls;
    const htmls = await renderPages(pages, args);
    await Promise.all(
      pages.map((item, index) => {
        const snapshot = extractSnapshot(htmls[index], { pageUrl: item.fetchUrl, internalOrigins });
        return writeFile(
          path.join(args.out, 'pages-rendered', `${pageKey(item.path)}.json`),
          stableJson({ path: item.path, inSitemap: item.inSitemap, ...snapshot }),
        );
      }),
    );
  }

  let commit = null;
  try {
    commit = execSync('git rev-parse HEAD', { cwd: repoRoot }).toString().trim();
  } catch {}
  // Volatile details live here only, so page files diff cleanly between runs.
  await writeFile(
    path.join(args.out, 'meta.json'),
    stableJson({
      crawledAt: new Date().toISOString(),
      base: args.base,
      commit,
      pages: summaries.length,
      sitemapUrls: sitemap.length,
      rendered: args.rendered,
    }),
  );

  const problems = summaries.filter((item) => item.inSitemap && item.status !== 200);
  console.log(`Crawled ${summaries.length} URLs (${sitemap.length} from sitemap) -> ${path.relative(process.cwd(), args.out)}`);
  if (problems.length) console.log('Non-200 sitemap URLs:', problems.map((item) => `${item.status} ${item.path}`).join(', '));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
