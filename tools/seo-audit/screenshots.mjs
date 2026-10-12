#!/usr/bin/env node
// Responsive audit: screenshot and measure the reference pages at every
// breakpoint from the brief (360, 390, 414, 768, 1280, 1440).
//
//   node screenshots.mjs --base http://localhost:3100 --out reports/phase-0/responsive
//
// Per page and width it records horizontal overflow (and the elements causing
// it), H1 size and line count, where the first call/WhatsApp/booking CTA sits
// relative to the fold, fixed overlays (floating buttons, sticky header), body
// text size, interactive elements smaller than 48px, and layout shift during
// load. First-viewport screenshots are committed; full-page ones (390px only)
// go to screenshots/full/ and are git-ignored.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { REFERENCE_PAGES, VIEWPORTS, slugFor } from './lib/pages.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const EXTRA_PAGES = [{ name: 'Contact', path: '/contact' }];

function parseArgs(argv) {
  const args = { base: 'http://localhost:3100', out: 'reports/current/responsive' };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--base') args.base = argv[++i].replace(/\/$/, '');
    else if (key === '--out') args.out = argv[++i];
    else if (key === '--chrome') args.chrome = argv[++i];
  }
  args.out = path.resolve(here, args.out);
  return args;
}

// Runs before any page script: collect layout shifts and LCP candidates.
const OBSERVERS = () => {
  window.__audit = { cls: 0, shifts: [], lcp: null };
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        window.__audit.cls += entry.value;
        window.__audit.shifts.push({
          value: Number(entry.value.toFixed(4)),
          sources: (entry.sources || []).map((source) => source.node?.nodeName || '?').slice(0, 3),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1);
      if (!last) return;
      const el = last.element;
      window.__audit.lcp = {
        time: Math.round(last.startTime),
        tag: el?.tagName || null,
        text: el ? (el.textContent || '').trim().slice(0, 80) : null,
        src: last.url || null,
      };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
};

// Everything measured inside the page, in CSS pixels.
const MEASURE = () => {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const visible = (el) => {
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const docRect = (el) => {
    const rect = el.getBoundingClientRect();
    return { top: Math.round(rect.top + window.scrollY), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) };
  };
  const label = (el) => (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 50);
  const clipped = (el) => {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      const overflow = getComputedStyle(node).overflowX;
      if (overflow === 'hidden' || overflow === 'auto' || overflow === 'scroll' || overflow === 'clip') return true;
    }
    return false;
  };

  const scrollWidth = document.scrollingElement.scrollWidth;
  const overflowing = [...document.querySelectorAll('body *')]
    .filter((el) => visible(el) && el.getBoundingClientRect().right > vw + 1 && !clipped(el))
    .slice(0, 6)
    .map((el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? `.${el.className.split(' ').slice(0, 3).join('.')}` : ''} (right ${Math.round(el.getBoundingClientRect().right)})`);

  const h1 = document.querySelector('main h1') || document.querySelector('h1');
  let h1Info = null;
  if (h1) {
    const style = getComputedStyle(h1);
    const rect = docRect(h1);
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    h1Info = {
      fontSize: parseFloat(style.fontSize),
      lineHeight: Math.round(lineHeight),
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      top: rect.top,
      bottom: rect.top + rect.height,
      height: rect.height,
      lines: Math.round(rect.height / lineHeight),
      shareOfViewport: Number((rect.height / vh).toFixed(2)),
    };
  }

  const paragraph = [...document.querySelectorAll('main p')].find((el) => visible(el) && (el.textContent || '').trim().length > 120);
  let bodyText = null;
  if (paragraph) {
    const style = getComputedStyle(paragraph);
    const width = paragraph.getBoundingClientRect().width;
    bodyText = {
      fontSize: parseFloat(style.fontSize),
      lineHeight: Number((parseFloat(style.lineHeight) / parseFloat(style.fontSize)).toFixed(2)),
      color: style.color,
      fontFamily: style.fontFamily,
      approxCharsPerLine: Math.round(width / (parseFloat(style.fontSize) * 0.5)),
    };
  }

  const header = document.querySelector('header');
  const headerInfo = header ? { height: Math.round(header.getBoundingClientRect().height), position: getComputedStyle(header).position } : null;

  // Conversion CTAs: call, WhatsApp, booking/contact, quote anchors.
  const ctaSelector = 'a[href^="tel:"], a[href*="wa.me"], a[href="/contact"], a[href="#quote"], a[href="#book"]';
  const ctas = [...document.querySelectorAll(ctaSelector)].filter(visible).map((el) => {
    let fixed = false;
    for (let node = el; node; node = node.parentElement) {
      if (getComputedStyle(node).position === 'fixed') {
        fixed = true;
        break;
      }
    }
    const inHeader = Boolean(el.closest('header'));
    return { href: el.getAttribute('href'), text: label(el), fixed, inHeader, inMain: Boolean(el.closest('main')), ...docRect(el) };
  });
  const firstMainCta = ctas.find((cta) => cta.inMain && !cta.fixed);

  const fixedEls = [...document.querySelectorAll('body *')]
    .filter((el) => getComputedStyle(el).position === 'fixed' && visible(el))
    .filter((el) => el.getBoundingClientRect().width < vw * 0.9 || el.getBoundingClientRect().height < vh * 0.5)
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return { what: label(el) || el.tagName.toLowerCase(), left: Math.round(rect.left), top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) };
    });

  const interactive = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"]')].filter(visible);
  const small = interactive
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const display = getComputedStyle(el).display;
      const inlineInText = display === 'inline' && el.closest('p, li') && (el.closest('p, li').textContent || '').trim().length > (el.textContent || '').trim().length + 10;
      return { text: label(el), width: Math.round(rect.width), height: Math.round(rect.height), inlineInText: Boolean(inlineInText), inHeader: Boolean(el.closest('header')), inFooter: Boolean(el.closest('footer')) };
    })
    .filter((item) => !item.inlineInText && (item.height < 48 || item.width < 48));

  return {
    viewport: { width: vw, height: vh },
    scrollWidth,
    horizontalOverflow: scrollWidth > vw,
    overflowing,
    pageHeight: document.scrollingElement.scrollHeight,
    h1: h1Info,
    bodyText,
    header: headerInfo,
    firstMainCta: firstMainCta ? { ...firstMainCta, aboveFold: firstMainCta.top + firstMainCta.height <= vh } : null,
    ctasInFirstViewport: ctas.filter((cta) => cta.fixed || cta.top < vh).map((cta) => `${cta.text || cta.href}${cta.fixed ? ' [fixed]' : cta.inHeader ? ' [header]' : ''}`),
    fixedElements: fixedEls,
    tapTargets: { interactive: interactive.length, under48: small.length, examples: small.slice(0, 8) },
    fontsLoaded: [...document.fonts].filter((font) => font.status === 'loaded').map((font) => `${font.family} ${font.weight}`),
    cls: Number(window.__audit.cls.toFixed(4)),
    shifts: window.__audit.shifts.slice(0, 5),
    lcp: window.__audit.lcp,
  };
};

function toMarkdown(results) {
  const lines = [
    '# Responsive audit',
    '',
    'CSS pixels. "CTA top" is the first call/WhatsApp/booking link inside `<main>` (fixed floating buttons and the header excluded).',
    '',
    '| Page | Width | H-scroll | H1 size / lines / height (% of screen) | H1 bottom | First CTA in main (top, above fold?) | Body text | Header | Tap targets < 48px | CLS |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const r of results) {
    const m = r.metrics;
    lines.push(
      `| ${r.path} | ${r.width} | ${m.horizontalOverflow ? `**yes** (${m.scrollWidth}px)` : 'no'} | ` +
        `${m.h1 ? `${m.h1.fontSize}px / ${m.h1.lines} / ${m.h1.height}px (${Math.round(m.h1.shareOfViewport * 100)}%)` : '–'} | ${m.h1 ? m.h1.bottom : '–'} | ` +
        `${m.firstMainCta ? `${m.firstMainCta.top} (${m.firstMainCta.aboveFold ? 'yes' : '**no**'}) "${m.firstMainCta.text}"` : '–'} | ` +
        `${m.bodyText ? `${m.bodyText.fontSize}px / ${m.bodyText.lineHeight}` : '–'} | ${m.header ? `${m.header.height}px` : '–'} | ${m.tapTargets.under48} of ${m.tapTargets.interactive} | ${m.cls} |`,
    );
  }
  lines.push('', '## Fixed overlays and overflow details', '');
  for (const r of results.filter((item) => item.width <= 414)) {
    const m = r.metrics;
    lines.push(`- \`${r.path}\` @${r.width}: fixed ${JSON.stringify(m.fixedElements)}${m.overflowing.length ? `; overflowing: ${m.overflowing.join(', ')}` : ''}`);
  }
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const pages = [...REFERENCE_PAGES, ...EXTRA_PAGES];
  await mkdir(path.join(args.out, 'screenshots', 'full'), { recursive: true });
  const browser = await chromium.launch({ executablePath: args.chrome || process.env.CHROME_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const baseOrigin = new URL(args.base).origin;
  const results = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.mobile && viewport.width < 768 ? 2 : 1,
      isMobile: viewport.mobile,
      hasTouch: viewport.mobile,
      reducedMotion: 'reduce',
    });
    await context.addInitScript(OBSERVERS);
    await context.route('**/*', (route) => (new URL(route.request().url()).origin === baseOrigin ? route.continue() : route.abort()));
    for (const page of pages) {
      const tab = await context.newPage();
      await tab.goto(`${args.base}${page.path}`, { waitUntil: 'networkidle' });
      await tab.waitForTimeout(400);
      const metrics = await tab.evaluate(MEASURE);
      const slug = slugFor(page.path);
      await tab.screenshot({ path: path.join(args.out, 'screenshots', `${slug}@${viewport.width}.jpg`), type: 'jpeg', quality: 72 });
      if (viewport.width === 390) {
        // Scroll through once so lazy-loaded images are fetched before the
        // full-page capture (otherwise they show as empty boxes).
        await tab.evaluate(async () => {
          for (let y = 0; y < document.scrollingElement.scrollHeight; y += Math.round(window.innerHeight * 0.8)) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 60));
          }
          window.scrollTo(0, 0);
        });
        await tab.waitForLoadState('networkidle');
        await tab.waitForTimeout(300);
        await tab.screenshot({ path: path.join(args.out, 'screenshots', 'full', `${slug}@390-full.jpg`), type: 'jpeg', quality: 55, fullPage: true });
      }
      results.push({ name: page.name, path: page.path, width: viewport.width, metrics });
      await tab.close();
    }
    await context.close();
  }
  await browser.close();

  await writeFile(path.join(args.out, 'responsive.json'), `${JSON.stringify(results, null, 2)}\n`);
  await writeFile(path.join(args.out, 'responsive.md'), `${toMarkdown(results)}\n`);
  console.log(`Saved ${results.length} measurements to ${path.relative(process.cwd(), args.out)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
