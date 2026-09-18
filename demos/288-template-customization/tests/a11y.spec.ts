import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage passes axe WCAG2 A/AA', async ({ page }) => {
  await page.goto('http://127.0.0.1:5179/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a','wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
