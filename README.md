[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![Netlify Status](https://api.netlify.com/api/v1/badges/3148511c-77ed-462a-b6e8-425400bff617/deploy-status)](https://app.netlify.com/projects/illinois-r3/deploys)
[![Netlify Status (r3dev)](https://api.netlify.com/api/v1/badges/b62816d0-ca9e-495e-952f-ef78ac25f5de/deploy-status)](https://app.netlify.com/projects/r3dev/deploys)
![Node](https://img.shields.io/badge/Node-22.14.0-339933?logo=node.js&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxtdotjs&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3-1867C0?logo=vuetify&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)
![Coverage](<https://img.shields.io/badge/Coverage-Vitest%20(local)-6E9F18>)

# ICJIA R3 (Restore, Reinvest, Renew) Program Website

Official website for Illinois' R3 Violence Prevention Plan, built with **Nuxt 4**, **Vue 3**, and **Vuetify 3**. This platform provides comprehensive information about R3 funding opportunities, resources, and program updates.

🌐 **Live Site**: [https://r3.illinois.gov](https://r3.illinois.gov)  
📚 **Documentation Portal**: [https://r3.illinois.gov/docs/](https://r3.illinois.gov/docs/)  
🔒 **Repository**: Private (contact ICJIA web development team for access)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Critical Concept: Dynamic Content Generation](#critical-concept-dynamic-content-generation)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Environment Configuration](#environment-configuration)
- [Testing & Documentation](#testing--documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Quick Start

### First-Time Setup

```bash
# Clone repository
git clone https://github.com/ICJIA/icjia-r3-v5-nuxt.git
cd icjia-r3-v5-nuxt

# Install dependencies
yarn install

# Set up environment variables (if .env.sample exists)
cp .env.sample .env
# Edit .env with your API endpoints

# Generate content from APIs and start development server
yarn scripts  # Fetches content from Strapi CMS
yarn dev      # Starts dev server at http://localhost:8000
```

### Daily Development

```bash
# Start development server (includes content generation)
yarn dev

# If content seems outdated, regenerate
yarn scripts && yarn dev
```

---

## Prerequisites

| Requirement | Minimum Version | Recommended | Notes                                                |
| ----------- | --------------- | ----------- | ---------------------------------------------------- |
| **Node.js** | 22.14.0         | 22.14.0+    | Use `nvm` for version management (`.nvmrc` provided) |
| **Yarn**    | 1.22.22         | 1.22.22+    | Package manager (or npm 10.0.0+)                     |
| **Git**     | Latest          | Latest      | Version control                                      |

### Node Version Management

This project requires **Node.js 22.14.0**. The project includes a preflight check that enforces this version:

```bash
# Using nvm (recommended)
nvm use

# Or manually install
nvm install 22.14.0
nvm use 22.14.0
```

The `yarn dev` and `yarn scripts` commands automatically run a preflight check to ensure the correct Node version.

---

## Architecture Overview

### Technology Stack

- **Framework**: Nuxt 4.0+ (Vue.js meta-framework)
- **UI Library**: Vuetify 3.11.3 (Material Design components)
- **Content Management**: Strapi CMS (headless) + Nuxt Content 2.13.4
- **Build Tool**: Vite 7.2+ (via Nuxt)
- **Server Engine**: Nitro 2.12+ (via Nuxt)
- **Testing**: Vitest 2.1+ with happy-dom
- **Accessibility**: axe-core 4.11+ (ICJIA-standard audit)
- **Documentation**: TypeDoc 0.27+ for API docs
- **Deployment**: Netlify (static site hosting)

### Key Features

- **Dynamic Content Generation**: Content fetched from Strapi CMS APIs and converted to markdown at build time
- **Robust Error Handling**: Centralized error handling with automatic retries, validation, and clear error messages
- **File-Based Routing**: Nuxt pages directory for automatic route generation
- **Component Auto-Import**: Vue components automatically imported
- **Composable Functions**: Shared Vue composition functions in `composables/`
- **SEO Optimization**: Comprehensive SEO with meta tags, structured data (JSON-LD), and 100/100 Lighthouse score
- **Standalone Documentation Portal**: `/docs/` portal with tests, accessibility reports, and API docs
- **Accessibility Compliance**: WCAG 2.1 Level AA compliance with automated auditing
- **Comprehensive Testing**: 84+ test cases covering unit, integration, and error scenarios

---

## Critical Concept: Dynamic Content Generation

⚠️ **IMPORTANT**: This project uses **dynamic content generation**, not static files.

### How It Works

1. **Content Source**: All content (news, FAQs, resources, pages) is pulled from **Strapi CMS APIs**
2. **Build Process**: Content is fetched and converted to markdown files during build time
3. **Generated Files**: `/content/`, `/public/*.json`, and route definitions are **auto-generated**
4. **Never Edit Manually**: Don't manually edit files in `/content/` or generated JSON files - they'll be overwritten

### Content Generation Process

```bash
# The `yarn scripts` command runs all creator scripts:
yarn scripts
```

This executes:

1. **API Fetching**: Creator scripts (`creators/*.js`) pull data from Strapi CMS
2. **Markdown Generation**: API content converted to markdown with frontmatter
3. **Route Creation**: Dynamic routes generated for all content pages (`public/appRoutes.json`)
4. **Search Index**: Full-text search index built from all content (`public/searchIndex.json`)

**Error Handling**: All creator scripts include comprehensive error handling:

- ✅ Environment variable validation before execution
- ✅ Automatic retry logic (3 attempts with exponential backoff)
- ✅ API response structure validation
- ✅ Graceful degradation for missing content
- ✅ Clear, contextual error messages with HTTP details
- ✅ 30-second timeouts for API requests

### Content Types

- **Pages**: Static content pages (board, eligibility, funding, etc.)
- **News**: News posts and announcements
- **FAQs**: Frequently asked questions
- **Resources**: Documents, guides, and downloadable resources
- **Meetings**: Meeting schedules and minutes
- **Research Hub**: Research articles and publications (from GraphQL API)

### When to Regenerate Content

Run `yarn scripts` when:

- CMS content is updated
- New content types are added
- Routes need to be refreshed
- Before running accessibility audits
- Before building for production

**Note**: Content generation scripts will continue even if some content types are unavailable (e.g., if FAQs aren't available from the CMS). You'll see warnings for missing content, but the build will succeed with available content.

---

## Project Structure

```
icjia-r3-v5-nuxt/
├── app/                      # Nuxt 4 app directory
│   ├── router.options.ts    # Router configuration
│   └── app.vue              # Root app component
├── assets/                   # Static assets (CSS, images, JSON)
│   ├── css/                 # Global styles
│   ├── img/                 # Images
│   └── json/                # Static JSON data
├── components/               # Vue components (auto-imported)
│   └── content/             # Content-specific components
├── composables/             # Vue composition functions (auto-imported)
│   ├── eventBus.ts         # Event bus for component communication
│   ├── states.ts           # Shared state management
│   ├── useCurrentPage.js   # Current page composable
│   ├── useSeoMeta.ts       # SEO meta tags management
│   └── useStructuredData.ts # Schema.org structured data (JSON-LD)
├── content/                 # ⚠️ GENERATED - Markdown files (don't edit manually)
│   ├── news/               # Generated news posts
│   ├── resources/          # Generated resources
│   └── *.md                # Generated content pages
├── creators/                # Content generation scripts
│   ├── utils/              # Error handling utilities
│   │   └── errorHandler.js # Centralized error handling
│   ├── createMarkdownNews.js
│   ├── createMarkdownPages.js
│   ├── createSitemap.mjs
│   └── ...                 # Other creator scripts
├── middleware/              # Nuxt middleware
├── pages/                   # File-based routing (auto-generates routes)
│   ├── [...slug].vue      # Dynamic catch-all route
│   ├── faqs/               # FAQ pages
│   ├── news/               # News pages
│   └── resources/          # Resource pages
├── plugins/                 # Nuxt plugins
│   └── vuetify.js         # Vuetify plugin configuration
├── public/                  # Static files served as-is
│   ├── docs/               # Documentation portal (standalone)
│   │   ├── index.html      # Portal landing page
│   │   ├── accessibility/  # Accessibility audit reports
│   │   ├── tests/         # Test result reports
│   │   └── jsdoc/         # TypeDoc API documentation
│   ├── sitemap.xml         # ⚠️ GENERATED - Sitemap
│   └── *.json              # ⚠️ GENERATED - Route and content JSON files
├── scripts/                 # Utility scripts
│   └── ensure-accessibility-report.js  # Docs placeholder generator
├── server/                  # Server-side code
│   └── api/                # API routes
├── test/                    # Test files
│   ├── setup.ts            # Vitest setup
│   ├── run-all-tests.mjs   # Test runner with HTML report
│   ├── unit/               # Unit tests
│   │   ├── errorHandler.test.ts  # Error handling tests
│   │   ├── composables/    # Composable tests (SEO, structured data)
│   │   └── components/     # Component tests
│   └── integration/        # Integration tests
│       └── error-scenarios.test.ts  # Error scenario tests
├── audit-accessibility.js  # ICJIA-standard accessibility audit script
├── nuxt.config.js          # Nuxt configuration
├── package.json            # Dependencies and scripts
├── typedoc.json            # TypeDoc configuration
├── vitest.config.ts        # Vitest configuration
└── README.md               # This file
```

### Key Directories

- **`/content`**: ⚠️ **Generated** - Markdown files from CMS (never edit manually)
- **`/public`**: Static files + generated JSON (sitemap, routes, search index)
- **`/creators`**: Scripts that fetch from APIs and generate content
- **`/components`**: Vue components (auto-imported, no need to import manually)
- **`/composables`**: Shared Vue composition functions (auto-imported)
- **`/pages`**: File-based routing (each `.vue` file becomes a route)

---

## Development Workflow

### Starting Development

```bash
# Full development workflow (recommended)
yarn dev

# This runs:
# 1. Preflight check (Node version)
# 2. Ensure docs placeholders exist
# 3. Clear Nuxt cache
# 4. Generate content from APIs (yarn scripts)
# 5. Start Nuxt dev server on port 8000
```

### Content Updates

```bash
# When CMS content is updated
yarn scripts  # Fetch latest content from APIs

# Then restart dev server
yarn dev
```

### Testing Changes Locally

```bash
# Run tests
yarn test              # Run all tests and generate HTML report
yarn test:watch        # Run tests in watch mode (for development)
yarn test:coverage     # Run tests with coverage report
yarn test:run          # Run tests once without report generation

# Run accessibility audit (requires dev server)
yarn dev:audit         # Start dev server without opening browser
yarn audit:a11y        # Run accessibility audit (in another terminal)

# Generate documentation
yarn docs:dry-run      # Tests + TypeDoc (no dev server needed)
yarn docs:all          # Tests + a11y + TypeDoc (requires dev server)
```

### Building for Production

```bash
# Generate static site
yarn generate

# Preview production build locally
yarn generate:serve    # Serves on port 3000

# Build for server-side rendering (if needed)
yarn build
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# API Configuration
NUXT_PUBLIC_API_URL=https://r3.icjia-api.cloud
NUXT_PUBLIC_RESEARCH_HUB_URL=https://researchhub.icjia-api.cloud

# Analytics Configuration
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=r3.illinois.gov
```

### API Endpoints

- **Main API**: `NUXT_PUBLIC_API_URL` - Strapi CMS for pages, news, FAQs, resources
- **Research Hub**: `NUXT_PUBLIC_RESEARCH_HUB_URL` - GraphQL API for research articles

### GraphQL Playground

🔗 **GraphQL Playground**: [https://r3.icjia-api.cloud/graphql](https://r3.icjia-api.cloud/graphql)

The GraphQL playground provides:

- **Live Queries**: Interactive query execution (read-only, no mutations)
- **Documentation**: Complete API documentation and schema explorer
- **Full Schema**: Browse all available types, queries, and fields
- **Query Builder**: Visual interface for constructing GraphQL queries

---

## SEO Optimization

This project implements comprehensive SEO optimization following Nuxt 4 best practices with **Lighthouse SEO Score: 100/100** ✅.

### SEO Features

- **Dynamic Meta Tags**: Page-specific titles, descriptions, and Open Graph tags
- **Structured Data**: Schema.org JSON-LD for rich search results
- **Social Media**: Optimized Open Graph and Twitter Card tags
- **Canonical URLs**: Prevent duplicate content issues
- **Breadcrumbs**: Hierarchical navigation with structured data
- **Keywords**: Targeted keywords for each page

### SEO Composables

Two main composables provide comprehensive SEO functionality:

#### `useSeoMeta.ts` - Meta Tags Management

```typescript
// In any page component
usePageSeo({
  title: "Your Page Title",
  description: "Your page description (150-160 chars)",
  path: "/your-page",
  keywords: ["keyword1", "keyword2"],
});
```

#### `useStructuredData.ts` - Schema.org JSON-LD

```typescript
// Homepage
useWebsiteSchema();

// News articles
useNewsArticleSchema({
  headline: "Article Title",
  description: "Article summary",
  datePublished: "2024-01-01",
});

// FAQ pages
useFaqPageSchema([{ question: "What is R3?", answer: "R3 stands for..." }]);

// Breadcrumbs
useBreadcrumbListSchema([
  { name: "Home", url: "/" },
  { name: "Current Page", url: "/current" },
]);
```

### Available Structured Data Schemas

- **WebSite** - Homepage with SearchAction
- **GovernmentOrganization** - Site-wide organization info
- **NewsArticle** - News/blog posts
- **WebPage** - Standard content pages
- **FAQPage** - FAQ pages with rich snippets
- **BreadcrumbList** - Navigation hierarchy
- **ContactPage** - Contact page identification

### SEO Documentation

For detailed SEO implementation guides:

- **[SEO Implementation Guide](./markdown-documentation/SEO_IMPLEMENTATION_GUIDE.md)** - Comprehensive SEO documentation
- **[SEO Quick Reference](./markdown-documentation/SEO_QUICK_REFERENCE.md)** - Quick usage examples

### Testing SEO

```bash
# Lighthouse audit (requires dev server)
yarn dev
# Then in browser DevTools > Lighthouse > SEO

# Or use external tools:
# - Google Rich Results Test: https://search.google.com/test/rich-results
# - Schema.org Validator: https://validator.schema.org/
# - Twitter Card Validator: https://cards-dev.twitter.com/validator
```

---

## Testing & Documentation

> ⚠️ **ICJIA Standard Scripts**: The test and accessibility scripts in this project are **standardized across all ICJIA web applications**. Script names, behavior, and output formats must remain consistent. See the [Documentation Portal Prompt](./markdown-documentation/DOCUMENTATION_PORTAL_PROMPT.md) for implementation details.

### Test Suite

This project uses **Vitest** for comprehensive unit, integration, and E2E testing with **ICJIA-standard script names**. The test suite structure is based on the [ICJIA Accessibility Portal test suite](https://github.com/ICJIA/icjia-accessibility-portal/tree/main/test) as a reference implementation.

```bash
yarn test              # Run all tests and generate HTML report at public/docs/tests/index.html
yarn test:watch        # Run tests in watch mode (no report generation)
yarn test:coverage     # Run tests with coverage report
yarn test:run          # Run tests once without generating HTML report
```

**Standard Script Implementation** (`package.json`):

```json
{
  "scripts": {
    "test": "node ./test/run-all-tests.mjs",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:run": "vitest run"
  }
}
```

**Note**: `yarn test` runs all tests and automatically generates an HTML report at `public/docs/tests/index.html`. Use `yarn test:watch` for rapid development iteration or `yarn test:run` for quick test execution without report generation.

#### Test Structure

The test suite includes comprehensive coverage across multiple categories:

- **Unit Tests** (`test/unit/`):

  - **Error Handling**: `errorHandler.test.ts` (15 tests)
    - Environment variable validation
    - File operation safety
    - API response validation
    - Retry logic with exponential backoff
  - **Composables**:
    - `states.test.ts`, `eventBus.test.ts`, `useCurrentPage.test.ts`
    - `composables/useSeoMeta.test.ts` (4 tests)
    - `composables/useStructuredData.test.ts` (6 tests)
  - **Components**: `components/TheNav.test.ts`, `components/Query.test.ts`
  - **Accessibility**: `accessibility.test.ts`

- **E2E Tests** (`test/e2e/`):

  - Page routing: `pages.test.ts`
  - Navigation: `navigation.test.ts`
  - Content loading: `content.test.ts`
  - Search functionality: `search.test.ts`

- **Integration Tests** (`test/integration/`):
  - **Error Scenarios**: `error-scenarios.test.ts` (9 tests)
    - Environment validation
    - Network timeouts
    - Invalid API responses
    - Retry configuration
    - Error logging
  - Content generation: `content-generation.test.ts`
  - API routes: `api.test.ts`

**Test Coverage**: 84+ test cases with comprehensive error path testing

**Reference Implementation**: The test structure and patterns follow the [ICJIA Accessibility Portal test suite](https://github.com/ICJIA/icjia-accessibility-portal/tree/main/test) as a reference for ICJIA-standard testing practices.

### Accessibility Auditing

Accessibility audits use the **ICJIA-standard audit script** (mirrors the ICJIA Accessibility Portal). The script name, behavior, and outputs are **standardized across all ICJIA web applications**:

```bash
# Requires dev server running
yarn dev:audit         # Start dev server (port 8000, no browser)
yarn audit:a11y        # Run audit (reads sitemap.xml, tests all URLs)

# Outputs to public/docs/accessibility/:
# - index.html (HTML report)
# - results.json (full results)
# - violations.json (violations only)
# - errors.json (same as violations.json)
```

**Standard Script Implementation** (`package.json`):

```json
{
  "scripts": {
    "dev:audit": "yarn preflight && yarn ensure:docs && yarn clear:cache && yarn scripts && nuxt dev --port=8000",
    "audit:a11y": "node ./audit-accessibility.js"
  }
}
```

**Important**: The `audit-accessibility.js` script **MUST mirror** the ICJIA Accessibility Portal reference implementation. Only the Developer Configuration section (environment URLs, port, site info) should be customized. Output directory (`public/docs/accessibility/`), filenames, and core behavior must remain consistent across all ICJIA web apps.

The audit script:

- Reads URLs from `public/sitemap.xml`
- Tests each URL in desktop, tablet, and mobile viewports
- Verifies skip link implementation
- Uses axe-core with WCAG 2.1 Level AA rules
- Generates comprehensive HTML and JSON reports

### API Documentation

Generate TypeDoc API documentation:

```bash
yarn docs:jsdoc        # Generates public/docs/jsdoc/

# Or generate all docs:
yarn docs:all          # Tests + a11y + TypeDoc
```

### Documentation Portal

The project includes a standalone documentation portal at `/docs/`:

- **Portal Landing**: `/docs/index.html`
- **Test Results**: `/docs/tests/index.html`
- **Accessibility Audit**: `/docs/accessibility/index.html`
- **API Documentation**: `/docs/jsdoc/index.html`

Documentation placeholders are automatically created during `yarn dev` and `yarn generate`. Full reports are generated on demand via `yarn docs:all`.

---

## Deployment

### Netlify Deployment

This project is deployed to **Netlify** with automatic deployments:

- **Production**: [https://r3.illinois.gov](https://r3.illinois.gov) (site: `illinois-r3`)
- **Development**: [https://r3dev.icjia.dev](https://r3dev.icjia.dev) (site: `r3dev`)

### Build Configuration

**Build Command**: `yarn generate`  
**Publish Directory**: `.output/public`  
**Node Version**: 22.14.0 (configured in `netlify.toml`)

### Deployment Process

1. **Automatic**: Pushes to `main` branch trigger Netlify deployment
2. **Build**: Netlify runs `yarn generate` (includes content generation)
3. **Deploy**: Static files from `.output/public` are deployed

### Manual Deployment

```bash
# Build locally
yarn generate

# Deploy via Netlify CLI (if installed)
netlify deploy --prod
```

---

## Troubleshooting

### Common Issues

#### Content Not Displaying

**Problem**: Content appears outdated or missing  
**Solution**: Regenerate content from APIs

```bash
yarn scripts  # Fetch latest content
yarn dev      # Restart dev server
```

#### Build Errors

**Problem**: Build fails with errors  
**Solutions**:

1. **Check API connectivity**: Verify environment variables are set correctly
2. **Clear cache**: `yarn clear:cache && yarn dev`
3. **Check Node version**: Ensure Node 22.14.0 is active (`nvm use`)
4. **Review creator script logs**: Check console output for specific API errors

#### Port Conflicts

**Problem**: Port 8000 already in use  
**Solution**: Use alternative port

```bash
nuxt dev --port=8001
```

#### Accessibility Audit Fails

**Problem**: `yarn audit:a11y` fails  
**Solutions**:

1. **Ensure dev server is running**: `yarn dev:audit` (in separate terminal)
2. **Check sitemap exists**: `public/sitemap.xml` must exist (run `yarn scripts` first)
3. **Verify server is accessible**: Check `http://localhost:8000` loads correctly

#### TypeScript/TypeDoc Errors

**Problem**: TypeDoc generation fails  
**Solution**: Ensure Nuxt types are generated

```bash
yarn nuxt prepare  # Generate Nuxt types
yarn docs:jsdoc    # Retry TypeDoc generation
```

### Error Messages

The application provides clear, contextual error messages for all failures:

**Example Error Output**:

```
================================================================================
❌ ERROR: API request failed after 3 retries
📍 Context: Fetching pages from Strapi CMS
💥 Error Message: connect ETIMEDOUT
🌐 Request URL: /graphql
🌐 Request Method: POST
💡 Tip: Set DEBUG=1 to see full stack trace
================================================================================
```

**Understanding Error Messages**:

- ❌ **ERROR**: Main error description
- 📍 **Context**: Where the error occurred
- 💥 **Error Details**: Specific error information
- 📡 **HTTP Status**: HTTP response codes (if applicable)
- 🌐 **Request Details**: API endpoint and method
- 💡 **Tips**: Helpful suggestions for debugging

**Enable Debug Mode**:

```bash
DEBUG=1 yarn scripts  # Show full stack traces
```

### Getting Help

1. **Check Documentation**: See `markdown-documentation/README.md` for detailed guides
2. **Review Improvement Report**: See `markdown-documentation/IMPROVEMENT_REVIEW.md` for recent updates
3. **Review Error Messages**: Error messages include context and suggestions
4. **Check Logs**: Console output includes detailed HTTP and request information
5. **Verify Environment**: Ensure all environment variables are set correctly
6. **Contact Team**: For access or internal issues, contact ICJIA web development team

---

## Additional Resources

### Internal Documentation

- **[Documentation Index](./markdown-documentation/README.md)**: Complete documentation overview and index
- **[Improvement Review](./markdown-documentation/IMPROVEMENT_REVIEW.md)**: Recent improvements to error handling and testing (January 2026)
- **[Accessibility Fixes](./markdown-documentation/ACCESSIBILITY_FIXES.md)**: Documentation portal accessibility improvements and 100/100 Lighthouse scores
- **[SEO Implementation Guide](./markdown-documentation/SEO_IMPLEMENTATION_GUIDE.md)**: Complete SEO documentation
- **[SEO Quick Reference](./markdown-documentation/SEO_QUICK_REFERENCE.md)**: Quick SEO usage examples
- **[Documentation Portal Prompt](./markdown-documentation/DOCUMENTATION_PORTAL_PROMPT.md)**: LLM prompt for creating similar portals
- **[Nuxt 4 Reference](./markdown-documentation/NUXT4_REFERENCE.md)**: Nuxt 4 migration reference and notes

### External Resources

- **Nuxt 4 Docs**: [https://nuxt.com/docs](https://nuxt.com/docs)
- **Vuetify 3 Docs**: [https://vuetifyjs.com](https://vuetifyjs.com)
- **Vue 3 Docs**: [https://vuejs.org](https://vuejs.org)
- **Vitest Docs**: [https://vitest.dev](https://vitest.dev)
- **TypeDoc Docs**: [https://typedoc.org](https://typedoc.org)

### Key Scripts Reference

| Script               | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `yarn dev`           | Start development server (includes content generation) |
| `yarn dev:audit`     | Start dev server without opening browser (for audits)  |
| `yarn scripts`       | Regenerate all content from APIs                       |
| `yarn generate`      | Build static site for production                       |
| `yarn test`          | Run all tests and generate HTML report                 |
| `yarn test:watch`    | Run tests in watch mode (for development)              |
| `yarn test:coverage` | Run tests with coverage report                         |
| `yarn test:run`      | Run tests once without generating HTML report          |
| `yarn audit:a11y`    | Run accessibility audit (requires dev server)          |
| `yarn docs:jsdoc`    | Generate TypeDoc API documentation                     |
| `yarn docs:all`      | Generate all documentation (tests + a11y + TypeDoc)    |
| `yarn docs:dry-run`  | Validate docs toolchain without dev server             |
| `yarn clear:cache`   | Clear Nuxt build cache                                 |

---

## License

MIT License - see [LICENSE](./LICENSE.md) file for details.

Copyright (c) 2026 Illinois Criminal Justice Information Authority

---

**Need more details?** Visit the [documentation portal](https://r3.illinois.gov/docs/) or check the [internal documentation](./markdown-documentation/README.md) for comprehensive guides, API references, and troubleshooting information.
