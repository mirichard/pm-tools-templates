import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      allow: [
        // allow importing JSON schemas from one level above
        path.resolve(__dirname, '..'),
        path.resolve(__dirname)
      ]
    }
  },
  resolve: {
    alias: {
      '@schemas': path.resolve(__dirname, '../schemas/web-mvp')
    }
  }
});
