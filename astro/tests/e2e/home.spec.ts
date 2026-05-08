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

test('/ preloads first splash image', async ({ page }) => {
  await page.goto('/');
  const preload = await page.locator('link[rel="preload"][as="image"]').count();
  expect(preload).toBeGreaterThanOrEqual(1);
});
