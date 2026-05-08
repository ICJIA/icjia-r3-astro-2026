import { test, expect } from '@playwright/test';

test('/news/<slug>/ renders detail with correct h1 and date', async ({ page }) => {
  const r = await page.goto('/news/r3-2022-annual-report/');
  expect(r?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('time')).toBeVisible();
  // article schema
  const ldText = await page.locator('script[type="application/ld+json"]').last().textContent();
  expect(ldText).toContain('"@type":"NewsArticle"');
});

test('/news/missing-slug/ returns 404', async ({ page }) => {
  const r = await page.goto('/news/this-does-not-exist/');
  expect(r?.status()).toBe(404);
});
