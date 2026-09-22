import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: { template: './public/index.html' },
  server: { host: '127.0.0.1', port: 3000 },
  output: {
    distPath: { root: 'build' },
    sourceMap: { js: false, css: false },
  },
});
