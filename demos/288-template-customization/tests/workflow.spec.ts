import { test, expect } from '@playwright/test';

test('switching templates preserves the current draft', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Project Name').fill('Retain this draft');
  await page.getByRole('radio', { name: 'Sprint Planning' }).check();
  await page.getByRole('radio', { name: 'Project Charter' }).check();
  await expect(page.getByLabel('Project Name')).toHaveValue('Retain this draft');
});

test('Sprint goals support typed list editing', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'Sprint Planning' }).check();
  await page.getByRole('button', { name: 'Add goals item', exact: true }).click();
  await page.getByLabel('goals 1', { exact: true }).fill('Demonstrate the workflow');
  await expect(page.getByRole('region', { name: 'Live Preview' })).toContainText('Demonstrate the workflow');
});

test('malformed storage cannot crash or be silently overwritten', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pmtools:demo288:versions:charter', '{broken'));
  await page.goto('/');
  await expect(page.getByRole('alert').filter({ hasText: 'Saved versions' })).toBeVisible();
  await page.getByLabel('Version name').fill('Must not overwrite');
  await page.getByRole('button', { name: 'Save Version', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('pmtools:demo288:versions:charter'))).toBe('{broken');
});

test('failed saves provide recovery guidance without losing the draft', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
  });
  await page.goto('/');
  await page.getByLabel('Project Name').fill('Recoverable');
  await page.getByLabel('Version name').fill('V1');
  await page.getByRole('button', { name: 'Save Version', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'not saved' })).toBeVisible();
  await expect(page.getByLabel('Project Name')).toHaveValue('Recoverable');
});

const cases = [
  { key: 'charter', radio: 'Project Charter', fields: { 'Project Name': 'Community Review', Purpose: 'Review access', Scope: 'Three services' }, expected: ['# Community Review', 'Review access', 'Three services'] },
  { key: 'risk', radio: 'Risk Register', add: 'risks', fields: { Description: 'Records delayed', Probability: '0.4', impact: 'High', Owner: 'PM' }, expected: ['# Risk Register', 'Records delayed', '40%', 'High', 'PM'] },
  { key: 'stakeholder', radio: 'Stakeholder Plan', add: 'stakeholders', fields: { name: 'Director', role: 'Sponsor', frequency: 'Weekly', channel: 'Email' }, expected: ['# Stakeholder Communication Plan', 'Director', 'Sponsor', 'Weekly', 'Email'] },
  { key: 'sprint', radio: 'Sprint Planning', fields: { sprintName: 'First iteration', startDate: '10/05/2026', endDate: '10/23/2026' }, expected: ['# Sprint: First iteration', '10/05/2026', '10/23/2026'] },
  { key: 'executive', radio: 'Executive Status', fields: { 'Reporting Period': 'September', 'Overall Health': 'Green', Highlights: 'Review completed' }, expected: ['# Executive Status Report', 'September', 'Green', 'Review completed'] },
];

for (const scenario of cases) {
  test(`${scenario.key}: populated export and named version survive reload with isolation`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('radio', { name: scenario.radio, exact: true }).check();
    if (scenario.add) await page.getByRole('button', { name: `Add ${scenario.add} item`, exact: true }).click();
    for (const [label, value] of Object.entries(scenario.fields)) {
      const field = page.locator('form').getByLabel(label, { exact: false });
      if (['impact', 'frequency', 'channel', 'Overall Health'].includes(label)) await field.selectOption(value!);
      else await field.fill(value!);
    }
    await page.getByLabel('Version name').fill('Baseline');
    await page.getByRole('button', { name: 'Save Version', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Version saved in this browser.');
    const before = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Markdown' }).click();
    const download = await before;
    const { readFile } = await import('node:fs/promises');
    const text = await readFile((await download.path())!, 'utf8');
    expect(download.suggestedFilename()).toBe(`${scenario.key}.md`);
    for (const fragment of scenario.expected) expect(text).toContain(fragment);
    expect(text).not.toContain('DRAFT');
    await page.reload();
    await page.getByRole('radio', { name: scenario.radio, exact: true }).check();
    await page.getByLabel('Load version').selectOption({ label: 'Baseline' });
    const after = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Markdown' }).click();
    expect(await readFile((await (await after).path())!, 'utf8')).toBe(text);
    await page.getByRole('radio', { name: scenario.key === 'charter' ? 'Executive Status' : 'Project Charter', exact: true }).check();
    await expect(page.getByLabel('Load version').locator('option')).toHaveCount(1);
  });
}

test('loading an incomplete saved version recomputes validation and labels export as draft', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pmtools:demo288:versions:charter', JSON.stringify([{ name: 'Incomplete', data: { projectName: 'Draft only' }, createdAt: 1 }])));
  await page.goto('/');
  await page.getByLabel('Purpose').fill('Complete purpose');
  await page.getByLabel('Scope', { exact: false }).fill('Complete scope');
  page.once('dialog', dialog => dialog.accept());
  await page.getByLabel('Load version').selectOption({ label: 'Incomplete' });
  await expect(page.getByLabel('Purpose')).toHaveAttribute('aria-invalid', 'true');
  const result = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Markdown' }).click();
  const { readFile } = await import('node:fs/promises');
  expect(await readFile((await (await result).path())!, 'utf8')).toContain('DRAFT');
});

