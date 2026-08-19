import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The site deploys to a custom domain at the root of GitHub Pages,
// matching the INFO 5420 site. See wiki/deployment.md for the base-path rules.
export default defineConfig({
  site: 'https://info5410.tech.cornell.edu',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
