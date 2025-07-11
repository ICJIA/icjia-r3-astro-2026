/**
 * @fileoverview Site routes aggregator script for the ICJIA R3 Nuxt 3 application.
 * This script combines all route definitions from different content types into a single
 * unified routes file for application navigation and routing purposes.
 *
 * The script merges routes from pages, news, FAQs, resources, and manual content,
 * removes duplicates, and outputs the consolidated routes to both public and assets directories.
 *
 * @requires module:uuid - For generating unique identifiers
 * @requires module:jsonfile - For JSON file operations
 * @requires module:dotenv - For environment variable management
 *
 * @since 1.0.0
 */

const { v4: uuidv4 } = require("uuid");
const jsonfile = require("jsonfile");

/**
 * Route definitions for static pages.
 * Contains routing information for all static content pages.
 * Array of page route paths.
 *
 * @type {Array<string>}
 */
const pageRoutes = require("../public/routesPages.json");

/**
 * Route definitions for news articles.
 * Contains routing information for all news content.
 *
 * Array of news route paths.
 *
 * @type {Array<string>}
 */
const newsRoutes = require("../public/routesNews.json");

/**
 * Route definitions for FAQ pages.
 * Contains routing information for all FAQ content.
 *
 * Array of FAQ route paths.
 *
 * @type {Array<string>}
 */
const faqRoutes = require("../public/routesFaqs.json");

/**
 * Route definitions for resource pages.
 * Contains routing information for all resource content.
 *
 * Array of resource route paths.
 *
 * @type {Array<string>}
 */
const resourceRoutes = require("../public/routesResources.json");

/**
 * Route definitions for manually created pages.
 * Contains routing information for all manual content.
 *
 * Array of manual route paths.
 *
 * @type {Array<string>}
 */
const myManualRoutes = require("../public/routesManual.json");

const dotenv = require("dotenv");
dotenv.config();

/**
 * Consolidated application routes array.
 * Combines all route types and removes duplicates using Set.
 * This creates a master list of all available routes in the application.
 *
 * Deduplicated array of all application routes.
 *
 * @type {Array<string>}
 */
const appRoutes = Array.from(
  new Set([
    ...pageRoutes,
    ...newsRoutes,
    ...faqRoutes,
    ...resourceRoutes,
    ...myManualRoutes,
  ])
);

/**
 * Write the consolidated routes to the public directory.
 * This file is used by the application for routing and navigation.
 *
 * @throws {Error} If file write operation fails
 */
jsonfile.writeFileSync(`public/appRoutes.json`, appRoutes, function (err) {
  if (err) {
    console.error(err);
  }
});

/**
 * Write the consolidated routes to the assets directory.
 * This provides a backup copy and allows for build-time access.
 *
 * @throws {Error} If file write operation fails
 */
jsonfile.writeFileSync(`assets/json/appRoutes.json`, appRoutes, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("public/appRoutes.json created:\n", appRoutes);
