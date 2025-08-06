import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mirichard.github.io',
  base: '/pm-tools-templates',
  integrations: [react(), sitemap()],
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'office-viewers': ['xlsx'],
            'reveal': ['reveal.js']
          }
        }
      }
    }
  }
});
