import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5181/';

async function saveVersion(page: any, name: string) {
  await page.getByTestId('version-name').fill(name);
  await page.getByTestId('save-version-btn').click();
}

test.describe('Issue #288 — Interaction Verification', () => {
  test('Download, Save, Load, Diff interactions work and Show Diff disabled until A/B', async ({ page }) => {
    await page.goto(BASE);
    // Select Charter
    await page.getByTestId('template-charter').check();
    // Fill a couple fields
    await page.getByLabel('Project Name').fill('Verifiable Charter');
    await page.getByLabel('Scope').fill('Initial scope');

    // Download triggers a download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('download-btn').click(),
    ]);
    const path = await download.path();
    expect(path).toBeTruthy();

    // Save V1 and V2
    await saveVersion(page, 'V1');
    await page.getByLabel('Scope').fill('Updated scope');
    await saveVersion(page, 'V2');

    // Show Diff disabled until both A and B set
    await expect(page.getByTestId('show-diff-btn')).toBeDisabled();

    // Select A and B
    await page.getByTestId('diff-a').selectOption({ index: 1 });
    await page.getByTestId('diff-b').selectOption({ index: 2 });

    await expect(page.getByTestId('show-diff-btn')).toBeEnabled();
    await page.getByTestId('show-diff-btn').click();

    // Expect diff header visible
    await expect(page.getByRole('heading', { name: /Diff:/ })).toBeVisible();
  });

  test('Load version applies saved data to the form', async ({ page }) => {
    await page.goto(BASE);
    await page.getByTestId('template-charter').check();
    await page.getByLabel('Project Name').fill('Load Test');
    await page.getByLabel('Scope').fill('Load scope');
    await saveVersion(page, 'LoadV1');

    // Change data then load back
    await page.getByLabel('Scope').fill('Different scope');

    // Choose saved version in Load select (first after placeholder)
    await page.getByTestId('load-select').selectOption({ index: 1 });

    // Assert scope restored from saved version
    await expect(page.getByLabel('Scope')).toHaveValue('Load scope');
  });
});
