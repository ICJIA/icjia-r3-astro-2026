<template>
  <div>
    <!-- Search Status Announcements for Screen Readers -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ searchStatusMessage }}
    </div>

    <div>
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
                  density="compact"
                  label="Search R3 FAQs below"
                  style="font-weight: 900; width: 100%"
                  autocomplete="off"
                  color="white"
                  v-model="_query"
                  @input="$emit('query', query)"
                  @keypress.enter.prevent
                  role="searchbox"
                  :aria-label="`Search R3 FAQs. ${searchResultsDescription}`"
                  :aria-describedby="
                    results && results.length > 0
                      ? 'search-results-status'
                      : undefined
                  "
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
            role="status"
            aria-live="polite"
            id="search-results-status"
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
          color="primary"
          @click="$emit('prev')"
          dark
          style="font-weight: 900"
          :disabled="!results || results.length === 0 || currentIndex <= 1"
          :aria-label="`Go to previous search result. Currently showing result ${currentIndex} of ${results ? results.length : 0}`"
          >Previous</v-btn
        >&nbsp;&nbsp;
        <v-btn
          size="x-small"
          append-icon="mdi-arrow-down"
          elevation="2"
          variant="tonal"
          color="primary"
          style="font-weight: 900"
          @click="$emit('next')"
          :disabled="
            !results || results.length === 0 || currentIndex >= results.length
          "
          :aria-label="`Go to next search result. Currently showing result ${currentIndex} of ${results ? results.length : 0}`"
          >Next</v-btn
        >&nbsp;&nbsp;
        <v-btn
          size="x-small"
          elevation="0"
          color="primary"
          append-icon="mdi-close-circle"
          @click="clearSearch"
          aria-label="Clear search and return to top of page"
          >Clear</v-btn
        >
      </v-app-bar>
    </div>

    <!-- <div v-else>Loading...</div> -->
  </div>
</template>

<script setup>
const emits = defineEmits(["query", "prev", "next", "clear"]);
const props = defineProps({
  currentIndex: Number,
  results: Array,
  shouldClear: Boolean,
});

// console.log("faqbar component props: ", props);

let isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
  const el = document.getElementById("textfield");
  if (el) {
    el.focus();
  }
});

let _query = ref("");

const clearSearch = () => {
  _query.value = "";
  emits("clear");
};

const query = computed({
  // getter
  get() {
    return _query.value;
  },
  // setter
  set(newValue) {
    $emit("query", newValue);
  },
});

/**
 * Computed property for search status message for screen readers
 * @returns {string} Status message describing current search state
 */
const searchStatusMessage = computed(() => {
  if (!_query.value || _query.value.length === 0) {
    return "";
  }

  if (!props.results || props.results.length === 0) {
    return `No search results found for "${_query.value}".`;
  }

  if (props.results.length === 1) {
    return `Found 1 result for "${_query.value}".`;
  }

  return `Found ${props.results.length} results for "${_query.value}". Currently showing result ${props.currentIndex} of ${props.results.length}.`;
});

/**
 * Computed property for search results description for search input
 * @returns {string} Description of current search results for aria-label
 */
const searchResultsDescription = computed(() => {
  if (!_query.value || _query.value.length === 0) {
    return "Enter search terms to find FAQs.";
  }

  if (!props.results || props.results.length === 0) {
    return `No results found for "${_query.value}".`;
  }

  return `${props.results.length} result${props.results.length > 1 ? "s" : ""} found.`;
});
</script>

<style lang="scss" scoped>
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
