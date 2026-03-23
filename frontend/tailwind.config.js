/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        // Centralized container settings for consistent page padding
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
                xl: '2.5rem',
            },
        },
        // Explicit breakpoints for consistent responsive design
        screens: {
            'xs': '375px',   // Small phones
            'sm': '640px',   // Large phones / small tablets
            'md': '768px',   // Tablets
            'lg': '1024px',  // Small laptops
            'xl': '1280px',  // Desktops
            '2xl': '1536px', // Large screens
        },
        extend: {
            colors: {
                deepSpace: '#0B0B1A',
                neonPurple: '#B026FF',
                cyanGlow: '#00F0FF',
                surface: '#e2e8f0',
            },
            // Consistent spacing scale (8px base)
            spacing: {
                '18': '4.5rem',   // 72px
                '22': '5.5rem',   // 88px
                '30': '7.5rem',   // 120px
            },
            // Fluid typography using clamp
            fontSize: {
                'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
                'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.35vw, 1rem)',
                'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
                'fluid-lg': 'clamp(1.125rem, 1rem + 0.6vw, 1.25rem)',
                'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
                'fluid-2xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)',
                'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)',
                'fluid-4xl': 'clamp(2.25rem, 1.75rem + 2.5vw, 3rem)',
                'fluid-5xl': 'clamp(2.5rem, 1.875rem + 3.125vw, 3.75rem)',
            },
            // Max-width for containers
            maxWidth: {
                'container-sm': '640px',
                'container-md': '768px',
                'container-lg': '1024px',
                'container-xl': '1200px',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 1.2s ease-out forwards',
                'slide-in-left': 'slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-in-right': 'slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-in': 'scaleIn 0.8s ease-out forwards',
                orbit: 'orbit 20s linear infinite',
                float: 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-50px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(50px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                orbit: {
                    '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)' },
                    '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(0, 240, 255, 0.8)' },
                }
            },
        },
    },
    plugins: [],
};
