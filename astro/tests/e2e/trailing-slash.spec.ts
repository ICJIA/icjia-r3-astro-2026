// astro/tests/e2e/trailing-slash.spec.ts
//
// The site is `trailingSlash: 'always'`. Every internal link the site renders
// must end in `/` — a non-slash internal link 404s on `astro dev` and forces a
// needless 301 hop in production. This guards both component-rendered links
// (e.g. HomePhotoBoxes once shipped bare `/eligibility` hrefs) and Strapi-body
// content links (normalized by markdown.ts).

import { test, expect } from '@playwright/test';

const PAGES = ['/', '/eligibility/', '/news/', '/resources/'];

for (const path of PAGES) {
  test(`internal links on ${path} end with a trailing slash`, async ({ page }) => {
    await page.goto(path);
    const bad = await page.$$eval('a[href]', (anchors) =>
      anchors
        .map((a) => a.getAttribute('href') || '')
        // internal route paths only (start with /, then a path char — not //)
        .filter((h) => /^\/[a-z0-9]/i.test(h))
        // skip fragment / query links and file links (e.g. /favicon.ico)
        .filter((h) => !h.includes('#') && !h.includes('?'))
        .filter((h) => !/\.[a-z0-9]+$/i.test(h))
        // the offenders: internal route paths with no trailing slash
        .filter((h) => !h.endsWith('/')),
    );
    expect(bad, `non-slash internal links on ${path}: ${bad.join(', ')}`).toEqual([]);
  });
}
