# Centralized Configuration System

**Last Updated**: January 10, 2026  
**Version**: 1.0.0

## Overview

The ICJIA R3 Nuxt application uses a centralized configuration system via the `config.js` file at the project root. This approach provides a single source of truth for all configuration values and eliminates the need for manually managing environment variables in deployment platforms like Netlify.

## Why This Approach?

### Before (Environment Variables)

- Configuration values scattered across `.env` files
- Manual setup required in Netlify dashboard for each environment variable
- Harder to version control configuration changes
- Risk of missing or incorrect environment variables in production

### After (Centralized Config)

- All configuration in one version-controlled file
- No manual Netlify setup required
- Easy to update and track configuration changes
- Type-safe with JSDoc comments
- Single deployment to all environments

## Configuration File Structure

### Location

```
/config.js
```

### Structure

The configuration is organized into logical sections:

```javascript
export const config = {
  site: {
    // Site URLs, name, description, contact info
  },
  api: {
    // All API endpoints (Strapi, Research Hub, GraphQL, Forms)
  },
  email: {
    // Email service endpoints
  },
  analytics: {
    // Analytics and monitoring configuration
  },
  external: {
    // External services (AmplifFund, CDNs, social media)
  },
  build: {
    // Build and development settings
  },
  content: {
    // Content generation configuration
  },
  security: {
    // Security settings (CORS, CSP)
  },
  features: {
    // Feature flags
  },
};
```

## Usage

### In Nuxt Config

```javascript
// nuxt.config.js
import config from "./config.js";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: config.api.base,
      siteBase: config.site.url,
    },
  },

  app: {
    head: {
      script: [{ src: config.external.cdn.jquery }],
    },
  },
});
```

### In App Config

```javascript
// app.config.js
import config from "./config.js";

export default defineAppConfig({
  title: config.site.name,
  description: config.site.description,
  api: config.api.base,
  root: config.site.url,
});
```

### In Creator Scripts (CommonJS)

```javascript
// creators/createMarkdownPages.js
const config = require("../config.js");

const SITE_URL = config.site.url;
const API = config.api.base;
```

### In Creator Scripts (ES Modules)

```javascript
// creators/createHubArticles.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("../config.js").default;

axios.create({ baseURL: config.api.researchHub });
```

### Helper Function

The config file also exports a helper function to get values using dot notation:

```javascript
import { getConfig } from "./config.js";

const apiBase = getConfig("api.base");
const email = getConfig("email.r3Nofo");
```

## Configuration Sections

### 1. Site Configuration

- Production URL
- Site name and description
- Contact email

### 2. API Endpoints

- Main Strapi CMS API
- GraphQL endpoints
- Research Hub API
- Forms API

### 3. Email Service

- Mail service API
- R3 NOFO email endpoint
- Test endpoints

### 4. Analytics & Monitoring

- Plausible Analytics
- Site Improve ID

### 5. External Services

- AmplifFund opportunities
- CDN URLs (jQuery, DataTables, Mark.js)
- ICJIA organization links
- Social media links

### 6. Build & Development

- Dev server port
- Node version requirement
- Yarn version

### 7. Content Generation

- API timeout settings
- Retry configuration
- Delay settings

### 8. Security

- CORS origins
- Content Security Policy directives

### 9. Feature Flags

- Devtools enabled/disabled
- Translation feature
- Site construction status

## Migration from Environment Variables

### Files Updated

1. **`nuxt.config.js`** - Now imports and uses `config.js`
2. **`app.config.js`** - Now imports and uses `config.js`
3. **`creators/createMarkdownPages.js`** - Removed environment variable validation, uses `config`
4. **`creators/createMarkdownNews.js`** - Removed environment variable validation, uses `config`
5. **`creators/createMarkdownResources.js`** - Removed environment variable validation, uses `config`
6. **`creators/createMarkdownFaqs.js`** - Removed environment variable validation, uses `config`
7. **`creators/createHubArticles.mjs`** - Uses `config` for API URLs
8. **`creators/createHubImages.mjs`** - Uses `config` for API URLs

### Removed Files

- No longer need `.env` file (though `.env.example` can remain for documentation)

## Benefits

### 1. **Version Control**

All configuration is tracked in Git, making it easy to see when and why values changed.

### 2. **No Manual Setup**

Deploy to Netlify without manually entering environment variables in the dashboard.

### 3. **Type Safety**

JSDoc comments provide IDE autocomplete and type checking.

### 4. **Single Source of Truth**

One file to update when configuration changes are needed.

### 5. **Easy Testing**

Can easily create test configurations by modifying the config object.

### 6. **Documentation**

Built-in documentation via JSDoc comments explains each configuration value.

## Important Notes

### ⚠️ No Secrets in Config

The `config.js` file is committed to version control and deployed with the application. **Never store sensitive secrets** like API keys, passwords, or tokens in this file.

For sensitive values:

- Use server-side only environment variables
- Use Netlify's build environment variables (not accessible to client)
- Use encrypted secrets management

### ✅ Good for Config

- Public API endpoints
- Site URLs
- External service URLs
- Feature flags
- Build settings
- Timeouts and retry settings

### ❌ Bad for Config

- API keys
- Database passwords
- Authentication tokens
- Private keys
- Any sensitive credentials

## Updating Configuration

### For Development Changes

1. Edit `/config.js`
2. Update relevant values
3. Test locally
4. Commit changes to Git

### For Production Changes

1. Edit `/config.js`
2. Update production values
3. Test in development/staging
4. Commit and push to main branch
5. Netlify automatically deploys with new config

## Backwards Compatibility

### Environment Variables Still Work

If you need to override configuration values with environment variables (for testing or special deployments), you can still use them:

```javascript
const API_BASE = process.env.NUXT_PUBLIC_API_BASE_URL || config.api.base;
```

However, this is not recommended for standard deployments.

## Future Enhancements

### Possible Improvements

1. **Environment-Specific Configs**: Create `config.dev.js`, `config.prod.js`
2. **Config Validation**: Add runtime validation for required config values
3. **TypeScript**: Convert to TypeScript for stronger type safety
4. **Config Layers**: Support overriding config via separate files
5. **Encrypted Values**: Add support for encrypted configuration values

## Troubleshooting

### Config Not Loading

- Ensure `config.js` is at the project root
- Check import/require syntax matches module type (ES modules vs CommonJS)
- Verify file permissions

### Values Not Updating

- Clear `.nuxt` and `.output` directories
- Restart dev server
- Rebuild for production

### Type Errors

- Check JSDoc comments are correct
- Ensure you're accessing nested values correctly
- Use `getConfig()` helper for safe access

## Related Documentation

- [README.md](/README.md) - Main project documentation
- [PROJECT_REVIEW.md](/markdown-documentation/PROJECT_REVIEW.md) - Project strengths and weaknesses
- [IMPROVEMENT_REVIEW.md](/markdown-documentation/IMPROVEMENT_REVIEW.md) - Error handling improvements

## Summary

The centralized configuration system provides a robust, maintainable approach to managing application settings. By consolidating all configuration in one file, we eliminate the complexity of environment variable management while maintaining flexibility and version control.

This approach is ideal for static sites deployed to platforms like Netlify where configuration values are public and not sensitive.
