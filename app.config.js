/**
 * @fileoverview Application configuration for the ICJIA R3 Nuxt 3 application.
 *
 * This file contains the main application configuration including site metadata,
 * API endpoints, navigation structure, splash content, and tool definitions.
 * It serves as the central configuration hub for the R3 application.
 *
 * @config app.config.js
 * @since 1.0.0
 */

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
  /**
   * Application title used for SEO and browser display.
   *
   * @type {string}
   */
  title: "R3 (R3)",

  /**
   * Application description for SEO meta tags.
   *
   * @type {string}
   */
  description: "R3 description.",

  /**
   * Base URL for the R3 API endpoints.
   * Used for fetching content and data from the backend.
   *
   * @type {string}
   */
  api: "https://r3.icjia-api.cloud",

  /**
   * Root URL for the application.
   * Used for generating absolute URLs and canonical links.
   *
   * @type {string}
   */
  root: "https://r3.illinois.gov",

  /**
   * Construction status flag.
   * When true, displays construction notices or restricts access.
   *
   * @type {boolean}
   */
  underConstruction: false,

  /**
   * Homepage splash/hero content configuration.
   * Contains featured content, grant opportunities, and call-to-action items.
   *
   * @type {Array<Object>}
   * @property {string} externalURL - External link for the splash item
   * @property {string} src - Main image URL for the splash
   * @property {string} lazySrc - Thumbnail image URL for lazy loading
   * @property {string} tagline - Descriptive text for the splash item
   * @property {string} title - Main title for the splash item
   */
  splash: [
    {
      externalURL:
        "https://il.amplifund.com/Public/Opportunities/Details/025c7e5e-0584-4bab-b2ce-c6528f5c132e",
      src: "https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg",
      lazySrc: "https://r3.icjia-api.cloud/uploads/r32025_1_08392baf96.jpg",
      tagline:
        "$35M in funding available for service delivery projects proposed to address one or more of the R3 priorities of reentry, economic development,  and civil legal aid.  ",
      title: "Notice of Funding Opportunity",
    },
    {
      externalURL:
        "https://il.amplifund.com/Public/Opportunities/Details/41c400bd-795c-444a-a8db-9bad138127be",
      src: "https://r3.icjia-api.cloud/uploads/large_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg",
      lazySrc:
        "https://r3.icjia-api.cloud/uploads/thumbnail_getty_images_Br_GGMIVO_9r_U_unsplash_f4b0e5293b.jpg",
      title: "Notice of Funding Opportunity",
      tagline:
        "$15M in funding available for service delivery projects proposed to address one or more of the R3 priorities of youth development and violence prevention.",
    },
  ],
  /**
   * Quick access tools displayed on the homepage.
   * Provides easy navigation to key application features and resources.
   *
   * @type {Array<Object>}
   * @property {string} title - Display title for the tool
   * @property {string} tagline - Descriptive text explaining the tool's purpose
   * @property {string} link - Internal link path for the tool
   */
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
  /**
   * Main navigation menu structure for the application.
   * Defines the hierarchical navigation with main items and sub-menus.
   *
   * @type {Array<Object>}
   * @property {string} main - Main navigation item title
   * @property {string} link - Direct link for main navigation items
   * @property {string} nudgeLeft - CSS positioning for dropdown alignment
   * @property {Array<Object>} children - Sub-menu items for dropdown navigation
   * @property {string} children.section - Section header for grouping menu items
   * @property {string} children.title - Sub-menu item title
   * @property {string} children.link - Sub-menu item link
   * @property {boolean} children.divider - Whether to show a visual divider
   */
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
      main: "Board",
      link: "/board",
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
