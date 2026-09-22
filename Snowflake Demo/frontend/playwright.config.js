const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/browser',
  use: { browserName: 'chromium' },
  projects: [
    { name: 'development', use: { baseURL: 'http://127.0.0.1:3100' } },
    { name: 'production', use: { baseURL: 'http://127.0.0.1:3101' } },
  ],
  webServer: [
    { command: 'npm start -- --port 3100', url: 'http://127.0.0.1:3100' },
    { command: 'npm run preview -- --port 3101', url: 'http://127.0.0.1:3101' },
  ],
});
