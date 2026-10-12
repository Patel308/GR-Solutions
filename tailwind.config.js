/** @type {import('tailwindcss').Config} */

// Colours are CSS custom properties holding RGB channels (see the :root block in
// app/globals.css), so every utility, including /opacity modifiers such as
// bg-primary/10, follows the design tokens. docs/design-system.md lists them.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

const scale = (name, steps) => Object.fromEntries(steps.map((step) => [step, token(`${name}-${step}`)]));

module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './data/**/*.{js,jsx}'],
  corePlugins: {
    // .container is defined in app/globals.css (16px phone gutter, 1280px cap).
    container: false,
  },
  theme: {
    screens: {
      xs: '400px',
      smx: '576px',
      mobile: '600px',
      sm: '640px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Semantic names used across the templates.
        primary: token('navy-600'),
        primaryDark: token('navy-700'),
        accent: token('teal-600'),
        secondary: token('ink'),
        textMain: token('text-strong'),
        textMuted: token('muted'),
        bgLight: token('surface'),
        success: token('success'),
        warning: token('warning'),
        danger: token('danger'),
        // Scales and roles.
        navy: scale('navy', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        teal: scale('teal', [50, 100, 300, 400, 600, 700]),
        ink: token('ink'),
        body: token('body'),
        muted: token('muted'),
        subtle: token('subtle'),
        line: { DEFAULT: token('line'), strong: token('line-strong'), field: token('field') },
        surface: { DEFAULT: token('surface'), 2: token('surface-2') },
        wa: { DEFAULT: token('wa'), hover: token('wa-hover'), brand: token('wa-brand') },
        star: token('star'),
      },
      fontFamily: {
        // Body: the device's UI font (no download). Headings: Plus Jakarta Sans.
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        main: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
      },
      // Fluid type scale: the first value is the size on a 360px phone, the
      // clamp() maximum is reached on desktop. H1 is capped at 2rem on phones.
      fontSize: {
        display: ['clamp(2rem, 1.55rem + 2vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.018em' }],
        h2: ['clamp(1.5rem, 1.2rem + 1.35vw, 2.25rem)', { lineHeight: '1.18', letterSpacing: '-0.01em' }],
        h3: ['clamp(1.125rem, 1.03rem + 0.4vw, 1.375rem)', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        lead: ['clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)', { lineHeight: '1.6' }],
        body: ['clamp(1rem, 0.96rem + 0.18vw, 1.0625rem)', { lineHeight: '1.65' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        eyebrow: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        prose: '70ch',
      },
      boxShadow: {
        xs: '0 1px 2px rgb(15 23 42 / 0.05)',
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px -8px rgb(15 23 42 / 0.10)',
        'card-hover': '0 2px 4px rgb(15 23 42 / 0.04), 0 18px 36px -14px rgb(15 23 42 / 0.20)',
        float: '0 -8px 24px -10px rgb(15 23 42 / 0.22)',
        'btn-primary': '0 1px 2px rgb(13 71 161 / 0.20), 0 8px 18px -10px rgb(13 71 161 / 0.60)',
        // Legacy names, re-tuned to the restrained system.
        oldSm: '0 1px 2px rgb(15 23 42 / 0.05)',
        oldMd: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px -8px rgb(15 23 42 / 0.10)',
        oldLg: '0 2px 4px rgb(15 23 42 / 0.04), 0 18px 36px -14px rgb(15 23 42 / 0.20)',
        nav: '0 1px 0 rgb(15 23 42 / 0.06)',
        cardPro: '0 1px 2px rgb(15 23 42 / 0.04), 0 12px 32px -12px rgb(15 23 42 / 0.16)',
        cta: '0 1px 2px rgb(13 71 161 / 0.20), 0 8px 18px -10px rgb(13 71 161 / 0.60)',
        ctaHover: '0 2px 4px rgb(13 71 161 / 0.20), 0 12px 24px -12px rgb(13 71 161 / 0.65)',
      },
      borderRadius: {
        card: '1rem',
        modal: '1.25rem',
        pro: '1.5rem',
        btn: '0.75rem',
      },
      transitionTimingFunction: {
        old: 'cubic-bezier(0.4, 0, 0.2, 1)',
        out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
