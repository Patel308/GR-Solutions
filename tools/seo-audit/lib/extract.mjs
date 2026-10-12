// Turns one HTML document into a stable, diffable SEO snapshot.
//
// Everything is read from the HTML string itself (no browser), so the same
// function works for the raw server response (what a crawler fetches first) and
// for a post-hydration DOM dump from Playwright. Comparing the two shows whether
// any content depends on client-side JavaScript.

import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';

// Elements whose start/end splits running text into separate copy blocks,
// roughly mirroring how innerText breaks paragraphs.
const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'body', 'button', 'caption', 'dd', 'details', 'dialog', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
  'hr', 'html', 'label', 'legend', 'li', 'main', 'nav', 'ol', 'option', 'p', 'pre', 'section', 'select', 'summary',
  'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'tr', 'ul',
]);

// Never treated as visible copy.
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'head', 'iframe', 'link', 'meta']);

const HEADING = /^h([1-6])$/;
const PHONE_PATTERN = /\+91[\s-]?\d{5}[\s-]?\d{5}/g;

export const norm = (value) => (value || '').replace(/\s+/g, ' ').trim();

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

/** Drop null fields so snapshots stay small and readable. */
const compact = (record) => Object.fromEntries(Object.entries(record).filter(([, value]) => value !== null));

/** Visible text of a subtree: <br> and block boundaries become spaces. */
function textOf(node) {
  let out = '';
  const visit = (current) => {
    if (current.type === 'text') {
      out += current.data;
      return;
    }
    if (!current.name || SKIP_TAGS.has(current.name)) return;
    if (current.name === 'br') {
      out += ' ';
      return;
    }
    const block = BLOCK_TAGS.has(current.name);
    if (block) out += ' ';
    for (const child of current.children || []) visit(child);
    if (block) out += ' ';
  };
  visit(node);
  return norm(out);
}

/** next/image serves /_next/image?url=%2Fimages%2Fx.webp&w=..; recover the real file. */
function originalImageSrc(src) {
  if (!src) return src;
  if (src.startsWith('/_next/image') || src.includes('/_next/image?')) {
    try {
      const parsed = new URL(src, 'http://placeholder.local');
      return parsed.searchParams.get('url') || src;
    } catch {
      return src;
    }
  }
  return src;
}

function srcsetWidths(srcset) {
  if (!srcset) return [];
  return srcset
    .split(',')
    .map((part) => part.trim().split(/\s+/)[1])
    .filter(Boolean);
}

/**
 * Resolve an href against the page and classify it. Internal links are stored
 * as path + search + hash so snapshots taken on localhost and on production
 * compare equal.
 */
function classifyHref(rawHref, pageUrl, internalOrigins) {
  const href = (rawHref || '').trim();
  if (!href) return { kind: 'empty', target: '' };
  if (/^tel:/i.test(href)) return { kind: 'tel', target: href };
  if (/^mailto:/i.test(href)) return { kind: 'mailto', target: href };
  if (/^javascript:/i.test(href)) return { kind: 'javascript', target: href };
  if (href.startsWith('#')) return { kind: 'fragment', target: href };
  let resolved;
  try {
    resolved = new URL(href, pageUrl);
  } catch {
    return { kind: 'invalid', target: href };
  }
  if (internalOrigins.includes(resolved.origin)) {
    return { kind: 'internal', target: `${resolved.pathname}${resolved.search}${resolved.hash}` };
  }
  return { kind: 'external', target: resolved.href };
}

function parseJsonLd(raw) {
  try {
    return { ok: true, data: JSON.parse(raw) };
  } catch (error) {
    return { ok: false, error: String(error), raw };
  }
}

/** Flatten JSON-LD blocks (arrays and @graph) into a list of typed nodes. */
export function flattenJsonLd(blocks) {
  const nodes = [];
  const push = (item) => {
    if (!item || typeof item !== 'object') return;
    if (Array.isArray(item)) {
      item.forEach(push);
      return;
    }
    if (Array.isArray(item['@graph'])) {
      item['@graph'].forEach(push);
      return;
    }
    nodes.push(item);
  };
  blocks.filter((block) => block.ok).forEach((block) => push(block.data));
  return nodes;
}

const typesOf = (node) => (Array.isArray(node['@type']) ? node['@type'] : [node['@type']]).filter(Boolean);

/**
 * @param {string} html
 * @param {{ pageUrl: string, internalOrigins: string[] }} options
 */
