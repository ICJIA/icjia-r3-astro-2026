<template>
  <div>
    <v-container fluid style="margin: 0 !important; padding: 0 !important">
      <v-row no-gutters>
        <v-col cols="12" md="4">
          <v-card
            color="#3B5984"
            style="height: 300px"
            class="py-5 px-2 text-center info-card hover"
            :class="{ boxGutter: gutter }"
            @click="click({ id: 'about', type: 'scrollTo' })"
          >
            <v-container fill-height fluid>
              <v-row align="center" justify="center">
                <v-col>
                  <v-icon
                    icon="mdi-menu"
                    style="font-size: 50px; color: #fff"
                    dark
                    >mdi-home</v-icon
                  >
                  <h2 id="aboutUs" class="boxHeader">About Us</h2>
                  <p style="color: #fff; font-size: 20px !important">
                    i2i supports new and emerging localized “grassroots”
                    community organizations.
                  </p></v-col
                >
              </v-row>
            </v-container>
          </v-card></v-col
        >

        <v-col cols="12" md="4">
          <v-card
            color="#10366B"
            style="height: 300px"
            class="py-5 px-2 text-center info-card hover"
            :class="{ boxGutter: gutter }"
            @click="click({ id: 'services', type: 'scrollTo' })"
          >
            <v-container fill-height fluid>
              <v-row align="center" justify="center">
                <v-col>
                  <v-icon
                    icon="mdi-menu"
                    style="font-size: 50px; color: #fff"
                    dark
                    >mdi-pencil-ruler</v-icon
                  >
                  <h2 id="our-approach" class="boxHeader">Our Approach</h2>
                  <p style="color: #fff; font-size: 20px">
                    Find out more about our evidence-informed approach.
                  </p></v-col
                >
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            color="#3B5984"
            style="height: 300px"
            class="py-5 px-2 text-center info-card hover"
            :class="{ boxGutter: gutter }"
            @click="click({ id: 'cohorts', type: 'scrollTo' })"
          >
            <v-container fill-height fluid>
              <v-row align="center" justify="center">
                <v-col>
                  <v-icon
                    icon="mdi-menu"
                    style="font-size: 50px; color: #fff"
                    dark
                    >mdi-account-group</v-icon
                  >
                  <h2 id="cohorts" class="boxHeader">Cohorts</h2>
                  <p style="color: #fff; font-size: 20px !important">
                    Find out who's who.
                  </p></v-col
                >
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
/**
 * @fileoverview Home page feature boxes component for the ICJIA R3 Nuxt 3 application.
 *
 * This component displays a grid of feature boxes on the homepage, providing
 * quick access to key sections and functionality. It supports configurable
 * layouts, smooth scrolling navigation, and responsive design.
 *
 * @component HomeBoxes
 * @example
 * ```vue
 * <template>
 *   <HomeBoxes
 *     :boxes="4"
 *     :secondRow="true"
 *     :showTeaser="true"
 *   />
 * </template>
 * ```
 *
 * @since 1.0.0
 */
export default {
  props: {
    /**
     * Number of boxes to display in the grid.
     * Determines the column layout and responsive behavior.
     *
     * @type {Number}
     * @default 3
     */
    boxes: {
      type: Number,
      default: 3,
    },
    /**
     * Whether to display a second row of boxes.
     * Enables additional content sections below the main boxes.
     *
     * @type {Boolean}
     * @default false
     */
    secondRow: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to apply gutter spacing between boxes.
     * Controls the spacing and visual separation of box elements.
     *
     * @type {Boolean}
     * @default true
     */
    gutter: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether to show teaser content in the boxes.
     * Enables preview or summary content display.
     *
     * @type {Boolean}
     * @default false
     */
    showTeaser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**
       * Color palette for box styling.
       * Provides consistent theming across box elements.
       * Array of hex color codes.
       *
       * @type {Array<string>}
       */
      colors: ["#333", "#555"],
      /**
       * Material Design icons for box decoration.
       * Provides visual indicators for different box types.
       * Array of Material Design icon names.
       *
       * @type {Array<string>}
       */
      icons: ["fact_check", "leaderboard", "map", "contact_mail"],
    };
  },
  computed: {
    /**
     * Calculates the number of columns each box should span.
     * Based on the total number of boxes and 12-column grid system.
     *
     * @returns {number} Number of columns per box (12 divided by number of boxes)
     *
     * @example
     * ```javascript
     * // With 3 boxes: 12 / 3 = 4 columns each
     * // With 4 boxes: 12 / 4 = 3 columns each
     * ```
     */
    boxColumns() {
      return 12 / this.boxes;
    },
  },
  methods: {
    /**
     * Gets the primary color for box styling.
     * Returns the secondary color from the colors array.
     *
     * @returns {string} Hex color code for box styling
     */
    getColor() {
      return this.colors[1];
    },
    /**
     * Handles smooth scrolling to target elements.
     * Provides navigation to specific sections with offset compensation.
     *
     * @param {Object} params - Click parameters
     * @param {string} params.id - Target element ID to scroll to
     * @param {string} params.type - Scroll type ('scrollIntoView' or default)
     *
     * @example
     * ```javascript
     * // Scroll to element with offset
     * click({ id: 'section1', type: 'scroll' });
     *
     * // Scroll into view
     * click({ id: 'section2', type: 'scrollIntoView' });
     * ```
     */
    click({ id, type }) {
      const offset = 100;
      const el = document.getElementById(id);
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      if (type === "scrollIntoView") {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scroll({
          top: y,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style scoped>
/* .boxGutter {
  margin-right: 2px;
  margin-left: 2px;
} */

.boxHeader {
  color: #fff;
  font-weight: 900;
  margin-bottom: 10px;
  font-size: 24px;
}
</style>
