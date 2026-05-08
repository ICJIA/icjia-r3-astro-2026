import { test, expect } from '@playwright/test';

test('/resources/ list renders', async ({ page }) => {
  const r = await page.goto('/resources/');
  expect(r?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: /Resources/i })).toBeVisible();
});

test('/resources/<slug>/ detail renders', async ({ page }) => {
  const r = await page.goto('/resources/spanish-language-materials/');
  expect(r?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('/resources/single-page/ renders all resources stacked', async ({ page }) => {
  const r = await page.goto('/resources/single-page/');
  expect(r?.status()).toBe(200);
  // multiple h2s expected (one per resource)
  expect(await page.getByRole('heading', { level: 2 }).count()).toBeGreaterThanOrEqual(2);
});
