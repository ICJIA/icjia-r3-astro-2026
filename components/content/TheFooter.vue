<template>
  <v-footer
    dark
    class=""
    style="margin: 0; padding: 0; z-index: 9999"
    aria-label="Site footer"
  >
    <v-card
      flat
      tile
      width="100%"
      class="text-center markdown-body pb-4"
      style="background: #0e4474"
    >
      <the-context-footer class="hidden-sm-and-down"></the-context-footer>
      <v-container class="mt-0" fill-height>
        <v-row align="center" justify="center">
          <v-col
            cols="12"
            md="12"
            class="text-center mt-2"
            style="color: white"
          >
            <div style="font-size: 14px; font-weight: 400; line-height: 1.8;">
              <strong
                >&#169; 2025
                <a
                  href="https://www.illinois.gov"
                  target="_blank"
                  style="color: #fff; display: inline-block; min-height: 44px; padding: 8px 4px; line-height: 28px;"
                  >State of Illinois</a
                >
              </strong>
              &nbsp;|&nbsp;
              <strong>
                <a
                  href="https://www2.illinois.gov/sites/gov/Pages/default.aspx"
                  target="_blank"
                  style="color: #fff; display: inline-block; min-height: 44px; padding: 8px 4px; line-height: 28px;"
                  >Governor JB Pritzker
                </a>
              </strong>
              &nbsp;|&nbsp;
              <strong>
                <nuxt-link to="/privacy" style="color: #fff; display: inline-block; min-height: 44px; padding: 8px 4px; line-height: 28px;"
                  >Privacy
                </nuxt-link>
              </strong>
              &nbsp;|&nbsp;
              <strong>
                <a
                  href="/docs/accessibility/index.html"
                  style="color: #fff; display: inline-block; min-height: 44px; padding: 8px 4px; line-height: 28px;"
                  >Accessibility
                </a>
              </strong>
              &nbsp;|&nbsp;
              <nuxt-link to="/contact" style="color: #fff; background: none; display: inline-block; min-height: 44px; padding: 8px 4px; line-height: 28px;"
                >Contact</nuxt-link
              >&nbsp;

              <span>
                &nbsp;|&nbsp;
                <nuxt-link
                  style="color: #fff; background: none; cursor: pointer; display: inline-block; min-height: 44px; padding: 8px 4px; line-height: 28px;"
                  class="hover-anchor"
                  to="/translate"
                >
                  Translate
                </nuxt-link>
              </span>
            </div>
          </v-col>
        </v-row>
        <!-- <v-row
            ><v-col class="text-center" @click="scrollTop"
              ><span class="goToTop"> BACK TO TOP </span
              ><v-icon small right style="color: #fff; font-size: 10px"
                >mdi-chevron-up</v-icon
              ></v-col
            ></v-row
          > -->
      </v-container>
    </v-card>
  </v-footer>
</template>

<script>
/**
 * @fileoverview Footer component for the ICJIA R3 Nuxt 3 application.
 *
 * This component provides the site footer with links, contact information,
 * and utility functions like scroll-to-top and translation access.
 * It includes branding and navigation to the main ICJIA website.
 *
 * @component TheFooter
 * @example
 * ```vue
 * <template>
 *   <TheFooter />
 * </template>
 * ```
 *
 * @since 1.0.0
 */
export default {
  setup() {
    /**
     * Scrolls the page to the top.
     * Provides smooth navigation back to the top of the page.
     *
     * @function scrollTop
     * @example
     * ```javascript
     * // Called when "Back to Top" is clicked
     * scrollTop(); // Scrolls to top of page
     * ```
     */
    const scrollTop = () => {
      window.scrollTo(0, 0);
    };

    /**
     * Opens the translation modal.
     * Activates the translation toggle state to show translation options.
     *
     * @function translate
     * @example
     * ```javascript
     * // Called when translate link is clicked in footer
     * translate(); // Shows translation modal
     * ```
     */
    const translate = () => {
      const toggleState = useTranslateToggle();
      toggleState.value = true;
    };

    /**
     * Navigates to the main ICJIA website.
     * Opens the Illinois Criminal Justice Information Authority website in a new tab.
     *
     * @function routeToSite
     * @example
     * ```javascript
     * // Called when ICJIA logo or link is clicked
     * routeToSite(); // Opens https://icjia.illinois.gov in new tab
     * ```
     */
    const routeToSite = () => {
      // open new site in new tab
      window.open("https://icjia.illinois.gov", "_blank");
    };

    return { routeToSite, scrollTop, translate };
  },
};
</script>

<style lang="scss" scoped>
.goToTop {
  margin: 0;
  font-size: 10px;
  color: #fff;
  text-decoration: none;
  background: none;
  cursor: pointer;
}

.goToTop:hover {
  text-decoration: underline;
  color: #aaa;
}
</style>
