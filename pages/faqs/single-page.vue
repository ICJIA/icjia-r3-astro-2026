<template>
  <div>
    <v-container class="mb-12"
      ><v-row
        ><v-col>
          <h1 class="mx-auto text-left" style="color: #000">
            R3 Frequently Asked Questions
          </h1>

          <v-card
            v-for="(item, index) in faqs"
            :key="index"
            class="mb-5 px-6 py-6"
            elevation="0"
            style="border: 1px solid #ddd"
          >
            <span style="font-size: 12px; font-weight: 700">
              <!-- <span style="text-transform: uppercase; font-weight: 900"
                        >{{ item.category }}&nbsp;|&nbsp;</span
                      > -->
              {{ moment(item.postDate).format("MMMM DD, YYYY") }}
            </span>
            <h3 style="margin-top: 5px; font-weight: 700">{{ item.title }}</h3>

            <div class="px-5">
              <span v-html="renderer.render(item.markdown)"></span>
            </div>
          </v-card> </v-col></v-row
    ></v-container>
    <v-container fluid class="mb-10"
      ><v-row
        ><v-col
          class="text-center"
          style="font-size: 14px; margin-top: -35px !important"
          ><nuxt-link to="/faqs"
            >Back to Interactive FAQs&nbsp;&raquo;</nuxt-link
          >
        </v-col></v-row
      ></v-container
    >
  </div>
</template>

<script setup>
import _ from "lodash";
import moment from "moment";
import md from "markdown-it";
import attrs from "markdown-it-attrs";
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
const { data: faqs } = await useAsyncData(`faqs`, async () => {
  const post = await queryContent("/faqs/").find();
  return post;
});

useHead({
  title: "FAQs (Single Page)",
});

// sort resources by ranking
// const sortedResources = _.orderBy(data.value, ["ranking"], ["asc"]);
</script>
<style lang="scss" scoped></style>
