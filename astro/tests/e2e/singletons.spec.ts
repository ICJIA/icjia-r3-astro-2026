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

test('/eligibility/ embeds the ArcGIS storymap iframe (lazy)', async ({ page }) => {
  await page.goto('/eligibility/');
  // Scope to the MapEmbed section to avoid a second ArcGIS iframe in the Strapi body markdown.
  const iframe = page.locator('section.map-embed iframe[src*="storymaps.arcgis.com"]');
  await expect(iframe).toHaveAttribute('loading', 'lazy');
  await expect(iframe).toHaveAttribute('title', /Interactive StoryMap/i);
});
