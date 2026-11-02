#!/usr/bin/env node
// Compare two crawl.mjs snapshots and report every SEO-relevant difference.
//
//   node diff.mjs --base snapshots/baseline --head snapshots/current [--out reports/diff.md]
//   node diff.mjs --base snapshots/baseline --head snapshots/baseline --head-pages pages-rendered
//   node diff.mjs ... --approved approved-changes.json   (default; --approved none to disable)
//
// Differences are graded:
//   VIOLATION  frozen by the redesign guardrails (titles, metas, canonicals,
//              robots, OG/Twitter, H1-H3 text and order, internal links and
//              anchors, image filenames and alt text, JSON-LD, removed copy,
//              FAQ/schema parity, sitemap, robots.txt, redirects, llms.txt)
//   REVIEW     allowed only with a written justification (new links, new
//              copy, new images, attribute changes that can affect CLS/LCP)
//   INFO       expected side effects (word count, image loading attributes)
//   APPROVED   a VIOLATION or REVIEW item matched by a signed-off rule in
//              approved-changes.json (rule id and decision are reported)
// The exit code is 1 when there is at least one VIOLATION that is not approved.

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { basePages: 'pages', headPages: 'pages' };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--base') args.base = path.resolve(here, argv[++i]);
    else if (key === '--head') args.head = path.resolve(here, argv[++i]);
    else if (key === '--out') args.out = path.resolve(here, argv[++i]);
    else if (key === '--base-pages') args.basePages = argv[++i];
    else if (key === '--head-pages') args.headPages = argv[++i];
    else if (key === '--approved') args.approved = argv[++i];
  }
  if (args.approved === undefined) args.approved = path.join(here, 'approved-changes.json');
  else if (args.approved === 'none') args.approved = null;
  else args.approved = path.resolve(here, args.approved);
  if (!args.base || !args.head) {
    console.error('usage: node diff.mjs --base <snapshot dir> --head <snapshot dir> [--out report.md]');
    process.exit(2);
  }
  return args;
}

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

/** JSON with sorted keys, so semantically equal objects compare equal. */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function counts(list) {
  const map = new Map();
  for (const item of list) map.set(item, (map.get(item) || 0) + 1);
  return map;
}

const squash = (value) => String(value).replace(/\s+/g, '');

/**
 * Multiset difference: what disappeared and what appeared, with counts.
 * Removals and additions that differ only in whitespace (for example a word
 * boundary restored by a framework fix: "DelhiTV" -> "Delhi TV") are paired up
 * and returned separately as `whitespaceOnly`, never as copy edits.
 */
function multisetDiff(baseList, headList) {
  const base = counts(baseList);
  const head = counts(headList);
  const removedRaw = [];
  const addedRaw = [];
  for (const [item, n] of base) {
    const m = head.get(item) || 0;
    if (n > m) removedRaw.push({ item, n: n - m });
  }
  for (const [item, n] of head) {
    const m = base.get(item) || 0;
    if (n > m) addedRaw.push({ item, n: n - m });
  }
  const whitespaceOnly = [];
  for (const r of removedRaw) {
    for (const a of addedRaw) {
      if (!r.n || !a.n || squash(r.item) !== squash(a.item)) continue;
      const k = Math.min(r.n, a.n);
      r.n -= k;
      a.n -= k;
      whitespaceOnly.push(`"${r.item}" -> "${a.item}"${k > 1 ? `  (x${k})` : ''}`);
    }
  }
  const format = (list) => list.filter((x) => x.n > 0).map((x) => (x.n > 1 ? `${x.item}  (x${x.n})` : x.item));
  return { removed: format(removedRaw), added: format(addedRaw), whitespaceOnly };
}

const sameSequence = (a, b) => a.length === b.length && a.every((item, i) => item === b[i]);
const sameSquashed = (a, b) => sameSequence(a.map(squash), b.map(squash));

