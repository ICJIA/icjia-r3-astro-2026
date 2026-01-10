/**
 * @fileoverview Search index generator script for the ICJIA R3 Nuxt 3 application.
 * This script creates a searchable index from all content types and generates site metadata
 * for navigation and SEO purposes.
 *
 * The script processes content from pages, posts, FAQs, resources, and manual pages,
 * creating two output files:
 * 1. searchIndex.json - Contains searchable content (excludes items marked hideFromSearch)
 * 2. siteMeta.json - Contains all site metadata for navigation and sitemap generation
 *
 * @requires module:module - For createRequire functionality in ES modules
 * @requires module:dotenv - For environment variable management
 * @requires module:uuid - For generating unique identifiers
 * @requires module:jsonfile - For JSON file operations
 *
 * @since 1.0.0
 */

import { createRequire } from "module";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const jsonfile = require("jsonfile");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Safely require a JSON file, returning empty array if file doesn't exist
 * @param {string} filePath - Path to the JSON file relative to project root
 * @returns {Array<Object>} Content array or empty array if file doesn't exist
 */
function safeRequireJson(filePath) {
  const fullPath = join(__dirname, "..", filePath);
  try {
    if (existsSync(fullPath)) {
      // Use the fullPath for requiring to ensure consistency
      const data = require(fullPath);
      return data;
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
 * Content data from static pages.
 * Contains page content with attributes and metadata.
 *
 * @type {Array<Object>} Array of page objects with id and attributes
 */
const pages = safeRequireJson("public/pages.json");

/**
 * Content data from news posts.
 * Contains news article content with attributes and metadata.
 *
 * @type {Array<Object>} Array of post objects with id and attributes
 */
const posts = safeRequireJson("public/posts.json");

/**
 * Content data from FAQ pages.
 * Contains frequently asked questions with attributes and metadata.
 *
 * @type {Array<Object>} Array of FAQ objects with id and attributes
 */
const faqs = safeRequireJson("public/faqs.json");

/**
 * Content data from resource pages.
 * Contains resource content with attributes and metadata.
 *
 * @type {Array<Object>} Array of resource objects with id and attributes
 */
const resources = safeRequireJson("public/resources.json");

/**
 * Content data from manually created pages.
 * Contains manual page content with attributes and metadata.
 *
 * @type {Array<Object>} Array of manual page objects with id and attributes
 */
const manualPages = safeRequireJson("public/manual.json");

/**
 * Combined site content from all content types.
 * Merges all content arrays into a single collection for processing.
 *
 * @type {Array<Object>} Combined array of all content objects
 */
const site = [...pages, ...posts, ...resources, ...faqs, ...manualPages];

/**
 * Search index containing only searchable content.
 * Filters out items marked with hideFromSearch and adds unique identifiers.
 * Each item includes all attributes plus id and idUnique fields.
 *
 * @type {Array<Object>} Array of searchable content objects
 * @property {string} id - Original content ID
 * @property {string} idUnique - Unique UUID for this search index entry
 * @property {...Object} attributes - All original content attributes
 */
const searchIndex = site.map((item) => {
  // console.log(item.attributes);
  if (!item.attributes.hideFromSearch) {
    const obj = { ...item.attributes };
    obj.id = item.id;
    obj.idUnique = uuidv4();
    return obj;
  } else {
    return {};
  }
});

/**
 * Site metadata containing all content for navigation and sitemap generation.
 * Includes all content regardless of search visibility settings.
 * Each item includes all attributes plus id and idUnique fields.
 *
 * @type {Array<Object>} Array of all content metadata objects
 * @property {string} id - Original content ID
 * @property {string} idUnique - Unique UUID for this metadata entry
 * @property {...Object} attributes - All original content attributes
 */
const siteMeta = site.map((item) => {
  // console.log(item.attributes);
  const obj = { ...item.attributes };
  obj.id = item.id;
  obj.idUnique = uuidv4();
  return obj;
});

/**
 * Write the search index to the assets directory.
 * This file is used by the search functionality to provide fast content lookup.
 *
 * @throws {Error} If file write operation fails
 */
jsonfile.writeFileSync(
  `./assets/json/searchIndex.json`,
  searchIndex,
  function (err) {
    if (err) {
      console.error(err);
    }
  }
);

/**
 * Write the site metadata to the public directory.
 * This file is used for navigation, sitemap generation, and SEO purposes.
 *
 * @throws {Error} If file write operation fails
 */
jsonfile.writeFileSync(`public/siteMeta.json`, siteMeta, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("searchIndex.json created in /assets/json/");
console.log("siteMeta.json created in ../public/siteMeta.json");
