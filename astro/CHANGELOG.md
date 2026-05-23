# Astro Migration Changelog

All notable changes to the Astro rebuild of r3.illinois.gov live here.
Most recent at the top; entries grouped by date, days in reverse
chronological order.

---

## v1.0.0 — 2026-05-23

First post-cutover release. Marks the Astro rebuild as the production
site (no more "migration" framing) and rolls up the post-cutover
verification sweep.

### Production audit — all 26 sitemap routes

**axe-core sweep (Playwright + axe-core 4.11.4, all viewports)**

| | |
|---|---:|
| Pages tested | 26 |
| Viewports | desktop / tablet / mobile (78 scans) |
| **Total violations** | **0** |
| Total passes | 1772 |
| Pages passing | 26 / 26 |
| Skip-link coverage | 78 / 78 |

Single violation surfaced during the first pass — `scrollable-region-focusable`
(WCAG 2.1.1 A) on the `/documentation/accessibility/` results table wrapper
itself (overflow-x with no keyboard focus). Fixed by adding
`role="region"`, `aria-labelledby="results"`, and `tabindex="0"` to
the wrap in `scripts/generate-a11y-report.mjs` and the live page; re-run
came back clean.

**Lighthouse mobile, all 26 sitemap routes (live r3.illinois.gov)**

24 routes at Perf 98–100. Two outliers:

| Route | Perf | Note |
|---|---:|---|
| `/news/icjia-awards…/` | 94 | LCP 3.1s; remote Strapi-hosted body image. ~204 KiB unoptimized. |
| `/research/` | 86 | LCP 4.1s; 4× Research Hub splash images served at ~819 KiB total. Hub-side asset, outside this repo. |

Astro A11y / BP / SEO = 100 across all 26 routes (modulo the pre-existing
`/eligibility/` BP=96 ArcGIS-iframe inspector warning, carried over from
the Nuxt baseline; and `/resources/single-page/` SEO=66, intentionally
`noindex` — the printable view).

**axe-core via `axecap` (desktop, AA, 12 representative routes)** — 0
violations on every route audited.

### Aggregate vs. the Nuxt baseline

| Metric | Nuxt P0 | Astro v1.0.0 |
|---|---:|---:|
| Mobile Perf avg | ≈ 79 | **≈ 98** |
| Mobile Perf min | 52 (`/eligibility/`) | **86** (`/research/`) |
| Routes ≥ 95 mobile | 4 / 25 | **24 / 26** |
| axe-core violations | 3 (best-practice, `/404`) | **0** |
| Lighthouse a11y avg | 100 | 100 |

### Misc

- `package.json` bumped 0.10.0 → 1.0.0.
- Public `/documentation/accessibility/` report regenerated with today's
  snapshot (1772 passes, 0 violations).
- Migration is complete; "migration" terminology retired from this file
  going forward.

---

## 2026-05-23 — `font-display: optional` on Lato / Roboto / Raleway → kill `/eligibility/` mobile CLS

The earlier iframe-inline-style fix made the markup correct but **did not move
CLS**. The post-deploy lightcap re-run still showed CLS 0.20 on every warm-iframe
run. Extracting `layout-shifts` from the Lighthouse JSON pinned the culprit:

```
selector: div.page-layout > div.page-content > article.markdown-body > p
score:    0.199
```

A paragraph inside the Strapi-rendered body — not the iframe. Classic
font-swap reflow: first paint uses the fallback (Arial / system-ui),
then Lato/Roboto/Raleway arrive late under Lighthouse's 3G simulation
and the paragraph reflows. The iframe loading at roughly the same
moment was just coincident, not causal.

Fix: replace the fontsource `@import` lines in `global.css` (which
hard-code `font-display: swap`) with manual `@font-face` declarations
pointing at the same fontsource `.woff2` files but pinning
**`font-display: optional`**. Latin subset only — 6 files
(Roboto-Variable, Raleway-Variable, Lato 300/400/400-italic/700),
totalling ~150 kB.

