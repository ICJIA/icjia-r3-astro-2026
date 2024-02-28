import vuetify from "vite-plugin-vuetify";
import siteRoutes from "./public/appRoutes.json";

// const siteRoutes = [...newsRoutes, ...pageRoutes];

// console.log("Generated routes:", siteRoutes);

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
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
        // {
        //   src: "https://plausible.icjia.cloud/js/script.tagged-events.outbound-links.js",
        //   "data-domain": "r3.illinois.gov",
        //   defer: true,
        // },
        // {
        //   src: "plausibleEvents.js",
        // },
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

  vite: {
    // See: https://github.com/nuxt/nuxt/issues/24196
    optimizeDeps: {
      include: ["axios", "moment", "dompurify", "fuse.js", "lodash"],
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
    "nuxt-gtag",
    "@nuxtjs/plausible",
    // "@nuxtjs/apollo",
    "@pinia/nuxt",
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
  imports: {
    dirs: ["stores"],
  },
  gtag: {
    id: "G-G7XDWC7WPG",
  },
  plausible: {
    apiHost: "https://plausible.icjia.cloud",
    // Prevent tracking on localhost
    ignoredHostnames: ["localhost"],
  },
  pinia: {
    autoImports: ["defineStore", "acceptHMRUpdate"],
    storesDirs: ["./stores/**"],
  },
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

  generate: {
    routes: siteRoutes,
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
});
