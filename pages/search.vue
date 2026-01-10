<template>
  <div>
    <TheBreadcrumbBar></TheBreadcrumbBar>
    <keep-alive>
      <v-container class="mb-12" fluid
        ><v-row
          ><v-col cols="12">
            <h1>Search</h1>
            <div class="text-right">Found: {{ result.length }}</div>
            <v-container fluid
              ><v-row
                ><v-col cols="12" md="10" class="text-left">
                  <v-form class="pl-2 mt-4" style="margin-top: -15px">
                    <label for="textfield" class="sr-only">Search R3</label>
                    <v-text-field
                      id="textfield"
                      ref="textfield"
                      v-model="query"
                      clearable
                      label="Search R3"
                      placeholder="Enter search term"
                      style="font-weight: 900"
                      @input="instantSearch"
                      autocomplete="off"
                      @keypress.enter.prevent
                    />
                  </v-form>
                </v-col>
                <v-col cols="12" md="2" class="hidden-sm-and-down">
                  <div class="pt-6">
                    <v-btn color="blue-darken-4" @click.prevent="clearAll"
                      >Clear Search</v-btn
                    >
                  </div></v-col
                >
                <v-col cols="12" md="2" class="hidden-md-and-up">
                  <div class="text-center">
                    <v-btn color="blue-darken-4" @click.prevent="clearAll"
                      >Clear Search</v-btn
                    >
                  </div></v-col
                >
              </v-row></v-container
            >
            <div
              class="text-left"
              style="margin-top: -20px; margin-left: 30px; font-size: 14px"
              v-if="queries.length && queries.length > 0"
            >
              <span>Your recent queries:&nbsp;</span>
              <span
                v-for="q in queries"
                :key="Math.random()"
                @click="addQuery(q)"
                class="hover"
                ><v-chip
                  size="small"
                  class="mr-2 hover"
                  style="font-weight: 900"
                  >{{ q }}</v-chip
                ></span
              >
            </div>

            <div v-if="result && query?.length" class="mt-12">
              <!-- <div class="text-center">
                <h2>Search results:</h2>
              </div> -->
              <div v-if="result.length">
                <v-card
                  v-for="(result, index) in result"
                  :key="`fuse-${index}`"
                  class="px-5 py-5 mx-5 my-10 hover text-left info-card"
                  elevation="2"
                  color="grey-lighten-4"
                  @click="navigateTo(result.item)"
                >
                  <h2 style="border-bottom: 0px">{{ result.item.title }}</h2>
                  <p class="mt-2">{{ result.item.summary }}</p>
                  <!-- <p>{{ result.item }}</p> -->
                  <!-- <p
                    style="
                      font-size: 11px;
                      font-weight: 900;
                      border: 1px solid #ccc;
                      display: inline-block;
                      float: right;
                      padding: 5px;
                      background: #ddd;
                      color: #000;
                    "
                    class="mt-2"
                  >
                    Score: {{ result.score }}
                  </p> -->
                </v-card>
              </div>
            </div>
          </v-col></v-row
        ></v-container
      >
    </keep-alive>
  </div>
</template>

<script setup>
/**
 * @fileoverview Search page component for the ICJIA R3 Nuxt 3 application.
 *
 * This page provides full-text search functionality across all site content
 * using Fuse.js for fuzzy search capabilities. It includes search history,
 * instant search results, and navigation to found content.
 *
 * @page search
 * @route /search
 * @example
 * ```
 * // Accessed via: https://r3.illinois.gov/search
 * ```
 *
 * @since 1.0.0
 */

import Fuse from "fuse.js";
import searchIndex from "~/assets/json/searchIndex.json";

/**
 * Search state management using Nuxt 3 native state instead of Pinia.
 * Provides access to search queries history and query management functions.
 *
 * @type {Object}
 * @property {Ref<Array<string>>} queries - Reactive array of previous search queries
 * @property {Function} addNewQuery - Function to add a new query to history
 */
const { queries, addNewQuery } = useSearchActions();

/**
 * Set the page title for SEO and browser tab display.
 */
useHead({
  title: "Search",
});

