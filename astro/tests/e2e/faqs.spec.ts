import { test, expect } from '@playwright/test';

test('/faqs/ renders the Strapi pages.faqs body via catch-all', async ({ page }) => {
  const response = await page.goto('/faqs/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/FAQs/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Body content should be present (rendered from the Strapi pages.faqs row)
  const main = page.locator('main');
  const hasContent = await main.textContent();
  expect(hasContent && hasContent.length > 100).toBe(true);
});
