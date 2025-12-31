# Nuxt 4 Upgrade Plan - ICJIA R3 Application

**Project**: ICJIA R3 (Restore, Reinvest, Renew) Program Website  
**Current Status**: Nuxt 4.0.0 (needs upgrade to latest stable)  
**Nuxt Content**: v2.13.4 (maintaining v2)  
**Created**: January 2025

---

## Executive Summary

This document provides a comprehensive, phased plan for upgrading the ICJIA R3 Nuxt application to the latest Nuxt 4 release while maintaining Nuxt Content v2. The plan is designed to minimize risk, ensure compatibility, and maintain production stability.

### Current State Analysis

✅ **Already on Nuxt 4**: The application is currently using Nuxt 4.0.0  
✅ **Nuxt Content v2**: Using @nuxt/content v2.13.4 (compatible with Nuxt 4)  
✅ **Directory Structure**: Already configured for Nuxt 4 compatibility  
⚠️ **Needs Update**: Should upgrade to latest Nuxt 4 stable release  
⚠️ **Breaking Changes**: Some Nuxt 4 features may need configuration updates

---

## Phase 1: Pre-Upgrade Assessment & Preparation

**Duration**: 1-2 days  
**Risk Level**: Low  
**Priority**: Critical

### 1.1 Current State Audit

- [ ] **Verify Current Versions**
  ```bash
  yarn list nuxt @nuxt/content
  ```

- [ ] **Check for Deprecated APIs**
  - Review all `useAsyncData` and `useFetch` calls for deprecated options
  - Check for `vmid` or `hid` props in `useHead` calls
  - Verify no usage of `window.__NUXT__`
  - Check for `route.meta.name` usage (should be `route.name`)

- [ ] **Audit Data Fetching Patterns**
  - Identify all `useAsyncData` calls with explicit keys
  - Check for inconsistent options on same keys
  - Review `getCachedData` implementations if any

- [ ] **Review Directory Structure**
  - Verify `nuxt.config.js` directory configuration
  - Check all import paths use `~/` alias
  - Ensure `content/` directory is at root level

### 1.2 Dependency Compatibility Check

- [ ] **Verify Module Compatibility**
  ```bash
  # Check compatibility of all Nuxt modules
  yarn why @nuxtjs/google-fonts
  yarn why @vueuse/nuxt
  yarn why @nuxtjs/plausible
  yarn why vite-plugin-vuetify
  ```

- [ ] **Review Breaking Changes**
  - Review Nuxt 4 upgrade guide breaking changes
  - Identify which changes affect this codebase
  - Document required code changes

### 1.3 Backup & Branch Strategy

- [ ] **Create Backup Branch**
  ```bash
  git checkout -b backup/pre-nuxt4-upgrade-$(date +%Y%m%d)
  git push origin backup/pre-nuxt4-upgrade-$(date +%Y%m%d)
  ```

- [ ] **Create Upgrade Branch**
  ```bash
  git checkout -b feature/nuxt4-upgrade
  ```

- [ ] **Document Current State**
  - Take screenshots of key pages
  - Document current build times
  - Record current bundle sizes

---

## Phase 2: Core Nuxt 4 Upgrade

**Duration**: 2-3 days  
**Risk Level**: Medium  
**Priority**: High

### 2.1 Update Nuxt Core

- [ ] **Upgrade Nuxt to Latest Stable**
  ```bash
  yarn upgrade nuxt@latest
  # Or pin to specific version:
  # yarn upgrade nuxt@^4.2.0
  ```

- [ ] **Verify Nuxt Content v2 Compatibility**
  - Confirm @nuxt/content v2.13.4 works with latest Nuxt 4
  - Check Nuxt Content v2 release notes for Nuxt 4 compatibility
  - Test content queries after upgrade

### 2.2 Update Related Dependencies

- [ ] **Update Nuxt DevTools** (if needed)
  ```bash
  yarn upgrade @nuxt/devtools@latest
  ```

- [ ] **Update Vue Compiler** (if needed)
  ```bash
  yarn upgrade @vue/compiler-sfc@latest
  ```

