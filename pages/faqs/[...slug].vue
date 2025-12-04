<template>
  <div>
    <div class="mb-12">
      <div
        v-if="isMounted"
        class="hidden-sm-and-down"
        style="margin-bottom: 80px"
      >
        <v-app-bar
          app
          elevation="6"
          class="header"
          density="compact"
          color="#0D4474"
        >
          <v-container fluid
            ><v-row
              ><v-col cols="11">
                <v-form class="pl-2 mt-4" style="margin-top: -15px">
                  <v-text-field
                    append-inner-icon="mdi-magnify"
                    id="textfield"
                    ref="textfield"
                    focused
                    v-model="query"
                    density="compact"
                    label="Search R3 FAQs below"
                    style="font-weight: 900; width: 100%"
                    autocomplete="off"
                    color="white"
                    @keypress.enter.prevent
                    @input="performMark"
                  />
                </v-form> </v-col></v-row
          ></v-container>

          <span
            class="text-right fade-in-text"
            style="width: 350px; margin-bottom: 2px"
          >
            <v-btn
              size="x-small"
              variant="text"
              style="background: #fff; color: #000"
            >
              <span style="font-weight: 900"
                >Showing {{ currentIndex }} of
                {{ results ? results.length : 0 }}</span
              ></v-btn
            >&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <v-btn
            size="x-small"
            append-icon="mdi-arrow-up"
            elevation="2"
            variant="tonal"
            :disabled="isPrevDisabled"
            @click="updateCountIndex('prev')"
            dark
            style="font-weight: 900"
            >Previous</v-btn
          >&nbsp;&nbsp;
          <v-btn
            size="x-small"
            append-icon="mdi-arrow-down"
            elevation="2"
            variant="tonal"
            :disabled="isNextDisabled"
            style="font-weight: 900"
            @click="updateCountIndex('next')"
            >Next</v-btn
          >&nbsp;&nbsp;
          <v-btn
            size="x-small"
            elevation="0"
            append-icon="mdi-close-circle"
            @click="clear"
            >Clear</v-btn
          >
        </v-app-bar>
      </div>
      <v-container style="margin-top: -45px"
        ><v-row
          ><v-col>
            <div class="mb-4" style="font-size: 13px">
              <nuxt-link to="/faqs">
                &nbsp;&laquo;&nbsp;Back to all FAQs</nuxt-link
              >
            </div>
            <div class="context">
              <v-card class="px-10 py-5">
                <h1>{{ faqs.title }}</h1>
                <attachmentsv2
                  :attachments="faqs.attachment.data"
                  :attachmentHeading="faqs.attachmentHeading"
                  class="mt-6"
                />
                <div v-html="renderer.render(faqs.markdown)" class="pl-3"></div>
              </v-card>
            </div> </v-col></v-row
      ></v-container>
    </div>
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
const isNextDisabled = ref(false);
const isPrevDisabled = ref(false);

const isMounted = ref(false);
// const markInstance = ref(null);
const { path: rawPath } = useRoute();
const router = useRouter();
// Normalize path by removing trailing slash
const path =
  rawPath.endsWith("/") && rawPath !== "/" ? rawPath.slice(0, -1) : rawPath;

const { data: faqs } = await useAsyncData(`faqs-${path}`, async () => {
  const post = await queryContent("/faqs").where({ _path: path }).findOne();
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

watch(query, (newQ) => {
  if (newQ.length < 1) {
    clear();
  } else {
    isNextDisabled.value = false;
    isPrevDisabled.value = false;
  }
});

useHead({
  title: "Frequently Asked Questions",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "R3 Frequently Asked Questions",
    },
  ],
});

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
  // console.log("performMark");
  let markInstance = new Mark(document.querySelector(".context"));
  markInstance.unmark({
    done: function () {
      markInstance.mark(query.value, options);
      results.value = document.querySelectorAll("[data-markjs]");
      currentIndex.value = 0;
      // console.log("done:");
    },
  });
};

const clear = () => {
  query.value = "";
  performMark();

  currentIndex.value = 0;
  results.value = null;
  // isNextDisabled.value = true;
  // isPrevDisabled.value = true;
  const el = document.getElementById("textfield");
  el.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(async () => {
  isMounted.value = true;
  await nextTick();
  await nextTick();

  const el = document.getElementById("textfield");
  el.focus();
});
</script>

<style lang="scss">
.title-link:hover {
  color: #888 !important;
  text-decoration: none !important;
}

mark.current {
  background: orange !important;
}
.header {
  padding: 10px;
  width: 100%;
  background: #ddd;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}

.fade-in-text {
  animation: fadeIn 2s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
