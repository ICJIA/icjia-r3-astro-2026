<template>
  <div>
    <v-container class="mb-12"
      ><v-row
        ><v-col>
          <h1 class="mx-auto text-left" style="color: #000">
            R3 Resources (Single Page)
          </h1>
          <div v-for="(item, index) in sortedResources" :key="item._id">
            <v-card
              class="mx-auto my-5 px-8 py-4"
              elevation="0"
              style="border: 1px solid #ccc"
              ><h2>{{ item.title }}</h2>
              <div class="px-5">
                <span v-html="sanitize(renderer.render(item.markdown))"></span></div
            ></v-card>
          </div> </v-col></v-row
    ></v-container>
    <!-- <v-container fluid class="mb-10"
      ><v-row
        ><v-col
          class="text-center"
          style="font-size: 14px; margin-top: -35px !important"
          ><nuxt-link to="/resources"
            >Show all R3 resources on multiple pages&nbsp;&raquo;</nuxt-link
          >
        </v-col></v-row
      ></v-container
    > -->
  </div>
</template>

<script setup>
import _ from "lodash";
import moment from "moment";
import md from "markdown-it";
import attrs from "markdown-it-attrs";

const DOMPurify = import.meta.client
  ? (await import("dompurify")).default
  : null;
const purifyConfig = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["allowfullscreen", "frameborder", "allow", "loading", "title"],
};
const sanitize = (html) =>
  DOMPurify ? DOMPurify.sanitize(html, purifyConfig) : html;
const renderer = new md({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
}).use(attrs);
const { path } = useRoute();
const router = useRouter();
const { data: resources } = await useAsyncData(`resources`, async () => {
  const post = await queryContent("/resources").find();
  return post;
});

useHead({
  title: "Resources (Single Page)",
});

// sort resources by ranking
const sortedResources = _.orderBy(resources.value, ["ranking"], ["asc"]);
</script>

<style lang="scss" scoped>
/* AAA Target Size (2.5.5) - Ensure all links in rendered markdown meet 44x44px */
/* Using :deep() to target v-html rendered content */
:deep(a) {
  display: inline-block !important;
  min-height: 44px !important;
  min-width: 44px !important;
  padding: 10px 14px !important;
  line-height: 1.5 !important;
  box-sizing: border-box !important;
  vertical-align: middle !important;
  text-align: center !important;
}

/* For inline links within paragraphs, lists, tables */
:deep(p a),
:deep(li a),
:deep(td a),
:deep(th a),
:deep(blockquote a) {
  display: inline-block !important;
  min-height: 44px !important;
  min-width: 44px !important;
  padding: 10px 14px !important;
  margin: -10px -14px !important;
  line-height: 1.5 !important;
  vertical-align: baseline !important;
  box-sizing: border-box !important;
}

/* Ensure all links have proper focus indicators */
:deep(a:focus-visible) {
  outline: 3px solid #0d4474 !important;
  outline-offset: 2px !important;
  border-radius: 2px !important;
}

/* Maintain underline for links */
:deep(a) {
  text-decoration: underline !important;
}

:deep(a:hover) {
  text-decoration: underline !important;
}
</style>
