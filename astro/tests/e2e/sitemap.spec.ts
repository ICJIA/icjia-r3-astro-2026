// astro/tests/e2e/sitemap.spec.ts
//
// Regression coverage for the @astrojs/sitemap integration: the index
// resolves, every emitted URL is trailing-slash canonical, and the
// non-content routes (sandbox/preview/translate/404) plus the noindex
// printable view (/resources/single-page/) stay out of it.

import { test, expect } from '@playwright/test';

test('/sitemap-index.xml resolves and points at sitemap-0.xml', async ({ request }) => {
  const r = await request.get('/sitemap-index.xml');
  expect(r.status()).toBe(200);
  const xml = await r.text();
  expect(xml).toContain('sitemap-0.xml');
});

test('every URL in sitemap-0.xml has a trailing slash', async ({ request }) => {
  const r = await request.get('/sitemap-0.xml');
  expect(r.status()).toBe(200);
  const xml = await r.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(urls.length).toBeGreaterThan(10);
  for (const u of urls) {
    expect(u).toMatch(/\/$/);
  }
});

test('sitemap excludes /sandbox /preview /translate /404 and the noindex single-page view', async ({ request }) => {
  const r = await request.get('/sitemap-0.xml');
  const xml = await r.text();
  expect(xml).not.toMatch(/\/sandbox\//);
  expect(xml).not.toMatch(/\/preview\//);
  expect(xml).not.toMatch(/\/translate\//);
  expect(xml).not.toMatch(/\/404\//);
  // noindex printable view (v1.0.10) — must render but stay out of the sitemap
  expect(xml).not.toMatch(/\/resources\/single-page\//);
});
