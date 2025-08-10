import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage passes axe WCAG2 A/AA', async ({ page }) => {
const BASE = process.env.BASE_URL || 'http://127.0.0.1:5181/';
  await page.goto(BASE);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a','wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
