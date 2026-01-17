# ICJIA LLM Reusable Prompts
**Usage**: Copy and paste these into your AI assistant to ensure adherence to ICJIA standards.

## 1. Context Seeding
> "I am working on an ICJIA Nuxt 4 project. Please adhere to the standards in [ICJIA_LLM_BLUEPRINT.md]. We use Nuxt 4, Vuetify 3, and a centralized `config.js` system. All images must use `<NuxtImg>` and all pages must implement `usePageSeo` and relevant `useStructuredData` schemas."

## 2. Implementing SEO
> "Add SEO metadata to the `[PageName]` page. Use the `usePageSeo` composable with a unique title and description. Also implement `useBreadcrumbListSchema` and `useWebPageSchema` (or `useNewsArticleSchema` if it's an article)."

## 3. Adding Images
> "Add a hero image to this section. Use `<NuxtImg>` with `format="webp"`, `quality="80"`, and appropriate `sizes` for mobile/desktop. Since it is the LCP asset, ensure `loading="eager"` and `fetchpriority="high"` are set."

## 4. Accessibility Check
> "Review this component for WCAG 2.1 AA compliance. Ensure all interactive elements have a 44x44px touch target, focus states are high-contrast, and no `aria-label` is missing for icon-only buttons."

## 5. Netlify Config
> "I added a new image source from `[domain]`. Update `netlify.toml` and `nuxt.config.js` to whitelist this domain for the Netlify Image CDN and Nuxt Image module."
