import { test, expect } from '@playwright/test';

test('/contact/ renders the custom contact page', async ({ page }) => {
  const response = await page.goto('/contact/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Contact/);
  await expect(page.getByRole('heading', { level: 1, name: /Contact R3/i })).toBeVisible();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toMatch(/\/contact\/$/);
});

test('/contact/ shows the R3 email card and the contact form', async ({ page }) => {
  await page.goto('/contact/');
  await expect(
    page.getByRole('link', { name: 'CJA.R3Questions@illinois.gov' }),
  ).toBeVisible();
  for (const id of [
    '#contact-firstname',
    '#contact-lastname',
    '#contact-email',
    '#contact-phone',
    '#contact-message',
  ]) {
    await expect(page.locator(id)).toBeVisible();
  }
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();
});

test('/contact/ form validates required fields (island hydrated)', async ({ page }) => {
  await page.goto('/contact/');
  // Wait for the client:load island JS to settle before interacting.
  await page.waitForLoadState('networkidle');
  const firstname = page.locator('#contact-firstname');
  await firstname.fill('temp');
  await firstname.fill('');
  await firstname.blur();
  // The @blur handler runs validate('firstname') → required-field error appears.
  await expect(page.locator('#contact-firstname-error')).toBeVisible();
  await expect(page.locator('#contact-firstname-error')).toHaveText(/required/i);
});
