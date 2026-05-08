# R3 Astro 6 Migration — Design Spec

**Date:** 2026-05-08
**Status:** Draft (awaiting user review)
**Branch:** `migration/astro-full` (to be created at start of implementation)
**Reference playbook:** `/Volumes/satechi/webdev/icjia-i2i-v2-2024/docs/MIGRATION_PLAYBOOK.md` (Path B)
**Reference build:** `/Volumes/satechi/webdev/icjia-i2i-v2-2024/astro/` (i2i Astro implementation)

## Problem & goals

Migrate `r3.illinois.gov` from Nuxt 4 + Vuetify 3 + `@nuxt/content` v2 to Astro 6 + Tailwind 4. The current build has hit a structural mobile-Lighthouse ceiling (88–100 across 25 routes; some pages stuck below 95) driven by Nuxt's required Vue runtime + Nuxt runtime + hydration payload on every page. The i2i playbook proves Astro's static-first model breaks past that ceiling and lands in the 95–100 mobile-perf range with no other architectural change.

**Hard goals:**
- Mobile Lighthouse Performance ≥ 95 on every route, target 98 average (current Nuxt average is ~95)
- Lighthouse Accessibility = 100 on every route (current site already holds this — must not regress)
- Lighthouse Best Practices = 100 on every route
- Lighthouse SEO = 100 on every route
- Zero axe-core WCAG 2.1 AA violations on every route × three viewports (mobile, tablet, desktop)
- Visual + functional parity with the live `r3.illinois.gov` site (Tier 2 with high fidelity intent — indistinguishable to a non-developer; every feature works identically)

**Constraints (non-negotiable):**
- All work happens on a new feature branch — `migration/astro-full`. `main` keeps deploying the current Nuxt build until an explicit user-gated cutover at the end. No commits to `main` during the migration.
- No `Co-Authored-By` trailer on any commit (standing user policy)
- `astro/CHANGELOG.md` updated before each push, same-day entries grouped, days in reverse chronological order
- Existing security audit posture preserved: CSP, iframe whitelist (ArcGIS only), DOMPurify HTML sanitization, no `'unsafe-eval'`, all March 2026 red-team mitigations intact
- All current redirects preserved: `/downloads/** → /`, `/apply → /funding/`, `/faqs/2025-r3-nofo-applicant-questions → /faqs/03-08-24-2025-r3-nofo-applicant-questions/`

## Litmus score (per playbook)

R3 scores **~12** on the playbook's 10-point litmus test — a strong Astro recommendation, equivalent to i2i.

| # | Question | R3 score | Reasoning |
|---|---|---|---|
| 1 | Strapi build-time only, no runtime DB? | 2 | Strapi is the source of truth, baked at build |
| 2 | Routes ≤ 200? | 1 | 25 prerendered routes |
| 3 | Islands ≤ 3 per page? | 2 | Search (one route), Dialog (site-wide ambient), ScrollToTop (site-wide ambient) |
| 4 | No SPA navigation requirement? | 1 | All page-load navigations are fine |
| 5 | Mobile Lighthouse ≥ 95 target? | 2 | User explicitly asked for "perfect or near-perfect mobile score" |
| 6 | Build time matters? | 1 | Frequent Strapi content updates |
| 7 | Tight deadline (< 1 week)? | 0 | No tight deadline stated |
| 8 | Team has Astro experience? | 1 | Same team already shipped i2i Astro migration |
| 9 | Components already mostly native HTML? | 1 | Mostly Vuetify-heavy today, but conversion is mechanical |
| 10 | Image weight a known problem? | 1 | Strapi-hosted full-resolution images |
| **Sum** | | **12** | **Strong Astro recommendation** |

## Decisions (locked, from brainstorming)

| Decision | Choice |
|---|---|
| Repo layout | `astro/` subfolder; old Nuxt source archived under `astro/reference/` after cutover (mirror i2i exactly) |
| Branch | `migration/astro-full`, cut from current `main` as Step 1 of implementation |
| Visual parity tier | Tier 2 with high fidelity intent — indistinguishable to a non-developer, every feature works identically |
| Hub article handling | 7th content collection (`hubArticles`) with its own loader hitting `researchhub.icjia-api.cloud/graphql`, zod-validated, fresh on every build |
| Hub thumbnails | Live AVIF via Astro `<Image>` from Hub CDN; `public/hub-images/` retained as fallback |
| Search strategy | One unified Fuse.js Vue island at `/search/`, hydrated `client:idle`, indexes pages + news + faqs + resources + hub articles |
| Modal strategy | Vue 3 SFC island via `@astrojs/vue` (matches i2i MediaSlider pattern); `client:idle` hydration; one shared `Dialog.vue` component used by external-link warning + cookie warning |
| Translation modal | Port the component but leave the import commented out in `BaseLayout.astro` — preserves current functional state where it's disabled |
| ScrollToTop | Vanilla inline `<script>` in `BaseLayout.astro` (~25 LOC) — not a Vue island. Keeps Vue runtime off pages that don't otherwise need it. |
| `/docs/` portal | Drop entirely. Audit reports live in `CHANGELOG.md` going forward; old `public/docs/` removed at Phase 10. |
| `public/a11y/` | Drop entirely (audit artifacts, not URL-served). |

## Stack

