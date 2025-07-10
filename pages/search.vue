<template>
  <div>
    <TheBreadcrumbBar></TheBreadcrumbBar>
    <keep-alive>
      <v-container class="mb-12" fluid
        ><v-row
          ><v-col cols="12">
            <h1>Search</h1>
            <div class="text-right">Found: {{ result.length }}</div>
            <v-container fluid
              ><v-row
                ><v-col cols="12" md="10" class="text-left">
                  <v-form class="pl-2 mt-4" style="margin-top: -15px">
                    <v-text-field
                      id="textfield"
                      ref="textfield"
                      v-model="query"
                      clearable
                      label="Search R3"
                      placeholder="Enter search term"
                      style="font-weight: 900"
                      @input="instantSearch"
                      autocomplete="off"
                      @keypress.enter.prevent
                    />
                  </v-form>
                </v-col>
                <v-col cols="12" md="2" class="hidden-sm-and-down">
                  <div class="pt-6">
                    <v-btn color="blue-darken-4" @click.prevent="clearAll"
                      >Clear Search</v-btn
                    >
                  </div></v-col
                >
                <v-col cols="12" md="2" class="hidden-md-and-up">
                  <div class="text-center">
                    <v-btn color="blue-darken-4" @click.prevent="clearAll"
                      >Clear Search</v-btn
                    >
                  </div></v-col
                >
              </v-row></v-container
            >
            <div
              class="text-left"
              style="margin-top: -20px; margin-left: 30px; font-size: 14px"
              v-if="queries.length && queries.length > 0"
            >
              <span>Your recent queries:&nbsp;</span>
              <span
                v-for="q in queries"
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
            </div>

            <div v-if="result && query?.length" class="mt-12">
              <!-- <div class="text-center">
                <h2>Search results:</h2>
              </div> -->
              <div v-if="result.length">
                <v-card
                  v-for="(result, index) in result"
                  :key="`fuse-${index}`"
                  class="px-5 py-5 mx-5 my-10 hover text-left info-card"
                  elevation="2"
                  color="grey-lighten-4"
                  @click="navigateTo(result.item)"
                >
                  <h2 style="border-bottom: 0px">{{ result.item.title }}</h2>
                  <p class="mt-2">{{ result.item.summary }}</p>
                  <!-- <p>{{ result.item }}</p> -->
                  <!-- <p
                    style="
                      font-size: 11px;
                      font-weight: 900;
                      border: 1px solid #ccc;
                      display: inline-block;
                      float: right;
                      padding: 5px;
                      background: #ddd;
                      color: #000;
                    "
                    class="mt-2"
                  >
                    Score: {{ result.score }}
                  </p> -->
                </v-card>
              </div>
            </div>
          </v-col></v-row
        ></v-container
      >
    </keep-alive>
  </div>
</template>

<script setup>
import Fuse from "fuse.js";
import searchIndex from "~/assets/json/searchIndex.json";

// Use Nuxt 3 native state management instead of Pinia
const { queries, addNewQuery } = useSearchActions();

useHead({
  title: "Search",
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
  keys: ["title", "slug", "summary", "searchMeta", "rawText"],
};
const query = ref("");
const fuse = new Fuse(searchIndex, options);

const result = ref(fuse.search(query.value.toLowerCase));
// console.log("queries: ", queries.value.length);

if (queries.value.length) {
  query.value = queries.value[queries.value.length - 1];
  result.value = fuse.search(query.value);
}

const instantSearch = () => {
  result.value = fuse.search(query.value);
};

const showIndex = ref(false);
const toggleIndex = () => {
  showIndex.value = !showIndex.value;
};

const addQuery = (q) => {
  query.value = q;
  result.value = fuse.search(query.value);
};

watch(query, (val) => {
  if (!val) {
    result.value = [];
  }
});

const router = useRouter();
const navigateTo = (item) => {
  addNewQuery(query.value);
  console.log("query added to state: ", query.value);
  console.log("navigateTo: ", item?.path);
  router.push({ path: item.path });
};

const clearAll = () => {
  query.value = "";
  result.value = [];
  showIndex.value = false;
  const el = document.getElementById("textfield");
  el.focus();
};

onMounted(() => {
  const el = document.getElementById("textfield");
  el.focus();
});
</script>

<style lang="scss" scoped></style>
