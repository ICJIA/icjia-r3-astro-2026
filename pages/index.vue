<template>
  <div>
    <div v-if="data">
      <!-- Main page heading for accessibility -->
      <h1 class="sr-only">
        R3 Restore, Reinvest, Renew - Illinois Criminal Justice Information
        Authority
      </h1>
      <v-container fluid class="full-width">
        <v-row no-gutters>
          <v-col
            v-for="(item, index) in splash"
            :key="`splash-photo-${index}`"
            style="background: #ccc"
            cols="12"
            md="12"
          >
            <v-card
              class=""
              style="min-height: 600px"
              v-if="!underConstruction"
            >
              <div style="position: relative">
                <!-- Background image (presentational only) -->
                <v-img
                  cover
                  :src="item.src"
                  :lazy-src="item.lazySrc"
                  alt=""
                  aspect-ratio="1"
                  class="grey lighten-2"
                  height="650"
                  crossorigin
                  gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.25)"
                  role="presentation"
                  aria-hidden="true"
                >
                </v-img>

                <!-- Interactive content overlay -->
                <div
                  class="d-flex flex-column justify-center align-center h-100 px-12"
                  style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                  "
                  role="region"
                  aria-label="R3 Program funding opportunity information"
                >
                  <div class="nofo-band py-4 px-6 text-center">
                    <h2
                      class="nofo-title mt-1 mb-2"
                      style="
                        color: #fff !important;
                        font-size: 2.5rem !important;
                        text-align: center !important;
                      "
                    >
                      {{ item.title }}
                    </h2>
                    <div class="nofo-tagline">
                      {{ item.tagline }}
                    </div>

                    <div class="mt-6">
                      <v-btn
                        variant="outlined"
                        color="white"
                        size="small"
                        class="button-href hidden-sm-and-down"
                        >Expired 04/30/24&nbsp;&nbsp;</v-btn
                      >
                      <v-btn
                        variant="outlined"
                        color="white"
                        size="small"
                        class="button-href hidden-md-and-up ml-3"
                        >Expired 04/30/24&nbsp;&nbsp;</v-btn
                      >
                    </div>
                  </div>
                </div>
              </div>
            </v-card>

            <v-card class="" style="min-height: 600px" v-else>
              <div style="position: relative">
                <!-- Background image (presentational only) -->
                <v-img
                  cover
                  :src="item.src"
                  :lazy-src="item.lazySrc"
                  alt=""
                  aspect-ratio="1"
                  class="grey lighten-2"
                  height="650"
                  crossorigin
                  gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.25)"
                  role="presentation"
                  aria-hidden="true"
                >
                </v-img>

                <!-- Interactive content overlay -->
                <div
                  class="d-flex flex-column justify-center align-center h-100 px-12"
                  style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                  "
                  role="region"
                  aria-label="R3 Program funding opportunity information"
                >
                  <div class="nofo-band py-4 px-6 text-center">
                    <h2
                      class="nofo-title mt-1 mb-2"
                      style="
                        color: #fff !important;
                        font-size: 2.5rem !important;
                        text-align: center !important;
                      "
                    >
                      2025 SERVICE DELIVERY GRANT OPPORTUNITIES
                    </h2>
                    <div class="nofo-tagline">
                      {{ item.tagline }}
                    </div>

                    <div class="mt-6">
                      <v-btn
                        variant="outlined"
                        color="white"
                        size="small"
                        class="button-href hidden-sm-and-down"
                        >Coming Soon!</v-btn
                      >
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col cols="12">
            <ContentDoc
              :key="data?.title"
              :value="data"
              class="markdown-body mt-12"
            >
              <template #empty>Document not found</template>
              <template #not-found>Document not found</template>
            </ContentDoc>
          </v-col></v-row
        ></v-container
      >

      <div
        class="mt-10 pb-12"
        style="
          background: #fafafa;
          border-top: 1px solid #aaa;
          min-height: 30vh;
        "
      >
        <div
          style="background: #ddd; border-bottom: 1px solid #aaa"
          class="px-3 pt-0 pb-3"
        >
          <v-container
            ><v-row
              ><v-col>
                <h2>Letter From the Director</h2>
                <p>
                  <img
                    src="/DirectorAdamsResized.jpg"
                    width="140"
                    alt="ICJIA Executive Director, Delrice Adams"
                    class="elevation-12"
                    style="
                      float: left;
                      margin-right: 15px;
                      border: 1px solid #888;
                      border-radius: 80%;
                    "
                  />
                  Thank you for visiting the Restore, Reinvest, Review (R3)
                  program website. We appreciate your interest in the R3 mission
                  of investing in communities most affected by systemic racism
                  and disinvestment.
                </p>
                <p>
                  In collaboration with Lt. Gov. Stratton and the Justice Equity
                  and Opportunity Initiative, ICJIA has provided funding access
                  and availability to over 400 new small, localized grassroots
                  organizations that, without R3, may not have received state
                  grants
                </p>
                <p>
                  As we initiate our third R3 Notice of Funding Opportunity, we
                  remain committed to ensuring equity, fairness, and opportunity
                  in communities across the state. We will continue to empower
                  organizations to create innovative programs and strategies
                  that address the diverse needs of their communities and,
                  ultimately, build a safer Illinois.
                </p>
                <div>
                  <strong>Delrice Adams</strong><br />
                  ICJIA Executive Director
                </div>
              </v-col></v-row
            ></v-container
          >
        </div>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="7"
              ><h2>Applicant Tools</h2>

              <HomePhotoBoxes />
            </v-col>
            <v-col cols="12" md="5">
              <h2>News & Updates</h2>
              <!-- <div v-if="test">{{ test[0].title }}</div> -->

              <v-card
                v-for="item in sortedNews"
                :key="item.id"
                elevation="1"
                class="px-5 py-3 mb-3 info-card mt-8"
                height="275px"
                @click="routeToNews(item)"
              >
                <div style="font-size: 12px; font-weight: 700">
                  {{ moment(item.postDate).utc().format("MMM DD, YYYY") }}
                </div>
                <h3
                  style="
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 8px;
                    margin-bottom: 20px;
                  "
                >
                  {{ item.title }}
                </h3>
                <p>{{ item.summary }}</p>
                <!-- <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    size="x-small"
                    variant="text"
                    :to="item.path"
                    style="font-weight: 900"
                    >Read more&nbsp;&raquo;</v-btn
                  >
                </v-card-actions> -->
              </v-card>
              <div class="text-center mt-10">
                <nuxt-link to="/news" class="home-link"
                  >News archive&nbsp;&raquo;</nuxt-link
                >
              </div>
            </v-col></v-row
          ></v-container
        >
      </div>
    </div>
    <div v-else>
      <v-container class="text-center" style="margin-top: 200px">
        <v-row>
          <v-col>
            <h1 id="loading" style="border-bottom: 0px; margin-bottom: 50px">
              R3 RESTORE. REINVEST. RENEW.
            </h1>
            <TheAltLoader></TheAltLoader></v-col></v-row
      ></v-container>
    </div>
  </div>
