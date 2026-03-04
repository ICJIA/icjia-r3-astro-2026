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
        style="margin-left: -15px !important"
      >
        <v-container fluid
          ><v-row
            ><v-col cols="11">
              <v-form class="pl-2 mt-4" style="margin-top: -15px">
                <v-text-field
                  id="textfield"
                  ref="textfield"
                  focused
                  density="compact"
                  label="Search"
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
                      ? 'search-results-status-mobile'
                      : undefined
                  "
                />
              </v-form> </v-col></v-row
        ></v-container>

        <v-btn
          size="x-small"
          variant="text"
          style="background: #fff; color: #000"
        >
          <span style="font-weight: 900; font-size: 10px"
            >{{ currentIndex }} of {{ results ? results.length : 0 }}</span
          ></v-btn
        >&nbsp;
        <v-btn
          size="x-small"
          elevation="2"
          variant="tonal"
          color="primary"
          @click="$emit('prev')"
          dark
          style="font-weight: 900"
          ><v-icon>mdi-arrow-up</v-icon></v-btn
        >&nbsp;
        <v-btn
          size="x-small"
          elevation="2"
          variant="tonal"
          color="primary"
          style="font-weight: 900"
          @click="$emit('next')"
          ><v-icon>mdi-arrow-down</v-icon></v-btn
        >&nbsp;
        <v-btn size="x-small" elevation="0" color="primary" @click="clearSearch"
          ><v-icon>mdi-close-circle</v-icon></v-btn
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
});

let _query = ref("");

const clearSearch = () => {
  _query.value = "";
  emits("clear", true);
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
