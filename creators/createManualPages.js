/**
 * @fileoverview Manual pages generator script for the ICJIA R3 Nuxt 3 application.
 * This script creates static manual pages (like search, translate, etc.) that are
 * not managed through the CMS but are required for application functionality.
 *
 * The script performs the following operations:
 * 1. Defines manual page configurations with metadata
 * 2. Generates pages.json entries for manual pages
 * 3. Creates routes for manual pages in routesPages.json
 *
 * @requires module:fs - For file system operations
 * @requires module:path - For path manipulation
 * @requires module:axios - For HTTP requests (if needed)
 * @requires module:moment - For date formatting
 * @requires module:jsonfile - For JSON file operations
 * @requires module:lodash - For data manipulation utilities
 * @requires module:uuid - For generating unique identifiers
 *
 * @since 1.0.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";
import moment from "moment";
import jsonfile from "jsonfile";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = config.site.url;

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
      searchMeta:
        "translate google spanish polish tagalog chinese arabic hindi urdu ",
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
  // {
  //   id: uuidv4(),
  //   attributes: {
  //     id: uuidv4(),
  //     postDate: moment().format(),
  //     title: "Frequently Asked Questions (Printer Friendly)",
  //     slug: "faqs/single-page",
  //     dateOverride: "",
  //     hideFromSearch: false,
  //     hideFromSitemap: false,
  //     showTableOfContents: false,
  //     summary: "Frequently Asked Questions (Printer Friendly)",
  //     body: "",
  //     createdAt: moment().format(),
  //     updatedAt: moment().format(),
  //     publishedAt: moment().format(),
  //     searchMeta:
  //       "questions printer friendly single FAQs faqs help assistance technical funding apply eligibility ",
  //     path: "/faqs/single-page",
  //     url: `${SITE_URL}/faqs/single-page`,
  //     type: "page",
  //   },
  // },
];

// /faqs/single-page/faqs/single-page
const pages = [...manualPages];

const routes = pages.map((item) => {
  return `/${item.attributes.slug}`;
});

jsonfile.writeFileSync(`./public/routesManual.json`, routes, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("Manual routes: ", routes);

jsonfile.writeFileSync(`./public/manual.json`, pages, function (err) {
  if (err) {
    console.error(err);
  }
});

console.log("manual.json created in /public/");
