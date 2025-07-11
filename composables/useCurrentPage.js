/**
 * @fileoverview Current page composable for the ICJIA R3 Nuxt 3 application.
 * Provides page-specific state and utilities for the current page context.
 *
 * @since 1.0.0
 */

/**
 * Composable function for managing current page state and providing page-specific utilities.
 * This function encapsulates page-related logic and returns page information and helper methods.
 *
 * @param {Object} params - The parameters object
 * @param {string} params.slug - The current page slug identifier
 * @returns {Object} An object containing page state and utilities
 * @returns {string} returns.slug - The current page slug
 * @returns {string} returns.msg - A greeting message from the composable function
 *
 * @example
 * ```javascript
 * // In a Vue component
 * const { slug, msg } = useCurrentPage({ slug: "about-us" });
 * console.log(slug); // "about-us"
 * console.log(msg); // "Hello from composable function"
 * ```
 *
 * @example
 * ```javascript
 * // In a page component with dynamic routing
 * export default {
 *   setup() {
 *     const route = useRoute();
 *     const pageData = useCurrentPage({ slug: route.params.slug });
 *
 *     return {
 *       ...pageData
 *     };
 *   }
 * };
 * ```
 *
 * @since 1.0.0
 */
export default function useCurrentPage({ slug }) {
  console.log("in composable function");
  return {
    slug,
    msg: "Hello from composable function",
  };
}
