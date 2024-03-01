<template>
  <div>
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
    <div v-for="item in displayMatches(result)" :key="item.item.slug">
      <v-card class="mb-4" style="cursor: pointer">
        <v-card-title>
          <h3>{{ item.item.title }}</h3>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import Fuse from "fuse.js";
import searchIndex from "~/assets/json/searchIndexFaqs.json";
import { useSearchStore } from "@/stores/searchStore";
let store = useSearchStore();

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
  keys: ["title", "body", "slug", "searchMeta", "rawText"],
};
const query = ref("");
const fuse = new Fuse(searchIndex, options);
const result = ref(fuse.search(query.value.toLowerCase));

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
  store.addNewQuery(query.value);
  console.log("query added to store: ", query.value);
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

const displayMatches = (item) => {
  // console.log(item);
  //console.log(item.length);
  item.forEach((i) => {
    console.log("matches: ", i.matches);
  });
  return item;
};
</script>

<style lang="scss" scoped></style>
