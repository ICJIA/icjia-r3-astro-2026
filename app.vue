<template>
  <div>
    <!-- Skip Navigation Links for Accessibility -->
    <div class="skip-links">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    </div>

    <v-app id="app-top">
      <TheNav></TheNav>

      <!-- <TheNavHome v-if="isHome"></TheNavHome> -->

      <TheSidebar></TheSidebar>
      <!-- <TheTranslationModal v-if="isTranslationEnabled"></TheTranslationModal> -->

      <NuxtLoadingIndicator color="blue" />

      <v-main
        id="main-content"
        role="main"
        class="markdown-body"
        style="min-height: 80vh !important; background: #f2f2f2"
      >
        <!-- <TheBreadcrumbBar
          v-if="!hideBreadcrumbBar"
          :key="routePath"
        ></TheBreadcrumbBar> -->

        <NuxtPage></NuxtPage>
      </v-main>

      <TheFooter v-if="isMounted" style="margin-top: -88px"></TheFooter>

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
  </div>
</template>

<script setup>
// const { isTranslationEnabled } = useAppConfig();
const isHome = ref(true);
const hideBreadcrumbBar = ref(false);
const route = useRoute();
const routePath = ref(route.path);
watchEffect(() => {
  routePath.value = route.path;
  console.log("route.path from app.vue: ", routePath.value);

  if (
    route.path === "/" ||
    route.path === "/sandbox" ||
    route.path === "/faqs"
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
  console.log("isMounted: ", isMounted);
});

// Load Hub tags into global state
import tagMeta from "~/src/tags.json";
const tags = useState("tags", () => tagMeta);
</script>
<style>
/* Skip Links for Accessibility */
.skip-links {
  position: relative;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
  font-weight: 600;
  font-size: 14px;
  z-index: 10000;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 6px;
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.skip-link:hover {
  background: #333;
  text-decoration: underline;
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