- **Astro `^6.3.x`** — `output: 'static'`, `trailingSlash: 'always'`, `inlineStylesheets: 'auto'`, `site: 'https://r3.illinois.gov'`
- **Node `22.22.2`** LTS, pinned via `.nvmrc`
- **Tailwind CSS `^4.2`** via `@tailwindcss/vite` (the legacy `@astrojs/tailwind` integration is Tailwind 3 only — do not use)
- **Vue `^3`** via `@astrojs/vue` for the Search and Dialog islands only
- **TypeScript** strict, `tsconfig.json` extends `astro/tsconfigs/strict` and **explicitly** includes `.astro/types.d.ts` (project tsconfig `include` overrides the base — playbook pitfall)
- **`@astrojs/sitemap`** integration with a `hideFromSitemap` filter callback (excludes `/sandbox`, `/preview/**`, `/translate/`, `/404/`)
- **Plausible** as a plain `<script defer>` tag in `BaseLayout.astro` head (not a module — Astro static = full page navigation = Plausible auto-fires)
- **`markdown-it` `^14`** + `markdown-it-anchor` + `markdown-it-attrs` for body rendering (matches current Nuxt config)
- **`dompurify` `^3.2.6`** retained for sanitizing Strapi HTML bodies (preserves March 2026 red-team mitigation)
- **`fuse.js` `^7`** for the search island
- **`slugify` `^1.6`** for URL generation
- **Self-hosted fonts** via `@fontsource-variable/roboto` + `@fontsource-variable/lato` + `@fontsource-variable/raleway` (eliminates render-blocking external Google Fonts fetch the current build still hits)

## Architecture

### Repo layout (post-migration)

```
icjia-r3-v5-nuxt/
├── netlify.toml                ← root, base="astro" pointing into subfolder
├── README.md                   ← rewritten to point at astro/
├── CHANGELOG.md                ← root changelog gets a "v6.0.0 — Astro migration" header
├── LICENSE.md
├── .git/
├── .github/                    (if present)
├── .vscode/
└── astro/                      ← Astro project
    ├── astro.config.ts
    ├── tsconfig.json
    ├── package.json
    ├── yarn.lock
    ├── .nvmrc                  → 22.22.2
    ├── CHANGELOG.md            ← Astro-specific, started fresh
    ├── MIGRATION.md            ← R3-specific migration notes (P0 baseline tables, MCP results)
    ├── CRASH_COURSE.md         ← copy of i2i's, retained for team reference
    ├── public/                 ← favicon, og-image, robots.txt, llms.txt, _redirects, downloads/, hub-images/, R3 site tables
    ├── src/
    │   ├── pages/              ← file-based routes
    │   ├── content.config.ts   ← 7 collections, ~400 LOC, the heart of the migration
    │   ├── layouts/BaseLayout.astro
    │   ├── components/         ← .astro + .vue (islands)
    │   ├── lib/                ← strapi.ts, markdown.ts, dateFormat.ts, slug.ts, navConfig.ts, manualPages.ts, schemas.ts, tags.ts
    │   └── styles/global.css   ← Tailwind 4 + brand theme + .markdown-body restorations
    ├── tests/{unit,e2e}/
    ├── scripts/                ← smoke-collections.ts, check-all.sh, aggregate-mcp-results.ts
    └── reference/              ← old Nuxt source archived here at Phase 10
        ├── app.vue, pages/, components/, composables/, plugins/, creators/, content/, etc.
        └── README.md           ← "Frozen Nuxt source as of <commit>. Do not edit."
```

### Build flow (one process, ~3s expected)

```
yarn build  →  astro build
              ├─ load 7 content collections in parallel
              │   ├─ strapiQuery() × 4  → pages, news, faqs, resources
              │   ├─ hubQuery()         → hubArticles
              │   └─ static imports     → manualPages, siteTags
              ├─ zod validates each row, transform computes derived fields
              ├─ render every .astro page once
              ├─ src/pages/searchIndex.json.ts → /searchIndex.json
              ├─ @astrojs/sitemap → sitemap-index.xml + sitemap-0.xml
              └─ write dist/ (~5–15 MB target, vs current 119 MB Nuxt)
```

Build is **strict-on-failure**: Strapi or Hub unreachable, or zod rejection, fails the build loudly. No silent empty-fixture writes (which the current Nuxt creators pipeline can do today).

## Content collections (data layer)

Seven collections, all defined in `astro/src/content.config.ts`. Each gets a custom loader, zod schema, and transform.

| # | Collection | Source | Replaces (Nuxt) | Key derived fields |
|---|---|---|---|---|
| 1 | `pages` | Strapi `pages` (GraphQL) | `creators/createMarkdownPages.js` + `content/*.md` | `path`, `rawText` |
| 2 | `news` | Strapi `posts` (GraphQL) | `creators/createMarkdownNews.js` + `content/news/*.md` | `postDate`, `path: /news/<slug>/`, `rawText` |
| 3 | `faqs` | Strapi `faqs` (GraphQL) | `creators/createMarkdownFaqs.js` + `creators/createSearchIndexFaqs.js` | `path: /faqs/<slug>/`, `rawText` |
| 4 | `resources` | Strapi `resources` (GraphQL) | `creators/createMarkdownResources.js` + `content/resources/*.md` | `path: /resources/<slug>/`, `rawText` |
| 5 | `hubArticles` | Research Hub `articles` filtered `tags: ["r3"]` | `creators/createHubArticles.js` + `creators/createHubImages.js` + `src/hub.json` | `path`, `rawText`, `splashURL`, `thumbnailURL` |
| 6 | `manualPages` | Static TS module (`src/lib/manualPages.ts`) | `creators/createManualPages.js` + `app.config.js` splash array | `path`, `rawText` |
| 7 | `siteTags` | Static TS module (`src/lib/tags.ts`) | `src/tags.json` | n/a — used by hub query filter |

### `src/lib/strapi.ts`

Shared GraphQL helper module, ~80 LOC, identical surface to i2i's:

```ts
export async function strapiQuery<T>(name: string, query: string): Promise<T[]>
export async function hubQuery<T>(query: string): Promise<T[]>
export function absoluteMediaURL(relativeURL?: string): string | undefined
export function rawText(markdownBody?: string | null): string
```

### What's emitted, what's static, what's gone

