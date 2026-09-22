const { test, expect } = require('@playwright/test');

test('dashboard loads its assets and supports filter reset', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });

  await page.goto('/');
  await expect(page).toHaveTitle('PMO Dashboard');
  await expect(page.getByText('Portfolio Summary', { exact: true })).toBeVisible();
  await expect(page.getByText('📊 Performance Metrics', { exact: true })).toBeVisible();
  const filter = page.getByRole('checkbox').first();
  await filter.check();
  await expect(filter).toBeChecked();
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await expect(filter).not.toBeChecked();
  await expect(page.getByRole('status')).toHaveText('Filters have been reset to default');
  expect(errors).toEqual([]);
});
