import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ATTRIBUTION_TTL_MS,
  applyTouch,
  channelFor,
  channelForPath,
  classifyVisit,
  leadAttribution,
  parseStored,
} from '../../lib/leads/attribution.mjs';

const HOST = 'grsolution.co.in';
const NOW = Date.UTC(2026, 9, 12, 12);
const visit = (overrides) => classifyVisit({ host: HOST, pathname: '/', now: NOW, ...overrides });

test('Google Ads clicks (gclid, gbraid, wbraid, gad_source) are ads', () => {
  for (const search of ['?gclid=Cj0KCQ', '?gbraid=0AAAAA', '?wbraid=CjkKCQ', '?gad_source=1']) {
    const touch = visit({ search, referrer: 'https://www.google.com/' });
    assert.equal(touch.channel, 'ads', search);
    assert.equal(touch.source, 'google');
    assert.equal(touch.medium, 'cpc');
  }
  const touch = visit({ search: '?gclid=ABC123&gad_source=1&utm_campaign=delhi-tv' });
  assert.equal(touch.click_id, 'ABC123');
  assert.equal(touch.click_id_type, 'gclid');
  assert.equal(touch.campaign, 'delhi-tv');
});

test('Microsoft Ads and paid utm mediums are ads; other utm tags are organic', () => {
  assert.equal(visit({ search: '?msclkid=x1' }).channel, 'ads');
  assert.equal(visit({ search: '?utm_source=google&utm_medium=cpc' }).channel, 'ads');
  assert.equal(visit({ search: '?utm_source=fb&utm_medium=paid_social' }).channel, 'ads');
  const newsletter = visit({ search: '?utm_source=newsletter&utm_medium=email' });
  assert.equal(newsletter.channel, 'seo');
  assert.equal(newsletter.medium, 'email');
});

test('search engines, Google Maps and AI assistants are organic (seo)', () => {
  const cases = [
    ['https://www.google.com/', 'google', 'organic'],
    ['https://www.google.co.in/', 'google', 'organic'],
    ['https://maps.google.com/', 'google', 'organic'],
    ['https://www.bing.com/search?q=tv', 'bing', 'organic'],
    ['https://duckduckgo.com/', 'duckduckgo', 'organic'],
    ['https://chatgpt.com/', 'chatgpt', 'ai'],
    ['https://www.perplexity.ai/search', 'perplexity', 'ai'],
    ['https://gemini.google.com/app', 'gemini', 'ai'],
    ['https://copilot.microsoft.com/', 'copilot', 'ai'],
    ['https://claude.ai/', 'claude', 'ai'],
  ];
  for (const [referrer, source, medium] of cases) {
    const touch = visit({ referrer });
    assert.equal(touch.channel, 'seo', referrer);
    assert.equal(touch.source, source, referrer);
    assert.equal(touch.medium, medium, referrer);
  }
});

test('fbclid on its own is organic social, not an ad', () => {
  assert.deepEqual(
    [visit({ search: '?fbclid=IwAR', referrer: 'https://l.facebook.com/' }).channel, visit({ search: '?fbclid=IwAR' }).medium],
    ['seo', 'social'],
  );
});

test('direct and internal visits return no touch', () => {
  assert.equal(visit({}), null);
  assert.equal(visit({ referrer: 'https://grsolution.co.in/blog' }), null);
  assert.equal(visit({ referrer: 'https://www.grsolution.co.in/' }), null);
  assert.equal(visit({ referrer: 'not a url' }), null);
});

test('last non-direct touch wins, direct visits keep it, 90 days then expires', () => {
  const ad = visit({ search: '?gclid=AD1' });
  let state = applyTouch(null, ad, NOW);
  assert.equal(channelFor(state, '/services/x', NOW), 'ads');

  // Direct visit a week later keeps the ad attribution.
  const week = NOW + 7 * 864e5;
  state = applyTouch(state, null, week);
  assert.equal(channelFor(state, '/', week), 'ads');

  // An organic search visit switches to the organic number but keeps first touch.
  const organic = classifyVisit({ host: HOST, referrer: 'https://www.google.com/', now: week });
  state = applyTouch(state, organic, week);
  assert.equal(channelFor(state, '/', week), 'seo');
  assert.equal(state.first.click_id, 'AD1');

  // Back to an ad click.
  state = applyTouch(state, visit({ search: '?gclid=AD2' }), week + 1);
  assert.equal(channelFor(state, '/', week + 1), 'ads');

  // 90 days without a new touch: route default again.
  const later = week + 1 + ATTRIBUTION_TTL_MS;
  state = applyTouch(state, null, later);
  assert.equal(state.last, null);
  assert.equal(channelFor(state, '/', later), 'seo');
  assert.equal(channelFor(state, '/landing', later), 'ads');
});

test('route defaults: only /landing is ads', () => {
  assert.equal(channelForPath('/'), 'seo');
  assert.equal(channelForPath('/services/tv-repair-noida'), 'seo');
  assert.equal(channelForPath('/landing'), 'ads');
  assert.equal(channelFor(null, '/'), 'seo');
});

test('parseStored tolerates junk', () => {
  assert.equal(parseStored(''), null);
  assert.equal(parseStored('{broken'), null);
  assert.equal(parseStored('42'), null);
  assert.deepEqual(parseStored('{"last":{"channel":"ads"}}'), { first: null, last: { channel: 'ads' } });
});

test('leadAttribution flattens the state for a lead', () => {
  const ad = visit({ search: '?gclid=G1&utm_campaign=noida', pathname: '/services/tv-repair-noida' });
  const fields = leadAttribution(applyTouch(null, ad, NOW), '/contact', NOW);
  assert.equal(fields.lead_channel, 'ads');
  assert.equal(fields.source, 'google');
  assert.equal(fields.click_id, 'G1');
  assert.equal(fields.landing_page, '/services/tv-repair-noida');
  assert.equal(fields.first_source, 'google');
  const none = leadAttribution(null, '/blog', NOW);
  assert.equal(none.source, 'direct');
  assert.equal(none.lead_channel, 'seo');
});