**Emitted dynamically (Astro generates these — no longer committed):**
`searchIndex.json`, `siteMeta.json`, `sitemap-index.xml`, `sitemap-0.xml`, `appRoutes.json`, all `routes*.json`, `posts.json`, `pages.json`, `resources.json`, `manual.json`, `faqs.json`, `placeholder.json`, all individually-emitted `.html` files

**Stays in `astro/public/`:**
- Images: `favicon.ico`, `og-image.png`, `r3-social.png`, `r32025_1.jpg`, `DirectorAdams*.jpg`, `delrice.jpg`, `home-loading*.gif`, `loading.gif`, `i2iSmall.png`, `placeholder.png`, `qr*.png`, `icjia-logo.png`
- Routing/SEO: `_redirects`, `robots.txt`, `llms.txt`, `google0bc0c1c6e02aa032.html`
- Reference data tables: `R3_site_table_V2.json`, `r3-site-table-2024.json` (rendered directly by funding/eligibility pages)
- Subdirs: `downloads/`, `hub-images/` (retained as fallback for Hub CDN)
- `ICJIAUniformBudgetTemplateforR3Grants.xlsx`

**Gone entirely:**
- `creators/` (all 15 scripts) — replaced by `content.config.ts`
- `content/` (all generated markdown) — Strapi is the source of truth
- `src/hub.json`, `src/resources.json`, `src/tags.json` — replaced by `src/lib/*.ts`
- `dist` symlink at repo root
- `audit-accessibility copy.js` (the duplicate file)
- `public/docs/` (per locked decision)
- `public/a11y/` (per locked decision)
- `public/manual.json`, `public/posts.json`, `public/pages.json`, `public/resources.json`, `public/siteMeta*.json`, `public/searchIndex.json`, `public/placeholder.json`, `public/routes*.json`, `public/appRoutes.json`

## Component & island inventory

R3 has 22 components today (mostly Vuetify-heavy). Astro target:

### `.astro` components (zero JS, server-rendered HTML only)

| Component | Replaces (Nuxt) | Notes |
|---|---|---|
| `BaseLayout.astro` | `app.vue` | `<head>`, skip-links, nav, footer, `pageBackground` prop, JSON-LD slots, Plausible tag |
| `SiteNav.astro` | `TheNav.vue` + `TheSidebar.vue` | Fixed 90px white app-bar. Mobile menu via `<details>` (zero-JS opt-out). Active route highlighted via `Astro.url.pathname` comparison |
| `SiteFooter.astro` | `TheFooter.vue` | Dark slate, AAA contrast forced white text on every `<a>` (commit `925d1a0` ports verbatim) |
| `SkipLinks.astro` | inline in `app.vue` | Direct port of `app.vue` lines 152–216 |
| `Breadcrumb.astro` | `TheBreadcrumbBar.vue` | Computed from URL + collection lookups; restored to enabled state |
| `TableOfContents.astro` | `TheTableOfContents.vue` | Auto-discovered `<h2>` sidebar. ~1 KB inline `<script>` for active-section highlight on scroll. **Pitfall:** TOC `<li>`s are JS-injected → use `:global()` for scoped CSS targeting them |
| `MapEmbed.astro` | `MapCensusTracts.vue` | Plain `<iframe loading="lazy" allow="geolocation" title="...">` to ArcGIS storymap. Skip-the-map link + visually-hidden description. Zero JS. |
| `HomeSplashCard.astro` | `index.vue` splash card markup | The two NOFO splash cards. Astro `<Image>` for the photo. Hover via pure CSS `transform: translateY(-4px)` |
| `HomePhotoBoxes.astro` | `HomePhotoBoxes.vue` + `HomeBoxes.vue` | "Applicant Tools" photo grid. Static markup, no interactivity |
| `NewsCard.astro` | inline news-card markup in `index.vue` | Reused on `/` (latest 2) and `/news/` (full list) |
| `Funding.astro`, `Attachments.astro` | `Funding.vue`, `attachments.vue` | Markdown-rendered helpers. Drop the duplicate `attachmentsv2.vue` |
| `FaqAccordion.astro` | `TheFaqBar.vue` + `TheFaqBarMobile.vue` | Unified responsive accordion via native `<details><summary>`. Zero JS. Single component, responsive via Tailwind |

### `.vue` islands (Vue 3 runtime hydrated on demand)

| Island | Replaces (Nuxt) | Hydration | Routes |
|---|---|---|---|
| `Search.vue` | `pages/search.vue` body + `composables/states.ts` Fuse logic | `client:idle` | `/search/` only |
| `Dialog.vue` | `TheExternalWarningModal.vue` + `TheCookieWarning.vue` (+ commented `TheTranslationModal.vue` stub) | `client:idle` | Site-wide (mounted in `BaseLayout.astro`) |

Vue runtime (~70 KB minified) ships once per page that mounts an island, shared across all islands on that page. On `/search/` that's the worst case. Every other page mounts only `Dialog.vue` (~3 KB component code on top of the shared Vue runtime).

### Inline `<script>` blocks (vanilla TS, no framework)

| Behavior | Where | Size |
|---|---|---|
| Scroll-to-top button visibility + click handler | `BaseLayout.astro` | ~25 LOC |
| TOC active-section highlighting (IntersectionObserver) | `TableOfContents.astro` | ~30 LOC |
| External-link auto-detection (adds `target="_blank" rel="noopener"`, triggers Dialog for off-domain links inside Markdown bodies) | `BaseLayout.astro` | ~40 LOC |

Total inline script weight: under 3 KB across all three.

### Components dropped entirely

- `TheLoader.vue`, `TheAltLoader.vue`, `ThePageLoader.vue` — Astro fully prerendered, no client route transition needs a loader
- `TheSplash.vue` — appears unused (verify in plan)
- `TheContextFooter.vue` — appears unused (verify in plan)
- `Query.vue` — Nuxt Content `<ContentQuery>` wrapper, replaced by `getCollection()`
- `TheNavHome.vue` — already commented out in `app.vue`
- `attachmentsv2.vue` — duplicate

