/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './data/**/*.{js,jsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      xs: '400px',
      smx: '576px',
      mobile: '600px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '5%',
        xl: '5%',
      },
    },
    extend: {
      colors: {
        primary: '#0d47a1',
        primaryDark: '#0a3d8a',
        accent: '#1a73e8',
        secondary: '#0d0c22',
        textMain: '#0d0c22',
        textMuted: '#6e6d7a',
        bgLight: '#f9fafb',
        white: '#ffffff',
        success: '#10b981',
        danger: '#ef4444',
      },
      fontFamily: {
        main: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        oldSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        oldMd: '0 10px 40px rgba(0, 0, 0, 0.04)',
        oldLg: '0 20px 60px rgba(0, 0, 0, 0.08)',
        nav: '0 10px 35px rgba(15, 23, 42, 0.04)',
        cardPro: '0 24px 70px rgba(15, 23, 42, 0.08)',
        cta: '0 16px 35px rgba(13, 71, 161, 0.12)',
        ctaHover: '0 20px 45px rgba(13, 71, 161, 0.22)',
      },
      borderRadius: {
        card: '20px',
        modal: '24px',
        pro: '28px',
      },
      transitionTimingFunction: {
        old: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'carousel-loop': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-testi': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.5)' },
          '50%': { boxShadow: '0 0 0 12px rgba(16, 185, 129, 0)' },
        },
        'soft-rise': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        carousel: 'carousel-loop 42s linear infinite',
        testimonials: 'scroll-testi 35s linear infinite',
        pulseGreen: 'pulse-green 2s infinite',
        softRise: 'soft-rise 0.7s ease both',
      },
    },
  },
  plugins: [],
};
