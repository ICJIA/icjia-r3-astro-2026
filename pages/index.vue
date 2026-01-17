<template>
  <div>
    <div v-if="data">
      <!-- Main page heading for accessibility -->
      <h1 class="sr-only">
        R3 Restore, Reinvest, Renew - Illinois Criminal Justice Information
        Authority
      </h1>

      <!-- Splash Images Section -->
      <v-container fluid class="full-width">
        <v-row no-gutters>
          <v-col
            v-for="(item, index) in splash"
            :key="`splash-photo-${index}`"
            cols="12"
            md="6"
          >
            <v-card
              style="min-height: 600px"
              class="splash-card"
              :elevation="hoveredCard === index ? 8 : 2"
              @click="handleSplashClick(item.externalURL)"
              @mouseenter="hoveredCard = index"
              @mouseleave="hoveredCard = null"
            >
              <div style="position: relative">
                <!-- Background image -->
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
                />

                <!-- Color wash overlay -->
                <div
                  :style="{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor:
                      index === 0
                        ? 'rgba(200, 120, 120, 0.15)'
                        : 'rgba(120, 140, 200, 0.15)',
                    zIndex: 0.5,
                    pointerEvents: 'none',
                  }"
                />

                <!-- Content overlay -->
                <div class="splash-content-overlay">
                  <div class="nofo-band py-4 px-6 text-center">
                    <h2 class="nofo-title mt-1 mb-2">
                      {{ item.title }}
                    </h2>
                    <div class="nofo-tagline">
                      {{ item.tagline }}
                    </div>
                    <div class="application-date mt-4">
                      Applications open Tuesday, January 6, 2026 at 12:00pm
                      (CST)
                    </div>
                    <!-- Commented out for future use - button will be restored when links are ready -->
                    <!--
                    <div class="mt-6">
                      <v-btn
                        variant="outlined"
                        color="white"
                        size="small"
                        class="button-href"
                      >
                        Coming Soon!
                      </v-btn>
                    </div>
                    -->
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Main Content Section -->
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
          </v-col>
        </v-row>
      </v-container>

      <!-- Footer Section: Director Letter, Tools, and News -->
      <div class="footer-section">
        <!-- Director Letter -->
        <div class="director-letter-section">
          <v-container>
            <v-row>
              <v-col>
                <h2>Letter From the Director</h2>
                <p>
                  <img
                    src="/DirectorAdamsResized.jpg"
                    width="140"
                    alt="ICJIA Executive Director, Delrice Adams"
                    class="elevation-12 director-photo"
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
              </v-col>
            </v-row>
          </v-container>
        </div>

        <!-- Tools and News -->
        <v-container fluid>
          <v-row>
            <!-- Applicant Tools -->
            <v-col cols="12" md="7">
              <h2>Applicant Tools</h2>
              <HomePhotoBoxes />
            </v-col>

            <!-- News & Updates -->
            <v-col cols="12" md="5">
              <h2>News & Updates</h2>
              <v-card
                v-for="item in sortedNews"
                :key="item.id"
                elevation="1"
                class="px-5 py-3 mb-3 info-card mt-8"
                height="275px"
                @click="routeToNews(item)"
              >
                <div class="news-date">
                  {{ moment(item.postDate).utc().format("MMM DD, YYYY") }}
                </div>
                <h3 class="news-title">
                  {{ item.title }}
                </h3>
                <p>{{ item.summary }}</p>
              </v-card>
              <div class="text-center mt-10">
                <nuxt-link 
                  to="/news" 
                  class="home-link"
                  style="display: inline-flex; align-items: center; justify-content: center; min-height: 44px; min-width: 150px; padding: 12px 24px; color: #0D4474; text-decoration: underline; font-weight: 600;"
                >
                  News archive&nbsp;&raquo;
                </nuxt-link>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else>
      <v-container class="text-center" style="margin-top: 200px">
        <v-row>
          <v-col>
            <h1 id="loading" style="border-bottom: 0px; margin-bottom: 50px">
              R3 RESTORE. REINVEST. RENEW.
            </h1>
            <TheAltLoader />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import _ from "lodash";
import moment from "moment";

/**
 * Application configuration containing splash data.
 */
const { splash } = useAppConfig();

/**
 * Vue Router instance for programmatic navigation.
 */
const router = useRouter();

/**
 * Homepage content data fetched from the CMS.
 */
