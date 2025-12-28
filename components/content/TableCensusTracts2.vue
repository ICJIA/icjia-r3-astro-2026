<template>
  <div>
    <v-container fluid style="margin: 0; padding: 0" class="mb-10">
      <v-row>
        <v-col sm="12" md="6">
          <div style="font-size: 11px">
            Download:

            <a
              class="heavy"
              target="_blank"
              href="https://r3.icjia-api.cloud/uploads/Eligible_Area_Census_Tracts2024_487b8af3ae.json"
              >JSON</a
            >&nbsp;|&nbsp;<a
              class="heavy"
              target="_blank"
              href="https://r3.icjia-api.cloud/uploads/Eligible_Area_Census_Tracts2024_fac6fabd16.csv"
              >CSV</a
            >
          </div>
        </v-col>
        <v-col sm="12" md="6">
          <div
            class="text-right"
            style="font-size: 11px; color: #222; font-weight: 900"
          >
            Last updated: 12/28/2025
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- <div id="doublescroll" style="overflow-x: auto"> -->
    <div
      style="overflow-x: auto"
      tabindex="0"
      role="region"
      aria-label="R3 Eligible Area Census Tracts data table"
    >
      <table id="example" class="display" style="font-size: 12px; width: 100%">
        <thead>
          <tr>
            <th>R3 AREA ID</th>
            <th>R3 Funding Region</th>
            <th>R3 Funding Region Name</th>
            <th>GEOID</th>
            <th>Census Tract Name</th>
            <th>High Need Area</th>
            <th>Tier 1 Funding Range</th>
            <th>Tier 2 Funding Range</th>
            <th>Tier 3 Funding Range</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in censusTracts" :key="`item-${index}`">
            <td>{{ item.R3_AREA_ID }}</td>
            <td>{{ item.R3_Funding_Region }}</td>
            <td>{{ item.R3_Funding_Region_Name }}</td>
            <td>{{ item.GEOID }}</td>
            <td>{{ item.Census_Tract_Name }}</td>
            <td>{{ item.High_Need_Area }}</td>
            <td>{{ item.Tier_1_Funding_Range }}</td>
            <td>{{ item.Tier_2_Funding_Range }}</td>
            <td>{{ item.Tier_3_Funding_Range }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import censusTracts from "~/assets/json/EligibleAreaCensusTracts2024.json";

// console.dir(censusTracts);
const isLoaded = ref(false);

function doubleScroll(element) {
  const scrollbar = document.createElement("div");
  scrollbar.appendChild(document.createElement("div"));
  scrollbar.style.overflow = "auto";
  scrollbar.style.overflowY = "hidden";
  scrollbar.style.marginBottom = "15px";
  scrollbar.firstChild.style.width = element.scrollWidth + "px";
  scrollbar.firstChild.style.paddingTop = "1px";
  scrollbar.firstChild.appendChild(document.createTextNode("\xA0"));
  let running = false;
  scrollbar.onscroll = function () {
    if (running) {
      running = false;
      return;
    }
    running = true;
    element.scrollLeft = scrollbar.scrollLeft;
  };
  element.onscroll = function () {
    if (running) {
      running = false;
      return;
    }
    running = true;
    scrollbar.scrollLeft = element.scrollLeft;
  };
  element.parentNode.insertBefore(scrollbar, element);
}

useHead({
  bodyAttrs: {},

  // link: [
  //   {
  //     rel: "stylesheet",
  //     href: "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.css",
  //   },
  // ],
  // script: [
  //   {
  //     body: true,
  //     src: "https://code.jquery.com/jquery-3.7.1.slim.min.js",
  //   },
  //   {
  //     src: "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-print-2.3.3/fh-3.3.1/r-2.4.0/sb-1.4.0/sp-2.1.0/datatables.min.js",
  //     body: true,
  //   },
  // ],
});

onMounted(() => {
  $(document).ready(async () => {
    await nextTick();
    setTimeout(() => {
      $("#example").DataTable({
        responsive: false,
        autoWidth: false,
        pageLength: 25,
        fixedHeader: true,
        aLengthMenu: [
          [25, 50, 100, 250, -1],
          [25, 50, 100, 250, "All"],
        ],
      });
    }, 1500);

    // doubleScroll(document.getElementById("doublescroll"));
    isLoaded.value = true;
  });
});
</script>

<style scoped></style>
