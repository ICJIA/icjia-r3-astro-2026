# Nuxt 4 Upgrade Quick Checklist

Quick reference checklist for the Nuxt 4 upgrade process.

## Pre-Upgrade

- [ ] Create backup branch: `backup/pre-nuxt4-upgrade-YYYYMMDD`
- [ ] Create upgrade branch: `feature/nuxt4-upgrade`
- [ ] Document current build times and bundle sizes
- [ ] Take screenshots of key pages
- [ ] Review current `package.json` dependencies

## Phase 1: Assessment

- [ ] Run `yarn list nuxt @nuxt/content` to verify versions
- [ ] Search codebase for deprecated APIs:
  - [ ] `vmid` or `hid` in useHead
  - [ ] `window.__NUXT__`
  - [ ] `route.meta.name` (should be `route.name`)
- [ ] Audit all `useAsyncData`/`useFetch` calls
- [ ] Verify directory structure in `nuxt.config.js`

## Phase 2: Core Upgrade

- [ ] Run `yarn upgrade nuxt@latest`
- [ ] Run `yarn upgrade @nuxt/devtools@latest`
- [ ] Run `yarn upgrade @vue/compiler-sfc@latest`
- [ ] Run codemods: `npx codemod@0.18.7 nuxt/4/migration-recipe`
- [ ] Review and test codemod changes

## Phase 3: Configuration

- [ ] Migrate `generate` config to `nitro.prerender`
- [ ] Remove deprecated `experimental` flags
- [ ] Verify `dir` configuration in `nuxt.config.js`
- [ ] Update TypeScript config (optional but recommended)

## Phase 4: Code Updates

- [ ] Update data fetching patterns
- [ ] Remove `vmid`/`hid` from useHead
- [ ] Update `route.meta.name` to `route.name`
- [ ] Update error data parsing
- [ ] Review component names for KeepAlive

## Phase 5: Content Testing

- [ ] Test all `queryContent()` calls
- [ ] Verify `<ContentDoc>` components work
- [ ] Test content navigation
- [ ] Verify content directory location

## Phase 6: Testing

- [ ] `yarn dev` - test development server
- [ ] Test all pages:
  - [ ] Homepage
  - [ ] News pages
  - [ ] FAQs pages
  - [ ] Resources pages
  - [ ] Search functionality
- [ ] `yarn generate` - test static generation
- [ ] `yarn a11y:audit:local` - accessibility check
- [ ] Cross-browser testing

## Phase 7: Performance

- [ ] `yarn nuxt analyze` - check bundle sizes
- [ ] Compare before/after performance
- [ ] Optimize if needed

## Phase 8: Deployment

- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Full test on staging
- [ ] Deploy to production
- [ ] Monitor for issues

## Critical Commands

```bash
# Backup
git checkout -b backup/pre-nuxt4-upgrade-$(date +%Y%m%d)

# Upgrade
yarn upgrade nuxt@latest

# Codemods
npx codemod@0.18.7 nuxt/4/migration-recipe

# Test
yarn clear:cache
yarn dev
yarn generate

# Rollback (if needed)
git checkout backup/pre-nuxt4-upgrade-YYYYMMDD
yarn install
```

## Key Files to Review

- `nuxt.config.js` - Configuration updates
- `package.json` - Dependency versions
- `pages/**/*.vue` - Data fetching patterns
- `components/**/*.vue` - Component updates
- `composables/**/*` - Shared data fetching

## Common Issues & Solutions

**Issue**: Import errors after upgrade  
**Solution**: Verify `dir` config and use `~/` alias

**Issue**: Content not loading  
**Solution**: Verify `content/` directory is at root

**Issue**: Build errors  
**Solution**: Clear cache: `yarn clear:cache`

**Issue**: TypeScript errors  
**Solution**: Run `yarn nuxt prepare` then `yarn typecheck`


