#!/usr/bin/env node
// Mobile Lighthouse for the redesign's five reference pages.
//
//   node lighthouse.mjs --base http://localhost:3100 --out reports/phase-0/lighthouse [--runs 3]
//
// Uses Lighthouse's default mobile config (Moto G Power emulation, simulated
// slow 4G: 150 ms RTT / 1.6 Mbps, 4x CPU slowdown). Each page runs --runs times
// in a fresh Chrome; the median run (Lighthouse's own median-run picker) is
// reported. Google Analytics is blocked in every run so before/after numbers
// stay comparable on any network; production pages also load gtag.js after
// hydration, so field TBT will be slightly higher than these lab numbers.
//
// Writes summary.json + summary.md (committed) and the raw median reports to
// raw/ (git-ignored).

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { computeMedianRun } from 'lighthouse/core/lib/median-run.js';
import { REFERENCE_PAGES, slugFor } from './lib/pages.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));


const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const METRICS = [
  ['first-contentful-paint', 'FCP'],
  ['largest-contentful-paint', 'LCP'],
  ['total-blocking-time', 'TBT'],
  ['cumulative-layout-shift', 'CLS'],
  ['speed-index', 'SI'],
];

function parseArgs(argv) {
  const args = { base: 'http://localhost:3100', out: 'reports/current/lighthouse', runs: 3 };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--base') args.base = argv[++i].replace(/\/$/, '');
    else if (key === '--out') args.out = argv[++i];
    else if (key === '--runs') args.runs = Number(argv[++i]);
    else if (key === '--chrome') args.chrome = argv[++i];
    else if (key === '--only') args.only = argv[++i];
  }
  args.out = path.resolve(here, args.out);
  return args;
}

async function runOnce(url, chromePath) {
  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const result = await lighthouse(
      url,
      { port: chrome.port, output: ['json', 'html'], logLevel: 'error' },
      {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: CATEGORIES,
          blockedUrlPatterns: ['*googletagmanager.com*', '*google-analytics.com*'],
        },
      },
    );
    return { lhr: result.lhr, html: result.report[1] };
  } finally {
    await chrome.kill();
  }
}

const score = (lhr, id) => (lhr.categories[id]?.score == null ? null : Math.round(lhr.categories[id].score * 100));
const ms = (lhr, id) => lhr.audits[id]?.numericValue ?? null;
const median = (values) => {
  const sorted = values.filter((v) => v != null).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor((sorted.length - 1) / 2)] : null;
};

function failingAudits(lhr, category) {
  return (lhr.categories[category]?.auditRefs || [])
    .filter((ref) => ref.weight > 0 || category !== 'performance')
    .map((ref) => lhr.audits[ref.id])
    .filter((audit) => audit && audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative' && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'manual')
    .map((audit) => ({ id: audit.id, title: audit.title, score: audit.score, displayValue: audit.displayValue ?? null }));
}

function insights(lhr) {
  // Lighthouse 13 "insights" and remaining diagnostics with savings.
  return Object.values(lhr.audits)
    .filter((audit) => audit.details && (audit.metricSavings || audit.details.overallSavingsMs || audit.details.overallSavingsBytes))
    .filter((audit) => audit.score !== null && audit.score < 1)
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      displayValue: audit.displayValue ?? null,
      savingsMs: audit.details.overallSavingsMs ?? audit.metricSavings?.LCP ?? audit.metricSavings?.FCP ?? null,
      savingsBytes: audit.details.overallSavingsBytes ?? null,
    }))
    .sort((a, b) => (b.savingsMs ?? 0) - (a.savingsMs ?? 0))
    .slice(0, 12);
}

function lcpElement(lhr) {
  // Lighthouse 13 reports the LCP node inside the LCP breakdown insight;
  // older versions used a dedicated largest-contentful-paint-element audit.
  const audit = lhr.audits['lcp-breakdown-insight'] || lhr.audits['largest-contentful-paint-element'];
  const items = audit?.details?.items || [];
  const subparts = items.find((item) => item.type === 'table')?.items || [];
  for (const item of items) {
    const node = item.type === 'node' ? item : item.node || item.items?.[0]?.node;
    if (node) {
      return {
        selector: node.selector ?? null,
        snippet: node.snippet ?? null,
        label: node.nodeLabel ?? null,
        top: node.boundingRect?.top ?? null,
        height: node.boundingRect?.height ?? null,
        subparts: Object.fromEntries(subparts.map((part) => [part.subpart, Math.round(part.duration)])),
      };
    }
  }
  return null;
}

function weights(lhr) {
  const items = lhr.audits['resource-summary']?.details?.items || [];
  const byType = Object.fromEntries(items.map((item) => [item.resourceType, { requests: item.requestCount, kb: Math.round(item.transferSize / 1024) }]));
  return byType;
}

function summarise(page, runs) {
  const medianRun = computeMedianRun(runs.map((run) => run.lhr));
  const lhr = medianRun;
  return {
    name: page.name,
    path: page.path,
    finalUrl: lhr.finalDisplayedUrl,
    scores: Object.fromEntries(CATEGORIES.map((id) => [id, score(lhr, id)])),
    performanceScoreRuns: runs.map((run) => score(run.lhr, 'performance')),
    metrics: Object.fromEntries(METRICS.map(([id, label]) => [label, ms(lhr, id)])),
    metricsMedianAcrossRuns: Object.fromEntries(METRICS.map(([id, label]) => [label, median(runs.map((run) => ms(run.lhr, id)))])),
    lcpElement: lcpElement(lhr),
    resources: weights(lhr),
    totalByteWeightKB: Math.round((ms(lhr, 'total-byte-weight') ?? 0) / 1024),
    domSize: lhr.audits['dom-size']?.numericValue ?? lhr.audits['dom-size-insight']?.numericValue ?? null,
    failing: {
      accessibility: failingAudits(lhr, 'accessibility'),
      'best-practices': failingAudits(lhr, 'best-practices'),
      seo: failingAudits(lhr, 'seo'),
    },
    topInsights: insights(lhr),
    environment: {
      lighthouseVersion: lhr.lighthouseVersion,
      userAgent: lhr.environment?.hostUserAgent ?? null,
      benchmarkIndex: lhr.environment?.benchmarkIndex ?? null,
      throttling: lhr.configSettings?.throttling,
      throttlingMethod: lhr.configSettings?.throttlingMethod,
      formFactor: lhr.configSettings?.formFactor,
    },
    medianRunIndex: runs.findIndex((run) => run.lhr === medianRun),
  };
}

