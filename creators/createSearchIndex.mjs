const require = createRequire(import.meta.url);
import { createRequire } from "module";
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const jsonfile = require("jsonfile");
const pages = require("../public/pages.json");
const posts = require("../public/posts.json");
const faqs = require("../public/faqs.json");
const resources = require("../public/resources.json");
const manualPages = require("../public/manual.json");

const site = [...pages, ...posts, ...resources, ...faqs, ...manualPages];

const searchIndex = site.map((item) => {
  // console.log(item.attributes);
  if (!item.attributes.hideFromSearch) {
    const obj = { ...item.attributes };
    obj.id = item.id;
    obj.idUnique = uuidv4();
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
  return obj;
});

jsonfile.writeFileSync(
  `./assets/json/searchIndex.json`,
  searchIndex,
  function (err) {
    if (err) {
      console.error(err);
    }
  }
);
jsonfile.writeFileSync(`public/siteMeta.json`, siteMeta, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("searchIndex.json created in /assets/json/");
console.log("siteMeta.json created in ../public/siteMeta.json");