Trade-off: a first-time visitor on a slow connection won't see the
custom font on first paint (the browser sticks with the fallback if
the .woff2 isn't ready within ~100 ms). On a return visit the .woff2
is cached and renders immediately. No FOUT, no reflow, no CLS.

Verification: `astro check` 0/0/0, vitest 120/120, build clean, dist
includes the 6 `latin-*.woff2` files. CSS has `font-display: optional`
and no `font-display: swap`. Awaiting deploy to re-run the
`/eligibility/` mobile audit.

---

## 2026-05-23 — About dropdown: section headings are now clickable

User report: clicking the "About the R3 Program" or "Applicant Tools"
text in the desktop / mobile drawer dropdown did nothing — they were
rendered as non-interactive `<li class="...-dd-section">` labels, faithfully
porting the Nuxt original. Any item that looks like a menu entry must
actually navigate; otherwise the cursor / focus shift on hover is a lie.

- `navConfig.ts`: `NavSection` now carries optional `href` + `external`.
  `About the R3 Program` is wired to the ArcGIS StoryMap (the same target
  the duplicate inner link below it pointed at — that inner link is removed
  to avoid the doubled entry). `Applicant Tools` is wired to `/resources/`
  (the page where the applicant toolset actually lives).
- `SiteNav.astro`: both desktop dropdown and mobile drawer render the
  section's text inside an `<a>` when `href` is set. Existing
  `(opens in new window)` and `sr-only` patterns reused for external targets.
- CSS: new `.site-nav__dd-section-link` and `.site-nav__drawer-section-link`
  classes inherit the parent section's heading look (bold Roboto-900, gray,
  uppercase on mobile) and `text-decoration: none` by default. Hover /
  `:focus-visible` adds the underline and primary-color shift so keyboard
  and pointer users get a clear affordance — the section still *reads* as
  a heading at rest. Mobile-drawer link fills the full 44px tap row.
- TypeScript narrowing fixed in `dropdownActive(children)` so the optional
  `NavSection.href` doesn't get passed as `string | undefined` to `isActive`.
  `astro check` back to 0/0/0; vitest 120/120; build 28 pages clean.

---

## 2026-05-23 — `/eligibility/` mobile perf fixes

Post-cutover live re-audit found `/eligibility/` mobile Perf sitting at
**~66 (median of 5 runs)** vs. desktop **96**, with **LCP ~10s** and
**CLS 0.20** — both dominated by the ArcGIS StoryMap iframe loading
cross-origin on a cold Lighthouse 3G simulation. The local-preview
measurement during Phase 7 read 99 because the iframe was warm-cached.

Two targeted fixes, no UX change:

- **Conditional `<link rel="preconnect" href="https://storymaps.arcgis.com" crossorigin>`** on `/eligibility/` only (`preconnectOrigins` prop on `BaseLayout`, passed from `[...slug].astro` when `data.slug === 'eligibility'`). Warms DNS + TLS before the iframe is parsed; other routes don't pay the connection-slot cost.
- **Strip the invalid `px` unit from iframe `height`/`width` attributes** in `markdown.ts`. Strapi authors the embed as `height="1500px"`, which is invalid per HTML5 (the iframe attribute is a non-negative integer, not a CSS length). Stripping the unit makes the attribute parse as an integer. Post-deploy lightcap re-run showed the attribute alone wasn't enough — modern browsers tolerate the bad unit but the iframe still doesn't bind a CSS box, so on the runs where the iframe rendered within Lighthouse's measurement window, CLS held at 0.20.
- **Promote iframe dimensions to inline `style`** (same DOMPurify hook). `style="width: 100%; max-width: 100%; height: 1500px"` is authoritative — browsers honor it at parse time, before the iframe's cross-origin content arrives, killing the layout shift at source. Falls back to `aspect-ratio: 4 / 3` when the iframe has no explicit pixel height. New `markdown.test.ts` cases (`strips invalid CSS units…`, `leaves bare-integer…`, `promotes iframe dimensions to inline style…`, `falls back to aspect-ratio…`) guard the behavior.

Verification: `astro check` 0/0/0, vitest 118/118, build clean, dist
inspection confirms preconnect emits on `/eligibility/` only and
`<iframe … height="1500" …>` (no `px`).

---

## 2026-05-23 — Production cutover

