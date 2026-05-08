# Astro Migration Changelog

All notable changes to the Astro rebuild of r3.illinois.gov live here.
Most recent at the top; entries grouped by date, days in reverse
chronological order.

---

## v0.1.0 — 2026-05-08

### Phase 0 — Baseline capture

- Captured P0 mobile Lighthouse scores for all 25 routes of the current
  Nuxt prod build (see `MIGRATION.md` for the table). Mobile Perf range
  52–93, average ~78. A11y/BP/SEO = 100 across all routes (validates
  the Nuxt site's existing audit posture).
- Captured P0 axe-core baseline: 84 test runs (28 pages × 3 viewports),
  7,588 individual checks, **3 violations** (all `page-has-heading-one`
  on `/404`, best-practice tag — NOT WCAG AA). 27/28 pages pass with
  0 AA violations. The /404 finding is auto-fixed by Phase 4h.1.

### Phase 1 — Foundation

- Scaffolded Astro 6.3.1 project under `astro/` subfolder; pinned
  Node 22.22.2 LTS via `.nvmrc`; renamed scaffold-generated `eccentric-zero`
  package to `icjia-r3-astro`; switched scaffold's npm output to yarn
  with regenerated `yarn.lock`
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
- Documented Strapi/Hub baseline endpoints in `MIGRATION.md`

### Cross-site policy notes

- **Trailing slash uniform:** all internal links and emitted URLs end
  with `/`. Netlify Pretty URLs handles 301 redirect from non-slash
  variants at the CDN edge.
- **Plausible regression guard:** Phase 5 e2e test will assert the
  `<script>` tag fires on every route — this is the regression test
  against the same bug currently affecting i2i's deployed Astro build.
