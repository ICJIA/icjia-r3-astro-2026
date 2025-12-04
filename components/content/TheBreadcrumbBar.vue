<template>
  <div
    style="
      background: #0e4474;
      border-bottom: 1px solid #aaa;
      font-size: 13px;
      z-index: 99999 !important;
    "
    class="text-left pr-5 pl-5 py-1 elevation-0"
  >
    <nuxt-link to="/" class="breadcrumb-link" style="color: white"
      >R3 HOME</nuxt-link
    >

    <span v-for="(section, index) in sections" :key="section.url">
      <span style="color: #fff" class="breadcrumb-link"
        >&nbsp;&nbsp;>&nbsp;&nbsp;</span
      >

      <nuxt-link
        :to="section.url"
        class="breadcrumb-link"
        style="color: white"
        v-if="index < sections.length - 1 && section.name !== 'graduations'"
        >{{ makeTitle(section.name) }}
      </nuxt-link>
      <span style="color: #fff" v-else>{{
        truncateString(makeTitle(section.name))
      }}</span>
    </span>
  </div>
</template>

<script setup>
/**
 * @fileoverview Breadcrumb navigation component for the ICJIA R3 Nuxt 3 application.
 *
 * This component generates and displays a breadcrumb navigation trail based on the current route.
 * It provides hierarchical navigation context and allows users to navigate back to parent pages.
 * The breadcrumbs are automatically generated from the URL path structure.
 *
 * @component TheBreadcrumbBar
 * @example
 * ```vue
 * <template>
 *   <TheBreadcrumbBar />
 * </template>
 * ```
 *
 * @since 1.0.0
 */

/**
 * Current route object from Vue Router.
 * Provides access to route information including path, params, and query.
 *
 * @type {RouteLocationNormalized}
 */
const route = useRoute();

/**
 * Current route path string (normalized to remove trailing slash).
 * Used to generate breadcrumb navigation sections.
 * Trailing slashes are removed to ensure consistent breadcrumb generation
 * regardless of how the URL was accessed.
 *
 * @type {string}
 */
const rawPath = route.path;
const path =
  rawPath.endsWith("/") && rawPath !== "/" ? rawPath.slice(0, -1) : rawPath;

/**
 * Vue Router instance for programmatic navigation.
 * Used for navigating to breadcrumb sections when clicked.
 *
 * @type {Router}
 */
const router = useRouter();

/**
 * Array of path segments split by forward slashes.
 * Used to build the hierarchical breadcrumb structure.
 *
 * @type {Array<string>}
 */
const dirs = path.split("/");

/**
 * Array of breadcrumb sections with URL and name properties.
 * Each section represents a navigable breadcrumb item.
 *
 * @type {Array<Object>}
 * @property {string} url - The URL path for the breadcrumb section
 * @property {string} name - The display name for the breadcrumb section
 */
const sections = [];

/**
 * Build breadcrumb sections from path segments.
 * Creates linkable sections by progressively building URLs from path segments.
 * Uses unshift to maintain proper order and pop to process segments.
 */
while (dirs.length) {
  sections.unshift({ url: dirs.join("/"), name: dirs.pop() });
}

/**
 * Truncates a string to a specified length with ellipsis.
 * Used to prevent breadcrumb items from becoming too long.
 *
 * @param {string} str - The string to truncate
 * @param {number} [num=25] - Maximum length before truncation
 * @returns {string} The truncated string with ellipsis if needed
 *
 * @example
 * ```javascript
 * truncateString("Very long breadcrumb name", 15); // "Very long bread..."
 * truncateString("Short", 25); // "Short"
 * ```
 */
const truncateString = function (str, num = 25) {
  if (str.length <= num) {
    return str;
  }

  return str.slice(0, num) + "...";
};

// Remove the root section (empty string from leading slash)
sections.shift();

/**
 * Converts a URL slug into a human-readable title.
 * Removes leading slashes, replaces path separators with breadcrumb separators,
 * and capitalizes each word for display purposes.
 *
 * @param {string} slug - The URL slug to convert
 * @returns {string} A formatted title string
 *
 * @example
 * ```javascript
 * makeTitle("/news/latest-updates"); // "News > Latest Updates"
 * makeTitle("about-us"); // "About Us"
 * makeTitle("/resources/funding-guide"); // "Resources > Funding Guide"
 * ```
 */
const makeTitle = (slug) => {
  // remove initial slash
  slug = slug.replace(/^\/+/g, "").replace("/", " > ");

  const words = slug.split("-");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(" ");
};
</script>

<style scoped>
.breadcrumb-link {
  font-size: 12px;
}
</style>
