/**
 * @fileoverview News content generator script for the ICJIA R3 Nuxt 3 application.
 * This script fetches news posts from the Strapi CMS GraphQL API and converts them
 * to markdown files for use with Nuxt Content.
 *
 * The script performs the following operations:
 * 1. Fetches all published posts from the CMS via GraphQL
 * 2. Processes and transforms post data (dates, paths, URLs, raw text extraction)
 * 3. Generates markdown files in the content/news directory
 * 4. Creates posts.json and routesNews.json files for application use
 *
 * @requires module:fs - For file system operations
 * @requires module:path - For path manipulation
 * @requires module:axios - For HTTP requests to the GraphQL API
 * @requires module:jsonfile - For JSON file operations
 * @requires module:lodash - For data manipulation utilities
 * @requires module:moment - For date formatting and manipulation
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
import moment from "moment";
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

const query = `query {
    posts {
      data {
        id
        attributes {
          title
          slug
          hideFromSearch
          dateOverride
          hideFromSitemap
          summary
          body
          showTableOfContents
          section
          createdAt
          updatedAt
          publishedAt
          searchMeta
          
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

  // Fetch posts from API with retry logic
  const res = await withRetry(async () => {
    const response = await axiosInstance.post("/graphql", {
      query,
      validateStatus: (status) => status === 200,
    });
    return response;
  });

  // Validate response structure
  const posts = validateApiResponse(res, "data.posts.data");

  if (!posts || posts.length === 0) {
    console.warn("Warning: No posts found in API response");
    return;
  }

    let section;
    const site = posts.map((post) => {
      const obj = { ...post };
      let rawText;

      rawText = obj.attributes?.body
        ?.replace(/<[^>]*>?/gm, "")
        .replace(/[^a-z0-9]/gi, " ");
      rawText = rawText.replace(/\s\s+/g, " ");
      obj.attributes.rawText = rawText.toLowerCase();
      obj.attributes.draft = false;
      obj.attributes.type = "news";
      // obj.attributes.description = post.attributes.summary;
      obj.attributes.navigation = true;
      if (post.attributes.section !== "root") {
        section = post.attributes.section.toLowerCase();
        obj.attributes.path = `/${section}/${post.attributes.slug}`;
        obj.attributes.url = `${SITE_URL}${obj.attributes.path}`;
      } else {
        obj.attributes.path = `/${post.attributes.slug}`;
        obj.attributes.url = `${SITE_URL}${obj.attributes.path}`;
      }

      if (post.attributes.slug === "index") {
        obj.attributes.path = `/`;
        obj.attributes.url = `${SITE_URL}`;
      }

      obj.attributes.postDate = post.attributes.dateOverride
        ? moment(post.attributes.dateOverride).utc().format()
        : moment(post.attributes.publishedAt).utc().format();

      console.log("Markdown posts content created: ", obj.attributes.path);
      return obj;
    });

    // Write route files with error handling
    await safeWriteFile(`./public/posts.json`, site, jsonfile);
    
    const newsRoutes = site.map((post) => {
      return `/news/${post.attributes.slug}`;
    });

    await safeWriteFile(`./public/routesNews.json`, newsRoutes, jsonfile);

    // Generate markdown files
    for (const post of site) {
      if (post.attributes.section === "root") {
        section = "";
      } else {
        section = post.attributes.section.toLowerCase();
      }

      const basename = post.attributes.slug;
      const filePath = path.join(contentDir, `${section}/${basename}.md`);
      const directoryPath = path.join(contentDir, `${section}`);

      ensureDirectory(directoryPath, fs);

      const content = formatMarkdown(post.attributes);
      safeWriteFileSync(filePath, content, fs);
    }

    console.log(`\n✓ Processed ${posts.length} news posts`);
}

// Run the script with error handling wrapper
runScript(main, "createMarkdownNews");
