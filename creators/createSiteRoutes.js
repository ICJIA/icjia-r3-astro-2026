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
 *
 * @since 1.0.0
 */

import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";
import jsonfile from "jsonfile";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Safely require a JSON file, returning empty array if file doesn't exist
 * @param {string} filePath - Path to the JSON file
 * @returns {Array<string>} Route array or empty array if file doesn't exist
 */
function safeRequireRoutes(filePath) {
  const fullPath = path.join(__dirname, "..", filePath);
  try {
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents);
    } else {
      console.warn(`⚠️  Warning: ${filePath} not found, using empty array`);
      return [];
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Error reading ${filePath}, using empty array:`, error.message);
    return [];
  }
}

/**
 * Route definitions for static pages.
 * Contains routing information for all static content pages.
 * Array of page route paths.
 *
 * @type {Array<string>}
 */
const pageRoutes = safeRequireRoutes("public/routesPages.json");

/**
 * Route definitions for news articles.
 * Contains routing information for all news content.
 *
 * Array of news route paths.
 *
 * @type {Array<string>}
 */
const newsRoutes = safeRequireRoutes("public/routesNews.json");

/**
 * Route definitions for FAQ pages.
 * Contains routing information for all FAQ content.
 *
 * Array of FAQ route paths.
 *
 * @type {Array<string>}
 */
const faqRoutes = safeRequireRoutes("public/routesFaqs.json");

/**
 * Route definitions for resource pages.
 * Contains routing information for all resource content.
 *
 * Array of resource route paths.
 *
 * @type {Array<string>}
 */
const resourceRoutes = safeRequireRoutes("public/routesResources.json");

/**
 * Route definitions for manually created pages.
 * Contains routing information for all manual content.
 *
 * Array of manual route paths.
 *
 * @type {Array<string>}
 */
const myManualRoutes = safeRequireRoutes("public/routesManual.json");

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
try {
  jsonfile.writeFileSync(`public/appRoutes.json`, appRoutes, { spaces: 2 });
  console.log(`✓ Created public/appRoutes.json with ${appRoutes.length} routes`);
} catch (err) {
  console.error("❌ Failed to write public/appRoutes.json:", err);
  process.exit(1);
}

/**
 * Write the consolidated routes to the assets directory.
 * This provides a backup copy and allows for build-time access.
 *
 * @throws {Error} If file write operation fails
 */
try {
  // Ensure assets/json directory exists
  const assetsDir = path.join(__dirname, "..", "assets", "json");
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  jsonfile.writeFileSync(`assets/json/appRoutes.json`, appRoutes, { spaces: 2 });
  console.log(`✓ Created assets/json/appRoutes.json with ${appRoutes.length} routes`);
} catch (err) {
  console.error("❌ Failed to write assets/json/appRoutes.json:", err);
  process.exit(1);
}
