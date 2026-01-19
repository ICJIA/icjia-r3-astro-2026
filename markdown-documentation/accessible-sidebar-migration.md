# Migrating Vuetify Navigation Drawer to Accessible Custom Sidebar

This guide documents how to replace Vuetify's `v-navigation-drawer` and `v-list-item` components with a fully accessible custom sidebar that meets **WCAG AAA** standards.

## Why Migrate?

Vuetify's navigation components have accessibility limitations:

1. **Target Size**: `v-list-item` elements often don't meet the AAA 44x44px requirement
2. **Keyboard Navigation**: May not follow ARIA menu patterns correctly
3. **Screen Reader Support**: Inconsistent announcements across screen readers
4. **Custom Styling**: Difficult to override Vuetify's styles for accessibility

## Key Accessibility Requirements

### WCAG 2.5.5 Target Size (AAA)
All interactive elements must be at least **44x44 CSS pixels**.

### WCAG 4.1.2 Name, Role, Value
Interactive elements must have proper ARIA roles and states.

### WCAG 2.1.1 Keyboard
All functionality must be operable via keyboard.

---

## Migration Steps

### Step 1: Replace Vuetify Navigation Drawer

**Before (Vuetify):**
```vue
<v-navigation-drawer v-model="drawer" temporary>
  <v-list nav>
    <v-list-item to="/" title="Home" />
    <v-list-group value="About">
      <template #activator="{ props }">
        <v-list-item v-bind="props" title="About" />
      </template>
      <v-list-item to="/eligibility" title="Eligibility" />
      <v-list-item to="/contact" title="Contact" />
    </v-list-group>
  </v-list>
</v-navigation-drawer>
```

**After (Custom Accessible):**
```vue
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
        <!-- Close button -->
        <div class="sidebar-header">
          <button
            type="button"
            class="sidebar-close-btn"
            @click="closeDrawer"
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true">✕</span>
            <span class="close-text">CLOSE</span>
          </button>
        </div>

        <!-- Menu list -->
        <ul class="sidebar-menu" role="menu">
          <!-- Simple menu item -->
          <li class="sidebar-menu-item" role="none">
            <a href="/" class="sidebar-link" role="menuitem">
              Home
            </a>
          </li>

          <!-- Expandable menu item -->
          <li class="sidebar-menu-item" role="none">
            <button
              type="button"
              class="sidebar-link sidebar-expandable"
              role="menuitem"
              :aria-expanded="aboutExpanded ? 'true' : 'false'"
              :aria-haspopup="true"
              aria-label="About section. Press Enter to expand or collapse."
              @click="aboutExpanded = !aboutExpanded"
            >
              <span>About</span>
              <svg class="chevron" :class="{ open: aboutExpanded }">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- Submenu -->
            <ul v-show="aboutExpanded" class="sidebar-submenu" role="menu">
              <li class="sidebar-menu-item" role="none">
                <a href="/eligibility" class="sidebar-link sidebar-child-link" role="menuitem">
                  Eligibility
                </a>
              </li>
              <li class="sidebar-menu-item" role="none">
                <a href="/contact" class="sidebar-link sidebar-child-link" role="menuitem">
                  Contact
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </Transition>
  </div>
</template>
```

---

### Step 2: Add Accessible CSS

