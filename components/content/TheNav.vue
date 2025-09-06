<template>
  <div>
    <v-app-bar
      fixed
      app
      color="white"
      density="default"
      style="z-index: 50; width: 100%"
      size="90"
      elevation="3"
      class="pl-5 pr-5"
    >
      <div
        v-if="!nav"
        class="hover hamburger text-center hidden-md-and-up"
        @click="toggleNav"
        role="button"
        tabindex="0"
        aria-label="Open navigation menu"
        @keydown.enter="toggleNav"
        @keydown.space="toggleNav"
      >
        <v-icon icon="mdi-menu" size="large" aria-hidden="true"></v-icon>
        <div style="font-size: 10px; font-weight: 900">MENU</div>
      </div>
      <div
        v-else
        class="hover hamburger text-center hidden-md-and-up"
        @click="toggleNav"
        role="button"
        tabindex="0"
        aria-label="Close navigation menu"
        @keydown.enter="toggleNav"
        @keydown.space="toggleNav"
      >
        <v-icon
          icon="mdi-window-close"
          size="large"
          aria-hidden="true"
        ></v-icon>
        <div style="font-size: 10px; font-weight: 900">CLOSE</div>
      </div>
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <!-- <img
        alt="ICJIA Logo"
        class="hover ml-4 mr-4"
        src="/i2iSmall.png"
        width="55"
        height="55"
        @click="$router.push('/')"
      /> -->
      <div class="hover hidden-sm-and-down">
        <span
          style="
            font-weight: 900 !important;
            font-size: 22px;
            letter-spacing: 0.004em;
            font-family: &quot;Roboto&quot;, sans-serif !important;
          "
          class="agency app-title"
          @click="$router.push('/')"
          ><span>R3</span>&nbsp;&nbsp;RESTORE. REINVEST. RENEW.
        </span>
      </div>

      <div class="hover hidden-md-and-up hidden-xs">
        <span
          style="
            font-weight: 900 !important;
            font-size: 14px;
            letter-spacing: 0.004em;
            font-family: &quot;Roboto&quot;, sans-serif !important;
          "
          class="agency app-title"
          @click="$router.push('/')"
          ><span>R3</span>&nbsp;&nbsp;RESTORE. REINVEST. RENEW.
        </span>
      </div>

      <div class="hover hidden-sm-and-up">
        <span
          style="
            font-weight: 900 !important;
            font-size: 30px;
            letter-spacing: 0.004em;
            font-family: &quot;Roboto&quot;, sans-serif !important;
          "
          class="agency app-title"
          @click="$router.push('/')"
          ><span>R3</span>
        </span>
      </div>

      <v-spacer></v-spacer>
      <span v-if="isMounted">
        <span
          v-for="(menu, index) in navMenu"
          :key="`main-${index}`"
          style="display: inline-block"
        >
          <span v-if="menu && menu?.children">
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  size="default"
                  class="hidden-sm-and-down navItem"
                  v-bind="props"
                  style="font-family: Roboto, sans-serif !important"
                >
                  {{ menu.main }}
                  <v-icon right small aria-hidden="true"
                    >mdi-menu-down</v-icon
                  ></v-btn
                >
              </template>
              <v-list nav elevation="2">
                <span
                  v-for="(child, index) in menu.children"
                  :key="`child-${index}`"
                >
                  <v-divider v-if="child.divider"></v-divider>
                  <v-list-item-title
                    v-if="child.section"
                    style="
                      margin-top: 10px;
                      font-weight: 900;
                      color: #555;
                      font-family: Roboto, sans-serif !important;
                    "
                    class="pr-5"
                    >{{ child.section }}</v-list-item-title
                  >
                  <v-list-item
                    v-if="child?.link"
                    class="appNav hover"
                    :to="child?.external ? null : child?.link"
                    :href="child?.external ? child?.link : null"
                    :target="child?.external ? '_blank' : null"
                  >
                    <v-list-item-title style="font-size: 12px !important"
                      >{{ child.title }}
                      <span v-if="child?.external">External</span>
                      <v-icon
                        v-if="child.icon"
                        small
                        right
                        color="black"
                        aria-hidden="true"
                        >{{ child.icon }}</v-icon
                      ></v-list-item-title
                    >
                  </v-list-item>
                </span>
              </v-list>
            </v-menu>
          </span>
          <span v-else class="d-flex">
            <v-btn
              :to="menu?.external ? null : menu?.link"
              :href="menu?.external ? menu.link : null"
              :target="menu?.external ? '_blank' : null"
              :aria-label="menu.main"
              variant="text"
              size="default"
              class="hidden-sm-and-down navItem"
              style="font-weight: 900 !important; font-size: 16px"
              >{{ menu.main }}&nbsp;
              <v-icon
                v-if="menu.icon"
                right
                small
                color="black"
                aria-hidden="true"
                >{{ menu.icon }}</v-icon
              >
            </v-btn>
          </span>
        </span>
        <v-btn
          variant="text"
          size="default"
          class="hidden-md-and-down navItem"
          style="font-weight: 900 !important; font-size: 16px"
          @click="goToSearch"
          aria-label="Search"
        >
          <v-tooltip activator="parent" location="bottom"> Search </v-tooltip>
          <v-icon icon="mdi-magnify" size="large" aria-hidden="true"></v-icon>
        </v-btn>

        <!-- <v-btn
          size="default"
          class="hidden-md-and-down navItem"
          style="font-weight: 900 !important; font-size: 16px"
          to="/translate"
        >
          <v-tooltip activator="parent" location="bottom"> Translate </v-tooltip
          ><v-icon icon="mdi-web" size="large"></v-icon
        ></v-btn> -->

        <span
          class="hover hamburger text-center hidden-md-and-up"
          @click="goToSearch"
          role="button"
          tabindex="0"
          aria-label="Search"
          @keydown.enter="goToSearch"
          @keydown.space="goToSearch"
        >
          <v-icon icon="mdi-magnify" size="large" aria-hidden="true"></v-icon>
          <div style="font-size: 10px; font-weight: 900">SEARCH</div>
        </span>
      </span>

      <span v-else class="text center ml-12"><TheLoader></TheLoader></span>
    </v-app-bar>
  </div>
