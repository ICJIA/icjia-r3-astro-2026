<template>
  <div class="mb-10">
    <v-container
      ><v-row
        ><v-col cols="12">
          <div>
            <h1>R3 Frequently Asked Questions</h1>

            <div v-for="item in faqs" :key="item.title">
              <h2 class="mt-12">{{ item.title }}</h2>
              <!-- <attachments
                :attachments="item.attachment.data"
                attachmentHeading="FAQ Downloads"
                class="mt-6"
              /> -->
              <div class="px-5 mt-4">
                <span v-html="renderer.render(item.markdown)"></span>
              </div>
            </div>
          </div> </v-col></v-row
    ></v-container>
  </div>
</template>

<script setup>
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

import _ from "lodash";
import moment from "moment";
// definePageMeta({
//   middleware: ["is-valid-content"],
// });

useHead({
  title: "Frequently Asked Questions",
});
const { path } = useRoute();
const router = useRouter();

// const error = useError();
const { data: faqs } = await useAsyncData(`faqs-${path}`, async () => {
  const post = await queryContent("/faqs").find();
  return post;
});

const sortedFaqs = _.orderBy(faqs.value, ["postDate"], ["desc"]);

const redirect = () => {
  router.push("/404");
};

const routeToNews = (path) => {
  router.push(path);
};

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};
</script>