for (const stored of ['{}', '[null]', '[{"name":"Bad","createdAt":1,"data":{"goals":"not an array"}}]']) {
  test(`invalid saved data is rejected: ${stored}`, async ({ page }) => {
    await page.addInitScript(raw => localStorage.setItem('pmtools:demo288:versions:sprint', raw), stored);
    await page.goto('/');
    await page.getByRole('radio', { name: 'Sprint Planning' }).check();
    await expect(page.getByRole('alert').filter({ hasText: 'Saved versions' })).toBeVisible();
    await expect(page.getByLabel('Load version').locator('option')).toHaveCount(1);
  });
}

test('unavailable storage leaves editing and export usable', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.getItem = () => { throw new DOMException('Denied', 'SecurityError'); }; });
  await page.goto('/');
  await expect(page.getByRole('alert').filter({ hasText: 'Saved versions' })).toBeVisible();
  await page.getByLabel('Project Name').fill('Offline draft');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Markdown' }).click();
  expect((await download).suggestedFilename()).toBe('charter.md');
});

test('list item removal and numeric values remain typed in saved data', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'Sprint Planning' }).check();
  await page.getByRole('button', { name: 'Add goals item', exact: true }).click();
  await page.getByLabel('goals 1', { exact: true }).fill('Retained goal');
  await page.getByRole('button', { name: 'Add goals item', exact: true }).click();
  await page.getByRole('button', { name: 'Remove last goals item', exact: true }).click();
  await page.getByRole('button', { name: 'Add stories item', exact: true }).click();
  await page.getByLabel('title').fill('Deliver increment');
  await page.getByLabel('estimate').fill('3');
  await page.getByLabel('Version name').fill('Typed');
  await page.getByRole('button', { name: 'Save Version', exact: true }).click();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pmtools:demo288:versions:sprint')!));
  expect(stored[0].data.goals).toEqual(['Retained goal']);
  expect(stored[0].data.stories[0].estimate).toBe(3);
});

test('canceling a load retains edits and retry recovers a failed save', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Project Name').fill('Saved');
  await page.getByLabel('Version name').fill('V1');
  await page.getByRole('button', { name: 'Save Version', exact: true }).click();
  await page.getByLabel('Project Name').fill('Edited');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByLabel('Load version').selectOption({ label: 'V1' });
  await expect(page.getByLabel('Project Name')).toHaveValue('Edited');
  // Simulate corruption after initial load; a later save must re-read, not overwrite.
  await page.evaluate(() => localStorage.setItem('pmtools:demo288:versions:charter', '{broken'));
  await page.getByLabel('Version name').fill('V2');
  await page.getByRole('button', { name: 'Save Version', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('not saved');
  expect(await page.evaluate(() => localStorage.getItem('pmtools:demo288:versions:charter'))).toBe('{broken');
  // Simulate explicit external repair; the application never clears it automatically.
  await page.evaluate(() => localStorage.setItem('pmtools:demo288:versions:charter', '[]'));
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await page.getByRole('button', { name: 'Save Version', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Version saved');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Markdown' }).click();
  const { readFile } = await import('node:fs/promises');
  expect(await readFile((await (await pending).path())!, 'utf8')).toContain('# Edited');
});
