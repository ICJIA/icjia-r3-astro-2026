<template>
  <div>
    <div v-if="isMounted">
      <v-container class="mb-12"
        ><v-row
          ><v-col>
            <h1>R3 Frequently Asked Questions</h1>
            <v-container
              class="fill-height"
              style="width: 98%; margin-top: -50px; margin-bottom: 20px"
            >
              <v-row style="">
                <v-col class="d-flex justify-center"
                  ><v-card
                    elevation="0"
                    class="px-5 py-5"
                    style="background: #093356; border: 1px solid #ddd"
                    ><ContentDoc
                      :key="data?.title"
                      :value="data"
                      style="color: #fff !important"
                    >
                      <template #empty>Document not found</template>
                      <template #not-found>Document not found</template>
                    </ContentDoc></v-card
                  ></v-col
                >
              </v-row>
            </v-container>
          </v-col></v-row
        >

        <v-row
          ><v-col cols="12" md="11" class="text-left">
            <v-form class="pl-2 mt-4">
              <v-text-field
                id="textfield"
                ref="textfield"
                v-model="query"
                clearable
                label="Search R3 FAQs"
                placeholder="Enter search term"
                style="font-weight: 900"
                @input="instantSearch"
                autocomplete="off"
                @keypress.enter.prevent
                class="mt-12"
              />
            </v-form>
          </v-col>
          <v-col cols="12" md="1" class="hidden-sm-and-down mt-8">
            <div class="pt-6">
              <v-btn color="blue-darken-4 px-2" @click.prevent="clearAll"
                >&nbsp;Clear&nbsp;</v-btn
              >
            </div></v-col
          >
          <v-col cols="12" md="1" class="hidden-md-and-up mb-10">
            <div class="text-center">
              <v-btn color="blue-darken-4" @click.prevent="clearAll"
                >Clear</v-btn
              >
            </div></v-col
          >
          <v-col
            ><div
              class="text-left"
              style="
                margin-top: -30px;
                margin-bottom: 50px;
                margin-left: 10px;
                font-size: 14px;
              "
              v-if="store.faqQuery.length && store.faqQuery.length > 0"
            >
              <span>Your recent FAQ queries:&nbsp;</span>
              <span
                v-for="q in store.faqQuery"
                :key="Math.random()"
                @click="addQuery(q)"
                class="hover"
                ><v-chip
                  size="small"
                  class="mr-2 hover"
                  style="font-weight: 900"
                  >{{ q }}</v-chip
                ></span
              >
            </div></v-col
          ></v-row
        ></v-container
      >

      <v-container
        ><v-row
          ><v-col class="text-center">
            <h3 v-if="searchIndex.length === 0" style="font-size: 40px">
              No FAQs found. Please check back soon!
            </h3>
          </v-col></v-row
        ></v-container
      >
      <v-container style="margin-top: -80px">
        <v-row
          ><v-col>
            <div v-if="result && query?.length && !showAllFaqs">
              <v-expansion-panels v-if="result.length">
                <v-expansion-panel
                  v-for="(result, index) in result"
                  :key="`fuse-${index}`"
                  class="mb-8"
                  elevation="2"
                  style="background: #fafafa"
                  @click="navigateTo(result.item)"
                >
                  <div
                    style="
                      font-size: 12px;
                      font-weight: 700;
                      background: #fafafa;
                      color: #000;
                    "
                    class="pl-3 pt-3 pb-3"
                  >
                    <span v-if="isItUpdated(result.item)"
                      ><v-chip
                        size="small"
                        style="
                          font-weight: 700;
                          background: #11568e;
                          color: white;
                        "
                        >Updated</v-chip
                      >&nbsp;&nbsp;<span style="">
                        <!-- <span style="text-transform: uppercase; font-weight: 900"
                        >{{ result.item.category }}&nbsp;|&nbsp;</span
                      > -->
                        {{
                          moment(result.item.updatedAt).format("MMMM DD, YYYY")
                        }}</span
                      ></span
                    >
                    <span v-else>
                      <!-- <span style="text-transform: uppercase; font-weight: 900"
                        >{{ result.item.category }}&nbsp;|&nbsp;</span
                      > -->
                      {{ moment(result.item.postDate).format("MMMM DD, YYYY") }}
                    </span>
                  </div>
                  <v-expansion-panel-title
                    expand-icon="mdi-plus"
                    collapse-icon="mdi-minus"
                    style="font-weight: 900; line-height: 1.5"
                    class="pr-3"
                  >
                    {{ result.item.title }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text style="margin-top: 10px">
                    <span v-html="renderer.render(result.item.body)"></span>
                    <div
                      class="text-right pt-5"
                      style="font-size: 10px; font-weight: 700"
                      v-if="isItUpdated(result.item)"
                    >
                      Published
                      <span style="font-weight: 700">
                        {{
                          moment(result.item.postDate).format(
                            "MMMM DD  YYYY, h:mm a"
                          )
                        }}
                      </span>

                      <span style="font-weight: 700">
                        | Updated
                        {{
                          moment(result.item.updatedAt).format(
                            "MMMM DD  YYYY, h:mm a"
                          )
                        }}</span
                      >
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div v-else>
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(item, index) in searchIndex"
                  :key="JSON.stringify(item)"
                  class="mb-8"
                  elevation="2"
                  style="background: #fafafa"
                  @click="navigateTo(item)"
                >
                  <div
                    style="
                      font-size: 12px;
                      font-weight: 700;
                      background: #fafafa;
                      color: #000;
                    "
                    class="pl-3 pt-3 pb-3"
                  >
                    <span v-if="isItUpdated(item)"
                      ><v-chip
                        size="small"
                        style="
                          font-weight: 700;
                          background: #11568e;
                          color: white;
                        "
                        >Updated</v-chip
                      >&nbsp;&nbsp;<span style="">
                        {{
                          moment(item.updatedAt).format("MMMM DD, YYYY")
                        }}</span
                      ></span
                    >
                    <span v-else>
                      <!-- <span style="text-transform: uppercase; font-weight: 900"
                        >{{ item.category }}&nbsp;|&nbsp;</span
                      > -->
                      {{ moment(item.postDate).format("MMMM DD, YYYY") }}
                    </span>
                  </div>
                  <v-expansion-panel-title
                    class="pr-3"
                    expand-icon="mdi-plus"
                    collapse-icon="mdi-minus"
                    style="font-weight: 900; line-height: 1.5"
                  >
                    {{ item.title }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text style="margin-top: 10px">
                    <span v-html="renderer.render(item.body)"></span>
                    <div
                      class="text-right pt-5"
                      style="font-size: 10px; font-weight: 700"
                      v-if="isItUpdated(item)"
                    >
                      Published
                      <span style="font-weight: 900">
                        {{
                          moment(item.postDate).format("MMMM DD, YYYY, h:mm a")
                        }}
                      </span>

                      <span style="font-weight: 900">
                        | Updated
                        {{
                          moment(item.updatedAt).format("MMMM DD, YYYY, h:mm a")
                        }}</span
                      >
                    </div>
                    <!-- <div class="text-right mb-1 mt-3" style="">
                      <nuxt-link :to="item.path" class="button-href">
                        <v-icon size="x-small">mdi-open-in-new</v-icon>
                      </nuxt-link>
                    </div> -->
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col></v-row
        ></v-container
      >
      <v-container fluid class="mb-12"
        ><v-row
          ><v-col
            class="text-center"
            style="font-size: 14px; margin-top: 0px !important"
            ><nuxt-link to="/faqs/single-page"
              >Show All FAQs (printer-friendly)&nbsp;&raquo;</nuxt-link
            >
          </v-col></v-row
        ></v-container
      >
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
  </div>
</template>

<script setup>
import Fuse from "fuse.js";
import searchIndex from "~/assets/json/searchIndexFaqs.json";
import moment from "moment";
import md from "markdown-it";
import attrs from "markdown-it-attrs";

import { useFaqSearchStore } from "@/stores/faqSearchStore";
let store = useFaqSearchStore();

const renderer = new md({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
}).use(attrs);

useHead({
  title: "Search Frequently Asked Questions (FAQs)",
});

const options = {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
  includeMatches: true,
  findAllMatches: true,
  minMatchCharLength: 2,
  location: 0,
  threshold: 0.4,
  distance: 500,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  keys: ["title", "body", "searchMeta", "category"],
};
let query = ref("");
// const showAll = ref(true);

const { path } = useRoute();
const router = useRouter();

// const error = useError();
const { data } = await useAsyncData(`content-${path}`, async () => {
  const post = await queryContent().where({ _path: path }).findOne();
  return post;
});

const fuse = new Fuse(searchIndex, options);

const result = ref(fuse.search(query.value.toLowerCase));
let isMounted = ref(false);
const instantSearch = () => {
  // showAll.value = false;
  result.value = fuse.search(query.value);
};

if (store.faqQuery.length) {
  query.value = store.faqQuery[store.faqQuery.length - 1];
  result.value = fuse.search(query.value);
}

// console.log(store.faqQuery.value);

const showIndex = ref(false);
const toggleIndex = () => {
  showIndex.value = !showIndex.value;
};

const showAllFaqs = computed(() => {
  if (query.value && query.value.length > 0) {
    return false;
  } else {
    return true;
  }
});

const addQuery = (q) => {
  query.value = q;
  result.value = fuse.search(query.value);
};

watch(query, (val) => {
  if (!val) {
    result.value = [];
  }
});

const isItNew = ({ postDate }) => {
  const now = moment(new Date());
  let targetDate = postDate;

  const end = moment(targetDate); // another date
  const duration = moment.duration(now.diff(end));
  const days = duration.asDays();

  //console.log("Days: ", days);
  if (days <= 6) {
    return true;
  } else {
    return false;
  }
};

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

const useTextSelection = (item) => {
  store.addNewFaqQuery(query.value);
  console.log("query added to FAQ store: ", query.value);
};

const navigateTo = (item) => {
  // console.log("click");
  // console.log("Query: ", query.value);
  if (query.value && query.value.length > 0) {
    store.addNewFaqQuery(query.value);
    console.log("query added to FAQ store: ", query.value);
  }
};

const clearAll = () => {
  query.value = "";
  result.value = [];
  showIndex.value = false;

  const el = document.getElementById("textfield");
  // el.focus();
};

onMounted(() => {
  const el = document.getElementById("textfield");
  // el.focus();
  isMounted.value = true;
});
</script>

<style lang="scss">
h2#faq-posting-schedule,
h2#question-submissions,
h2#questions-submissions {
  color: #fff !important;
}
</style>
