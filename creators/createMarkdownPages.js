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

const contentDir = path.join(__dirname, "../content");

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

axios
  .create({ baseURL: API })
  .post("/graphql", {
    query,
    validateStatus: (status) => status === 200,
    headers: {
      "Accept-Encoding": "application/json",
    },
  })
  .then((res) => {
    const pages = res.data.data.pages.data;

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

    jsonfile.writeFileSync(
      `./public/routesPages.json`,
      pageRoutes,
      function (err) {
        if (err) {
          console.error(err);
        }
      }
    );

    jsonfile.writeFileSync(`./public/pages.json`, site, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("pages.json created in /public/");
    });

    site.forEach((page) => {
      if (page.attributes.section === "root") {
        section = "";
      } else {
        section = page.attributes.section.toLowerCase();
      }

      const basename = page.attributes.slug;
      const filePath = path.join(contentDir, `${section}/${basename}.md`);
      const directoryPath = path.join(contentDir, `${section}`);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      const content = formatMarkdown(page.attributes);
      fs.writeFileSync(filePath, content);
    });
  });
