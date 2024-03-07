<template>
  <div>
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
                  label="Search R3 FAQs"
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
          @click="$emit('prev')"
          dark
          style="font-weight: 900"
          ><v-icon>mdi-arrow-up</v-icon></v-btn
        >&nbsp;
        <v-btn
          size="x-small"
          elevation="2"
          variant="tonal"
          style="font-weight: 900"
          @click="$emit('next')"
          ><v-icon>mdi-arrow-down</v-icon></v-btn
        >&nbsp;
        <!-- <v-btn size="x-small" elevation="0" @click="clear"
          ><v-icon>mdi-close-circle</v-icon></v-btn
        > -->
      </v-app-bar>
    </div>
    <!-- <div v-else>Loading...</div> -->
  </div>
</template>

<script setup>
const emits = defineEmits(["query", "prev", "next", "clear"]);
defineProps({
  currentIndex: Number,
  results: Array,
  clear: Boolean,
});

// console.log("faqbar component props: ", props);

let isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
  console.log("faqbar component mounted");
});

let _query = ref("");

const clear = () => {
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
</script>

<style lang="scss" scoped></style>
