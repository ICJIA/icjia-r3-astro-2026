// astro/tests/e2e/funding-redirect.spec.ts
//
// r3.illinois.gov has no /funding/ content page — it is a meta-refresh
// redirect to the homepage. The Astro build reproduces that exactly via the
// astro.config.ts `redirects` entry. This guards that parity behaviour so a
// future change can't silently turn /funding/ back into a content page.

import { test, expect } from '@playwright/test';

test('/funding/ redirects to the homepage', async ({ page }) => {
  await page.goto('/funding/');
  // The meta-refresh has a 0s delay; Playwright follows it.
  await page.waitForURL((url) => url.pathname === '/', { timeout: 5000 });
  expect(new URL(page.url()).pathname).toBe('/');
});

test('/funding/ is a redirect, not a content page (matches live)', async ({ request }) => {
  // `maxRedirects: 0` so we inspect /funding/ itself, not whatever it lands on.
  const r = await request.get('/funding/', { maxRedirects: 0 });
  if (r.status() >= 300 && r.status() < 400) {
    // `astro dev` serves it as an HTTP redirect to the homepage.
    expect(r.headers()['location']).toMatch(/^\/(\?|$)/);
  } else {
    // The static build (what ships) emits a meta-refresh HTML page to /.
    expect(r.status()).toBe(200);
    const html = await r.text();
    expect(html).toMatch(/http-equiv="refresh"/i);
    expect(html).toMatch(/url=\//i);
  }
  // Either way, /funding/ must NOT be a content page.
  if (r.status() === 200) {
    expect(await r.text()).not.toMatch(/<h1[^>]*>\s*Funding/i);
  }
});
