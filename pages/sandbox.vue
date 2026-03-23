<template>
  <div>
    <h1 class="mb-10 px-8 pt-5" style="border: none" v-show="!isMounted">
      R3 Frequently Asked Questions
    </h1>
    <div v-if="isMounted">
      <the-faq-bar
        @prev="updateCountIndex('prev')"
        @next="updateCountIndex('next')"
        @query="performMark"
        @clear="clear"
        :current-index="currentIndex"
        :results="results"
        v-if="display && !display.mobile"
        :key="getUUID"
      ></the-faq-bar>
      <the-faq-bar-mobile
        @prev="updateCountIndex('prev')"
        @next="updateCountIndex('next')"
        @query="performMark"
        @clear="clear"
        :current-index="currentIndex"
        :results="results"
        v-if="display && display.mobile"
        :key="getUUID"
      ></the-faq-bar-mobile>

      <v-container
        ><v-row
          ><v-col>
            <div style="margin-top: 35px">
              <v-card class="px-8 py-5 mb-12">
                <div class="context">
                  <h1 class="mb-10" style="border: none">
                    R3 Frequently Asked Questions
                  </h1>
                  <div
                    v-for="item in sortedFaqs"
                    :key="item.title"
                    class="pl-5"
                  >
                    <nuxt-link
                      :to="item.path"
                      style="text-decoration: none !important"
                    >
                      <h2 class="mt-12 title-link">{{ item.title }}&nbsp;</h2>
                    </nuxt-link>
                    <attachmentsv2
                      :attachments="item.attachment.data"
                      :attachment-heading="item.attachmentHeading"
                      class="mt-6"
                    />

                    <div class="px-5 mt-4">
                      <span v-html="sanitize(renderer.render(item.markdown))"></span>
                    </div>
                  </div></div
              ></v-card>
            </div> </v-col></v-row
      ></v-container>
    </div>
    <div v-else>
      <the-page-loader></the-page-loader>
    </div>
  </div>
</template>

<script setup>
import md from "markdown-it";
import attrs from "markdown-it-attrs";
import { useDisplay } from "vuetify";
import { v4 as uuidv4 } from "uuid";

const DOMPurify = import.meta.client
  ? (await import("dompurify")).default
  : null;
const purifyConfig = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["allowfullscreen", "frameborder", "allow", "loading", "title"],
};
const sanitize = (html) =>
  DOMPurify ? DOMPurify.sanitize(html, purifyConfig) : html;
// const uuid = uuidv4();
// console.log(uuid);
const display = ref(useDisplay());
// console.log(display);
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

const query = ref("");
const results = ref([]);
const currentIndex = ref(0);
const isMounted = ref(false);
const currentClass = ref("current");
const { path } = useRoute();
// const router = useRouter();
const route = useRoute();
// const routePath = ref(route.path);
const { data: faqs } = await useAsyncData(`faqs-${path}`, async () => {
  const post = await queryContent("/faqs").find();
  return post;
});
const sortedFaqs = _.orderBy(faqs.value, ["postDate"], ["desc"]);

const options = {
  accuracy: "partially",
  separateWordSearch: false,
  acrossElements: true,
};

const getUUID = () => {
  return uuidv4();
};

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

const performMark = (_query = "") => {
  query.value = _query;
  let markInstance = new Mark(document.querySelector(".context"));
  markInstance.unmark({
    done: function () {
      markInstance.mark(query.value, options);
      results.value = Array.from(document.querySelectorAll("[data-markjs]"));
      currentIndex.value = 0;
    },
  });
};

const clear = (isMobile = false) => {
  performMark();
  query.value = "";
  currentIndex.value = 0;
  results.value = [];
  if (!isMobile) {
    const el = document.getElementById("textfield");
    el.focus();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const updateCountIndex = (strBtn) => {
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
onMounted(async () => {
  await nextTick();
  await nextTick();
  isMounted.value = true;
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
