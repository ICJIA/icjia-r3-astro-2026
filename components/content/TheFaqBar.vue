<template>
  <div>
    <div v-if="isMounted">
      <v-container fluid
        ><v-row
          ><v-col cols="11">
            CurrentIndex: {{ currentIndex }} Results: {{ results.length }}
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
              />
            </v-form> </v-col></v-row
      ></v-container>

      <v-btn
        size="x-small"
        append-icon="mdi-arrow-up"
        elevation="2"
        variant="tonal"
        @click="$emit('prev')"
        dark
        style="font-weight: 900"
        >Previous</v-btn
      >&nbsp;&nbsp;
      <v-btn
        size="x-small"
        append-icon="mdi-arrow-down"
        elevation="2"
        variant="tonal"
        style="font-weight: 900"
        @click="$emit('next')"
        >Next</v-btn
      >&nbsp;&nbsp;
      <v-btn
        size="x-small"
        elevation="0"
        append-icon="mdi-close-circle"
        @click="$emit('clear')"
        >Clear</v-btn
      >
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
const emits = defineEmits(["query", "prev", "next", "clear"]);
defineProps({
  currentIndex: Number,
  results: Array,
});

// console.log("faqbar component props: ", props);

let isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
  console.log("faqbar component mounted");
});

let _query = ref("");

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
</script>

<style lang="scss" scoped></style>
