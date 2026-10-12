import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MIN_FILL_MS, newLeadId, normalisePhone, validateLead } from '../../lib/leads/validate.mjs';

test('normalisePhone accepts Indian formats and rejects the rest', () => {
  for (const value of ['9876543210', '+91 98765 43210', '+91-98765-43210', '098765 43210', '919876543210']) {
    assert.equal(normalisePhone(value), '9876543210', value);
  }
  for (const value of ['', '12345', '0987654321', '98765432', 'abcdefghij', '+1 415 555 0100', null]) {
    assert.equal(normalisePhone(value), null, String(value));
  }
});

test('newLeadId is GR- plus 8 upper-case characters and varies', () => {
  const ids = new Set(Array.from({ length: 200 }, () => newLeadId()));
  for (const id of ids) assert.match(id, /^GR-[A-Z0-9]{8}$/);
  assert.ok(ids.size > 150);
});

const valid = (extra = {}) => ({ lead_id: 'GR-ABCDE123', phone: '98765 43210', ...extra });

test('a minimal valid lead passes and is normalised', () => {
  const result = validateLead(valid({ name: '  Ravi  ', lead_channel: 'ads', page: '/contact' }));
  assert.equal(result.ok, true);
  assert.equal(result.lead.phone, '9876543210');
  assert.equal(result.lead.name, 'Ravi');
  assert.equal(result.lead.lead_channel, 'ads');
  assert.equal(result.spam, false);
  assert.deepEqual(result.flags, []);
});

test('rejects bad phone, bad id and non-objects', () => {
  assert.equal(validateLead(valid({ phone: '123' })).ok, false);
  assert.equal(validateLead(valid({ lead_id: 'x' })).ok, false);
  assert.equal(validateLead(null).ok, false);
  assert.equal(validateLead([1]).ok, false);
});

test('clips long fields, drops unknown keys and control characters', () => {
  const result = validateLead(valid({ message: 'a'.repeat(5000), name: 'R\u0000avi', evil: '<script>', page: 'https://x' }));
  assert.equal(result.lead.message.length, 1000);
  assert.equal(result.lead.name, 'Ravi');
  assert.equal('evil' in result.lead, false);
  assert.equal(result.lead.page, '');
  assert.equal(result.lead.lead_channel, 'seo');
});

test('keeps only known attribution keys', () => {
  const result = validateLead(valid({ attribution: { source: 'google', click_id: 'G1', hack: 'x' } }));
  assert.equal(result.lead.attribution.source, 'google');
  assert.equal(result.lead.attribution.click_id, 'G1');
  assert.equal('hack' in result.lead.attribution, false);
});

test('spam signals: honeypot is spam, fast submit and link spam are flagged', () => {
  assert.equal(validateLead(valid({ _honey: 'bot' })).spam, true);
  assert.deepEqual(validateLead(valid({ elapsed_ms: MIN_FILL_MS - 1 })).flags, ['fast_submit']);
  assert.deepEqual(validateLead(valid({ elapsed_ms: 8000 })).flags, []);
  assert.deepEqual(validateLead(valid({ message: 'http://a http://b http://c' })).flags, ['links']);
});
