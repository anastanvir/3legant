import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  daisyui: {
    themes: [
      {
        customBlack: {
          primary: 'oklch(35% 0 0)',
          'primary-content': 'oklch(100% 0 0)',
          secondary: 'oklch(35% 0 0)',
          'secondary-content': 'oklch(100% 0 0)',
          accent: 'oklch(35% 0 0)',
          'accent-content': 'oklch(100% 0 0)',
          neutral: 'oklch(35% 0 0)',
          'neutral-content': 'oklch(100% 0 0)',
          'base-100': 'oklch(0% 0 0)', // Pure black
          'base-200': 'oklch(19% 0 0)',
          'base-300': 'oklch(22% 0 0)',
          'base-content': 'oklch(87.609% 0 0)',
          info: 'oklch(45.201% 0.313 264.052)',
          'info-content': 'oklch(89.04% 0.062 264.052)',
          success: 'oklch(51.975% 0.176 142.495)',
          'success-content': 'oklch(90.395% 0.035 142.495)',
          warning: 'oklch(96.798% 0.211 109.769)',
          'warning-content': 'oklch(19.359% 0.042 109.769)',
          error: 'oklch(62.795% 0.257 29.233)',
          'error-content': 'oklch(12.559% 0.051 29.233)',
          '--rounded-box': '0.6rem !important',
          '--rounded-btn': '0.8rem !important',
          '--rounded-badge': '0.4rem !important',
          '--tab-radius': '0.6rem !important',
        },
      },
    ],
    darkTheme: 'customBlack', // Force only your custom theme
    base: false, // Disable default themes
    styled: false,
    utils: false,
  },
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 12px)',
        sm: 'calc(var(--radius) - 16px)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('daisyui')],
} satisfies Config;

export default config;
