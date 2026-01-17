# ICJIA Site Audit Guide - Vuetify/Nuxt Best Practices V1

**Version:** 1.1.0  
**Last Updated:** January 17, 2026  
**Purpose:** Comprehensive accessibility, SEO, performance, and quality audit guide for ICJIA Vuetify/Nuxt applications.  
**Target:** LLM agents and developers performing site audits on ICJIA codebases.

---

## 🎯 Overview

This document provides a comprehensive audit framework based on the modernization of the ICJIA web platform. Use this guide to identify accessibility issues, SEO problems, Nuxt 4 compatibility concerns, and code quality issues.

### What This Audit Covers

1.  **WCAG 2.1 Level AA/AAA Compliance** - Accessibility standards
2.  **ARIA Labels & Semantic HTML** - Proper labeling and roles
3.  **Navigation Components** - Header, sidebar, menus
4.  **Skip Links** - Keyboard navigation aids
5.  **Focus Management** - Visible focus indicators
6.  **SEO Implementation** - Meta tags, structured data
7.  **Documentation Portal** - High-contrast audit reports
8.  **Content Security Policy** - CSP headers
9.  **Nuxt 4 & ESM Compatibility** - Future-proofing and module standards
10. **Performance & Asset Optimization** - Loading speeds and UX
11. **Link Integrity & Security** - Broken links and HTTPS
12. **Code Quality** - Console logs, unused code

---

## 📊 Audit Categories

### Category 1: Navigation & Header (Critical)

#### Issue: Header Role Confusion

**What We Fixed:**

- Changed `v-app-bar` from `role="navigation"` to `role="banner"`.
- Added `aria-label="Site header"` instead of `aria-label="Site navigation"`.

**Audit Checklist:**

```
☐ v-app-bar has role="banner"
☐ v-app-bar has aria-label="Site header" or similar
☐ Navigation menu inside header has role="navigation"
☐ Mobile hamburger menu is keyboard accessible (tabindex="0")
☐ Hamburger has proper aria-label describing state (e.g., "Open navigation menu")
```

**Example Fix:**

```vue
<v-app-bar role="banner" tabindex="-1" aria-label="Site header" id="navigation">
  <!-- navigation content inside -->
</v-app-bar>
```

#### Issue: Menu Buttons Missing ARIA States

**What We Fixed:**

- Added `aria-expanded` to dropdown menu buttons.
- Added `aria-haspopup="true"` to indicate submenu presence.
- Added descriptive `aria-label` with instructions.

**Audit Checklist:**

```
☐ All dropdown/menu buttons have aria-expanded (bound to isActive state)
☐ All dropdown buttons have aria-haspopup="true"
☐ Menu button labels describe action (e.g., "Press Enter to open")
☐ Menu items have role="menu"
☐ Individual menu items have role="menuitem"
```

---

### Category 2: Skip Links (Critical)

#### Issue: Missing or Low-Contrast Skip Links

**What We Fixed:**

- Added skip navigation system at the top of `app.vue`.
- Implemented WCAG AAA contrast (black background, white text = 21:1 ratio).
- Made skip links keyboard-only visible.

**Audit Checklist:**

```
☐ Skip links exist at the very top of the page (before all content)
☐ Skip links are hidden by default and visible on focus (:focus-visible)
☐ Skip links point to valid IDs (#main-content, #navigation)
☐ Target elements have tabindex="-1" for focus management
☐ Skip links have WCAG AAA contrast (21:1 ratio)
```

**Implementation Reference:**

```vue
<!-- app.vue -->
<nav aria-label="Skip navigation" class="skip-links">
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <a href="#navigation" class="skip-link">Skip to navigation</a>
</nav>

<v-main id="main-content" role="main" tabindex="-1">
  <NuxtPage />
</v-main>
```

---

### Category 3: Nuxt 4 & ESM Compatibility (High Priority)

#### Issue: Legacy CommonJS or Missing Extensions

**What We Fixed:**

- Migrated all `require()` to `import`.
- Migrated all `module.exports` to `export default`.
- Ensured all relative imports include file extensions (e.g., `./utils.js`).

**Audit Checklist:**

```
☐ No instances of require() in the codebase (except specific build scripts)
☐ All imports use ESM syntax (import/export)
☐ Relative imports include extensions (.js, .ts, .vue)
☐ package.json has "type": "module" if applicable
☐ No usage of __dirname or __filename without ESM polyfills
```

**Example Fix:**

```javascript
// BEFORE (CommonJS)
const utils = require('./utils');
module.exports = { ... };

// AFTER (ESM - Nuxt 4 Ready)
import utils from './utils.js';
export default { ... };
```

---

### Category 4: SEO Implementation (High Priority)

#### Issue: Missing or Incomplete SEO/Structured Data

**What We Fixed:**

- Created standardized SEO composables (`usePageSeo`, `useSiteSeo`).
- Implemented JSON-LD structured data for Organizations, WebPages, and Articles.

**Audit Checklist:**

```
☐ Every page has a unique <title> and meta description
☐ Canonical URLs are correctly set to the production domain
☐ Open Graph and Twitter Card tags are present
☐ useSiteSeo() is called in app.vue
☐ useGovernmentOrganizationSchema() is called in app.vue
☐ Every content page calls usePageSeo() and useWebPageSchema()
```