function reportWhitespace(report, scope, field, whitespaceOnly) {
  if (whitespaceOnly.length) report.add('INFO', scope, `${field}: whitespace-only change`, whitespaceOnly);
}

/** Paths where two JSON values differ (for readable JSON-LD reports). */
function jsonPathDiff(a, b, prefix = '$', out = []) {
  if (out.length > 25) return out;
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || a === null || b === null) {
    if (canonical(a) !== canonical(b)) out.push(`${prefix}: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
    return out;
  }
  if (typeof a !== 'object') {
    if (a !== b) out.push(`${prefix}: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
    return out;
  }
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) jsonPathDiff(a[key], b[key], Array.isArray(a) ? `${prefix}[${key}]` : `${prefix}.${key}`, out);
  return out;
}

// A <script type="application/ld+json"> holds one node or an array of nodes;
// label it by the node types it contains, e.g. "[Service, BreadcrumbList]".
const typeOf = (block) => {
  if (Array.isArray(block)) return `[${block.map(typeOf).join(', ')}]`;
  const type = block && block['@type'];
  return Array.isArray(type) ? type.join('+') : type || 'unknown';
};

class Report {
  constructor() {
    this.items = [];
  }
  add(level, scope, field, detail) {
    this.items.push({ level, scope, field, detail });
  }
  count(level) {
    return this.items.filter((item) => item.level === level).length;
  }
}

function compareValue(report, scope, field, a, b, level = 'VIOLATION') {
  if (canonical(a) !== canonical(b)) report.add(level, scope, field, [`before: ${JSON.stringify(a)}`, `after:  ${JSON.stringify(b)}`]);
}

