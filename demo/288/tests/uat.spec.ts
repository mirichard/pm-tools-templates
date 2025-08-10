import { test, expect } from '@playwright/test';

async function fillByLabel(page: any, label: string, value: string) { await page.getByLabel(label).fill(value); }

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5181/';

test.describe('UAT - Epic 288 Demo', () => {
  test('Charter flow: edit, save versions, diff, download', async ({ page }) => {
    await page.goto(BASE);
    await page.getByLabel('Template').getByText('Project Charter').click();
    await fillByLabel(page, 'Project Name', 'Demo Charter');
    await fillByLabel(page, 'Sponsor', 'Sponsor X');
    await fillByLabel(page, 'Purpose', 'Demo purpose');
    await fillByLabel(page, 'Scope', 'Demo scope');
    await fillByLabel(page, 'Success Criteria', 'Success X');
    await page.getByLabel('Version name').fill('V1');
    await page.getByRole('button', { name: 'Save Version' }).click();
    await fillByLabel(page, 'Scope', 'Demo scope updated');
    await page.getByLabel('Version name').fill('V2');
    await page.getByRole('button', { name: 'Save Version' }).click();
    await page.getByLabel('Diff A').selectOption({ index: 1 });
    await page.getByLabel('Diff B').selectOption({ index: 2 });
    await page.getByRole('button', { name: 'Show Diff' }).click();
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Download Markdown' }).click(),
    ]);
    const path = await download.path();
    expect(path).toBeTruthy();
  });
});
