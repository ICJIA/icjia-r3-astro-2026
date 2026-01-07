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
 * @requires module:dotenv - For environment variable management
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

/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const jsonfile = require("jsonfile");
const _ = require("lodash");
const moment = require("moment");
const yaml = require("yaml");

const contentDir = path.join(__dirname, "../content");
// fsExtra.emptyDirSync(contentDir);
// console.log("Content directory cleared");

const SITE_URL = process.env.NUXT_PUBLIC_BASE_URL;
const API = process.env.NUXT_PUBLIC_API_BASE_URL;

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
    const posts = res.data.data.posts.data;

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

    jsonfile.writeFileSync(`./public/posts.json`, site, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("posts.json created in /public/");
    });

    const newsRoutes = site.map((post) => {
      return `/news/${post.attributes.slug}`;
    });

    jsonfile.writeFileSync(
      `./public/routesNews.json`,
      newsRoutes,
      function (err) {
        if (err) {
          console.error(err);
        }
      }
    );

    site.forEach((post) => {
      if (post.attributes.section === "root") {
        section = "";
      } else {
        section = post.attributes.section.toLowerCase();
      }

      const basename = post.attributes.slug;
      const filePath = path.join(contentDir, `${section}/${basename}.md`);
      const directoryPath = path.join(contentDir, `${section}`);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      const content = formatMarkdown(post.attributes);
      // console.log(content);
      fs.writeFileSync(filePath, content);
    });
  });
