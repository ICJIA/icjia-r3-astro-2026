<template>
  <div>
    <div v-if="isMounted">
      <v-container fluid class="mb-12"
        ><v-row
          ><v-col>
            <h1>R3 Frequently Asked Questions</h1>
            <v-container
              fluid
              class="fill-height"
              style="width: 98%; margin-top: -50px; margin-bottom: 20px"
            >
              <v-row style="">
                <v-col class="d-flex justify-center"
                  ><div elevation="0" class="px-5 py-5">
                    <ContentDoc
                      :key="data?.title"
                      :value="data"
                      style="color: #000 !important"
                    >
                      <template #empty>Document not found</template>
                      <template #not-found>Document not found</template>
                    </ContentDoc>
                  </div></v-col
                >
              </v-row>
            </v-container>
          </v-col></v-row
        >
      </v-container>
    </div>
    <div
      v-else
      style="
        min-height: 120vh !important;
        background: #fff !important;
        margin-top: -150px;
        margin-bottom: -150px;
        padding-top: 200px;
      "
    >
      <ThePageLoader />
    </div>
    <!--

## FAQ Posting Schedule

FAQs will be posted on a weekly basis. New FAQs will be posted each Friday.

## Questions Submissions

Any questions regarding the current NOFO can be emailed to [CJA.R3Questions@illinois.gov](mailto:CJA.R3Questions@illinois.gov){.white-text}. These questions will be answered via email from that same email account. They will also be collected and posted on this page as described above.

-->
  </div>
</template>

<script setup>
let isMounted = ref(false);
useHead({
  title: "Search Frequently Asked Questions (FAQs)",
});

const { path } = useRoute();
const router = useRouter();

const { data } = await useAsyncData(`content-${path}`, async () => {
  const post = await queryContent().where({ _path: path }).findOne();
  return post;
});

onMounted(() => {
  isMounted.value = true;
});
</script>

<style lang="scss">
h2#faq-posting-schedule,
h2#question-submissions,
h2#questions-submissions {
  color: #fff !important;
}

h3 ~ *:not(h3) {
  margin-left: 15px;
}
</style>
