import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mockApiPlugin } from './src/plugins/mockApi';

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
