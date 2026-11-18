// Guard for the 2 Nov 2026 redesign (docs/design-system.md): no page template or
// component may use the pre-redesign styling classes. Added 19 Nov 2026 after a
// page was rewritten onto a template that had never been converted
// (components/ServicePageRevision.jsx) and pushed live looking older than the
// rest of the site.
//
// KNOWN_LEGACY can list a file that still carries legacy classes, frozen at its
// current count (a count may only go down). Since 19 Nov 2026 every template is
// converted and the list is empty: any legacy class anywhere fails this test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const LEGACY = /shadow-oldMd|shadow-cardPro|text-textMuted|rounded-card\b|bg-bgLight|text-secondary\b/g;

const KNOWN_LEGACY = {};

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(jsx?|mjs)$/.test(name) ? [path] : [];
  });
}

test('no new pre-redesign styling classes in app/ or components/', () => {
  const problems = [];
  for (const file of [...sourceFiles(join(root, 'app')), ...sourceFiles(join(root, 'components'))]) {
    const rel = relative(root, file).split(sep).join('/');
    const count = (readFileSync(file, 'utf8').match(LEGACY) || []).length;
    const allowed = KNOWN_LEGACY[rel] ?? 0;
    if (count > allowed) {
      problems.push(`${rel}: ${count} legacy class use(s), allowed ${allowed}. Use the redesign components and tokens (docs/design-system.md).`);
    }
  }
  assert.deepEqual(problems, []);
});
