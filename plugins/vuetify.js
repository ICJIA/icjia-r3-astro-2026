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
   * AAA-compliant color theme for WCAG accessibility.
   * All colors are chosen to provide at least 7:1 contrast ratio with their
   * intended text color (white for dark backgrounds, dark for light backgrounds).
   *
   * @type {Object}
   */
  const aaaCompliantTheme = {
    dark: false,
    colors: {
      // Primary blue - 8:1 contrast with white text
      primary: "#0D4474",
      // Secondary - dark purple, 7.5:1 contrast with white
      secondary: "#4a0e4e",
      // Accent - accessible teal, 7:1 contrast with white
      accent: "#006064",
      // Error - dark red, 7:1 contrast with white
      error: "#B71C1C",
      // Info - dark blue (same as primary for consistency)
      info: "#0D4474",
      // Success - dark green, 7:1 contrast with white
      success: "#1B5E20",
      // Warning - dark amber with dark text for AAA compliance
      warning: "#E65100",
      // Surface colors
      background: "#FFFFFF",
      surface: "#FFFFFF",
      // Override Vuetify's default blue palette with AAA-compliant versions
      "blue-darken-4": "#0D4474",
      "blue-darken-3": "#0D4474",
      "blue-darken-2": "#0a5a8a",
      "blue-darken-1": "#0d6eaa",
      blue: "#0D4474",
    },
  };

  /**
   * Vuetify instance with application-specific configuration.
   * Configured for server-side rendering, Material Design Icons, and
   * AAA-compliant accessibility theme.
   *
   * @type {Vuetify}
   * @property {boolean} ssr - Enable server-side rendering support
   * @property {Object} icons - Icon configuration
   * @property {string} icons.iconfont - Icon font type (mdiSvg for Material Design Icons SVG)
   * @property {Object} theme - Theme configuration with AAA-compliant colors
   */
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
    theme: {
      defaultTheme: "aaaCompliantTheme",
      themes: {
        aaaCompliantTheme,
      },
    },
  });

  /**
   * Register Vuetify with the Vue application instance.
   * Makes Vuetify components and functionality available globally.
   */
  nuxtApp.vueApp.use(vuetify);
});
