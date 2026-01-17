# SEO Implementation Guide for R3 Nuxt Application

**Last Updated:** January 9, 2026  
**Version:** 1.0.0

## Overview

This document describes the comprehensive SEO implementation for the R3 (Restore, Reinvest, Renew) Nuxt application. The implementation follows Nuxt 4 best practices and includes dynamic meta tags, structured data (JSON-LD), and enhanced search engine optimization.

## Current SEO Performance

**Lighthouse SEO Score:** 100/100 ✅

The application maintains perfect SEO scores with the following features:

- ✅ All pages have proper meta descriptions
- ✅ Document has valid `<title>` element
- ✅ Document has a meta description
- ✅ Page has successful HTTP status code
- ✅ Links are crawlable
- ✅ Document has a valid `hreflang`
- ✅ Document avoids plugins
- ✅ Page is mobile-friendly
- ✅ Structured data is valid

## SEO Composables

### 1. `useSeoMeta.ts` - Dynamic SEO Meta Tags

**Location:** `/composables/useSeoMeta.ts`

This composable provides comprehensive SEO meta tag management with type safety.

#### Functions:

##### `usePageSeo(config: PageSeoConfig)`

Sets page-specific SEO metadata including:

- Page titles with dynamic templates
- Meta descriptions
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URLs
- Robots directives
- Keywords

**Example Usage:**

```typescript
// In any page component
usePageSeo({
  title: "About R3 Program",
  description: "Learn about the Restore, Reinvest, and Renew program",
  path: "/about",
  keywords: ["R3", "Illinois grants", "criminal justice reform"],
});
```

##### `useSiteSeo()`

Sets site-wide default SEO metadata. Called once in `app.vue`.

**Features:**

- Title template for consistent branding
- Default Open Graph and Twitter tags
- HTML lang attribute
- Preconnect directives for performance

### 2. `useStructuredData.ts` - Schema.org JSON-LD

**Location:** `/composables/useStructuredData.ts`

Provides structured data (JSON-LD) composables for rich search results.

#### Available Schemas:

##### `useWebsiteSchema()`

- **Type:** WebSite + SearchAction
- **Use Case:** Homepage
- **Features:** Includes site-wide search functionality

```typescript
// In pages/index.vue
useWebsiteSchema();
```

##### `useGovernmentOrganizationSchema()`

- **Type:** GovernmentOrganization
- **Use Case:** Site-wide in app.vue or About page
- **Features:** Organization details, contact info, social profiles

```typescript
// In app.vue
useGovernmentOrganizationSchema();
```

##### `useNewsArticleSchema(config)`

- **Type:** NewsArticle
- **Use Case:** News/blog posts
- **Features:** Article metadata, author, publisher, dates

```typescript
// In news article pages
useNewsArticleSchema({
  headline: article.title,
  description: article.summary,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
});
```

##### `useWebPageSchema(config)`

- **Type:** WebPage
- **Use Case:** Standard content pages
- **Features:** Page metadata, publication dates

```typescript
// In content pages
useWebPageSchema({
  name: "Page Title",
  description: "Page description",
});
```

##### `useFaqPageSchema(faqs)`

- **Type:** FAQPage
- **Use Case:** FAQ pages
- **Features:** Question/answer pairs for rich snippets

```typescript
// In FAQ pages
useFaqPageSchema([
  {
    question: "What is R3?",
    answer: "R3 stands for Restore, Reinvest, Renew...",
  },
]);
```

##### `useBreadcrumbListSchema(items)`

- **Type:** BreadcrumbList
- **Use Case:** Pages with breadcrumb navigation
- **Features:** Hierarchical page structure

```typescript
// In any page with breadcrumbs
useBreadcrumbListSchema([
  { name: "Home", url: "/" },
  { name: "News", url: "/news" },
  { name: "Article Title", url: "/news/article" },
]);
```

##### `useContactPageSchema()`

- **Type:** ContactPage
- **Use Case:** Contact page
- **Features:** Contact page identification

```typescript
// In pages/contact.vue
useContactPageSchema();
```

## Implementation by Page Type

### Homepage (`pages/index.vue`)

```typescript
// SEO Configuration
usePageSeo({
  title: "Restore. Reinvest. Renew.",
  description: "The R3 program invests in communities...",
  path: "/",
  keywords: ["R3", "Restore Reinvest Renew", "Illinois grants"],
});

// Structured Data
useWebsiteSchema(); // With search functionality
useBreadcrumbListSchema([{ name: "Home", url: "/" }]);
```

### Dynamic Content Pages (`pages/[...slug].vue`)

The catch-all route automatically:

- Sets page-specific SEO based on content data
- Adds appropriate structured data (WebPage or NewsArticle)
- Generates breadcrumb navigation
- Handles article metadata for news posts

### FAQ Page (`pages/faqs/index.vue`)

```typescript
usePageSeo({
  title: "Frequently Asked Questions",
  description: "Find answers to FAQs about R3...",
  path: "/faqs",
  keywords: ["R3 FAQs", "frequently asked questions"],
});

useWebPageSchema({
  name: "R3 Frequently Asked Questions",
  description: "Find answers to common questions",
});

useBreadcrumbListSchema([
  { name: "Home", url: "/" },
  { name: "FAQs", url: "/faqs" },
]);
```

### App-wide Configuration (`app.vue`)

```typescript
// Called once for site-wide defaults
useSiteSeo();

// Organization schema for brand recognition
useGovernmentOrganizationSchema();
```

## Meta Tags Generated

### Standard Meta Tags