function comparePage(report, scope, a, b) {
  compareValue(report, scope, 'HTTP status', a.status, b.status);
  if (a.location || b.location) compareValue(report, scope, 'redirect location', a.location, b.location);

  // ---- head
  for (const field of ['title', 'metaDescription', 'canonical', 'robots', 'googlebot', 'openGraph', 'twitter', 'htmlLang', 'alternates']) {
    if (a.head && b.head) compareValue(report, scope, `head.${field}`, a.head[field], b.head[field]);
  }
  if (a.head && b.head) {
    compareValue(report, scope, 'head.viewport', a.head.viewport, b.head.viewport, 'REVIEW');
    compareValue(report, scope, 'head.themeColor', a.head.themeColor, b.head.themeColor, 'INFO');
    compareValue(report, scope, 'head.icons', a.head.icons, b.head.icons, 'REVIEW');
    compareValue(report, scope, 'head.externalScripts', a.head.externalScripts, b.head.externalScripts, 'REVIEW');
    compareValue(report, scope, 'head.fontPreloads', a.head.fontPreloads, b.head.fontPreloads, 'INFO');
    compareValue(report, scope, 'head.imagePreloads', a.head.imagePreloads, b.head.imagePreloads, 'INFO');
  }

  // ---- headings: H1-H3 frozen (text and order), H4-H6 informational
  const frozen = (list) => list.filter((h) => h.level <= 3).map((h) => `H${h.level}: ${h.text}`);
  const minor = (list) => list.filter((h) => h.level > 3).map((h) => `H${h.level}: ${h.text}`);
  const hA = frozen(a.headings);
  const hB = frozen(b.headings);
  if (!sameSequence(hA, hB)) {
    const { removed, added, whitespaceOnly } = multisetDiff(hA, hB);
    if (removed.length || added.length) {
      report.add('VIOLATION', scope, 'H1-H3 text changed', [...removed.map((x) => `- ${x}`), ...added.map((x) => `+ ${x}`)]);
    } else if (!sameSquashed(hA, hB)) {
      report.add('VIOLATION', scope, 'H1-H3 order changed (same text)', [`before: ${hA.join(' | ')}`, `after:  ${hB.join(' | ')}`]);
    }
    reportWhitespace(report, scope, 'H1-H3', whitespaceOnly);
  }
  const h1Count = (list) => list.filter((h) => h.level === 1).length;
  if (h1Count(b.headings) !== 1) report.add('VIOLATION', scope, 'H1 count', [`after: ${h1Count(b.headings)} (must be exactly 1)`]);
  if (!sameSequence(minor(a.headings), minor(b.headings))) {
    const { removed, added } = multisetDiff(minor(a.headings), minor(b.headings));
    report.add('INFO', scope, 'H4-H6 changed', [...removed.map((x) => `- ${x}`), ...added.map((x) => `+ ${x}`)].concat(
      removed.length || added.length ? [] : ['order only'],
    ));
  }

  // ---- links
  const internal = (list) => list.filter((l) => l.kind === 'internal').map((l) => `${l.href}  "${l.text || l.ariaLabel || l.imgAlt || ''}"`);
  const linkDiff = multisetDiff(internal(a.links), internal(b.links));
  if (linkDiff.removed.length) report.add('VIOLATION', scope, 'internal links removed or anchor changed', linkDiff.removed.map((x) => `- ${x}`));
  if (linkDiff.added.length) report.add('REVIEW', scope, 'internal links added', linkDiff.added.map((x) => `+ ${x}`));
  reportWhitespace(report, scope, 'internal link anchors', linkDiff.whitespaceOnly);
  const external = (list) => list.filter((l) => l.kind !== 'internal').map((l) => `${l.kind} ${l.href}  "${l.text || l.ariaLabel || ''}"`);
  const extDiff = multisetDiff(external(a.links), external(b.links));
  if (extDiff.removed.length || extDiff.added.length) {
    report.add('REVIEW', scope, 'tel/WhatsApp/mailto/external links changed', [...extDiff.removed.map((x) => `- ${x}`), ...extDiff.added.map((x) => `+ ${x}`)]);
  }
  reportWhitespace(report, scope, 'tel/WhatsApp/external link text', extDiff.whitespaceOnly);
  const regionMoves = multisetDiff(
    a.links.filter((l) => l.kind === 'internal').map((l) => `${l.region} ${l.href}`),
    b.links.filter((l) => l.kind === 'internal').map((l) => `${l.region} ${l.href}`),
  );
  if (!linkDiff.removed.length && !linkDiff.added.length && (regionMoves.removed.length || regionMoves.added.length)) {
    report.add('INFO', scope, 'internal links moved between header/main/footer', [...regionMoves.removed.map((x) => `- ${x}`), ...regionMoves.added.map((x) => `+ ${x}`)]);
  }

  // ---- images (filename + alt frozen)
  const imgKey = (list) => list.map((img) => `${img.src}  alt="${img.alt}"`);
  const imgDiff = multisetDiff(imgKey(a.images), imgKey(b.images));
  if (imgDiff.removed.length) report.add('VIOLATION', scope, 'images removed or alt/filename changed', imgDiff.removed.map((x) => `- ${x}`));
  if (imgDiff.added.length) report.add('REVIEW', scope, 'images added', imgDiff.added.map((x) => `+ ${x}`));
  reportWhitespace(report, scope, 'image alt', imgDiff.whitespaceOnly);
  const attrKey = (list) => list.map((img) => `${img.src} loading=${img.loading} fetchpriority=${img.fetchpriority} ${img.width}x${img.height} sizes=${img.sizes}`);
  const attrDiff = multisetDiff(attrKey(a.images), attrKey(b.images));
  if (attrDiff.removed.length || attrDiff.added.length) {
    report.add('INFO', scope, 'image loading attributes changed', [...attrDiff.removed.map((x) => `- ${x}`), ...attrDiff.added.map((x) => `+ ${x}`)]);
  }
  const missingDims = (b.checks?.imagesWithoutDimensions || []).filter((src) => !(a.checks?.imagesWithoutDimensions || []).includes(src));
  if (missingDims.length) report.add('REVIEW', scope, 'images without width/height (CLS risk)', missingDims);
  compareValue(report, scope, 'CSS background images', a.backgroundImages?.map((x) => x.src), b.backgroundImages?.map((x) => x.src), 'INFO');

  // ---- JSON-LD
  const ldA = a.jsonLd.map(canonical);
  const ldB = b.jsonLd.map(canonical);
  const ldDiff = multisetDiff(ldA, ldB);
  if (ldDiff.removed.length || ldDiff.added.length) {
    const details = [];
    const removedBlocks = a.jsonLd.filter((block) => ldDiff.removed.includes(canonical(block)));
    const addedBlocks = b.jsonLd.filter((block) => ldDiff.added.includes(canonical(block)));
    for (const block of removedBlocks) {
      const twin = addedBlocks.find((candidate) => typeOf(candidate) === typeOf(block));
      if (twin) details.push(`~ ${typeOf(block)}:`, ...jsonPathDiff(block, twin).map((line) => `    ${line}`));
      else details.push(`- ${typeOf(block)} block removed`);
    }
    for (const block of addedBlocks) {
      if (!removedBlocks.some((candidate) => typeOf(candidate) === typeOf(block))) details.push(`+ ${typeOf(block)} block added`);
    }
    report.add('VIOLATION', scope, 'JSON-LD changed', details);
  }

  // ---- copy (text runs)
  for (const region of ['main', 'header', 'footer', 'other']) {
    const runsA = a.copy?.[region] || [];
    const runsB = b.copy?.[region] || [];
    const { removed, added, whitespaceOnly } = multisetDiff(runsA, runsB);
    if (removed.length) report.add('VIOLATION', scope, `${region} copy removed or edited`, removed.map((x) => `- ${x}`));
    if (added.length) report.add('REVIEW', scope, `${region} copy added`, added.map((x) => `+ ${x}`));
    reportWhitespace(report, scope, `${region} copy`, whitespaceOnly);
    if (!removed.length && !added.length && !sameSquashed(runsA, runsB)) {
      report.add(region === 'main' ? 'REVIEW' : 'INFO', scope, `${region} copy reordered (same text)`, ['sections or blocks moved; text unchanged']);
    }
  }
  if (a.wordCount !== b.wordCount) report.add('INFO', scope, 'main word count', [`${a.wordCount} -> ${b.wordCount} (${b.wordCount - a.wordCount >= 0 ? '+' : ''}${b.wordCount - a.wordCount})`]);

  // ---- invariants
  const faqBad = (snap) => snap.checks?.faq?.notExact?.length || 0;
  if (faqBad(b) > faqBad(a)) report.add('VIOLATION', scope, 'FAQ text no longer matches FAQPage schema', b.checks.faq.notExact.map((x) => JSON.stringify(x)));
  if (a.checks?.breadcrumb?.matches && !b.checks?.breadcrumb?.matches) {
    report.add('VIOLATION', scope, 'visible breadcrumb no longer matches BreadcrumbList', [JSON.stringify(b.checks.breadcrumb)]);
  }
  if (a.checks?.articleHeadlineMatchesH1 === true && b.checks?.articleHeadlineMatchesH1 === false) {
    report.add('VIOLATION', scope, 'Article headline no longer matches H1', []);
  }
  const newMissingAlt = (b.checks?.imagesMissingAlt || []).filter((src) => !(a.checks?.imagesMissingAlt || []).includes(src));
  if (newMissingAlt.length) report.add('VIOLATION', scope, 'images without alt attribute', newMissingAlt);
  const firstA = a.checks?.blocksAfterH1?.[0];
  const firstB = b.checks?.blocksAfterH1?.[0];
  if (firstA !== firstB) {
    const whitespace = firstA !== undefined && firstB !== undefined && squash(firstA) === squash(firstB);
    report.add(whitespace ? 'INFO' : 'REVIEW', scope, whitespace ? 'first content block after H1: whitespace-only change' : 'first content block after H1 changed (answer-first summary must stay first)', [`before: ${firstA}`, `after:  ${firstB}`]);
  }

  // ---- NAP
  for (const field of ['telLinks', 'whatsappLinks', 'mailtoLinks', 'visiblePhones', 'schemaTelephones']) {
    compareValue(report, scope, `NAP ${field}`, a.nap?.[field], b.nap?.[field], field === 'schemaTelephones' ? 'VIOLATION' : 'REVIEW');
  }
  if ((b.nap?.addressMentions || 0) < (a.nap?.addressMentions || 0)) report.add('VIOLATION', scope, 'NAP address mentions dropped', [`${a.nap.addressMentions} -> ${b.nap.addressMentions}`]);
  if ((b.nap?.emailMentions || 0) < (a.nap?.emailMentions || 0)) report.add('VIOLATION', scope, 'NAP email mentions dropped', [`${a.nap.emailMentions} -> ${b.nap.emailMentions}`]);
}