- [ ] **Update Nitro** (comes with Nuxt, but verify)
  ```bash
  yarn upgrade nitro@latest
  ```

### 2.3 Run Automated Codemods

- [ ] **Run Nuxt 4 Migration Codemods**
  ```bash
  # Using pinned version due to compatibility
  npx codemod@0.18.7 nuxt/4/migration-recipe
  ```
  
  This will automatically handle:
  - Default data/error value changes
  - Deprecated dedupe boolean values
  - Shallow data reactivity
  - Absolute watch paths
  - Template compilation changes

- [ ] **Review Codemod Changes**
  - Review all automated changes
  - Test each modified file
  - Commit codemod changes separately

---

## Phase 3: Configuration Updates

**Duration**: 2-3 days  
**Risk Level**: Medium  
**Priority**: High

### 3.1 Update nuxt.config.js

- [ ] **Remove Deprecated Options**
  - Remove `generate` configuration (migrate to `nitro.prerender`)
  - Remove any `experimental` flags that are now defaults
  - Update `vite` configuration if needed

- [ ] **Migrate Generate Config to Nitro**
  ```javascript
  // Before (deprecated)
  generate: {
    routes: siteRoutes,
  }

  // After
  nitro: {
    prerender: {
      routes: siteRoutes,
      crawlLinks: true,
    },
  }
  ```

- [ ] **Update Experimental Features**
  - Remove `experimental.payloadExtraction` (now default)
  - Review other experimental flags
  - Update to new feature flags if needed

### 3.2 Directory Structure Verification

- [ ] **Verify Directory Configuration**
  - Ensure `dir` configuration is correct
  - Verify `content/` directory location (should be at root)
  - Check `server/` directory location (should be at root)
  - Verify `public/` directory location (should be at root)

- [ ] **Update Import Paths** (if needed)
  - Ensure all imports use `~/` alias
  - Update any absolute imports to use aliases
  - Verify auto-imports still work

### 3.3 TypeScript Configuration (Optional)

- [ ] **Opt into Project References** (recommended)
  - Update `tsconfig.json` to use project references
  - Remove `extends: "./.nuxt/tsconfig.json"` if present
  - Add project references for app, server, shared, node
  - Update typecheck script to use `-b` flag

- [ ] **Review TypeScript Errors**
  - Run `yarn typecheck` after upgrade
  - Fix any new type errors
  - Update type definitions if needed

---

## Phase 4: Code Updates for Breaking Changes

**Duration**: 3-5 days  
**Risk Level**: Medium-High  
**Priority**: High

### 4.1 Data Fetching Updates

- [ ] **Review useAsyncData/useFetch Calls**
  - Check for shared keys with different options
  - Extract shared data fetching into composables
  - Update `getCachedData` implementations with context parameter

- [ ] **Update Data Fetching Patterns**
  ```javascript
  // Example: Extract shared data fetching
  // Before: Multiple components using same key with different options
  // After: Create composable
  export function useHomeContent() {
    return useAsyncData('content-home', async () => {
      const post = await queryContent().where({ _path: "/" }).findOne();
      return post;
    }, {
      deep: true, // Consistent options
    });
  }
  ```

- [ ] **Update Default Values**
  - Change `null` checks to `undefined` checks for data/error
  - Update any code relying on default `null` values

### 4.2 Head/Meta Updates

- [ ] **Remove Deprecated Props**
  - Remove `vmid` and `hid` from `useHead` calls
  - Update meta tag definitions
  - Test SEO meta tags still work

- [ ] **Update useHead Calls**
  ```javascript
  // Before
  useHead({
    meta: [{
      hid: 'description',
      name: 'description',
      content: '...'
    }]
  })

  // After (no hid needed)
  useHead({
    meta: [{
      name: 'description',
      content: '...'
    }]
  })
  ```

### 4.3 Route Metadata Updates

- [ ] **Update Route Meta Access**
  - Change `route.meta.name` to `route.name`
  - Update any route metadata access patterns
  - Test route navigation still works

