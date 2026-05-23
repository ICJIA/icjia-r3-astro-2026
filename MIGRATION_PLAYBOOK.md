# R3 Astro Migration Playbook

**Audience:** Future ICJIA developers (and the LLMs assisting them)
migrating a Nuxt + Vuetify site to Astro.

This is the distilled lessons-learned companion to:

- `astro/MIGRATION.md` — phase-by-phase journal with measurements
- `astro/CHANGELOG.md` — what shipped, by version
- `README.md` — current-state overview + a11y methodology

---

## What this migration covered

|  | From | To |
|---|---|---|
| Framework | Nuxt 4 | Astro 6 (`output: 'static'`) |
| UI library | Vuetify 3 | Tailwind 4 + custom components |
| Interactivity | Full Vue SPA | Vue 3 islands via `@astrojs/vue` (3 components only) |
| CMS | Strapi v4 GraphQL | Same backend, Astro Content Collections + zod |
| Hosting | Netlify | Netlify (unchanged) |
| Build output | Static HTML | Static HTML (parity) |

Result: identical visual output ("invisible migration"), 100% WCAG 2.1
AA, perf 90+ mobile, ~95% less client JS shipped.

---

## Architecture decisions worth keeping

1. **`output: 'static'`** — zero JS by default; perf wins are free.
2. **`@astrojs/vue` for ISLANDS ONLY** — selectively hydrate the few
   interactive surfaces (this site: contact form, search dialog, search
   input). All other components are `.astro` and ship zero JS.
3. **Astro Content Collections with a custom Strapi GraphQL loader** +
   zod schemas — see `astro/src/content.config.ts`. The loader hits
   Strapi at build time, caches in `.astro/`, and ships zero runtime
   API dependency.
4. **Tailwind 4 via `@tailwindcss/vite`** — NOT `@astrojs/tailwind`,
   which is Tailwind 3 only.
5. **`@axe-core/playwright` sitemap-driven e2e test** as the build gate
   — see `astro/tests/e2e/a11y-sweep.spec.ts`. Audits every URL in the
   emitted sitemap across mobile / tablet / desktop, hard-fails on any
   violation.
6. **Astro `<Image>` with `image.domains: ['<cms-host>']`** — pulls CMS
   photos at build time, emits optimized webp locally. Removes runtime
   cross-origin round-trips. Big LCP win.
7. **DOMPurify with `afterSanitizeAttributes` hooks** in
   `src/lib/markdown.ts` — same Markdown engine as Nuxt + iframe host
   allow-list + trailing-slash normalization for internal links.
8. **Netlify branch deploys via `--alias=<branch-name>`** — stable
   per-branch URLs (e.g.
   `https://migration-astro-full--illinois-r3.netlify.app`). Never use
   `--prod` until the branch is ready.

---

## Pitfalls (in order of how much they hurt)

### 1. axe "needs review" for color-contrast over images is NOT a pass

axe-core (every harness — `@axe-core/playwright`, axecap, Lighthouse
a11y) cannot pixel-sample. When text sits on a photograph or gradient,
axe flags `color-contrast: needs review` and moves on. **That is
unknown, not pass.**

Use `contrastcap` (`mcp__contrastcap__check_page_contrast`) to
pixel-sample the actual rendered background behind each text node and
compute the real WCAG ratio.

**This site had two latent 1.4.3 AA failures (3.38 and 3.62:1
white-on-photo on the homepage `.photo-box` description text) that axe
+ Lighthouse both reported as 100% AA.** `contrastcap` caught them in
Phase 9. Do not ship a "100% AA" claim without contrastcap if your
design has text on photographs.

### 2. Tailwind 4 preflight resets `list-style: none` on `<ul>/<ol>`

Markdown bodies render without bullets. Re-enable inside `.markdown-body`:

```css
.markdown-body ul { list-style: disc;    padding-left: 1.5rem; }
.markdown-body ol { list-style: decimal; padding-left: 1.5rem; }
```

### 3. `trailingSlash: 'always'` 404s the no-slash form in dev

Astro dev ships a "Did you mean…?" 404 when the no-slash form is hit.
Confusing when typing URLs by hand. Production is fine via Netlify
Pretty URLs (auto-301).

Recommendation: `trailingSlash: 'ignore'` + a sitemap `serialize` hook
to pin the canonical URL shape:

```ts
sitemap({
  serialize(item) {
    if (item.url && !item.url.endsWith('/')) item.url = `${item.url}/`;
    return item;
  },
}),
```

Keep an e2e test that enforces slash-suffixed internal links
independent of Astro config (this repo: `tests/e2e/trailing-slash.spec.ts`).

### 4. axecap `audit_url` times out on pages with embedded cross-origin iframes

The ArcGIS StoryMap iframe on `/eligibility/` holds connections open
indefinitely — `audit_url`'s network-idle wait never resolves. Two
workarounds:

- Inject axe-core via Chrome DevTools MCP `evaluate_script` against the
  live-rendered page. Same engine, real DOM, no network-idle wait.
- `audit_html` against the built `dist/<page>/index.html` (with CSS
  inlined if you need accurate contrast checks). `audit_html` blocks
  embedded-resource network requests, so the iframe doesn't hang.

axe cannot see into a cross-origin iframe anyway, so auditing the host
page DOM is the correct semantic.

### 5. `@astrojs/sitemap` doesn't expose `trailingSlash` in current versions

