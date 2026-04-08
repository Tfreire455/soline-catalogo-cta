module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#D4AF37',
          500: '#C9A227',
          600: '#BF8F17',
          700: '#B57C07',
        },
      },
      fontFamily: {
        serif: ['"Josefin Sans"', 'sans-serif'],
      }, 
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        shine: 'shine 2.5s linear infinite',
      },
    }
  },
  plugins: [],
}