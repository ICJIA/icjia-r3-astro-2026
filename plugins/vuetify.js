/**
 * @fileoverview Vuetify plugin configuration for the ICJIA R3 Nuxt 3 application.
 *
 * This plugin initializes and configures Vuetify 3 for use throughout the application.
 * It sets up Material Design components, icons, and SSR support for the UI framework.
 *
 * @plugin vuetify
 * @requires vuetify
 * @since 1.0.0
 */

import { createVuetify } from "vuetify";
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

/**
 * Nuxt plugin that configures and registers Vuetify with the Vue application.
 * Sets up Material Design UI framework with SSR support and icon configuration.
 *
 * @param {Object} nuxtApp - The Nuxt application instance
 * @param {Object} nuxtApp.vueApp - The Vue application instance
 *
 * @example
 * ```javascript
 * // Plugin is automatically loaded by Nuxt
 * // Enables Vuetify components throughout the app:
 * // <v-btn>Button</v-btn>
 * // <v-card>Card content</v-card>
 * ```
 *
 * @since 1.0.0
 */
export default defineNuxtPlugin((nuxtApp) => {
  /**
   * Vuetify instance with application-specific configuration.
   * Configured for server-side rendering and Material Design Icons.
   *
   * @type {Vuetify}
   * @property {boolean} ssr - Enable server-side rendering support
   * @property {Object} icons - Icon configuration
   * @property {string} icons.iconfont - Icon font type (mdiSvg for Material Design Icons SVG)
   */
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
  });

  /**
   * Register Vuetify with the Vue application instance.
   * Makes Vuetify components and functionality available globally.
   */
  nuxtApp.vueApp.use(vuetify);
});
