<template>
  <v-app-bar
    id="navigation"
    role="banner"
    tabindex="-1"
    fixed
    app
    color="white"
    density="default"
    style="z-index: 50; width: 100%"
    size="90"
    elevation="3"
    class="pl-5 pr-5"
    aria-label="Site header"
  >
    <button
      v-if="!nav"
      type="button"
      class="hover hamburger text-center hidden-md-and-up aaa-hamburger"
      @click="toggleNav"
      aria-label="Open navigation menu"
      @keydown.enter="toggleNav"
      @keydown.space="toggleNav"
    >
      <v-icon icon="mdi-menu" size="x-large" aria-hidden="true"></v-icon>
      <div style="font-size: 10px; font-weight: 900">MENU</div>
    </button>
    <button
      v-else
      type="button"
      class="hover hamburger text-center hidden-md-and-up aaa-hamburger"
      @click="toggleNav"
      aria-label="Close navigation menu"
      @keydown.enter="toggleNav"
      @keydown.space="toggleNav"
    >
      <v-icon
        icon="mdi-window-close"
        size="x-large"
        aria-hidden="true"
      ></v-icon>
      <div style="font-size: 10px; font-weight: 900">CLOSE</div>
    </button>
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
      <nuxt-link
        to="/"
        style="
          font-weight: 900 !important;
          font-size: 22px;
          letter-spacing: 0.004em;
          font-family: &quot;Roboto&quot;, sans-serif !important;
          display: inline-block;
          min-height: 44px;
          line-height: 44px;
          padding: 0 8px;
          text-decoration: none;
          color: inherit;
        "
        class="agency app-title"
        aria-label="R3 RESTORE. REINVEST. RENEW. - Go to home page"
        >R3&nbsp;&nbsp;RESTORE. REINVEST. RENEW.
      </nuxt-link>
    </div>

    <div class="hover hidden-md-and-up hidden-xs">
      <nuxt-link
        to="/"
        style="
          font-weight: 900 !important;
          font-size: 14px;
          letter-spacing: 0.004em;
          font-family: &quot;Roboto&quot;, sans-serif !important;
          display: inline-block;
          min-height: 44px;
          line-height: 44px;
          padding: 0 8px;
          text-decoration: none;
          color: inherit;
        "
        class="agency app-title"
        aria-label="R3 RESTORE. REINVEST. RENEW. - Go to home page"
        >R3&nbsp;&nbsp;RESTORE. REINVEST. RENEW.
      </nuxt-link>
    </div>

    <div class="hover hidden-sm-and-up">
      <nuxt-link
        to="/"
        style="
          font-weight: 900 !important;
          font-size: 30px;
          letter-spacing: 0.004em;
          font-family: &quot;Roboto&quot;, sans-serif !important;
          display: inline-block;
          min-height: 44px;
          line-height: 44px;
          padding: 0 8px;
          text-decoration: none;
          color: inherit;
        "
        class="agency app-title"
        aria-label="R3 - Go to home page"
        >R3
      </nuxt-link>
    </div>

    <v-spacer></v-spacer>
    <span v-if="isMounted">
      <span
        v-for="(menu, index) in navMenu"
        :key="`main-${index}`"
        style="display: inline-block"
      >
        <span v-if="menu && menu?.children">
          <v-menu :close-on-content-click="true" @keydown.esc="closeMenu">
            <template #activator="{ props, isActive }">
              <v-btn
                variant="text"
                size="large"
                class="hidden-sm-and-down navItem"
                v-bind="props"
                style="
                  font-family: Roboto, sans-serif !important;
                  min-height: 44px;
                  padding: 12px 16px;
                "
                :aria-expanded="isActive ? 'true' : 'false'"
                :aria-haspopup="true"
                :aria-label="`${menu.main} menu. Press Enter or Space to open submenu.`"
                @keydown.enter="$event.target.click()"
                @keydown.space.prevent="$event.target.click()"
              >
                {{ menu.main }}
                <v-icon size="small" aria-hidden="true"
                  >mdi-menu-down</v-icon
                ></v-btn
              >
            </template>
            <v-list
              nav
              elevation="2"
              role="menu"
              :aria-label="`${menu.main} submenu`"
            >
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
                  :rel="child?.external ? 'noopener noreferrer' : null"
                  role="menuitem"
                  :aria-label="
                    child?.external
                      ? `${child.title} (opens in new window)`
                      : child.title
                  "
                  tabindex="0"
                  @keydown.enter="navigateToLink(child)"
                  @keydown.space.prevent="navigateToLink(child)"
                  style="min-height: 44px"
                >
                  <v-list-item-title style="font-size: 12px !important"
                    >{{ child.title }}
                    <span v-if="child?.external" class="sr-only">External</span>
                    <v-icon
                      v-if="child.icon"
                      size="small"
                      color="black"
                      aria-hidden="true"
                      class="ml-1"
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
            size="large"
            class="hidden-sm-and-down navItem"
            style="
              font-weight: 900 !important;
              font-size: 16px;
              min-height: 44px;
              padding: 12px 16px;
            "
            >{{ menu.main }}&nbsp;
            <v-icon
              v-if="menu.icon"
              size="small"
              color="black"
              aria-hidden="true"
              class="ml-1"
              >{{ menu.icon }}</v-icon
            >
          </v-btn>
        </span>
      </span>
      <v-btn
        variant="text"
        size="large"
        class="hidden-md-and-down navItem"
        style="
          font-weight: 900 !important;
          font-size: 16px;
          min-width: 44px;
          min-height: 44px;
          padding: 12px;
        "
        @click="goToSearch"
        aria-label="Search"
      >
        <v-tooltip activator="parent" location="bottom" aria-hidden="true">
          Search
        </v-tooltip>
        <v-icon icon="mdi-magnify" size="x-large" aria-hidden="true"></v-icon>
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

      <button
        type="button"
        class="hover hamburger text-center hidden-md-and-up aaa-hamburger"
        @click="goToSearch"
        aria-label="Search"
        @keydown.enter="goToSearch"
        @keydown.space="goToSearch"
      >
        <v-icon icon="mdi-magnify" size="x-large" aria-hidden="true"></v-icon>
        <div style="font-size: 10px; font-weight: 900">SEARCH</div>
      </button>
    </span>

    <span v-else class="text center ml-12" style="visibility: hidden; width: 0; overflow: hidden"></span>
  </v-app-bar>
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