</template>

<script setup>
/**
 * @fileoverview Homepage component for the ICJIA R3 Nuxt 3 application.
 *
 * This is the main landing page that displays the R3 program overview,
 * recent news articles, featured tools, and key navigation elements.
 * It serves as the primary entry point for users visiting the site.
 *
 * @page index
 * @route /
 * @example
 * ```
 * // Accessed via: https://r3.illinois.gov/
 * ```
 *
 * @since 1.0.0
 */

import _ from "lodash";
import moment from "moment";

/**
 * Application configuration with construction status.
 * Used to determine if the site is under construction.
 *
 * @type {boolean}
 */
const { underConstruction } = useAppConfig();

// definePageMeta({
//   middleware: ["is-valid-content"],
// });

/**
 * Application configuration containing splash and tools data.
 * Provides content for the homepage hero section and tool links.
 *
 * @type {Object}
 * @property {Object} splash - Splash section configuration
 * @property {Array} tools - Array of tool objects for homepage display
 */
const { splash, tools } = useAppConfig();

/**
 * Current route information.
 * Used for data fetching and navigation context.
 *
 * @type {string}
 */
const { path } = useRoute();

/**
 * Vue Router instance for programmatic navigation.
 * Used for routing to different pages from homepage interactions.
 *
 * @type {Router}
 */
const router = useRouter();

/**
 * Reactive reference tracking component mount status.
 * Used to prevent hydration issues and ensure proper client-side rendering.
 *
 * @type {Ref<boolean>}
 */
const isMounted = ref(false);