The TypeScript signature rejects `trailingSlash: true`. Build emits a
warning and silently skips sitemap emission. Use `serialize(item)`
instead (snippet under #3 above).

### 6. `<Teleport>` in a Vue island can destroy site-wide DOM

`Dialog.vue`'s `<Teleport to="body">` was destroying the `<nav>`
containing the skip-links on hydration, on **every page** site-wide.

Native `<dialog>` + `el.showModal()` is browser-promoted to the
top layer and never needs `<Teleport>`. Use the native element.

Keep a regression test for skip-link presence after hydration
(this repo: `tests/e2e/skip-links.spec.ts`).

### 7. `astro check` scans build artifacts under `dist/`

It will report hundreds of irrelevant TypeScript hints from minified
CodeMirror inside `playwright-report/trace/assets/*.js`. Add to
`tsconfig.json` excludes:

```json
"exclude": ["dist", "playwright-report", "test-results", "coverage"]
```

### 8. Strapi v4 GraphQL field shapes vary per collection

Some collections return `data.attributes.<field>`; some are flatter.
Some "obvious" collection names return 0 (this site's `weeklyFaqs`
returned 0 — actual FAQ content lived in `pages` with `slug = 'faqs'`).

Always verify with a `curl` round-trip per collection before writing
zod schemas. Save the example response in `astro/MIGRATION.md` so the
next dev doesn't repeat the discovery.

### 9. `redirects:` materializes real HTML files in `dist/`

Astro's `output: 'static'` writes each `redirects:` entry as a
`<meta http-equiv="refresh">` HTML page. Exclude those routes from the
sitemap with `@astrojs/sitemap`'s `filter` option, or crawlers will see
them as duplicate content.

### 10. Vuetify components don't have 1:1 replacements

Don't re-port APIs — re-port **behavior**. Some examples:

| Vuetify | Astro equivalent |
|---|---|
| `<v-container fluid>` | `<div>` + CSS `max-width: none; padding: 0 16px` |
| `<v-textarea>` | native `<textarea>` + focus styles |
| `<v-row> + <v-col cols=… md=…>` | CSS grid or flexbox |
| `v-dialog` | native `<dialog>` + `el.showModal()` |
| `v-app v-main` shell | semantic `<header>` + `<main>` + `<footer>` |

Trying to re-create Vuetify's class system in Tailwind creates noise
and fights the framework. Look at what the component does on screen,
then write the simplest CSS that does that thing.

---

## The four-tool a11y audit methodology

For any site claiming WCAG 2.1 AA conformance:

| Tool | Catches | When to use |
|---|---|---|
| **axe-core via Playwright** (`@axe-core/playwright`) | Structural violations across viewports | Every build (CI gate) |
| **`axecap` MCP** (`mcp__axecap__audit_url`) | Same engine, ad-hoc audit | Spot checks during dev |
| **`lightcap` Lighthouse** (`mcp__lightcap__run_a11y`) | Some a11y rules axe doesn't + 0–100 score | Stakeholder reporting + mobile spot-check |
| **`contrastcap` pixel sampling** (`mcp__contrastcap__check_page_contrast`) | Real contrast ratios on text-over-image | Required when design has text on photos / gradients |

A site can pass the first three with 0 violations / 100/100 and still
have real 1.4.3 failures over images. `contrastcap` is the gap-filler.

---

## Concrete files to copy / adapt

- `astro/src/content.config.ts` — Strapi GraphQL loader pattern + zod schemas
- `astro/src/lib/markdown.ts` — DOMPurify with iframe allow-list + trailing-slash normalization
- `astro/src/lib/slug.ts` — `ensureTrailingSlash` helper used in content paths
- `astro/tests/e2e/a11y-sweep.spec.ts` — sitemap-driven axe sweep (the CI gate)
- `astro/tests/e2e/trailing-slash.spec.ts` — enforces slash-suffixed internal links
- `astro/tests/e2e/skip-links.spec.ts` — regression test for the `<Teleport>` site-wide-DOM-destruction class of bug (#6)
- `astro/scripts/check-all.sh` — single-command pre-push verification (`astro check && vitest && astro build && playwright`)
- `astro/astro.config.ts` — canonical Astro 6 + Tailwind 4 + sitemap config with `serialize` hook
- `astro/src/components/SkipLinks.astro` — native skip-nav without `<Teleport>`

---

## Phase template for the next migration

This shape worked here. Adapt per project.

| Phase | Goal | Exit criteria |
|---|---|---|
| 0 | Baseline existing site | Lighthouse perf / a11y / BP / SEO captured per route |
| 1 | Astro 6 scaffold | App boots, BaseLayout renders, Tailwind 4 working |
| 2 | CMS content collections | `astro check` clean, content from CMS rendering |
| 3 | Nav + footer + skip links | Site shell parity with original at every viewport |
| 4 | Page routes | Every URL the old site served now in Astro |
| 5 | Search + sitemap + redirects | Sitemap emitted, search returns results |
| 6 | A11y polish | `a11y-sweep.spec.ts` 0 violations, Lighthouse 100/100 |
| 7 | Perf polish | Lighthouse perf ≥ 90 mobile on every route |
| 8 | "Invisible migration" parity | Visual diff vs source = identical at every page |
| 9 | Final audit + deploy + handoff doc | Four-tool a11y sweep clean, branch deploy live, this playbook updated for any new pitfalls discovered |

---

## Source migration metadata

|  |  |
|---|---|
| Repo | <https://github.com/ICJIA/icjia-r3-astro-2026> |
| Migration branch | `migration/astro-full` — merged into `main` on cutover (2026-05-23) and deleted |
| Pre-cutover `main` | `pre-astro-cutover` git tag (last Nuxt 4 state, recoverable) |
| Cutover commit / release tag | `v0.10.0` |
| Final version | `astro/package.json` v0.10.0 |
| Phases | See `astro/MIGRATION.md` and `astro/CHANGELOG.md` |

---

*If you find a new pitfall worth recording during your migration, please
add it here — keep this playbook a living document so each successive
ICJIA migration starts from a stronger baseline.*
