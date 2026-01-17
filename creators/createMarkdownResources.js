/**
 * @fileoverview Resources content generator script for the ICJIA R3 Nuxt 3 application.
 * This script fetches resource pages from the Strapi CMS GraphQL API and converts them
 * to markdown files for use with Nuxt Content.
 *
 * The script performs the following operations:
 * 1. Fetches all published resources from the CMS via GraphQL
 * 2. Processes resource data including cover images and file attachments
 * 3. Generates markdown files in the content/resources directory
 * 4. Creates resources.json and routesResources.json files for application use
 *
 * @requires module:fs - For file system operations
 * @requires module:path - For path manipulation
 * @requires module:axios - For HTTP requests to the GraphQL API
 * @requires module:jsonfile - For JSON file operations
 * @requires module:lodash - For data manipulation utilities
 * @requires module:yaml - For YAML frontmatter generation
 *
 * @since 1.0.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";
import jsonfile from "jsonfile";
import _ from "lodash";
import yaml from "yaml";
import {
  validateEnvironment,
  withRetry,
  safeWriteFile,
  safeWriteFileSync,
  ensureDirectory,
  validateApiResponse,
  runScript,
} from "./utils/errorHandler.js";
import { config } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contentDir = path.join(__dirname, "../content");

const SITE_URL = config.site.url;
const API = config.api.base;

function formatMarkdown(content) {
  const { body } = content;
  delete content.body;
  return `---\n${yaml.stringify(content)}---\n\n${body}\n`;
}

const query = `query {
    resources {
    data {
      id
      attributes {
        title
        createdAt
        updatedAt
        publishedAt
        showTableOfContents
        hideFromSearch
        hideFromSitemap
        slug
        summary
        body
        searchMeta
        ranking
        cover {
          data {
            attributes {
            	url
              formats
              name
              alternativeText
              caption
              width
              height
              ext
              size
              createdAt
              updatedAt
            }
          }
        }
      }
    }
   
  }
  }`;

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

  // Fetch resources from API with retry logic
  const res = await withRetry(async () => {
    const response = await axiosInstance.post("/graphql", {
      query,
      validateStatus: (status) => status === 200,
    });
    return response;
  });

  // Validate response structure
  const raw = validateApiResponse(res, "data.resources.data");

  if (!raw || raw.length === 0) {
    console.warn("Warning: No resources found in API response");
    return;
  }
  const _resources = raw.map((item) => {
    const obj = { ...item };
    let rawText;

    //   obj.attributes.postDate = item.attributes.dateOverride
    //     ? moment(item.attributes.dateOverride).utc().format()
    //     : moment(item.attributes.publishedAt).utc().format();
    rawText = obj.attributes?.body
      ?.replace(/<[^>]*>?/gm, "")
      .replace(/[^a-z0-9]/gi, " ");
    rawText = rawText.replace(/\s\s+/g, " ");
    obj.attributes.rawText = rawText.toLowerCase();
    obj.attributes.draft = false;

    obj.attributes.path = `/resources/${item.attributes.slug}`;
    obj.attributes.url = `${SITE_URL}${obj.attributes.path}`;
    obj.attributes.markdown = item.attributes.body;
    obj.attributes.type = "resource";
    if (item.attributes.searchMeta) {
      obj.attributes.searchMeta = "resource " + item.attributes.searchMeta;
    } else {
      obj.attributes.searchMeta = "resource  ";
    }

    return obj;
  });

  let resources = _.orderBy(_resources, ["publishedAt"], ["desc"]);

  // Write resource files with error handling
  await safeWriteFile(`./assets/json/resources.json`, resources, jsonfile);
  await safeWriteFile(`./public/resources.json`, resources, jsonfile);
  await safeWriteFile(`./src/resources.json`, resources, jsonfile);

  const resourceRoutes = resources.map((item) => {
    return `/resources/${item.attributes.slug}`;
  });

  await safeWriteFile(
    `./public/routesResources.json`,
    resourceRoutes,
    jsonfile,
  );

  // Generate markdown files
  const section = "resources";
  const directoryPath = path.join(contentDir, section);
  ensureDirectory(directoryPath, fs);

  for (const item of resources) {
    const basename = item.attributes.slug;
    const fileName = `${section}/${basename}.md`;
    const filePath = path.join(contentDir, fileName);

    const content = formatMarkdown(item.attributes);
    safeWriteFileSync(filePath, content, fs);
  }

  console.log(`\n✓ Processed ${resources.length} resources`);
}

// Run the script with error handling wrapper
runScript(main, "createMarkdownResources");