The Astro rebuild is live on `main` and deployed to
[r3.illinois.gov](https://r3.illinois.gov). The Nuxt 4 + Vuetify 3 era is
over; the repository is Astro-only going forward.

### What shipped

- `main` force-replaced with the `migration/astro-full` tip (`c663ffc`).
  Tagged **`v0.10.0`** at the cutover commit.
- **`pre-astro-cutover`** tag preserves the final Nuxt 4 `main` state
  (`00da1b2`) as a recoverable safety net. The Nuxt source also remains
  on the historical `feat/nuxt4-migration` branch.
- Netlify production project (`illinois-r3`) rebuilt automatically from
  the new `main`; `netlify.toml` `base = "astro"` was already in place.
- 22 stale dependabot PRs against Nuxt-era dependencies (axios,
  basic-ftp, h3, defu, devalue, rollup, simple-git, dompurify,
  node-forge, fast-xml-parser, lodash, happy-dom, etc.) closed with an
  explanatory comment.
- `migration/astro-full` branch deleted from `origin` (now redundant
  with `main`).

### Production verification

| Check | Result |
|---|---|
| `<meta name="generator" content="Astro …">` | present |
| Astro scoped-style markers (`data-astro-cid-*`) | present |
| `/_astro/*.webp` build-pipeline images | present |
| Vuetify / `v-app` / `v-container` references | **0** |
| About → R3 Program StoryMap URL | `8607e513363e49f5b02a6e7d8a82432a` ✓ (matches the May 11 Nuxt update) |

### Mobile Lighthouse parity vs. previous Nuxt production

Re-measured on cutover day against a side-by-side run of the live
Nuxt site (just before push) and the local Astro preview (`yarn
preview`) on identical viewports.

| Route | Nuxt P0 | Astro now | Δ |
|---|---:|---:|---:|
| `/` | 63 (LCP 6.8s) | **100** (LCP 1.7s) | **+37** |
| `/eligibility/` | 59 (LCP 14.1s) | **90** | **+31** |
| `/collaboratives/` | 68 | **98** | **+30** |

A11y, Best Practices, and SEO all remain 100 on the routes audited
during cutover — matching the Nuxt baseline at those categories.

### Two pre-cutover commits intentionally discarded from main

The Nuxt-era `main` tip carried two commits that did not need to be
preserved through the force-replace:

| Commit | Reason discarded |
|---|---|
| `00da1b2 fix: meta` | Accidentally committed Astro `.astro/` build artifacts + `playwright-report/` + `test-results/` — all generated files, all `.gitignore`d in the Astro tree. |
| `54f6627 chore: update About → About the R3 Program StoryMap link` | Already incorporated in the Astro tree (verified `navConfig.ts` carries the new StoryMap ID `8607…32a`). |

Both remain recoverable via the `pre-astro-cutover` tag.

---

## v0.10.0 — 2026-05-15

### Public-facing accessibility audit report

A live audit report is now published at `/documentation/accessibility/`
(modeled on `dvfr.illinois.gov/docs/accessibility/`) showing the latest
axe-core sweep across desktop / tablet / mobile viewports for every URL
in the sitemap. Current snapshot: 25 pages × 3 viewports = 75 scans,
**0 violations**, 1770 axe-rule passes, skip-link coverage 75/75.

- New script: `astro/scripts/generate-a11y-report.mjs` — Playwright +
  axe-core 4.11.4 + `@axe-core/playwright`. Reads `dist/sitemap-0.xml`,
  audits each URL × 3 viewports against `http://localhost:4321/`
  (configurable via `A11Y_BASE_URL`), and emits the styled HTML report.
- Report page: `src/pages/documentation/accessibility/index.astro`
  (initially shipped as a static `public/` file, then refactored to a
  routed Astro page so both `/documentation/accessibility/` and
  `/documentation/accessibility/index.html` resolve in dev and prod —
  Astro dev's static-file handler doesn't directory-index `public/`).
- Cloud `ultrareview` across the full `migration/astro-full → main` diff
  returned zero findings.

---

## v0.9.0 — 2026-05-15

### Phase 9 — Exhaustive accessibility audit + parity polish

**Comprehensive 4-tool a11y sweep across all 25 sitemap pages.** The site
is verified 100% WCAG 2.1 AA via four independent tools — axe-core (via
both `axecap` and the existing Playwright e2e sweep), Lighthouse `lightcap`
(desktop + mobile), and `contrastcap` pixel-sampling for text-over-image
regions. Results: 0 violations, 100/100 every route, lowest pixel-sampled
contrast ratio 6.11:1. README accessibility section refreshed with the
new four-tool table.

**`HomePhotoBoxes` description text contrast (WCAG 1.4.3 AA).**
`contrastcap` pixel-sampling against the actual photos flagged the FAQs
and Collaboratives photo-box description text as failing — white over
~#8a8c8d (3.38:1) and ~#858786 (3.62:1) respectively, where 4.5:1 is
required. axe-core cannot sample pixels over images and only marks these
as "needs review," which is why the failure had been latent. Strengthened
the `.photo-box__overlay` gradient endpoint from `rgba(0,0,0,0.1)` to
`rgba(0,0,0,0.5)`, keeping the gradient character but raising all
over-image text to ≥6.11:1 worst case (re-measured: FAQs description
6.11, Collaboratives 6.24, Eligibility 11.47, Resources 9.80).

**`/eligibility/` ArcGIS embed full-bleed.** The live r3.illinois.gov
`/eligibility/` renders its catch-all body inside a `<v-container fluid>`,
so the ArcGIS StoryMap embed (and the body text) stretch the full viewport
width with a 16px inset — not capped at 1080px like the other catch-all
pages on the original. The Astro version had been capped. Added an
`isFluid` flag in `[...slug].astro` (`data.slug === 'eligibility'`) that
drops the `max-width` on the page layout; the existing `1rem` (16px) side
padding already matched the original's container inset. Verified at 1440px
viewport the iframe now renders at **1393px @ left:16**, byte-for-byte
the same width/position as the live site.

**`trailingSlash: 'ignore'`.** Astro's `'always'` mode 404s the no-slash
form of every route during `astro dev` — a "Did you mean…?" hint that's
helpful for one wrong click but confusing when typing URLs by hand.
Switched to `'ignore'`: dev now serves both `/eligibility` and
`/eligibility/` with 200. Production behavior is unchanged — Netlify
Pretty URLs still 301s non-slash → slash for SEO (verified on the branch
deploy: `GET /eligibility` → 200, final URL `/eligibility/`); the sitemap
integration now uses a `serialize` hook to pin every `<loc>` to
`/`-suffixed canonical form; the BaseLayout `<link rel="canonical">`
continues to use `data.path` from `content.config.ts`
(`ensureTrailingSlash`-normalized); and `trailing-slash.spec.ts` continues
to enforce slash-suffixed internal links independent of this config.

**Netlify branch deploy.** Bundled the three fixes above into one
`netlify deploy --alias=migration-astro-full` ship. Live at
<https://migration-astro-full--illinois-r3.netlify.app>.

---

## v0.8.0 — 2026-05-14

### Phase 8 — CI gate + "invisible migration" parity pass + Astro-only branch

**CI gate**

- `astro/scripts/check-all.sh` — single-command pre-push verification
  (astro check → vitest → build → Playwright e2e).

**Invisible-migration parity pass.** The Phase 4 page ports were rebuilt to
match the live r3.illinois.gov site exactly:

- **Top nav** rebuilt from the live `app.config.js` navMenu: a 4-item bar
  (`Home` / `About ▾` / `Eligibility` / `Contact`) + Search icon, with a
  real "About" dropdown (sections, divider, external StoryMap link) and a
  left-sliding mobile drawer. Replaces the migration's flattened 10-item bar.
- **Footer** brought to exact parity — `#11568e` upper band / `#0e4474`
  legal bar, Governor URL corrected, underlined links.
- **`/funding/`** is now a meta-refresh redirect to `/` (the live site has
  no funding content page); dropped from the nav and the sitemap; `/apply`
  repointed to `/`.
- **`/contact/`** ported as a real custom page — the "Have R3 questions"
  card + a working contact form (`ContactForm.vue` island, posts to the
  same two endpoints as live). It was previously a bare Strapi-body stub
  served by the catch-all.
- **Breadcrumb bar removed** site-wide — the live app keeps
  `TheBreadcrumbBar` commented out.
- **`/resources/`** + **`/research/`** rebuilt as image-card grids
  (cover/splash thumbnails, "Find out more »" / "Read Article (Web) »").
  `resources` collection now queries Strapi `cover` + `ranking`.
- **`/news/`** list restyled as `#fafafa` cards with "Read more »";
  heading "News and Updates".
- **Catch-all pages** gained the "Navigation" TOC sidebar when
  `showTableOfContents` is set, plus the `/board/` "last updated" line.
- **`/eligibility/`** — removed the duplicate injected `MapEmbed`; the
  ArcGIS map renders from the Strapi body markdown at the correct position,
  as on live.
- **`/404/`** enriched with the "Oops" headline + quick-link button row.
- **`/translate/`** buttons stack in a single centred column.
- **`a11y-sweep.spec.ts`** is now sitemap-driven — it audits every URL in
  the built `sitemap.xml` (+ `/404/`): 26 routes × 3 viewports = 78
  axe-core scans, **0 WCAG 2.1 A/AA violations**. Results recorded in the
  root `README.md`.
- `astro check` now excludes `playwright-report/` / `test-results/` /
  `coverage/` (test artifacts were tripping 200+ spurious hints).
- Internal links now honor `trailingSlash: 'always'` — `HomePhotoBoxes`
  hrefs fixed and `markdown.ts` normalizes Strapi-body content links (a
  non-slash internal link 404s on `astro dev` and forces a 301 hop in
  production). Guarded by `tests/e2e/trailing-slash.spec.ts`.

**Astro-only branch**

- The Nuxt 4 + Vuetify source (app.vue, pages/, components/, creators/,
  nuxt.config.js, root package.json, etc. — 230+ files) was deleted from
  `migration/astro-full`; it remains recoverable in git history and on
  `main`. Root `README.md` rewritten for the Astro era.

Full Playwright e2e suite green against a production build: 195 tests.

---

## v0.7.0 — 2026-05-14

### Phase 7 — Performance polish

- Mobile Lighthouse baseline (lightcap MCP, Lighthouse v13) found every
  route already ≥ 95 except the homepage, which was unstable at 93–96
  with LCP climbing 2.8s → 3.2s — raw `<img>` tags re-fetching full-size
  Strapi JPEGs cross-origin on every load.
- `HomeSplashCard` + `HomePhotoBoxes` converted from raw `<img>` to Astro
  `<Image>` (`inferSize` + responsive `widths`/`sizes`); `r3.icjia-api.cloud`
  authorized in `astro.config.ts` `image.domains`. Homepage images are now
  build-time responsive webp served from `/_astro/` — the LCP image went
  100 kB JPEG → 21 kB webp (400w mobile variant). Homepage `/` perf
  93–96 → stable **97–98**, LCP → 2.3–2.5s.
- The stale `preloadImages` prop (pointed at the now-unused Strapi URL)
  was dropped; `<Image loading="eager" fetchpriority="high">` carries LCP
  priority. `home.spec.ts`'s preload assertion rewritten to test intent —
  eager, high-priority, locally-optimized.
- **Final: mobile Perf ≥ 95 on every route, average ≈ 99.2** (Nuxt P0
  average ≈ 79). A11y = 100 and SEO = 100 every route; BP = 100 every
  route except `/eligibility/` = 96 — the pre-existing ArcGIS storymap
  iframe Issues-panel warning, carried over verbatim from the Nuxt
  baseline.
- Known headroom (render-blocking `BaseLayout` CSS; director-photo
  image-delivery) documented in `MIGRATION.md` — not blocking; Phase 7
  exit criteria met.

---

## v0.6.0 — 2026-05-14

### Phase 6 — Accessibility polish

- `tests/e2e/a11y-sweep.spec.ts` — site-wide axe-core AA sweep
  (`wcag2a` / `wcag2aa` / `wcag21a` / `wcag21aa`) across 18 routes ×
  3 viewports = 54 scans. **0 violations.**
- Lighthouse a11y = 100 on every route (lightcap MCP, mobile preset).
  The first-pass run surfaced two issues axe's tag filter doesn't cover:
  - `label-content-name-mismatch` (WCAG 2.5.3, Level A) on `/` —
    `HomeSplashCard` carried an `aria-label` that omitted the visible date
    text. Dropped it; the link's visible text (title + tagline + date) is
    now its accessible name.
  - `heading-order` on `/news/` — `NewsCard` gained a `headingLevel` prop
    (default `h3`, correct on the homepage under the `h2` "News & Updates"
    section). `/news/` index passes `h2` so card titles follow its `h1`
    without skipping a level.
- Keyboard focus-order verification (static source inspection + live
  Tab-key walk via Chrome DevTools) uncovered and fixed a **serious
  site-wide regression**: `Dialog.vue`'s `<Teleport to="body">`
  mishydrated under Astro's `client:idle` island boundary and destroyed
  the skip-links `<nav>` on every page (WCAG 2.4.1 Bypass Blocks, Level
  A). axe-core and Lighthouse missed it because they run before
  `client:idle` fires. Removed the Teleport — a native `<dialog>` opened
  with `showModal()` is top-layer-promoted and never needed it; modal
  display, `::backdrop`, and the native focus trap all still verified.
- `tests/e2e/skip-links.spec.ts` — regression guard that explicitly waits
  past `client:idle` hydration before asserting both skip links survive
  and stay `<body>`'s first child.
- Full Playwright e2e suite green throughout — 162 tests
  (was 147 before the skip-links guard).

---

## v0.5.0 — 2026-05-14

### Phase 5 — Sitemap + JSON-LD + AI readiness + Plausible guard

- `src/lib/schemas.ts` centralizes WebSite, WebPage, NewsArticle,
  BreadcrumbList JSON-LD builders; BaseLayout + `/news/[slug]` now source
  their JSON-LD from it (Task 5.1, committed 2026-05-08)
- `astro/public/robots.txt`, `astro/public/llms.txt` ported (Task 5.2,
  committed 2026-05-08)
- All static assets ported from `public/` to `astro/public/` — favicon,
  og-image, hero photos, `downloads/`, `hub-images/`, table JSON (Task 5.3,
  committed 2026-05-08)
- `@astrojs/sitemap` integration verified against e2e
  (`tests/e2e/sitemap.spec.ts`): index resolves, every URL is
  trailing-slash canonical, `/sandbox/` `/preview/` `/translate/` `/404/`
  stay excluded
- Plausible regression e2e (`tests/e2e/plausible.spec.ts`) confirms the
  `<script>` tag fires on every sample route — preconnect + script tag +
  network hit — guarding against the silent-analytics bug i2i currently has
- `astro check` cleared to 0 errors / 0 warnings / 0 hints: explicit
  `is:inline` directive added to the two JSON-LD `<script>` tags

---

## v0.4.0 — 2026-05-08

### Phase 4 — Page ports (all 25 routes)

- `[...slug].astro` catch-all serving 8 single Strapi page rows: /contact/,
  /privacy/, /board/, /collaboratives/, /funding/, /meetings/, /eligibility/,
  /faqs/. Conditional MapEmbed on /eligibility/ (lazy-loaded ArcGIS storymap
  with skip-link).
- `/news/` list (sorted postDate desc) + 8 `/news/<slug>/` detail pages with
  NewsArticle JSON-LD.
- `/resources/` list (sorted alpha) + 4 `/resources/<slug>/` detail + 1
  `/resources/single-page/` (all-on-one printable view, noIndex).
- `/research/` Hub article feed (12 articles, external links to icjia.illinois.gov/researchhub).
- `/search/` Vue 3 island (Search.vue) consuming /searchIndex.json (33 rows
  across 5 collections); filter chips by content type. `/searchIndex.json`
  emitted at build time from all collections via Astro endpoint.
- `/translate/` Google Translate language buttons (5 languages: Spanish,
  Polish, Chinese, Tagalog, Arabic — external links matching legacy site).
- `/` real homepage — splash row (HomeSplashCard ×2 with per-card color
  wash), Director Adams letter section, "Applicant Tools" photo grid
  (HomePhotoBoxes ×4: Eligibility / FAQs / Collaboratives / Resources),
  latest 2 news cards, news-archive link. LCP preload on first splash.
- `/404.astro` — minimal 404 with home link, noIndex.
- `astro/public/_redirects` — `/downloads/** → /`, `/apply → /funding/`,
  FAQ alias preserved.

### Phase 4 reframings (justified deviations from the plan)

- **Funding.astro removed** — the plan called for tables driven by R3_site_table_*.json,
  but those JSON files are census tract eligibility data, not grant
  recipient tables. The legacy `Funding.vue` actually shows a NOFO hero;
  the catch-all already serves the Strapi `funding` body. Tables would be
  wrong content. JSON files retained in `astro/public/` for future use.
- **FaqAccordion + /faqs/<slug>/ removed** — Phase 2 found the
  `weeklyFaqs` collection has 0 published rows, and the legacy /faqs/ uses
  the Strapi `pages.faqs` body (single page) for FAQ Q&A. The catch-all
  already serves /faqs/ correctly; no individual FAQ slugs to route.
- **Translate page** — actual Nuxt `pages/translate.vue` uses 5 external
  Google Translate links (not the embedded widget the plan template
  assumed). Faithfully ported the link-based approach.
- **Hub article URLs** — actual Hub URL pattern is
  `https://icjia.illinois.gov/researchhub/articles/<slug>` (not
  `researchhub.illinois.gov`); verified against legacy `pages/research/index.vue`.

### Test coverage

- Vitest unit: 114 tests across 10 files
- Playwright e2e: 23 routes covered with 70+ test runs across mobile/tablet/desktop
- Type-check: 0 errors / 0 warnings / 2 pre-existing hints (BaseLayout
  inline LD+JSON, news slug — non-blocking)

---

## v0.3.0 — 2026-05-08

### Phase 3 — Layout shell + global components

- `src/styles/global.css` — Tailwind 4 + brand `@theme` (8 colors, 3 font
  tokens), `.markdown-body` h1-h6 + ul/ol/p/a/table restorations, `.sr-only`
  utility, prefers-reduced-motion default, html/body baseline. Lato uses
  static-weight imports (no variable-axis published on npm).
- `SkipLinks.astro` — direct port of app.vue lines 152-216 (focus-visible
  clip-path reveal pattern, AAA contrast)
- `SiteNav.astro` + `navConfig.ts` — fixed 90px white app-bar, mobile
  hamburger via native `<details>` (zero JS), 44px tap targets, NAV_ITEMS
  ported from app.config.js navMenu (10 items: Funding/Eligibility/News/
  Meetings/Resources/FAQs/Research/Collaboratives/Board/Contact). The Nuxt
  "About" dropdown header was correctly NOT promoted to a link (no /about/
  page exists).
- `SiteFooter.astro` — two-band layout matching the actual Nuxt
  TheContextFooter + TheFooter (uppercase Raleway nav strip + State of
  Illinois legal bar). AAA-contrast white-on-slate, 44px tap targets.
- `Breadcrumb.astro` — URL-derived trail, hidden on `/`, `/sandbox/`,
  `/faqs/` (matches app.vue HIDE_ON logic), schema.org-ready
- `Dialog.vue` — Vue 3 SFC island via native `<dialog>` + showModal();
  hydrates `client:idle`. Custom-event API (`r3-dialog:open`) for
  Astro→Vue island communication.
- `Attachments.astro` — markdown-body helper for download lists (reusable;
  R3's Strapi types don't currently expose attachments but the helper is
  ready for any future row shape that does)
- `BaseLayout.astro` — composes all 5 components + Plausible <script>
  in head (full script tag, NOT just preconnect — guards against the i2i
  silent-analytics regression), JSON-LD WebSite schema, scroll-to-top
  vanilla button, external-link interceptor (whitelists icjia.illinois.gov
  / illinois.gov / arcgis.com)
- Phase 3 smoke (live `mcp lightcap run_a11y --preset mobile`):
  **Lighthouse Accessibility = 100/100** on `/smoke/` exercising every
  component + dialog interception
- Cross-collection note: NAV_ITEMS includes /research/ even though the
  research page lands in Phase 4e (Hub article feed); link 404s until
  Phase 4e ships, which is expected for a forward-looking entry.

### Vitest infrastructure addition

- `astro/src/__mocks__/astro-content.ts` shim from Task 2.6 enables
  vitest unit testing of `astro:content` schema validation (Astro's
  virtual module isn't accessible from vitest's module resolution).

### Notable plan deviations (all justified, all documented in MIGRATION.md)

- App's "About" dropdown header was treated as non-routable (correct per
  app.config.js `navMenu` — it has children but no `link:` field)
- SiteFooter has no mailing address (the spec template's "300 W. Adams"
  was i2i-era; R3's actual footer doesn't carry address copy)
- Smoke page can't use `__smoke__.astro` filename (Astro 6's router skips
  files starting with `_`); used `smoke.astro` instead

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
