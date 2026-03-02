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
      <!-- Reviewer Recruitment Banner -->
      <div
        class="reviewer-banner"
        role="region"
        aria-label="Grant reviewer recruitment announcement"
      >
        <a
          href="https://r3.illinois.gov/eligibility"
          target="_blank"
          rel="noopener noreferrer"
          class="banner-link"
          aria-label="Banner Notice."
        >
          <v-icon color="white" aria-hidden="true" class="mr-3"
            >mdi-car-brake-alert</v-icon
          >
          <strong>March 2, 2026:</strong>&nbsp;<strong
            >We are aware of an issue with the Service Area Selector tool and
            are currently working to address it.</strong
          >
          <v-icon size="small" class="ml-2" aria-hidden="true" color="white"
            >mdi-open-in-new</v-icon
          >
        </a>
      </div>

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

// Reviewer recruitment banner URL
const reviewerFormUrl =
  "https://forms.office.com/pages/responsepage.aspx?id=nwgia7qOPEaE9TFxIQ-QBbUUzlNyrrlPuEf42By_l3NUOEU1M0laS042VFk3VTlUVjE2NzhCVTA2Ny4u&route=shorturl";

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

// Apply site-wide SEO configuration
useSiteSeo();

// Add organization structured data for the site
useGovernmentOrganizationSchema();

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

/* Reviewer Recruitment Banner */
.reviewer-banner {
  z-index: 10;
  position: relative;
  min-height: 70px;
  width: 100%;
  background-color: #c62828; /* red-darken-2 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px 24px;
}

.reviewer-banner .banner-link {
  color: #ffffff !important;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s ease;
  font-weight: 600;
  font-size: 1.15rem;
  min-height: 44px;
  padding: 12px 16px;
}

.reviewer-banner .banner-link strong {
  font-weight: 700;
  font-size: 1.15rem;
}

.reviewer-banner :deep(.v-icon) {
  font-size: 1.5rem;
}

.reviewer-banner .banner-link:hover {
  opacity: 0.9;
  text-decoration: underline;
}

.reviewer-banner .banner-link:focus {
  outline: 3px solid #ffffff;
  outline-offset: 3px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.reviewer-banner .banner-link:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 3px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
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