</template>

<script setup>
/**
 * @fileoverview Primary navigation component for the ICJIA R3 Nuxt 3 application.
 *
 * This component provides the main navigation bar with responsive design,
 * including mobile hamburger menu, search functionality, and translation options.
 * It features the R3 branding and handles navigation state management.
 *
 * @component TheNav
 * @example
 * ```vue
 * <template>
 *   <TheNav />
 * </template>
 * ```
 *
 * @since 1.0.0
 */
/**
 * Reactive reference tracking component mount status.
 * Used to prevent hydration issues and ensure proper client-side rendering.
 *
 * @type {Ref<boolean>}
 */
const isMounted = ref(false);

/**
 * Reactive navigation toggle state from the global state management.
 * Controls the visibility of the mobile navigation menu.
 *
 * @type {Ref<boolean>}
 */
const nav = useNavToggle();

/**
 * Toggles the mobile navigation menu visibility.
 * Inverts the current navigation state for responsive menu control.
 *
 * @function toggleNav
 * @example
 * ```javascript
 * // Called when hamburger menu is clicked
 * toggleNav(); // Opens/closes mobile menu
 * ```
 */
const toggleNav = () => {
  nav.value = !nav.value;
};

/**
 * Application configuration object containing navigation menu structure.
 * Provides access to the navigation menu items and their properties.
 *
 * @type {Object}
 */
const appConfig = useAppConfig();

/**
 * Deep copy of the navigation menu configuration.
 * Creates an independent copy to prevent mutations of the original config.
 * Array of navigation menu items.
 *
 * @type {Array<Object>}
 */
const navMenu = JSON.parse(JSON.stringify(appConfig.navMenu));

/**
 * Determines if a URL is external to the application.
 * Currently returns true for all URLs - may need refinement for actual external link detection.
 *
 * @param {string} url - The URL to check
 * @returns {boolean} Always returns true (placeholder implementation)
 *
 * @example
 * ```javascript
 * const external = isExternalUrl("https://example.com"); // true
 * const internal = isExternalUrl("/about"); // true (should be false)
 * ```
 *
 * @todo Implement proper external URL detection logic
 */
const isExternalUrl = (url) => {
  return true;
};

/**
 * Component lifecycle hook that runs after the component is mounted.
 * Sets the mounted state to true for proper client-side rendering.
 */
onMounted(() => {
  isMounted.value = true;
});

/**
 * Vue Router instance for programmatic navigation.
 * Used for navigating to different routes within the application.
 *
 * @type {Router}
 */
const router = useRouter();

/**
 * Navigates to the search page.
 * Programmatically routes the user to the search functionality.
 *
 * @function goToSearch
 * @example
 * ```javascript
 * // Called when search button is clicked
 * goToSearch(); // Navigates to /search
 * ```
 */
const goToSearch = () => {
  router.push({ path: "/search" });
};

/**
 * Opens the translation modal dialog.
 * Activates the translation toggle state to show the translation interface.
 *
 * @function openTranslationModal
 * @example
 * ```javascript
 * // Called when translate button is clicked
 * openTranslationModal(); // Shows translation modal
 * ```
 */
const openTranslationModal = () => {
  const toggleState = useTranslateToggle();
  toggleState.value = true;
};

/**
 * Sample menu items for development/testing purposes.
 * Contains placeholder menu items that may be used for testing navigation components.
 * Reactive array of menu items.
 *
 * @type {Ref<Array<Object>>}
 * @property {string} title - Display title for the menu item
 *
 * @todo Remove or replace with actual menu items if not needed
 */
const items = ref([
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me 2" },
]);
</script>

<style lang="scss" scoped>
.navItem {
  color: #333 !important;
  font-weight: 900;
}
</style>
