import { defineConfig, devices } from '@playwright/test';

// Mirrors web-mvp/playwright.config.ts's webServer pattern, which is
// already proven working in this repo's own CI. Port 5179 matches this
// app's own `preview` script (package.json), not the test files' historical
// BASE_URL fallback of 5181 - CI sets BASE_URL explicitly (see
// .github/ci-coverage.json's demo-288 test check) so the test process reads
// the same port this server actually listens on.
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
