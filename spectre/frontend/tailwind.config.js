/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06070A',
          900: '#0B0D12',
          800: '#11141B',
          700: '#1A1E27',
          600: '#262B36',
        },
        spectre: {
          accent: '#7CFFB2',
          warn: '#FF5C5C',
          mute: '#8A93A6',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(124, 255, 178, 0.35)',
      },
    },
  },
  plugins: [],
};