### Brand & style preservation

`astro/src/styles/global.css` ports R3's existing theme one-for-one:
- Brand colors: primary `#0d4474` blue, hover `#062a47`, body `#f2f2f2`, footer slate, news-card border `#ddd`, etc.
- Typography: Roboto / Lato / Raleway via Tailwind 4 `@theme` directive, self-hosted via `@fontsource-variable/*`
- `.markdown-body` styles ported from `assets/css/github-markdown.css` and `assets/css/app.css` — must restore `list-style: disc` on `<ul>` (Tailwind 4 preflight pitfall)
- `.skip-link` CSS preserved verbatim (recent SiteImprove a11y fixes — commits `925d1a0`, `666c7e0`)
- Vuetify `.v-` selectors re-implemented as Tailwind utility classes per component, with `<style>` blocks for what Tailwind can't express cleanly (gradient overlays, complex pseudo-selectors)

## Performance + accessibility playbook

### Targets (mobile Lighthouse, post-migration)

| Surface | Current Nuxt | Astro target | Floor |
|---|---|---|---|
| `/` | 96 | 100 | 95 |
| `/contact/`, `/research/`, `/resources/`, `/translate/`, `/search/` | 100 | 100 | 95 |
| `/faqs/`, `/faqs/<slug>/` | 97 | 98+ | 95 |
| `/news/`, `/news/<slug>/` | 88 | 98+ | 95 |
| `/resources/<slug>/`, `/funding/`, `/board/`, `/eligibility/`, others | n/a | 100 | 95 |

**Hard gates** (every public route): A11y = 100, BP = 100, SEO = 100, zero axe-core AA violations.

### Performance tactics (in impact order)

**Structural (free with Astro):**
- Zero JS on every page that doesn't mount an island
- Vue runtime ships only on `/search/` (with Fuse.js) and on routes that mount Dialog (~3 KB delta vs. zero)
- `inlineStylesheets: 'auto'` — small CSS chunks inlined, large ones externalized
- No hydration payload, no Nitro client bundle, no `_payload.json`

**Images:**
- Astro `<Image>` everywhere — emits AVIF + WebP via `<picture>`, intrinsic dimensions baked in (kills CLS)
- LCP splash card: `loading="eager"` + `fetchpriority="high"` (port current pattern verbatim)
- Hub thumbnails: live AVIF from Research Hub CDN, `public/hub-images/` retained as fallback
- Director Adams headshot, ICJIA logo, splash photos: pre-sized at the breakpoints we actually use

**Fonts:**
- Self-host Roboto / Lato / Raleway via `@fontsource-variable/*` — eliminates render-blocking `fonts.googleapis.com` fetch
- `font-display: swap`
- Latin subset only

**Network:**
- `trailingSlash: 'always'` — kills the 770–870 ms 301 redirect penalty Lighthouse flags on every directory-style link
- `preconnect` + `dns-prefetch` for `plausible.icjia.cloud`, `r3.icjia-api.cloud`, `researchhub.icjia-api.cloud`
- All security headers in current `netlify.toml` ported verbatim: CSP (still requires `'unsafe-inline'` — accept per March 2026 red-team finding), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, iframe whitelist for ArcGIS domains

**JavaScript:**
- Islands hydrate `client:idle` (Dialog and Search) — never `client:load`
- DOMPurify v3.2.6 retained for any HTML body fields rendered from Strapi
- Drop unused: `aos`, `font-awesome`, `@fortawesome/fontawesome-free`, `material-design-icons-iconfont`, `@mdi/font`, `loading-attribute-polyfill`, `vue-chartjs`, `axios`, `is-buffer`, `kill-port`, `mitt`, `moment` (replaced by `date-fns/format` or `Intl.DateTimeFormat`)

### Accessibility tactics

**Port verbatim — already correct in current site:**
- Skip links with `:focus-visible` clip-path reveal (lines 152–216 of `app.vue`)
- 44×44 px tap-target enforcement (recent commits `9fbd383`, `0e0d0c1`, `5d974c7`)
- Focus outlines: 3 px white on dark surfaces, 2–3 px `#0d4474` on light
- `aria-label` on every icon-only button
- Visually-hidden H1 on homepage (the existing `<h1 class="sr-only">` pattern)

**New patterns the migration introduces:**
- `<details><summary>` for FAQ accordion + mobile nav menu — browser-native keyboard support
- Dialog Vue island uses native `<dialog>` element with `showModal()` + ESC handling, ARIA dialog pattern as fallback for very old browsers
- Heading hierarchy: H1 once per page, sequential H2/H3 — verified via Vitest test
- All Strapi-rendered HTML passes through same DOMPurify config — preserves Critical-level iframe whitelist from March 2026 audit
- `@media (prefers-reduced-motion: reduce)` overrides on every transition + transform

## Trailing-slash + Plausible policy (uniform across ICJIA sites)

**Trailing-slash (uniform):**
1. Every site emits and links with a trailing slash on every directory route. `/` for root.
2. Astro sites: `trailingSlash: 'always'` in `astro.config.ts`. No client plugin needed.
3. Nuxt sites: `site.trailingSlash: true` + `experimental.defaults.nuxtLink.trailingSlash: 'append'` + `trailingSlash.client.js` for `router.push()` cases.
4. All sitemap entries, canonical URLs, JSON-LD `url`, `og:url` carry the slash.
5. Netlify's default Pretty URLs setting handles 301 redirect from `/page` → `/page/` at the CDN edge — no `_redirects` rules needed.

