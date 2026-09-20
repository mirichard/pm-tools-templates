import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('principle worksheet supports complete, partial, mobile, and reset journeys', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve('../docs/principles/self-assessment.html')).href);
  await expect(page.getByRole('combobox')).toHaveCount(30);
  await expect(page.getByRole('status')).toContainText('0/30 rated');
  await page.getByRole('combobox').evaluateAll(nodes => {
    for (const node of nodes) (node as HTMLSelectElement).value = '3';
    nodes[0].dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByRole('status')).toContainText('3.0 / 5');
  await expect(page.getByRole('progressbar')).toHaveCount(10);
  await page.getByRole('combobox').first().selectOption('');
  await expect(page.getByRole('status')).toContainText('29/30 rated — overall score incomplete');
  await page.getByRole('combobox').first().selectOption('1');
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.getByRole('heading', { name: 'Your alignment profile' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('principles-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('heading', { name: 'Your alignment profile' }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('principles-mobile.png') });
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Clear responses' }).click();
  await expect(page.getByRole('status')).toContainText('0/30 rated');
  expect(errors).toEqual([]);
});
