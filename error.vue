<template>
  <div>
    <nav aria-label="Skip navigation" class="skip-links">
      <a href="#main-content" class="skip-link">Skip to main content</a>
    </nav>
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
              {{ statusCode }}
            </div>
            <p>
              <strong>{{ statusMessage }}</strong>
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

// Safely extract error properties with fallbacks
const statusCode = computed(() => props.error?.statusCode || 500);
const statusMessage = computed(() => {
  const msg = props.error?.statusMessage || "An error occurred";
  return msg.includes(":") ? msg.split(":")[0] : msg;
});

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

/* Skip links — mirror app.vue so the error page is keyboard-accessible too */
.skip-links {
  position: relative;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: #000000;
  color: #ffffff !important;
  padding: 12px 16px;
  text-decoration: none;
  font-weight: bold;
  border: 2px solid #ffffff;
  font-size: 16px;
  z-index: 10000;
  transition: top 0.2s ease;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  width: auto;
  white-space: nowrap;
}

.skip-link:focus-visible,
.skip-link:focus {
  top: 0;
  clip: auto;
  clip-path: none;
  outline: 3px solid #ffff00;
  outline-offset: 2px;
  box-shadow: 0 0 0 5px #000000;
}

.skip-link:focus:not(:focus-visible) {
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  top: -100px;
}

.skip-link:hover {
  background: #333333 !important;
  color: #ffffff !important;
  text-decoration: underline !important;
}

.skip-link:visited {
  color: #ffffff !important;
}
</style>
