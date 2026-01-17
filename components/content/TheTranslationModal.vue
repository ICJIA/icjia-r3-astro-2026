<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      scroll-strategy="none"
      role="dialog"
      aria-labelledby="translation-title"
      aria-describedby="translation-description"
      aria-modal="true"
    >
      <v-card>
        <v-card-title
          id="translation-title"
          class="text-center py-3"
          style="background: #eee; font-size: 20px; font-weight: 900"
        >
          ICJIA Website Translation Options
        </v-card-title>
        <v-card-text id="translation-description" class="mt-3 mb-3">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('es')"
                  aria-label="Translate page to Spanish"
                  >Spanish</v-btn
                >
                <br />
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('pl')"
                  aria-label="Translate page to Polish"
                  >Polish</v-btn
                >
                <br />
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('zh-CN')"
                  aria-label="Translate page to Simplified Chinese"
                  >Chinese (Simplified)</v-btn
                >
                <br />
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('zh-TW')"
                  aria-label="Translate page to Traditional Chinese"
                  >Chinese (Traditional)</v-btn
                >
                <br />
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('tl')"
                  aria-label="Translate page to Tagalog"
                  >Tagalog</v-btn
                >
                <br />
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('ar')"
                  aria-label="Translate page to Arabic"
                  >Arabic</v-btn
                >
                <br />
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('hi')"
                  aria-label="Translate page to Hindi"
                  >Hindi</v-btn
                >
                <br />
                <v-btn
                  size="small"
                  variant="text"
                  class="translate-button"
                  @click="googleTranslate('ur')"
                  aria-label="Translate page to Urdu"
                  >Urdu</v-btn
                >
                <br />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-expand-transition>
          <div class="mt-3">
            <v-card-text style="font-size: 11px; font-weight: 700">
              The Illinois Criminal Justice Information Authority ('ICJIA')
              offers translations of the content through Google Translate.
              Because Google Translate is an external website, ICJIA does not
              control the quality or accuracy of translated content. All ICJIA
              content is filtered through Google Translate which may result in
              unexpected and unpredictable degradation of portions of text,
              images and the general appearance on translated pages. Google
              Translate may maintain unique privacy and use policies. These
              policies are not controlled by ICJIA and are not associated with
              ICJIA's privacy and use policies.
              <br />
              <br />
              ICJIA would like to ensure that it provides Limited English
              Proficiency (LEP) individuals with meaningful and universal access
              to ICJIA services, programs, and activities by all persons,
              including those who self-identify as an LEP individual or have a
              preference for information and materials in a language other than
              English. To support its goals of being inclusive and accessible to
              all, ICJIA provides free language assistance services to
              individuals whose primary language is not English. Language
              assistance services include providing qualified interpreters and
              translating documents to ease access to important information
              about ICJIA programs, benefits, and activities.
              <div
                class="text-center mt-3"
                style="font-weight: 700; font-size: 11px"
              >
                If you need additional language assistance services, please
                email:
                <a href="mailto:LAPRequests@illinois.gov"
                  >LAPRequests@illinois.gov</a
                >
              </div>
              .
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
/**
 * @fileoverview Translation modal component with enhanced accessibility features.
 * Provides Google Translate integration with proper ARIA attributes and keyboard navigation.
 */

const dialog = ref(false);
const show = ref(true);
const toggleState = useTranslateToggle();

/**
 * Closes the translation dialog and resets toggle state.
 * Includes focus management for accessibility.
 */
const closeDialog = () => {
  dialog.value = false;
  toggleState.value = false;
};

/**
 * Watch for dialog state changes and sync with toggle state.
 * Ensures proper focus management when modal opens/closes.
 */
watch(dialog, (newValue) => {
  toggleState.value = newValue;

  // Focus management for accessibility
  if (newValue) {
    // When dialog opens, focus will be managed by Vuetify
    nextTick(() => {
      // Ensure the dialog title is announced to screen readers
      const titleElement = document.getElementById("translation-title");
      if (titleElement) {
        titleElement.focus();
      }
    });
  }
});

watchEffect(() => {
  dialog.value = toggleState.value;
});

/**
 * Opens Google Translate for the specified language.
 * @param {string} lang - Language code for translation
 */
const googleTranslate = (lang) => {
  show.value = false;
  dialog.value = false;
  const { root } = useAppConfig();
  const { fullPath } = useRoute();
  const route = `${root}${fullPath}`;
  const url =
    `https://translate.google.com/translate?hl=en&sl=en&u=${route}&tl=` + lang;
  window.open(url);
};
</script>

<style scoped>
.translate-button {
  font-weight: 900;
}
</style>
