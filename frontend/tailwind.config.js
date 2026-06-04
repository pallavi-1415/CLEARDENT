/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'gold-light': 'var(--color-gold-light)',
        'gold': 'var(--color-gold)',
        'gold-dark': 'var(--color-gold-dark)',
        'gold-hover': 'var(--color-gold-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-light': 'var(--border-light)',
        'border-focus': 'var(--border-focus)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'luxury': 'var(--shadow-luxury)',
      }
    },
  },
  plugins: [],
}

