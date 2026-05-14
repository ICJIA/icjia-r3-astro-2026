import { test, expect } from '@playwright/test';

test('/ renders homepage hero + director letter + news', async ({ page }) => {
  const r = await page.goto('/');
  expect(r?.status()).toBe(200);
  await expect(page).toHaveTitle(/R3/);
  await expect(page.locator('.splash-card').first()).toBeVisible();
  // Director letter heading is the most reliable prose anchor
  await expect(page.getByRole('heading', { name: /Letter From the Director/i })).toBeVisible();
  // News & Updates heading
  await expect(page.getByRole('heading', { name: /News/i })).toBeVisible();
});

test('/ first splash image is a high-priority, locally-optimized LCP image', async ({ page }) => {
  await page.goto('/');
  // The first splash image is the LCP element. It must load eagerly at high
  // priority, and — since Phase 7 — be a build-time Astro <Image> webp served
  // from /_astro/ rather than a runtime fetch from the Strapi media host.
  const firstSplashImg = page.locator('.splash-card').first().locator('img.splash-card__img');
  await expect(firstSplashImg).toHaveAttribute('loading', 'eager');
  await expect(firstSplashImg).toHaveAttribute('fetchpriority', 'high');
  await expect(firstSplashImg).toHaveAttribute('src', /^\/_astro\/.*\.webp$/);
});
