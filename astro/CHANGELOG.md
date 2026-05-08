# Astro Migration Changelog

All notable changes to the Astro rebuild of r3.illinois.gov live here.
Most recent at the top; entries grouped by date, days in reverse
chronological order.

---

## v0.2.0 — 2026-05-08

### Phase 2 — Content collections

- Live-introspected R3 Strapi (v4) and Research Hub (Strapi v3) GraphQL
  schemas; documented in `MIGRATION.md` "Strapi schema discovery"
- `src/lib/strapi.ts` (TDD, 22 tests) — `strapiQuery` (v4 shape),
  `hubQuery` (v3 shape), `absoluteMediaURL`, `rawText`, with 30s
  AbortController timeout to prevent build hangs
- `src/lib/markdown.ts` (TDD, 16 tests) — markdown-it + DOMPurify with
  ArcGIS-only iframe whitelist preserving the March 2026 audit posture
- `src/lib/dateFormat.ts`, `src/lib/slug.ts` (TDD, 26 tests) — UTC
  date formatting + path normalization helpers
- `src/lib/manualPages.ts` (port of `app.config.js` splash array, 2 entries)
- `src/lib/tags.ts` (port of `src/tags.json`, 3 hub tags)
- `src/content.config.ts` — 5 content collections defined live:
  - `pages` (Strapi `pages`, v4) — 11 tests
  - `news` (Strapi `posts`, v4 — discovered alias) — 12 tests, with
    `dateOverride` schema-level rejection of unparseable strings and
    `dateOverride → publishedAt → createdAt → 'MISSING_DATE'` fallback
  - `faqs` (Strapi `weeklyFaqs`, v4 — discovered alias) — 8 tests
  - `resources` (Strapi `resources`, v4) — 7 tests
  - `hubArticles` (Hub `articles`, **v3**) — 11 tests, separate
    `hubLoader` factory for v3 response shape (flat array, `_id`,
    `where:` filter, `limit:` pagination, JSON-scalar `authors`)
- Vitest infrastructure: `astro:content` shim mock for unit-test access
  to schema validation (Task 2.6)
- `astro/scripts/smoke-collections.ts` — live build-time verifier; prints
  row counts per collection. Smoke run at v0.2.0 close: pages=9,
  news=8, faqs=0 (expected empty per discovery), resources=4,
  hubArticles=12
- Removed `astro/scripts/strapi-introspect.sh` (no longer needed; smoke
  is the regression path going forward)

### Cross-collection live-API findings (corrects plan template assumptions)

