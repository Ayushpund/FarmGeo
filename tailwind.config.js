/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                nature: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3eed2',
                    300: '#94e0b3',
                    400: '#5cc98d',
                    500: '#34ae6f',
                    600: '#258c56',
                    700: '#207046',
                    800: '#1d593a',
                    900: '#194931',
                    950: '#0d281c',
                },
                earth: {
                    50: '#faf7f5',
                    100: '#f4efe9',
                    200: '#e8ded4',
                    300: '#d7c4b4',
                    400: '#c2a58d',
                    500: '#ae896d',
                    600: '#916d55',
                    700: '#755848',
                    800: '#644d41',
                    900: '#524038',
                    950: '#2b211c',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
