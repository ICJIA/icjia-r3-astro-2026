/**
 * @fileoverview Pages content generator script for the ICJIA R3 Nuxt 3 application.
 * This script fetches static pages from the Strapi CMS GraphQL API and converts them
 * to markdown files for use with Nuxt Content.
 *
 * The script performs the following operations:
 * 1. Fetches all published pages from the CMS via GraphQL
 * 2. Processes and transforms page data (paths, URLs, raw text extraction)
 * 3. Generates markdown files in the content directory
 * 4. Creates pages.json and routesPages.json files for application use
 *
 * @requires module:dotenv - For environment variable management
 * @requires module:fs - For file system operations
 * @requires module:path - For path manipulation
 * @requires module:axios - For HTTP requests to the GraphQL API
 * @requires module:jsonfile - For JSON file operations
 * @requires module:lodash - For data manipulation utilities
 * @requires module:yaml - For YAML frontmatter generation
 *
 * @since 1.0.0
 */

/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const jsonfile = require("jsonfile");
const _ = require("lodash");
const yaml = require("yaml");
const {
  validateEnvironment,
  withRetry,
  safeWriteFile,
  safeWriteFileSync,
  ensureDirectory,
  validateApiResponse,
  runScript,
} = require("./utils/errorHandler");

const contentDir = path.join(__dirname, "../content");

// Validate required environment variables
validateEnvironment(["NUXT_PUBLIC_BASE_URL", "NUXT_PUBLIC_API_BASE_URL"]);

const SITE_URL = process.env.NUXT_PUBLIC_BASE_URL;
const API = process.env.NUXT_PUBLIC_API_BASE_URL;

const query = `query {
    pages {
      data {
        id
        attributes {
          title
          slug
          hideFromSearch
          hideFromSitemap
          showTableOfContents
          summary
          body
          section
          createdAt
          updatedAt
          publishedAt
          searchMeta
          isFullPage
          
        }
      }
    }
  }`;

function formatMarkdown(content) {
  const { body } = content;
  delete content.body;
  return `---\n${yaml.stringify(content)}---\n\n${body}\n`;
}

/**
 * Main script execution function
 */
async function main() {
  const axiosInstance = axios.create({
    baseURL: API,
    timeout: 30000, // 30 second timeout
    headers: {
      "Accept-Encoding": "application/json",
    },
  });

  // Fetch pages from API with retry logic
  const res = await withRetry(async () => {
    const response = await axiosInstance.post("/graphql", {
      query,
      validateStatus: (status) => status === 200,
    });
    return response;
  });

  // Validate response structure
  const pages = validateApiResponse(res, "data.pages.data");

  if (!pages || pages.length === 0) {
    console.warn("Warning: No pages found in API response");
    return;
  }

  let section;
  const site = pages.map((page) => {
    const obj = { ...page };
    let rawText;

    rawText = obj.attributes?.body
      ?.replace(/<[^>]*>?/gm, "")
      .replace(/[^a-z0-9]/gi, " ");
    rawText = rawText.replace(/\s\s+/g, " ");
    obj.attributes.rawText = rawText.toLowerCase();
    obj.attributes.draft = false;
    obj.attributes.type = "page";

    obj.attributes.navigation = true;
    if (page.attributes.section !== "root") {
      section = page.attributes.section.toLowerCase();
      obj.attributes.path = `/${section}/${page.attributes.slug}`;
      obj.attributes.url = `${SITE_URL}${obj.attributes.path}`;
    } else {
      obj.attributes.path = `/${page.attributes.slug}`;
      obj.attributes.url = `${SITE_URL}${obj.attributes.path}`;
    }

    if (page.attributes.slug === "index") {
      obj.attributes.path = `/`;
      obj.attributes.url = `${SITE_URL}`;
    }

    console.log("Markdown content created: ", obj.attributes.path);
    return obj;
  });

  const pageRoutes = site.map((item) => {
    if (item.attributes.slug !== "index") {
      return `/${item.attributes.slug}`;
    } else {
      return `/`;
    }
  });

  // Write route files with error handling
  await safeWriteFile(`./public/routesPages.json`, pageRoutes, jsonfile);
  await safeWriteFile(`./public/pages.json`, site, jsonfile);

  // Generate markdown files
  for (const page of site) {
    if (page.attributes.section === "root") {
      section = "";
    } else {
      section = page.attributes.section.toLowerCase();
    }

    const basename = page.attributes.slug;
    const filePath = path.join(contentDir, `${section}/${basename}.md`);
    const directoryPath = path.join(contentDir, `${section}`);

    ensureDirectory(directoryPath, fs);

    const content = formatMarkdown(page.attributes);
    safeWriteFileSync(filePath, content, fs);
  }

  console.log(`\n✓ Processed ${pages.length} pages`);
}

// Run the script with error handling wrapper
runScript(main, "createMarkdownPages");
