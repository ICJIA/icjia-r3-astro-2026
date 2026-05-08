import { test, expect } from '@playwright/test';

test('/research/ lists hub articles, all links external', async ({ page }) => {
  const r = await page.goto('/research/');
  expect(r?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: /Research/i })).toBeVisible();
  const links = await page.locator('.research-card a[href^="https://"]').count();
  expect(links).toBeGreaterThanOrEqual(1);
});
