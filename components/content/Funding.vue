<template>
  <div>
    <v-container v-if="isMounted"
      ><v-row>
        <v-col cols="12"> <h1>R3 Funding Opportunity</h1></v-col>

        <v-col
          v-for="(item, index) in splash"
          :key="`funding-photo-${index}`"
          cols="12"
          class="mt-10 mb-12"
        >
          <v-card
            class="info-card"
            style="margin-top: -25px"
            v-if="!underConstruction"
          >
            <v-img
              cover
              crossorigin
              :src="item.src"
              :lazy-src="item.lazySrc"
              aspect-ratio="1"
              height="750"
            >
              <div class="text-center px-12" style="margin-top: 100px">
                <h1 class="nofo-title mt-3">{{ item.title }}</h1>
                <div class="nofo-tagline">
                  {{ item.tagline }}
                </div>

                <v-btn
                  variant="outlined"
                  color="white"
                  size="small"
                  class="mt-8 button-href hidden-sm-and-down"
                  :href="item.externalURL"
                  >For More Information or to Apply Now&nbsp;&nbsp;<v-icon right
                    >mdi-open-in-new</v-icon
                  ></v-btn
                >
                <v-btn
                  variant="outlined"
                  color="white"
                  size="small"
                  class="mt-8 button-href hidden-md-and-up"
                  :href="item.externalURL"
                  >Apply Now&nbsp;&nbsp;<v-icon right
                    >mdi-open-in-new</v-icon
                  ></v-btn
                >
              </div>
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    indeterminate
                    color="grey-lighten-4"
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
          </v-card>
          <v-card class="" style="margin-top: -25px" v-else>
            <v-img
              cover
              crossorigin
              :src="item.src"
              :lazy-src="item.lazySrc"
              aspect-ratio="1"
              height="750"
            >
              <div class="text-center px-12" style="margin-top: 100px">
                <h1 class="nofo-title mt-3">
                  2025 SERVICE DELIVERY GRANT OPPORTUNITIES
                </h1>
                <div class="nofo-tagline">
                  {{ item.tagline }}
                </div>

                <v-btn
                  variant="outlined"
                  color="white"
                  size="small"
                  class="mt-8 button-href hidden-sm-and-down"
                  >Coming Soon!</v-btn
                >
                <v-btn
                  variant="outlined"
                  color="white"
                  size="small"
                  class="mt-8 button-href hidden-md-and-up"
                  :href="item.externalURL"
                  >Coming Soon!</v-btn
                >
              </div>
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    indeterminate
                    color="grey-lighten-4"
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
          </v-card> </v-col></v-row
    ></v-container>
    <v-container v-else
      ><v-row
        ><v-col><ThePageLoader /></v-col></v-row
    ></v-container>
  </div>
</template>

<script setup>
const { splash } = useAppConfig();
const { path } = useRoute();
const router = useRouter();
const isMounted = ref(false);
const { underConstruction } = useAppConfig();

const gotoURL = ({ externalURL }) => {
  window.open(externalURL, "_blank");
  console.log(externalURL);
};

onMounted(() => {
  isMounted.value = true;
  // console.log("funding component mounted");
});
</script>

<style lang="scss" scoped></style>
