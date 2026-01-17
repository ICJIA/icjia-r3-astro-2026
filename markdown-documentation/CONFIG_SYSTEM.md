# ICJIA Centralized Configuration System
**Status:** Unified Multi-Tier Config
**Last Updated:** January 17, 2026

## 1. Overview
ICJIA projects use a centralized, version-controlled configuration system to eliminate `.env` file management and ensure consistency across build-time and runtime environments.

## 2. The Tri-Tier Structure

### Tier 1: `config.js` (Server/Build-time)
- **Purpose**: Source of truth for API endpoints, build settings, and security policies.
- **Used By**: Creator scripts (`creators/`), server-side utilities, and `nuxt.config.js`.
- **Characteristics**: Direct ES import, non-reactive.
- **Security**: **No secrets**. Public configuration only.

### Tier 2: `nuxt.config.js` (Build Engine)
- **Purpose**: Configures the Nuxt/Nitro build engine.
- **Constraints**: Cannot import external modules like `config.js` during certain build phases.
- **Strategy**: Values from `config.js` are inlined into a local `CONFIG` object for deployment (e.g., setting `runtimeConfig`).

### Tier 3: `app.config.js` (Client/Runtime)
- **Purpose**: Reactive UI settings and global constants.
- **Used By**: Vue components, pages, and composables.
- **Access**: `const appConfig = useAppConfig()`.
- **Characteristics**: Fully reactive, supports HMR (Hot Module Replacement).

## 3. Configuration Categories
- **`site`**: Name, description, production URL.
- **`api`**: Strapi, GraphQL, and Research Hub endpoints.
- **`analytics`**: Plausible and Site Improve IDs.
- **`security`**: CSP directives and CORS origins.
- **`features`**: Feature flags (e.g., `underConstruction`).

## 4. Key Rules
1. **Sync Required**: When updating a public API URL, it must be updated in `config.js`, `nuxt.config.js`, and `app.config.js` to ensure the build scripts, the Nuxt engine, and the client-side app all see the same value.
2. **No Secrets**: Standard API keys or secrets must still use Netlify Environment Variables (Server-side only).
3. **Use Helpers**: Use the `getConfig(path)` helper in `config.js` for safe dot-notation access in scripts.
