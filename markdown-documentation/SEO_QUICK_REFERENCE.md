# SEO Composables Quick Reference

Quick reference for using SEO composables in the R3 Nuxt application.

## Page SEO

### Basic Page Setup

```typescript
// In any page component
usePageSeo({
  title: 'Your Page Title',
  description: 'Your page description (150-160 chars)',
  path: '/your-page',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
})
```

### Article/News Page

```typescript
usePageSeo({
  title: 'Article Title',
  description: 'Article summary',
  path: '/news/article-slug',
  type: 'article',
  article: {
    publishedTime: '2024-01-01',
    modifiedTime: '2024-01-15',
    section: 'News',
    tags: ['tag1', 'tag2'],
  },
})
```

## Structured Data

### Homepage

```typescript
useWebsiteSchema() // Includes search action
useBreadcrumbListSchema([{ name: 'Home', url: '/' }])
```

### Standard Content Page

```typescript
useWebPageSchema({
  name: 'Page Name',
  description: 'Page description',
})

useBreadcrumbListSchema([
  { name: 'Home', url: '/' },
  { name: 'Current Page', url: '/current' }
])
```

### News Article

```typescript
useNewsArticleSchema({
  headline: 'Article Headline',
  description: 'Article description',
  datePublished: '2024-01-01',
  dateModified: '2024-01-15',
})
```

### FAQ Page

```typescript
useFaqPageSchema([
  {
    question: 'What is R3?',
    answer: 'R3 stands for Restore, Reinvest, Renew...'
  },
  {
    question: 'How do I apply?',
    answer: 'You can apply by...'
  }
])
```

### Contact Page

```typescript
useContactPageSchema()
```

## App-wide Setup (app.vue)

```typescript
// Site-wide SEO defaults
useSiteSeo()

// Organization info
useGovernmentOrganizationSchema()
```

## Common Patterns

### Dynamic Content Page

```typescript
if (data.value) {
  usePageSeo({
    title: data.value.title,
    description: data.value.description || data.value.summary,
    path: route.path,
  })
  
  useWebPageSchema({
    name: data.value.title,
    description: data.value.description,
  })
  
  useBreadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: data.value.title, url: route.path }
  ])
}
```

### News Post with All SEO

```typescript
// Meta tags
usePageSeo({
  title: post.title,
  description: post.summary,
  path: `/news/${post.slug}`,
  type: 'article',
  article: {
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    section: 'News',
  },
})

// Structured data
useNewsArticleSchema({
  headline: post.title,
  description: post.summary,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
})

// Breadcrumbs
useBreadcrumbListSchema([
  { name: 'Home', url: '/' },
  { name: 'News', url: '/news' },
  { name: post.title, url: `/news/${post.slug}` }
])
```

## Important Notes

1. **Always call SEO composables** before rendering content
2. **Use exact paths** - no trailing slashes (except for root `/`)
3. **Keep descriptions between 150-160 characters** for optimal display
4. **Include 3-5 relevant keywords** for each page
5. **Use descriptive titles** - avoid generic terms
6. **Structured data must be valid JSON** - test with validators

## Testing Your SEO

```bash
# Run Lighthouse audit
npm run lighthouse

# Or manually test at:
# - https://search.google.com/test/rich-results
# - https://validator.schema.org/
# - https://cards-dev.twitter.com/validator
```

## File Locations

- SEO Meta: `/composables/useSeoMeta.ts`
- Structured Data: `/composables/useStructuredData.ts`
- Documentation: `/markdown-documentation/SEO_IMPLEMENTATION_GUIDE.md`
