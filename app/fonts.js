import localFont from 'next/font/local';

// Self-hosted, Latin-subset woff2 files (SIL Open Font License, see
// app/fonts/LICENSE-*.txt). next/font generates a metric-matched fallback for
// each family, so the swap from the fallback to the web font does not shift
// layout.

// Headings. Small files (~12 KB per weight) that the H1 needs on first paint,
// so they are preloaded.
export const fontDisplay = localFont({
  src: [
    { path: './fonts/plus-jakarta-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});

// Body copy. Not preloaded: text paints immediately in the metric-matched
// fallback and swaps when Inter arrives, keeping it off the LCP critical path.
export const fontBody = localFont({
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/inter-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});