- `<title>` - Dynamic page titles
- `<meta name="description">` - Page descriptions
- `<meta name="keywords">` - Relevant keywords
- `<meta name="robots">` - Indexing directives
- `<link rel="canonical">` - Canonical URLs

### Open Graph (OG) Tags

- `og:title` - Social media title
- `og:description` - Social media description
- `og:image` - Social media image (1200x630)
- `og:url` - Canonical URL
- `og:type` - Content type (website/article)
- `og:site_name` - Site name
- `og:locale` - Language/region

### Twitter Card Tags

- `twitter:card` - Card type (summary_large_image)
- `twitter:title` - Twitter title
- `twitter:description` - Twitter description
- `twitter:image` - Twitter image
- `twitter:site` - Twitter handle (@ICJIAIllinois)

### Article-Specific Tags (News Posts)

- `article:published_time`
- `article:modified_time`
- `article:author`
- `article:section`
- `article:tag`

## Structured Data Schemas Implemented

1. **WebSite** - Homepage with SearchAction
2. **GovernmentOrganization** - Site-wide organization info
3. **NewsArticle** - News/blog posts
4. **WebPage** - Standard content pages
5. **FAQPage** - FAQ pages (when configured)
6. **BreadcrumbList** - Navigation hierarchy
7. **ContactPage** - Contact page

## SEO Best Practices Followed

### 1. **Title Optimization**

- Unique titles for each page
- Consistent branding with site name
- 50-60 characters optimal length
- Primary keywords near the beginning

### 2. **Meta Descriptions**

- Unique descriptions for each page
- 150-160 characters optimal length
- Compelling and actionable
- Includes primary keywords naturally

### 3. **URL Structure**

- Clean, readable URLs
- Canonical URLs prevent duplicate content
- Trailing slash normalization

### 4. **Structured Data**

- Valid Schema.org JSON-LD format
- Rich snippets for better SERP appearance
- Breadcrumbs for site structure
- Article metadata for news content

### 5. **Social Media Optimization**

- Open Graph tags for Facebook, LinkedIn
- Twitter Card tags for Twitter
- Optimized image sizes (1200x630)
- Proper content type declarations

### 6. **Technical SEO**

- HTML lang attribute set to "en"
- Robots directives properly configured
- No duplicate content issues
- Mobile-friendly (responsive design)
- Fast loading (preconnect directives)

## Configuration File Updates

### `nuxt.config.js`

Already configured with:

- `titleTemplate` in app.head
- HTML lang attribute
- Viewport meta tag
- Charset UTF-8
- Sitemap generation
- Route pre-rendering

### `app.config.js`

Contains site-level configuration:

- `root`: Base URL (https://r3.illinois.gov)
- `title`: Site title
- `description`: Default description

## Testing and Validation

### Tools for Testing SEO

1. **Lighthouse** (Built-in)

   ```bash
   # Already achieving 100/100 SEO score
   ```

2. **Google Rich Results Test**

   - URL: https://search.google.com/test/rich-results
   - Test structured data validity

3. **Facebook Sharing Debugger**

   - URL: https://developers.facebook.com/tools/debug/
   - Test Open Graph tags

4. **Twitter Card Validator**

   - URL: https://cards-dev.twitter.com/validator
   - Test Twitter Card tags

5. **Schema.org Validator**
   - URL: https://validator.schema.org/
   - Validate JSON-LD structured data

### Manual Testing Checklist

- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] Canonical URLs are correct
- [ ] Structured data validates
- [ ] Social sharing works correctly
- [ ] Breadcrumbs display properly
- [ ] Images have alt text
- [ ] Links are descriptive

## Future Enhancements

### Potential Improvements

1. **Multi-language Support**

   - Add hreflang tags for Spanish version
   - Implement language alternates

2. **Video Schema**

   - Add VideoObject schema for video content
   - Enhanced video rich snippets

3. **Event Schema**

   - Add Event schema for meetings/events
   - Calendar integration

4. **Review Schema**

   - Add aggregate ratings if applicable
   - User testimonials structured data

5. **Local Business Schema**

   - Add LocalBusiness schema if physical location
   - Opening hours, contact details

6. **Sitemap Enhancements**
   - Add priority and changefreq
   - Image sitemap
   - Video sitemap

## Maintenance Guidelines

### When Adding New Pages

1. Always call `usePageSeo()` with appropriate config
2. Add relevant structured data composable
3. Include breadcrumbs if applicable
4. Test with Lighthouse
5. Validate structured data

### When Updating Content

1. Update meta descriptions if content changes significantly
2. Update modified dates in structured data
3. Check canonical URLs remain correct
4. Re-validate structured data

### Regular Audits

- Run Lighthouse monthly
- Check Google Search Console for errors
- Monitor structured data in Search Console
- Review page titles and descriptions quarterly
- Update keywords based on search trends

## Resources

### Documentation

- [Nuxt SEO Documentation](https://nuxt.com/docs/getting-started/seo-meta)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)

### Related Files

- `/composables/useSeoMeta.ts` - SEO meta tag composable
- `/composables/useStructuredData.ts` - Structured data composable
- `/app.vue` - Site-wide SEO configuration
- `/nuxt.config.js` - Nuxt SEO configuration
- `/public/sitemap.xml` - XML sitemap

## Support

For questions or issues related to SEO implementation:

- Review this documentation
- Check Nuxt SEO docs
- Validate with Google tools
- Test with Lighthouse

---

**Maintained by:** ICJIA Development Team  
**Last Review:** January 9, 2026