- R3 Strapi `Page` type: no `mediaTitle`, no `media` (relational fields
  the plan listed don't exist on this type)
- R3 Strapi `Post` type: scalar-only — no `media`, no `splash`, no
  `attachments`. Has `section` ENUM (newly discovered)
- R3 Strapi `WeeklyFaq` type: no `category`/`question`/`answer` (the
  schema-suggesting names from i2i don't exist on R3); has `week` ENUM,
  `attachmentHeading`, `dateOverride`
- R3 Strapi `Resource` type: standard scalars + `searchMeta` +
  `hideFromSearch` (intentionally omitted: `ranking` Int — Phase 4b
  sorts by title; can re-add if Strapi-driven order is needed)
- Hub `Article` type (v3): no `publishedAt`; `splash`/`thumbnail` are
  String scalars (not relational); `authors` is JSON scalar

---

## v0.1.0 — 2026-05-08

### Phase 0 — Baseline capture

- Captured P0 mobile Lighthouse scores for all 25 routes of the current
  Nuxt prod build (see `MIGRATION.md` for the table). Mobile Perf range
  52–93, average ~79. A11y/SEO = 100 across all routes; BP = 100 on
  24/25 routes (96 on `/eligibility/` due to the ArcGIS storymap iframe).
- Captured P0 axe-core baseline: 84 test runs (28 pages × 3 viewports),
  7,588 individual checks, **3 violations** (all `page-has-heading-one`
  on `/404`, best-practice tag — NOT WCAG AA). 27/28 pages pass with
  0 AA violations. The /404 finding is auto-fixed by Phase 4h.1.

### Phase 1 — Foundation

- Scaffolded Astro 6.3.1 project under `astro/` subfolder; pinned
  Node 22.22.2 LTS via `.nvmrc`; named the package `icjia-r3-astro`;
  switched scaffold's npm output to yarn with regenerated `yarn.lock`
- Installed core deps: Astro integrations (`@astrojs/sitemap`,
  `@astrojs/vue`), Tailwind 4 via `@tailwindcss/vite` (NOT the legacy
  `@astrojs/tailwind`), Vue 3, markdown stack (`markdown-it` + plugins,
  `dompurify`, `slugify`, `fuse.js`), self-hosted variable fonts
  (`@fontsource-variable/roboto` + `raleway`; `@fontsource/lato` —
  Lato is not published as variable-axis on npm), and test stack
  (vitest 4, Playwright, `@axe-core/playwright`, happy-dom)
- Moved `@astrojs/check` to `devDependencies` (it's a CLI type-checker,
  not a runtime dep)
- Added `packageManager: "yarn@1.22.22"` field for corepack enforcement
- Configured `astro.config.ts` with: `site` URL, `output: 'static'`,
  `trailingSlash: 'always'`, `inlineStylesheets: 'auto'`, Tailwind 4
  Vite plugin, Vue + sitemap integrations, sitemap filter excluding
  `/sandbox/` `/preview/` `/translate/` `/404/`, and a 5-entry env
  schema for Strapi/Hub/site/Plausible URLs (4 with `url: true`
  validation; PUBLIC_PLAUSIBLE_DOMAIN intentionally bare hostname)
- Created `astro/.env.sample` documenting the env vars and the
  staging-deploy override gotcha for `PUBLIC_PLAUSIBLE_DOMAIN`
- Configured `tsconfig.json` with strict + `~/*` path alias mapping
  to `src/*` and explicit `tests/**/*` include
- `.gitignore` covers `dist/`, `.astro/`, `node_modules/`, env (`.env`,
  `.env.production`, `.env.local`, `.env.*.local`), test artifacts
  (`test-results/`, `playwright-report/`, `playwright/.cache/`,
  `coverage/`), and OS/editor patterns
- Documented Strapi (`r3.icjia-api.cloud`) and Research Hub
  (`researchhub.icjia-api.cloud`) endpoints in `astro/.env.sample`
  and `astro/astro.config.ts` env schema
- Vitest configured with `happy-dom` environment; sanity test passes
- Playwright configured with chromium-mobile, chromium-tablet, chromium-desktop
  projects; sanity e2e passes across all three; webServer auto-builds and
  previews via `yarn build && yarn preview --host 127.0.0.1 --port 4321`,
  with all hostnames pinned to `127.0.0.1` to avoid IPv6 `localhost` hangs
- Root `netlify.toml` rewritten to `base = "astro"`; Content-Security-Policy
  and 4 other security headers (X-Frame-Options, X-XSS-Protection,
  Referrer-Policy, X-Content-Type-Options) preserved verbatim from the
  Nuxt-era; new `/_astro/*` immutable
  cache and `/searchIndex.json` revalidate-on-each-request rules added
- Phase 1 close verification: `yarn run check`, `yarn test`, `yarn build`,
  `yarn test:e2e` all green at Phase 1 close

### Cross-site policy notes

- **Trailing slash uniform:** all internal links and emitted URLs end
  with `/`. Netlify Pretty URLs handles 301 redirect from non-slash
  variants at the CDN edge.
- **Plausible regression guard:** Phase 5 e2e test will assert the
  `<script>` tag fires on every route — this is the regression test
  against the same bug currently affecting i2i's deployed Astro build.
