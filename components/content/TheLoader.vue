<template>
  <div class="text-center" role="status" aria-live="polite">
    <span>LOADING</span>
    <img src="/loading.gif" alt="Loading content, please wait..." />
    <span class="sr-only">Loading content, please wait...</span>
  </div>
</template>

<script setup></script>

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
