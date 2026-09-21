import { defineConfig, devices } from '@playwright/test';

// Mirrors web-mvp/playwright.config.ts's webServer pattern, which is
// already proven working in this repo's own CI. Port 5179 matches both
// this app's own `preview` script and the test files' already-hardcoded
// BASE_URL (this app, unlike demo/288, has no port mismatch - only the
// missing server).
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:5179',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    port: 5179,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
