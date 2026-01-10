# ESM Migration Documentation

## Overview

This document details the migration of the ICJIA R3 Nuxt application from CommonJS (CJS) to ECMAScript Modules (ESM). The migration was completed on January 10, 2026.

## Why ESM?

### Before Migration

- Mixed module systems (CommonJS `.js` files + ESM `.mjs` files)
- Node.js warnings about ESM reparsing overhead
- Inconsistent import/export syntax across codebase
- `.mjs` extension required for ESM files

### After Migration

- ✅ Unified ESM across entire codebase
- ✅ No Node.js module warnings
- ✅ Consistent `import`/`export` syntax
- ✅ All files use `.js` extension
- ✅ Modern JavaScript standard
- ✅ Better tree-shaking potential

---

## Challenges Encountered

### Challenge 1: `__dirname` and `__filename` Not Available in ESM

**Problem:** CommonJS provides `__dirname` and `__filename` globals, but ESM does not.

**Solution:** Use `import.meta.url` with Node.js utilities:

```javascript
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

**Files Affected:** All creator scripts that use path resolution.

---

### Challenge 2: Nuxt Config Files Cannot Import Custom Modules

**Problem:** When importing `config.js` in `nuxt.config.js` or `app.config.js`, Nuxt transforms the import path incorrectly during build, resulting in:

```
Cannot find module '/config.js' imported from .nuxt/dev/index.mjs
```

**Root Cause:** Nuxt processes config files during build and transforms import paths. Custom module imports are not resolved correctly.

**Solution:** Inline configuration values directly in Nuxt config files instead of importing from `config.js`:

```javascript
// ❌ DON'T DO THIS in nuxt.config.js or app.config.js
import { config } from "./config.js";

// ✅ DO THIS - inline the values
const CONFIG = {
  site: { url: "https://r3.illinois.gov" },
  api: { base: "https://r3.icjia-api.cloud" },
  // ... other values
};
```

**Files Affected:**

- `nuxt.config.js`
- `app.config.js`

**Trade-off:** Configuration values are now duplicated in three places:

1. `config.js` - Used by creator scripts (build time)
2. `nuxt.config.js` - Used by Nuxt build
3. `app.config.js` - Used at runtime

**Mitigation:** Document this clearly and keep values in sync when updating.

---

### Challenge 3: Named vs Default Exports

**Problem:** Mixed usage of named and default exports caused import failures.

**Solution:** Standardize on named exports for `config.js`:

```javascript
// config.js - use named export
export const config = { ... };

// Importing in creator scripts
import { config } from "../config.js";
```

---

### Challenge 4: JSON Imports in ESM

**Problem:** `require()` for JSON files doesn't work in ESM.

**Solution:** Read JSON files using `fs.readFileSync` and `JSON.parse`:

```javascript
// ❌ CommonJS way (doesn't work in ESM)
const data = require("./data.json");

