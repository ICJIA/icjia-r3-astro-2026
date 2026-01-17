<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="card in cards" :key="card.title" cols="12" :md="card.flex">
        <v-card elevation="5" class="info-card" @click="routeToLink(card.link)">
          <div style="position: relative">
            <NuxtImg
              :src="card.src"
              :placeholder="card.thumbnail"
              :alt="card.title + ' - ' + card.text"
              height="300"
              width="100%"
              fit="cover"
              loading="lazy"
              format="webp"
              quality="80"
              style="display: block; width: 100%; object-fit: cover; height: 300px"
              sizes="xs:100vw sm:100vw md:50vw"
            />
            <!-- Gradient overlay to match previous v-img gradient -->
            <div
              style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0.6),
                  rgba(0, 0, 0, 0.1)
                );
                pointer-events: none;
              "
            />
            <div
              class="px-3 py-5"
              style="position: absolute; top: 0; left: 0; width: 100%"
            >
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
          </div>
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
