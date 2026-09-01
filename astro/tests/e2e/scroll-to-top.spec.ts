// astro/tests/e2e/scroll-to-top.spec.ts
//
// Regression guard: the scroll-to-top arrow must sit in the middle of its
// circle. The button is built in BaseLayout's inline script with
// `display:inline-flex`, but for a long time it set no `align-items` /
// `justify-content`. A flex container defaults to `flex-start` on the main
// axis and `stretch` on the cross axis, so the ↑ text node landed at the
// top-left of the 48px circle — measured 14.6px left and 6px above centre.
// UA `text-align: center` does not rescue this: the anonymous flex item is
// sized to its content, so there is no slack for text-align to distribute.
//
// This asserts geometry rather than CSS declarations, so it also catches a
// future regression arriving by some other route (padding, line-height, a
// swap to an <svg> icon).

import { test, expect } from '@playwright/test';

// The button comes from BaseLayout, so every route shares it. These span the
// layout variants, matching the routes skip-links.spec.ts guards.
const ROUTES = ['/', '/contact/', '/news/', '/eligibility/'];

// Generous next to the 14.6px/6px failure, tight enough that any real
// off-centring trips it. Sub-pixel drift is expected from font metrics.
const TOLERANCE_PX = 1.5;

// Mirrors SHOW_AFTER in BaseLayout: the button stays display:none until the
// page has scrolled this far, which also keeps it out of the a11y tree.
const SHOW_AFTER_PX = 400;

for (const route of ROUTES) {
  test(`scroll-to-top arrow is centred in its circle on ${route}`, async ({ page }) => {
    await page.goto(route);

    // A page shorter than SHOW_AFTER never reveals the button at all, and
    // correctly so — /contact/ has only 366px of scroll at tablet height.
    // Skip rather than fail, so the check stays honest about what it covers
    // instead of quietly asserting nothing.
    const maxScroll = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    test.skip(
      maxScroll <= SHOW_AFTER_PX,
      `page scrolls only ${maxScroll}px, under the ${SHOW_AFTER_PX}px reveal threshold`,
    );

    await page.evaluate(() => window.scrollTo(0, 900));
    const btn = page.getByRole('button', { name: 'Scroll to top' });
    await expect(btn).toBeVisible();

    const offset = await page.evaluate(() => {
      const el = document.querySelector('button[aria-label="Scroll to top"]')!;
      const box = el.getBoundingClientRect();
      // Range over the contents measures the glyph box itself; the element
      // box would just re-measure the circle and always look centred.
      const range = document.createRange();
      range.selectNodeContents(el);
      const glyph = range.getBoundingClientRect();
      return {
        dx: glyph.x + glyph.width / 2 - (box.x + box.width / 2),
        dy: glyph.y + glyph.height / 2 - (box.y + box.height / 2),
        glyphWidth: glyph.width,
      };
    });

    // Guard against a zero-size glyph box making the centring check vacuous.
    expect(offset.glyphWidth).toBeGreaterThan(0);
    expect(Math.abs(offset.dx)).toBeLessThanOrEqual(TOLERANCE_PX);
    expect(Math.abs(offset.dy)).toBeLessThanOrEqual(TOLERANCE_PX);
  });
}
