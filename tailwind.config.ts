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
        surface: {
          DEFAULT: '#070B14',
          1: '#0D1120',
          2: '#111827',
          3: '#1A2235',
        },
        glass: 'rgba(255,255,255,0.04)',
        border: 'rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.3), transparent)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform-1': 'waveform 1.0s ease-in-out infinite',
        'waveform-2': 'waveform 1.2s ease-in-out infinite 0.1s',
        'waveform-3': 'waveform 0.9s ease-in-out infinite 0.2s',
        'waveform-4': 'waveform 1.1s ease-in-out infinite 0.15s',
        'waveform-5': 'waveform 0.8s ease-in-out infinite 0.05s',
        'ring-expand': 'ringExpand 1.5s ease-out infinite',
        'ring-expand-delay': 'ringExpand 1.5s ease-out infinite 0.5s',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        ringExpand: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(139,92,246,0.3)',
        'glow-violet-lg': '0 0 80px rgba(139,92,246,0.4)',
        'glow-red': '0 0 30px rgba(239,68,68,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
