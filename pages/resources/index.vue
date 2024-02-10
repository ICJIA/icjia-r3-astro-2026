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
            <v-img
              class="align-end text-white rounded-xl"
              max-height="300"
              min-height="300"
              :src="`https://r3.icjia-api.cloud${item.cover.data.attributes.formats.medium.url}`"
              :lazy-src="`https://r3.icjia-api.cloud${item.cover.data.attributes.formats.thumbnail.url}`"
              cover
              ><template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    :size="70"
                    :width="7"
                    color="purple"
                    aria-label="Contact Us: Loading"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
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
                color="blue darken-4"
                class="mt-1 mb-2"
                style="font-weight: 900 !important; font-size: 14px"
                @click="$router.push(`/resources/${item.slug}`)"
                >Find out more&nbsp;&raquo;</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col></v-row
      ></v-container
    >
    <v-container
      ><v-row
        ><v-col class="text-center mt-6"
          ><nuxt-link to="/resources/mobile-view"
            >Show all R3 resources on a mobile-friendly
            page&nbsp;&raquo;</nuxt-link
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

useHead({
  title: "Resources",
});
</script>

<style lang="scss" scoped></style>
