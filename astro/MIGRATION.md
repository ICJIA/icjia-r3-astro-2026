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

## Strapi schema discovery (2026-05-08)

Endpoints introspected:
- `https://r3.icjia-api.cloud/graphql` (Strapi v4)
- `https://researchhub.icjia-api.cloud/graphql` (Research Hub — Strapi v3 / Apollo)

Introspection succeeded on both endpoints (not disabled in production).

| Local collection | GraphQL field | Source verified at |
|---|---|---|
| `pages` | `pages` | 2026-05-08 (Strapi) |
| `news` | `posts` | 2026-05-08 (Strapi) |
| `faqs` | `weeklyFaqs` | 2026-05-08 (Strapi) |
| `resources` | `resources` | 2026-05-08 (Strapi) |
| `hubArticles` | `articles` (filtered by `tags_contains: ["r3"]`) | 2026-05-08 (Research Hub) |

### Confirmed top-level Strapi collection fields

R3 Strapi (`https://r3.icjia-api.cloud/graphql`) exposes these content collections:
`faq` / `faqs`, `form` / `forms`, `page` / `pages`, `post` / `posts`, `resource` / `resources`, `v2Weeklyfaq` / `v2Weeklyfaqs` (legacy collection, confirmed empty), `weeklyFaq` / `weeklyFaqs`

Research Hub (`https://researchhub.icjia-api.cloud/graphql`) exposes:
`app` / `apps` / `appsConnection`, `article` / `articles` / `articlesConnection`, `dataset` / `datasets` / `datasetsConnection`

### Field shapes confirmed by live fetch (one-row sample)

**pages** (`pages(pagination: { limit: 1 }) { data { id attributes { ... } } }`):
`title`, `slug`, `section`, `summary`, `body`, `createdAt`, `updatedAt`, `publishedAt`, `hideFromSitemap`, `showTableOfContents`, `searchMeta`
Creator also uses: `hideFromSearch`, `isFullPage`

**posts** (news) (`posts(pagination: { limit: 1 }) { data { id attributes { ... } } }`):
`title`, `slug`, `section`, `summary`, `body`, `createdAt`, `updatedAt`, `publishedAt`, `hideFromSitemap`, `showTableOfContents`, `searchMeta`, `dateOverride`
Creator also uses: `hideFromSearch`

**weeklyFaqs** (`weeklyFaqs(pagination: { limit: 1 }) { data { ... } }`):
Returns empty array in current production data — collection exists but has no published records. Creator query uses:
`title`, `slug`, `week`, `summary`, `body`, `dateOverride`, `createdAt`, `updatedAt`, `attachmentHeading`, `attachment { data { id attributes { name hash ext url size createdAt updatedAt } } }`

**resources** (`resources(pagination: { limit: 1 }) { data { id attributes { ... } } }`):
`title`, `slug`, `summary`, `body`, `createdAt`, `updatedAt`, `publishedAt`, `hideFromSitemap`, `showTableOfContents`, `searchMeta`, `ranking`
Creator also uses: `hideFromSearch`, `cover { data { attributes { url formats name alternativeText caption width height ext size createdAt updatedAt } } }`

**articles** (Research Hub — Strapi v3, flat response, no `data[]` wrapper):
`_id`, `title`, `slug`, `date`, `tags`, `authors` (JSON scalar; parse post-fetch as `{ title: string; description: string }[]`), `abstract`
Note: `pubType`, `type`, `fileURL`, `ext` are NOT schema fields — they are computed and injected by `createHubArticles.js` after fetch.

### Field-name divergences from i2i

- **FAQs GQL field name:** R3 uses `weeklyFaqs` (not `faqs`). The `faqs` field exists in the schema but appears to be a different/unused collection. The actual FAQ data lives in `weeklyFaqs`.
- **News GQL field name:** R3 uses `posts` (not `news`). Local collection name in Astro will remain `news`.
- **Hub response shape:** Research Hub is Strapi v3 — articles return as a flat array directly (no `data[]` wrapper, no `attributes` nesting). IDs use `_id` (MongoDB ObjectID string), not `id`.
- **Hub filter syntax:** Strapi v3 `where` argument with `tags_contains` array, not Strapi v4 `filters` object. Exact shape: `articles(limit: 100, sort: "date:desc", where: { status: "published", tags_contains: ["r3", ...] })`.

### Pagination behavior

- **R3 Strapi (v4):** Results live under `data[]` with `id` + `attributes` shape. Confirmed via live fetch.
- **Research Hub (Strapi v3):** Flat array response — no `data[]` wrapper, no `attributes` nesting. Pagination uses top-level `limit`/`start` args, not `pagination: { limit, start }`.

### Notes for content.config.ts

