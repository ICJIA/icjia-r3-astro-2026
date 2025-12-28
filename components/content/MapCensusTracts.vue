<template>
  <div class="my-10">
    <!-- <div class="iframe-container"> -->
    <div style="font-weight: 900" class="flex d-flex mb-2 text-left">
      <!-- <span>* indicates high need R3 area</span> -->
      <v-spacer></v-spacer>
      <span class="mb-3 text-right" style="font-size: 11px; color: #333">
        Last updated: 12/28/2025
      </span>
    </div>

    <!-- <ClientOnly fallback-tag="span" fallback="Loading R3 Map..."> -->

    <h2 id="map-heading" class="mt-4">Eligibility Map</h2>
    <p id="map-desc" class="sr-only">
      Interactive map of R3‑eligible areas. Use arrow keys to pan and plus/minus
      keys to zoom, or open the full‑screen map below.
    </p>
    <a class="skip-map-link" href="#after-map">Skip the interactive map</a>

    <div
      class="map-scroll"
      tabindex="0"
      aria-label="Map container, scroll to view full map"
    >
      <section
        role="region"
        aria-labelledby="map-heading"
        aria-describedby="map-desc"
      >
        <iframe
          style="width: 100%; height: 740px; border: none"
          loading="lazy"
          title="R3 Eligibility Map – Interactive"
          src="https://arcgis.com/apps/webappviewer/index.html?id=c01e33ed59c441f79b6e054c3b77cf79"
        ></iframe>
        <p class="map-help mt-2">
          Tip: You can pan the map with arrow keys and zoom with plus/minus
          keys. If this map is difficult to use, open it in a new window:
          <a
            href="https://arcgis.com/apps/webappviewer/index.html?id=c01e33ed59c441f79b6e054c3b77cf79"
            target="_blank"
            rel="noopener"
            >Open full‑screen map</a
          >.
        </p>
        <div style="font-size: 11px" class="text-left mt-1 hidden-sm-and-down">
          Source:&nbsp;
          <a
            href="https://arcgis.com/apps/webappviewer/index.html?id=c01e33ed59c441f79b6e054c3b77cf79"
          >
            https://arcgis.com/apps/webappviewer/index.html?id=c01e33ed59c441f79b6e054c3b77cf79
          </a>
        </div>
      </section>
    </div>

    <div id="after-map" tabindex="-1"></div>

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

/* Accessibility helpers */
.sr-only {
  position: absolute;
  left: -9999px;
}
.skip-map-link:focus {
  outline: 2px solid #000;
}
.map-help {
  font-size: 0.9rem;
  color: #333;
}
</style>
