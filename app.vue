<template>
  <!-- Skip Navigation Links for Accessibility -->
  <nav aria-label="Skip navigation" class="skip-links">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>
  </nav>

  <v-app id="app-top">
    <TheNav></TheNav>

    <!-- <TheNavHome v-if="isHome"></TheNavHome> -->

    <TheSidebar></TheSidebar>
    <!-- <TheTranslationModal v-if="isTranslationEnabled"></TheTranslationModal> -->

    <NuxtLoadingIndicator color="blue" />

    <v-main
      id="main-content"
      role="main"
      tabindex="-1"
      class="markdown-body"
      style="min-height: 100vh"
    >
      <!-- <TheBreadcrumbBar
        v-if="!hideBreadcrumbBar"
        :key="routePath"
      ></TheBreadcrumbBar> -->

      <NuxtPage></NuxtPage>
    </v-main>

    <TheFooter v-if="isMounted"></TheFooter>

    <v-layout-item
      model-value
      position="bottom"
      class="text-end"
      size="88"
      v-if="isMounted"
    >
      <div class="ma-4">
        <v-btn
          icon="mdi-menu-up"
          size="large"
          color="primary"
          elevation="8"
          @click.stop.prevent="scrollToTop()"
          style="z-index: 0; font-size: 20px"
          aria-label="Scroll to top of page"
        >
        </v-btn>
      </div>
    </v-layout-item>
  </v-app>
</template>

<script setup>
// const { isTranslationEnabled } = useAppConfig();
const isHome = ref(true);
const hideBreadcrumbBar = ref(false);
const route = useRoute();

// Normalize path by removing trailing slash for consistent comparisons
const normalizePath = (p) =>
  p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;

const routePath = ref(normalizePath(route.path));
watchEffect(() => {
  const normalizedPath = normalizePath(route.path);
  routePath.value = normalizedPath;

  if (
    normalizedPath === "/" ||
    normalizedPath === "/sandbox" ||
    normalizedPath === "/faqs"
  ) {
    hideBreadcrumbBar.value = true;
  } else {
    hideBreadcrumbBar.value = false;
  }
});

useHead({
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.ico",
    },
  ],
  meta: [
    // { name: "og:url", content: fullPath.value },
    {
      hid: "og-image",
      property: "og:image",
      content: "https://r3.illinois.gov/icjia-logo.png",
    },
    {
      hid: "og-image-width",
      property: "og:image:width",
      content: "1200",
    },
    {
      hid: "og-image-height",
      property: "og:image:height",
      content: "630",
    },
  ],
  htmlAttrs: {
    lang: "en",
  },
});

// const page = useCurrentPage({ slug: "slug-here" });
// console.log(page);

let isMounted = ref(false);
const scrollToTop = () => {
  if (!isMounted.value) {
    return;
  }
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  isMounted.value = true;
});

// Load Hub tags into global state
import tagMeta from "~/src/tags.json";
const tags = useState("tags", () => tagMeta);
</script>
<style>
/* Main content background */
.v-main {
  background: #f2f2f2;
}

/* Skip Links for Accessibility */
.skip-links {
  position: relative;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: #000000 !important; /* Black background for maximum contrast with white text */
  color: #ffffff !important; /* White text for WCAG AAA compliance (21:1 contrast ratio) */
  padding: 12px 16px;
  text-decoration: none !important;
  border-radius: 0 0 4px 4px;
  font-weight: 700;
  font-size: 16px;
  z-index: 10000;
  transition: top 0.2s ease;
  /* Hide skip links by default - only show when keyboard focused */
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  width: auto;
  white-space: nowrap;
}

/* Show skip link when focused via keyboard */
.skip-link:focus-visible {
  top: 0;
  clip: auto;
  clip-path: none;
  outline: 3px solid #ffffff;
  outline-offset: 2px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  background: #000000 !important; /* Black background for maximum contrast */
  color: #ffffff !important; /* White text */
}

/* Fallback for browsers that don't support :focus-visible */
.skip-link:focus {
  top: 0;
  clip: auto;
  clip-path: none;
  outline: 3px solid #ffffff;
  outline-offset: 2px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  background: #000000 !important; /* Black background for maximum contrast */
  color: #ffffff !important; /* White text */
}

/* Hide when focused but not via keyboard (mouse clicks) */
.skip-link:focus:not(:focus-visible) {
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  top: -100px;
}

.skip-link:hover {
  background: #333333 !important; /* Slightly lighter on hover, still high contrast */
  color: #ffffff !important;
  text-decoration: underline !important;
}

.skip-link:visited {
  color: #ffffff !important; /* Keep white even when visited */
}

.page-enter-active,
.page-leave-active {
  transition: all 0.01s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
