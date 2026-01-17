# SEO & Structured Data Implementation Guide
**Status:** Lighthouse 100/100 ✅
**Last Updated:** January 17, 2026

## 1. Automation Modules
We use specialized modules for dynamic SEO management in `nuxt.config.js`:
- **`@nuxtjs/sitemap`**: Automates XML sitemap generation.
- **`@nuxtjs/robots`**: Generates dynamic `robots.txt` based on `site.url`.
- **`@nuxt/image`**: Handles responsive, WebP-optimized images.

## 2. SEO Composables
Located in `/composables/useSeoMeta.ts`:

### `usePageSeo(config)`
Sets page-specific meta, OG, Twitter, and canonical tags.
```typescript
usePageSeo({
  title: "Page Title",
  description: "Meta description (150-160 chars)",
  path: "/page-path",
  shouldIndex: true // Defaults to true
});
```

### `useSiteSeo()`
Called once in `app.vue`. Sets global title templates and default indexing rules.

## 3. Structured Data (JSON-LD)
Located in `/composables/useStructuredData.ts`. Essential for rich snippets:
- `useWebsiteSchema()`: For the homepage (includes SearchAction).
- `useGovernmentOrganizationSchema()`: Global site-wide identity.
- `useNewsArticleSchema(data)`: For news posts and blog content.
- `useFaqPageSchema(faqs)`: For FAQ content.
- `useBreadcrumbListSchema(links)`: Standard navigation hierarchy.

## 4. Implementation Rules
1. **Title Template**: Defined in `nuxt.config.js` as `R3 | %s`.
2. **Canonical URLs**: Automatically constructed using `site.url`.
3. **Robots**: Default is `index, follow`. Set `shouldIndex: false` for sensitive/preview pages.
4. **Images**: Always use `<NuxtImg>` with descriptive `alt` text.

## 5. Validation
- **Local**: Chrome DevTools > Lighthouse > SEO.
- **Production**: [Google Rich Results Test](https://search.google.com/test/rich-results).
- **Social**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
