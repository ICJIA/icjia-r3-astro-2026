/**
 * @fileoverview Static Configuration for the ICJIA R3 Nuxt application
 *
 * PURPOSE: This file contains STATIC configuration values that are used at build-time
 * and by server-side scripts. These values do NOT change at runtime.
 *
 * USE THIS FILE FOR:
 * - API endpoints and URLs
 * - External service URLs (CDN, third-party services)
 * - Build-time configuration
 * - Email service endpoints
 * - Analytics configuration
 * - Values needed by creator scripts (server-side)
 *
 * ACCESS: Direct ES6 import
 * Example: import { config } from './config.js'
 *
 * ⚠️ IMPORTANT DISTINCTION:
 * This file is DIFFERENT from app.config.js:
 * - config.js: STATIC values (API URLs, endpoints) - used at build time
 * - app.config.js: REACTIVE, runtime values (navigation, UI settings) - accessed via useAppConfig()
 *
 * Both files are needed and serve different purposes!
 * See README.md "Configuration Architecture" section for details.
 *
 * @config config.js
 * @since 1.0.0
 *
 * SECURITY NOTE: This file is version controlled and deployed with the application.
 * Do not store sensitive secrets here. Use this for public configuration values only.
 */

/**
 * Application configuration object
 * All configuration values for the ICJIA R3 application
 *
 * @type {Object}
 */
export const config = {
  /**
   * Site Configuration
   */
  site: {
    /** Production site URL */
    url: "https://r3.illinois.gov",
    /** Site name */
    name: "R3 - Restore, Reinvest, Renew",
    /** Site description for SEO */
    description:
      "The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment.",
    /** Contact email */
    email: "CJA.R3grants@illinois.gov",
  },

  /**
   * API Endpoints
   */
  api: {
    /** Main Strapi CMS API */
    base: "https://r3.icjia-api.cloud",
    /** GraphQL endpoint */
    graphql: "https://r3.icjia-api.cloud/graphql",
    /** Research Hub API (GraphQL) */
    researchHub: "https://researchhub.icjia-api.cloud",
    /** Research Hub GraphQL endpoint */
    researchHubGraphql: "https://researchhub.icjia-api.cloud/graphql",
    /** Forms API endpoint */
    forms: "https://r3.icjia-api.cloud/api/forms",
  },

  /**
   * Email Service Configuration
   */
  email: {
    /** Mail service API base URL */
    apiBase: "https://mail.icjia.cloud/internet",
    /** R3 NOFO email endpoint */
    r3Nofo: "https://mail.icjia.cloud/internet/r3-nofo",
    /** Test email endpoint */
    test: "https://mail.icjia.cloud/test",
  },

  /**
   * Analytics & Monitoring
   */
  analytics: {
    /** Plausible Analytics API host */
    plausibleHost: "https://plausible.icjia.cloud",
    /** Plausible domain to track */
    plausibleDomain: "r3.illinois.gov",
    /** Site Improve analytics ID */
    siteImproveId: "6123065",
  },

  /**
   * External Services
   */
  external: {
    /** AmplifFund opportunity URLs */
    amplifund: {
      opportunity1:
        "https://il.amplifund.com/Public/Opportunities/Details/025c7e5e-0584-4bab-b2ce-c6528f5c132e",
      opportunity2:
        "https://il.amplifund.com/Public/Opportunities/Details/41c400bd-795c-444a-a8db-9bad138127be",
    },
    /** CDN URLs for external libraries */
    cdn: {
      jquery: "https://code.jquery.com/jquery-3.7.1.slim.min.js",
      datatables:
        "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.js",
      markJs: "https://cdn.jsdelivr.net/mark.js/8.6.0/mark.min.js",
      datatablesCSS:
        "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.css",
    },
    /** ICJIA organization URLs */
    icjia: {
      main: "https://icjia.illinois.gov",
      twitter: "https://twitter.com/ICJIAIllinois",
      facebook: "https://www.facebook.com/ICJIA",
      linkedin: "https://www.linkedin.com/company/icjia",
    },
    /** Illinois government URLs */
    illinois: {
      main: "https://illinois.gov",
    },
  },

  /**
   * Build & Development Configuration
   */
  build: {
    /** Development server port */
    devPort: 8000,
    /** Node version requirement */
    nodeVersion: "22.14.0",
    /** Yarn version */
    yarnVersion: "1.22.22",
  },

  /**
   * Content Generation Configuration
   */
  content: {
    /** GraphQL query timeout (milliseconds) */
    apiTimeout: 30000,
    /** Maximum retry attempts for API calls */
    maxRetries: 3,
    /** Retry delay base (milliseconds) */
    retryDelay: 1000,
  },

  /**
   * Security Configuration
   */
  security: {
    /** Allowed CORS origins */
    corsOrigins: ["*"],
    /** Content Security Policy directives */
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://cdn.jsdelivr.net",
        "https://code.jquery.com",
        "https://cdn.datatables.net",
        "https://plausible.icjia.cloud",
        "//siteimproveanalytics.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.datatables.net",
        "https://fonts.googleapis.com",
      ],
      imgSrc: ["'self'", "data:", "https:", "https://r3.icjia-api.cloud"],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com",
      ],
      connectSrc: [
        "'self'",
        "https://r3.icjia-api.cloud",
        "https://researchhub.icjia-api.cloud",
        "https://mail.icjia.cloud",
        "https://plausible.icjia.cloud",
      ],
    },
  },

  /**
   * Feature Flags
   */
  features: {
    /** Enable Nuxt devtools (development only) */
    enableDevtools: false,
    /** Enable translation feature */
    enableTranslation: false,
    /** Site under construction flag */
    underConstruction: false,
  },
};

/**
 * Helper function to get config value by path
 * @param {string} path - Dot-notation path (e.g., 'api.base')
 * @returns {any} Configuration value
 *
 * @example
 * getConfig('api.base') // returns 'https://r3.icjia-api.cloud'
 * getConfig('email.r3Nofo') // returns 'https://mail.icjia.cloud/internet/r3-nofo'
 */
export function getConfig(path) {
  return path.split(".").reduce((obj, key) => obj?.[key], config);
}

/**
 * Export as default for convenience
 */
export default config;
