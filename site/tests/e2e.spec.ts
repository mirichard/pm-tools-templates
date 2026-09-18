import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Preview demo', () => {
  test('loads index and renders first template', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /PM Templates Preview/ })).toBeVisible();
    // Accept or decline telemetry to proceed
    const yes = page.getByRole('button', { name: 'Yes' });
    if (await yes.isVisible()) await yes.click();

    // Ensure list loads and first item can be clicked
    const listItem = page.locator('#file-list li').first();
    await expect(listItem).toBeVisible();
    await listItem.click();

    // Content renders
    await expect(page.locator('#content')).toContainText(/#|Project|Template|Plan|Charter|Sprint|Risk|Stakeholder/i);
  });

  test('accessibility check passes basic rules', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
