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
    cdn: {},
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
          content:
            "The R3 (Restore, Reinvest, and Renew) program invests in communities most affected by systemic racism and disinvestment through grants supporting reentry, economic development, civil legal aid, youth development, and violence prevention.",
        },
        {
          name: "author",
          content:
            "Illinois Criminal Justice Information Authority (ICJIA)",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
      ],
      script: [],
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
    "@nuxtjs/sitemap",
    // "@nuxtjs/robots",
    "@nuxt/image",
    async (options, nuxt) => {
      await nuxt.hooks.hook("vite:extendConfig", (config) => {
        config?.plugins?.push(vuetify());
      });
    },
    "@nuxtjs/plausible",
  ],
  image: {
    domains: ["r3.icjia-api.cloud", "researchhub.icjia-api.cloud"],
    format: ["webp", "avif", "jpeg", "png"],
  },
  site: {
    url: CONFIG.site.url,
    name: "R3 - Restore, Reinvest, Renew",
  },
  sitemap: {
    strictNuxtContentAds: true,
    exclude: ["/docs/**", "/preview/**", "/sandbox"],
  },
  // robots module disabled — using static public/robots.txt instead
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