/**
 * Fuse.js configuration options for search functionality.
 * Configures fuzzy search behavior, scoring, and field targeting.
 *
 * @type {Object}
 * @property {boolean} isCaseSensitive - Whether search is case sensitive
 * @property {boolean} includeScore - Include relevance scores in results
 * @property {boolean} shouldSort - Sort results by relevance
 * @property {boolean} includeMatches - Include match information
 * @property {boolean} findAllMatches - Find all matches in text
 * @property {number} minMatchCharLength - Minimum character length for matches
 * @property {number} location - Expected location of match
 * @property {number} threshold - Fuzzy matching threshold (0.0 = exact, 1.0 = anything)
 * @property {number} distance - Maximum distance for matches
 * @property {Array<string>} keys - Fields to search within
 */
const options = {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
  includeMatches: true,
  findAllMatches: true,
  minMatchCharLength: 2,
  location: 0,
  threshold: 0.4,
  distance: 500,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  keys: ["title", "slug", "summary", "searchMeta", "rawText"],
};

/**
 * Reactive search query string.
 * Bound to the search input field for real-time search.
 *
 * @type {Ref<string>}
 */
const query = ref("");

/**
 * Fuse.js search instance configured with the search index and options.
 * Provides the core search functionality for the application.
 *
 * @type {Fuse}
 */
const fuse = new Fuse(searchIndex, options);

/**
 * Reactive search results array.
 * Contains the current search results from Fuse.js.
 *
 * @type {Ref<Array<Object>>}
 */
const result = ref(fuse.search(query.value.toLowerCase));
// console.log("queries: ", queries.value.length);

/**
 * Initialize search with the most recent query from history.
 * If there are previous queries, use the latest one to populate the search.
 */
if (queries.value.length) {
  query.value = queries.value[queries.value.length - 1];
  result.value = fuse.search(query.value);
}

/**
 * Performs an instant search with the current query value.
 * Updates the search results immediately when called.
 *
 * @function instantSearch
 * @example
 * ```javascript
 * // Called on input events for real-time search
 * instantSearch();
 * ```
 */
const instantSearch = () => {
  result.value = fuse.search(query.value);
};

/**
 * Controls visibility of the search index/debug information.
 * Used for development and debugging purposes.
 *
 * @type {Ref<boolean>}
 */
const showIndex = ref(false);

/**
 * Toggles the visibility of the search index display.
 * Switches between showing and hiding debug information.
 *
 * @function toggleIndex
 */
const toggleIndex = () => {
  showIndex.value = !showIndex.value;
};

/**
 * Sets a new search query and performs the search.
 * Used when selecting from search history or suggestions.
 *
 * @param {string} q - The query string to search for
 *
 * @example
 * ```javascript
 * addQuery("criminal justice reform");
 * // Sets query and updates results
 * ```
 */
const addQuery = (q) => {
  query.value = q;
  result.value = fuse.search(query.value);
};

/**
 * Watcher for the search query reactive reference.
 * Clears results when the query becomes empty.
 */
watch(query, (val) => {
  if (!val) {
    result.value = [];
  }
});

/**
 * Vue Router instance for programmatic navigation.
 * Used for navigating to search result pages.
 *
 * @type {import('vue-router').Router}
 */
const router = useRouter();

/**
 * Navigates to a search result item and saves the query to history.
 * Adds the current query to search history before navigation.
 *
 * @param {Object} item - Search result item
 * @param {string} item.path - The path to navigate to
 *
 * @example
 * ```javascript
 * navigateTo({ path: "/news/article-slug" });
 * // Saves query to history and navigates to the article
 * ```
 */
const navigateTo = (item) => {
  addNewQuery(query.value);
  router.push({ path: item.path });
};

/**
 * Clears all search data and resets the interface.
 * Resets query, results, and index visibility, then focuses the input.
 *
 * @function clearAll
 * @example
 * ```javascript
 * clearAll(); // Resets search interface
 * ```
 */
const clearAll = () => {
  query.value = "";
  result.value = [];
  showIndex.value = false;
  const el = document.getElementById("textfield");
  el.focus();
};

/**
 * Component lifecycle hook that runs after the component is mounted.
 * Automatically focuses the search input field for better user experience.
 */
onMounted(() => {
  const el = document.getElementById("textfield");
  el.focus();
});
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<style lang="scss" scoped></style>
