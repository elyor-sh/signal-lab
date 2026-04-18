import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214 18% 86%)',
        input: 'hsl(214 18% 86%)',
        ring: 'hsl(172 74% 32%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 22% 12%)',
        primary: {
          DEFAULT: 'hsl(172 74% 32%)',
          foreground: 'hsl(0 0% 100%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 72% 45%)',
          foreground: 'hsl(0 0% 100%)',
        },
        muted: {
          DEFAULT: 'hsl(210 24% 96%)',
          foreground: 'hsl(215 16% 42%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222 22% 12%)',
        },
      },
      boxShadow: {
        panel: '0 12px 36px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
