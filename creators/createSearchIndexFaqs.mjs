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

const require = createRequire(import.meta.url);
import { createRequire } from "module";
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const jsonfile = require("jsonfile");
const faqs = require("../assets/json/faqs.json");

import md from "markdown-it";
import attrs from "markdown-it-attrs";
const renderer = new md({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
}).use(attrs);

function formatMarkdown(content) {
  const { body } = content;
  delete content.body;
  return `---\n${yaml.stringify(content)}---\n\n${body}\n`;
}
// const posts = require("../public/posts.json");

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

jsonfile.writeFileSync(
  `./assets/json/searchIndexFaqs.json`,
  searchIndex,
  function (err) {
    if (err) {
      console.error(err);
    }
  }
);
jsonfile.writeFileSync(`public/siteMetaFaqs.json`, siteMeta, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("searchIndexFaqs.json created in /assets/json/");
console.log("siteMetaFaqs.json created in ../public/siteMetaFaqs.json");
