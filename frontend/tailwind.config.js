/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Apple-style sistemske boje
        ink: {
          DEFAULT: '#1d1d1f',
          soft: '#6e6e73',
          faint: '#86868b',
        },
        accent: {
          DEFAULT: '#0071e3',
          hover: '#0077ed',
          press: '#006edb',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f5f7',
          sunken: '#fbfbfd',
        },
        line: '#d2d2d7',
        success: '#1d9e57',
        warning: '#bf7100',
        danger: '#d8332a',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        pop: '0 12px 40px rgba(0,0,0,0.12)',
        focus: '0 0 0 4px rgba(0,113,227,0.25)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s cubic-bezier(0.22,1,0.36,1)',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
}
