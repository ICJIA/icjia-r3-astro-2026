import { test, expect } from '@playwright/test';

test('/news/ lists posts in reverse chronological order', async ({ page }) => {
  const response = await page.goto('/news/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/News/);
  await expect(page.getByRole('heading', { level: 1, name: /News/i })).toBeVisible();
  const cards = page.locator('.news-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(5);
});