### 4.4 Component Name Normalization

- [ ] **Review Component Usage**
  - Check for `<KeepAlive>` components using component names
  - Update test files using `findComponent`
  - Verify component auto-imports still work

### 4.5 Error Handling Updates

- [ ] **Update Error Data Parsing**
  - Remove manual `JSON.parse(error.data)` calls
  - Use `error.data` directly (now parsed automatically)
  - Test error pages display correctly

---

## Phase 5: Nuxt Content v2 Compatibility

**Duration**: 1-2 days  
**Risk Level**: Low  
**Priority**: Medium

### 5.1 Verify Content Queries

- [ ] **Test All Content Queries**
  - Test `queryContent()` calls
  - Verify `.where()`, `.findOne()`, `.find()` work
  - Check content rendering with `<ContentDoc>`

- [ ] **Review Content Configuration**
  ```javascript
  content: {
    documentDriven: false,
    markdown: {
      mdc: true,
      anchorLinks: {
        depth: 0,
        exclude: [1, 2, 3, 4, 5, 6],
      },
    },
  }
  ```

### 5.2 Content Directory Location

- [ ] **Verify Content Directory**
  - Ensure `content/` is at root (not in `app/`)
  - Verify Nuxt Content v2 resolves content correctly
  - Test content queries in development and production

### 5.3 Content API Compatibility

- [ ] **Test Content APIs**
  - Test `queryContent()` composable
  - Test `<ContentDoc>` component
  - Test `<ContentList>` component (if used)
  - Verify content navigation works

---

## Phase 6: Testing & Validation

**Duration**: 3-5 days  
**Risk Level**: Low  
**Priority**: Critical

### 6.1 Development Testing

- [ ] **Start Development Server**
  ```bash
  yarn clear:cache
  yarn dev
  ```

- [ ] **Test Core Functionality**
  - [ ] Homepage loads correctly
  - [ ] Navigation works
  - [ ] Content pages render
  - [ ] News pages work
  - [ ] FAQs pages work
  - [ ] Resources pages work
  - [ ] Search functionality works
  - [ ] Forms submit correctly

- [ ] **Test Content Features**
  - [ ] Markdown content renders
  - [ ] Images load correctly
  - [ ] Links work
  - [ ] Table of contents displays
  - [ ] Breadcrumbs work

### 6.2 Build Testing

- [ ] **Test Static Generation**
  ```bash
  yarn clear:cache
  yarn scripts
  yarn generate
  ```

- [ ] **Verify Build Output**
  - [ ] All routes generate correctly
  - [ ] No build errors
  - [ ] Content is included in build
  - [ ] Assets are optimized
  - [ ] Sitemap generates correctly

- [ ] **Test Build Performance**
  - [ ] Record build time
  - [ ] Check bundle sizes
  - [ ] Verify no performance regressions

### 6.3 Accessibility Testing

- [ ] **Run Accessibility Audit**
  ```bash
  yarn a11y:audit:local
  ```

- [ ] **Verify WCAG Compliance**
  - [ ] No new accessibility violations
  - [ ] Skip links work
  - [ ] Keyboard navigation works
  - [ ] Screen reader compatibility

### 6.4 Browser Testing

