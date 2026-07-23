import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  plugins: [
    tailwindcssAnimate, 
    typography, 
    function({ addUtilities }) {
      addUtilities({
        '.animation-paused': {
          'animation-play-state': 'paused',
        },
      })
    }
  ],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '2rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        sm: '40rem',
        md: '48rem',
        lg: '64rem',
        xl: '80rem',
        '2xl': '86rem',
      },
    },
    extend: {
      gridTemplateRows: {
        '6': 'repeat(6, minmax(0, 1fr))',
        '7': 'repeat(7, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
      },
      minHeight: {
        '180': '180px',
        '200': '200px',
        '300': '300px',
        '400': '400px',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gentle-pulse': 'gentle-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll': 'scroll 30s linear infinite',
        'scroll-slow': 'scroll 50s linear infinite',
        'scroll-fast': 'scroll 20s linear infinite',
        'slide-in-from-bottom': 'slide-in-from-bottom 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-from-top': 'slide-in-from-top 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
        primary_red: '#C90E1D',
        secondary_red: '#FF3B4B',
        code3: {
          ink: '#0B0B0C',
          ink2: '#161617',
          ink3: '#1F1F21',
          paper: '#F5F5F6',
          signal: '#DF3341',
          'signal-dim': '#8B0F1F',
          amber: '#C90E1D',
          coral: '#DF3341',
          'coral-light': '#FF6B76',
          slate: '#71717A',
          'slate-light': '#A3A3A8',
          'line-dark': 'rgba(255,255,255,0.10)',
          'line-light': '#E4E4E7',
          text: '#0B0B0C',
        },
      },
      fontFamily: {
        sans: ['"Open Sauce Sans"', 'sans-serif'],
        mono: ['var(--font-geist-mono)'],
        mechano: ['var(--font-ca-mechano)', 'sans-serif'],
        grotesk: ['var(--font-space-grotesk)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        jetmono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        h1: ['56px', { lineHeight: '130%', fontWeight: '500' }],
        h2: ['48px', { lineHeight: '130%', fontWeight: '600' }],
        h3: ['32px', { lineHeight: '130%', fontWeight: '600' }],
        b1: ['28px', { lineHeight: '130%', fontWeight: '400' }],
        b2: ['24px', { lineHeight: '130%', fontWeight: '400' }],
        b3: ['20px', { lineHeight: '130%', fontWeight: '400' }],
        b4: ['18px', { lineHeight: '130%', fontWeight: '400' }],
        b5: ['16px', { lineHeight: '130%', fontWeight: '400' }],
        'btn-lg': ['20px', { lineHeight: '1.9rem', fontWeight: '500' }],
        'btn-sm': ['14px', { lineHeight: '1.7rem', fontWeight: '500' }],
        'btn-link': ['14px', { lineHeight: '20px', fontWeight: '600' }],
      },
      spacing: {
        space40: '2.5rem', // 40px
        space32: '2rem',   // 32px
        space16: '1rem',   // 16px
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'gentle-pulse': {
          '50%': { 
            opacity: '0.8',
            scale: '0.97'
          },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(0%)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-0%)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scroll: {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(-100%)'
          },
        },
        c3KenBurns: {
          from: { transform: 'scale(1.06)' },
          to: { transform: 'scale(1.14)' },
        },
        c3StreakDrift: {
          '0%': { transform: 'rotate(20deg) translateX(-6vw)' },
          '50%': { transform: 'rotate(20deg) translateX(6vw)' },
          '100%': { transform: 'rotate(20deg) translateX(-6vw)' },
        },
        c3StatusPulse: {
          '0%': { transform: 'scale(0.6)', opacity: '0.9' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        c3CueMove: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '40%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        c3SubsvcIn: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        c3ScrollX: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        c3: 'cubic-bezier(.22,1,.36,1)',
      },
    },
  },
}

export default config
