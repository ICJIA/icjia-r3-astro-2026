import { test, expect } from '@playwright/test';

test('/contact/ renders the contact page', async ({ page }) => {
  const response = await page.goto('/contact/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Contact/);
  await expect(page.getByRole('heading', { level: 1, name: /Contact/i })).toBeVisible();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toMatch(/\/contact\/$/);
});
