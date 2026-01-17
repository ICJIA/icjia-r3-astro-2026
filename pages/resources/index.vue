<template>
  <div v-if="resources" class="pb-12">
    <v-container fluid
      ><v-row
        ><v-col>
          <h1>R3 Resources</h1>
        </v-col></v-row
      ></v-container
    >

    <v-container fill-height fluid class=""
      ><v-row
        ><v-col
          v-for="item in sortedResources"
          :key="item.title"
          cols="12"
          md="4"
          class="d-flex"
          style="flex-direction: column"
        >
          <v-card
            class="mx-auto rounded-xl elevation-10 d-flex flex-column pb-3 px-3 pt-4 info-card flex-grow-1"
            style="width: 100%"
            @click="$router.push(`/resources/${item.slug}`)"
          >
            <NuxtImg
              class="align-end text-white rounded-xl"
              :src="`https://r3.icjia-api.cloud${item.cover.data.attributes.url}`"
              :placeholder="`https://r3.icjia-api.cloud${item.cover.data.attributes.formats.thumbnail.url}`"
              alt="R3 Resources Image"
              sizes="xs:100vw sm:50vw md:33vw"
              height="300"
              width="100%"
              fit="cover"
              loading="lazy"
              format="webp"
              quality="80"
              style="display: block; width: 100%; object-fit: cover; height: 300px"
            />
            <v-card-title style="font-weight: 900" class="text-center mt-3">{{
              item.title
            }}</v-card-title>
            <!-- <v-card-subtitle class="pt-4"> Number 10 </v-card-subtitle> -->

            <!-- <v-card-text>
              <div>
                {{ item.summary }}
              </div>
            </v-card-text> -->
            <v-spacer></v-spacer>
            <v-card-actions class="justify-center">
              <v-btn
                color="primary"
                class="mt-1 mb-2 aaa-btn"
                style="
                  font-weight: 900 !important;
                  font-size: 14px;
                  min-height: 44px;
                  min-width: 44px;
                  padding: 12px 24px;
                "
                @click="$router.push(`/resources/${item.slug}`)"
                >Find out more&nbsp;&raquo;</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col></v-row
      ></v-container
    >
    <v-container fluid
      ><v-row
        ><v-col
          class="text-center"
          style="font-size: 14px; margin-top: 20px !important"
          ><nuxt-link
            to="/resources/single-page"
            class="aaa-link"
            style="
              display: inline-block;
              min-height: 44px;
              line-height: 44px;
              padding: 0 12px;
            "
            >Show all R3 resources on a single page
            (mobile-friendly)&nbsp;&raquo;</nuxt-link
          >
        </v-col></v-row
      ></v-container
    >
  </div>
  <div v-else>
    <ThePageLoader></ThePageLoader>
  </div>
</template>

<script setup>
import _ from "lodash";
// import moment from "moment";

const { data: resources } = await useAsyncData(`resources`, async () => {
  const post = await queryContent("/resources").find();
  return post;
});

// sort resources by ranking
const sortedResources = _.orderBy(resources.value, ["ranking"], ["asc"]);

usePageSeo({
  title: "R3 Resources",
  description:
    "Access resources, toolkits, and informational materials to help you navigate the R3 (Restore, Reinvest, Renew) program.",
  keywords: [
    "R3 resources",
    "grant toolkits",
    "Illinois grant help",
    "community investment materials",
  ],
});
</script>

<style lang="scss" scoped></style>
