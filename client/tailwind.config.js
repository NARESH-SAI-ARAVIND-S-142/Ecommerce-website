/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // NexMart Design Tokens
        navy: {
          DEFAULT: '#0A0F1E',
          50: '#1A2038',
          100: '#151B30',
          200: '#111728',
          300: '#0D1220',
          400: '#0A0F1E',
          500: '#070B16',
          600: '#04070E',
          700: '#020306',
          800: '#000000',
          900: '#000000',
        },
        violet: {
          DEFAULT: '#6C47FF',
          50: '#F0ECFF',
          100: '#E0D8FF',
          200: '#C2B1FF',
          300: '#A38AFF',
          400: '#8568FF',
          500: '#6C47FF',
          600: '#5A2FFF',
          700: '#4A17FF',
          800: '#3B00F0',
          900: '#2F00C0',
        },
        cyan: {
          DEFAULT: '#00C9A7',
          50: '#E0FFF8',
          100: '#B3FFEf',
          200: '#80FFE4',
          300: '#4DFFD9',
          400: '#1AFFCE',
          500: '#00C9A7',
          600: '#00A88C',
          700: '#008770',
          800: '#006655',
          900: '#00453A',
        },
        coral: {
          DEFAULT: '#FF6B6B',
          50: '#FFF0F0',
          100: '#FFD8D8',
          200: '#FFB1B1',
          300: '#FF8A8A',
          400: '#FF6B6B',
          500: '#FF4C4C',
          600: '#FF2D2D',
          700: '#FF0E0E',
          800: '#EE0000',
          900: '#CC0000',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          light: 'rgba(255, 255, 255, 0.06)',
          lighter: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        glow: '0 0 20px rgba(108, 71, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(108, 71, 255, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 201, 167, 0.3)',
        'glow-coral': '0 0 20px rgba(255, 107, 107, 0.3)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-violet': 'linear-gradient(135deg, #6C47FF, #00C9A7)',
        'gradient-coral': 'linear-gradient(135deg, #FF6B6B, #6C47FF)',
        'gradient-dark': 'linear-gradient(180deg, #0A0F1E 0%, #111728 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
        pulse_glow: 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        ripple: 'ripple 0.6s linear',
        'counter-up': 'counterUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 71, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 71, 255, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
};
