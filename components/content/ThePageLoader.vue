<template>
  <div
    style="margin-top: 150px; margin-bottom: 150px"
    class="text-center"
    role="status"
    aria-live="polite"
  >
    <div class="text-center">
      <div style="font-weight: 700; font-size: 25px" class="mb-3">
        LOADING...
      </div>
      <img src="/loading.gif" alt="Loading content, please wait..." />
      <span class="sr-only">Loading content, please wait...</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
/* Screen reader only text for accessibility */
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
