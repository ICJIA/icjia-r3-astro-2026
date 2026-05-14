// astro/tests/e2e/plausible.spec.ts
//
// Regression guard against the same bug the i2i Astro build silently has
// (preconnect present, <script> tag missing). This test confirms that
// loading any route fires a network request to plausible.icjia.cloud.

import { test, expect } from '@playwright/test';

const SAMPLE_ROUTES = ['/', '/contact/', '/news/', '/faqs/'];

for (const route of SAMPLE_ROUTES) {
  test(`Plausible script loads on ${route}`, async ({ page }) => {
    let plausibleHit = false;
    page.on('request', (req) => {
      const u = req.url();
      if (u.startsWith('https://plausible.icjia.cloud/') && u.endsWith('/script.js')) {
        plausibleHit = true;
      }
    });
    await page.goto(route);
    // Plausible is `defer` so allow a beat for it to fire
    await page.waitForLoadState('networkidle', { timeout: 10_000 });
    expect(plausibleHit).toBe(true);
  });
}

test('Plausible preconnect is present', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('link[rel="preconnect"][href="https://plausible.icjia.cloud"]');
  await expect(link).toHaveCount(1);
});

test('Plausible script tag is present (not just preconnect)', async ({ page }) => {
  await page.goto('/');
  const tag = page.locator('script[src="https://plausible.icjia.cloud/js/script.js"]');
  await expect(tag).toHaveCount(1);
  await expect(tag).toHaveAttribute('data-domain', 'r3.illinois.gov');
  await expect(tag).toHaveAttribute('defer', '');
});