**Standard Parameterized Setup:**

```typescript
// usePageSeo Config
usePageSeo({
  title: "[PAGE_TITLE]",
  description: "[PAGE_DESCRIPTION]",
  path: "/[PAGE_PATH]",
  keywords: ["[KEYWORD1]", "[KEYWORD2]"],
});
```

---

### Category 5: Performance & Asset Optimization (Medium Priority)

#### Issue: Unoptimized Assets & Slow Loading

**What We Fixed:**

- Implemented `loading="lazy"` on all iframes and below-the-fold images.
- Ensured images have explicit dimensions to prevent Layout Shift (CLS).
- Used optimized formats (WebP/JPG) and responsive sizes.

**Audit Checklist:**

```
☐ All iframes have loading="lazy"
☐ Images below the fold have loading="lazy"
☐ All images have width and height attributes or CSS dimensions
☐ Lighthouse Performance score is 90+
☐ No massive (>500KB) unoptimized images in assets/img
```

**Example Fix:**

```vue
<img
  src="/path/to/image.webp"
  width="800"
  height="600"
  loading="lazy"
  alt="[DESCRIPTIVE_ALT]"
/>
```

---

### Category 6: Link Integrity & Security (Medium Priority)

#### Issue: Broken Links & Insecure External Connections

**What We Fixed:**

- Verified all internal links use `NuxtLink` or `:to`.
- Ensured all external links use `https://`.
- Added `rel="noopener noreferrer"` to all `target="_blank"` links.

**Audit Checklist:**

```
☐ No broken internal links (404s)
☐ All external links use HTTPS
☐ All target="_blank" links have rel="noopener noreferrer"
☐ External links have "(opens in new window)" in their aria-label
```

---

### Category 7: Documentation Portal (High Priority)

#### Issue: Non-Compliant or Complex Docs

**What We Fixed:**

- Simplified `/docs/` to a single WCAG AAA landing page.
- Created high-contrast accessibility audit reports via `audit-accessibility.js`.

**Audit Checklist:**

```
☐ /docs/landing page exists and is WCAG AAA (7:1 contrast)
☐ Accessibility reports exist in /public/docs/accessibility/
☐ audit-accessibility.js is configured and runnable
☐ Reports show zero WCAG AA violations
```

---

### Category 8: Code Quality (Medium Priority)

#### Issue: Production Debugging Leaks

**What We Fixed:**

- Removed all `console.log` statements.
- Cleaned up unused imports and dead code.

**Audit Checklist:**

```
☐ No console.log statements in production-bound files
☐ ESLint passes with zero errors
☐ No commented-out code blocks (dead code)
```

---

## 🛠️ Standard Testing Commands

Run these commands in the project root to automate parts of the audit:

### 1. Search for Production Leaks (Console Logs)

```bash
grep -r "console.log" --include="*.vue" --include="*.ts" --include="*.js" . | grep -v "node_modules" | grep -v ".nuxt"
```

### 2. Search for Legacy CommonJS (require)

```bash
grep -r "require(" --include="*.vue" --include="*.ts" --include="*.js" . | grep -v "node_modules" | grep -v "audit-accessibility.js"
```

### 3. Identify Large Unoptimized Images

```bash
find assets/img -type f -size +500k
```

### 4. Check Link Security

```bash
grep -r "target=\"_blank\"" . | grep -v "noopener noreferrer"
```

### 5. Run Full Accessibility Audit

```bash
# Requires dev server running on configured port
yarn audit:a11y
```

---

## 🎯 LLM Agent Instructions

When auditing an ICJIA site:

1.  **Initialize**: Run the "Search for Production Leaks" and "CommonJS" grep commands.
2.  **Verify Accessibility**: Check `app.vue` for skip links and `v-app-bar` for roles.
3.  **SEO Check**: Verify `composables/useSeoMeta.ts` exists and is used in `app.vue`.
4.  **Nuxt 4 Ready**: Check if imports in `pages/` and `components/` include extensions.
5.  **Generate Report**: Use the format below to present findings.

### Audit Report Format

```markdown
## 📝 Audit Results for [PROJECT_NAME]

**Overall Status:** [PASS/FAIL/NEEDS_FIX]

### 🔴 Critical Findings

1. [ISSUE] - [FILE] - [FIX_ACTION]

### 🟡 High Priority

1. [ISSUE] - [FILE] - [FIX_ACTION]

### 🟢 Best Practice Improvements

1. [ISSUE] - [FILE] - [FIX_ACTION]

### 📊 Vital Stats

- **Accessibility Score**: [Score or "Zero Violations"]
- **Nuxt 4 Ready**: [Yes/No]
- **ESM Migration**: [Complete/In-Progress]
```

---

## 📝 Version History

| Version   | Date         | Changes                                                                                                                  |
| --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **1.1.0** | Jan 17, 2026 | Added Nuxt 4/ESM, Performance, and Link Integrity categories. Parameterized examples and added Testing Commands section. |
| **1.0.0** | Jan 17, 2026 | Initial comprehensive audit guide.                                                                                       |

---

**Maintained by:** [ICJIA_DEVELOPMENT_TEAM]  
**Documentation standards:** WCAG 2.1 AA/AAA, Nuxt 4 ESM, Schema.org JSON-LD.
