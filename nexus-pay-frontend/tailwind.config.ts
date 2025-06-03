import type { Config } from 'tailwindcss';
import { COLORS } from './src/constants/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: COLORS.primary.main,
          light: COLORS.primary.light,
          dark: COLORS.primary.dark,
        },
        // Accent colors (yellow in design)
        accent: {
          DEFAULT: COLORS.accent.main,
          light: COLORS.accent.light,
          dark: COLORS.accent.dark,
        },
        // Background colors
        background: {
          DEFAULT: COLORS.background.main,
          secondary: COLORS.background.secondary,
          dark: COLORS.background.dark,
        },
        // Text colors
        text: {
          DEFAULT: COLORS.text.primary,
          secondary: COLORS.text.secondary,
          muted: COLORS.text.muted,
          inverse: COLORS.text.inverse,
        },
        // Status colors
        success: COLORS.status.success,
        warning: COLORS.status.warning,
        error: COLORS.status.error,
        info: COLORS.status.info,
        // Border colors
        border: {
          DEFAULT: COLORS.border.light,
          dark: COLORS.border.dark,
        },
        
        // Keep shadcn-ui compatibility colors
        destructive: {
          DEFAULT: COLORS.status.error,
          foreground: 'white',
        },
        muted: {
          DEFAULT: COLORS.background.secondary,
          foreground: COLORS.text.muted,
        },
        card: {
          DEFAULT: 'white',
          foreground: COLORS.text.primary,
        },
        popover: {
          DEFAULT: 'white',
          foreground: COLORS.text.primary,
        },
        input: COLORS.border.light,
        ring: COLORS.accent.main,
      },
      
      borderRadius: {
        lg: '0.625rem', // 10px
        md: '0.5rem',   // 8px
        sm: '0.25rem',  // 4px
      },
      
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      
      boxShadow: {
        'card': '0px 4px 12px rgba(0, 0, 0, 0.05)',
        'dropdown': '0px 4px 20px rgba(0, 0, 0, 0.1)',
        'button': '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config; 