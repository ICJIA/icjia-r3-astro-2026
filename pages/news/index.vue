<template>
  <div class="mb-10">
    <TheBreadcrumbBar></TheBreadcrumbBar>
    <v-container fluid
      ><v-row
        ><v-col cols="12">
          <h1>News and Updates</h1>

          <v-container v-if="news" class="">
            <v-row
              ><v-col>
                <v-card
                  v-for="(item, index) in sortedNews"
                  :key="index"
                  style="background: #fafafa"
                  class="px-5 py-10 my-10 info-card"
                  @click="routeToNews(item.path)"
                >
                  <div style="font-size: 14px; font-weight: 900">
                    {{ moment(item.postDate).utc().format("MMM DD, YYYY") }}
                  </div>
                  <h2 class="mt-5">{{ item.title }}</h2>
                  <div class="mt-8">{{ item.summary }}</div>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn size="small" :to="item.path"
                      >Read more&nbsp;&raquo;</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col></v-row
            >
          </v-container>
        </v-col></v-row
      ></v-container
    >
  </div>
</template>

<script setup>
import _ from "lodash";
import moment from "moment";
// definePageMeta({
//   middleware: ["is-valid-content"],
// });
useHead({
  title: "News and Updates",
});
const { path } = useRoute();
const router = useRouter();

// const error = useError();
const { data: news } = await useAsyncData(`news-${path}`, async () => {
  const post = await queryContent("/news").find();
  return post;
});

const sortedNews = _.orderBy(news.value, ["postDate"], ["desc"]);

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

<style lang="scss" scoped></style>