onMounted(() => {
  isMounted.value = true;
});

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
 * Handles keyboard navigation for menu items.
 * Navigates to internal or external links based on the menu item configuration.
 *
 * @function navigateToLink
 * @param {Object} menuItem - The menu item object containing link information
 * @example
 * ```javascript
 * // Called when Enter or Space is pressed on a menu item
 * navigateToLink(menuItem); // Navigates to the menu item's link
 * ```
 */
const navigateToLink = (menuItem) => {
  if (menuItem.external) {
    window.open(menuItem.link, "_blank");
  } else {
    router.push(menuItem.link);
  }
};

/**
 * Closes the currently open menu.
 * Used for keyboard navigation when Escape key is pressed.
 *
 * @function closeMenu
 */
const closeMenu = () => {
  // Vuetify menus will close automatically on Escape
  // This function can be extended if additional cleanup is needed
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

/* Focus indicators for better keyboard navigation */
.v-btn:focus-visible {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.v-list-item:focus-visible {
  outline: 2px solid #1976d2;
  outline-offset: -2px;
}
.navItem {
  color: #333 !important;
  font-weight: 900;
}

/* AAA Target Size (2.5.5) - Hamburger menu must be at least 44x44 pixels */
/* Only show on small screens (below 960px / md breakpoint) */
.aaa-hamburger {
  width: 60px !important; /* Fixed width for guaranteed AAA */
  height: 64px !important; /* Fixed height for guaranteed AAA */
  padding: 0 !important;
  display: none; /* Hidden by default */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  color: inherit;
  box-sizing: border-box !important;
}

/* Show hamburger only on small screens (below md breakpoint = 960px) */
@media (max-width: 959.98px) {
  .aaa-hamburger {
    display: inline-flex !important;
  }
}

.aaa-hamburger:focus-visible {
  outline: 2px solid #0d4474;
  outline-offset: 2px;
}
</style>
