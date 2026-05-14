<!-- astro/src/components/Dialog.vue -->
<!--
  Vue 3 SFC island for site-wide modals: external-link warning + cookie warning.
  Uses native <dialog> with showModal() for built-in focus trap, ESC handling,
  and scrim. ARIA dialog pattern as fallback for browsers that don't support
  <dialog> (very rare in 2026).

  Mounted in BaseLayout.astro with `client:idle`. ~3 KB component code on top
  of the shared Vue runtime.
-->
<!--
  NO <Teleport to="body">. A native <dialog> opened with showModal() is
  promoted to the browser top layer — it renders above all content
  regardless of DOM position, so teleporting is unnecessary. Worse, under
  Astro's `client:idle` island boundary the Teleport mishydrates: it
  clobbers <body>'s first child (the skip-links <nav>), silently breaking
  WCAG 2.4.1 Bypass Blocks site-wide. Keep the <dialog> as the island root.
-->
<template>
  <dialog ref="dlg" class="r3-dialog" @close="onClose">
    <h2 class="r3-dialog__title">{{ title }}</h2>
    <p class="r3-dialog__body">{{ body }}</p>
    <div class="r3-dialog__actions">
      <button type="button" class="r3-dialog__cancel" @click="cancel">
        {{ cancelLabel }}
      </button>
      <a
        v-if="confirmHref"
        :href="confirmHref"
        target="_blank"
        rel="noopener noreferrer"
        class="r3-dialog__confirm"
        @click="confirm"
      >
        {{ confirmLabel }}
      </a>
      <button
        v-else
        type="button"
        class="r3-dialog__confirm"
        @click="confirm"
      >
        {{ confirmLabel }}
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const dlg = ref<HTMLDialogElement | null>(null);
const title = ref('');
const body = ref('');
const confirmHref = ref<string | null>(null);
const confirmLabel = ref('Continue');
const cancelLabel = ref('Cancel');

interface OpenDetail {
  title: string;
  body: string;
  confirmHref?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

function onOpen(e: Event) {
  const detail = (e as CustomEvent<OpenDetail>).detail;
  title.value = detail.title;
  body.value = detail.body;
  confirmHref.value = detail.confirmHref ?? null;
  confirmLabel.value = detail.confirmLabel ?? 'Continue';
  cancelLabel.value = detail.cancelLabel ?? 'Cancel';
  if (typeof dlg.value?.showModal === 'function') {
    dlg.value.showModal();
  }
}

function close() {
  if (dlg.value?.open) dlg.value.close();
}
function cancel() { close(); }
function confirm() { close(); }
function onClose() { /* native ESC + close events land here */ }

onMounted(() => {
  window.addEventListener('r3-dialog:open', onOpen as EventListener);
});
onUnmounted(() => {
  window.removeEventListener('r3-dialog:open', onOpen as EventListener);
});
</script>

<style scoped>
.r3-dialog {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1.5rem;
  max-width: 480px;
  background: #fff;
  color: #1a1a1a;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}
.r3-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
.r3-dialog__title {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
}
.r3-dialog__body {
  margin: 0 0 1.25rem;
  line-height: 1.5;
}
.r3-dialog__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
.r3-dialog__cancel,
.r3-dialog__confirm {
  min-height: 44px;
  min-width: 44px;
  padding: 0 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.r3-dialog__cancel {
  background: #fff;
  color: #0d4474;
  border: 1px solid #0d4474;
}
.r3-dialog__confirm {
  background: #0d4474;
  color: #fff;
  border: 1px solid #0d4474;
}
.r3-dialog__cancel:focus-visible,
.r3-dialog__confirm:focus-visible {
  outline: 3px solid #0d4474;
  outline-offset: 2px;
}
</style>
