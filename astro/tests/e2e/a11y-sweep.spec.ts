// astro/tests/e2e/a11y-sweep.spec.ts
//
// Runs axe-core against every public route. Hard-fail on any AA violation.
// This is the test that replaces the current Nuxt audit-accessibility.js.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  '/', '/eligibility/', '/contact/', '/collaboratives/', '/board/', '/faqs/',
  '/funding/', '/meetings/', '/privacy/',
  '/news/', '/news/r3-2022-annual-report/',
  '/resources/', '/resources/spanish-language-materials/', '/resources/single-page/',
  '/research/', '/search/', '/translate/', '/404/',
];

for (const route of ROUTES) {
  test(`axe-core AA: ${route}`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    if (result.violations.length > 0) {
      console.log(JSON.stringify(result.violations, null, 2));
    }
    expect(result.violations).toHaveLength(0);
  });
}
