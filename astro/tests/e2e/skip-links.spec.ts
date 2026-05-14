// astro/tests/e2e/skip-links.spec.ts
//
// Regression guard: the Dialog island must not disturb the skip links.
// Dialog.vue once wrapped its <dialog> in <Teleport to="body">, which
// mishydrated under Astro's client:idle island boundary and destroyed the
// skip-links <nav> entirely (WCAG 2.4.1 Bypass Blocks, Level A — site-wide).
// axe-core and Lighthouse miss this because they run before client:idle
// fires, so this test explicitly waits past hydration before asserting.

import { test, expect, type Page } from '@playwright/test';

// Every page shares BaseLayout + the Dialog island, so a reintroduced bug
// would hit all of them. These four span the layout variants.
const ROUTES = ['/', '/contact/', '/news/', '/eligibility/'];

async function waitPastIdleHydration(page: Page): Promise<void> {
  // page.goto already waited for `load`. client:idle hydrates via
  // requestIdleCallback, so queue our own (with a timeout, so it still
  // fires on pages that never go network-idle — e.g. /eligibility/'s
  // ArcGIS iframe) and flush a frame so Vue's mount lands before we assert.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const flush = () => requestAnimationFrame(() => resolve());
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(flush, { timeout: 2000 });
        } else {
          setTimeout(flush, 300);
        }
      }),
  );
}

for (const route of ROUTES) {
  test(`skip links survive Dialog hydration on ${route}`, async ({ page }) => {
    await page.goto(route);
    await waitPastIdleHydration(page);

    // Both skip links still present, with the expected targets...
    const skipLinks = page.locator('nav.skip-links a.skip-link');
    await expect(skipLinks).toHaveCount(2);
    await expect(skipLinks.nth(0)).toHaveAttribute('href', '#main-content');
    await expect(skipLinks.nth(1)).toHaveAttribute('href', '#navigation');

    // ...and still the very first thing in the body.
    const firstChildIsSkipLinks = await page.evaluate(
      () => !!document.body.firstElementChild?.matches('nav.skip-links'),
    );
    expect(firstChildIsSkipLinks).toBe(true);
  });
}

test('first Tab lands on the skip-to-main link (post-hydration)', async ({ page }) => {
  await page.goto('/');
  await waitPastIdleHydration(page);
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => ({
    cls: document.activeElement?.className ?? '',
    text: document.activeElement?.textContent?.trim() ?? '',
  }));
  expect(focused.cls).toContain('skip-link');
  expect(focused.text).toBe('Skip to main content');
});
