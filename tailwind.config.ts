import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        off: '#F4F3F0',
        ink: '#1A1A1A',
        navy: {
          DEFAULT: '#1B305B',
          dark: '#142447',
          dim: 'rgba(27,48,91,0.08)',
        },
        border: {
          DEFAULT: '#E8E6E1',
          strong: '#D4D0C8',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(13, 13, 13, 0.3)',
          light: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.1)',
          borderDark: 'rgba(255, 255, 255, 0.05)',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Libre Baskerville', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      letterSpacing: {
        kicker: '0.22em',
        label: '0.14em',
        loose: '0.1em',
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        'shimmer-slow': 'shimmer 9s linear infinite',
        'shimmer-fast': 'shimmer 3.5s linear infinite',
        'orb-float': 'orbFloat 14s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'sweep-card': 'sweepCard 8s ease-in-out infinite',
        'border-glow': 'borderGlow 5s ease-in-out infinite',
        'scan': 'scan 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(91, 148, 210, 0.3)' },
          '50%': { boxShadow: '0 0 0 10px rgba(91, 148, 210, 0)' },
        },
        sweepCard: {
          '0%, 100%': { backgroundPosition: '200% 50%' },
          '50%': { backgroundPosition: '-200% 50%' },
        },
        borderGlow: {
          '0%, 100%': { borderTopColor: 'rgba(255, 255, 255, 0.18)' },
          '50%': { borderTopColor: 'rgba(91, 148, 210, 0.45)' },
        },
        scan: {
          '0%': { transform: 'translateY(-200%)' },
          '100%': { transform: 'translateY(500%)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        '.glass-dark': {
          'background': 'rgba(13, 13, 13, 0.3)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.05)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        '.glass-light': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 4px 16px rgba(27, 48, 91, 0.1)',
        },
        '.liquid-glass': {
          'background': 'rgba(255, 255, 255, 0.005)',
          'backdrop-filter': 'blur(3px)',
          '-webkit-backdrop-filter': 'blur(3px)',
          'border': '1px solid rgba(255, 255, 255, 0.02)',
          'box-shadow': '0 1px 8px rgba(0, 0, 0, 0.03)',
          'border-radius': '16px',
          'padding': '30px',
          'position': 'relative',
          'overflow': 'hidden',
          'transition': 'all 0.4s ease',
        },
        '.liquid-glass-dark': {
          'background': 'rgba(255, 255, 255, 0.003)',
          'backdrop-filter': 'blur(3px)',
          '-webkit-backdrop-filter': 'blur(3px)',
          'border': '1px solid rgba(255, 255, 255, 0.01)',
          'box-shadow': '0 1px 8px rgba(0, 0, 0, 0.03)',
          'border-radius': '16px',
          'padding': '30px',
          'position': 'relative',
          'overflow': 'hidden',
          'transition': 'all 0.4s ease',
        },
        '.liquid-glass-light': {
          'background': 'rgba(255, 255, 255, 0.008)',
          'backdrop-filter': 'blur(3px)',
          '-webkit-backdrop-filter': 'blur(3px)',
          'border': '1px solid rgba(255, 255, 255, 0.03)',
          'box-shadow': '0 1px 8px rgba(0, 0, 0, 0.03)',
          'border-radius': '16px',
          'padding': '30px',
          'position': 'relative',
          'overflow': 'hidden',
          'transition': 'all 0.4s ease',
        },
        '.liquid-glass-button': {
          'background': 'rgba(255, 255, 255, 0.005)',
          'backdrop-filter': 'blur(3px)',
          '-webkit-backdrop-filter': 'blur(3px)',
          'border': '1px solid rgba(255, 255, 255, 0.02)',
          'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.05), 0 0 15px rgba(255, 255, 255, 0.1)',
          'border-radius': '9999px',
          'padding': '12px 32px',
          'font-family': 'DM Mono, monospace',
          'font-size': '0.7rem',
          'letter-spacing': '0.12em',
          'text-transform': 'uppercase',
          'color': 'white',
          'transition': 'all 0.4s ease',
          'position': 'relative',
          'overflow': 'hidden',
          'cursor': 'pointer',
        },
        '.liquid-glass-block': {
          'background': 'rgba(255, 255, 255, 0.005)',
          'backdrop-filter': 'blur(3px)',
          '-webkit-backdrop-filter': 'blur(3px)',
          'border': '1px solid rgba(255, 255, 255, 0.02)',
          'box-shadow': '0 1px 8px rgba(0, 0, 0, 0.03)',
          'border-radius': '16px',
          'padding': '30px',
          'position': 'relative',
          'overflow': 'hidden',
          'transition': 'all 0.4s ease',
          'min-height': '200px',
        },
        '.bg-gradient-radial': {
          'background': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        },
      });
    },
  ],
}

export default config
