import { test, expect } from '@playwright/test';

test('/search/ renders search UI', async ({ page }) => {
  const r = await page.goto('/search/');
  expect(r?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: /Search/i })).toBeVisible();
  await expect(page.locator('input[type="search"]')).toBeVisible();
});

test('typing a query produces matches', async ({ page }) => {
  await page.goto('/search/');
  // Wait for the index fetch to complete
  await expect(page.locator('text=/indexed pages/')).toBeVisible({ timeout: 10_000 });
  await page.locator('input[type="search"]').fill('R3');
  await expect(page.locator('.search__results li').first()).toBeVisible({ timeout: 5_000 });
});

test('filter chips narrow results', async ({ page }) => {
  await page.goto('/search/');
  await expect(page.locator('text=/indexed pages/')).toBeVisible({ timeout: 10_000 });
  await page.locator('input[type="search"]').fill('R3');
  // give Fuse a moment to compute
  await page.waitForTimeout(300);
  const totalBefore = await page.locator('.search__results li').count();
  await page.getByRole('button', { name: /^FAQs/ }).click();
  const totalAfter = await page.locator('.search__results li').count();
  expect(totalAfter).toBeLessThanOrEqual(totalBefore);
});
