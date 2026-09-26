import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage passes axe WCAG2 A/AA', async ({ page }) => {
  await page.goto('http://127.0.0.1:5179/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a','wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const name of ['Project Charter', 'Risk Register', 'Stakeholder Plan', 'Sprint Planning', 'Executive Status']) {
  test(`${name}: narrow viewport and validation states are accessible`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('radio', { name, exact: true }).check();
    if (name === 'Risk Register') await page.getByRole('button', { name: 'Add risks item', exact: true }).click();
    if (name === 'Stakeholder Plan') await page.getByRole('button', { name: 'Add stakeholders item', exact: true }).click();
    if (name === 'Sprint Planning') await page.getByRole('button', { name: 'Add goals item', exact: true }).click();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('keyboard navigation reaches editing and download controls', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('radio', { name: 'Project Charter', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Download Markdown' })).toBeFocused();
  await page.getByLabel('Project Name').focus();
  await page.keyboard.type('Keyboard draft');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Sponsor')).toBeFocused();
});

test('storage recovery message and controls are accessible', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pmtools:demo288:versions:charter', 'null'));
  await page.goto('/');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
});
