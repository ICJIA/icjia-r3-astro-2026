/**
 * @fileoverview FAQ search index generator script for the ICJIA R3 Nuxt 3 application.
 * This script creates a searchable index specifically for FAQ content, converting
 * markdown to HTML and generating search metadata.
 *
 * The script performs the following operations:
 * 1. Reads FAQ data from assets/json/faqs.json
 * 2. Converts markdown content to HTML using markdown-it
 * 3. Generates searchIndexFaqs.json with searchable content
 * 4. Generates siteMetaFaqs.json with all FAQ metadata
 *
 * @requires module:module - For createRequire functionality in ES modules
 * @requires module:dotenv - For environment variable management
 * @requires module:uuid - For generating unique identifiers
 * @requires module:jsonfile - For JSON file operations
 * @requires module:markdown-it - For markdown to HTML conversion
 * @requires module:markdown-it-attrs - For markdown attribute support
 * @requires module:yaml - For YAML parsing
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

const faqs = safeRequireJson("assets/json/faqs.json");

import md from "markdown-it";
import attrs from "markdown-it-attrs";
const renderer = new md({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: """''",
}).use(attrs);

const site = [...faqs];

const searchIndex = site.map((item) => {
  // console.log(item.attributes);
  if (!item.attributes.hideFromSearch) {
    const obj = { ...item.attributes };
    obj.id = item.id;
    obj.idUnique = uuidv4();
    obj.html = renderer.render(item.attributes.markdown);
    return obj;
  } else {
    return {};
  }
});

const siteMeta = site.map((item) => {
  // console.log(item.attributes);
  const obj = { ...item.attributes };
  obj.id = item.id;
  obj.idUnique = uuidv4();
  obj.html = renderer.render(item.attributes.markdown);
  return obj;
});

try {
  jsonfile.writeFileSync(`./assets/json/searchIndexFaqs.json`, searchIndex, { spaces: 2 });
  console.log("✓ searchIndexFaqs.json created in /assets/json/");
} catch (err) {
  console.error("❌ Failed to write searchIndexFaqs.json:", err);
  process.exit(1);
}

try {
  jsonfile.writeFileSync(`public/siteMetaFaqs.json`, siteMeta, { spaces: 2 });
  console.log("✓ siteMetaFaqs.json created in /public/");
} catch (err) {
  console.error("❌ Failed to write siteMetaFaqs.json:", err);
  process.exit(1);
}
