# ICJIA R3 (Restore, Reinvest, Renew) Program Website - Project Documentation

## Quick Start for Experienced Developers

**For new developers or detailed setup instructions, see the [Setup Instructions](#setup-instructions) section below.**

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
# Edit .env with your API endpoints (see Configuration section for details)

# Generate content and start development
yarn scripts  # Generates all content from APIs
yarn dev      # Starts dev server at http://localhost:8000
```

### Key Commands

```bash
yarn scripts        # Generate all content from APIs
yarn dev           # Development server
yarn generate      # Static site generation
yarn docs:all      # Generate all documentation
yarn clear:cache   # Clear Nuxt cache
```

### Architecture Overview

- **Framework**: Nuxt 3 + Vue 3 + Vuetify 3
- **Content**: Headless CMS (Strapi) + Static generation
- **Deployment**: Netlify static hosting
- **Documentation**: Standalone system at `/documentation/`

### Essential Files

- `nuxt.config.js` - Main configuration
- `creators/` - Content generation scripts
- `components/content/` - Vue components
- `public/documentation/` - Standalone documentation system

---

## Project Overview

### Repository Information

- **Repository**: [ICJIA/icjia-r3-v5-nuxt](https://github.com/ICJIA/icjia-r3-v5-nuxt)
- **License**: MIT
- **Live Site**: [https://r3.illinois.gov](https://r3.illinois.gov)
- **API Base**: [https://r3.icjia-api.cloud](https://r3.icjia-api.cloud)

### Project Purpose and Goals

The R3 (Restore, Reinvest, Renew) Program website serves as the primary digital platform for Illinois' criminal justice reform initiative. The site provides:

- **Grant Information**: Comprehensive details about R3 funding opportunities and application processes
- **Resource Hub**: Educational materials, FAQs, and guidance for potential applicants
- **Program Updates**: News, meetings, and announcements related to the R3 program
- **Community Tools**: Eligibility checkers, collaborative application guidance, and research resources

### Key Features and Functionality

- **Dynamic Content Management**: Headless CMS integration with Strapi for content updates
- **Advanced Search**: Full-text search with Fuse.js across all content types
- **Responsive Design**: Mobile-first approach with Vuetify Material Design components
- **Accessibility**: WCAG compliant with proper semantic markup and navigation
- **Performance Optimized**: Static site generation with Nuxt 3 for fast loading times
- **Multi-language Support**: Spanish language materials and translation capabilities

### Project History and Version Information

- **Current Version**: v5 (Nuxt 3 implementation)
- **Previous Versions**: Built on various frameworks, migrated to modern Nuxt 3 stack
- **Last Major Update**: 2024 (based on package.json dependencies)

## Technology Stack

### Core Framework

- **Nuxt 3** (v3.13.2) - Vue.js meta-framework for universal applications
- **Vue 3** - Progressive JavaScript framework for building user interfaces
- **Node.js** - JavaScript runtime environment

### UI Framework & Styling

- **Vuetify 3** (v3.7.2) - Material Design component framework for Vue.js
- **Material Design Icons** (@mdi/font v7.4.47) - Icon library
- **SASS** (v1.79.4) - CSS preprocessor for advanced styling
- **CSS Variables** - Custom properties for theming and responsive design

### Content Management

- **Nuxt Content** (v2.13.2) - File-based CMS for Markdown content
- **Strapi CMS** - Headless CMS for dynamic content (external API)
- **Markdown-it** (v14.1.0) - Markdown parser with plugin support
- **YAML** (v2.5.1) - Data serialization for frontmatter and configuration

### Build Tools & Development Environment

- **Vite** - Fast build tool and development server
- **Yarn** - Package manager (preferred over npm)
- **ESLint** - Code linting and formatting
- **Prettier** (v3.3.3) - Code formatting
- **TypeScript** - Type checking support

### Search & Utility Libraries

- **Fuse.js** (v7.0.0) - Fuzzy search library for client-side search
- **Axios** (v1.7.7) - HTTP client for API requests
- **Lodash** - Utility library for data manipulation
- **Moment.js** (v2.30.1) - Date manipulation library
- **DOMPurify** (v3.1.7) - HTML sanitization library

### Analytics & Monitoring

- **Plausible Analytics** (@nuxtjs/plausible v1.2.0) - Privacy-focused analytics
- **Custom Event Tracking** - User interaction monitoring

### Deployment & Hosting

- **Netlify** - Static site hosting and deployment
- **Automatic Deployment** - Triggered by pushes to master branch
- **Environment Variables** - Configuration management for different environments

## Architecture Overview

### High-Level Architecture

The R3 website follows a **Jamstack architecture** pattern:

1. **Static Site Generation (SSG)**: Nuxt 3 generates static HTML files at build time
2. **Headless CMS Integration**: Content fetched from Strapi API during build process
3. **Client-Side Hydration**: Vue.js takes over for dynamic interactions
4. **CDN Distribution**: Static files served globally via Netlify's CDN

### Data Flow Patterns

```
External APIs (Strapi CMS) → Build Process → Static Generation → CDN → User Browser
                                    ↓
Local Content (Markdown) → Content Processing → Search Index → Client Search
```

### Key Design Patterns

- **Component-Based Architecture**: Reusable Vue components with clear separation of concerns
- **State Management**: Nuxt 3 native state management using useState composables for global state (search queries, navigation state)
- **Content-First Design**: Markdown-driven content with frontmatter metadata
- **Progressive Enhancement**: Core functionality works without JavaScript

### Integration Points and External Dependencies

- **Strapi CMS API**: `https://r3.icjia-api.cloud` for dynamic content
- **Research Hub API**: `https://researchhub.icjia-api.cloud` for research articles
- **Google Fonts**: Typography and icon fonts
- **DataTables.net**: Enhanced table functionality
- **Mark.js**: Text highlighting for search results

## Directory Structure

```
icjia-r3-v5-nuxt/
├── app/                          # Nuxt 3 app configuration
│   └── router.options.ts         # Custom router configuration
├── assets/                       # Static assets and build resources
│   ├── css/                      # Global stylesheets and variables
│   ├── img/                      # Images and graphics
│   └── json/                     # Static JSON data files
├── components/                   # Vue.js components
│   └── content/                  # Content-specific components
├── composables/                  # Vue composition functions
├── content/                      # Markdown content files
│   ├── faqs/                     # Frequently asked questions
│   ├── news/                     # News articles and updates
│   └── resources/                # Resource documents and guides
├── creators/                     # Build scripts and content generators
├── middleware/                   # Nuxt middleware functions
├── pages/                        # File-based routing pages
├── plugins/                      # Nuxt plugins (Vuetify, etc.)
├── public/                       # Static files served directly
├── server/                       # Server-side API routes
├── src/                          # Source data files (JSON)
├── composables/                  # Nuxt 3 composables for state management and utilities
├── app.config.js                 # Application configuration
├── app.vue                       # Root Vue component
├── nuxt.config.js                # Nuxt framework configuration
└── package.json                  # Dependencies and scripts
```

### Key Configuration Files

- **`nuxt.config.js`**: Main Nuxt configuration with modules, build settings, and routing
- **`app.config.js`**: Application-specific configuration (navigation, API endpoints)
- **`.env.sample`**: Environment variable template
- **`netlify.toml`**: Deployment configuration for Netlify
- **`package.json`**: Dependencies, scripts, and project metadata

### Generated vs. Source Files

- **Generated**: `/public/*.json`, `/content/news/`, `/content/faqs/`, `/content/resources/`
- **Source**: `/src/*.json`, `/creators/*.js`, manual content files
- **Build Artifacts**: `.nuxt/`, `.output/`, `node_modules/`

### Content Directory Generation

⚠️ **Critical Concept**: The `/content` directory is **completely generated at build time** from the Strapi backend.

#### How Content Generation Works

1. **Creator Scripts**: The `/creators` directory contains specialized scripts that fetch data from Strapi CMS
2. **API Fetching**: Scripts pull content from `https://r3.icjia-api.cloud` during build process
3. **Markdown Conversion**: API responses are converted to markdown files with frontmatter
4. **File Generation**: Content is written to `/content/news/`, `/content/faqs/`, `/content/resources/`

#### Creator Scripts Overview

```bash
yarn create:contentDirectory  # Clears and initializes content structure
yarn create:news             # Fetches news from Strapi → /content/news/
yarn create:faqs             # Fetches FAQs from Strapi → /content/faqs/
yarn create:pages            # Fetches pages from Strapi → /content/
yarn create:resources        # Fetches resources from Strapi → /content/resources/
yarn create:hub              # Fetches research articles from Research Hub API
```

#### Important Guidelines

- **Never Edit Manually**: Files in `/content/` are overwritten on every build
- **Source of Truth**: Strapi CMS is the authoritative source for all content
- **Build Dependency**: Content generation must run before Nuxt can build the site
- **API Connectivity**: Build process requires access to Strapi APIs

#### Content Flow

```
Strapi CMS → Creator Scripts → /content/*.md → Nuxt Pages → Static Site
```

This approach ensures content is always current with the CMS while maintaining the performance benefits of static site generation.

## Key Components

### Layout Components

- **`TheNav.vue`**: Primary navigation with responsive menu system
- **`TheSidebar.vue`**: Mobile navigation drawer
- **`TheFooter.vue`**: Site footer with links and contact information
- **`TheBreadcrumbBar.vue`**: Breadcrumb navigation for deep pages

### Content Components

- **`TheSplash.vue`**: Homepage hero section with featured content
- **`HomeBoxes.vue`**: Feature cards and quick access tools
- **`TheTableOfContents.vue`**: Auto-generated page navigation
- **`attachments.vue`**: File download components

### Page Components

- **`index.vue`**: Homepage with news feed and program highlights
- **`search.vue`**: Full-text search interface with Fuse.js
- **`[...slug].vue`**: Dynamic content pages for CMS content
- **`404.vue`**: Custom error page

### Utility Components

- **`TheLoader.vue`**: Loading states and progress indicators
- **`TheExternalWarningModal.vue`**: External link warnings
- **`Query.vue`**: Database query and data display components

### State Management Composables

- **`composables/states.ts`**: Nuxt 3 native state management using useState composables
- **`useSearchActions()`**: Search query history and state management
- **`useFaqSearchActions()`**: FAQ-specific search functionality

## State Management Architecture

### Overview

This project uses **Nuxt 3's native state management** instead of external libraries like Pinia. State is managed through Nuxt's built-in `useState` composable and custom composables that encapsulate state logic.

### Core State Management Patterns

#### 1. useState Composables

The foundation of state management uses Nuxt's `useState` composable for reactive, SSR-safe state:

```typescript
// Basic state definition
export const useCounter = () => useState<number>("counter", () => 0);

// State with custom initial value
export const useColor = () => useState<string>("color", () => "pink");

// Search queries state
export const useSearchQueries = () =>
  useState<string[]>("searchQueries", () => []);
```

#### 2. Action-Based Composables

Complex state logic is encapsulated in action-based composables that provide both state and methods:

```typescript
// Search actions composable
export const useSearchActions = () => {
  const queries = readonly(useSearchQueries());

  const addNewQuery = (query: string) => {
    const searchQueries = useSearchQueries();
    if (!searchQueries.value.includes(query)) {
      searchQueries.value.unshift(query);
      if (searchQueries.value.length > 10) {
        searchQueries.value = searchQueries.value.slice(0, 10);
      }
    }
  };

  const clearQueries = () => {
    const searchQueries = useSearchQueries();
    searchQueries.value = [];
  };

  return { queries, addNewQuery, clearQueries };
};
```

### State Management Features

#### Global State Persistence

- **SSR-Safe**: All state is compatible with server-side rendering
- **Reactive**: Automatic reactivity across components using the same state
- **Persistent**: State persists across page navigation within the SPA

#### Search State Management

- **Query History**: Maintains history of recent search queries (max 10)
- **Duplicate Prevention**: Automatically prevents duplicate queries
- **FAQ Search**: Separate state management for FAQ-specific searches

#### Application State

- **Translation Toggle**: Global state for language switching functionality
- **Navigation State**: Manages navigation-related state across components
- **Theme State**: Color and theme management for UI consistency

### Usage Examples

#### Basic State Usage

```vue
<script setup>
// Simple counter state
const counter = useCounter();

// Increment counter
const increment = () => {
  counter.value++;
};
</script>

<template>
  <div>
    <p>Count: {{ counter }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

#### Search State Usage

```vue
<script setup>
// Search functionality with history
const { queries, addNewQuery, clearQueries } = useSearchActions();

const performSearch = (query: string) => {
  addNewQuery(query);
  // Perform search logic...
};
</script>

<template>
  <div>
    <input @keyup.enter="performSearch($event.target.value)" />
    <div v-if="queries.length">
      <h3>Recent Searches:</h3>
      <ul>
        <li v-for="query in queries" :key="query">{{ query }}</li>
      </ul>
      <button @click="clearQueries">Clear History</button>
    </div>
  </div>
</template>
```

### Migration from Pinia

This project was migrated from Pinia to Nuxt 3 native state management. Key changes include:

- **Stores → Composables**: Pinia stores replaced with useState-based composables
- **defineStore → useState**: Store definitions replaced with composable functions
- **useStore() → useComposable()**: Store usage replaced with direct composable calls
- **Actions → Functions**: Store actions replaced with composable functions

### Benefits of Native State Management

1. **Reduced Bundle Size**: No external state management library
2. **Better SSR Integration**: Native Nuxt 3 SSR support
3. **Simpler Architecture**: Less boilerplate and configuration
4. **Type Safety**: Full TypeScript support with minimal setup
5. **Performance**: Optimized for Nuxt 3's reactivity system

## API Documentation

### External API Integrations

#### Strapi CMS API

- **Base URL**: `https://r3.icjia-api.cloud`
- **Purpose**: Dynamic content management for news, pages, FAQs, and resources
- **Authentication**: Public read-only access
- **Content Types**:
  - `posts`: News articles and announcements
  - `pages`: Static page content
  - `weeklyFaqs`: FAQ collections organized by week
  - `resources`: Resource documents and guides

#### Research Hub API

- **Base URL**: `https://researchhub.icjia-api.cloud`
- **Purpose**: Research articles and publications
- **Query**: GraphQL endpoint for filtered content
- **Integration**: Automated content fetching during build process

#### GraphQL Playground

- **URL**: `https://r3.icjia-api.cloud/graphql`
- **Purpose**: Interactive GraphQL query interface and documentation
- **Features**:
  - **Live Queries**: Execute read-only GraphQL queries in real-time
  - **Schema Documentation**: Complete API documentation and type explorer
  - **Full Schema Browser**: Browse all available types, queries, and fields
  - **Query Builder**: Visual interface for constructing and testing GraphQL queries
- **Access**: No authentication required for query exploration and documentation
- **Limitations**: Read-only access (queries only, no mutations)

### Endpoint Documentation

#### GraphQL Queries

```graphql
# News Posts Query
query {
  posts {
    data {
      id
      attributes {
        title
        slug
        summary
        body
        publishedAt
        searchMeta
      }
    }
  }
}

# Pages Query
query {
  pages {
    data {
      id
      attributes {
        title
        slug
        summary
        body
        showTableOfContents
        isFullPage
      }
    }
  }
}
```

### Data Processing Workflows

1. **Content Fetching**: Creator scripts pull data from APIs during build
2. **Markdown Generation**: API content converted to Markdown files with frontmatter
3. **Search Index Creation**: Full-text search index generated from all content
4. **Route Generation**: Dynamic routes created for all content pages

### Error Handling Strategies

- **API Failures**: Graceful degradation with cached content
- **Build Errors**: Detailed logging in creator scripts
- **Runtime Errors**: Custom error pages and user-friendly messages
- **Content Validation**: Schema validation for API responses

## Documentation System

### Overview

The project includes a comprehensive, standalone documentation system that exists completely outside the Nuxt application filesystem. This ensures the documentation is accessible without interfering with the main application routing or functionality.

### Documentation Architecture

The documentation system consists of four main components:

1. **Standalone Portal** (`/public/documentation/index.html`)
2. **JSDoc API Documentation** (`/public/documentation/jsdoc/`)
3. **Vue Components Documentation** (`/public/documentation/vue-components/`)
4. **Project Documentation** (`/public/documentation/project/`)

### Access Points

- **Main Portal**: `http://localhost:8000/documentation/`
- **Project Documentation**: `http://localhost:8000/documentation/project/`
- **API Documentation**: `http://localhost:8000/documentation/jsdoc/`
- **Vue Components**: `http://localhost:8000/documentation/vue-components/`

### Documentation Portal Features

#### Standalone Design

- **Independent HTML**: No Nuxt components, routing, or dependencies
- **Dark Theme by Default**: Professional dark mode interface with theme switcher
- **Responsive Design**: Works on all screen sizes with modern CSS Grid
- **Direct Navigation**: Links directly to all documentation sections

#### Theme System

- **Dark Mode Default**: Matches professional development tool aesthetics
- **Light Mode Toggle**: Sun/moon icon toggle in top-right corner
- **Persistent Preferences**: Theme choice saved in localStorage
- **Smooth Transitions**: CSS transitions for theme switching

### Documentation Generation

#### Automated Build Integration

```bash
# Documentation is automatically generated during:
yarn dev           # Development server startup
yarn generate      # Static site generation
yarn scripts       # Content generation process

# Manual documentation generation:
yarn docs:all      # Generate all documentation types
yarn docs:jsdoc    # Generate JSDoc API docs only
yarn docs:vue      # Generate Vue component docs only
yarn create:documentation  # Generate project docs only
```

#### Generation Process

1. **JSDoc API Documentation**: Extracts documentation from JavaScript/Vue files
2. **Vue Components Documentation**: Specialized JSDoc extraction for Vue components
3. **Project Documentation**: Converts `PROJECT-DOCUMENTATION.md` to styled HTML
4. **Portal Protection**: Ensures standalone portal is never overwritten

### JSDoc API Documentation

#### Configuration

- **Source Files**: Components, composables, plugins, middleware, server routes, creators
- **Output**: `/public/documentation/jsdoc/`
- **Theme**: Clean JSDoc theme with dark mode
- **Features**: Search, navigation, cross-references

#### Documentation Standards

````javascript
/**
 * Function description with detailed explanation.
 * Additional context about purpose and usage.
 *
 * @param {string} paramName - Parameter description
 * @param {Object} options - Configuration object
 * @param {boolean} options.flag - Option description
 * @returns {Promise<Object>} Description of return value
 * @throws {Error} When invalid parameters provided
 * @example
 * ```javascript
 * const result = await myFunction('value', { flag: true });
 * console.log(result);
 * ```
 * @since 1.0.0
 */
````

#### Coverage

- **Functions**: All utility functions and helpers
- **Composables**: Vue 3 composition functions
- **Components**: Vue component methods and computed properties
- **Server Routes**: API endpoint documentation
- **Creator Scripts**: Build process documentation

### Vue Components Documentation

#### Specialized Extraction

- **Props**: Type definitions, default values, validation
- **Events**: Emitted events with payload descriptions
- **Slots**: Available slots with expected content
- **Methods**: Public methods and their signatures
- **Computed Properties**: Reactive computed values

#### Component Documentation Example

````vue
<script setup>
/**
 * Navigation component with responsive menu system.
 * Provides primary navigation for the application with mobile support.
 *
 * @component
 * @example
 * ```vue
 * <TheNav />
 * ```
 */

/**
 * Navigation menu items from app configuration.
 * Array of navigation menu items.
 *
 * @type {Array<Object>}
 */
const navMenu = JSON.parse(JSON.stringify(appConfig.navMenu));
</script>
````

### Project Documentation

#### Source and Generation

- **Source**: `PROJECT-DOCUMENTATION.md` (this file)
- **Output**: `/public/documentation/project/index.html`
- **Processing**: Markdown to HTML with syntax highlighting
- **Styling**: Professional documentation theme with dark mode

#### Features

- **Syntax Highlighting**: Code blocks with Prism.js
- **Table of Contents**: Auto-generated navigation
- **Anchor Links**: Clickable headings for deep linking
- **Responsive Design**: Mobile-friendly layout
- **Theme Toggle**: Dark/light mode switcher

### Protection System

#### Portal Protection

The documentation system includes a protection mechanism to prevent the standalone portal from being overwritten:

```javascript
// creators/protectDocumentationPortal.js
// Automatically runs after documentation generation
// Restores portal from backup if overwritten
```

#### Build Integration

```json
{
  "scripts": {
    "docs:all": "yarn docs:jsdoc && yarn docs:vue && yarn create:documentation && yarn protect:portal"
  }
}
```

### Maintenance and Updates

#### Automatic Updates

- **Every Build**: Documentation regenerated with current code
- **JSDoc Comments**: Automatically extracted and processed
- **Component Changes**: Vue component docs updated automatically
- **Project Documentation**: Regenerated from this markdown file

#### Manual Updates

- **Portal Design**: Edit `/public/documentation/portal.html` (backup)
- **JSDoc Config**: Modify `jsdoc.config.json` or `jsdoc-vue.config.json`
- **Project Docs**: Update this `PROJECT-DOCUMENTATION.md` file

### Best Practices

#### Documentation Writing

1. **Comprehensive JSDoc**: Include @param, @returns, @example, @throws
2. **Component Documentation**: Document all props, events, and slots
3. **Usage Examples**: Provide practical code examples
4. **Error Handling**: Document error conditions and exceptions

#### Maintenance

1. **Regular Updates**: Keep documentation current with code changes
2. **Review Process**: Include documentation in code reviews
3. **Testing**: Verify documentation generation in CI/CD
4. **Accessibility**: Ensure documentation is accessible to all developers

## Database Schema

### Content Structure and Validation Rules

The project uses a **file-based content system** with structured frontmatter:

#### News Articles

```yaml
---
title: "Article Title"
slug: "article-slug"
summary: "Brief description"
searchMeta: "Additional search terms"
hideFromSearch: false
hideFromSitemap: false
showTableOfContents: true
section: "news"
createdAt: "2024-01-01T00:00:00.000Z"
publishedAt: "2024-01-01T00:00:00.000Z"
---
```

#### Page Content

```yaml
---
title: "Page Title"
slug: "page-slug"
summary: "Page description"
isFullPage: true
showTableOfContents: false
section: "pages"
---
```

### Migration and Seeding Strategies

- **Content Migration**: Creator scripts handle API-to-file conversion
- **Data Validation**: YAML frontmatter validation during build
- **Content Updates**: Automated regeneration on API changes

## Setup Instructions

### Prerequisites and System Requirements

⚠️ **IMPORTANT PLATFORM COMPATIBILITY WARNING** ⚠️

This project is **NOT compatible with vanilla Windows** (native Windows without WSL2). Development requires one of these supported platforms:

1. **Windows with WSL2** (Windows Subsystem for Linux 2) - **REQUIRED** for Windows users
2. **macOS** (Apple Silicon M1/M2/M3/M4 preferred over Intel for better performance)
3. **Linux** (Debian/Ubuntu distributions recommended)

**Technical Reasoning**: Node.js development tools, file system operations, and build processes work more reliably on Unix-like systems. Many npm packages, build tools, and file watchers have compatibility issues with native Windows environments.

### Step-by-Step Installation Process

#### For Windows Users (WSL2 Required)

```bash
# Install WSL2 and Ubuntu (run in PowerShell as Administrator)
wsl --install -d Ubuntu

# Restart computer and open Ubuntu terminal
# Install Node.js via Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Install Yarn
npm install -g yarn

# Clone and setup project
git clone https://github.com/ICJIA/icjia-r3-v5-nuxt.git
cd icjia-r3-v5-nuxt
nvm use
yarn install
cp .env.sample .env
```

#### For macOS Users

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Yarn
brew install node yarn

# Clone and setup project
git clone https://github.com/ICJIA/icjia-r3-v5-nuxt.git
cd icjia-r3-v5-nuxt
nvm use  # if using nvm
yarn install
cp .env.sample .env
```

#### For Linux Users (Ubuntu/Debian)

```bash
# Update package manager
sudo apt update

# Install Node.js via NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install -g yarn

# Clone and setup project
git clone https://github.com/ICJIA/icjia-r3-v5-nuxt.git
cd icjia-r3-v5-nuxt
nvm use  # if using nvm
yarn install
cp .env.sample .env
```

### Environment Configuration

Edit the `.env` file with appropriate values:

```bash
NUXT_PUBLIC_API_BASE_URL=https://r3.icjia-api.cloud
NUXT_PUBLIC_BASE_URL=https://r3.illinois.gov
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=r3.illinois.gov
```

### Verification Steps and Troubleshooting

```bash
# Verify Node.js and Yarn installation
node --version  # Should be v18+ or v20+
yarn --version  # Should be v1.22+ or v3+

# Test development server
yarn dev

# Verify build process
yarn generate

# Check for common issues
yarn scripts  # Should complete without errors
```

## Development Workflow

### Git Workflow and Branching Strategy

- **Main Branch**: `main` (production-ready code)
- **Feature Branches**: `feature/description` for new features
- **Hotfix Branches**: `hotfix/description` for urgent fixes
- **Pull Request Process**: Required for all changes to main branch

### Code Standards and Formatting Rules

- **ESLint Configuration**: Extends Vue.js recommended rules
- **Prettier Integration**: Automatic code formatting on save
- **Vue Style Guide**: Following Vue.js official style guide
- **Naming Conventions**:
  - Components: PascalCase (e.g., `TheNavigation.vue`)
  - Files: kebab-case for pages, camelCase for utilities
  - Variables: camelCase for JavaScript, kebab-case for CSS

### Testing Approach and Procedures

- **Manual Testing**: Cross-browser testing on major browsers
- **Build Testing**: Automated testing during CI/CD pipeline
- **Content Validation**: Automated checks for content integrity
- **Performance Testing**: Lighthouse audits for performance metrics

### Common Development Tasks and Procedures

#### Starting Development

```bash
# Clear cache and start development server
yarn dev

# Development server runs on http://localhost:8000
# Hot reload enabled for instant feedback
```

#### Content Updates

```bash
# Regenerate all content from APIs
yarn scripts

# Individual content type updates
yarn create:news        # Update news articles
yarn create:pages       # Update static pages
yarn create:faqs        # Update FAQ content
yarn create:resources   # Update resource documents
```

#### Build and Deployment

```bash
# Generate static site for production
yarn generate

# Preview production build locally
yarn generate:serve

# Clear build cache if needed
yarn clear:cache
```

## Build and Deployment

### Build Process Overview

The build process follows a **multi-stage approach**:

1. **Content Generation**: Creator scripts fetch and process external content
2. **Static Site Generation**: Nuxt 3 generates static HTML files
3. **Asset Optimization**: Images, CSS, and JavaScript are optimized
4. **Route Generation**: Dynamic routes created for all content pages

### Content Generation Workflows

```bash
# Complete build script sequence
yarn scripts

# Individual creator scripts (run in order)
yarn create:contentDirectory  # Initialize content structure
yarn create:manualPages      # Process manual content
yarn create:news             # Fetch and process news
yarn create:faqs             # Fetch and process FAQs
yarn create:pages            # Fetch and process pages
yarn create:resources        # Fetch and process resources
yarn create:hub              # Fetch research articles
yarn create:hubImages        # Download research images
yarn create:routes           # Generate route definitions
yarn create:searchIndex      # Build search index
yarn create:sitemap          # Generate XML sitemap
```

### Deployment Configuration and Process

#### Netlify Configuration (`netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    X-Greeting = "Hello from Chicago!"
```

#### Automatic Deployment

- **Trigger**: Push to `main` branch
- **Build Command**: `yarn generate`
- **Publish Directory**: `.output/public`
- **Environment Variables**: Configured in Netlify dashboard

### Environment-Specific Considerations

#### Development Environment

- **Hot Reload**: Instant updates during development
- **Source Maps**: Enabled for debugging
- **API Proxying**: Development server proxies API requests

#### Production Environment

- **Static Generation**: All pages pre-rendered at build time
- **Asset Optimization**: Minified CSS, JavaScript, and images
- **CDN Distribution**: Global content delivery via Netlify

## Configuration

### Environment Variables and Their Purposes

```bash
# API Configuration
NUXT_PUBLIC_API_BASE_URL=https://r3.icjia-api.cloud
NUXT_PUBLIC_BASE_URL=https://r3.illinois.gov

# Analytics Configuration
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=r3.illinois.gov

# Optional Development Variables
NODE_ENV=development  # or production
```

### Application Configuration Options

#### Nuxt Configuration (`nuxt.config.js`)

- **Modules**: Google Fonts, Plausible Analytics, VueUse, Nuxt Content
- **Build Settings**: Transpilation, optimization, and bundling options
- **Routing**: Custom routes and redirects
- **SEO**: Meta tags, Open Graph, and structured data

#### App Configuration (`app.config.js`)

- **Site Metadata**: Title, description, and branding
- **Navigation Menus**: Primary and footer navigation structures
- **Feature Flags**: Toggle features like construction mode
- **External URLs**: Links to related ICJIA resources

### Build and Deployment Configurations

- **Static Generation**: Pre-rendering all routes at build time
- **Asset Optimization**: Image compression and lazy loading
- **Performance**: Code splitting and tree shaking
- **SEO**: Automatic sitemap and robots.txt generation

### SEO and Analytics Setup

#### Plausible Analytics

```javascript
plausible: {
  apiHost: "https://plausible.icjia.cloud",
  ignoredHostnames: ["localhost"],
  autoOutboundTracking: true,
}
```

#### SEO Optimization

- **Meta Tags**: Dynamic title and description generation
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for search engines
- **Sitemap**: Automatic XML sitemap generation

## Troubleshooting

### Common Issues and Solutions

#### Platform-Specific Issues

**Windows Users Attempting Native Development (Common Mistakes):**

- **Error**: `ENOENT: no such file or directory, scandir` → **Solution**: Use WSL2, not native Windows
- **Error**: `gyp ERR! stack Error: Can't find Python executable` → **Solution**: Use WSL2 with proper Linux environment
- **Error**: File watchers not working or extremely slow → **Solution**: Use WSL2 file system, not Windows file system
- **Error**: `EPERM: operation not permitted` on file operations → **Solution**: Use WSL2 with proper Unix permissions
- **Error**: Build scripts failing with path resolution errors → **Solution**: Use WSL2 for proper Unix path handling

**WSL2-Specific Issues:**

- **Performance**: Store projects in WSL2 file system (`/home/username/`) not Windows file system (`/mnt/c/`)
- **VS Code Integration**: Install "Remote - WSL" extension for proper development environment
- **Memory Issues**: Configure WSL2 memory limits in `.wslconfig` file
- **Network Issues**: Use WSL2 IP address for local development server access

#### Build Failures

```bash
# Clear all caches and rebuild
yarn clear:cache
rm -rf node_modules
yarn install
yarn scripts
yarn generate

# Check for API connectivity
curl https://r3.icjia-api.cloud/graphql

# Verify environment variables
cat .env
```

#### Development Server Issues

```bash
# Port conflicts
yarn dev --port=8001  # Use alternative port

# Hot reload problems
yarn clear:cache
yarn dev

# Memory issues
export NODE_OPTIONS="--max-old-space-size=4096"
yarn dev
```

#### Content Display Issues

- **Missing Content**: Run `yarn scripts` to regenerate content from APIs
- **Broken Images**: Check image URLs in API responses
- **Search Problems**: Regenerate search index with `yarn create:searchIndex`
- **404 Errors**: Verify routes are generated correctly in `public/appRoutes.json`

### Debug Mode and Logging Strategies

```bash
# Enable debug mode
DEBUG=nuxt:* yarn dev

# Check build logs
yarn generate --verbose

# Inspect generated routes
cat public/appRoutes.json

# Check search index
cat assets/json/searchIndex.json
```

### Performance Optimization Tips

- **Image Optimization**: Use WebP format and lazy loading
- **Code Splitting**: Leverage Nuxt 3's automatic code splitting
- **Caching**: Implement proper cache headers for static assets
- **Bundle Analysis**: Use `yarn build --analyze` to inspect bundle size

### Maintenance Tasks and Schedules

- **Weekly**: Update content via `yarn scripts`
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Performance audits and optimization
- **Annually**: Major framework updates and migrations

## Node.js Development Guide for New Developers

### Node.js Fundamentals and Ecosystem Overview

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows developers to run JavaScript on the server side. Key concepts:

- **Package Manager**: Yarn (preferred) or npm for dependency management
- **Module System**: ES6 modules and CommonJS for code organization
- **Async Programming**: Promises, async/await for handling asynchronous operations
- **Build Tools**: Vite for fast development and building

### Platform-Specific Setup Instructions

#### Windows with WSL2 (MANDATORY for Windows Users)

**Why WSL2 is Required:**

- Native Windows lacks proper Unix-like file system operations
- Many Node.js packages have native dependencies that don't compile on Windows
- File watchers and build tools perform poorly on Windows file systems
- Path resolution and symlink handling differ significantly from Unix systems

**Complete WSL2 Setup Process:**

```bash
# 1. Install WSL2 (run in PowerShell as Administrator)
wsl --install -d Ubuntu

# 2. Restart computer and open Ubuntu terminal
# 3. Install Node.js via Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# 4. Install Yarn globally
npm install -g yarn

# 5. Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### macOS (Fully Supported)

```bash
# Install Homebrew package manager
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Yarn
brew install node yarn

# Optional: Install nvm for Node version management
brew install nvm
```

#### Linux (Fully Supported)

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn

# Fedora/CentOS
sudo dnf install nodejs npm
npm install -g yarn
```

### Essential Command Line Skills

```bash
# Navigation
cd /path/to/project    # Change directory
ls -la                 # List files with details
pwd                    # Print working directory

# File operations
cp file1 file2         # Copy files
mv file1 file2         # Move/rename files
rm file                # Remove files
mkdir directory        # Create directory

# Git operations
git status             # Check repository status
git add .              # Stage all changes
git commit -m "message" # Commit changes
git push               # Push to remote repository

# Node.js/Yarn operations
yarn install           # Install dependencies
yarn dev               # Start development server
yarn build             # Build for production
yarn add package-name  # Add new dependency
```

### Development Workflow Best Practices

1. **Version Control**: Always use Git for version control
2. **Branch Management**: Create feature branches for new work
3. **Code Quality**: Use ESLint and Prettier for consistent code style
4. **Testing**: Test changes locally before committing
5. **Documentation**: Keep README and documentation updated

### Project-Specific Quick Start Guide

```bash
# 1. Clone the repository
git clone https://github.com/ICJIA/icjia-r3-v5-nuxt.git
cd icjia-r3-v5-nuxt

# 2. Setup environment
cp .env.sample .env
nvm use  # Use correct Node.js version

# 3. Install dependencies
yarn install

# 4. Generate content and start development
yarn dev

# 5. Open browser to http://localhost:8000
```

### Useful Tools and Extensions

#### VS Code Extensions

- **Vetur** or **Vue Language Features**: Vue.js support
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Remote - WSL**: WSL2 integration (Windows users)
- **GitLens**: Enhanced Git capabilities

#### Browser Tools

- **Vue DevTools**: Browser extension for Vue.js debugging
- **Lighthouse**: Performance and accessibility auditing
- **Network Tab**: Monitor API requests and responses

#### Command Line Tools

```bash
# Global tools that are helpful
npm install -g @vue/cli          # Vue CLI
npm install -g @nuxt/cli         # Nuxt CLI
npm install -g serve             # Static file server
npm install -g lighthouse       # Performance auditing
```

This comprehensive documentation provides everything needed to understand, set up, develop, and maintain the ICJIA R3 website project. The platform-specific instructions ensure compatibility across Windows (with WSL2), macOS, and Linux environments, while the troubleshooting section addresses common development challenges.
