// Dates are rendered in a fixed en-IN format so the static output stays
// identical regardless of where the build runs.
export function formatDate(value, month = 'long') {
  if (!value) return '';
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month,
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const countWords = (text) => String(text || '').split(/\s+/).filter(Boolean).length;

// Reading time of the article body (intro, sections, lists and tables) at
// 200 words a minute, rounded up.
export function readingMinutes(article) {
  let words = countWords(article.intro);
  for (const section of article.sections || []) {
    words += countWords(section.heading) + countWords(section.body) + countWords(section.closing);
    for (const item of section.list || []) words += countWords(item);
    for (const row of section.table?.rows || []) for (const cell of row) words += countWords(cell);
  }
  return Math.max(1, Math.ceil(words / 200));
}

// "Delhi Cost Guide" and "Noida Cost Guide" belong to the same family.
const family = (category = '') => category.split(' ').slice(-2).join(' ');

// Up to `limit` other guides: same category first, then the same family of
// guides (cost, symptom...), then guides that point at the same pages, then
// the rest in their published order.
export function relatedArticles(article, all, limit = 3) {
  const targets = new Set((article.internalLinks || []).map((link) => link.href));
  const score = (other) =>
    (other.category === article.category ? 10 : 0) +
    (family(other.category) === family(article.category) ? 5 : 0) +
    (other.internalLinks || []).filter((link) => targets.has(link.href)).length;
  return all
    .filter((other) => other.slug !== article.slug)
    .map((other, index) => ({ other, index, score: score(other) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ other }) => other);
}