```css
/* =============================================================================
   ACCESSIBLE SIDEBAR - WCAG AAA Compliant
   All interactive elements guaranteed to be at least 44x44 CSS pixels
   ============================================================================= */

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

/* Header with close button */
.sidebar-header {
  display: flex;
  padding: 0 16px;
  height: 90px;
  align-items: center;
  border-bottom: 1px solid #eee;
}

/* Close button - AAA compliant (44x44 minimum) */
.sidebar-close-btn {
  width: 60px;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  color: #333;
  font-size: 24px;
}

.sidebar-close-btn:focus-visible {
  outline: 2px solid #0d4474;
  outline-offset: 2px;
}

.close-text {
  font-size: 10px;
  font-weight: 900;
}

/* Menu container */
.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.sidebar-menu-item {
  margin: 0;
  padding: 0;
}

/* =============================================================================
   INTERACTIVE ELEMENTS - AAA TARGET SIZE (44x44 minimum)
   ============================================================================= */

/* All interactive links and buttons */
.sidebar-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 44px;        /* AAA requirement */
  min-width: 44px;         /* AAA requirement */
  padding: 10px 16px;
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0d4474;          /* AAA contrast ratio */
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
  box-sizing: border-box;
  text-align: left;
}

.sidebar-link:hover,
.sidebar-link:focus {
  background-color: #f0f4f8;
}

.sidebar-link:focus-visible {
  outline: 2px solid #0d4474;
  outline-offset: -2px;
}

/* Active page indicator */
.sidebar-link.active {
  background-color: #e8f0f8;
  border-left: 3px solid #0d4474;
}

/* Expandable menu button */
.sidebar-expandable {
  justify-content: space-between;
}

.sidebar-expandable span {
  flex: 1;
}

/* Chevron icon */
.chevron {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

/* Submenu container */
.sidebar-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: #fafafa;
}

/* Child links - indented but still AAA compliant */
.sidebar-child-link {
  font-weight: 400;
  padding-left: 32px;      /* Indent for visual hierarchy */
  color: #333;
}

/* =============================================================================
   FIXING ALIGNMENT CONFLICTS WITH GLOBAL LINK STYLES
   
   If you have global CSS that applies to all <a> tags (e.g., for AAA target 
   size compliance), the sidebar links may inherit unwanted styles like 
   text-align: center. 
   
   Solution 1: Use !important on ALL sidebar-link properties
   Solution 2: Exclude .sidebar-link from global selectors
   ============================================================================= */

/* Solution 1: Override global styles with !important */
.sidebar-link {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  width: 100% !important;
  min-height: 44px !important;
  min-width: unset !important;          /* Override global min-width */
  padding: 10px 16px !important;
  margin: 0 !important;
  text-align: left !important;          /* Override global text-align: center */
  text-decoration: none !important;     /* Override global underline */
  vertical-align: middle !important;
}

/* Ensure button elements match link alignment exactly */
button.sidebar-link {
  margin: 0 !important;
  padding: 10px 16px !important;
  border: none !important;
  background: transparent !important;
  width: 100% !important;
  text-align: left !important;
}

/* Expandable buttons need explicit alignment */
.sidebar-expandable {
  justify-content: space-between !important;
  padding: 10px 16px !important;
  margin: 0 !important;
}

.sidebar-expandable span {
  flex: 1;
}

/* =============================================================================
   TRANSITIONS
   ============================================================================= */

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

---

### Step 3: Add JavaScript Logic

```javascript
// Reactive state
const drawer = ref(false);
const expandedMenus = ref([]);

// Close the drawer
const closeDrawer = () => {
  drawer.value = false;
};

// Toggle a menu section open/closed
const toggleMenu = (index) => {
  const idx = expandedMenus.value.indexOf(index);
  if (idx === -1) {
    expandedMenus.value.push(index);
  } else {
    expandedMenus.value.splice(idx, 1);
  }
};
```

---

## ARIA Roles Reference

| Element | Role | Required Attributes |
|---------|------|---------------------|
| `<nav>` | `navigation` | `aria-label` |
| `<ul>` (menu) | `menu` | — |
| `<li>` (wrapper) | `none` | — |
| `<a>` (link) | `menuitem` | — |
| `<button>` (expandable) | `menuitem` | `aria-expanded`, `aria-haspopup`, `aria-label` |
| `<ul>` (submenu) | `menu` | — |

---

## Accessibility Checklist

### Target Size (2.5.5)
- [ ] All interactive elements are at least 44x44 CSS pixels
- [ ] Close button meets size requirements
- [ ] All menu items meet size requirements
- [ ] Submenu items meet size requirements

### Keyboard Navigation (2.1.1)
- [ ] Tab moves focus through all interactive elements
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes the drawer (optional but recommended)
- [ ] Focus is trapped within open drawer (recommended)

### Screen Reader Support (4.1.2)
- [ ] Navigation landmark has descriptive label
- [ ] Menu structure uses proper ARIA roles
- [ ] Expandable items announce expanded/collapsed state
- [ ] External links announce "opens in new window"

### Visual (1.4.3, 1.4.6)
- [ ] Text color meets AAA contrast ratio (7:1)
- [ ] Focus indicators are clearly visible
- [ ] Active/current page is visually indicated

---

## Fixing Alignment Issues with Global Link Styles

A common problem occurs when you have global CSS rules that apply to all `<a>` tags for AAA target size compliance. These global rules may include:

```css
/* Global CSS for AAA target size */
a {
  display: inline-block !important;
  min-height: 44px !important;
  min-width: 44px !important;
  text-align: center !important;  /* This breaks sidebar alignment! */
}
```

This causes sidebar links to be **centered** while buttons (like expandable menus) remain **left-aligned**, creating misalignment.

### Solution 1: Exclude Sidebar Links from Global Selectors

In your global CSS, add `:not(.sidebar-link)` to exclude sidebar links:

```css
/* Global CSS - exclude sidebar links */
a:not(.v-btn):not(.sidebar-link) {
  display: inline-block !important;
  min-height: 44px !important;
  min-width: 44px !important;
  text-align: center !important;
}