const { data } = await useAsyncData(`content-home`, async () => {
  const post = await queryContent().where({ _path: "/" }).findOne();
  return post;
});

/**
 * News articles data fetched from the CMS.
 */
const { data: news } = await useAsyncData(`news-home`, async () => {
  const post = await queryContent("/news").find();
  return post;
});

// SEO Configuration for Homepage
usePageSeo({
  title: 'Restore. Reinvest. Renew.',
  description: 'The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment through economic development, violence prevention, reentry, and civil legal aid services.',
  path: '/',
  keywords: ['R3', 'Restore Reinvest Renew', 'Illinois grants', 'community investment', 'criminal justice reform', 'reentry programs', 'violence prevention', 'economic development'],
})

// Add Website structured data with search functionality
useWebsiteSchema()

// Add breadcrumb for homepage
useBreadcrumbListSchema([
  { name: 'Home', url: '/' }
])

/**
 * Sorted and limited news articles for homepage display.
 * Shows the 2 most recent news articles ordered by post date.
 */
const sortedNews = computed(() => {
  const sorted = _.orderBy(news.value, ["postDate"], ["desc"]);
  return sorted.slice(0, 2);
});

/**
 * Navigates to a specific news article page.
 */
const routeToNews = (item) => {
  router.push(`/news/${item.slug}`);
};

/**
 * Tracks which splash card is currently being hovered.
 * Used for elevation effect on hover.
 */
const hoveredCard = ref(null);

/**
 * Handles click on splash card to navigate to external URL.
 * Opens the URL in a new tab for external links.
 */
const handleSplashClick = (externalURL) => {
  if (externalURL) {
    window.open(externalURL, "_blank", "noopener,noreferrer");
  }
};
</script>

<style scoped>
/* Splash Card Styles */
.splash-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.splash-card:hover {
  transform: translateY(-4px);
}

/* Splash Content Overlay */
.splash-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 48px;
}

/* Button Styles */
.button-href .v-btn__content {
  font-weight: 700 !important;
  text-decoration: none !important;
  overflow: visible !important;
  white-space: nowrap !important;
}

.button-href:hover .v-btn__content {
  text-decoration: none !important;
}

.button-href {
  overflow: visible !important;
  min-width: fit-content !important;
}

.button-href .v-btn__content {
  overflow: visible !important;
  text-overflow: clip !important;
}

.button-href.v-btn--variant-outlined {
  border-color: rgba(255, 255, 255, 0.9) !important;
}

/* Splash Band and Text */
.nofo-band {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  backdrop-filter: saturate(110%) brightness(115%);
}

.nofo-tagline {
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  line-height: 1.5;
}

.application-date {
  color: #fff;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  line-height: 1.4;
}

@media (max-width: 959px) {
  .application-date {
    font-size: 1rem;
  }
}

/* Truncate tagline on small screens */
@media (max-width: 959px) {
  .nofo-tagline {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 9em;
    word-wrap: break-word;
  }
}

.nofo-title {
  font-size: 2.25rem !important;
  font-weight: 900;
  color: #fff !important;
  text-align: center !important;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(0, 0, 0, 0.6);
}

@media (max-width: 959px) {
  .nofo-title {
    font-size: 1.75rem !important;
  }
}

/* Container Styles */
.full-width {
  margin: 0;
  padding: 0;
}

/* Footer Section */
.footer-section {
  margin-top: 40px;
  padding-bottom: 48px;
  background: #fafafa;
  border-top: 1px solid #aaa;
  min-height: 30vh;
}

.director-letter-section {
  background: #ddd;
  border-bottom: 1px solid #aaa;
  padding: 0 12px 12px;
}

.director-photo {
  float: left;
  margin-right: 15px;
  border: 1px solid #888;
  border-radius: 80%;
}

/* News Styles */
.news-date {
  font-size: 12px;
  font-weight: 700;
}

.news-title {
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

/* Links */
/* AAA Compliant link - 7:1 contrast ratio and 44x44 minimum target size */
a.home-link {
  color: #0D4474 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 44px !important;
  min-width: 150px !important;
  padding: 12px 24px !important;
  text-decoration: underline !important;
  font-weight: 600 !important;
  box-sizing: border-box !important;
}

a.home-link:hover,
a.home-link:focus {
  color: #062a47 !important;
  text-decoration: underline !important;
}

a.home-link:focus-visible {
  outline: 2px solid #0D4474 !important;
  outline-offset: 2px !important;
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
