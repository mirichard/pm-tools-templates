import { test, expect } from '@playwright/test';

async function fillByLabel(page, label: string, value: string) {
  let loc = page.getByLabel(label, { exact: true }).first();
  if (await loc.count() === 0) {
    loc = page.getByLabel(new RegExp(label, 'i')).first();
  }
  if (await loc.count() === 0) {
    loc = page.getByPlaceholder(new RegExp(label, 'i')).first();
  }
  await loc.fill(value);
}

async function selectByLabel(page, label: string, option: string) {
  let loc = page.getByLabel(label, { exact: true }).first();
  if (await loc.count() === 0) {
    loc = page.getByLabel(new RegExp(label, 'i')).first();
  }
  await loc.selectOption(option);
}

test.describe('UAT - Template Customization MVP', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Project Charter: edit, save versions, diff, download', async ({ page, context }) => {
    await page.getByLabel('Template').getByText('Project Charter').click();
    await fillByLabel(page, 'Project Name', 'UAT Charter');
    await fillByLabel(page, 'Sponsor', 'Executive Sponsor');
    await fillByLabel(page, 'Purpose', 'Validate MVP charter editing.');
    await fillByLabel(page, 'Scope', 'MVP scope only.');
    await fillByLabel(page, 'Success Criteria', 'All acceptance criteria met.');

    // Save V1
    await page.getByLabel('Version name').fill('V1');
    await page.getByRole('button', { name: 'Save Version' }).click();

    // Change and Save V2
    await fillByLabel(page, 'Scope', 'MVP scope and UAT validation.');
    await page.getByLabel('Version name').fill('V2');
    await page.getByRole('button', { name: 'Save Version' }).click();

    // Diff V1 vs V2
    await page.getByLabel('Diff A').selectOption({ index: 1 });
    await page.getByLabel('Diff B').selectOption({ index: 2 });
    await page.getByRole('button', { name: 'Show Diff' }).click();
    await page.screenshot({ path: 'test-results/charter-diff.png' });

    // Download
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Download Markdown' }).click(),
    ]);
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('Risk Register: add one risk and preview', async ({ page }) => {
    await page.getByLabel('Template').getByText('Risk Register').click();
    await page.getByRole('button', { name: 'Add Item' }).click();
    await fillByLabel(page, 'ID', 'R-1');
    await fillByLabel(page, 'Description', 'API rate limiting');
    await page.getByLabel('Probability').fill('0.5');
    await selectByLabel(page, 'Impact', 'High');
    await fillByLabel(page, 'Mitigation', 'Implement retries and backoff');
    await fillByLabel(page, 'Owner', 'Infra Team');
    await page.screenshot({ path: 'test-results/risk-preview.png' });
  });

  test('Stakeholder Plan: add one stakeholder', async ({ page }) => {
    await page.getByLabel('Template').getByText('Stakeholder Plan').click();
    await page.getByRole('button', { name: 'Add Item' }).click();
    await fillByLabel(page, 'name', 'CTO');
    await fillByLabel(page, 'role', 'Executive');
    await fillByLabel(page, 'contact', 'cto@example.com');
    await fillByLabel(page, 'Information Needs', 'Weekly status');
    await selectByLabel(page, 'frequency', 'Weekly');
    await selectByLabel(page, 'channel', 'Email');
    await page.screenshot({ path: 'test-results/stakeholder-preview.png' });
  });

  test('Sprint Planning and Executive Status basic fields', async ({ page }) => {
    await page.getByLabel('Template').getByText('Sprint Planning').click();
    await fillByLabel(page, 'sprintName', 'Sprint 1');
    await fillByLabel(page, 'startDate', '2025-08-01');
    await fillByLabel(page, 'endDate', '2025-08-15');
    await page.screenshot({ path: 'test-results/sprint-preview.png' });

    await page.getByLabel('Template').getByText('Executive Status').click();
    await fillByLabel(page, 'Reporting Period', 'Aug 2025');
    await page.getByRole('combobox', { name: /overall health/i }).selectOption('Green');
    await page.getByRole('combobox', { name: /schedule/i }).selectOption('On Track');
    await page.getByRole('combobox', { name: /budget/i }).selectOption('On Track');
    await page.getByRole('combobox', { name: /scope/i }).selectOption('On Track');
    await page.screenshot({ path: 'test-results/executive-preview.png' });
  });
});