async function compareSite(report, base, head) {
  const file = (dir, name) => path.join(dir, 'site', name);
  if (!existsSync(file(base, 'sitemap.json')) || !existsSync(file(head, 'sitemap.json'))) return;
  const smA = await readJson(file(base, 'sitemap.json'));
  const smB = await readJson(file(head, 'sitemap.json'));
  const urls = multisetDiff(smA.map((x) => x.loc), smB.map((x) => x.loc));
  if (urls.removed.length || urls.added.length) report.add('VIOLATION', 'site', 'sitemap URLs changed', [...urls.removed.map((x) => `- ${x}`), ...urls.added.map((x) => `+ ${x}`)]);
  const lastmod = multisetDiff(smA.map((x) => `${x.loc} ${x.lastmod}`), smB.map((x) => `${x.loc} ${x.lastmod}`));
  if (!urls.removed.length && lastmod.removed.length) report.add('REVIEW', 'site', 'sitemap lastmod changed', lastmod.added);
  for (const name of ['robots.txt', 'llms.txt']) {
    const a = await readFile(file(base, name), 'utf8');
    const b = await readFile(file(head, name), 'utf8');
    if (a !== b) {
      const { removed, added } = multisetDiff(a.split('\n'), b.split('\n'));
      report.add('VIOLATION', 'site', `${name} changed`, [...removed.map((x) => `- ${x}`), ...added.map((x) => `+ ${x}`)]);
    }
  }
  const rA = await readJson(file(base, 'redirects.json'));
  const rB = await readJson(file(head, 'redirects.json'));
  const red = multisetDiff(rA.map(canonical), rB.map(canonical));
  if (red.removed.length || red.added.length) report.add('VIOLATION', 'site', 'redirects changed', [...red.removed.map((x) => `- ${x}`), ...red.added.map((x) => `+ ${x}`)]);
}

