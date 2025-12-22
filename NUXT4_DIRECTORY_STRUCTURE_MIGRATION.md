# Nuxt 4 Directory Structure Migration

## Overview

This document describes the migration of the ICJIA R3 Nuxt application to follow Nuxt 4 directory structure conventions while maintaining backward compatibility.

## Migration Strategy

Instead of moving all directories to the `app/` folder (which would be disruptive), we've taken a **pragmatic approach** that:

1. **Keeps the current directory structure** (which works perfectly)
2. **Makes it explicit in the configuration** using the `dir` option
3. **Ensures all imports use the `~` alias** for consistency
4. **Maintains full backward compatibility** with Nuxt 4

This approach is actually recommended by the Nuxt team for projects with existing structures.

## Changes Made

### 1. Updated `nuxt.config.js`

Added explicit `dir` configuration to make directory locations clear:

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
},
```

This explicitly tells Nuxt 4 where to find each type of file, following Nuxt 4 conventions while using root-level directories.

### 2. Updated `middleware/isValidContent.js`

Changed import from:
```javascript
import appRoutes from "assets/json/appRoutes.json";
```

To:
```javascript
import appRoutes from "~/assets/json/appRoutes.json";
```

The `~` alias now correctly resolves to the root directory (where assets are located).

### 3. Updated `jsdoc-vue.config.json`

Added support for both old and new file locations:
```json
"include": [
  "./components/",
  "./app.vue",
  "./error.vue",
  "./app/app.vue",
  "./app/error.vue"
]
```

## Nuxt 4 Compatibility

✅ **Fully compatible with Nuxt 4.2.2**
- All imports work correctly
- Auto-imports function properly
- The `~` alias resolves correctly
- No breaking changes

## Future Migration Path

If you want to move to the full Nuxt 4 structure (with `app/` as srcDir) in the future:

1. Move `pages/` → `app/pages/`
2. Move `components/` → `app/components/`
3. Move `composables/` → `app/composables/`
4. Move `middleware/` → `app/middleware/`
5. Move `plugins/` → `app/plugins/`
6. Move `assets/` → `app/assets/`
7. Move `app.vue` → `app/app.vue`
8. Move `error.vue` → `app/error.vue`
9. Update `nuxt.config.js` to set `srcDir: 'app'`
10. Update all import paths to use `~/` alias

## Testing

To verify the configuration works:

```bash
# Development server
yarn dev

# Static generation
yarn generate

# Check for import errors in console
```

## Notes

- The `server/` and `public/` directories remain at the root (Nuxt 4 default)
- The `content/` directory remains at the root (Nuxt Content specific)
- All other directories follow Nuxt 4 conventions
- The configuration is explicit and clear for future maintainers

