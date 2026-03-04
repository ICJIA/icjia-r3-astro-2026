/**
 * @fileoverview Nuxt App Config - Runtime Reactive Configuration
 *
 * PURPOSE: This file exposes REACTIVE configuration to the application at runtime.
 * These values can be accessed in components, pages, and composables using useAppConfig().
 *
 * USE THIS FILE FOR:
 * - Navigation menus (nav structure that might be updated)
 * - UI configuration (themes, layout settings)
 * - Content configuration (splash screens, homepage tools)
 * - Runtime-updatable settings
 * - Client-side accessible configuration
 *
 * ACCESS: Via Nuxt composable
 * Example: const appConfig = useAppConfig()
 * Then access: appConfig.navMenu, appConfig.splash, etc.
 *
 * FEATURES:
 * - ✅ Reactive - changes propagate to components
 * - ✅ Hot Module Replacement (HMR) support in development
 * - ✅ Can be updated at runtime via updateAppConfig()
 * - ✅ Accessible on both server and client side
 *
 * ⚠️ IMPORTANT DISTINCTION:
 * This file is DIFFERENT from config.js:
 * - app.config.js: REACTIVE, runtime values (navigation, UI) - accessed via useAppConfig()
 * - config.js: STATIC values (API URLs, endpoints) - used at build time by creator scripts
 *
 * NOTE: This file cannot import from config.js because Nuxt transforms imports during build.
 * Values are duplicated here for runtime use. Keep config.js and app.config.js in sync!
 *
 * @see https://nuxt.com/docs/api/composables/use-app-config
 * @config app.config.js
 * @since 1.0.0
 */

/**
 * Static configuration values (duplicated from config.js for Nuxt runtime)
 * Keep these in sync with config.js!
 */
const SITE_NAME = "R3 - Restore, Reinvest, Renew";
const SITE_DESCRIPTION =
  "The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment.";
const SITE_URL = "https://r3.illinois.gov";
const API_BASE = "https://r3.icjia-api.cloud";
const UNDER_CONSTRUCTION = false;
const AMPLIFUND_OPPORTUNITY_1 =
  "https://il.amplifund.com/Public/Opportunities/Details/025c7e5e-0584-4bab-b2ce-c6528f5c132e";
const AMPLIFUND_OPPORTUNITY_2 =
  "https://il.amplifund.com/Public/Opportunities/Details/41c400bd-795c-444a-a8db-9bad138127be";

/**
 * Main application configuration object.
 * Contains all application-wide settings, content, and navigation structure.
 *
 * @typedef {Object} AppConfig
 * @property {string} title - Application title for SEO and branding
 * @property {string} description - Application description for SEO
 * @property {string} api - Base URL for the R3 API endpoints
 * @property {string} root - Root URL for the application
 * @property {boolean} underConstruction - Whether the site is under construction
 * @property {Array<Object>} splash - Homepage splash/hero content configuration
 * @property {Array<Object>} tools - Quick access tools for the homepage
 * @property {Array<Object>} navMenu - Main navigation menu structure
 */
export default defineAppConfig({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  api: API_BASE,
  root: SITE_URL,
  underConstruction: UNDER_CONSTRUCTION,

  splash: [
    {
      externalURL: AMPLIFUND_OPPORTUNITY_1,
      src: "https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg",
      lazySrc: "https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg",
      tagline:
        "$35M in funding available for service delivery projects proposed to address one or more of the R3 priorities of reentry, economic development,  and civil legal aid.  ",
      title: "Notice of Funding Opportunity",
    },
    {
      externalURL: AMPLIFUND_OPPORTUNITY_2,
      src: "https://r3.icjia-api.cloud/uploads/large_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg",
      lazySrc:
        "https://r3.icjia-api.cloud/uploads/thumbnail_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg",
      title: "Notice of Funding Opportunity",
      tagline:
        "$15M in funding available for service delivery projects proposed to address one or more of the R3 priorities of youth development and violence prevention.",
    },
  ],

  tools: [
    {
      title: "Eligibility",
      tagline: "Find out if you're eligible to apply for funding",
      link: "/eligibility",
    },
    {
      title: "FAQs",
      tagline: "Frequently asked questions about R3 funding",
      link: "/faqs",
    },
    {
      title: "Collaboratives",
      tagline:
        "Groups of two or more organization that apply for funding for a single cooperative program under one application",
      link: "/collaboratives",
    },
    {
      title: "Resources",
      tagline: "R3 resources and analysis",
      link: "/resources",
    },
  ],

  navMenu: [
    {
      main: "Home",
      link: "/",
      nudgeLeft: "78px",
    },
    {
      main: "About",
      nudgeLeft: "57px",
      children: [
        {
          section: "About the R3 Program",
        },
        {
          title: "R3 news",
          link: "/news",
        },
        {
          title: "Meetings",
          link: "/meetings",
        },
        {
          title: "R3 Program Board",
          link: "/board",
        },
        {
          title: "Research",
          link: "/research",
        },
        {
          title: "About the R3 Program",
          link: "https://storymaps.arcgis.com/stories/ba94e59080224a78bae5a5511dec5b6f",
          external: true,
        },

        {
          divider: true,
        },
        {
          section: "Applicant Tools",
        },
        {
          title: "FAQs",
          link: "/faqs",
        },
        {
          title: "Collaboratives",
          link: "/collaboratives",
        },
        {
          title: "Resources",
          link: "/resources",
        },
      ],
    },
    {
      main: "Eligibility",
      link: "/eligibility",
      nudgeLeft: "78px",
    },
    {
      main: "Contact",
      link: "/contact",
      nudgeLeft: "78px",
    },
  ],
  footerMenu: [
    {
      main: "Home",
      link: "/",
    },

    {
      main: "FAQs",
      link: "/faqs",
    },
    {
      main: "News",
      link: "/news",
    },
    {
      main: "Contact",
      link: "/contact",
    },
    {
      main: "Meetings",
      link: "/meetings",
    },
    {
      main: "Eligibility",
      link: "/eligibility",
    },
    {
      main: "Collaboratives",
      link: "/collaboratives",
    },
    {
      main: "Research",
      link: "/research",
    },
    {
      main: "Resources",
      link: "/resources",
    },
    {
      main: "Search",
      link: "/search",
    },
    {
      main: "Accessibility",
      link: "/docs/accessibility/index.html",
      isExternal: true,
    },
  ],
});
