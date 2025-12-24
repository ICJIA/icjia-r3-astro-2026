[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# ICJIA R3 (Restore, Reinvest, Renew) Program Website

The official website for Illinois' R3 Violence Prevention Plan, built with Nuxt 4 and Vue 3. This platform provides comprehensive information about R3 funding opportunities, resources, and program updates.

🌐 **Live Site**: [https://r3.illinois.gov](https://r3.illinois.gov)
📚 **Documentation**: [https://r3.illinois.gov/documentation/](https://r3.illinois.gov/documentation/)

## Quick Start

**For detailed setup instructions and troubleshooting, see the [comprehensive documentation](https://r3.illinois.gov/documentation/project/).**

### Prerequisites

- Node.js 20.19.0+ (use `nvm` or `mise` for version management)
- Yarn 1.22.22+ package manager
- Git

### Rapid Setup

```bash
# Clone and setup
git clone https://github.com/ICJIA/icjia-r3-v5-nuxt.git
cd icjia-r3-v5-nuxt
yarn install

# Environment setup
cp .env.sample .env
# Edit .env with your API endpoints (see Configuration section below)

# Generate content and start development
yarn scripts  # Generates all content from APIs
yarn dev      # Starts dev server at http://localhost:8000
```

### Key Commands

```bash
yarn scripts        # Generate all content from APIs
yarn dev           # Development server (http://localhost:8000)
yarn generate      # Static site generation
yarn docs:all      # Generate all documentation
yarn clear:cache   # Clear Nuxt cache
yarn a11y:audit:local  # Run accessibility audit locally
```

## Architecture Overview

- **Framework**: Nuxt 4 + Vue 3 + Vuetify 3 (Material Design)
- **Content Management**: Headless CMS (Strapi) with dynamic content generation
- **Deployment**: Netlify static hosting with automatic builds
- **Documentation**: Standalone system with JSDoc API reference

## Critical Concept: Dynamic Content Generation

⚠️ **Important**: This project uses **dynamic content generation**, not static files.

- **Content Source**: All content (news, FAQs, resources, pages) is pulled from Strapi CMS APIs
- **Build Process**: Content is fetched and converted to markdown files during build time
- **Generated Files**: `/content/`, `/public/*.json`, and route definitions are auto-generated
- **Never Edit**: Don't manually edit files in `/content/` or generated JSON files - they'll be overwritten

### Content Generation Process

1. **API Fetching**: Creator scripts pull data from Strapi CMS
2. **Markdown Generation**: API content converted to markdown with frontmatter
3. **Route Creation**: Dynamic routes generated for all content pages
4. **Search Index**: Full-text search index built from all content

```bash
# Regenerate all content (run this when APIs are updated)
yarn scripts
```

## Documentation System

This project includes a comprehensive, standalone documentation system accessible at `/documentation/` that exists completely outside the Nuxt application.

### Documentation Portal: [/documentation/](https://r3.illinois.gov/documentation/)

The documentation system includes four main components:

1. **📋 Documentation Portal** - Main navigation hub with dark theme
2. **📖 Project Documentation** - Complete setup and development guide
3. **🔧 JSDoc API Documentation** - All functions, composables, and utilities
4. **🧩 Vue Components Documentation** - Component props, events, and usage

### Auto-Generation

Documentation automatically regenerates during every build:

```bash
yarn dev           # Includes documentation generation
yarn generate      # Includes documentation generation
yarn docs:all      # Generate documentation only
```

### Features

- **Standalone Design**: No Nuxt dependencies, works independently
- **Dark Theme**: Professional development-focused interface
- **Search Functionality**: Find functions and components quickly
- **Mobile Responsive**: Works on all screen sizes
- **Always Current**: Regenerates with every build

## Environment Configuration

### Required Environment Variables

```bash
# API Configuration
NUXT_PUBLIC_API_URL=https://r3.icjia-api.cloud
NUXT_PUBLIC_RESEARCH_HUB_URL=https://researchhub.icjia-api.cloud

# Analytics Configuration
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain
```

### API Endpoints

- **Main API**: Strapi CMS for pages, news, FAQs, resources
- **Research Hub**: GraphQL API for research articles and publications
- **Content Types**: Pages, news posts, FAQs, resources, meetings, biographies

## External API Documentation

### GraphQL Playground

🔗 **GraphQL Playground**: [https://r3.icjia-api.cloud/graphql](https://r3.icjia-api.cloud/graphql)

The GraphQL playground provides:

- **Live Queries**: Interactive query execution (read-only, no mutations)
- **Documentation**: Complete API documentation and schema explorer
- **Full Schema**: Browse all available types, queries, and fields
- **Query Builder**: Visual interface for constructing GraphQL queries

## Development Workflow

### Daily Development

```bash
# Start development (includes content generation)
yarn dev

# If content seems outdated, regenerate
yarn scripts
yarn dev
```

### Content Updates

```bash
# When CMS content is updated
yarn scripts  # Fetch latest content from APIs
```

### Build and Deploy

```bash
# Local production build
yarn generate

# Preview production build
yarn generate:serve  # Serves on port 3000

# Run accessibility audit
yarn a11y:audit:local  # Local accessibility testing
```

### Deployment

- **Automatic**: Pushes to `main` branch trigger Netlify deployment
- **Build Command**: `yarn generate` (includes content generation)
- **Publish Directory**: `.output/public`

## Project Structure

```
icjia-r3-v5-nuxt/
├── components/content/       # Vue components
├── composables/             # Vue composition functions
├── content/                 # Generated markdown files (don't edit)
├── creators/                # Content generation scripts
├── middleware/              # Nuxt middleware
├── pages/                   # File-based routing
├── plugins/                 # Nuxt plugins
├── public/                  # Static files + generated JSON
├── server/                  # API routes
├── public/documentation/    # Standalone documentation system
└── PROJECT-DOCUMENTATION.md # Comprehensive project guide
```

## Technology Stack

- **Nuxt 4** (v4.2.2) - Vue.js meta-framework
- **Vue 3** (v3.5.25) - Progressive JavaScript framework
- **Vuetify 3** (v3.11.3) - Material Design components
- **Vite** (v7.2.7) - Next-generation build tool
- **Nitro** (v2.12.9) - Server engine for Nuxt
- **Strapi CMS** - Headless content management
- **Netlify** - Static site hosting and deployment

## Troubleshooting

### Common Issues

**Content not displaying**: Run `yarn scripts` to regenerate content from APIs

**Build errors**: Check API connectivity and environment variables

**Port conflicts**: Use `yarn dev --port=8001` for alternative port

**Cache issues**: Run `yarn clear:cache` then `yarn dev`

**Accessibility issues**: Run `yarn a11y:audit:local` to check for WCAG compliance violations

### Getting Help

1. **Documentation**: Check `/documentation/` for comprehensive guides
2. **Project Docs**: See `PROJECT-DOCUMENTATION.md` for detailed information
3. **API Issues**: Verify environment variables and API connectivity
4. **Build Problems**: Check creator script logs for specific errors

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/description`
3. Make changes and test locally
4. Run `yarn scripts` to ensure content generation works
5. Run `yarn a11y:audit:local` to verify accessibility compliance
6. Commit changes and push to your fork
7. Create a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Accessibility Audit History

This section documents accessibility improvements and audit results for the ICJIA R3 Nuxt 4 application, maintaining WCAG 2.1 AA compliance standards.

### 2025-09-10: Comprehensive Accessibility Audit and Mitigations

**Audit Methodology**: Local accessibility testing using axe-core 4.10.3 across 34 application routes with Nuxt DevTools disabled to avoid overlay interference.

**Critical Fixes Implemented**:

- **Privacy Compliance**: Removed all Google Analytics/gtag references from the application, maintaining only Plausible Analytics for privacy-focused tracking
- **HTML Language Attributes**: Fixed missing `lang="en"` attributes across all pages through global configuration in `nuxt.config.js` and `app.vue`
- **Hero Section Contrast**: Enhanced WCAG AA compliance (4.5:1 contrast ratio) by adding a semi-transparent dark band behind hero text and lightening the background image overlay
- **Content Structure Fixes**:
  - Added proper H1 headings to funding page (`content/funding.md`)
  - Fixed empty link text issues in FAQ master page (`content/faqs/2025-r3-frequently-asked-questions.md`)
  - Normalized heading hierarchy in NOFO instructions resource (`content/resources/r3-nofo-instructions-and-appendices.md`)
- **Eligibility Map Accessibility Mitigations** (`components/content/MapCensusTracts.vue`):
  - Added semantic heading structure with "Eligibility Map" H2
  - Implemented ARIA landmark region with `aria-labelledby` and `aria-describedby`
  - Created visible "Skip the interactive map" link with anchor destination
  - Added keyboard navigation instructions and alternative access via "Open full-screen map" link
  - Enhanced iframe with descriptive title and lazy loading
  - Implemented focusable, labeled wrapper containers for keyboard accessibility

**Accessibility Status**:

- **Initial Violations**: 58+ violations across multiple pages
- **Final Violations**: 10 total violations across 34 tested pages
- **Remaining Issues**: 6 violations confined to third-party ArcGIS iframe (not fixable from application side)
- **Local Application**: 4 minor violations in content areas (funding H1, FAQ links, heading order)

**Technical Notes**:

- Third-party iframe violations (aria-hidden-focus, aria-prohibited-attr, label-title-only, nested-interactive, tabindex) originate from embedded ArcGIS web application and cannot be resolved without vendor updates
- All application-controlled accessibility barriers have been addressed while preserving full functionality
- Map accessibility improvements provide comprehensive bypass mechanisms and alternative access methods for users who cannot interact with the embedded map interface

**Audit Tools**: axe-core 4.10.3, local testing environment, automated violation detection with manual verification

---

**Need more details?** Visit the [comprehensive documentation](https://r3.illinois.gov/documentation/project/) for complete development guides, API references, and troubleshooting information.
