<template>
  <div class="d-flex">
    <v-navigation-drawer
      v-if="isMounted"
      v-model="drawer"
      temporary
      style="background: #fff"
      role="navigation"
      aria-label="Mobile navigation menu"
    >
      <v-list v-model:opened="open" density="compact" role="menu">
        <div
          v-for="(menu, index) in navMenu"
          :key="`sidebar-accordion-${index}`"
        >
          <div v-if="menu && menu.children">
            <v-list-group :value="menu.children.title">
              <template #activator="{ props, isActive }">
                <v-list-item
                  v-bind="props"
                  style="
                    font-weight: 900 !important;
                    font-family: Roboto, sans-serif !important;
                  "
                  :aria-expanded="isActive ? 'true' : 'false'"
                  :aria-label="`${menu.main} section. Press Enter to expand or collapse.`"
                  role="menuitem"
                  :aria-haspopup="true"
                  tabindex="0"
                  >{{ menu.main }}</v-list-item
                >
              </template>

              <div v-for="(child, i) in menu.children" :key="`main-${i}`">
                <v-list-item
                  v-if="child.section"
                  style="
                    margin-top: 0px;
                    font-weight: 700;
                    color: #555;
                    font-family: Roboto, sans-serif !important;
                  "
                  role="presentation"
                >
                  {{ child.section }}
                </v-list-item>
                <div
                  v-if="child.divider"
                  style="margin-top: 0px; font-weight: 900; color: #555"
                >
                  <v-divider role="presentation"></v-divider>
                </div>
                <v-list-item
                  v-if="child.title"
                  exact
                  style="margin-top: 0px; font-weight: 400; color: #555"
                  :to="child.link"
                  :aria-label="
                    child.external
                      ? `${child.title} (opens in new window)`
                      : child.title
                  "
                  role="menuitem"
                >
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ child.title }}</span>
                </v-list-item>
              </div>
            </v-list-group>
          </div>
          <div v-else>
            <v-list-item
              style="font-weight: 900 !important"
              :to="menu.link"
              class="hover"
              role="menuitem"
              >{{ menu.main }}</v-list-item
            >
          </div>
        </div>
        <!-- <v-list-item exact to="/contact" style="font-weight: 900 !important">
          Contact</v-list-item
        > -->
        <v-divider class="my-3" role="presentation"></v-divider>

        <v-list-item exact to="/search" role="menuitem">
          <v-icon
            left
            icon="mdi-magnify"
            size="x-small"
            aria-hidden="true"
          ></v-icon
          >&nbsp;&nbsp;&nbsp;Search</v-list-item
        >
        <!-- <v-list-item class="sidebar-item" to="/translate">
          <v-icon left icon="mdi-web" size="x-small"></v-icon
          >&nbsp;&nbsp;&nbsp;Translate</v-list-item
        > -->
        <v-list-item class="sidebar-item" to="/privacy" role="menuitem">
          <v-icon
            left
            icon="mdi-shield-lock-open"
            size="x-small"
            aria-hidden="true"
          ></v-icon
          >&nbsp;&nbsp;&nbsp;Privacy</v-list-item
        >
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
/**
 * @fileoverview Mobile sidebar navigation component for the ICJIA R3 Nuxt 3 application.
 *
 * This component provides a responsive navigation drawer for mobile devices,
 * featuring a collapsible menu structure with navigation items and translation toggle.
 * It synchronizes with the global navigation state and handles mobile navigation interactions.
 *
 * @component TheSidebar
 * @example
 * ```vue
 * <template>
 *   <TheSidebar />
 * </template>
 * ```
 *
 * @since 1.0.0
 */

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
 * Reactive reference tracking component mount status.
 * Used to prevent hydration issues and ensure proper client-side rendering.
 *
 * @type {Ref<boolean>}
 */
const isMounted = ref(false);

/**
 * Local drawer state for the navigation drawer component.
 * Controls the visibility of the mobile sidebar navigation.
 *
 * @type {Ref<boolean>}
 */
const drawer = ref(false);

/**
 * Array tracking which navigation groups are expanded.
 * Used for managing collapsible navigation sections.
 *
 * @type {Ref<Array>}
 */
const open = ref([]);

/**
 * Global navigation toggle state from state management.
 * Synchronized with the main navigation component state.
 *
 * @type {Ref<boolean>}
 */
const altState = useNavToggle();

/**
 * Watcher that synchronizes local drawer state with global navigation state.
 * Updates the global state when the local drawer state changes.
 */
watch(drawer, (val) => {
  altState.value = drawer.value;
});

/**
 * Watch effect that synchronizes global navigation state with local drawer state.
 * Updates the local drawer when the global navigation state changes.
 */
watchEffect(() => {
  drawer.value = altState.value;
});

/**
 * Handles sidebar click events and closes the navigation drawer.
 * Logs the click event and sets the navigation state to closed.
 *
 * @function click
 * @example
 * ```javascript
 * // Called when sidebar area is clicked
 * click(); // Closes sidebar and logs event
 * ```
 */
const click = () => {
  console.log("click sidebar");
  altState.value = false;
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
 * Navigates to a specified URL and closes the sidebar.
 * Handles route navigation from sidebar menu items.
 *
 * @param {string} url - The URL path to navigate to
 *
 * @function routeTo
 * @example
 * ```javascript
 * // Navigate to about page and close sidebar
 * routeTo("/about");
 *
 * // Navigate to contact page and close sidebar
 * routeTo("/contact");
 * ```
 */
const routeTo = (url) => {
  altState.value = false;

  router.push({ path: url });
};

/**
 * Toggles the translation modal visibility.
 * Switches the translation state between visible and hidden.
 *
 * @function translationToggle
 * @example
 * ```javascript
 * // Called when translation button is clicked in sidebar
 * translationToggle(); // Shows/hides translation modal
 * ```
 */
const translationToggle = () => {
  const translationState = useTranslateToggle();
  translationState.value = !translationState.value;
};
</script>

<style lang="scss" scoped>
.sidebar-item {
  font-weight: 700;
  font-family: "Roboto", sans-serif;
}
</style>
