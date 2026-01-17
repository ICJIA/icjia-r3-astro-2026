<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="card in cards" :key="card.title" cols="12" :md="card.flex">
        <v-card elevation="5" class="info-card" @click="routeToLink(card.link)">
          <v-img
            :src="card.src"
            :lazy-src="card.lazySrc"
            :alt="card.title + ' - ' + card.text"
            gradient="to bottom, rgba(0,0,0,.6), rgba(0,0,0,.1)"
            height="300px"
            cover
            crossorigin
          >
            <template v-slot:placeholder>
              <div
                class="d-flex align-center justify-center fill-height"
                role="status"
                aria-live="polite"
                aria-label="Loading image"
              >
                <v-progress-circular
                  color="grey-lighten-4"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
            <div class="px-3 py-5">
              <v-card-title
                class="text-white"
                style="
                  border-bottom: 1px solid #ddd;
                  font-weight: 700;
                  font-size: 26px;
                "
                v-text="card.title"
              ></v-card-title>
              <v-card-text class="text-white mt-3">{{ card.text }}</v-card-text>
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    cards: [
      {
        title: "Eligibility",
        src: "https://r3.icjia-api.cloud/uploads/medium_eligibility_unsplash_018a3e660b.jpg",
        flex: 6,
        text: "Find out if you're eligible to apply for funding",
        link: "/eligibility",
        thumbnail:
          "https://r3.icjia-api.cloud/uploads/thumbnail_eligibility_unsplash_018a3e660b.jpg",
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        src: "https://r3.icjia-api.cloud/uploads/medium_faqs_unsplash_db1670a0ab.jpg",
        flex: 6,
        text: "Frequently Asked Questions about the R3 funding process",
        link: "/faqs",
        thumbnail:
          "https://r3.icjia-api.cloud/uploads/thumbnail_faqs_unsplash_db1670a0ab.jpg",
      },
      {
        title: "Collaboratives",
        src: "https://r3.icjia-api.cloud/uploads/medium_collab_unsplash_636089005f.jpg",
        flex: 6,
        text: "Groups of two or more organizations that apply for funding for a single program under one application",
        link: "/collaboratives",
        thumbnail:
          "https://r3.icjia-api.cloud/uploads/thumbnail_collab_unsplash_636089005f.jpg",
      },
      {
        title: "Resources",
        src: "https://r3.icjia-api.cloud/uploads/medium_resources2_unsplash_18ead79024.jpg",
        flex: 6,
        text: "R3 resources and analysis",
        link: "/resources",
        thumbnail:
          "https://r3.icjia-api.cloud/uploads/thumbnail_resources2_unsplash_18ead79024.jpg",
      },
    ],
  }),
  methods: {
    routeToLink(link) {
      this.$router.push(link);
    },
  },
};
</script>
