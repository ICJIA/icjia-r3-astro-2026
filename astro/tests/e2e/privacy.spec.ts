import { test, expect } from '@playwright/test';

test('/privacy/ renders the privacy page', async ({ page }) => {
  const response = await page.goto('/privacy/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Privacy/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
