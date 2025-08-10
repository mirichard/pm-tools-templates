import { test, expect } from '@playwright/test';

async function fillByLabel(page, label: string, value: string) {
  await page.getByLabel(label).fill(value);
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
    await page.getByLabel('Impact').selectOption('High');
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
    await page.getByLabel('frequency').selectOption('Weekly');
    await page.getByLabel('channel').selectOption('Email');
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
    await page.getByLabel('Overall Health').selectOption('Green');
    await page.getByLabel('Schedule').selectOption('On Track');
    await page.getByLabel('Budget').selectOption('On Track');
    await page.getByLabel('Scope').selectOption('On Track');
    await page.screenshot({ path: 'test-results/executive-preview.png' });
  });
});
