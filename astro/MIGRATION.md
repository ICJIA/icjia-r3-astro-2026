# R3 Astro Migration Notes

Working notes, baselines, and per-phase verification results for the
Nuxt → Astro 6 migration. Companion to `astro/CHANGELOG.md`.

---

## Phase 0 baseline — Nuxt prod build

Captured 2026-05-08 against `yarn generate && npx serve .output/public -l 8001` (Nuxt static server, captured locally), lightcap mobile preset.

Lightcap: @icjia/lightcap v0.1.5 / Lighthouse v13 / Node v22.22.2 / darwin arm64

| Route | Perf | A11y | BP | SEO | Notes |
|---|---:|---:|---:|---:|---|
| `/` | 65 | 100 | 100 | 100 | FCP 3.8s, LCP 7.5s |
| `/eligibility/` | 52 | 100 | 96 | 100 | FCP 5.9s, LCP 6.0s, CLS 0.22 |
| `/contact/` | 93 | 100 | 100 | 100 | FCP 2.4s (LCP = FCP) |
| `/collaboratives/` | 60 | 100 | 100 | 100 | FCP 5.7s, LCP 5.7s, CLS 0.13 |
| `/board/` | 84 | 100 | 100 | 100 | FCP 3.2s, LCP 3.2s, CLS 0.12 |
| `/faqs/` | 63 | 100 | 100 | 100 | FCP 5.7s, LCP 5.7s |
| `/funding/` | 65 | 100 | 100 | 100 | Redirects to `/` via meta-refresh; scores reflect homepage |
| `/meetings/` | 89 | 100 | 100 | 100 | FCP 2.9s, LCP 2.9s |
| `/privacy/` | 88 | 100 | 100 | 100 | FCP 2.9s, LCP 3.0s |
| `/news/r3-2022-annual-report/` | 88 | 100 | 100 | 100 | FCP 2.9s, LCP 3.0s |
| `/news/2023-04-06-annual-report-2023/` | 85 | 100 | 100 | 100 | FCP 3.2s, LCP 3.3s |
| `/news/r3-2021-annual-report/` | 88 | 100 | 100 | 100 | FCP 2.9s, LCP 3.0s |
| `/news/2021-01-21-release/` | 88 | 100 | 100 | 100 | FCP 2.9s, LCP 2.9s |
| `/news/2022-06-23-r3-grants-list/` | 81 | 100 | 100 | 100 | FCP 3.2s, LCP 3.3s, CLS 0.13 |
| `/news/icjia-awards-35-million-in-restore-reinvest-and-renew-r3-program-grants/` | 58 | 100 | 100 | 100 | FCP 5.9s, LCP 7.7s, CLS 0.11; large unoptimized image |
| `/news/lend-us-your-expertise-become-a-grant-application-reviewer/` | 90 | 100 | 100 | 100 | FCP 2.9s, LCP 2.9s |
| `/news/restore-reinvest-renew-r3-program-grants-apply-now/` | 84 | 100 | 100 | 100 | FCP 3.3s, LCP 3.3s |
| `/resources/spanish-language-materials/` | 89 | 100 | 100 | 100 | FCP 2.9s, LCP 3.0s |
| `/resources/video-resources/` | 86 | 100 | 100 | 100 | FCP 2.9s, LCP 3.0s, CLS 0.11 |
| `/resources/ampli-fund-portal-guide-and-tip-sheet/` | 88 | 100 | 100 | 100 | FCP 2.9s, LCP 3.0s |
| `/resources/prequalification-steps/` | 57 | 100 | 100 | 100 | FCP 5.7s, LCP 5.7s, CLS 0.17 |
| `/search/` | 93 | 100 | 100 | 100 | FCP 2.6s, LCP 2.6s |
| `/translate/` | 91 | 100 | 100 | 100 | FCP 2.6s, LCP 2.7s |
| `/resources/` | 72 | 100 | 100 | 100 | FCP 2.7s, LCP 6.2s |
| `/resources/single-page/` | 87 | 100 | 100 | 100 | FCP 3.0s, LCP 3.0s |

## Summary

- **Accessibility:** 100 across all 25 routes — perfect baseline.
- **Best Practices:** 100 on 24/25 routes; `/eligibility/` scores 96 (Chrome DevTools Issues panel warnings).
- **SEO:** 100 across all 25 routes.
- **Performance:** Ranges from 52–93. Heavy pages (`/`, `/eligibility/`, `/collaboratives/`, `/faqs/`, `/funding/`→`/`) score 52–65 due to render-blocking resources (~3,450 ms savings available) and large LCP images (7–8s). Lighter content pages typically score 81–93. Outliers include the grants-announcement news post (58 — large unoptimized image), `/resources/prequalification-steps/` (57), and the `/resources/` index (72). These three are candidate Phase 7 perf-polish targets along with the heavier pages above.

## Known Issues for Astro Migration to Address

- **Render-blocking resources:** Up to 3,450 ms penalty on Vuetify-heavy pages — main target for Astro SSG improvement.
- **Cache policy:** ~828–1,163 KiB uncached assets on every page.
- **CLS:** Several pages show CLS 0.11–0.22 (eligibility worst at 0.22).
- **LCP images:** Homepage hero and grants news post have LCP >7s on mobile.
- **`/funding/` redirect:** This route uses a `<meta http-equiv="refresh">` to redirect to `/`; no dedicated content page exists in the static output.

## axe-core baseline

Captured 2026-05-08 via `yarn audit:a11y`.

Static server (`npx serve .output/public -l 8000`) used; sitemap copied from `.output/public/sitemap.xml` to `public/sitemap.xml` so the script could locate it. axe-core 4.11.0.

- Total pages tested: 28 (all sitemap URLs; includes `/404`, `/research`, `/news` index not in the 25-route Lightcap table)
- Viewports per page: 3 (desktop 1920×1080, tablet 768×1024, mobile 375×812)
- Total individual checks run: 7,588 (violations + passes + incomplete + inapplicable across all 84 test runs)
- Total passes: 3,351
- Violations found: 3 (all on `/404`, same rule across 3 viewports — target: fix before Astro launch)
- Incomplete (needs review) + inapplicable (rule did not apply): 4,234 combined

### Violation detail

| Rule | Page | Severity | Tag | Description |
|---|---|---|---|---|
| `page-has-heading-one` | `/404` × 3 viewports | moderate | best-practice | 404 page lacks an `<h1>` heading |

**Note:** `page-has-heading-one` is tagged `best-practice` (not WCAG A or AA), so it does not affect WCAG 2.1 AA / IITAA / ADA Title II conformance. It is a pre-existing issue to carry forward as a known fix target in the Astro migration. All 27 non-404 pages pass with 0 violations. Auto-fixed by Phase 4h.1 (`404.astro` includes `<h1>`).

## Tooling gotchas

Documented quirks contributors will hit. Living list — append as discovered.

- **`yarn check` is shadowed by Yarn 1's lockfile-integrity command.** Always
  invoke the Astro type-checker as `yarn run check` (or run the two underlying
  commands directly: `yarn run astro sync && yarn run astro check`). The `check` script in `astro/package.json` is correctly
  defined; Yarn 1's CLI just intercepts the bare `yarn check` form. This is
  Yarn 1 behavior — Yarn 2+ doesn't have this issue.
