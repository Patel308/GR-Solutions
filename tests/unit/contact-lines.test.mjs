import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// data/siteConfig.js is ESM in a CommonJS package; read the numbers from source.
test("every contact line uses Deepanshu's number; the retired numbers are gone (owner, 25 Nov 2026)", async () => {
  const source = await readFile(new URL('../../data/siteConfig.js', import.meta.url), 'utf8');
  const config = source.slice(source.indexOf('const primaryLine'), source.indexOf('export const siteConfig'));
  assert.match(config, /phone: '\+91 84498 20270'/);
  assert.match(config, /phoneHref: 'tel:\+918449820270'/);
  assert.match(config, /whatsappHref: 'https:\/\/wa\.me\/918449820270'/);
  for (const line of ['ads', 'seo', 'seo2', 'home']) assert.match(config, new RegExp(`\\n  ${line}: primaryLine,`), line);
  assert.match(source, /\.\.\.contactChannels\.seo,/, 'siteConfig (schema, llms.txt, NAP) takes the primary line');
  for (const old of ['93155', '9315515700', '99902', '9990283890']) assert.ok(!source.includes(old), `siteConfig never mentions ${old}`);
});
