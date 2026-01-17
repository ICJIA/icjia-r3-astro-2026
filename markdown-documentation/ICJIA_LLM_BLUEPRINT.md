# ICJIA Project Blueprint (LLM Context)
**Version:** 1.0.0 | **Standard:** ICJIA Nuxt 4/Netlify
**Usage:** Provide this file as context to any LLM working on ICJIA web projects.

## 1. Core Architecture
- **Framework**: Nuxt 4 (ESM), Vue 3, Vuetify 3.
- **Config System**: Centralized `config.js` at root. **NO `.env` files** for public config. 
  - `config.js`: Server-side/Build-time (Creator scripts).
  - `nuxt.config.js`: Build-time (Inline `CONFIG` object).
  - `app.config.js`: Client-side/Reactive (via `useAppConfig()`).
- **Content**: Nuxt Content 2 + Dynamic CMS fetchers (`creators/`).
- **Hosting**: Netlify (Nitro `static` preset).

## 2. Performance & Images
- **Module**: `@nuxt/image` is mandatory.
- **Usage**: Use `<NuxtImg>` instead of `<img>` or `v-img`.
- **Optimization**: 
  - Hero/LCP: `loading="eager" fetchpriority="high"`.
  - Responsive: `sizes="xs:100vw sm:100vw md:50vw"`.
  - Netlify: `netlify.toml` MUST whitelist remote image domains under `[images] remote_images = ["https://domain\\.com/.*"]`.

## 3. SEO & Structured Data
- **Composables**:
  - `usePageSeo(config)`: Manages titles, meta, OG, Twitter, and canonicals.
  - `useSiteSeo()`: Global defaults (called in `app.vue`).
  - `useStructuredData`: JSON-LD schemas (`useWebsiteSchema`, `useNewsArticleSchema`, etc.).
- **Automation**: `@nuxtjs/sitemap` and `@nuxtjs/robots` are used for dynamic generation.

## 4. Accessibility (WCAG 2.1 AAA)
- **Standard**: Main site = AA. Documentation Portal = **Mandatory AAA**.
- **AAA Rules**: 
  - Contrast: **7:1 minimum** (#000 on #fff).
  - Touch Targets: **44x44px minimum**.
  - UI: Sharp corners (`border-radius: 0`), 4px focus states (#ffff00).
- **Audit**: `yarn audit:a11y` (axe-core + custom AAA checks).

## 5. Deployment & Security
- **Netlify**: Use `netlify.toml` for headers and CSP.
- **CSP**: Restrict to `'self'`, trusted APIs, and Plausible. Remove legacy CDNs (jQuery).
- **Scripts**: 
  - `yarn scripts`: Fetches CMS content.
  - `yarn generate`: Production build.
  - `yarn clear:cache`: Essential for debugging build drifts.

## 6. Directory Map
- `/creators/`: CMS -> Markdown scripts.
- `/markdown-documentation/`: Project knowledge base.
- `/public/docs/`: Standalone AAA accessibility portal.
- `/composables/`: Shared logic (auto-imported).
