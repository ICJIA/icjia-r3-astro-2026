/**
 * @fileoverview Content directory initialization script for the ICJIA R3 Nuxt 3 application.
 * This script prepares the content directory and cleans up generated files for a fresh build.
 *
 * The script performs two main operations:
 * 1. Empties the content directory to remove any existing generated content
 * 2. Removes specified generated files from public, assets, and src directories
 *
 * This is typically run at the beginning of the build process to ensure a clean state.
 *
 * @requires module:fs - For file system operations
 * @requires module:path - For path manipulation
 * @requires module:fs-extra - For enhanced file system operations
 *
 * @since 1.0.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fsExtra from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Path to the content directory that will be cleared.
 * This directory contains generated markdown content files.
 *
 * @type {string}
 */
const contentDir = path.join(__dirname, "../content");

/**
 * Clear the content directory of all existing files and subdirectories.
 * This ensures a clean slate for content generation.
 */
fsExtra.emptyDirSync(contentDir);
console.log("Content directory cleared");

/**
 * Path to the public directory containing static assets and generated files.
 *
 * @type {string}
 */
const publicDir = path.join(__dirname, "../public");

/**
 * Path to the assets/json directory containing JSON data files.
 *
 * @type {string}
 */
const assetsDir = path.join(__dirname, "../assets/json");

/**
 * Path to the src directory containing source data files.
 *
 * @type {string}
 */
const srcDir = path.join(__dirname, "../src");

/**
 * List of generated files that should be removed during cleanup.
 * These files are regenerated during the build process and should not persist
 * between builds to avoid stale data.
 *
 * Array of filenames to remove.
 *
 * @type {Array<string>}
 *
 * @example
 * ```javascript
 * // Files include:
 * // - Site metadata and routing files
 * // - Content JSON files (pages, posts, FAQs, resources)
 * // - Search index and sitemap files
 * ```
 */
const PUBLIC_FILES_TO_REMOVE = [
  "site.json",
  "sitemap.xml",
  "sitemeta.json",
  "routesPages.json",
  "routesFaqs.json",
  "routesPosts.json",
  "routesResources.json",
  "routesMeetings.json",
  "routesPublications.json",
  "pages.json",
  "posts.json",
  "faqs.json",
  "resources.json",
  "biographies.json",
  "appRoutes.json",
  "searchIndex.json",
];

/**
 * Remove specified files from public, assets, and src directories.
 * Uses force: true to avoid errors if files don't exist.
 * This cleanup ensures no stale generated files remain from previous builds.
 */
PUBLIC_FILES_TO_REMOVE.forEach((fileName) => {
  fs.rmSync(`${publicDir}/${fileName}`, { force: true });
  fs.rmSync(`${assetsDir}/${fileName}`, { force: true });
  fs.rmSync(`${srcDir}/${fileName}`, { force: true });
});

// console.log("Files removed in /public/: ", PUBLIC_FILES_TO_REMOVE);
