<template>
  <div class="sidebar-wrapper">
    <!-- Backdrop overlay -->
    <Transition name="fade">
      <div
        v-if="drawer"
        class="sidebar-backdrop"
        @click="closeDrawer"
        aria-hidden="true"
      ></div>
    </Transition>

    <!-- Custom accessible sidebar -->
    <Transition name="slide">
      <nav
        v-if="drawer"
        class="sidebar-drawer"
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <div class="sidebar-header">
          <button
            type="button"
            class="hover hamburger text-center aaa-hamburger-sidebar"
            @click="closeDrawer"
            aria-label="Close navigation menu"
          >
            <v-icon
              icon="mdi-window-close"
              size="x-large"
              aria-hidden="true"
            ></v-icon>
            <div style="font-size: 10px; font-weight: 900">CLOSE</div>
          </button>
        </div>
        <ul class="sidebar-menu" role="menu">
          <template v-for="(menu, index) in navMenu" :key="`sidebar-${index}`">
            <!-- Menu item with children (expandable) -->
            <li
              v-if="menu && menu.children"
              class="sidebar-menu-item"
              role="none"
            >
              <button
                type="button"
                class="sidebar-link sidebar-expandable"
                role="menuitem"
                :aria-expanded="
                  expandedMenus.includes(index) ? 'true' : 'false'
                "
                :aria-haspopup="true"
                :aria-label="`${menu.main} section. Press Enter to expand or collapse.`"
                @click="toggleMenu(index)"
              >
                <span>{{ menu.main }}</span>
                <svg
                  class="sidebar-chevron"
                  :class="{
                    'sidebar-chevron-open': expandedMenus.includes(index),
                  }"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <!-- Submenu -->
              <ul
                v-show="expandedMenus.includes(index)"
                class="sidebar-submenu"
                role="menu"
              >
                <template
                  v-for="(child, i) in menu.children"
                  :key="`child-${i}`"
                >
                  <!-- Section header -->
                  <li
                    v-if="child.section"
                    class="sidebar-section"
                    role="presentation"
                  >
                    {{ child.section }}
                  </li>
                  <!-- Divider -->
                  <li
                    v-if="child.divider"
                    class="sidebar-divider"
                    role="presentation"
                  >
                    <hr aria-hidden="true" />
                  </li>
                  <!-- Child link -->
                  <li v-if="child.title" class="sidebar-menu-item" role="none">
                    <NuxtLink
                      :to="child.link"
                      class="sidebar-link sidebar-child-link"
                      role="menuitem"
                      :aria-label="
                        child.external
                          ? `${child.title} (opens in new window)`
                          : child.title
                      "
                      @click="closeDrawer"
                    >
                      {{ child.title }}
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </li>

            <!-- Simple menu item (no children) -->
            <li v-else class="sidebar-menu-item" role="none">
              <NuxtLink
                :to="menu.link"
                class="sidebar-link"
                role="menuitem"
                @click="closeDrawer"
              >
                {{ menu.main }}
              </NuxtLink>
            </li>
          </template>

          <!-- Divider -->
          <li class="sidebar-divider" role="presentation">
            <hr aria-hidden="true" />
          </li>

          <!-- Search -->
          <li class="sidebar-menu-item" role="none">
            <NuxtLink
              to="/search"
              class="sidebar-link sidebar-icon-link"
              role="menuitem"
              @click="closeDrawer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Search</span>
            </NuxtLink>
          </li>

          <!-- Privacy -->
          <li class="sidebar-menu-item" role="none">
            <NuxtLink
              to="/privacy"
              class="sidebar-link sidebar-icon-link"
              role="menuitem"
              @click="closeDrawer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Privacy</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </div>
</template>

<script setup>
/**
 * @fileoverview Custom accessible mobile sidebar navigation component.
 *
 * This component replaces Vuetify's navigation drawer with a fully custom
 * accessible implementation that guarantees WCAG AAA compliance for target
 * size (2.5.5) with all interactive elements at least 44x44 pixels.
 *
 * @component TheSidebar
 * @since 1.0.0
 */

/**
 * Application configuration object containing navigation menu structure.
 */
const appConfig = useAppConfig();

/**
 * Deep copy of the navigation menu configuration.
 */
const navMenu = JSON.parse(JSON.stringify(appConfig.navMenu));

/**
 * Local drawer state for the navigation drawer.
 */
const drawer = ref(false);

