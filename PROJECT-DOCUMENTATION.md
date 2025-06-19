# ICJIA R3 (Restore, Reinvest, Renew) Program Website - Project Documentation

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

- **Google Analytics** (nuxt-gtag v3.0.1) - Web analytics
- **Plausible Analytics** (@nuxtjs/plausible v1.0.3) - Privacy-focused analytics
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
- **State Management**: Pinia stores for global state (search queries, navigation state)
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
├── stores/                       # Pinia state management stores
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

### State Management Components

- **`searchStore.js`**: Search query history and state
- **`faqSearchStore.js`**: FAQ-specific search functionality

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

- **Modules**: Google Fonts, Plausible Analytics, Pinia, Nuxt Content
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

#### Google Analytics (gtag)

```javascript
gtag: {
  id: "G-G7XDWC7WPG",
}
```

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