/**
 * Moves items covered by a signed-off rule to APPROVED. A rule matches an item
 * by level, field and scope (regular expressions). With `detail` patterns, only
 * the matching detail lines are approved; any other lines of the same item keep
 * their original level, so a rule can never hide an unrelated change.
 */
function applyApprovals(report, rules) {
  const compiled = rules.map((rule) => ({
    ...rule,
    levels: rule.levels || ['VIOLATION', 'REVIEW'],
    fieldRe: new RegExp(rule.field),
    scopeRe: new RegExp(rule.scope || '.*'),
    patterns: (rule.detail || []).map((pattern) => new RegExp(pattern)),
  }));
  const next = [];
  for (const item of report.items) {
    let rest = item.detail || [];
    let handled = false;
    for (const rule of compiled) {
      if (!rule.levels.includes(item.level) || !rule.fieldRe.test(item.field) || !rule.scopeRe.test(item.scope)) continue;
      const matches = (line) => rule.patterns.some((re) => re.test(line));
      const approved = rule.patterns.length ? rest.filter(matches) : rest;
      if (rest.length && !approved.length) continue;
      next.push({ ...item, level: 'APPROVED', detail: approved, rule: rule.id, decision: rule.decision, originalLevel: item.level });
      rest = rule.patterns.length ? rest.filter((line) => !matches(line)) : [];
      handled = true;
      if (!rest.length) break;
    }
    if (!handled) next.push(item);
    else if (rest.length) next.push({ ...item, detail: rest });
  }
  report.items = next;
}

