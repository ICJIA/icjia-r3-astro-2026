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
