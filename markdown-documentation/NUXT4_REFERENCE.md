# Nuxt 4 Reference Guide

**Status:** ✅ Project is running Nuxt 4.0.0+  
**Last Updated:** January 9, 2026  
**Purpose:** Historical reference for Nuxt 4 migration and configuration

---

## Overview

This document consolidates all Nuxt 4 migration information for the ICJIA R3 application. The project successfully migrated to Nuxt 4 and is now fully operational. This document serves as a historical reference and guide for future upgrades.

**Current Status:**
- ✅ Nuxt 4.0.0+ (as of package.json)
- ✅ Directory structure configured for Nuxt 4
- ✅ All imports updated to use `~` alias
- ✅ Build and generate working correctly
- ✅ Documentation portal operational
- ✅ All tests passing

---

## Table of Contents

1. [Directory Structure Configuration](#directory-structure-configuration)
2. [Migration Strategy](#migration-strategy)
3. [Changes Made](#changes-made)
4. [Upgrade Checklist](#upgrade-checklist)
5. [Key Differences from Nuxt 3](#key-differences-from-nuxt-3)
6. [Troubleshooting](#troubleshooting)

---

## Directory Structure Configuration

### Strategy

The ICJIA R3 application uses a **pragmatic approach** to Nuxt 4 directory structure:

1. **Keeps current directory structure** (root-level directories)
2. **Makes it explicit in configuration** using the `dir` option
3. **Ensures all imports use the `~` alias** for consistency
4. **Maintains full backward compatibility** with Nuxt 4

This approach is recommended by the Nuxt team for projects with existing structures.

### Configuration in `nuxt.config.js`

```javascript
export default defineNuxtConfig({
  // Nuxt 4 Directory Structure Configuration
  dir: {
    pages: "pages",
    components: "components",
    composables: "composables",
    middleware: "middleware",
    plugins: "plugins",
    assets: "assets",
    public: "public",
    server: "server",
  },
  // ... rest of config
})
```

**Purpose:** Explicitly tells Nuxt 4 where to find each type of file, following Nuxt 4 conventions while using root-level directories.

### Directory Structure

```
icjia-r3-v5-nuxt/
├── app/                      # Nuxt 4 app directory (minimal)
│   ├── router.options.ts    # Router configuration
│   └── app.vue              # Root app component (can be in root or app/)
├── assets/                   # Static assets (configured explicitly)
├── components/               # Vue components (configured explicitly)
├── composables/              # Composition functions (configured explicitly)
├── content/                  # Nuxt Content markdown (generated)
├── middleware/               # Nuxt middleware (configured explicitly)
├── pages/                    # File-based routing (configured explicitly)
├── plugins/                  # Nuxt plugins (configured explicitly)
├── public/                   # Static files (configured explicitly)
└── server/                   # Server-side code (configured explicitly)
```

**Key Points:**
- Only `app/router.options.ts` needs to be in the `app/` directory
- `app.vue` can be in root or `app/` directory (we keep it in root)
- All other directories are explicitly configured to be at root level
- This is fully supported and recommended by Nuxt 4

---

## Migration Strategy

### What We Did

1. **Explicit Directory Configuration** - Added `dir` object to `nuxt.config.js`
2. **Import Path Updates** - Changed imports to use `~` alias consistently
3. **JSDoc Configuration** - Updated TypeDoc to support both old and new paths
4. **Testing** - Verified all functionality works correctly

### What We Didn't Do

- ❌ Move all directories to `app/` folder (not necessary)
- ❌ Restructure the entire project (not needed)
- ❌ Change routing or build process (already compatible)

---

## Changes Made

### 1. `nuxt.config.js` - Directory Configuration

**Added:**
```javascript
dir: {
  pages: "pages",
  components: "components",
  composables: "composables",
  middleware: "middleware",
  plugins: "plugins",
  assets: "assets",
  public: "public",
  server: "server",
}
```

**Location:** Lines 29-38 in nuxt.config.js

### 2. `middleware/isValidContent.js` - Import Update

**Before:**
```javascript
import appRoutes from "assets/json/appRoutes.json";
```

**After:**
```javascript
import appRoutes from "~/assets/json/appRoutes.json";
```

**Why:** The `~` alias correctly resolves to the root directory in Nuxt 4.

### 3. `jsdoc-vue.config.json` - Path Support

**Updated:**
```json
{
  "include": [
    "./components/",
    "./app.vue",
    "./error.vue",
    "./composables/",
    "./pages/",
    "./plugins/",
    "./app/app.vue",
    "./app/error.vue",
    "./app/components/**/*.vue",
    "./app/composables/**/*.{js,ts}",
    "./app/pages/**/*.vue"
  ]
}
```

**Why:** Supports both current structure and potential future `app/` migrations.

### 4. Verification

All core functionality verified:
- ✅ `yarn dev` - Development server works
- ✅ `yarn generate` - Static generation works
- ✅ `yarn test` - All tests pass
- ✅ `yarn docs:dry-run` - Documentation generation works
- ✅ `yarn audit:a11y` - Accessibility audits work

---

## Upgrade Checklist

### Pre-Upgrade Verification

- [x] Backup branch created
- [x] Current versions documented
- [x] Screenshots taken of key pages
- [x] Build times and bundle sizes recorded

### Core Validation

- [x] `yarn dev` (local dev server)
- [x] `yarn generate` (static generation)
- [x] `yarn docs:dry-run` (docs toolchain)
- [x] `yarn audit:a11y` (accessibility audit)
- [x] All pages load correctly
- [x] All routes work
- [x] Content generation works
- [x] Search functionality works
- [x] Documentation portal accessible

### Post-Upgrade Verification

- [x] No console errors
- [x] No build warnings
- [x] All tests passing
- [x] Lighthouse scores maintained
- [x] Documentation portal functional
- [x] Accessibility audits passing

---

## Key Differences from Nuxt 3

### Directory Structure (Optional)

**Nuxt 3:**
- All directories at root level by default

**Nuxt 4:**
- Can optionally use `app/` directory for better organization
- Root-level directories still fully supported with explicit configuration
- We chose to keep root-level with explicit `dir` configuration

### Import Paths

**Nuxt 3:**
- Mix of relative and aliased imports

**Nuxt 4:**
- Prefer `~` alias for all imports
- More consistent import resolution

### Auto-imports

**Both versions support:**
- Component auto-imports
- Composable auto-imports
- Utility auto-imports

**Nuxt 4 improvements:**
- Better TypeScript support
- Faster import resolution
- More predictable behavior

### Build Process

**Nuxt 4 improvements:**
- Faster builds with Vite 7+
- Better tree-shaking
- Improved HMR performance

---

## Troubleshooting

### Issue: Import Errors

**Problem:** Module not found errors after upgrade

**Solution:**
1. Ensure all imports use `~` alias
2. Verify `dir` configuration in `nuxt.config.js`
3. Clear Nuxt cache: `yarn clear:cache`
4. Restart dev server

### Issue: Build Failures

**Problem:** Build fails after Nuxt 4 upgrade

**Solution:**
1. Check Node version (should be 22.14.0+)
2. Clear `node_modules` and reinstall: `rm -rf node_modules && yarn install`
3. Clear Nuxt cache: `yarn clear:cache`
4. Verify all dependencies are compatible with Nuxt 4

### Issue: TypeScript Errors

**Problem:** TypeScript errors in editor

**Solution:**
1. Generate Nuxt types: `yarn nuxt prepare`
2. Restart TypeScript server in editor
3. Check `tsconfig.json` extends `.nuxt/tsconfig.json`

### Issue: Documentation Portal 404

**Problem:** `/docs/` returns 404

**Solution:**
1. Ensure placeholders exist: `yarn ensure:docs`
2. Generate full docs: `yarn docs:all`
3. Verify `public/docs/` directory exists
4. Check `nuxt.config.js` has correct `ignore` in prerender:
   ```javascript
   nitro: {
     prerender: {
       ignore: ["/docs", "/docs/**"],
     }
   }
   ```

---

## Reference Links

### Nuxt 4 Documentation
- [Nuxt 4 Announcement](https://nuxt.com/blog/nuxt4)
- [Migration Guide](https://nuxt.com/docs/getting-started/upgrade)
- [Directory Structure](https://nuxt.com/docs/guide/directory-structure)

### Related Project Files
- `/nuxt.config.js` - Main Nuxt configuration
- `/middleware/isValidContent.js` - Updated import example
- `/jsdoc-vue.config.json` - TypeDoc configuration
- `/package.json` - Dependencies and versions

---

## Historical Notes

### Migration Completed: January 2026

The ICJIA R3 application was successfully migrated to Nuxt 4 in January 2026. The migration focused on:

1. **Configuration over restructuring** - Using explicit `dir` config instead of moving directories
2. **Minimal disruption** - Keeping existing structure that works well
3. **Future compatibility** - Ready for future Nuxt updates
4. **Documentation** - Comprehensive documentation of changes

### Key Decisions

**Why keep directories at root level?**
- Existing structure works perfectly
- Less disruptive to the project
- Easier for developers familiar with the codebase
- Fully supported by Nuxt 4 with explicit configuration

**Why use explicit `dir` configuration?**
- Makes structure clear and intentional
- Documents our directory choices
- Prevents confusion about Nuxt 4 expectations
- Allows gradual migration if needed in future

**Why update to `~` alias?**
- More consistent with Nuxt 4 conventions
- Better TypeScript/IDE support
- Clearer import resolution
- Future-proof for potential structure changes

---

## Future Considerations

### Potential Future Changes

If the project grows significantly, consider:

1. **Moving to `app/` directory structure**
   - Better organization for large projects
   - Clearer separation of app code vs. build config
   - More aligned with Nuxt 4 "default" structure

2. **TypeScript migration**
   - Better type safety
   - Improved developer experience
   - Better IDE support

3. **Nuxt layers**
   - Reusable configuration across ICJIA projects
   - Shared components and composables
   - Centralized standards

### Upgrade Strategy for Future Nuxt Versions

When upgrading to future Nuxt versions:

1. **Review changelog** - Check for breaking changes
2. **Test in development** - Verify core functionality
3. **Run full test suite** - Ensure all tests pass
4. **Update dependencies** - Keep ecosystem packages in sync
5. **Update documentation** - Keep this guide current
6. **Deploy to staging** - Test in production-like environment
7. **Monitor after deployment** - Watch for issues

---

## Conclusion

The ICJIA R3 application is successfully running on Nuxt 4 with a pragmatic directory structure that:

✅ Works perfectly with Nuxt 4  
✅ Maintains familiar structure for developers  
✅ Uses explicit configuration for clarity  
✅ Follows Nuxt team recommendations  
✅ Is ready for future updates  

This approach proves that Nuxt 4 is flexible and can accommodate different project structures while maintaining full compatibility and modern features.

---

**Document Version:** 1.0.0  
**Last Updated:** January 9, 2026  
**Maintained by:** ICJIA Development Team
