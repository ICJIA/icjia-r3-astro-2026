<template>
  <div>
    <v-container class="mb-12"
      ><v-row
        ><v-col>
          <h1 class="mx-auto text-left" style="color: #000">R3 Resources</h1>
          <div v-for="(item, index) in sortedResources" :key="item._id">
            <v-card class="mx-auto my-5 px-8 py-4" elevation="0"
              ><h2>{{ item.title }}</h2>
              <div class="px-5">
                <span v-html="renderer.render(item.markdown)"></span></div
            ></v-card>
          </div> </v-col></v-row
    ></v-container>
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
const { data: resources } = await useAsyncData(`resources`, async () => {
  const post = await queryContent("/resources").find();
  return post;
});

useHead({
  title: "Resources (Mobile)",
});

// sort resources by ranking
const sortedResources = _.orderBy(resources.value, ["ranking"], ["asc"]);
</script>

<style lang="scss" scoped></style>
