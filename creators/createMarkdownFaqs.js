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

const SITE_URL = process.env.NUXT_PUBLIC_BASE_URL;
const API = process.env.NUXT_PUBLIC_API_BASE_URL;

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
    const raw = res.data.data.weeklyFaqs.data;
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

    jsonfile.writeFileSync(`./assets/json/faqs.json`, faqs, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("faqs.json created in /assets/");
    });

    jsonfile.writeFileSync(`./public/faqs.json`, faqs, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("faqs.json created in /public/");
    });

    jsonfile.writeFileSync(`./src/faqs.json`, faqs, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("faqs.json created in /src/");
    });

    const faqRoutes = faqs.map((item) => {
      return `/faqs/${item.attributes.slug}`;
    });

    jsonfile.writeFileSync(
      `./public/routesFaqs.json`,
      faqRoutes,
      function (err) {
        if (err) {
          console.error(err);
        }
      }
    );

    console.log("Total FAQs: ", faqs.length);
    let section;
    faqs.forEach((item) => {
      section = "faqs";

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
