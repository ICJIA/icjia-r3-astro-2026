<template>
  <div
    style="
      background: #0e4474;
      border-bottom: 1px solid #aaa;
      font-size: 13px;
      z-index: 99999 !important;
    "
    class="text-left pr-5 pl-5 py-1 elevation-0"
  >
    <nuxt-link to="/" class="breadcrumb-link" style="color: white"
      >R3 HOME</nuxt-link
    >

    <span v-for="(section, index) in sections" :key="section.url">
      <span style="color: #fff" class="breadcrumb-link"
        >&nbsp;&nbsp;>&nbsp;&nbsp;</span
      >

      <nuxt-link
        :to="section.url"
        class="breadcrumb-link"
        style="color: white"
        v-if="index < sections.length - 1 && section.name !== 'graduations'"
        >{{ makeTitle(section.name) }}
      </nuxt-link>
      <span style="color: #fff" v-else>{{
        truncateString(makeTitle(section.name))
      }}</span>
    </span>
  </div>
</template>

<script setup>
const route = useRoute();
const path = route.path;
const router = useRouter();

const dirs = path.split("/");
const sections = [];

// Linkify route sections
while (dirs.length) {
  sections.unshift({ url: dirs.join("/"), name: dirs.pop() });
}

const truncateString = function (str, num = 25) {
  if (str.length <= num) {
    return str;
  }

  return str.slice(0, num) + "...";
};

sections.shift();

console.log("split path: ", sections);

const makeTitle = (slug) => {
  // remove initial slash
  slug = slug.replace(/^\/+/g, "").replace("/", " > ");

  const words = slug.split("-");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(" ");
};
</script>

<style scoped>
.breadcrumb-link {
  font-size: 12px;
}
</style>
