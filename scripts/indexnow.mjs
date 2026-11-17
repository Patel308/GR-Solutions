#!/usr/bin/env node
// IndexNow submitter for grsolution.co.in.
//
// IndexNow tells Bing (and Yandex, Seznam, Naver) the moment a URL is added,
// changed or removed. Bing's index feeds ChatGPT search, Copilot and DuckDuckGo,
// so this is how new and updated pages reach AI answers quickly. Google does not
// use IndexNow; it keeps reading the sitemap.
//
// The key is public by design: it is served from /<key>.txt so the engines can
// confirm the site owns the submissions. It is not a secret.
//
// Usage (Node 18+, no dependencies):
//   node scripts/indexnow.mjs --before old-sitemap.xml   submit URLs that are new,
//                                                        changed (<lastmod>) or removed
//   node scripts/indexnow.mjs --all                      submit every sitemap URL
//   node scripts/indexnow.mjs --urls /pricing /services/tv-repair-delhi
//   add --dry-run to print the list without submitting.
//
// The deploy workflow runs the --before form after every production deploy.

import { readFileSync, existsSync } from 'node:fs';

const SITE = 'https://grsolution.co.in';
const HOST = new URL(SITE).host;
const KEY = '443043e7cb5fa7d21f24112881af65cf';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 10000;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = flag('--dry-run');

function parseSitemap(xml) {
  const map = new Map();
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() || '';
    if (loc) map.set(loc, lastmod.slice(0, 10));
  }
  return map;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'grsolution-indexnow/1.0' } });
  if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`);
  return res.text();
}

async function keyIsLive() {
  try {
    return (await fetchText(KEY_LOCATION)).trim() === KEY;
  } catch {
    return false;
  }
}

async function submit(urls) {
  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    // 200 = accepted, 202 = accepted and key validation pending. Anything else is a problem.
    const body = res.status === 200 || res.status === 202 ? '' : ` ${await res.text()}`;
    console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)${body}`);
    if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
  }
}

async function main() {
  let urls = [];

  if (flag('--urls')) {
    const start = args.indexOf('--urls') + 1;
    const end = args.findIndex((a, i) => i >= start && a.startsWith('--'));
    const explicit = args.slice(start, end === -1 ? undefined : end);
    urls = explicit.map((u) => (u.startsWith('http') ? u : `${SITE}${u.startsWith('/') ? '' : '/'}${u}`));
  } else {
    const current = parseSitemap(await fetchText(`${SITE}/sitemap.xml`));
    if (flag('--all')) {
      urls = [...current.keys()];
    } else {
      const beforePath = valueOf('--before');
      if (!beforePath || !existsSync(beforePath)) {
        console.log('IndexNow: no previous sitemap given; nothing to compare. Use --all for a full submission.');
        return;
      }
      const before = parseSitemap(readFileSync(beforePath, 'utf8'));
      const added = [...current.keys()].filter((u) => !before.has(u));
      const changed = [...current.keys()].filter((u) => before.has(u) && before.get(u) !== current.get(u));
      const removed = [...before.keys()].filter((u) => !current.has(u));
      console.log(`IndexNow: ${added.length} new, ${changed.length} changed, ${removed.length} removed`);
      urls = [...added, ...changed, ...removed];
    }
  }

  urls = [...new Set(urls)].filter((u) => new URL(u).host === HOST);
  if (!urls.length) {
    console.log('IndexNow: no URLs to submit.');
    return;
  }
  urls.forEach((u) => console.log(`  ${u}`));
  if (dryRun) {
    console.log(`IndexNow: dry run, ${urls.length} URL(s) not submitted.`);
    return;
  }
  if (!(await keyIsLive())) {
    console.error(`IndexNow: key file ${KEY_LOCATION} is not live yet; not submitting.`);
    process.exitCode = 1;
    return;
  }
  await submit(urls);
}

main().catch((error) => {
  console.error(`IndexNow: ${error.message}`);
  process.exitCode = 1;
});
