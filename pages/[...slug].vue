<script setup>
/**
 * @fileoverview Dynamic content page component for the ICJIA R3 Nuxt 3 application.
 *
 * This is a catch-all page component that handles all dynamic content routes.
 * It fetches content based on the URL path and displays it with optional
 * table of contents, breadcrumbs, and responsive layout.
 *
 * @page [...slug]
 * @route /[...slug]
 * @example
 * ```
 * // Matches routes like:
 * // /about
 * // /news/article-title
 * // /resources/funding-guide
 * // /faqs/eligibility
 * ```
 *
 * @since 1.0.0
 */

import moment from "moment";

/**
 * Page metadata configuration.
 * Applies middleware to validate content before rendering.
 */
definePageMeta({
  middleware: ["is-valid-content"],
});

/**
 * Current route path for content fetching.
 * Used to query the appropriate content from the CMS.
 *
 * @type {string}
 */
const { path: rawPath } = useRoute();

/**
 * Normalized path with trailing slash removed.
 * Ensures consistent content queries regardless of URL format.
 *
 * @type {string}
 */
const path =
  rawPath.endsWith("/") && rawPath !== "/" ? rawPath.slice(0, -1) : rawPath;

/**
 * Vue Router instance for programmatic navigation.
 * Used for redirecting to 404 page when content is not found.
 *
 * @type {import('vue-router').Router}
 */
const router = useRouter();

/**
 * Controls visibility of the table of contents component.
 * Determined by content metadata and layout requirements.
 *
 * @type {Ref<boolean>}
 */
const showTOC = ref(false);

/**
 * Number of columns for the main content area.
 * Adjusts based on whether table of contents is shown.
 *
 * @type {Ref<number>}
 */
const cols = ref(12);

// Set TOC layout immediately after data fetch to prevent CLS
// (moved from onMounted to avoid layout shift)

// const error = useError();

/**
 * Content data fetched from the CMS based on the current path.
 * Contains all page content, metadata, and configuration options.
 *
 * @type {Object} Content object with title, body, and metadata
 */
const { data } = await useAsyncData(`content-${path}`, async () => {
  const post = await queryContent().where({ _path: path }).findOne();
  return post;
});

// Set TOC layout from SSR data to prevent CLS
if (data.value?.showTableOfContents) {
  showTOC.value = true;
  cols.value = 9;
}

/**
 * Redirects to the 404 error page.
 * Used when content is not found or an error occurs.
 *
 * @function redirect
 */
const redirect = () => {
  router.push("/404");
};

// SEO Configuration - Dynamic based on content
if (data.value) {
  usePageSeo({
    title: data.value.title || "Page",
    description:
      data.value.description ||
      data.value.summary ||
      "Learn more about the R3 program.",
    path: path,
    type: path.startsWith("/news/") ? "article" : "website",
    article:
      path.startsWith("/news/") && data.value.postDate
        ? {
            publishedTime: data.value.postDate,
            modifiedTime: data.value.updatedAt,
            section: "News",
          }
        : undefined,
  });

  // Add WebPage structured data for standard content pages
  if (!path.startsWith("/news/")) {
    useWebPageSchema({
      name: data.value.title || "Page",
      description:
        data.value.description ||
        data.value.summary ||
        "R3 program information",
      datePublished: data.value.createdAt,
      dateModified: data.value.updatedAt,
    });
  }

  // Add NewsArticle schema for news posts
  if (path.startsWith("/news/") && data.value.postDate) {
    useNewsArticleSchema({
      headline: data.value.title,
      description: data.value.summary || data.value.description || "",
      datePublished: data.value.postDate,
      dateModified: data.value.updatedAt,
      section: "News",
    });
  }

  // Add breadcrumb schema
  const breadcrumbs = [];
  breadcrumbs.push({ name: "Home", url: "/" });

  const pathSegments = path.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    if (pathSegments[0] === "news") {
      breadcrumbs.push({ name: "News", url: "/news" });
      if (pathSegments.length > 1) {
        breadcrumbs.push({ name: data.value.title, url: path });
      }
    } else if (pathSegments[0] === "resources") {
      breadcrumbs.push({ name: "Resources", url: "/resources" });
      if (pathSegments.length > 1) {
        breadcrumbs.push({ name: data.value.title, url: path });
      }
    } else {
      breadcrumbs.push({ name: data.value.title, url: path });
    }
  }

  useBreadcrumbListSchema(breadcrumbs);
}

/**
 * Component lifecycle hook that runs after the component is mounted.
 * Configures the layout based on content metadata, particularly
 * whether to show the table of contents.
 */
// TOC layout is now set during SSR (above) to prevent CLS
</script>

<template>
  <div>
    <div v-if="data.isFullPage">
      <ContentDoc :key="data?.title" :value="data" class="markdown-body">
        <template #empty>Document not found</template>
        <template #not-found>Document not found</template>
      </ContentDoc>
    </div>
    <div v-else>
      <v-container fluid
        ><v-row
          ><v-col cols="12" :md="cols">
            <div v-if="data" class="mt-6">
              <h1>{{ data.title }}</h1>
              <ContentDoc
                :key="data?.title"
                :value="data"
                class="markdown-body"
              >
                <template #empty>Document not found</template>
                <template #not-found>Document not found</template>
              </ContentDoc>
            </div>
            <!-- <div v-else>{{ redirect() }}</div> -->
          </v-col>

          <v-col
            v-if="showTOC"
            cols="12"
            md="3"
            style="
              min-height: 110vh !important;
              background: #fafafa;
              margin-top: -4px;
              margin-bottom: -50px;
              border-left: 1px solid #e9e9e9;
            "
            class="hidden-sm-and-down"
          >
            <!-- TOC HERE -->
            <TheTableOfContents :data="data.body.toc" class="toc" />
          </v-col> </v-row
      ></v-container>

      <v-container
        fluid
        style="margin-top: -15px"
        v-if="path === '/board'"
        class="hidden-sm-and-down"
        ><v-row
          ><v-col
            ><div
              class="mb-12 d-flex align-center"
              style="font-size: 12px; font-weight: 700"
            >
              <!-- <a
                href="https://govappointments.illinois.gov/boardsandcommissions/details/?id=2516cb5e-2007-ee11-8f6d-001dd8068008"
                target="_blank"
                >https://govappointments.illinois.gov/boardsandcommissions</a
              > -->
              <v-spacer></v-spacer>
              <span class="">
                This page last updated:&nbsp;{{
                  moment(data.updatedAt).fromNow()
                }}</span
              >
            </div></v-col
          ></v-row
        ></v-container
      >
    </div>
  </div>
</template>