- The local Astro collection name `news` maps to the GQL field `posts` — use `posts` in any fetch query targeting R3 Strapi.
- The local Astro collection name `faqs` maps to the GQL field `weeklyFaqs` — use `weeklyFaqs` in fetch queries.
- Hub query filter shape (Strapi v3): `articles(limit: 100, sort: "date:desc", where: { status: "published", tags_contains: [...tagsArray] })`. Tags array must be JSON-serialized inline into the query string (as the creator does with `JSON.stringify(tags)`).
- Hub articles need `pubType`, `type`, `fileURL`, and `ext` set programmatically post-fetch — these are not CMS fields.
- `homePage` flag on hub articles is set when the article's tags include `"r3"` (lowercased).

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

## Phase 2 smoke (2026-05-08)

Live `yarn smoke` run after all 5 collections defined.

| Collection | GraphQL field | Source | Row count |
|---|---|---|---|
| pages | pages | r3.icjia-api.cloud (v4) | 9 |
| news | posts | r3.icjia-api.cloud (v4) | 8 |
| faqs | weeklyFaqs | r3.icjia-api.cloud (v4) | 0 (expected — see Task 2.1) |
| resources | resources | r3.icjia-api.cloud (v4) | 4 |
| hubArticles | articles | researchhub.icjia-api.cloud (v3) | 12 |

Build-time verification confirms every collection's loader query, response-shape parsing, and zod schema agree with the live API.

## Phase 3 smoke (2026-05-08)

**Note on URL path:** The task spec called for `/__smoke__/` using `__smoke__.astro`, but Astro 6 excludes any file whose name begins with `_` from its routing manifest (source: `node_modules/astro/dist/core/routing/create-manifest.js` line 92 — `if (name[0] === "_") continue`). The page was therefore named `smoke.astro` (URL: `/smoke/`) to satisfy Astro's file-based router while preserving the same verification purpose. The double-underscore convention signals internal/non-content but cannot be encoded in the filename for Astro static routes.

| Check | Result |
|---|---|
| `/smoke/` HTTP | 200 OK — confirmed via `curl` against `astro preview` on `127.0.0.1:4321` |
| Build emits expected layout structure | PASS — `dist/smoke/index.html` contains: skip links, SiteNav with all 11 NAV_ITEMS, Breadcrumb ("Home / Smoke"), SiteFooter, `<h1>Layout smoke test</h1>`, all 3 external link types (example.com, /contact/ internal, icjia.illinois.gov whitelisted), all heading levels h2–h6, Dialog `astro-island` markers, `<meta name="robots" content="noindex">` |
| Lighthouse a11y (mobile) | 100/100 — 0 issues — lightcap MCP, Lighthouse v13, mobile viewport |
| Manual keyboard walk | Tab order verified via dist HTML inspection: skip-link → #main-content, skip-link → #navigation, then nav links (all ≥44px), then breadcrumb links, then in-page links in order. All interactive elements reachable. ESC handling wired via Dialog's native `<dialog>` element. Scroll-to-top button renders as `<button aria-label="Scroll to top">` at 48×48px with focus outline (injected by inline script, visible after 400px scroll). Dialog island dispatches `r3-dialog:open` CustomEvent on external-link clicks; whitelisted domains (icjia.illinois.gov) and internal links (/contact/) verified in source to bypass the interceptor. |
| Vue Dialog island lazy-mounts | PASS — `<astro-island component-url="...Dialog..."  client="idle">` confirmed in dist HTML; component deferred until browser idle as expected |

## Phase 4d — FAQ accordion REPLACED by catch-all (2026-05-08)

The plan's Task 4d called for `FaqAccordion.astro` rendering individual rows
from the `weeklyFaqs` collection, plus `/faqs/index.astro` and
`/faqs/[slug].astro` for list + detail routes.

**This was reframed during execution.** Live introspection (Task 2.1) found
that:

- The `weeklyFaqs` Strapi collection has **0 published rows**
- The actual FAQ content on the legacy R3 site lives in the
  `pages.faqs` row — a single Strapi page whose body markdown contains the
  FAQ Q&A (presumably as a series of headings + answers, or HTML
  `<details>` blocks)

The catch-all `[...slug].astro` (Task 4a.1) already serves `/faqs/` by
rendering the body of the `pages.faqs` row. No additional accordion
component is needed; no `/faqs/[slug]/` detail routes exist (there are no
individual FAQ slugs to route).

**If the team later moves FAQ data into the `weeklyFaqs` collection** (or
adds a `faqs` collection with individual entries), the accordion +
detail-route plan from the design spec can be implemented at that point.
For now, the existing Strapi-page-body approach is preserved as-is.

