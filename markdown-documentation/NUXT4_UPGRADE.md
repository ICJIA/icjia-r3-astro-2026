# Nuxt 4 Upgrade Notes (Plan + Checklist)

This document consolidates the previous root-level upgrade documents:
- `NUXT4_UPGRADE_PLAN.md`
- `NUXT4_UPGRADE_CHECKLIST.md`

It’s kept here to reduce clutter at the repo root.

---

## Quick Checklist (High-level)

### Pre-Upgrade

- [ ] Create backup branch: `backup/pre-nuxt4-upgrade-YYYYMMDD`
- [ ] Create upgrade branch: `feature/nuxt4-upgrade`
- [ ] Document current build times and bundle sizes
- [ ] Take screenshots of key pages
- [ ] Review current `package.json` dependencies

### Core validation

- [ ] `yarn dev` (local dev server)
- [ ] `yarn generate` (static generation)
- [ ] `yarn docs:dry-run` (docs toolchain: placeholders + tests + TypeDoc)
- [ ] `yarn audit:a11y` (accessibility audit; uses sitemap; requires dev server)

> Note: This repo’s a11y audit is ICJIA-standard via `audit-accessibility.js` and writes reports to `public/docs/accessibility/`.

---

## Detailed Upgrade Plan

**Project**: ICJIA R3 (Restore, Reinvest, Renew) Program Website  
**Current Status**: Nuxt 4.0.0 (upgrade to latest stable as needed)  
**Nuxt Content**: v2.13.4 (maintain v2)  

### Phase 1: Pre-Upgrade Assessment & Preparation (1–2 days)

- Verify versions:

```bash
yarn list nuxt @nuxt/content
```

- Check for deprecated APIs:
  - `vmid`/`hid` in `useHead`
  - `window.__NUXT__`
  - `route.meta.name` (prefer `route.name`)
  - audit `useAsyncData`/`useFetch` usage

- Verify directory structure and aliases in `nuxt.config.js`

### Phase 2: Core Nuxt 4 Upgrade (2–3 days)

- Upgrade Nuxt:

```bash
yarn upgrade nuxt@latest
```

- Confirm Nuxt Content v2 compatibility
- Update related deps as needed (`@nuxt/devtools`, `@vue/compiler-sfc`, etc.)

### Phase 3: Configuration Updates (2–3 days)

- Migrate legacy `generate` config to `nitro.prerender`
- Remove deprecated experimental flags
- Validate route generation + prerender ignores (especially `/docs/**`)

### Phase 4: Breaking Change Fixes (3–5 days)

- Data fetching consistency (shared keys/options)
- Head/meta cleanup
- Route metadata updates
- Error handling changes (Nuxt 4 error data parsing behavior)

### Phase 5: Nuxt Content v2 Compatibility (1–2 days)

- Test `queryContent()` usage across pages
- Validate content navigation

### Phase 6: Testing & Validation (3–5 days)

```bash
yarn clear:cache
yarn scripts
yarn dev
```

- Validate core flows (home/news/faqs/resources/search)
- Build test:

```bash
yarn clear:cache
yarn scripts
yarn generate
```

- Docs + audits:

```bash
yarn docs:dry-run
yarn audit:a11y
```

### Phase 7: Performance (2–3 days)

- Compare build output, bundle sizes, and load performance before/after

### Phase 8: Deployment (1–2 days)

- Validate Netlify settings (`netlify.toml`)
- Deploy to staging, then production

---

## Last Updated

January 2026


