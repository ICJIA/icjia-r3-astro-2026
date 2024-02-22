<script setup>
import moment from "moment";
definePageMeta({
  middleware: ["is-valid-content"],
});
const { path } = useRoute();
const router = useRouter();

const showTOC = ref(false);
const cols = ref(12);

// const error = useError();
const { data } = await useAsyncData(`content-${path}`, async () => {
  const post = await queryContent().where({ _path: path }).findOne();
  return post;
});
const redirect = () => {
  router.push("/404");
};

onMounted(async () => {
  await nextTick();
  await nextTick();
  if (data.value.showTableOfContents) {
    showTOC.value = true;
    cols.value = 9;
    console.log("showTOC", showTOC.value);
  }
  // $("table").attr("id", "board");
});
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
