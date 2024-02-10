<template>
  <div>
    <v-container v-if="isMounted"
      ><v-row>
        <v-col cols="12"> <h1>R3 Funding 2023</h1></v-col>

        <v-col
          v-for="(item, index) in splash"
          :key="`funding-photo-${index}`"
          cols="12"
          class="mt-10 mb-12"
        >
          <v-card class="" style="margin-top: -25px">
            <v-img
              cover
              crossorigin
              :src="item.src"
              :lazy-src="item.lazySrc"
              aspect-ratio="1"
              height="500"
            >
              <div class="text-center px-12" style="margin-top: 100px">
                <h1 class="nofo-title mt-3">{{ item.title }}</h1>
                <div class="nofo-tagline">
                  {{ item.tagline }}
                </div>

                <v-btn
                  variant="outlined"
                  color="white"
                  class="mt-8 button-href"
                  target="_blank"
                  :href="item.externalURL"
                  >Find out more&nbsp;&nbsp;<v-icon right
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

onMounted(() => {
  isMounted.value = true;
  // console.log("funding component mounted");
});
</script>

<style lang="scss" scoped></style>
