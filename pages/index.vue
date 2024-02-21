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
            <v-card class="hoverCard" style="min-height: 500px">
              <v-img
                cover
                :src="item.src"
                :lazy-src="item.lazySrc"
                aspect-ratio="1"
                class="grey lighten-2"
                height="550"
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
                    class="mt-8 button-href"
                    target="_blank"
                    :href="item.externalURL"
                    >Find out more&nbsp;&nbsp;<v-icon right
                      >mdi-open-in-new</v-icon
                    ></v-btn
                  >
                  <!-- <v-tooltip text="Tooltip">
                    <template #activator="{ props }">
                      <v-btn v-bind="props">Tooltip</v-btn>
                    </template>
                  </v-tooltip> -->
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
            <ContentDoc
              :key="data?.title"
              :value="data"
              class="markdown-body mt-12"
            >
              <template #empty>Document not found</template>
              <template #not-found>Document not found</template>
            </ContentDoc>
          </v-col></v-row
        ></v-container
      >

      <div
        class="mt-10 pb-12"
        style="
          background: #fafafa;
          border-top: 1px solid #aaa;
          min-height: 30vh;
        "
      >
        <div
          style="background: #ddd; border-bottom: 1px solid #aaa"
          class="px-3 pt-0 pb-3"
        >
          <v-container
            ><v-row
              ><v-col>
                <h2>Letter from ICJIA's Executive Director</h2>
                <p>
                  <img
                    src="/delrice.jpg"
                    width="150"
                    alt="ICJIA Executive Director, Delrice Adams"
                    class="elevation-10"
                    style="
                      float: left;
                      margin-right: 15px;
                      border: 1px solid #555;
                      border-radius: 50%;
                    "
                  />
                  Delrice Adams is a justice warrior with over 25 years of
                  directing social service and public health reform efforts.
                  Governor J.B. Pritzker appointed Executive Director Adams to
                  lead the Illinois Criminal Justice Information Authority
                  (ICJIA) in January 2020. In this role, Executive Director
                  Adams leverages her expertise in criminal justice, violence
                  prevention, and racial equity to support the agency’s work.
                  Her expertise informs and enhances public safety priorities,
                  equitable grant administration, and evidence-based solutions
                  to violence prevention.
                </p>
                <p>
                  A visionary leader trained in trauma-informed approaches,
                  Executive Director Adams co-chairs the Government Alliance for
                  Safer Communities, a first-of-its-kind cross-governmental
                  violence prevention advisory group of state, county, and city
                  officials.
                </p>
                <p>
                  In July 2022, Executive Director Adams was selected into the
                  highly competitive National Criminal Justice Association
                  Leadership Academy for Executives where she represented the
                  great state of Illinois. She received a bachelor's degree in
                  psychology from the University of California at Berkeley and
                  holds a master's degree in social service administration from
                  the University of Chicago.
                </p>
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
