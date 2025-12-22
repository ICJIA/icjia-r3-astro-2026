import vuetify from "vite-plugin-vuetify";
import siteRoutes from "./public/appRoutes.json";

// const siteRoutes = [...newsRoutes, ...pageRoutes];

// console.log("Generated routes:", siteRoutes);

export default defineNuxtConfig({
  // Nuxt 4 Directory Structure Configuration
  // Explicitly configure directory locations for clarity
  // Note: Using root-level directories for backward compatibility
  // while following Nuxt 4 conventions
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
    // pageTransition: { name: "page", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "en" },
      // title: "Institute to Innovate",
      titleTemplate: "R3 | %s ",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "R3 Description here",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.css",
        },
      ],
      script: [
        {
          src: "https://code.jquery.com/jquery-3.7.1.slim.min.js",
          type: "text/javascript",
        },
        {
          src: "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.js",
          type: "text/javascript",
        },
        {
          src: "https://cdn.jsdelivr.net/mark.js/8.6.0/mark.min.js",
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

  // Enforce consistent trailing slash behavior (no trailing slashes)
  // This prevents 404s when URLs are pasted with/without trailing slashes
  router: {
    options: {
      strict: false, // Allows matching routes regardless of trailing slash
    },
  },

  vite: {
    // See: https://github.com/nuxt/nuxt/issues/24196
    optimizeDeps: {
      include: ["axios", "moment", "dompurify", "fuse.js", "lodash"],
    },
  },

  routeRules: {
    // // Homepage pre-rendered at build time
    // '/': { prerender: true },
    // // Products page generated on demand, revalidates in background, cached until API response changes
    // '/products': { swr: true },
    // // Product page generated on demand, revalidates in background, cached for 1 hour (3600 seconds)
    // '/products/**': { swr: 3600 },
    // // Blog posts page generated on demand, revalidates in background, cached on CDN for 1 hour (3600 seconds)
    // '/blog': { isr: 3600 },
    // // Blog post page generated on demand once until next deployment, cached on CDN
    // '/blog/**': { isr: true },
    // // Admin dashboard renders only on client-side
    // '/admin/**': { ssr: false },
    // // Add cors headers on API routes
    // '/api/**': { cors: true },
    // Redirects legacy urls
    "/downloads/**": { redirect: "/" },
    "/apply": { redirect: "/funding" },
    "/faqs/2025-r3-nofo-applicant-questions": {
      redirect: "/faqs/03-08-24-2025-r3-nofo-applicant-questions",
    },
  },

  runtimeConfig: {
    // The private keys which are only available within server-side
    // apiSecret: "123",
    // Keys within public, will be also exposed to the client-side
    private: {},
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE_URL ||
        "ERROR: no api base url specified",
      siteBase:
        process.env.NUXT_PUBLIC_BASE_URL || "ERROR: no site base url specified",
    },
  },

  modules: [
    "@nuxtjs/google-fonts",
    // "@nuxtjs/apollo",
    // "@pinia/nuxt", // Removed - using Nuxt 3 native state management
    // "@nuxt/image-edge",
    "@vueuse/nuxt",
    "@nuxt/content",
    // "nuxt-security",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (options, nuxt) => {
      await nuxt.hooks.hook("vite:extendConfig", (config) => {
        // console.log(config);
        config?.plugins?.push(vuetify());
      });
    },
  ],
  // imports: {
  //   dirs: ["stores"], // Removed - no longer using Pinia stores
  // },

  // pinia: {
  //   autoImports: ["defineStore", "acceptHMRUpdate"],
  //   storesDirs: ["./stores/**"],
  // }, // Removed - using Nuxt 3 native state management
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
  // security: {
  //   headers: {
  //     contentSecurityPolicy: {
  //       "img-src": ["https://r3.icjia-api.cloud"],
  //       "script-src": [
  //         "https://r3.icjia-api.cloud",
  //         "https://code.jquery.com/",
  //         "https://cdn.datatables.net",
  //       ],
  //       "link-src": [
  //         "https://r3.icjia-api.cloud",
  //         "https://code.jquery.com/",
  //         "https://cdn.datatables.net",
  //       ],
  //     },
  //   },
  // },
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

  // image: {
  //   // The screen sizes predefined by `@nuxt/image`:
  //   screens: {
  //     xs: 320,
  //     sm: 640,
  //     md: 768,
  //     lg: 1024,
  //     xl: 1280,
  //     xxl: 1536,
  //     "2xl": 1536,
  //   },
  // },

  // Force static site generation
  ssr: true,

  // Experimental features for better static generation
  experimental: {
    // Ensure payload data is properly extracted and embedded in static pages
    payloadExtraction: true,
  },

  nitro: {
    preset: "static",
    prerender: {
      routes: siteRoutes,
      // Crawl links to ensure all content API routes are pre-rendered
      crawlLinks: true,
    },
  },

  generate: {
    routes: siteRoutes,
  },
  devtools: {
    enabled: false,

    timeline: {
      enabled: false,
    },
  },
});
