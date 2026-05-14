# ICJIA R3 Program Website

![R3 - Restore. Reinvest. Renew.](astro/public/og-image.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
![Node](https://img.shields.io/badge/Node-22.22.2-339933?logo=node.js&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white)

Official website for Illinois' R3 (Restore, Reinvest, Renew) program.

🌐 **Live Site**: [https://r3.illinois.gov](https://r3.illinois.gov)

---

## Stack

- **Framework**: Astro 6 (`output: 'static'`), Tailwind CSS 4 via `@tailwindcss/vite`
- **Islands**: Vue 3 via `@astrojs/vue` — only the Search, Dialog, and Contact
  form hydrate; every other component ships zero JavaScript
- **Content**: live Strapi (`r3.icjia-api.cloud`) + Research Hub
  (`researchhub.icjia-api.cloud`) GraphQL, fetched and zod-validated at build
  time — no markdown fixtures on disk, no prebuild step
- **Hosting**: Netlify (build base = `astro/`)
- **Analytics**: Plausible (`plausible.icjia.cloud`)

## Quick start

```bash
cd astro
nvm use         # Node 22.22.2
yarn install
yarn dev        # http://localhost:4321
yarn build      # writes astro/dist/
yarn preview    # serves astro/dist/
yarn test       # vitest unit tests
yarn test:e2e   # playwright e2e (mobile / tablet / desktop)
./scripts/check-all.sh   # full pre-push gate: check + test + build + e2e
```

## Project structure

- `astro/` — the website source (this is the entire app)
- `astro/CHANGELOG.md` — granular per-release changelog
- `astro/MIGRATION.md` — per-phase migration record (baselines, verification)
- `docs/superpowers/specs/` — design spec
- `docs/superpowers/plans/` — implementation plan
- `netlify.toml` — Netlify build config + security headers (build base `astro/`)

## Standards

- **Mobile Lighthouse Performance**: ≥ 95 on every route
- **Accessibility**: 100 on every route — WCAG 2.1 AA, IITAA, ADA Title II
- **Best Practices**: 100 on every route
- **SEO**: 100 on every route

## Accessibility

Accessibility is verified two ways on every build:

- **axe-core sweep** — `tests/e2e/a11y-sweep.spec.ts` runs axe-core
  (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) against every route in the
  emitted `sitemap.xml`, across mobile / tablet / desktop viewports.
- **Lighthouse** — accessibility score audited per route via the `lightcap`
  Lighthouse runner.

The full axe-core results and any mitigations are recorded below — see
[**Accessibility audit results**](#accessibility-audit-results).

### Accessibility audit results

Latest sweep — every route in the built `sitemap.xml` (25 routes) plus
`/404/`, across mobile / tablet / desktop:

| Metric | Result |
|--------|--------|
| Routes audited | 26 (25 sitemap + `/404/`) |
| Viewports | 3 — mobile, tablet, desktop |
| Total axe-core scans | 78 |
| WCAG 2.1 A / AA violations | **0** |
| Lighthouse accessibility (per route) | **100** |

Tags audited: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. The sweep runs on
every build (`tests/e2e/a11y-sweep.spec.ts`) and hard-fails on any violation.
The current sweep is clean — no outstanding mitigations.

**Mitigations applied during the Astro rebuild** (full detail in
`astro/MIGRATION.md`):

| Issue | WCAG | Fix |
|-------|------|-----|
| `HomeSplashCard` `aria-label` omitted the visible date text | 2.5.3 (A) | Dropped the redundant `aria-label`; the link's visible text is its accessible name |
| `/news/` card titles jumped `h1` → `h3` | 1.3.1 / best-practice | `NewsCard` gained a `headingLevel` prop; `/news/` passes `h2` |
| `Dialog.vue`'s `<Teleport>` destroyed the skip-links `<nav>` on `client:idle` hydration, site-wide | 2.4.1 (A) | Removed the `<Teleport>` — a native `<dialog>` + `showModal()` is top-layer-promoted and never needed it; regression test added |

Compliant with **WCAG 2.1 AA**, **IITAA** (Illinois state standard), and
**ADA Title II**.

## Security

The site inherits the security posture established in the March 2026 red-team
review and carried through the Astro rebuild:

- **Static generation** — no runtime server, eliminating SQL injection, RCE,
  and most server-side attack surface
- **Content-Security-Policy + hardened headers** — CSP, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection` are set in
  `netlify.toml`; no `'unsafe-eval'`, no CORS wildcard
- **HTML sanitization** — all Strapi-sourced markdown is rendered through
  `markdown-it` + DOMPurify; iframes are whitelisted to ArcGIS domains only
- **No authentication surface** — no accounts, sessions, or credentials
- **Privacy-first analytics** — Plausible (no cookies, no personal data)
- **Whitelisted origins** — image and `connect-src` origins are restricted to
  approved hosts via the CSP

## Migration history

This site was rebuilt from Nuxt 4 + Vuetify 3 to Astro 6 + Tailwind 4. The
Nuxt-era source remains in this repository's git history (and on the `main`
branch until cutover). See `astro/CHANGELOG.md` and `astro/MIGRATION.md` for
the per-phase record, and `docs/superpowers/specs/` for the design spec.

---
*Maintained by the ICJIA Web Development Team.*
