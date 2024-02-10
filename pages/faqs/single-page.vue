<template>
  <div>{{ sortedResources }}</div>
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
const { data } = await useAsyncData(`faqs`, async () => {
  const post = await queryContent("/faqs/").find();
  return post;
});

useHead({
  title: "FAQs (Single Page)",
});

// sort resources by ranking
const sortedResources = _.orderBy(data.value, ["ranking"], ["asc"]);
</script>
<style lang="scss" scoped></style>
