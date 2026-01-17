<template>
  <div>
    <div
      variant="text"
      class="text-center pt-3 pb-3 footer-bg"
      style="justify-content: space-around"
    >
      <span v-for="(item, index) in navMenu" :key="index">
        <!-- Use anchor tag for external/static links, NuxtLink for internal routes -->
        <a
          v-if="item.isExternal"
          :href="item.link"
          class="context-link px-2"
          style="
            font-size: 14px;
            font-family: &quot;Roboto&quot;, sans-serif !important;
            font-weight: 900;
            display: inline-block;
            min-height: 44px;
            line-height: 44px;
            padding: 0 12px;
          "
          >&nbsp;{{ item.main }}&nbsp;</a
        >
        <NuxtLink
          v-else
          :to="item.link"
          class="context-link px-2"
          style="
            font-size: 14px;
            font-family: &quot;Roboto&quot;, sans-serif !important;
            font-weight: 900;
            display: inline-block;
            min-height: 44px;
            line-height: 44px;
            padding: 0 12px;
          "
          >&nbsp;{{ item.main }}&nbsp;</NuxtLink
        >
      </span>
      <!-- <NuxtLink
        to="/sandbox"
        class="context-link px-2"
        style="
          font-size: 14px;
          font-family: 'Roboto', sans-serif !important;
          font-weight: 900;
        "
        >Debug</NuxtLink
      > -->
    </div>
  </div>
</template>

<script setup>
const appConfig = useAppConfig();
const navMenu = JSON.parse(JSON.stringify(appConfig.footerMenu));
const menuLength = navMenu.length;
</script>

<style scoped>
a.context-link {
  font-family: "Raleway" !important;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  display: inline-block;
  min-height: 44px;
  line-height: 44px;
  padding: 0 12px;
}

a.context-link:hover {
  /* text-decoration: underline; */
  color: #aaa;
}
.footer-bg {
  background: #11568e;
  min-width: 100%;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
}
</style>
