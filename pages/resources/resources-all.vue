<template>
  <div>
    <v-container
      ><v-row
        ><v-col>
          <h1 class="mx-auto text-center" style="color: red">
            Under construction.
          </h1>
          <div v-for="(item, index) in sortedResources" :key="item._id">
            <v-card class="mx-auto my-12 px-5 py-5"
              ><h2>{{ item.title }}</h2>
              <br />{{ item }}</v-card
            >
          </div>
        </v-col></v-row
      ></v-container
    >
  </div>
</template>

<script setup>
import _ from "lodash";
import moment from "moment";
const { path } = useRoute();
const router = useRouter();
const { data: resources } = await useAsyncData(`resources`, async () => {
  const post = await queryContent("/resources").find();
  return post;
});

// sort resources by ranking
const sortedResources = _.orderBy(resources.value, ["ranking"], ["asc"]);
</script>

<style lang="scss" scoped></style>