// ✅ ESM way
import fs from "fs";
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
```

**Note:** Node.js 22+ also supports import assertions, but the `fs` approach is more compatible.

---

### Challenge 5: Leftover `require()` Calls

**Problem:** After adding `"type": "module"` to `package.json`, any remaining `require()` calls fail:

```
ReferenceError: require is not defined in ES module scope
```

**Solution:** Search and replace all `require()` calls with `import` statements.

**Search Pattern Used:**

```bash
grep -r "require(" --include="*.js" ./creators ./scripts
```

---

### Challenge 6: `dotenv` No Longer Needed

**Problem:** Many scripts loaded `dotenv` at startup, but after migrating to centralized `config.js`, environment variables are no longer used.

**Solution:** Remove all `require("dotenv").config()` calls and use `config.js` instead.

---

## Files Changed

### Core Configuration

| File             | Change                                        |
| ---------------- | --------------------------------------------- |
| `package.json`   | Added `"type": "module"`                      |
| `nuxt.config.js` | Inlined config values, removed custom imports |
| `app.config.js`  | Inlined config values, removed custom imports |
| `config.js`      | Already ESM, no changes needed                |

### Creator Scripts

| File                                     | Changes                                                  |
| ---------------------------------------- | -------------------------------------------------------- |
| `creators/utils/errorHandler.js`         | `function` → `export function`, removed `module.exports` |
| `creators/createMarkdownNews.js`         | `require` → `import`, added `__dirname` polyfill         |
| `creators/createMarkdownPages.js`        | `require` → `import`, added `__dirname` polyfill         |
| `creators/createMarkdownFaqs.js`         | `require` → `import`, added `__dirname` polyfill         |
| `creators/createMarkdownResources.js`    | `require` → `import`, added `__dirname` polyfill         |
| `creators/createSiteRoutes.js`           | `require` → `import`, removed dotenv                     |
| `creators/createManualPages.js`          | `require` → `import`, added `__dirname` polyfill         |
| `creators/createContentDirectory.js`     | `require` → `import`, added `__dirname` polyfill         |
| `creators/createDocumentationHTML.js`    | `require` → `import`, added `__dirname` polyfill         |
| `creators/protectDocumentationPortal.js` | `require` → `import`                                     |
| `creators/checkNodeVersion.js`           | `var/require` → `import`, added `__dirname` polyfill     |

### Renamed Files (`.mjs` → `.js`)

| Old Name                             | New Name                            |
| ------------------------------------ | ----------------------------------- |
| `creators/createHubArticles.mjs`     | `creators/createHubArticles.js`     |
| `creators/createHubImages.mjs`       | `creators/createHubImages.js`       |
| `creators/createSearchIndex.mjs`     | `creators/createSearchIndex.js`     |
| `creators/createSearchIndexFaqs.mjs` | `creators/createSearchIndexFaqs.js` |
| `creators/createSitemap.mjs`         | `creators/createSitemap.js`         |
| `test/run-all-tests.mjs`             | `test/run-all-tests.js`             |

### Other Files

| File                                     | Changes                                          |
| ---------------------------------------- | ------------------------------------------------ |
| `scripts/ensure-accessibility-report.js` | `require` → `import`, added `__dirname` polyfill |
| `audit-accessibility.js`                 | `require` → `import`, added `__dirname` polyfill |
| `jsdoc-vue-plugin.js`                    | `exports.handlers` → `export const handlers`     |

---

## package.json Script Updates

Updated script references to use `.js` instead of `.mjs`:

```json
{
  "create:searchIndex": "node ./creators/createSearchIndex.js",
  "create:searchIndexFaqs": "node ./creators/createSearchIndexFaqs.js",
  "create:sitemap": "node ./creators/createSitemap.js",
  "create:hub": "node ./creators/createHubArticles.js",
  "create:hubImages": "node ./creators/createHubImages.js",
  "test": "node ./test/run-all-tests.js"
}
```

---

## Testing Checklist

After ESM migration, verify:

- [x] `yarn dev` starts without errors
- [x] All creator scripts complete successfully
- [x] No Node.js ESM warnings in console
- [x] `yarn scripts` completes all content generation
- [x] `yarn generate` produces static site (83 routes in 3.2s)
- [ ] `yarn build` completes
- [ ] `yarn test` passes
- [ ] Netlify deployment succeeds

---

## Rollback Instructions

If issues arise, the pre-ESM code is preserved in the `main` branch:

```bash
# Switch to pre-ESM state
git checkout main

# Delete ESM branch if needed
git branch -D esm-conversion
```

---

## Best Practices Going Forward

### 1. Always Use ESM Syntax

```javascript
// ✅ Do this
import fs from "fs";
import { config } from "../config.js";
export function myFunction() {}

// ❌ Don't do this
const fs = require("fs");
module.exports = { myFunction };
```

### 2. Include `.js` Extension in Imports

```javascript
// ✅ Required in ESM
import { config } from "../config.js";

// ❌ Won't work
import { config } from "../config";
```

### 3. Use `__dirname` Polyfill When Needed

```javascript
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 4. Keep Config Values in Sync

When updating configuration, update all three locations:

1. `config.js` (for creator scripts)
2. `nuxt.config.js` (inline CONFIG object)
3. `app.config.js` (inline constants)

---

## References

- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [Nuxt 3 Configuration](https://nuxt.com/docs/getting-started/configuration)
- [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

_Migration completed: January 10, 2026_
_Node.js version: 22.14.0_
_Nuxt version: 4.2.2_
