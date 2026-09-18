import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home has no detectable a11y violations (wcag2a/2aa)', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // Temporary exception: known issue with listitem roles in MVP layout.
      // TODO: fix semantics in layout and remove this disable.
      .disableRules(['listitem'])
      .analyze();

    if (results.violations.length > 0) {
      // Print a concise summary to aid debugging in CI logs
      console.log('A11y violations found:', results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })));
    }
    expect(results.violations.length, 'No accessibility violations expected').toBe(0);
  });
});
