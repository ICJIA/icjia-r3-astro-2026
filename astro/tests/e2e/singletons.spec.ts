import { test, expect } from '@playwright/test';

// /funding/ is intentionally absent — it is a meta-refresh redirect to / (it
// has no content page on the live site). See funding-redirect.spec.ts.
const ROUTES = ['/board/', '/collaboratives/', '/meetings/', '/eligibility/'];

for (const route of ROUTES) {
  test(`${route} renders correctly`, async ({ page }) => {
    const r = await page.goto(route);
    expect(r?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(new RegExp(`${route}$`));
  });
}

test('/eligibility/ embeds the ArcGIS storymap iframe', async ({ page }) => {
  await page.goto('/eligibility/');
  // The map iframe lives inside the Strapi `pages.eligibility` body markdown
  // (markdown.ts's ArcGIS iframe whitelist renders it) — exactly as the live
  // site does. No separate MapEmbed component is injected.
  const iframe = page.locator('iframe[src*="arcgis.com"]').first();
  await expect(iframe).toBeAttached();
  await expect(iframe).toHaveAttribute('title', /eligibility/i);
});