/**
 * Array tracking which menu indices are expanded.
 */
const expandedMenus = ref([]);

/**
 * Global navigation toggle state from state management.
 */
const altState = useNavToggle();

/**
 * Sync local drawer state with global navigation state.
 */
watch(drawer, () => {
  altState.value = drawer.value;
});

watchEffect(() => {
  drawer.value = altState.value;
});

/**
 * Close the drawer.
 */
const closeDrawer = () => {
  altState.value = false;
};

/**
 * Toggle a menu section open/closed.
 */
const toggleMenu = (index) => {
  const idx = expandedMenus.value.indexOf(index);
  if (idx === -1) {
    expandedMenus.value.push(index);
  } else {
    expandedMenus.value.splice(idx, 1);
  }
};
</script>

<style scoped>
/* =============================================================================
   CUSTOM ACCESSIBLE SIDEBAR - WCAG AAA Compliant
   All interactive elements are guaranteed to be at least 44x44 CSS pixels
   Only visible on small screens (below md breakpoint = 960px)
   ============================================================================= */

.sidebar-wrapper {
  position: relative;
}

/* Hide sidebar on medium screens and up (960px+) */
@media (min-width: 960px) {
  .sidebar-backdrop,
  .sidebar-drawer {
    display: none !important;
  }
}

/* Backdrop overlay */
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Main drawer */
.sidebar-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  max-width: 85vw;
  height: 100vh;
  background: #fff;
  z-index: 1000;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  display: flex;
  padding: 0 16px;
  height: 90px; /* Match header height */
  align-items: center;
  border-bottom: 1px solid #eee;
}

.aaa-hamburger-sidebar {
  width: 60px !important;
  height: 64px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  color: #333;
  padding: 0 !important;
  margin-left: -8px; /* Offset padding for better alignment */
}

.aaa-hamburger-sidebar:focus-visible {
  outline: 2px solid #0d4474;
  outline-offset: 2px;
}

/* Menu container */
.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

/* Menu items wrapper */
.sidebar-menu-item {
  margin: 0;
  padding: 0;
}

/* =============================================================================
   INTERACTIVE ELEMENTS - AAA TARGET SIZE (44x44 minimum)
   ============================================================================= */

/* All interactive links and buttons - consistent alignment */
/* Using !important to override global link styles from app.css */
.sidebar-link {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  width: 100% !important;
  min-height: 44px !important;
  min-width: unset !important;
  padding: 10px 16px !important;
  margin: 0 !important;
  font-family: "Roboto", sans-serif !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #0d4474 !important;
  text-decoration: none !important;
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
  box-sizing: border-box !important;
  text-align: left !important;
  vertical-align: middle !important;
}

/* Explicitly reset button defaults to match links */
button.sidebar-link {
  margin: 0 !important;
  padding: 10px 16px !important;
  border: none !important;
  background: transparent !important;
  width: 100% !important;
  text-align: left !important;
}

.sidebar-link:hover,
.sidebar-link:focus {
  background-color: #f0f4f8;
}

.sidebar-link:focus-visible {
  outline: 2px solid #0d4474;
  outline-offset: -2px;
}

/* Active/current page link */
.sidebar-link.router-link-active,
.sidebar-link.router-link-exact-active {
  background-color: #e8f0f8;
  border-left: 3px solid #0d4474;
}

/* Expandable menu button - ensure same alignment as other items */
.sidebar-expandable {
  justify-content: space-between;
  padding: 10px 16px !important;
  margin: 0 !important;
}

.sidebar-expandable span {
  flex: 1;
}

/* Chevron icon */
.sidebar-chevron {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.sidebar-chevron-open {
  transform: rotate(180deg);
}

/* Submenu container */
.sidebar-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: #fafafa;
}

/* Child links in submenu */
.sidebar-child-link {
  font-weight: 400;
  padding-left: 32px;
  color: #333;
}

/* Section headers (non-interactive) */
.sidebar-section {
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 10px 16px 10px 32px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Dividers */
.sidebar-divider {
  padding: 8px 16px;
}

.sidebar-divider hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 0;
}

/* Links with icons */
.sidebar-icon-link {
  gap: 12px;
  font-weight: 400;
}

.sidebar-icon-link svg {
  flex-shrink: 0;
}

/* =============================================================================
   TRANSITIONS
   ============================================================================= */

/* Slide transition for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Fade transition for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
