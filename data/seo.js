// Shared SEO string helpers.
//
// Google truncates title links at roughly 60 characters and meta descriptions
// at roughly 160. Because most titles here are generated from templates, a long
// city name (e.g. "Greater Noida") could silently push a title past the limit.
// These helpers degrade gracefully instead: the optional middle qualifier is
// dropped first, then the brand suffix, so the keyword itself always survives.

export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 160;

const BRAND = 'GR Solution';

/**
 * Build a title of the form `core | qualifier | GR Solution`, shortening it
 * step by step until it fits within TITLE_LIMIT.
 */
export function buildTitle(core, qualifier) {
  const candidates = [
    [core, qualifier, BRAND],
    [core, BRAND],
    [core, qualifier],
    [core],
  ];

  for (const parts of candidates) {
    const title = parts.filter(Boolean).join(' | ');
    if (title.length <= TITLE_LIMIT) return title;
  }

  return core;
}

/**
 * Trim a description to DESCRIPTION_LIMIT without cutting a word in half.
 * Returns the original string when it already fits.
 */
export function clampDescription(text) {
  const value = (text || '').trim();
  if (value.length <= DESCRIPTION_LIMIT) return value;

  const cut = value.slice(0, DESCRIPTION_LIMIT);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:\s]+$/, '')}.`;
}
