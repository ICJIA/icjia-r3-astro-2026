<template>
  <div>
    <div v-if="data">
      <v-container fluid class="full-width">
        <v-row no-gutters>
          <v-col
            v-for="(item, index) in splash"
            :key="`splash-photo-${index}`"
            style="background: #ccc"
            cols="12"
            md="12"
          >
            <v-card class="" style="min-height: 600px" v-if="!underConstruction">
              <v-img
                cover
                :src="item.src"
                :lazy-src="item.lazySrc"
                aspect-ratio="1"
                class="grey lighten-2"
                height="650"
                crossorigin
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
                    >Expired 04/30/24&nbsp;&nbsp;</v-btn
                  >
                  <v-btn
                    variant="outlined"
                    color="white"
                    size="small"
                    class="mt-8 button-href hidden-md-and-up"
                    >Expired 04/30/24&nbsp;&nbsp;</v-btn
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

            <v-card class="" style="min-height: 600px" v-else>
              <v-img
                cover
                :src="item.src"
                :lazy-src="item.lazySrc"
                aspect-ratio="1"
                class="grey lighten-2"
                height="650"
                crossorigin
              >
                <div class="text-center px-12" style="margin-top: 100px">
                  <h1 class="nofo-title mt-3" style="font-size: 34px">
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
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col cols="12">
            <ContentDoc :key="data?.title" :value="data" class="markdown-body mt-12">
              <template #empty>Document not found</template>
              <template #not-found>Document not found</template>
            </ContentDoc>
          </v-col></v-row
        ></v-container
      >

      <div
        class="mt-10 pb-12"
        style="background: #fafafa; border-top: 1px solid #aaa; min-height: 30vh"
      >
        <div
          style="background: #ddd; border-bottom: 1px solid #aaa"
          class="px-3 pt-0 pb-3"
        >
          <v-container
            ><v-row
              ><v-col>
                <h2>Letter From the Director</h2>
                <p>
                  <img
                    src="/DirectorAdamsResized.jpg"
                    width="140"
                    alt="ICJIA Executive Director, Delrice Adams"
                    class="elevation-12"
                    style="
                      float: left;
                      margin-right: 15px;
                      border: 1px solid #888;
                      border-radius: 80%;
                    "
                  />
                  Thank you for visiting the Restore, Reinvest, Review (R3) program
                  website. We appreciate your interest in the R3 mission of investing in
                  communities most affected by systemic racism and disinvestment.
                </p>
                <p>
                  In collaboration with Lt. Gov. Stratton and the Justice Equity and
                  Opportunity Initiative, ICJIA has provided funding access and
                  availability to over 400 new small, localized grassroots organizations
                  that, without R3, may not have received state grants
                </p>
                <p>
                  As we initiate our third R3 Notice of Funding Opportunity, we remain
                  committed to ensuring equity, fairness, and opportunity in communities
                  across the state. We will continue to empower organizations to create
                  innovative programs and strategies that address the diverse needs of
                  their communities and, ultimately, build a safer Illinois.
                </p>
                <div>
                  <strong>Delrice Adams</strong><br />
                  ICJIA Executive Director
                </div>
              </v-col></v-row
            ></v-container
          >
        </div>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="7"
              ><h2>Applicant Tools</h2>

              <HomePhotoBoxes />
            </v-col>
            <v-col cols="12" md="5">
              <h2>News & Updates</h2>
              <!-- <div v-if="test">{{ test[0].title }}</div> -->

              <v-card
                v-for="item in sortedNews"
                :key="item.id"
                elevation="1"
                class="px-5 py-3 mb-3 info-card mt-8"
                height="275px"
                @click="routeToNews(item)"
              >
                <div style="font-size: 12px; font-weight: 700">
                  {{ moment(item.postDate).utc().format("MMM DD, YYYY") }}
                </div>
                <h3
                  style="
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 8px;
                    margin-bottom: 20px;
                  "
                >
                  {{ item.title }}
                </h3>
                <p>{{ item.summary }}</p>
                <!-- <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    size="x-small"
                    variant="text"
                    :to="item.path"
                    style="font-weight: 900"
                    >Read more&nbsp;&raquo;</v-btn
                  >
                </v-card-actions> -->
              </v-card>
              <div class="text-center mt-10">
                <nuxt-link to="/news" class="home-link"
                  >News archive&nbsp;&raquo;</nuxt-link
                >
              </div>
            </v-col></v-row
          ></v-container
        >
      </div>
    </div>
    <div v-else>
      <v-container class="text-center" style="margin-top: 200px">
        <v-row>
          <v-col>
            <h1 id="loading" style="border-bottom: 0px; margin-bottom: 50px">
              R3 RESTORE. REINVEST. RENEW.
            </h1>
            <TheAltLoader></TheAltLoader></v-col></v-row
      ></v-container>
    </div>
  </div>
</template>

<script setup>
import _ from "lodash";
import moment from "moment";
const { underConstruction } = useAppConfig();
// definePageMeta({
//   middleware: ["is-valid-content"],
// });
const { splash, tools } = useAppConfig();
const { path } = useRoute();
const router = useRouter();
const isMounted = ref(false);

// const error = useError();
const { data } = await useAsyncData(`content-home`, async () => {
  const post = await queryContent().where({ _path: "/" }).findOne();
  return post;
});
const { data: news } = await useAsyncData(`news-${path}`, async () => {
  const post = await queryContent("/news").find();

  return post;
});

const redirect = () => {
  router.push("/404");
};

let sortedNews = _.orderBy(news.value, ["postDate"], ["desc"]);
sortedNews = sortedNews.slice(0, 2);

const routeToNews = (item) => {
  router.push(`/news/${item.slug}`);
};

const routeToFunding = (item) => {
  alert("Route to funding info here");
};

const routeToTool = (item) => {
  router.push(`${item}`);
};

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

// const gotoURL = (url) => {
//   window.open(url, "_blank");
// };

onMounted(() => {
  isMounted.value = true;
});
</script>

<style>
.button-href .v-btn__content {
  font-weight: 700 !important;
  text-decoration: none !important;
}

.button-href:hover .v-btn__content {
  text-decoration: none !important;
}

a.home-link {
  color: #333;
}

.nofo-tagline {
  color: #fff;
}
.nofo-title {
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 10px #000;
}
.full-width {
  margin: 0;
  padding: 0;
}
.white-heading {
  color: #fff !important;
}
.dark-rule {
  border-bottom: 1px solid #000 !important;
}
</style>
