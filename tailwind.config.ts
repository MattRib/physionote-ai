import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#5A9BCF',
          green: '#A8D5BA', // Mantido para compatibilidade, mas não usado em hover
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F7F7F7',
          medium: '#B0B0B0',
          dark: '#333333',
        },
        blue: {
          700: '#2C5F8D', // Azul escuro para hover
          800: '#1E4A6F', // Azul mais escuro alternativo
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-up-modal': 'slideUpModal 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'hero-title': 'heroTitle 1s ease-out forwards',
        'hero-subtitle': 'heroSubtitle 1s ease-out 0.3s forwards',
        'hero-button-primary': 'heroButtonPrimary 0.8s ease-out 0.6s forwards',
        'hero-button-secondary': 'heroButtonSecondary 0.8s ease-out 0.75s forwards',
        'hero-image': 'heroImage 1.2s ease-out 0.4s forwards',
        'logo-entrance': 'logoEntrance 0.8s ease-out forwards',
        'nav-item-1': 'navItem 0.6s ease-out 0.2s forwards',
        'nav-item-2': 'navItem 0.6s ease-out 0.35s forwards',
        'nav-item-3': 'navItem 0.6s ease-out 0.5s forwards',
        'header-login': 'headerLogin 0.7s ease-out 0.65s forwards',
        'blob': 'blob 7s infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-gentle': 'pulse-gentle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUpModal: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        heroTitle: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(40px)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)',
          },
        },
        heroSubtitle: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)',
          },
        },
        heroButtonPrimary: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) scale(0.9)',
          },
          '60%': {
            transform: 'translateY(-5px) scale(1.05)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
          },
        },
        heroButtonSecondary: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) scale(0.9)',
          },
          '60%': {
            transform: 'translateY(-5px) scale(1.05)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
          },
        },
        heroImage: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(30px) scale(0.95)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0) scale(1)',
          },
        },
        logoEntrance: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-30px)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)',
          },
        },
        navItem: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-10px)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)',
          },
        },
        headerLogin: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(20px) scale(0.95)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0) scale(1)',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'ping-slow': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'pulse-gentle': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
      }
    },
  },
  plugins: [],
};
export default config;