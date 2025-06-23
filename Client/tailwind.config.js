/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff5f5',
                    100: '#ffe8e8',
                    500: '#ff6b6b',
                    600: '#ff5252',
                    700: '#ff4757',
                },
                secondary: {
                    50: '#f8f9fa',
                    100: '#e9ecef',
                    500: '#ffa500',
                    600: '#ff9500',
                },
                dark: {
                    50: '#f8f9fa',
                    100: '#e9ecef',
                    500: '#2c3e50',
                    600: '#34495e',
                }
            }, fontFamily: {
                'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                'roboto': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
