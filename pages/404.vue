<template>
  <div style="background: #eee; min-height: 100vh">
    <v-container style="margin-top: 30px">
      <v-row>
        <v-col class="text-center">
          <div style="margin-top: 0px">
            <div style="font-weight: 900; font-size: 120px; color: #0d4474">
              Oops
            </div>
            <div style="font-weight: 700; font-size: 48px" class="mt-0">
              404 | Page not found
            </div>
            <div class="mt-16">
              <v-btn text color="#0D4474" dark to="/" class="mr-2 mt-3"
                >R3 Home&nbsp;&raquo;</v-btn
              >
              <v-btn text color="#0D4474" dark to="/funding" class="mr-2 mt-3"
                >R3 Funding&nbsp;&raquo;</v-btn
              >
              <v-btn
                text
                color="#0D4474"
                dark
                to="/eligibility"
                class="mr-2 mt-3"
                >R3 Eligibility&nbsp;&raquo;</v-btn
              >
              <!-- <v-btn text color="#0D4474" dark to="/news" class="mr-2 mt-3"
                >R3 News&nbsp;&raquo;</v-btn
              > -->
              <v-btn text color="#0D4474" dark to="/faqs" class="mr-2 mt-3"
                >R3 FAQs&nbsp;&raquo;</v-btn
              >
              <v-btn text color="#0D4474" dark to="/contact" class="mr-2 mt-3"
                >Contact R3&nbsp;&raquo;</v-btn
              >

              <!-- <v-btn x-small to="/web-support/" class="ml-2"
              >Contact web support</v-btn
            > -->
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const query = useRoute().query;
const router = useRouter();
const referrer = ref(
  query.referrer ? decodeURIComponent(query.referrer) : null
);

const destination = ref(
  query.destination ? decodeURIComponent(query.destination) : null
);

console.log(
  "404 -- referrer: ",
  referrer.value,
  " destination: ",
  destination.value
);

const goHome = () => router.push("/");

useHead({
  title: "404 Page Not Found",
  meta: [
    {
      name: "description",
      content: "404 - Page not found",
    },
  ],
});

onMounted(() => {
  useTrackEvent("404-error", {
    props: {
      path: document.location.pathname,
      referrer: referrer.value,
      destination: destination.value,
    },
  });
});
</script>
