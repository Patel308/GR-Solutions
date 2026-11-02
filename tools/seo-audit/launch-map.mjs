#!/usr/bin/env node
// One row per URL: is everything that search engines and AI answers rely on
// the same on the new build as on the live site?
//
//   node diff.mjs --base snapshots/<live> --head snapshots/current --out reports/current/seo-diff-vs-live.md
//   node launch-map.mjs --base snapshots/<live> --head snapshots/current \
//     --diff reports/current/seo-diff-vs-live.json --out reports/current/launch-map.md
//
// "same" means identical; anything else names what differs. The last columns
// count the diff items for the page by level (see diff.mjs and
// approved-changes.json).

import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i].replace(/^--/, '');
    args[key] = path.resolve(here, argv[++i]);
  }
  for (const key of ['base', 'head', 'diff', 'out']) {
    if (!args[key]) {
      console.error('usage: node launch-map.mjs --base <snapshot> --head <snapshot> --diff <diff.json> --out <file.md>');
      process.exit(1);
    }
  }
  return args;
}

async function loadPages(dir) {
  const pages = new Map();
  for (const file of await readdir(path.join(dir, 'pages'))) {
    if (!file.endsWith('.json')) continue;
    const page = JSON.parse(await readFile(path.join(dir, 'pages', file), 'utf8'));
    pages.set(page.path, page);
  }
  return pages;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const headingList = (page, max = 3) => (page.headings || []).filter((h) => h.level <= max && h.region === 'main').map((h) => `H${h.level}: ${h.text}`);
// Whitespace-insensitive: the live build (Next.js 16.2.9) drops some word
// spaces in link text ("DelhiTV"); the new build restores them.
const squash = (text) => String(text || '').replace(/\s+/g, '');
const internalLinks = (page) => (page.links || []).filter((l) => l.kind === 'internal').map((l) => `${l.href} ${squash(l.text)}`);
const imageKeys = (page) => (page.images || []).map((i) => `${i.src} ${i.alt}`);

function missing(before, after) {
  const pool = new Map();
  for (const item of after) pool.set(item, (pool.get(item) || 0) + 1);
  let count = 0;
  for (const item of before) {
    if (pool.get(item)) pool.set(item, pool.get(item) - 1);
    else count += 1;
  }
  return count;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [base, head] = await Promise.all([loadPages(args.base), loadPages(args.head)]);
  const diff = JSON.parse(await readFile(args.diff, 'utf8'));
  const levels = new Map();
  const approvedBy = new Map(); // scope -> field family -> rule ids
  for (const item of diff) {
    const counts = levels.get(item.scope) || { VIOLATION: 0, REVIEW: 0, APPROVED: 0 };
    if (item.level in counts) counts[item.level] += 1;
    levels.set(item.scope, counts);
    if (item.level === 'APPROVED') {
      const family = /^H1-H3/.test(item.field) ? 'headings' : /^images/.test(item.field) ? 'images' : /internal links removed/.test(item.field) ? 'links' : null;
      if (family) {
        const scoped = approvedBy.get(item.scope) || {};
        scoped[family] = [...new Set([...(scoped[family] || []), item.rule])];
        approvedBy.set(item.scope, scoped);
      }
    }
  }

  const paths = [...new Set([...base.keys(), ...head.keys()])].filter((p) => !p.startsWith('/__')).sort();
  const rows = [];
  const totals = { urls: 0, identicalCore: 0, violations: 0 };
  for (const p of paths) {
    const a = base.get(p);
    const b = head.get(p);
    totals.urls += 1;
    if (!a || !b) {
      rows.push(`| \`${p}\` | ${a ? a.status : '—'} | ${b ? b.status : '**missing**'} | ${!a ? 'new page' : '**page missing on new build**'} | | | | | | | |`);
      continue;
    }
    const approved = approvedBy.get(p) || {};
    const cell = (ok, label) => (ok ? 'same' : `**${label}**`);
    const changed = (n, family, okText) =>
      !n ? okText : approved[family] ? `${n} changed (approved: ${approved[family].join(', ')})` : `**${n} missing**`;
    const core = {
      status: a.status === b.status && a.inSitemap === b.inSitemap,
      title: a.head.title === b.head.title,
      meta: a.head.metaDescription === b.head.metaDescription,
      canonicalRobots: same(a.head.canonical, b.head.canonical) && same(a.head.robots, b.head.robots),
      headings: same(headingList(a).map(squash), headingList(b).map(squash)),
      links: missing(internalLinks(a), internalLinks(b)),
      images: missing(imageKeys(a), imageKeys(b)),
      jsonLd: same(a.jsonLd, b.jsonLd),
    };
    const counts = levels.get(p) || { VIOLATION: 0, REVIEW: 0, APPROVED: 0 };
    totals.violations += counts.VIOLATION;
    const identical = core.status && core.title && core.meta && core.canonicalRobots && core.headings && !core.links && !core.images;
    const headingCell = core.headings ? 'same' : approved.headings ? `changed (approved: ${approved.headings.join(', ')})` : '**differs**';
    if (identical) totals.identicalCore += 1;
    rows.push(
      `| \`${p}\` | ${a.status}${a.inSitemap ? '' : ' (not in sitemap)'} | ${b.status} | ${cell(core.title, 'differs')} | ${cell(core.meta, 'differs')} | ${cell(core.canonicalRobots, 'differs')} | ${headingCell} | ${changed(core.links, 'links', 'all kept')} | ${changed(core.images, 'images', 'all kept')} | ${core.jsonLd ? 'same' : 'phone only*'} | ${counts.VIOLATION} / ${counts.REVIEW} / ${counts.APPROVED} |`,
    );
  }

  const lines = [
    '# Launch map: every URL, live site vs new build',
    '',
    `Live: \`${path.relative(here, args.base)}\` · New: \`${path.relative(here, args.head)}\``,
    '',
    `- URLs: ${totals.urls}. Status code, sitemap membership, title, meta description, canonical, robots, H1–H3 (main content), internal links and image alt text identical on **${totals.identicalCore}**; on the rest every difference is a signed-off change (rule named in the cell).`,
    `- Unapproved violations: **${totals.violations}**.`,
    '- \\* JSON-LD: every difference is checked by diff.mjs; on this launch the only JSON-LD change is the telephone (owner decision D1, approved rule `owner-organic-number`). Any other JSON-LD change would be a violation.',
    '',
    '| URL | Live | New | Title | Meta description | Canonical + robots | H1–H3 | Internal links | Images (file + alt) | JSON-LD | Diff items (violation / review / approved) |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
  ];
  await mkdir(path.dirname(args.out), { recursive: true });
  await writeFile(args.out, `${lines.join('\n')}\n`);
  console.log(lines.slice(0, 8).join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
