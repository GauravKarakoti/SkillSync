// apps/issuer-portal/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ensure these paths correctly point to your components and pages
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};