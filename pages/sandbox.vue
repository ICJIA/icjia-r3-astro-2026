<template>
  <div>
    <v-toolbar app elevation="6" class="header d-flex" density="compact">
      <v-container fluid
        ><v-row
          ><v-col cols="9">
            <v-form class="pl-2 mt-4" style="margin-top: -15px">
              <v-text-field
                id="textfield"
                ref="textfield"
                v-model="query"
                density="compact"
                label="Search FAQs"
                style="font-weight: 900; width: 100%"
                autocomplete="off"
                @keypress.enter.prevent
                @input="performMark"
              />
            </v-form> </v-col></v-row
      ></v-container>

      <v-btn size="small" variant="text"
        >{{ currentIndex }} of {{ results ? results.length : 0 }}</v-btn
      >&nbsp;&nbsp;
      <v-btn
        size="x-small"
        variant="tonal"
        append-icon="mdi-arrow-up"
        elevation="2"
        @click="updateCountIndex('prev')"
        >Previous</v-btn
      >&nbsp;&nbsp;
      <v-btn
        size="x-small"
        variant="tonal"
        append-icon="mdi-arrow-down"
        elevation="2"
        @click="updateCountIndex('next')"
        >Next</v-btn
      >&nbsp;&nbsp;
      <v-btn
        size="x-small"
        variant="tonal"
        elevation="2"
        append-icon="mdi-close-circle"
        @click="clear"
        >Clear</v-btn
      >
    </v-toolbar>

    <v-container
      ><v-row
        ><v-col>
          <div style="margin-top: 90px">
            Results: {{ results ? results.length : 0 }} currentIndex:
            {{ currentIndex }}
            <v-card class="px-5 py-5 mb-12">
              <div class="context">
                <div v-for="item in sortedFaqs" :key="item.title">
                  <h2 class="mt-12">{{ item.title }}</h2>

                  <div class="px-5 mt-4">
                    <span v-html="renderer.render(item.markdown)"></span>
                  </div>
                </div></div
            ></v-card></div></v-col></v-row
    ></v-container>
  </div>
</template>

<script setup>
import md from "markdown-it";
import attrs from "markdown-it-attrs";
const renderer = new md({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
}).use(attrs);
import _ from "lodash";
import moment from "moment";
const query = ref("");
const results = ref(null);
const currentIndex = ref(0);
const currentClass = ref("current");
// const markInstance = ref(null);
const { path } = useRoute();
const router = useRouter();
const { data: faqs } = await useAsyncData(`faqs-${path}`, async () => {
  const post = await queryContent("/faqs").find();
  return post;
});
const sortedFaqs = _.orderBy(faqs.value, ["postDate"], ["desc"]);

const route = useRoute();
const routePath = ref(route.path);
// console.log(routePath);

const options = {
  accuracy: "partially",
  separateWordSearch: false,
  acrossElements: true,
};

const updateCountIndex = (strBtn) => {
  //console.log("strBtn: ", strBtn);
  if (currentIndex.value.length === 0 || query.value.length === 0) {
    return;
  }
  if (results.value.length > 0 && query.value.length > 0) {
    if (strBtn === "next") {
      if (currentIndex.value <= results.value.length - 1) {
        currentIndex.value++;
      }
    }

    if (strBtn === "prev") {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      } else {
        currentIndex.value = 0;
      }
    }
  }
  if (currentIndex.value > 0) {
    results.value[currentIndex.value - 1].scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    var elems = document.querySelectorAll(".current");
    for (var i = 0; i < elems.length; i++) {
      elems[i].classList.remove(currentClass.value);
    }

    results.value[currentIndex.value - 1].classList.add(currentClass.value);
  } else {
    var elems = document.querySelectorAll(".current");
    for (var i = 0; i < elems.length; i++) {
      elems[i].classList.remove(currentClass.value);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const performMark = () => {
  let markInstance = new Mark(document.querySelector(".context"));

  markInstance.unmark({
    done: function () {
      markInstance.mark(query.value, options);
      results.value = document.querySelectorAll("[data-markjs]");
      currentIndex.value = 0;
    },
  });
};

const clear = () => {
  query.value = "";
  performMark();

  currentIndex.value = 0;
  results.value = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  // el.value = document.querySelector(".context");
});
</script>

<style lang="scss">
mark.current {
  background: orange !important;
}
.header {
  padding: 10px;
  width: 100%;
  background: #ddd;
  position: fixed;
  top: 20;
  left: 0;
  z-index: 99999;
}
</style>