function render(report, args, pageCount) {
  const lines = [];
  const levels = ['VIOLATION', 'REVIEW', 'APPROVED', 'INFO'];
  lines.push('# SEO snapshot diff', '');
  lines.push(`- base: \`${path.relative(here, args.base)}/${args.basePages}\``);
  lines.push(`- head: \`${path.relative(here, args.head)}/${args.headPages}\``);
  lines.push(`- pages compared: ${pageCount}`);
  lines.push(`- approved-change rules: ${args.approved ? `\`${path.relative(here, args.approved)}\`` : 'none'}`, '');
  lines.push('| Level | Count |', '| --- | --- |');
  for (const level of levels) lines.push(`| ${level} | ${report.count(level)} |`);
  lines.push('');
  for (const level of levels) {
    const items = report.items.filter((item) => item.level === level);
    if (!items.length) continue;
    lines.push(`## ${level} (${items.length})`, '');
    const byScope = new Map();
    for (const item of items) {
      if (!byScope.has(item.scope)) byScope.set(item.scope, []);
      byScope.get(item.scope).push(item);
    }
    for (const [scope, scoped] of byScope) {
      lines.push(`### \`${scope}\``, '');
      for (const item of scoped) {
        lines.push(item.rule ? `- **${item.field}** (was ${item.originalLevel}; approved by \`${item.rule}\`: ${item.decision})` : `- **${item.field}**`);
        if (item.detail?.length) {
          lines.push('', '  ```diff', ...item.detail.map((line) => `  ${line}`), '  ```', '');
        }
      }
      lines.push('');
    }
  }
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = new Report();
  const dirA = path.join(args.base, args.basePages);
  const dirB = path.join(args.head, args.headPages);
  const filesA = new Set((await readdir(dirA)).filter((f) => f.endsWith('.json')));
  const filesB = new Set((await readdir(dirB)).filter((f) => f.endsWith('.json')));

  for (const file of filesA) if (!filesB.has(file)) report.add('VIOLATION', file.replace(/\.json$/, ''), 'page missing from head snapshot', []);
  for (const file of filesB) if (!filesA.has(file)) report.add('REVIEW', file.replace(/\.json$/, ''), 'new page in head snapshot', []);

  let compared = 0;
  for (const file of [...filesA].sort()) {
    if (!filesB.has(file)) continue;
    const a = await readJson(path.join(dirA, file));
    const b = await readJson(path.join(dirB, file));
    if (a.status === undefined || b.status === undefined) {
      // Rendered snapshots have no HTTP status; compare content only.
      a.status = b.status = 200;
    }
    comparePage(report, a.path || file, a, b);
    compared += 1;
  }
  if (args.basePages === 'pages' && args.headPages === 'pages') await compareSite(report, args.base, args.head);

  if (args.approved && existsSync(args.approved)) applyApprovals(report, await readJson(args.approved));

  const markdown = render(report, args, compared);
  if (args.out) {
    await mkdir(path.dirname(args.out), { recursive: true });
    await writeFile(args.out, `${markdown}\n`);
    await writeFile(args.out.replace(/\.md$/, '.json'), `${JSON.stringify(report.items, null, 2)}\n`);
  }
  console.log(
    `Compared ${compared} pages: ${report.count('VIOLATION')} violation(s), ${report.count('REVIEW')} to review, ${report.count('APPROVED')} approved, ${report.count('INFO')} info.` +
      (args.out ? ` Report: ${path.relative(process.cwd(), args.out)}` : ''),
  );
  if (!args.out) console.log(markdown);
  process.exit(report.count('VIOLATION') ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
