<script setup>
import moment from "moment";
definePageMeta({
  middleware: ["is-valid-content"],
});

const { path: rawPath } = useRoute();
const router = useRouter();

// Normalize path by removing trailing slash
const path =
  rawPath.endsWith("/") && rawPath !== "/" ? rawPath.slice(0, -1) : rawPath;

// const error = useError();
const showTOC = ref(false);
const cols = ref(12);

const { data } = await useAsyncData(`resource-${path}`, async () => {
  const item = await queryContent().where({ _path: path }).findOne();
  return item;
});

onMounted(() => {
  if (data.value.showTableOfContents) {
    showTOC.value = true;
    cols.value = 9;
  }
});
</script>

<template>
  <div>
    <TheBreadcrumbBar></TheBreadcrumbBar>
    <div v-if="data">
      <v-container class="mt-12"
        ><v-row
          ><v-col cols="12" :md="cols">
            <v-card class="px-10 pt-8 pb-12">
              <h1 style="margin-top: 5px">{{ data.title }}</h1>
              <ContentDoc
                :key="data?.title"
                :value="data"
                class="markdown-body"
              >
                <template #empty>Document not found</template>
                <template #not-found>Document not found</template>
              </ContentDoc>
              <!-- <v-container fluid
                ><v-row
                  ><v-col
                    class="text-right"
                    style="font-size: 12px; margin-top: 80px !important"
                    ><nuxt-link to="/resources/single-page"
                      >Show all R3 resources on a single page
                      (mobile-friendly)&nbsp;&raquo;</nuxt-link
                    >
                  </v-col></v-row
                ></v-container
              > -->
              <div class="mb-1 mt-16">
                &laquo;&nbsp;<nuxt-link
                  to="/resources"
                  style="
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 14px;
                  "
                  >Back to R3 Resources</nuxt-link
                >
              </div>
            </v-card>
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
            <TheTableOfContents :data="data.body.toc" class="toc" />
          </v-col> </v-row
      ></v-container>
    </div>
  </div>
</template>
