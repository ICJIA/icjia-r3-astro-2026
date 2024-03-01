<template>
  <div>
    <v-container
      ><v-row
        ><v-col>
          <div class="pl-3 mt-5 mb-2">
            &laquo;&nbsp;<nuxt-link to="/faqs">Back to all R3 FAQs</nuxt-link>
          </div>
          <v-card v-if="isMounted && data?.title" class="mt-5 px-10 py-5">
            <h2>{{ data.title }}</h2>

            <div v-html="md.render(data.markdown)"></div>

            <div
              class="text-right"
              style="font-size: 13px; font-weight: 700; margin-top: 60px"
              v-if="isItUpdated(data)"
            >
              <span style="font-weight: 700">
                {{ moment(data.postDate).format("MMMM DD,  YYYY h:mm a") }}
              </span>

              <span style="font-weight: 700">
                | Updated
                {{
                  moment(data.updatedAt).format("MMMM DD,  YYYY h:mm a")
                }}</span
              >
            </div>
            <div
              v-else
              class="text-right"
              style="font-size: 13px; font-weight: 700; margin-top: 60px"
            >
              <span style="font-weight: 700">
                Posted {{ moment(data.postDate).format("MMMM DD,  YYYY") }}
              </span>
            </div>
          </v-card>

          <div v-else>
            <ThePageLoader></ThePageLoader>
          </div> </v-col></v-row
    ></v-container>
  </div>
</template>

<script setup>
import moment from "moment";
import markdownit from "markdown-it";
const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
});

definePageMeta({
  middleware: ["is-valid-content"],
});
let isMounted = ref(false);

useHead({
  title: "FAQs",
});

const { path } = useRoute();
const router = useRouter();

const { data } = await useAsyncData(`faq-${path}`, async () => {
  const post = await queryContent().where({ _path: path }).findOne();
  return post;
});

onMounted(() => {
  isMounted.value = true;
});

const isItUpdated = ({ publishedAt, updatedAt, postDate }) => {
  let published = moment(postDate);
  let updated = moment(updatedAt);

  const diffTime = Math.abs(updated - published);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return true;
  } else {
    return false;
  }
};
</script>

<style lang="scss" scoped></style>
