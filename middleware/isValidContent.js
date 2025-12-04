/**
 * @fileoverview Content validation middleware for the ICJIA R3 Nuxt 3 application.
 *
 * This middleware validates that requested routes correspond to actual content
 * by checking against the generated application routes list. If a route is not
 * found in the valid routes, it redirects to the 404 page with referrer information.
 *
 * @middleware isValidContent
 * @since 1.0.0
 */

import appRoutes from "assets/json/appRoutes.json";

/**
 * Route validation middleware function.
 * Checks if the requested route exists in the application's valid routes list.
 * If the route is invalid, redirects to 404 page with query parameters for debugging.
 *
 * @param {Object} to - The target route object being navigated to
 * @param {string} to.path - The path of the target route
 * @param {Object} from - The current route object being navigated from
 * @param {string} from.path - The path of the current route
 * @returns {NavigationGuardReturn} Navigation result or redirect to 404
 *
 * @example
 * ```javascript
 * // Applied to pages via definePageMeta:
 * definePageMeta({
 *   middleware: ["is-valid-content"]
 * });
 *
 * // Valid route: /news/article-title -> allows navigation
 * // Invalid route: /nonexistent-page -> redirects to 404
 * ```
 *
 * @since 1.0.0
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter();

  // Normalize path by removing trailing slash for comparison
  // This ensures /news/article and /news/article/ both match
  const normalizedPath =
    to.path.endsWith("/") && to.path !== "/" ? to.path.slice(0, -1) : to.path;

  if (appRoutes.indexOf(normalizedPath) > -1) {
    // Route is valid, continue
  } else {
    /**
     * URI-encoded source path for debugging purposes.
     * Preserves the original path in the query string.
     *
     * @type {string}
     */
    const URIEncodedFromPath = encodeURIComponent(from.path);

    /**
     * URI-encoded destination path for debugging purposes.
     * Preserves the attempted path in the query string.
     *
     * @type {string}
     */
    const URIEncodedToPath = encodeURIComponent(to.path);

    return router.push({
      name: `404`,
      query: { referrer: URIEncodedFromPath, destination: URIEncodedToPath },
    });
  }
});
