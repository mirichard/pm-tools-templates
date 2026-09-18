import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['dot'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
