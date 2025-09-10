<template>
  <div>
    <main id="main-content" role="main" aria-labelledby="error-heading">
      <v-container
        class="text-center"
        fill-height
        fluid
        style="background: #eaeaea; min-height: 100vh"
      >
        <v-row align="center" justify="center"
          ><v-col class="mt-12">
            <!-- Accessible page heading -->
            <h1 id="error-heading" class="sr-only">An error occurred</h1>
            <!-- Visual status code (large text with sufficient contrast) -->
            <div style="font-size: 120px; color: #444; font-weight: 700">
              {{ errorObj.error.statusCode }}
            </div>
            <p>
              <strong>{{ errorObj.error.statusMessage.split(":")[0] }}</strong>
            </p>

            <v-btn class="mt-8" @click="handleError">Go Home</v-btn>
          </v-col></v-row
        ></v-container
      >
    </main>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
});
console.log("Error: ", props.error.statusCode);
console.log("Error URL: ", props.error.url);
const errorObj = ref(props);

const handleError = () => clearError({ redirect: "/" });
</script>

<style scoped>
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
