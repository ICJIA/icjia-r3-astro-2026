/**
 * @fileoverview Nuxt configuration file for the ICJIA R3 Nuxt 3 application.
 * This file contains the main Nuxt 4 configuration including directory structure,
 * modules, plugins, build settings, and route rules.
 *
 * NOTE: This file cannot import from custom modules like config.js because
 * Nuxt transforms imports during build. Values are inlined here.
 * Keep these values in sync with config.js!
 *
 * @config nuxt.config.js
 * @requires vite-plugin-vuetify - Vuetify plugin for Vite
 * @since 1.0.0
 */

import vuetify from "vite-plugin-vuetify";
import siteRoutes from "./public/appRoutes.json";

/**
 * Static configuration values (duplicated from config.js for Nuxt build)
 * Keep these in sync with config.js!
 */
const CONFIG = {
  site: {
    url: "https://r3.illinois.gov",
  },
  api: {
    base: "https://r3.icjia-api.cloud",
  },
  analytics: {
    plausibleHost: "https://plausible.icjia.cloud",
    plausibleDomain: "r3.illinois.gov",
  },
  external: {
    cdn: {
      jquery: "https://code.jquery.com/jquery-3.7.1.slim.min.js",
      datatables: "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.js",
      markJs: "https://cdn.jsdelivr.net/mark.js/8.6.0/mark.min.js",
      datatablesCSS: "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.css",
    },
  },
  features: {
    enableDevtools: false,
  },
};

/**
 * Nuxt configuration object.
 * Defines all application settings, modules, plugins, and build configuration.
 *
 * @type {NuxtConfig}
 */
export default defineNuxtConfig({
  dir: {
    pages: "pages",
    components: "components",
    composables: "composables",
    middleware: "middleware",
    plugins: "plugins",
    assets: "assets",
    public: "public",
    server: "server",
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "en" },
      titleTemplate: "R3 | %s ",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment through grants supporting reentry, economic development, civil legal aid, youth development, and violence prevention.",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: CONFIG.external.cdn.datatablesCSS,
        },
      ],
      script: [
        {
          src: CONFIG.external.cdn.jquery,
          type: "text/javascript",
        },
        {
          src: CONFIG.external.cdn.datatables,
          type: "text/javascript",
        },
        {
          src: CONFIG.external.cdn.markJs,
          type: "text/javascript",
        },
      ],
    },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "~/assets/css/variables.scss",
    "~/assets/css/app.css",
    "~/assets/css/github-markdown.css",
  ],
  build: {
    transpile: ["vuetify"],
  },

  router: {
    options: {
      strict: false,
    },
  },

  vite: {
    optimizeDeps: {
      include: ["axios", "moment", "dompurify", "fuse.js", "lodash"],
    },
  },

  routeRules: {
    "/downloads/**": { redirect: "/" },
    "/apply": { redirect: "/funding" },
    "/faqs/2025-r3-nofo-applicant-questions": {
      redirect: "/faqs/03-08-24-2025-r3-nofo-applicant-questions",
    },
  },

  runtimeConfig: {
    private: {},
    public: {
      apiBase: CONFIG.api.base,
      siteBase: CONFIG.site.url,
    },
  },

  modules: [
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@nuxt/content",
    async (options, nuxt) => {
      await nuxt.hooks.hook("vite:extendConfig", (config) => {
        config?.plugins?.push(vuetify());
      });
    },
    "@nuxtjs/plausible",
  ],
  content: {
    documentDriven: false,
    markdown: {
      mdc: true,
      anchorLinks: {
        depth: 0,
        exclude: [1, 2, 3, 4, 5, 6],
      },
    },
  },
  googleFonts: {
    inject: true,
    download: true,
    display: "swap",
    prefetch: true,
    families: {
      Roboto: {
        wght: [100, 400, 700, 900],
        ital: [100, 400],
      },
      Lato: {
        wght: [100, 300, 400, 700, 900],
        ital: [100, 400],
      },
      Raleway: {
        wght: [100, 400, 900],
        ital: [100, 400],
      },
    },
  },

  plausible: {
    apiHost: CONFIG.analytics.plausibleHost,
    domain: CONFIG.analytics.plausibleDomain,
    ignoredHostnames: ["localhost"],
    autoOutboundTracking: true,
  },

  ssr: true,

  experimental: {
    payloadExtraction: true,
  },

  nitro: {
    preset: "static",
    prerender: {
      routes: siteRoutes,
      crawlLinks: true,
      ignore: ["/docs", "/docs/**"],
    },
  },

  generate: {
    routes: siteRoutes,
  },
  devtools: {
    enabled: CONFIG.features.enableDevtools,
    timeline: {
      enabled: CONFIG.features.enableDevtools,
    },
  },
});
