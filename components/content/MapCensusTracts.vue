<template>
  <div class="my-10">
    <!-- <div class="iframe-container"> -->
    <div style="font-weight: 900" class="flex d-flex mb-2 text-left">
      <!-- <span>* indicates high need R3 area</span> -->
      <v-spacer></v-spacer>
      <span class="mb-3 text-right" style="font-size: 11px; color: #333">
        Last updated: 02/28/2024
      </span>
    </div>

    <!-- <ClientOnly fallback-tag="span" fallback="Loading R3 Map..."> -->
    <!-- <div>
      <iframe
        style="width: 100%; height: 740px; border: none"
        title="R3 Eligible Service Areas"
        src="https://illinois.maps.arcgis.com/apps/webappviewer/index.html?id=137fa70c604e49ad976a6e3248d80068"
      ></iframe>
      <div style="font-size: 11px" class="text-left mt-1 hidden-sm-and-down">
        Source:&nbsp;
        <a
          href="https://illinois.maps.arcgis.com/apps/webappviewer/index.html?id=137fa70c604e49ad976a6e3248d80068"
        >
          https://illinois.maps.arcgis.com/apps/webappviewer/index.html?id=137fa70c604e49ad976a6e3248d80068
        </a>
      </div>
    </div> -->
    <div>
      <iframe
        style="width: 100%; height: 740px; border: none"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        title="R3 Areas Website Map"
        src="https://arcgis.com/apps/webappviewer/index.html?id=c01e33ed59c441f79b6e054c3b77cf79"
      ></iframe>
      <div style="font-size: 11px" class="text-left mt-1 hidden-sm-and-down">
        Source:&nbsp;
        <a
          href="https://arcgis.com/apps/webappviewer/index.html?id=c01e33ed59c441f79b6e054c3b77cf79"
        >
          https://arcgis.com/apps/webappviewer/index.html?id=c01e33ed59c441f79b6e054c3b77cf79
        </a>
      </div>
    </div>

    <!-- </ClientOnly> -->
  </div>
</template>

<script setup>
const { underConstruction } = useAppConfig();
</script>

<style>
.iframe-container {
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
  border: 1px solid #ccc;
}
.iframe-container iframe {
  border: 0;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
/* 4x3 Aspect Ratio */
.iframe-container-4x3 {
  padding-top: 75%;
}
</style>