export function extractSnapshot(html, { pageUrl, internalOrigins }) {
  const $ = cheerio.load(html);

  // ---- head ---------------------------------------------------------------
  const metaByName = (name) => $(`meta[name="${name}"]`).map((_, el) => $(el).attr('content') ?? '').get();
  const head = {
    htmlLang: $('html').attr('lang') ?? null,
    title: $('head > title').length ? norm($('head > title').first().text()) : null,
    titleCount: $('title').length,
    metaDescription: metaByName('description')[0] ?? null,
    metaDescriptionCount: metaByName('description').length,
    canonical: $('link[rel="canonical"]').map((_, el) => $(el).attr('href')).get(),
    robots: metaByName('robots'),
    googlebot: metaByName('googlebot'),
    viewport: metaByName('viewport')[0] ?? null,
    themeColor: metaByName('theme-color')[0] ?? null,
    openGraph: $('meta[property^="og:"]')
      .map((_, el) => [[$(el).attr('property'), $(el).attr('content') ?? '']])
      .get(),
    twitter: $('meta[name^="twitter:"]')
      .map((_, el) => [[$(el).attr('name'), $(el).attr('content') ?? '']])
      .get(),
    alternates: $('link[rel="alternate"]')
      .map((_, el) => ({ hreflang: $(el).attr('hreflang') ?? null, href: $(el).attr('href') }))
      .get(),
    icons: $('link[rel~="icon"], link[rel="apple-touch-icon"]')
      .map((_, el) => ({ rel: $(el).attr('rel'), href: $(el).attr('href') }))
      .get(),
    imagePreloads: $('link[rel="preload"][as="image"]')
      .map((_, el) => ({
        href: $(el).attr('href') ?? null,
        imagesrcset: Boolean($(el).attr('imagesrcset')),
        fetchpriority: $(el).attr('fetchpriority') ?? null,
      }))
      .get(),
    fontPreloads: $('link[rel="preload"][as="font"]').map((_, el) => $(el).attr('href')).get(),
    stylesheets: $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get().length,
    externalScripts: $('script[src]')
      .map((_, el) => $(el).attr('src'))
      .get()
      .filter((src) => /^https?:\/\//.test(src)),
  };

  // ---- JSON-LD ------------------------------------------------------------
  const jsonLd = $('script[type="application/ld+json"]')
    .map((_, el) => parseJsonLd($(el).html() ?? ''))
    .get();

  // ---- body walk (document order) -------------------------------------------
  const headings = [];
  const links = [];
  const images = [];
  const blocks = [];
  const iframes = [];
  const backgroundImages = [];
  // Text runs: the text between any two tags (React's <!-- --> separators are
  // ignored). Runs do not depend on wrappers, classes or layout, so restyling
  // leaves them untouched and only a real copy change shows up in a diff.
  const runs = { main: [], header: [], footer: [], other: [] };

  let buffer = '';
  let bufferRegion = 'other';
  let section = null;
  let run = '';
  let runRegion = 'other';
  let firstH1End = null;

  const flush = () => {
    const text = norm(buffer);
    if (text) blocks.push({ region: bufferRegion, section, text });
    buffer = '';
  };
  const endRun = () => {
    const text = norm(run);
    if (text) runs[runRegion].push(text);
    run = '';
  };

  const visit = (node, region) => {
    if (node.type === 'text') {
      if (node.data.trim()) {
        bufferRegion = region;
        runRegion = region;
      }
      buffer += node.data;
      run += node.data;
      return;
    }
    if (!node.name) return;
    const name = node.name;
    const attribs = node.attribs || {};
    endRun();

    if (name === 'iframe') {
      iframes.push({ region, src: attribs.src ?? null, title: attribs.title ?? null, loading: attribs.loading ?? null });
      return;
    }
    if (SKIP_TAGS.has(name)) return;
    if (name === 'br') {
      buffer += ' ';
      return;
    }

    let nextRegion = region;
    if (name === 'main') nextRegion = 'main';
    else if (region === 'other' && (name === 'header' || name === 'footer')) nextRegion = name;

    if (attribs.style && attribs.style.includes('url(')) {
      for (const match of attribs.style.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
        backgroundImages.push({ region: nextRegion, section, src: match[2] });
      }
    }

    const headingMatch = HEADING.exec(name);
    if (headingMatch) {
      const level = Number(headingMatch[1]);
      const text = textOf(node);
      headings.push({ level, text, region: nextRegion });
      if (level <= 2) section = text;
    }

    if (name === 'a' && attribs.href !== undefined) {
      const { kind, target } = classifyHref(attribs.href, pageUrl, internalOrigins);
      const text = textOf(node);
      const imgAlt = $(node).find('img').first().attr('alt');
      links.push(compact({
        kind,
        href: target,
        text,
        ariaLabel: attribs['aria-label'] ?? null,
        imgAlt: text ? null : imgAlt ?? null,
        rel: attribs.rel ?? null,
        target: attribs.target ?? null,
        region: nextRegion,
        section,
      }));
    }

    if (name === 'img') {
      images.push(compact({
        src: originalImageSrc(attribs.src),
        alt: attribs.alt === undefined ? null : attribs.alt,
        width: attribs.width ?? null,
        height: attribs.height ?? null,
        loading: attribs.loading ?? null,
        fetchpriority: attribs.fetchpriority ?? null,
        decoding: attribs.decoding ?? null,
        sizes: attribs.sizes ?? null,
        srcsetWidths: srcsetWidths(attribs.srcset),
        region: nextRegion,
        section,
      }));
    }

    const block = BLOCK_TAGS.has(name);
    if (block) flush();
    for (const child of node.children || []) visit(child, nextRegion);
    endRun();
    if (block) flush();
    // Remember where the first H1 ends, so the "answer-first" check looks at
    // what follows the real H1 (not a breadcrumb item with the same text).
    if (name === 'h1' && firstH1End === null) firstH1End = blocks.length;
  };

  const body = $('body').get(0);
  if (body) visit(body, 'other');
  flush();
  endRun();

  // ---- derived checks -----------------------------------------------------
  const mainBlocks = blocks.filter((item) => item.region === 'main');
  const mainText = runs.main.join(' ');
  const wordCount = (mainText.match(/[\p{L}\p{N}][\p{L}\p{N}'’.,/&-]*/gu) || []).length;

  const blockTexts = new Set(blocks.map((item) => item.text));
  const allText = blocks.map((item) => item.text).join('\n');
  const isVisible = (value) => {
    const needle = norm(value);
    if (!needle) return 'empty';
    if (blockTexts.has(needle)) return 'exact';
    if (allText.includes(needle)) return 'substring';
    return 'missing';
  };

  const nodes = flattenJsonLd(jsonLd);

  // Every FAQPage question and answer must be visible, word for word.
  const faq = nodes
    .filter((node) => typesOf(node).includes('FAQPage'))
    .flatMap((node) => node.mainEntity || [])
    .map((question) => ({
      question: question.name,
      questionVisible: isVisible(question.name),
      answerVisible: isVisible(question.acceptedAnswer?.text),
    }));

  // Visible breadcrumb trail vs BreadcrumbList names.
  const visibleBreadcrumb = $('nav[aria-label="Breadcrumb"] li')
    .map((_, el) => norm($(el).text().replace(/\s*\/\s*$/, '')))
    .get();
  const schemaBreadcrumb = nodes
    .filter((node) => typesOf(node).includes('BreadcrumbList'))
    .map((node) => (node.itemListElement || []).map((item) => item.name));

  const h1s = headings.filter((item) => item.level === 1);
  const blocksAfterH1 =
    firstH1End === null
      ? []
      : blocks
          .slice(firstH1End)
          .filter((item) => item.region === 'main')
          .slice(0, 3)
          .map((item) => item.text);

  const articleNodes = nodes.filter((node) => typesOf(node).some((type) => /Article|BlogPosting/.test(type)));

  const visiblePhones = [...new Set((allText.match(PHONE_PATTERN) || []).map((value) => value.replace(/[\s-]/g, '')))];
  const nap = {
    telLinks: [...new Set(links.filter((item) => item.kind === 'tel').map((item) => item.href))],
    whatsappLinks: [...new Set(links.filter((item) => /wa\.me|whatsapp\.com/.test(item.href)).map((item) => item.href))],
    mailtoLinks: [...new Set(links.filter((item) => item.kind === 'mailto').map((item) => item.href))],
    visiblePhones,
    schemaTelephones: [...new Set(JSON.stringify(nodes).match(/"telephone":"([^"]+)"/g) || [])].map((value) =>
      value.replace(/^"telephone":"|"$/g, ''),
    ),
    addressMentions: (allText.match(/C-4\/102, Pocket C 3, New Kondli, Kondli/g) || []).length,
    emailMentions: (allText.match(/info@grsolution\.co\.in/g) || []).length,
  };

  const checks = {
    h1Count: h1s.length,
    headingBeforeH1: headings.findIndex((item) => item.level === 1) > 0
      ? headings.slice(0, headings.findIndex((item) => item.level === 1)).map((item) => `H${item.level}: ${item.text}`)
      : [],
    blocksAfterH1,
    faq: {
      questions: faq.length,
      notExact: faq.filter((item) => item.questionVisible !== 'exact' || item.answerVisible !== 'exact'),
    },
    breadcrumb: {
      visible: visibleBreadcrumb,
      schema: schemaBreadcrumb,
      matches: schemaBreadcrumb.every(
        (trail) => trail.length === visibleBreadcrumb.length && trail.every((name, i) => name === visibleBreadcrumb[i]),
      ),
    },
    articleHeadlineMatchesH1: articleNodes.length
      ? articleNodes.every((node) => norm(node.headline) === (h1s[0]?.text ?? null))
      : null,
    imagesMissingAlt: images.filter((item) => item.alt === undefined).map((item) => item.src),
    imagesWithoutDimensions: images.filter((item) => !item.width || !item.height).map((item) => item.src),
    jsonLdParseErrors: jsonLd.filter((block) => !block.ok).length,
  };

  return {
    head,
    headings,
    links,
    images,
    backgroundImages,
    iframes,
    jsonLd: jsonLd.map((block) => (block.ok ? block.data : { parseError: block.error, raw: block.raw })),
    jsonLdTypes: nodes.map((node) => typesOf(node).join('+')),
    nap,
    checks,
    wordCount,
    mainTextSha256: sha256(mainText),
    copy: runs,
  };
}
