/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const moment = require("moment");
const jsonfile = require("jsonfile");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
// const yaml = require("yaml");
// const contentDir = path.join(__dirname, "../content");
const SITE_URL = process.env.NUXT_PUBLIC_BASE_URL;
// const API = process.env.NUXT_PUBLIC_API_BASE_URL;

const manualPages = [
  {
    id: uuidv4(),
    attributes: {
      id: uuidv4(),
      postDate: moment().format(),
      title: "Search R3",
      slug: "search",
      dateOverride: "",
      hideFromSearch: false,
      hideFromSitemap: false,
      showTableOfContents: false,
      summary: "Search R3",
      body: "",
      createdAt: moment().format(),
      updatedAt: moment().format(),
      publishedAt: moment().format(),
      searchMeta: "search seo google bing ",
      path: "/search",
      url: `${SITE_URL}/search`,
      type: "page",
    },
  },
  {
    id: uuidv4(),
    attributes: {
      id: uuidv4(),
      postDate: moment().format(),
      title: "Translate",
      slug: "translate",
      dateOverride: "",
      hideFromSearch: false,
      hideFromSitemap: false,
      showTableOfContents: false,
      summary: "Translate R3",
      body: "",
      createdAt: moment().format(),
      updatedAt: moment().format(),
      publishedAt: moment().format(),
      searchMeta: "translate google spanish polish tagalog italian ",
      path: "/translate",
      url: `${SITE_URL}/translate`,
      type: "page",
    },
  },
  {
    id: uuidv4(),
    attributes: {
      id: uuidv4(),
      postDate: moment().format(),
      title: "Contact",
      slug: "contact",
      dateOverride: "",
      hideFromSearch: false,
      hideFromSitemap: false,
      showTableOfContents: false,
      summary: "Contact R3",
      body: "",
      createdAt: moment().format(),
      updatedAt: moment().format(),
      publishedAt: moment().format(),
      searchMeta:
        "contact email seo social facebook twitter instagram linkedin ",
      path: "/contact",
      url: `${SITE_URL}/contact`,
      type: "page",
    },
  },
  {
    id: uuidv4(),
    attributes: {
      id: uuidv4(),
      postDate: moment().format(),
      title: "Resources",
      slug: "resources",
      dateOverride: "",
      hideFromSearch: false,
      hideFromSitemap: false,
      showTableOfContents: false,
      summary: "R3 Resources",
      body: "",
      createdAt: moment().format(),
      updatedAt: moment().format(),
      publishedAt: moment().format(),
      searchMeta: "resources tools eligibility ",
      path: "/resources",
      url: `${SITE_URL}/resources`,
      type: "page",
    },
  },
  {
    id: uuidv4(),
    attributes: {
      id: uuidv4(),
      postDate: moment().format(),
      title: "Resources (Single Page)",
      slug: "resources/single-page",
      dateOverride: "",
      hideFromSearch: false,
      hideFromSitemap: false,
      showTableOfContents: false,
      summary: "R3 Resources (Single Page)",
      body: "",
      createdAt: moment().format(),
      updatedAt: moment().format(),
      publishedAt: moment().format(),
      searchMeta: "resources tools eligibility mobile single printer ",
      path: "/resources/single-page",
      url: `${SITE_URL}/resources/single-page`,
      type: "page",
    },
  },
  {
    id: uuidv4(),
    attributes: {
      id: uuidv4(),
      postDate: moment().format(),
      title: "Frequently Asked Questions (FAQs)",
      slug: "faqs",
      dateOverride: "",
      hideFromSearch: false,
      hideFromSitemap: false,
      showTableOfContents: false,
      summary: "R3 Frequently Asked Questions (FAQs)",
      body: "",
      createdAt: moment().format(),
      updatedAt: moment().format(),
      publishedAt: moment().format(),
      searchMeta:
        "questions help assistance technical funding apply eligibility ",
      path: "/faqs",
      url: `${SITE_URL}/faqs`,
      type: "page",
    },
  },
];

const pages = [...manualPages];

const routes = pages.map((item) => {
  return `/${item.attributes.slug}`;
});

jsonfile.writeFileSync(`./public/routesManual.json`, routes, function (err) {
  if (err) {
    console.error(err);
  }
  // eslint-disable-next-line prettier/prettier
});

console.log("Manual routes: ", routes);

jsonfile.writeFileSync(`./public/manual.json`, pages, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("manual.json created in /public/");
