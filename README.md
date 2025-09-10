[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# ICJIA R3 (Restore, Reinvest, Renew) Program Website

The official website for Illinois' R3 Violence Prevention Plan, built with Nuxt 3 and Vue 3. This platform provides comprehensive information about R3 funding opportunities, resources, and program updates.

🌐 **Live Site**: [https://r3.illinois.gov](https://r3.illinois.gov)
📚 **Documentation**: [https://r3.illinois.gov/documentation/](https://r3.illinois.gov/documentation/)

## Quick Start

**For detailed setup instructions and troubleshooting, see the [comprehensive documentation](https://r3.illinois.gov/documentation/project/).**

### Prerequisites

- Node.js 20.19.0+ (use `nvm` or `mise` for version management)
- Yarn package manager
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
```

## Architecture Overview

- **Framework**: Nuxt 3 + Vue 3 + Vuetify 3 (Material Design)
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

# Optional: Analytics and tracking
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

- **Nuxt 3** (v3.13.2) - Vue.js meta-framework
- **Vue 3** - Progressive JavaScript framework
- **Vuetify 3** (v3.7.2) - Material Design components
- **Strapi CMS** - Headless content management
- **Netlify** - Static site hosting and deployment

## Troubleshooting

### Common Issues

**Content not displaying**: Run `yarn scripts` to regenerate content from APIs

**Build errors**: Check API connectivity and environment variables

**Port conflicts**: Use `yarn dev --port=8001` for alternative port

**Cache issues**: Run `yarn clear:cache` then `yarn dev`

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
5. Commit changes and push to your fork
6. Create a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Need more details?** Visit the [comprehensive documentation](https://r3.illinois.gov/documentation/project/) for complete development guides, API references, and troubleshooting information.