- [ ] **Cross-Browser Testing**
  - [ ] Chrome/Edge (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Mobile browsers (iOS Safari, Chrome Mobile)

- [ ] **Test Key User Flows**
  - [ ] Apply for funding flow
  - [ ] Search functionality
  - [ ] Content navigation
  - [ ] Form submissions

---

## Phase 7: Performance Optimization

**Duration**: 2-3 days  
**Risk Level**: Low  
**Priority**: Medium

### 7.1 Performance Audit

- [ ] **Run Performance Analysis**
  ```bash
  yarn build
  yarn nuxt analyze
  ```

- [ ] **Check Bundle Sizes**
  - Compare before/after bundle sizes
  - Identify any size increases
  - Optimize if needed

### 7.2 Data Fetching Optimization

- [ ] **Review Data Fetching Performance**
  - Check for duplicate data fetching
  - Optimize shared data fetching
  - Review caching strategies

### 7.3 Build Optimization

- [ ] **Review Build Configuration**
  - Optimize Vite configuration
  - Review Nitro prerender settings
  - Check route generation performance

---

## Phase 8: Documentation & Deployment

**Duration**: 1-2 days  
**Risk Level**: Low  
**Priority**: Medium

### 8.1 Update Documentation

- [ ] **Update Project Documentation**
  - Update README.md with new Nuxt 4 info
  - Update PROJECT-DOCUMENTATION.md
  - Document any breaking changes
  - Update deployment instructions

- [ ] **Create Migration Notes**
  - Document all changes made
  - Note any workarounds
  - Document configuration decisions

### 8.2 Deployment Preparation

- [ ] **Update Deployment Configuration**
  - Verify Netlify configuration
  - Update build commands if needed
  - Test deployment locally

- [ ] **Create Deployment Checklist**
  - Pre-deployment checks
  - Deployment steps
  - Post-deployment verification

### 8.3 Staging Deployment

- [ ] **Deploy to Staging**
  - Deploy to staging environment
  - Run full test suite
  - Verify all functionality
  - Get stakeholder approval

### 8.4 Production Deployment

- [ ] **Deploy to Production**
  - Schedule deployment window
  - Deploy to production
  - Monitor for errors
  - Verify site functionality
  - Monitor performance metrics

---

## Rollback Plan

If issues are encountered:

1. **Immediate Rollback**
   ```bash
   git checkout backup/pre-nuxt4-upgrade-YYYYMMDD
   yarn install
   yarn build
   ```

2. **Partial Rollback**
   - Revert specific problematic changes
   - Keep compatible improvements
   - Document issues for future resolution

3. **Issue Resolution**
   - Document all issues encountered
   - Create GitHub issues for bugs
   - Plan fixes for next iteration

---

## Risk Assessment

### High Risk Areas

1. **Data Fetching Changes**: Singleton data fetching layer may affect shared state
2. **Directory Structure**: If not properly configured, imports may break
3. **Content Queries**: Nuxt Content v2 compatibility needs verification
4. **Build Process**: Static generation may be affected

### Mitigation Strategies

1. **Incremental Updates**: Upgrade in phases, test after each
2. **Comprehensive Testing**: Test all functionality thoroughly
3. **Backup Strategy**: Keep backup branch for quick rollback
4. **Staging First**: Deploy to staging before production

---

## Success Criteria

- [ ] ✅ Application runs on latest Nuxt 4 stable
- [ ] ✅ All functionality works as before
- [ ] ✅ No new accessibility violations
- [ ] ✅ Build times are acceptable
- [ ] ✅ Bundle sizes are optimized
- [ ] ✅ All tests pass
- [ ] ✅ Production deployment successful

---

## Timeline Estimate

**Total Duration**: 15-25 days

- Phase 1: 1-2 days
- Phase 2: 2-3 days
- Phase 3: 2-3 days
- Phase 4: 3-5 days
- Phase 5: 1-2 days
- Phase 6: 3-5 days
- Phase 7: 2-3 days
- Phase 8: 1-2 days

**Buffer Time**: 3-5 days for unexpected issues

---

## Resources & References

- [Nuxt 4 Upgrade Guide](https://nuxt.com/docs/4.x/getting-started/upgrade)
- [Nuxt Content v2 Documentation](https://content.nuxtjs.org/)
- [Nuxt 4 Migration Codemods](https://app.codemod.com/registry)
- [Nuxt 4 Directory Structure](https://nuxt.com/docs/4.x/directory-structure)

---

## Notes

- This plan assumes Nuxt Content v2.13.4 is compatible with Nuxt 4 (verify before starting)
- Some phases can be done in parallel with proper coordination
- Regular commits after each phase completion
- Document all decisions and changes made during upgrade

---

**Last Updated**: January 2025  
**Status**: Ready for Implementation


