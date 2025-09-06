<template>
  <div>
    <v-app id="app-top">
      <TheNav></TheNav>

      <!-- <TheNavHome v-if="isHome"></TheNavHome> -->

      <TheSidebar></TheSidebar>
      <!-- <TheTranslationModal v-if="isTranslationEnabled"></TheTranslationModal> -->

      <NuxtLoadingIndicator color="blue" />

      <v-main
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
