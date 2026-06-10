import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#fdf6f0',
        },
        text: {
          DEFAULT: '#2d1b1b',
        },
        header: {
          DEFAULT: '#ffffff',
        },
        card: {
          DEFAULT: '#ffffff',
        },
        border: {
          DEFAULT: '#f0e0d6',
        },
        accent: {
          fuchsia: '#c91052',
          gold: '#c9a84c',
          pink: '#f4a0b0',
          rose: '#e8a0b4',
          cream: '#fff5ee',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
