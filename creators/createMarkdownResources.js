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

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const jsonfile = require("jsonfile");
const _ = require("lodash");
const yaml = require("yaml");
const contentDir = path.join(__dirname, "../content");
require("dotenv").config();
// const moment = require("moment");
// const SITE_URL = process.env.NUXT_PUBLIC_BASE_URL;
// const API = process.env.NUXT_PUBLIC_API_BASE_URL;

const SITE_URL = process.env.NUXT_PUBLIC_BASE_URL;
const API = process.env.NUXT_PUBLIC_API_BASE_URL;

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

axios;
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
    const raw = res.data.data.resources.data;
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
    jsonfile.writeFileSync(
      `./assets/json/resources.json`,
      resources,
      function (err) {
        if (err) {
          console.error(err);
        }
        console.log("resources.json created in /assets/");
      }
    );

    jsonfile.writeFileSync(
      `./public/resources.json`,
      resources,
      function (err) {
        if (err) {
          console.error(err);
        }
        console.log("resources.json created in /public/");
      }
    );

    jsonfile.writeFileSync(`./src/resources.json`, resources, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("resources.json created in /src/");
    });

    const resourceRoutes = resources.map((item) => {
      return `/resources/${item.attributes.slug}`;
    });

    jsonfile.writeFileSync(
      `./public/routesResources.json`,
      resourceRoutes,
      function (err) {
        if (err) {
          console.error(err);
        }
      }
    );

    console.log("Total resources: ", resources.length);
    let section;
    resources.forEach((item) => {
      section = "resources";

      const basename = item.attributes.slug;
      const fileName = `${section}/${basename}.md`;
      const filePath = path.join(contentDir, fileName);
      const directoryPath = path.join(contentDir, `${section}`);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      const content = formatMarkdown(item.attributes);
      // console.log(content);
      fs.writeFileSync(filePath, content);
    });
  });
