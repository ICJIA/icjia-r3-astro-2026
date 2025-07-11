/**
 * @fileoverview Data and publications API endpoint for the ICJIA R3 Nuxt 3 application.
 *
 * This server API endpoint provides access to research hub data and publications.
 * It serves the hub.json content which contains research articles and publication metadata.
 *
 * @api /api/dataAndPublications
 * @method GET
 * @since 1.0.0
 */

import content from "../../src/hub.json";

/**
 * API event handler that returns research hub content and publications data.
 * Provides access to research articles, publications, and related metadata
 * from the ICJIA Research Hub.
 *
 * @param {H3Event} event - The H3 event object containing request information
 * @returns {Object} Response object containing content data
 * @returns {Array} returns.content - Array of research hub articles and publications
 *
 * @example
 * ```javascript
 * // GET /api/dataAndPublications
 * // Returns:
 * // {
 * //   content: [
 * //     {
 * //       id: "article-1",
 * //       title: "Research Article Title",
 * //       summary: "Article summary...",
 * //       date: "2024-01-15",
 * //       tags: ["criminal justice", "research"]
 * //     },
 * //     // ... more articles
 * //   ]
 * // }
 * ```
 *
 * @since 1.0.0
 */
export default defineEventHandler((event) => {
  return {
    content,
  };
});
