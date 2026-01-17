/**
 * @fileoverview FAQ content generator script for the ICJIA R3 Nuxt 3 application.
 * This script fetches frequently asked questions from the Strapi CMS GraphQL API
 * and converts them to markdown files for use with Nuxt Content.
 *
 * The script performs the following operations:
 * 1. Fetches all published FAQs from the CMS via GraphQL
 * 2. Processes FAQ data including attachments and styling
 * 3. Generates markdown files in the content/faqs directory
 * 4. Creates faqs.json and routesFaqs.json files for application use
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

const styleInject = `
<style>
 h3 ~ *:not(h3) {
  margin-left: 8px;
}

  }
</style>
`;

const query = `query {
   weeklyFaqs {
    data {
      attributes {
        title
        slug
        week
        summary
        body
        dateOverride
        createdAt
        updatedAt
        attachmentHeading
        attachment {
          data {
            id
            attributes {
              name
              hash
              ext
              url
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

  // Fetch FAQs from API with retry logic
  const res = await withRetry(async () => {
    const response = await axiosInstance.post("/graphql", {
      query,
      validateStatus: (status) => status === 200,
    });
    return response;
  });

  // Validate response structure
  const raw = validateApiResponse(res, "data.weeklyFaqs.data");

  if (!raw || raw.length === 0) {
    console.warn("Warning: No FAQs found in API response");
    return;
  }
  const _faqs = raw.map((item) => {
    const obj = { ...item };
    let rawText;

    obj.attributes.postDate = item.attributes.dateOverride
      ? moment(item.attributes.dateOverride).utc().format()
      : moment(item.attributes.publishedAt).utc().format();
    rawText = obj.attributes?.body
      ?.replace(/<[^>]*>?/gm, "")
      .replace(/[^a-z0-9]/gi, " ");
    rawText = rawText.replace(/\s\s+/g, " ");
    obj.attributes.rawText = rawText.toLowerCase();
    obj.attributes.draft = false;
    // obj.attributes.title = obj.attributes.question;
    // obj.attributes.summary = obj.attributes.question;
    // obj.attributes.body = obj.attributes.answer;
    obj.attributes.path = `/faqs/${item.attributes.slug}`;
    obj.attributes.url = `${SITE_URL}${obj.attributes.path}`;
    obj.attributes.markdown = styleInject + item.attributes.body;
    obj.attributes.type = "faq";
    if (item.attributes.searchMeta) {
      obj.attributes.searchMeta = "faq " + item.attributes.searchMeta;
    } else {
      obj.attributes.searchMeta = "faq  ";
    }

    obj.attributes.postDate = item.attributes.dateOverride
      ? moment(item.attributes.dateOverride).utc().format()
      : moment(item.attributes.publishedAt).utc().format();
    console.log("Markdown faq created: ", obj.attributes.path);

    return obj;
  });

  //  let faqs = _.orderBy(_faqs, ["ranking"], ["asc"]);
  // let faqs = _faqs;
  let faqs = _.orderBy(_faqs, ["postDate"], ["desc"]);

  // let categories = _.uniq(faqs.map((item) => item.attributes.category));
  // console.log("categories: ", categories);
  // console.log('faqs: ', faqs);

  // Write FAQ files with error handling
  await safeWriteFile(`./assets/json/faqs.json`, faqs, jsonfile);
  await safeWriteFile(`./public/faqs.json`, faqs, jsonfile);
  await safeWriteFile(`./src/faqs.json`, faqs, jsonfile);

  const faqRoutes = faqs.map((item) => {
    return `/faqs/${item.attributes.slug}`;
  });

  await safeWriteFile(`./public/routesFaqs.json`, faqRoutes, jsonfile);

  // Generate markdown files
  const section = "faqs";
  const directoryPath = path.join(contentDir, section);
  ensureDirectory(directoryPath, fs);

  for (const item of faqs) {
    const basename = item.attributes.slug;
    const fileName = `${section}/${basename}.md`;
    const filePath = path.join(contentDir, fileName);

    const content = formatMarkdown(item.attributes);
    safeWriteFileSync(filePath, content, fs);
  }

  console.log(`\n✓ Processed ${faqs.length} FAQs`);
}

// Run the script with error handling wrapper
runScript(main, "createMarkdownFaqs");
