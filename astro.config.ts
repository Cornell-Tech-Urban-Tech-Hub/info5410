import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The site deploys to a GitHub Pages project path.
// See wiki/deployment.md for the base-path rules.
export default defineConfig({
  site: 'https://cornell-tech-urban-tech-hub.github.io',
  base: '/info5410',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
