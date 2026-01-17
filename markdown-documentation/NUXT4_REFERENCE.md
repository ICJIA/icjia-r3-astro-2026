# Nuxt 4 Technical Reference
**Project Status:** Running Nuxt 4.0.0+ (ESM)
**Last Updated:** January 17, 2026

## 1. Directory Structure
ICJIA projects use a **root-level** structure explicitly defined in `nuxt.config.js` for backward compatibility and developer familiarity.

```javascript
// nuxt.config.js
export default defineNuxtConfig({
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
});
```

### Key Mapping:
- `app/router.options.ts`: Required location for router overrides.
- `app.vue`: Main entry point (kept at root).
- `~`: Use the tilde alias for all internal imports (e.g., `import X from "~/components/X.vue"`).

## 2. Core Differences & Optimization
- **Vite 7+**: Faster HMR and build times.
- **ESM Only**: `"type": "module"` in `package.json` is mandatory.
- **Auto-imports**: Enhanced TypeScript support for components and composables in root-level directories.

## 3. Maintenance & Troubleshooting
- **Cache**: Run `yarn clear:cache` (deletes `.nuxt` and `.output`) if build drift occurs.
- **Types**: Run `yarn nuxt prepare` to regenerate `.nuxt/tsconfig.json` and type definitions.
- **Documentation**: Static portal ignored by Nitro via `nitro.prerender.ignore: ["/docs", "/docs/**"]`.

## 4. History (January 2026)
Migrated from Nuxt 3 by updating to ESM and explicitly mapping root directories. This approach avoids the `app/` folder requirement while gaining Nuxt 4 performance benefits.