// const error = useError();

/**
 * Homepage content data fetched from the CMS.
 * Contains the main content for the homepage including text and metadata.
 *
 * @type {Object} Homepage content object
 */
const { data } = await useAsyncData(`content-home`, async () => {
  const post = await queryContent().where({ _path: "/" }).findOne();
  return post;
});

/**
 * News articles data fetched from the CMS.
 * Contains all news articles for display on the homepage.
 *
 * @type {Array<Object>} Array of news article objects
 */
const { data: news } = await useAsyncData(`news-${path}`, async () => {
  const post = await queryContent("/news").find();

  return post;
});

/**
 * Redirects to the 404 error page.
 * Used when content is not found or an error occurs.
 *
 * @function redirect
 */
const redirect = () => {
  router.push("/404");
};

/**
 * Sorted and limited news articles for homepage display.
 * Shows the 2 most recent news articles ordered by post date.
 *
 * @type {Array<Object>} Array of the 2 most recent news articles
 */
let sortedNews = _.orderBy(news.value, ["postDate"], ["desc"]);
sortedNews = sortedNews.slice(0, 2);

/**
 * Navigates to a specific news article page.
 * Routes to the detailed view of a news article using its slug.
 *
 * @param {Object} item - News article object
 * @param {string} item.slug - URL slug for the news article
 *
 * @example
 * ```javascript
 * routeToNews({ slug: "latest-funding-announcement" });
 * // Navigates to: /news/latest-funding-announcement
 * ```
 */
const routeToNews = (item) => {
  router.push(`/news/${item.slug}`);
};

/**
 * Navigates to funding information (placeholder implementation).
 * Currently shows an alert but should route to funding details.
 *
 * @param {Object} item - Funding item object
 *
 * @todo Implement proper routing to funding information page
 * @example
 * ```javascript
 * routeToFunding({ id: "grant-123" });
 * // Should navigate to funding details
 * ```
 */
const routeToFunding = (item) => {
  alert("Route to funding info here");
};

/**
 * Navigates to a specific tool or utility page.
 * Routes to external or internal tools from the homepage.
 *
 * @param {string} item - URL or path to the tool
 *
 * @example
 * ```javascript
 * routeToTool("/search"); // Navigate to search page
 * routeToTool("https://external-tool.com"); // Navigate to external tool
 * ```
 */
const routeToTool = (item) => {
  router.push(`${item}`);
};

/**
 * Formats a date string into a human-readable format.
 * Uses US locale formatting for consistent date display.
 *
 * @param {string|Date} date - Date to format (ISO string or Date object)
 * @returns {string} Formatted date string (e.g., "January 15, 2024")
 *
 * @example
 * ```javascript
 * formatDate("2024-01-15"); // "January 15, 2024"
 * formatDate(new Date()); // Current date in formatted string
 * ```
 */
const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

/**
 * Opens a URL in a new browser tab (commented out).
 * Alternative implementation for external link navigation.
 *
 * @param {string} url - URL to open in new tab
 * @deprecated Currently not in use
 */
// const gotoURL = (url) => {
//   window.open(url, "_blank");
// };

/**
 * Component lifecycle hook that runs after the component is mounted.
 * Sets the mounted state to true for proper client-side rendering.
 */
onMounted(() => {
  isMounted.value = true;
});
</script>

<style>
.button-href .v-btn__content {
  font-weight: 700 !important;
  text-decoration: none !important;
}

.button-href:hover .v-btn__content {
  text-decoration: none !important;
}

a.home-link {
  color: #333;
}

/* Semi-transparent band to ensure contrast for text and buttons */
.nofo-band {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  backdrop-filter: saturate(110%) brightness(115%);
}

/* Tweak tagline readability */
.nofo-tagline {
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

/* Ensure outlined white button has strong visible border on band */
.button-href.v-btn--variant-outlined {
  border-color: rgba(255, 255, 255, 0.9) !important;
}

.nofo-tagline {
  color: #fff;
}
.nofo-title {
  font-size: 5rem !important;
  font-weight: 900;
  color: #fff !important;
  text-shadow: 0 0 10px #000;
}
.full-width {
  margin: 0;
  padding: 0;
}
.white-heading {
  color: #fff !important;
}
.dark-rule {
  border-bottom: 1px solid #000 !important;
}

/* Screen reader only content for accessibility */
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
