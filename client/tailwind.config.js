/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chatgpt-dark': '#343541',
        'chatgpt-sidebar': '#202123',
        'chatgpt-user-msg': '#343541',
        'chatgpt-ai-msg': '#444654',
        'chatgpt-green': '#10a37f',
        'chatgpt-text': '#ececf1',
      },
    },
  },
  plugins: [],
}