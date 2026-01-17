# Netlify Deployment & Optimization Guide
**Project:** ICJIA Nuxt Application
**Version:** 1.0.0
**Last Updated:** January 17, 2026

## 1. Performance Checklist
- **Legacy Library Removal**: Remove jQuery, DataTables, and Mark.js. Aim for < 20ms Total Blocking Time (TBT).
- **Image Optimization**: Use `<NuxtImg>` for WebP/AVIF conversion and responsive `sizes`.
- **LCP Optimization**: Set `loading="eager"` and `fetchpriority="high"` on hero images.
- **Preloading**: Add `preconnect` hints for Google Fonts and API domains in `nuxt.config.js`.

## 2. Netlify Configuration (`netlify.toml`)
### **Image CDN Whitelisting**
Netlify's Image CDN requires explicit whitelisting for external domains:
```toml
[images]
  remote_images = ["https://r3\\.icjia-api\\.cloud/.*", "https://researchhub\\.icjia-api\\.cloud/.*"]
```

### **Security Headers & CSP**
Maintain a strict Content Security Policy. Remove references to external CDNs for scripts that have been localized or removed.
```toml
[[headers]]
for = "/*"
[headers.values]
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ...; img-src 'self' data: https: https://r3.icjia-api.cloud; ..."
```

## 3. SEO & Robots
- **Modules**: Use `@nuxtjs/sitemap` and `@nuxtjs/robots`.
- **Exclusions**: Use the `robots` property in `nuxt.config.js` to disallow `/docs`, `/preview`, and `/sandbox`.
- **Canonical URLs**: Ensure `site.url` is set correctly in `nuxt.config.js`.

## 4. Maintenance
- **New Images**: Always use `<NuxtImg>`.
- **New Domains**: Add to both `nuxt.config.js` (`image.domains`) and `netlify.toml` (`remote_images`).
- **Redirects**: Manage via `routeRules` in `nuxt.config.js` for optimal performance.