**Plausible (uniform):**
1. Single `<script defer data-domain="<site>.illinois.gov" src="https://plausible.icjia.cloud/js/script.js"></script>` in every page's `<head>`. Domain matches production hostname exactly.
2. Astro sites: tag goes directly in `BaseLayout.astro` `<head>`. Native browser navigation = full page load on every link click → Plausible's standard pageview hook auto-fires. **No SPA tracking needed.**
3. Nuxt sites: tag added via `@nuxtjs/plausible` module (hooks the Vue router's `afterEach` for client-side route transitions).
4. Plus `<link rel="preconnect" href="https://plausible.icjia.cloud" />` for connection warmup.
5. CSP includes `script-src 'self' ... https://plausible.icjia.cloud` and `connect-src 'self' ... https://plausible.icjia.cloud` (R3's current CSP already does — port verbatim).

For R3 specifically, in `BaseLayout.astro` head:

```astro
<link rel="preconnect" href="https://plausible.icjia.cloud" />
<script
  is:inline
  defer
  data-domain="r3.illinois.gov"
  src="https://plausible.icjia.cloud/js/script.js"
></script>
```

A Playwright e2e test (`tests/e2e/plausible.spec.ts`) verifies a network request to `plausible.icjia.cloud/api/event` fires within 5s on every route — regression guard against the same bug currently affecting i2i.

### Cross-site bug flag (out of scope — for later tickets)

- **i2i**: deployed Astro `BaseLayout.astro` has the Plausible `preconnect` but is missing the `<script>` tag entirely. Confirmed by grepping `astro/dist/index.html`. One-line fix on i2i — should be a separate small ticket so deployed analytics actually work.
- **DVFR**: tighten the trailing-slash story to match the policy above — verify `experimental.defaults.nuxtLink.trailingSlash: 'append'` is set, and `@nuxtjs/sitemap` is set to `trailingSlash: true`.

Both flagged for awareness only; not part of this R3 work.

## Testing & verification

### Test stack

| Layer | Tool | Where | Runs |
|---|---|---|---|
| Unit | Vitest 4.x | `astro/tests/unit/` | `yarn test` (every commit) |
| E2E + a11y | Playwright 1.x + `@axe-core/playwright` | `astro/tests/e2e/` | `yarn test:e2e` (per phase) |
| Build sanity | `astro check` | inline | `yarn check` (every commit) |

### Unit tests (Vitest)

| File | Asserts |
|---|---|
| `tests/unit/content-config.test.ts` | All 7 collections defined; schema accepts representative valid row, rejects rows missing required fields (slug, title) |
| `tests/unit/strapi-client.test.ts` | `strapiQuery` throws on non-200, throws on `errors[]`; `absoluteMediaURL` handles relative + absolute |
| `tests/unit/markdown.test.ts` | `markdown-it` config matches Nuxt: anchorLinks, attrs, raw HTML sanitized via DOMPurify |
| `tests/unit/heading-hierarchy.test.ts` | Walks every emitted HTML in `dist/` after build; asserts each has exactly one `<h1>` and no skipped levels |
| `tests/unit/search-index.test.ts` | Emitted `/searchIndex.json` shape includes pages + news + faqs + resources + hub rows |
| `tests/unit/site-meta.test.ts` | Emitted `/siteMeta.json` covers every prerendered route |
| `tests/unit/url-normalization.test.ts` | Every internal `<a href>` ends with `/` (or anchor-only); all collection-derived `path` fields end with `/` |
| `tests/unit/redirects.test.ts` | `_redirects` lines for `/downloads/** → /`, `/apply → /funding/`, `/faqs/2025-r3-nofo-applicant-questions → /faqs/03-08-24-2025-r3-nofo-applicant-questions/` survive |

### E2E tests (Playwright)

Three browsers (Chromium, WebKit, Firefox) × three viewports (mobile 375×667, tablet 768×1024, desktop 1366×768) against `yarn build && yarn preview`:

| File | Asserts |
|---|---|
| `tests/e2e/routes.spec.ts` | Every route returns 200, has expected `<title>`, has `<h1>`, canonical URL with trailing slash |
| `tests/e2e/a11y.spec.ts` | `@axe-core/playwright` AA + experimental rules on every route × every viewport. Hard-fail any violation. Replaces current `audit-accessibility.js` |
| `tests/e2e/keyboard.spec.ts` | Tab-walks each route; skip-link reaches `#main-content`; no focus traps; every interactive reachable |
| `tests/e2e/search.spec.ts` | Loads `/search/`, types "grant", asserts ≥1 result; clicks filter chip, asserts narrowing |
| `tests/e2e/dialog.spec.ts` | Mounts page that triggers Dialog, asserts focus traps inside, ESC closes, focus returns to trigger |
| `tests/e2e/plausible.spec.ts` | **Regression guard against i2i bug.** Loads 3 routes, intercepts network, asserts request to `plausible.icjia.cloud/api/event` within 5s |
| `tests/e2e/sitemap.spec.ts` | Fetches `/sitemap-index.xml`, asserts every URL ends with `/`, no excluded paths |
| `tests/e2e/redirects.spec.ts` | `GET /page` returns 301 → `/page/`. `GET /apply` returns 301 → `/funding/`. FAQ aliased URL redirects |

### MCP-driven manual gates (per Phase 6, 7)

Per the user's tooling preferences (global CLAUDE.md):

```
mcp lightcap run_a11y --url <route> --preset mobile  # phase 6 — per route
mcp contrastcap check_page_contrast --url <route>    # phase 6 — per route
mcp axecap audit_url --url <route>                   # phase 6 — full-page rules

mcp lightcap run_audit --url <route> --preset mobile # phase 7 — full Lighthouse
mcp viewcap take_screenshot --url <route>            # phase 7 — visual diff vs Nuxt
```

Results aggregated to `astro/MIGRATION.md` via `astro/scripts/aggregate-mcp-results.ts`.

### Commit + CHANGELOG ritual (per phase)

1. Bump `astro/package.json` version (semver pre-release: 0.1.0 → 0.2.0 → … → 1.0.0-rc.1 at cutover)
2. Append today's CHANGELOG entry under that version, GROUPED with same-day entries (newest at top of day, days reverse chronological)
3. `git add <specific files>` — never `git add -A` or `git add .`
4. `git commit` (no AI co-author trailer)
5. Never amend; create a new commit per fix

### CI

Netlify build runs `yarn build` only. Vitest + Playwright run locally / pre-commit. Reasoning: Netlify build minutes are precious, Vitest is fast enough to run pre-push, Playwright × 3 browsers × 25 routes × 3 viewports is a 2-min job that doesn't belong on every Netlify deploy.

Optional stricter gate: GitHub Action running `yarn check && yarn test && yarn build` on PRs into `main` (not on push). Flag during plan if desired.

## Migration phases

11 phases. Each has explicit exit criteria. Each ends with a git commit (or commits) on `migration/astro-full`, no AI co-author trailer, with a per-day grouped CHANGELOG entry.

Estimated total: ~3 working days, ~4 with surprises.

### Phase 0 — Baseline capture (≈ 30 min)
Lock "before" measurement of current Nuxt prod build for every route.
- `yarn generate && npx serve .output/public -l 8001` on current `main`
- `mcp lightcap run_audit` × 25 routes (mobile preset), save to `astro/MIGRATION.md` "P0 baseline" table
- Snapshot `audit-accessibility.js` output (current 0 violations)
- **Exit:** baseline table committed to `astro/MIGRATION.md`. No source code changes.

### Phase 1 — Foundation (≈ 2 hours)
Branch + Astro scaffold + Tailwind + Vue integration + tooling.
- `git checkout -b migration/astro-full` from current `main`
- `mkdir astro && cd astro && yarn create astro@latest .` (template: minimal, TS strict)
- Add deps per Stack section
- `astro.config.ts` with site URL, `output: 'static'`, `trailingSlash: 'always'`, `inlineStylesheets: 'auto'`, env schema for `PUBLIC_API_BASE_URL` + `PUBLIC_BASE_URL` + `PUBLIC_HUB_API_BASE_URL`
- `tsconfig.json` extends `astro/tsconfigs/strict`, **explicitly** includes `.astro/types.d.ts`
- `.nvmrc` → `22.22.2`
- Move `netlify.toml` to `[build] base = "astro"`, `command = "yarn build"`, `publish = "astro/dist"`, all `[[headers]]` blocks intact, `[images]` block updated for the `astro/dist/` path
- `astro/.gitignore`, `astro/CHANGELOG.md`, `astro/MIGRATION.md`, `astro/CRASH_COURSE.md` (copy from i2i)
- `PUPPETEER_SKIP_DOWNLOAD=1`, `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` env vars in Netlify build environment
- **Exit:** `cd astro && yarn build` produces empty `dist/` with default Astro starter page successfully. CI green.

### Phase 2 — Content collections (≈ 4 hours)
~400 LOC across one config file + helpers.
- `astro/src/lib/strapi.ts` — `strapiQuery`, `hubQuery`, `absoluteMediaURL`, `rawText`
- `astro/src/content.config.ts` — 7 collections with loaders, zod schemas, transforms
- `astro/src/lib/manualPages.ts` — typed array of static pages (splash card config from `app.config.js`, etc.)
- `astro/src/lib/tags.ts` — port of `src/tags.json`
- Smoke test: `astro/scripts/smoke-collections.ts` calls `getCollection()` for each, prints counts; `yarn smoke` invokes
- **Exit:** smoke test prints non-zero counts for all 7 collections. `astro check` clean.

### Phase 3 — Layout shell + global components (≈ 4 hours)
Everything mounted in `BaseLayout.astro`. No page-specific work yet.
- `BaseLayout.astro` — full `<head>` (charset, viewport, title template, description, link/font preloads, Plausible script per uniform policy, JSON-LD slot, security meta), skip-links, `<main id="main-content" tabindex="-1">`, `pageBackground` prop
- `SiteNav.astro` (mobile via `<details>`)
- `SiteFooter.astro` (white-text-on-dark-slate, AAA contrast)
- `SkipLinks.astro` (port `app.vue` lines 152–216)
- `Breadcrumb.astro` (computed; restored to enabled state)
- `Dialog.vue` (Vue 3 SFC, `client:idle`, mounted in `BaseLayout.astro`)
- `Funding.astro`, `Attachments.astro` (markdown-body helpers)
- `astro/src/styles/global.css` — Tailwind 4 import, brand `@theme`, `.markdown-body` restorations (including `list-style: disc` per playbook pitfall)
- Temporary smoke page `/__smoke__` exercising layout + breadcrumb + Dialog
- **Exit:** smoke page renders correctly, axe-core scan = 0 violations, keyboard walk = clean, Lighthouse a11y = 100. Smoke page deleted after exit. Commit.

### Phase 4 — Pages, in low-risk-first order

#### 4a — Flat content pages (≈ 2 hours)
Routes: `/contact/`, `/privacy/`. Single Strapi `pages` rows with body Markdown.
- `src/pages/[...slug].astro` catch-all that does `getEntry('pages', slug)`, renders body via `markdown-it`, falls back to `/404/`
- **Exit:** both routes pass a11y + perf gates locally.

#### 4b — Collection list+detail pairs (≈ 4 hours)
Routes: `/news/` + `/news/<slug>/`, `/resources/` + `/resources/<slug>/` + `/resources/single-page/`.
- `src/pages/news/index.astro` (list, sorted by `postDate` desc)
- `src/pages/news/[slug].astro` (`getStaticPaths` from `news` collection)
- `src/pages/resources/index.astro` + `[slug].astro` + `single-page.astro` (renders all resources as one continuous page)
- News detail uses `NewsArticle` JSON-LD schema
- **Exit:** all 4 routes pass gates, news list ordering correct, all detail slugs resolve, 404 for missing.

#### 4c — Singleton pages from `pages` collection (≈ 3 hours)
Routes: `/board/`, `/collaboratives/`, `/funding/`, `/meetings/`, `/eligibility/`. Handled by 4a's catch-all + per-page Markdown content components:
- `/eligibility/` mounts `MapEmbed.astro` for the ArcGIS storymap iframe
- `/funding/` mounts `Funding.astro` for funding tables (consumes `R3_site_table_V2.json` + `r3-site-table-2024.json` from `public/`)
- `/board/` shows "last updated" timestamp from collection data
- **Exit:** all 5 routes pass gates. ArcGIS iframe lazy-loads; doesn't tank `/eligibility/` perf below 92.

#### 4d — FAQs (≈ 3 hours)
Routes: `/faqs/` + `/faqs/<slug>/`.
- `src/pages/faqs/index.astro` — uses `FaqAccordion.astro` (native `<details><summary>`)
- `src/pages/faqs/[slug].astro` — single FAQ page mirrors accordion row content
- Search index includes FAQ rows
- Existing redirect `/faqs/2025-r3-nofo-applicant-questions → /faqs/03-08-24-2025-r3-nofo-applicant-questions/` preserved in `_redirects`
- **Exit:** all FAQ routes pass gates, accordion keyboard-accessible, redirect resolves.

#### 4e — Research feed (≈ 1.5 hours)
Route: `/research/`.
- `src/pages/research/index.astro` — list of `hubArticles` rows. Links external to `researchhub.icjia-api.cloud/articles/<slug>` (preserves current behavior — Hub articles aren't re-rendered locally on R3).
- **Exit:** route passes gates, all article links resolve to live Hub URLs.

#### 4f — Interactive pages (≈ 3 hours)
Routes: `/search/`, `/translate/`.
- `src/pages/searchIndex.json.ts` — emit Fuse-friendly JSON from all 5 content collections at build time
- `src/pages/search.astro` — mounts `Search.vue` island `client:idle`
- `Search.vue` — Fuse.js init, query state, result rendering, filter chips by collection
- `src/pages/translate.astro` — port the existing translate widget shell (Google Translate widget is a script tag, fundamentally interactive — small inline `<script>` block, no Vue island needed)
- **Exit:** search returns correct results, filter chips work, translate page works, both routes pass gates including the relaxed perf floor (92 for `/search/`).

#### 4g — Homepage (≈ 4 hours)
Route: `/`.
- `src/pages/index.astro` — splash cards, ContentDoc-equivalent body render (Strapi `pages` row with slug `index`), director letter section, applicant tools (HomePhotoBoxes), news feed (latest 2), hub research feed (`homePage:true` rows)
- LCP image preload via `<link rel="preload" as="image" fetchpriority="high">` for first splash photo
- WebSite + WebPage + BreadcrumbList JSON-LD
- **Exit:** homepage passes all gates, LCP < 2.5s on simulated mobile, hover effects don't shift layout.

#### 4h — Utility pages (≈ 1 hour)
Routes: `/404/`, `/sandbox/` (drop), `/preview/*` (drop).
- `src/pages/404.astro` — port current `error.vue` styling
- Drop `/sandbox.vue` and `/preview/*` (sandbox is dev-only, preview is editor-only)
- Verify `_redirects` preserves all current redirects: `/downloads/** → /`, `/apply → /funding/`
- **Exit:** 404 renders, redirects honored.

### Phase 5 — Search index + sitemap + AI readiness (≈ 1.5 hours)
- `src/pages/searchIndex.json.ts` finalized with all collection types
- `src/pages/siteMeta.json.ts` if any consumer needs page metadata
- `@astrojs/sitemap` integration with `hideFromSitemap` filter callback (excludes `/sandbox/`, `/preview/**`, `/translate/`, `/404/`)
- `astro/public/llms.txt` — describes site purpose for AI crawlers (port current)
- `astro/public/robots.txt` — port current
- JSON-LD schemas centralized in `src/lib/schemas.ts` (Organization, Government Agency, WebSite, WebPage, NewsArticle, BreadcrumbList) — usable from any page's frontmatter
- **Exit:** `/sitemap-index.xml` resolves with expected routes, no excluded routes; `/searchIndex.json` valid; SEO Lighthouse = 100 on every route.

### Phase 6 — A11y polish (≈ 3 hours)
Run all verification gates against every route. Fix everything that fails.
- Playwright + axe-core on all 25 routes × 3 viewports
- `mcp lightcap run_a11y` per route
- `mcp contrastcap check_page_contrast` site-wide
- Manual keyboard walk
- All issues fixed inline
- **Exit:** zero axe-core AA violations across all routes, 100 Lighthouse a11y on every route.

### Phase 7 — Perf polish (≈ 3 hours)
`mcp lightcap run_audit` (mobile preset) per route. For any route below 95:
- Inspect bundle: which chunks ship, which images render, what blocks LCP
- Apply targeted fix (image resize, font swap, defer attribute, dynamic import)
- Re-run, document Δ in CHANGELOG
- **Exit:** all routes ≥ 95 mobile perf, average ≥ 98, current Nuxt baseline beat on every comparable route.

### Phase 8 — CI + branch deploy (≈ 1 hour)
- `astro/scripts/check-all.sh` runs `yarn check`, `yarn test`, `yarn test:e2e`, `astro build`
- Trigger Netlify branch deploy from `migration/astro-full` (separate URL from prod)
- Verify branch deploy resolves all 25 routes correctly
- Verify Plausible analytics fire from branch deploy URL
- **Exit:** branch deploy URL accessible, all routes resolve, audit suite green, CHANGELOG up to v1.0.0-rc.1.

### Phase 9 — Cutover (≈ 30 min, USER-GATED)
**This phase only executes after explicit user approval.**
- User reviews branch deploy URL, signs off
- Update root `netlify.toml` (still on `main`) → `[build] base = "astro"` etc. via PR from `migration/astro-full` into `main`
- Merge `migration/astro-full` → `main` with `--no-ff`
- Verify Netlify reads new `netlify.toml` from `main`, deploys Astro build to prod
- Smoke-test prod URL on at least 5 routes
- **Exit:** prod URL serves Astro build, Plausible shows live traffic on Astro version
- Rollback path: revert merge commit on `main`, Netlify auto-redeploys Nuxt. Documented but not pre-tested.

### Phase 10 — Post-cutover archival (≈ 1 hour)
- Move old Nuxt source: `app.vue`, `pages/`, `components/`, `composables/`, `plugins/`, `creators/`, `content/`, `middleware/`, `server/`, `app/`, `assets/` → `astro/reference/`
- `astro/reference/README.md`: "Frozen Nuxt source as of `<commit-hash>` (deploy `<deploy-id>`). Do not edit. Restore via `git revert <merge-commit>` if needed."
- Drop top-level: `nuxt.config.js`, `app.config.js`, `config.js`, `eslint.config.js`, `vitest.config.ts`, root `package.json` (Astro's is authoritative now), root `yarn.lock`, root `tsconfig.json`, `jsdoc*.json`, `audit-accessibility*.js`, `test-results.json`, `error.vue`, `dist` symlink, `.nuxt/`, `.output/`, all `public/*.json` derived files, `public/docs/`, `public/a11y/`
- Top-level `README.md` rewritten to point at `astro/`; mark Astro 6 + Tailwind 4 as the stack
- Top-level `CHANGELOG.md` gets a "v6.0.0 — Astro migration" header pointing readers to `astro/CHANGELOG.md` for granular entries from this point forward
- **Exit:** repo clean, only `astro/`, top-level docs (README, CHANGELOG, LICENSE), `.git/`, `.github/`, root `netlify.toml` survive at root.

## Cutover safety contract

The following actions require explicit per-step user approval:

- The Netlify config flip (`netlify.toml` change merged to `main`)
- The `--no-ff` merge from `migration/astro-full` to `main`
- The Phase 10 deletion sweep (each batch of removed files shown for confirmation before deletion)
- Any `git push` to remote
- Any force-push, branch deletion, or rebase touching `main`

What you'll see at each gate: a summary of what's about to change, a rollback command, and a yes/no question.

## Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Strapi GraphQL schema differs subtly from i2i (R3 has `posts` not `announcements`, has `faqs` collection i2i lacks) | High | Medium | Phase 2 smoke test catches schema rejections via zod errors; iterate until clean before Phase 3 |
| Tailwind 4 preflight resets break `.markdown-body` rendering | Certain (per playbook) | Medium | Restore `list-style: disc` etc. in `global.css` Phase 3 — explicit in plan |
| Astro scoped styles don't apply to JS-injected DOM (TOC li elements) | Certain (per playbook) | Low | Use `:global()` in `TableOfContents.astro` — explicit in plan |
| ArcGIS iframe drags `/eligibility/` perf below floor | Medium | Medium | `loading="lazy"` + iframe is below-the-fold; if perf still suffers, scope split via inline iframe-loader script |
| Hub CDN rate-limits or downtimes break build | Low | High | Build fails loudly (zod throws); `public/hub-images/` retained as static fallback for thumbnails |
| Plausible regression matches i2i's silent failure | Low (we have a test) | Medium | `tests/e2e/plausible.spec.ts` asserts network request fires; runs every Phase 8 |
| Netlify Pretty URLs setting changes default behavior | Very low | High | Tested at Phase 8 via branch deploy `curl -I /page` returns 301 to `/page/` |
| Mid-migration emergency content update needed on prod | Medium | Low | `main` keeps deploying Nuxt unchanged the entire migration; content edits land on Nuxt as usual until cutover |

## Open verification items (resolved during implementation)

These are flagged for the implementation plan, not blocking design approval:

1. **`TheSplash.vue`, `TheContextFooter.vue`** — confirm both are unused before deleting (grep across `pages/` + `components/`)
2. **`/preview/*` pages** — confirm purpose; current shape suggests editor-preview only, drop unless flagged
3. **`R3_site_table_V2.json` vs `r3-site-table-2024.json`** — confirm whether one is current and one is historical; consolidate if so
4. **Strapi GraphQL field names** — verify against live schema during Phase 2 smoke test (e.g., R3's `posts` vs i2i's `announcements`)
5. **CSP iframe-src list** — verify ArcGIS subdomain coverage matches what the storymap actually loads (e.g., `tiles.arcgis.com`, `services.arcgis.com` may need explicit allow)

## Out of scope

- Strapi schema changes
- Backend API changes (March 2026 audit findings: server-side form validation, rate limiting, CSRF tokens — all backend work, not frontend)
- i2i Plausible bug fix (separate ticket)
- DVFR trailing-slash tightening (separate ticket)
- The Nuxt UI 4 alternative path (Path A) — litmus score doesn't justify it for R3
- Cohorts / spotlights / graduations / biographies content types (i2i-specific, not in R3 Strapi)
- A redesign of the site (Tier 2 visual parity is the explicit goal)

## Success criteria summary

**Phase-level:** Each phase passes its declared exit criteria before the next begins.

**Site-wide before cutover:**
- All 25 routes resolve on the Netlify branch deploy
- All Vitest unit tests pass
- All Playwright e2e tests pass (3 browsers × 3 viewports)
- `mcp lightcap run_audit` (mobile) returns Performance ≥ 95 on every route, average ≥ 98
- `mcp lightcap run_a11y` returns 100 on every route
- Zero axe-core WCAG AA violations
- Plausible network request fires within 5s of every route load (e2e-asserted)
- Visual diff vs current Nuxt build (via `mcp viewcap`) has no user-visible differences
- All current redirects honored
- Sitemap covers expected routes only (excludes hidden/admin)
- Build size: `dist/` ≤ 15 MB
- Build time: `astro build` ≤ 5s
