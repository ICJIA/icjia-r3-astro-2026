/**
 * @fileoverview Sitemap generator script for the ICJIA R3 Nuxt 3 application.
 * This script generates an XML sitemap from site metadata for SEO purposes.
 *
 * The script reads site metadata from siteMeta.json and creates a sitemap.xml file
 * in the public directory with proper URLs, change frequencies, and priorities.
 *
 * @requires module:module - For createRequire functionality in ES modules
 * @requires module:fs - For file system operations
 * @requires module:sitemap - For XML sitemap generation
 * @requires module:dotenv - For environment variable management
 *
 * @since 1.0.0
 */

import { createRequire } from "module";
import { createWriteStream } from "fs";
import { SitemapStream } from "sitemap";

import * as dotenv from "dotenv";
dotenv.config();

/**
 * CommonJS require function for ES modules compatibility.
 * Allows importing JSON files in ES module context.
 *
 * @type {Function}
 */
const require = createRequire(import.meta.url);

/**
 * Site metadata containing all pages and their properties.
 * Used to generate sitemap entries with proper URLs and settings.
 *
 * @type {Array<Object>} Array of page metadata objects
 * @property {string} path - The page path/route
 * @property {boolean} hideFromSitemap - Whether to exclude from sitemap
 */
const siteIndex = require("../public/siteMeta.json");

/**
 * Sitemap stream instance for generating XML sitemap.
 * Configured with the base hostname from environment variables.
 *
 * @type {SitemapStream}
 */
const sitemap = new SitemapStream({
  hostname: `${process.env.NUXT_PUBLIC_BASE_URL}`,
});

/**
 * Write stream for outputting the sitemap XML file.
 * Creates the sitemap.xml file in the public directory.
 *
 * @type {WriteStream}
 */
const writeStream = createWriteStream("public/sitemap.xml");

// Pipe the sitemap stream to the file write stream
sitemap.pipe(writeStream);

/**
 * Process each page in the site index and add to sitemap.
 * Only includes pages that are not marked to be hidden from sitemap.
 * Each URL is configured with weekly change frequency and 0.3 priority.
 */
siteIndex.forEach((item) => {
  if (item && !item.hideFromSitemap) {
    const url = `${process.env.NUXT_PUBLIC_BASE_URL}${item.path}`;
    sitemap.write({ url, changefreq: "weekly", priority: 0.3 });
  }
});

// Finalize the sitemap generation
sitemap.end();

console.log("Created: ../public/sitemap.xml");
