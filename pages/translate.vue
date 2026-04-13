<template>
  <div>
    <!-- Page-level skip links (global skip links in app.vue provide #main-content and #navigation) -->
    <nav aria-label="Translation page navigation" class="skip-links">
      <a href="#language-selection" class="skip-link">Skip to language selection</a>
      <a href="#translation-info" class="skip-link">Skip to translation information</a>
    </nav>

    <v-container>
      <v-row>
        <v-col>
          <h1>Translation Options</h1>
          
          <!-- Language Selection Section -->
          <div id="language-selection" tabindex="-1" class="mt-3 mb-3" role="region" aria-labelledby="language-heading">
            <h2 id="language-heading" class="sr-only">Select a language to translate this page</h2>
            <p class="sr-only">
              Choose one of the five most commonly spoken languages in Illinois to translate this page using Google Translate.
            </p>
            
            <v-container>
              <v-row justify="center">
                <v-col 
                  cols="12" 
                  sm="6" 
                  md="4" 
                  lg="auto"
                  v-for="language in languages" 
                  :key="language.code"
                  class="language-col"
                >
                  <v-btn
                    :id="`language-btn-${language.code}`"
                    size="large"
                    variant="outlined"
                    color="primary"
                    class="translate-button"
                    :aria-label="`Translate page to ${language.name}. Opens in new window.`"
                    @click="googleTranslate(language.code)"
                    @keydown.enter="googleTranslate(language.code)"
                    @keydown.space.prevent="googleTranslate(language.code)"
                    style="
                      min-width: 200px;
                      min-height: 44px;
                      width: 100%;
                      max-width: 250px;
                      margin-bottom: 12px;
                      font-weight: 600;
                    "
                  >
                    {{ language.name }}
                    <span class="sr-only">(opens in new window)</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>

          <v-divider class="my-6" role="separator" aria-orientation="horizontal"></v-divider>

          <!-- Translation Information Section -->
          <div id="translation-info" tabindex="-1" class="mt-3" role="region" aria-labelledby="info-heading">
            <h2 id="info-heading" class="sr-only">Translation Information</h2>
            <div style="font-size: 16px; font-weight: 400">
              <p>
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
              </p>
              <p>
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
              </p>
              <div
                class="text-center mt-3"
                style="font-weight: 700; font-size: 16px"
              >
                If you need additional language assistance services for this
                website, please email:
                <a 
                  href="mailto:LAPRequests@illinois.gov"
                  aria-label="LAPRequests@illinois.gov, email for language assistance"
                  style="
                    color: #0d4474;
                    text-decoration: underline;
                    min-height: 44px;
                    display: inline-block;
                    padding: 4px 8px;
                  "
                >
                  LAPRequests@illinois.gov
                </a>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
/**
 * Translate page component
 * Provides translation options for the five most commonly spoken languages in Illinois
 * Uses Google Translate service to translate the website content
 */

// SEO Configuration for Translate page
usePageSeo({
  title: "Translation Options - R3 Program",
  description:
    "Translate the R3 (Restore, Reinvest, Renew) program website into Spanish, Polish, Chinese, Tagalog, or Arabic using Google Translate.",
  path: "/translate",
  keywords: [
    "R3 translation",
    "language assistance",
    "Spanish translation",
    "Polish translation",
    "Chinese translation",
    "Tagalog translation",
    "Arabic translation",
    "Illinois language services",
  ],
});

// Add breadcrumb schema
useBreadcrumbListSchema([
  { name: "Home", url: "/" },
  { name: "Translation Options", url: "/translate" },
]);

/**
 * Array of the five most commonly spoken languages in Illinois (after English)
 * Based on U.S. Census data
 */
const languages = [
  { name: "Spanish", code: "es" },
  { name: "Polish", code: "pl" },
  { name: "Chinese (Simplified)", code: "zh-CN" },
  { name: "Tagalog", code: "tl" },
  { name: "Arabic", code: "ar" },
];

/**
 * Opens Google Translate with the selected language
 * @param {string} lang - The language code (e.g., 'es', 'pl', 'zh-CN')
 */
const googleTranslate = (lang) => {
  const { root } = useAppConfig();
  const route = `${root}`;
  const url =
    `https://translate.google.com/translate?hl=en&sl=en&u=${route}&tl=` + lang;
  window.open(url, "_blank", "noopener,noreferrer");
};
</script>

<style lang="scss" scoped>
/* Skip Links for Accessibility */
.skip-links {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 1000;
}

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  background: #0d4474;
  color: #fff;
  padding: 12px 24px;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 4px 0;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  z-index: 1001;
  clip: rect(0, 0, 0, 0);
  overflow: hidden;
}

.skip-link:focus {
  position: relative;
  top: 0;
  left: 0;
  clip: auto;
  overflow: visible;
  outline: 3px solid #fff;
  outline-offset: 2px;
}

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

/* Language button styles */
.translate-button {
  transition: all 0.2s ease;
}

.translate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.translate-button:focus-visible {
  outline: 3px solid #0d4474;
  outline-offset: 2px;
}

/* Responsive layout - Center buttons */
.language-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 960px) {
  .language-col {
    flex: 0 0 auto;
    max-width: none;
  }
  
  .translate-button {
    width: auto;
    min-width: 200px;
  }
}

@media (max-width: 959px) {
  .language-col {
    width: 100%;
    max-width: 100%;
  }
  
  .translate-button {
    width: 100%;
    max-width: 300px;
  }
}

/* Ensure proper spacing and accessibility */
#language-selection {
  margin-top: 24px;
  margin-bottom: 24px;
}

#translation-info {
  margin-top: 24px;
}

/* Email link accessibility */
a[href^="mailto:"] {
  color: #0d4474;
  text-decoration: underline;
}

a[href^="mailto:"]:hover,
a[href^="mailto:"]:focus {
  color: #062a47;
  text-decoration: underline;
}

a[href^="mailto:"]:focus-visible {
  outline: 2px solid #0d4474;
  outline-offset: 2px;
}
</style>