/* Also exclude from inline link rules */
p a:not(.sidebar-link),
li a:not(.sidebar-link),
div a:not(.sidebar-link) {
  /* ... your global link styles ... */
}
```

### Solution 2: Override in Scoped Styles with !important

In your sidebar component's scoped styles, use `!important` on all properties:

```css
.sidebar-link {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  text-align: left !important;
  text-decoration: none !important;
  min-width: unset !important;
  /* ... all other properties with !important ... */
}
```

### Best Practice: Use Both Solutions

For maximum reliability, apply both solutions:

1. **Global CSS**: Exclude `.sidebar-link` from global link selectors
2. **Component CSS**: Use `!important` on sidebar-specific styles

This ensures consistent alignment regardless of CSS load order or specificity conflicts.

---

## Common Pitfalls to Avoid

1. **Don't use `<div>` for interactive elements** - Use `<a>` for links and `<button>` for actions

2. **Don't forget `role="none"` on `<li>` wrappers** - This prevents screen readers from announcing redundant list structure

3. **Don't use `tabindex` on menu items** - Native `<a>` and `<button>` elements are already focusable

4. **Don't hide focus indicators** - Users who navigate by keyboard need visible focus

5. **Don't use color alone to indicate state** - Combine with other visual indicators (border, icon, text)

6. **Watch for global link styles causing misalignment** - If you have global CSS for AAA link sizing with `text-align: center`, sidebar links will be centered while buttons remain left-aligned. Exclude `.sidebar-link` from global selectors and use `!important` in scoped styles.

---

## Testing Recommendations

1. **Keyboard-only navigation**: Unplug mouse and navigate using only Tab, Enter, Space, Escape

2. **Screen reader testing**: Test with VoiceOver (Mac), NVDA (Windows), or TalkBack (Android)

3. **Zoom testing**: Zoom to 200% and verify all content is still accessible

4. **Automated testing**: Use axe DevTools or similar to catch basic issues

5. **Target size verification**: Use browser DevTools to measure actual element sizes

---

## Migration from Vue Router Links

If using Vue Router's `<NuxtLink>` or `<router-link>`:

```vue
<!-- These work the same as <a> tags for accessibility -->
<NuxtLink
  :to="item.link"
  class="sidebar-link"
  role="menuitem"
  @click="closeDrawer"
>
  {{ item.title }}
</NuxtLink>
```

The framework link components render as `<a>` tags and inherit all accessibility benefits.

---

## Summary

Replacing Vuetify's navigation drawer with a custom accessible sidebar requires:

1. **Semantic HTML**: Use `<nav>`, `<ul>`, `<li>`, `<a>`, and `<button>`
2. **ARIA roles**: Add proper menu roles and states
3. **CSS sizing**: Ensure 44x44px minimum for all interactive elements
4. **Keyboard support**: Native HTML elements provide this automatically
5. **Visual feedback**: Clear focus indicators and state changes

This approach gives you full control over accessibility while maintaining a modern, animated sidebar experience.