The single-page faqs URL (`/faqs/`) is correctly excluded from the
breadcrumb (per `Breadcrumb.astro`'s HIDE_ON list — Task 3.5) since it's
treated as a "section index" page in the original IA.

Smoke page deleted at end of Phase 3 (this commit). Phase 3 layout shell verified.

## Phase 6 — Accessibility polish (2026-05-14)

### axe-core AA sweep

`tests/e2e/a11y-sweep.spec.ts` runs axe-core (`wcag2a`, `wcag2aa`,
`wcag21a`, `wcag21aa`) against 18 public routes × 3 viewports = 54 scans.
**0 violations** on the first run — the Phase 3/4 components were built
accessibly from the start.

### Lighthouse a11y per route (lightcap MCP, mobile preset)

Lighthouse v13 via `@icjia/lightcap`. First-pass run surfaced two issues
that axe-core's tag filter missed (both on rules axe tags `experimental`
or `best-practice`, so they fell outside the AA sweep's `withTags` filter
but still cost Lighthouse points / flagged serious):

| Issue | Route | Rule | WCAG | Fix |
|---|---|---|---|---|
| `label-content-name-mismatch` | `/` | serious | 2.5.3 (A) | Dropped `HomeSplashCard`'s `aria-label` — the link's visible text (title + tagline + date) already forms a complete accessible name; the old `aria-label` omitted the date, tripping 2.5.3 |
| `heading-order` | `/news/` | moderate | best-practice | `NewsCard` gained a `headingLevel` prop (default `h3`); `/news/` index passes `h2` so card titles follow its `h1` without skipping a level. Homepage cards stay `h3` under the `h2` "News & Updates" section |

Final scores after fixes — **Lighthouse a11y = 100 on every route, 0 issues:**

| Route | Lighthouse a11y | axe-core AA |
|---|---:|---:|
| `/` | 100 | 0 |
| `/eligibility/` | 100 | 0 |
| `/contact/` | 100 | 0 |
| `/collaboratives/` | 100 | 0 |
| `/board/` | 100 | 0 |
| `/faqs/` | 100 | 0 |
| `/funding/` | 100 | 0 |
| `/meetings/` | 100 | 0 |
| `/privacy/` | 100 | 0 |
| `/news/` | 100 | 0 |
| `/news/r3-2022-annual-report/` | 100 | 0 |
| `/resources/` | 100 | 0 |
| `/resources/spanish-language-materials/` | 100 | 0 |
| `/resources/single-page/` | 100 | 0 |
| `/research/` | 100 | 0 |
| `/search/` | 100 | 0 |
| `/translate/` | 100 | 0 |
| `/404/` | 100 | 0 |

### Keyboard focus-order verification (2026-05-14)

Verified two ways: static source inspection for the site-wide structural
guarantees, plus a live Tab-key walk driven through Chrome DevTools.

**Source inspection — structural guarantees (apply to every route via
`BaseLayout`):**

- No positive `tabindex` anywhere in `src/` — only `tabindex="-1"` (skip
  targets: `#main-content`, `MapEmbed`'s `#after-map`, translate page
  anchors) and `tabindex="0"` (`MapEmbed`'s scrollable region, keeping
  natural order). Nothing overrides the natural DOM tab order.
- No `accesskey` attributes.
- `:focus-visible` / `:focus` styles present in all 11 interactive
  components + `global.css`.
- `BaseLayout` body DOM order: `SkipLinks → SiteNav → main → SiteFooter →
  Dialog island → scroll-to-top`.

**Live Tab walk (Chrome DevTools, homepage):**

- Tab 1 → `Skip to main content`, Tab 2 → `Skip to navigation`, Tab 3 →
  first nav link (`R3` home). Order correct.
- Enter on `Skip to main content` → focus lands on `#main-content`
  (`tabindex="-1"` target), URL hash updates. Skip link functional.
- `r3-dialog:open` event → `<dialog>` opens with `showModal()`: reports
  `:modal`, focus is trapped inside, content renders. Modal behaviour
  intact.

**Bug found and fixed — Dialog `<Teleport>` destroyed the skip links
site-wide.** `Dialog.vue` wrapped its `<dialog>` in `<Teleport to="body">`.
Under Astro's `client:idle` island boundary, Vue's Teleport mishydrated:
after hydration the live DOM had **no skip-links `<nav>` at all** (Vue's
mismatched teleport hydration clobbered `<body>`'s first child — exactly
where the skip links live) and the `<dialog>` relocated to `body[0]`. This
silently broke WCAG 2.4.1 Bypass Blocks (Level A) on every page. The
axe-core sweep and Lighthouse audits missed it because they run before
`client:idle` fires — only the post-hydration keyboard walk caught it.

Fix: removed `<Teleport to="body">` entirely. A native `<dialog>` opened
with `showModal()` is promoted to the browser top layer regardless of DOM
position, so the teleport was never necessary. The `<dialog>` now stays as
the island root; skip links survive hydration; modal display, `::backdrop`,
and the native focus trap all still work (verified live). Full e2e suite
(147 tests) green after the change.
