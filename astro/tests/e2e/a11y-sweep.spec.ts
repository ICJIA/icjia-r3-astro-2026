// astro/tests/e2e/a11y-sweep.spec.ts
//
// Sitemap-driven axe-core sweep. Reads every URL out of the built
// `dist/sitemap-0.xml` and audits each one against WCAG 2.1 A/AA across the
// three viewport projects — hard-fail on any violation. New routes are picked
// up automatically. /404/ is added explicitly (it ships but is sitemap-
// excluded). Falls back to a core route list if the build output is absent.

import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function routesFromSitemap(): string[] {
  try {
    const xml = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
    const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    );
    if (!routes.includes('/404/')) routes.push('/404/');
    return [...new Set(routes)].sort();
  } catch {
    return ['/', '/contact/', '/news/', '/eligibility/', '/research/', '/404/'];
  }
}

const ROUTES = routesFromSitemap();

for (const route of ROUTES) {
  test(`axe-core AA: ${route}`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    if (result.violations.length > 0) {
      console.log(JSON.stringify(result.violations, null, 2));
    }
    expect(result.violations).toHaveLength(0);
  });
}
