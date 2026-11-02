import localFont from 'next/font/local';

// Headings only: Plus Jakarta Sans 800, a self-hosted woff2 file trimmed to
// the characters the site uses (about 7 KB; SIL Open Font
// License, see app/fonts/LICENSE-PlusJakartaSans.txt). next/font generates a
// metric-matched fallback, so the swap does not shift layout.
//
// Body text uses the device's own UI font (Roboto on Android, San Francisco
// on Apple devices, Segoe UI on Windows): no download at all. A web font for
// body text was measured to push mobile LCP past the pre-redesign baseline;
// see docs/redesign/phase-5-report.md.
export const fontDisplay = localFont({
  // One weight: headings asking for 700 use this 800 face (CSS font
  // matching picks the nearest heavier weight), which saves a request.
  src: [{ path: './fonts/plus-jakarta-sans-latin-800-normal.woff2', weight: '800', style: 'normal' }],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});
