/**
 * @fileoverview Research hub images downloader script for the ICJIA R3 Nuxt 3 application.
 * This script fetches article images from the ICJIA Research Hub API and saves them locally
 * for use in the application.
 *
 * The script performs the following operations:
 * 1. Creates/recreates the hub-images directory
 * 2. Queries the Research Hub API for published articles with specific tags
 * 3. Downloads and saves splash and thumbnail images as base64-decoded files
 *
 * @requires module:module - For createRequire functionality in ES modules
 * @requires module:jsonfile - For JSON file operations
 * @requires module:fs - For file system operations
 * @requires module:axios - For HTTP requests to the API
 *
 * @since 1.0.0
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jsonfile = require("jsonfile");
const fs = require("fs");
const axios = require("axios");

/**
 * Directory path for storing downloaded hub images.
 * Images are saved in the public directory for direct access.
 *
 * @type {string}
 */
const dirpath = "./public/hub-images";

/**
 * Tags configuration for filtering research hub articles.
 * Loaded from the tags.json source file.
 *
 * @type {Array<string>} Array of tag strings for article filtering
 */
const tags = require("../src/tags.json");

/**
 * Stringified tags array for use in GraphQL query.
 * The API expects tags as a JSON string in the query.
 *
 * @type {string} JSON string representation of tags array
 */
let tagsArray = JSON.stringify(tags);
console.log("tags: ", tagsArray);

/**
 * Initialize the hub-images directory.
 * If the directory exists, remove it and recreate it to ensure a clean state.
 * If it doesn't exist, create it.
 */
if (!fs.existsSync(dirpath)) {
  fs.mkdirSync(dirpath);
} else {
  fs.rm("public/hub-images", { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    //console.log(`./public/images is deleted!`);
    fs.mkdirSync(dirpath);
    console.log(`./public/hub-images is created!`);
  });
}

/**
 * GraphQL query for fetching research hub articles with images.
 * Retrieves published articles that contain the specified tags,
 * limited to 100 articles sorted by date (newest first).
 *
 * @type {string} GraphQL query string
 */
const query = `query {
  articles(limit: 100, sort: "date:desc", where: {status: "published", tags_contains: ${tagsArray} }) {
    _id
    splash
    thumbnail
  }

}`;

/**
 * Fetch articles from the Research Hub API and download their images.
 * Makes a GraphQL request to retrieve article data and processes the images.
 *
 * @throws {Error} If the API request fails or returns invalid data
 */
axios
  .create({ baseURL: "https://researchhub.icjia-api.cloud" })
  .post("/graphql", { query, validateStatus: (status) => status === 200 })
  .then((res) => {
    const articles = res.data.data.articles;
    writeImages(res.data.data.articles, ["splash"]);
    writeImages(res.data.data.articles, ["thumbnail"]);
  })
  .catch((err) => console.error(err));

/**
 * Process multiple image attributes for multiple articles.
 * Iterates through articles and image attributes to download all specified images.
 *
 * @param {Array<Object>} items - Array of article objects containing image data
 * @param {Array<string>} attrs - Array of image attribute names to process (e.g., ["splash", "thumbnail"])
 *
 * @example
 * ```javascript
 * writeImages(articles, ["splash", "thumbnail"]);
 * ```
 */
const writeImages = (items, attrs) =>
  items.forEach((item) => attrs.forEach((attr) => writeImage(item, attr)));

/**
 * Download and save a single image from base64 data.
 * Extracts the image data and file extension from base64 string,
 * then writes the decoded image to the filesystem.
 *
 * @param {Object} item - Article object containing image data
 * @param {string} item._id - Unique identifier for the article
 * @param {string} item[attr] - Base64 encoded image data
 * @param {string} attr - Image attribute name (e.g., "splash", "thumbnail")
 *
 * @throws {Error} If file write operation fails
 *
 * @example
 * ```javascript
 * // Save a splash image for an article
 * writeImage(article, "splash");
 *
 * // Save a thumbnail image for an article
 * writeImage(article, "thumbnail");
 * ```
 */
const writeImage = (item, attr) => {
  const base64 = item[attr];
  const data = base64.split(";base64,").pop();
  const ext = base64.split("data:image/")[1].split(";")[0];
  //console.log("ext", ext);
  const path = `${dirpath}/${item._id}-${attr}.${ext}`;

  fs.writeFile(path, data, "base64", (err) => {
    if (err) throw err;
  });
  //console.log(path);
};
