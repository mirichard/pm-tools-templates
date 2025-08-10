import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home has no detectable a11y violations', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    // Optional: relax color-contrast if needed during early MVP by excluding certain selectors
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }
    });
  });
});
