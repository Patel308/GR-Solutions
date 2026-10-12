#!/usr/bin/env node
// Summarises an interleaved Lighthouse A/B: one `lighthouse.mjs --runs 1`
// output folder per run, named <page-slug>-<variant>-<run> (see README).
//
//   node ab-summary.mjs --dir <runs dir> --variants live,new [--labels "Live site,New site"] --out reports/current/lighthouse-ab
//
// Lighthouse's simulated mobile LCP swings by ±0.3-0.5 s from run to run on
// the same build (it depends on whether a script happens to start running
// just before or just after the first paint), so single batches mislead.
// Alternating the builds run by run spreads machine drift evenly; this
// script then reports median, mean and range per page and build, plus every
// run's numbers (runs.json).

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REFERENCE_PAGES, slugFor } from './lib/pages.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { variants: [], labels: [], out: 'reports/current/lighthouse-ab' };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--dir') args.dir = argv[++i];
    else if (key === '--variants') args.variants = argv[++i].split(',');
    else if (key === '--labels') args.labels = argv[++i].split(',');
    else if (key === '--out') args.out = argv[++i];
  }
  if (!args.dir || !args.variants.length) {
    console.error('usage: node ab-summary.mjs --dir <runs dir> --variants a,b[,c] [--labels "A,B"] [--out dir]');
    process.exit(1);
  }
  args.out = path.resolve(here, args.out);
  return args;
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;
const seconds = (ms) => (ms / 1000).toFixed(2);

function readRuns(dir, slug, variant) {
  const pattern = new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-${variant}-(\\d+)$`);
  return readdirSync(dir)
    .map((name) => ({ name, match: name.match(pattern) }))
    .filter(({ match }) => match)
    .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))
    .map(({ name, match }) => {
      const file = path.join(dir, name, 'summary.json');
      if (!existsSync(file)) return null;
      const page = JSON.parse(readFileSync(file, 'utf8')).pages[0];
      return {
        run: Number(match[1]),
        performance: page.scores.performance,
        LCP: Math.round(page.metrics.LCP),
        FCP: Math.round(page.metrics.FCP),
        TBT: Math.round(page.metrics.TBT),
        CLS: page.metrics.CLS,
        weightKB: page.totalByteWeightKB,
        lcpElement: page.lcpElement?.snippet ?? null,
      };
    })
    .filter(Boolean);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const label = (variant, i) => args.labels[i] || variant;
  const results = REFERENCE_PAGES.map((page) => ({
    name: page.name,
    path: page.path,
    variants: Object.fromEntries(args.variants.map((v) => [v, readRuns(args.dir, slugFor(page.path), v)])),
  })).filter((page) => Object.values(page.variants).some((runs) => runs.length));

  const lines = [
    '# Interleaved mobile Lighthouse A/B',
    '',
    `Builds: ${args.variants.map((v, i) => `**${label(v, i)}** (\`${v}\`)`).join(', ')}. Runs alternate build by build, page by page.`,
    'Lighthouse default mobile settings (simulated slow 4G, 4× CPU), Google Analytics blocked.',
    '',
    `| Page | Runs | Perf, median | LCP, median | LCP, mean | LCP, range | FCP, median | TBT, median | CLS, max | Weight, median |`,
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const page of results) {
    const runs = args.variants.map((v) => page.variants[v]);
    const cell = (fn) => runs.map((r) => (r.length ? fn(r) : '–')).join(' / ');
    lines.push(
      `| ${page.name} | ${cell((r) => r.length)} | ${cell((r) => median(r.map((x) => x.performance)))} | ` +
        `${cell((r) => seconds(median(r.map((x) => x.LCP))))} s | ${cell((r) => seconds(mean(r.map((x) => x.LCP))))} s | ` +
        `${cell((r) => `${seconds(Math.min(...r.map((x) => x.LCP)))}–${seconds(Math.max(...r.map((x) => x.LCP)))}`)} s | ` +
        `${cell((r) => (median(r.map((x) => x.FCP)) / 1000).toFixed(1))} s | ${cell((r) => Math.round(median(r.map((x) => x.TBT))))} ms | ` +
        `${cell((r) => Math.max(...r.map((x) => x.CLS)).toFixed(3))} | ${cell((r) => `${Math.round(median(r.map((x) => x.weightKB)))} KB`)} |`,
    );
  }
  lines.push('', `Each cell lists the builds in this order: ${args.variants.map((v, i) => label(v, i)).join(' / ')}.`, '');
  lines.push('LCP of every run (ms):', '');
  for (const page of results) {
    lines.push(`- ${page.name}: ${args.variants.map((v, i) => `${label(v, i)} ${page.variants[v].map((x) => x.LCP).join(', ')}`).join('; ')}`);
  }

  await mkdir(args.out, { recursive: true });
  await writeFile(path.join(args.out, 'summary.md'), `${lines.join('\n')}\n`);
  await writeFile(
    path.join(args.out, 'runs.json'),
    `${JSON.stringify({ variants: args.variants.map((v, i) => ({ id: v, label: label(v, i) })), pages: results }, null, 2)}\n`,
  );
  console.log(lines.join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
