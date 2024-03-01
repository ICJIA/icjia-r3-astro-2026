<template>
  <div class="mb-10">
    <v-container
      ><v-row
        ><v-col cols="12">
          <div>
            <h1>R3 Frequently Asked Questions</h1>
            <div v-for="item in faqs" :key="`faq-${item.title}`" class="pl-0">
              <h2 class="mt-12">{{ item.title }}</h2>
              <div class="px-5">
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

<style scoped>
h2#faq-posting-schedule,
h2#question-submissions,
h2#questions-submissions {
  color: #fff !important;
}

h3 ~ *:not(h3) {
  margin-left: 15px;
}
</style>
