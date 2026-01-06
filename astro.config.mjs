import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://fliteska.github.io',

  integrations: [
      mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});