const fmt = {
  FCP: (v) => (v == null ? '–' : `${(v / 1000).toFixed(1)} s`),
  LCP: (v) => (v == null ? '–' : `${(v / 1000).toFixed(1)} s`),
  SI: (v) => (v == null ? '–' : `${(v / 1000).toFixed(1)} s`),
  TBT: (v) => (v == null ? '–' : `${Math.round(v)} ms`),
  CLS: (v) => (v == null ? '–' : v.toFixed(3)),
};

function toMarkdown(summaries, args) {
  const env = summaries[0]?.environment || {};
  const lines = [
    '# Mobile Lighthouse',
    '',
    `Lighthouse ${env.lighthouseVersion}, ${env.formFactor}, ${env.throttlingMethod} throttling ` +
      `(RTT ${env.throttling?.rttMs} ms, ${(env.throttling?.throughputKbps / 1000).toFixed(1)} Mbps, CPU x${env.throttling?.cpuSlowdownMultiplier}). ` +
      `${args.runs} runs per page, median run shown. Host benchmarkIndex ${Math.round(env.benchmarkIndex ?? 0)}. Google Analytics blocked.`,
    '',
    '| Page | Perf | A11y | Best Pr. | SEO | FCP | LCP | TBT | CLS | SI | Weight | Perf runs |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...summaries.map((s) =>
      `| ${s.name} (\`${s.path}\`) | ${s.scores.performance} | ${s.scores.accessibility} | ${s.scores['best-practices']} | ${s.scores.seo} | ` +
      `${fmt.FCP(s.metrics.FCP)} | ${fmt.LCP(s.metrics.LCP)} | ${fmt.TBT(s.metrics.TBT)} | ${fmt.CLS(s.metrics.CLS)} | ${fmt.SI(s.metrics.SI)} | ` +
      `${s.totalByteWeightKB} KB | ${s.performanceScoreRuns.join(' / ')} |`,
    ),
    '',
  ];
  for (const s of summaries) {
    lines.push(`## ${s.name} (\`${s.path}\`)`, '');
    if (s.lcpElement) {
      lines.push(
        `- LCP element: \`${s.lcpElement.snippet || s.lcpElement.selector}\` ("${(s.lcpElement.label || '').slice(0, 90)}"), ` +
          `top ${s.lcpElement.top}px, height ${s.lcpElement.height}px`,
        `  - LCP subparts (ms): ${Object.entries(s.lcpElement.subparts).map(([k, v]) => `${k} ${v}`).join(', ')}`,
      );
    }
    lines.push(`- Requests by type: ${Object.entries(s.resources).map(([type, v]) => `${type} ${v.requests} (${v.kb} KB)`).join(', ')}`);
    for (const [category, items] of Object.entries(s.failing)) {
      if (items.length) lines.push(`- Failing ${category}: ${items.map((item) => `${item.id}${item.displayValue ? ` (${item.displayValue})` : ''}`).join(', ')}`);
    }
    if (s.topInsights.length) {
      lines.push('- Top performance insights:');
      for (const item of s.topInsights.slice(0, 8)) {
        const savings = [item.savingsMs ? `~${Math.round(item.savingsMs)} ms` : null, item.savingsBytes ? `~${Math.round(item.savingsBytes / 1024)} KB` : null].filter(Boolean).join(', ');
        lines.push(`  - ${item.title}${item.displayValue ? ` — ${item.displayValue}` : ''}${savings ? ` (${savings})` : ''}`);
      }
    }
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const chromePath = args.chrome || process.env.CHROME_PATH || '/opt/pw-browsers/chromium';
  const pages = args.only ? REFERENCE_PAGES.filter((page) => page.path === args.only) : REFERENCE_PAGES;
  await mkdir(path.join(args.out, 'raw'), { recursive: true });

  const summaries = [];
  for (const page of pages) {
    const runs = [];
    for (let i = 0; i < args.runs; i += 1) {
      runs.push(await runOnce(`${args.base}${page.path}`, chromePath));
      process.stdout.write(`${page.path} run ${i + 1}: perf ${score(runs.at(-1).lhr, 'performance')}\n`);
    }
    const summary = summarise(page, runs);
    summaries.push(summary);
    const slug = slugFor(page.path);
    const best = runs[summary.medianRunIndex];
    await writeFile(path.join(args.out, 'raw', `${slug}.json`), JSON.stringify(best.lhr));
    await writeFile(path.join(args.out, 'raw', `${slug}.html`), best.html);
  }

  await writeFile(path.join(args.out, 'summary.json'), `${JSON.stringify({ measuredAt: new Date().toISOString(), base: args.base, runs: args.runs, pages: summaries }, null, 2)}\n`);
  await writeFile(path.join(args.out, 'summary.md'), `${toMarkdown(summaries, args)}\n`);
  console.log(`\nSaved ${path.relative(process.cwd(), path.join(args.out, 'summary.md'))}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
