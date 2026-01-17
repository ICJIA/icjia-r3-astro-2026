# ICJIA Translation Modal and Standard Languages Guide

**Last Updated:** January 17, 2026  
**Version:** 1.1.0

## Overview

This document outlines the standard implementation for website translation across ICJIA projects. To ensure consistency and focus on the most relevant populations in Illinois, the translation component has been streamlined to support six primary language groups. This standardization allows for easier maintenance and a consistent user experience across the ICJIA web ecosystem.

## Why These Languages? (Illinois-Specific Context)

ICJIA serves the diverse population of Illinois. The selection of these specific six language groups is data-driven, reflecting the most common languages spoken by individuals with Limited English Proficiency (LEP) in the state:

1.  **Spanish**: By far the most common language in Illinois other than English, spoken by over 1.6 million residents.
2.  **Polish**: Illinois, particularly the Chicago metropolitan area, has one of the largest Polish-speaking populations outside of Poland.
3.  **Chinese (Mandarin/Cantonese)**: A significant and growing population across the state, particularly in urban and suburban hubs.
4.  **Tagalog**: Spoken by a large Filipino-American community, which is one of the largest Asian American ethnic groups in Illinois.
5.  **Arabic**: One of the fastest-growing language groups in Illinois, with significant communities in Cook and the collar counties.
6.  **Hindi/Urdu**: Representing the substantial South Asian population in Illinois, often grouped together in demographic data due to linguistic similarities in spoken form.

By focusing on these six, ICJIA ensures that the vast majority of non-English speaking Illinoisans can access vital information about criminal justice programs and grants.

---

## How the Modal Works

### Technical Mechanism

The translation modal is built using **Nuxt 3** and **Vuetify 3**. It operates as a global component that can be triggered from anywhere in the application (usually via the footer or a floating translation button).

1.  **State Management**: It uses a shared state (typically a `useTranslateToggle` composable) to control its visibility. This allows the modal to be opened from any component without complex prop drilling.
2.  **Dynamic Routing**: Instead of translating just the homepage, the modal detects the user's current route. It then constructs a Google Translate URL that points specifically to the page the user is currently viewing.
3.  **External Integration**: It leverages the Google Translate "Web element" logic via a URL redirect. This avoids the need for heavy local translation files or expensive API calls while providing an immediate, full-page translation experience.

### Focus & Accessibility

- **Dialog Pattern**: Uses the ARIA "dialog" role to ensure screen readers treat it as a modal.
- **Auto-Focus**: When opened, the modal automatically focuses on the title or the first language button to assist keyboard users.
- **Escape to Close**: Standard keyboard behavior (Esc key) is implemented to allow users to quickly exit the translation menu.

---

## Portability: Working with Any Site

The ICJIA Translation Modal is designed to be highly portable. To implement it on a new site, follow these steps:

### 1. Configuration (`app.config.ts`)

The logic relies on a `root` URL defined in the site's configuration. This ensures that even in development or staging environments, Google Translate is pointed to a reachable URL.

```javascript
// app.config.ts example
export default defineAppConfig({
  root: "https://your-icjia-site.illinois.gov",
});
```

### 2. The Translation Logic

The core function can be dropped into any Vue/Nuxt component. It dynamically combines the site's root URL with the current path:

```javascript
const googleTranslate = (lang) => {
  const { root } = useAppConfig(); // Get base URL
  const { fullPath } = useRoute(); // Get current page path
  const route = `${root}${fullPath}`; // Construct full URL for Google

  const url = `https://translate.google.com/translate?hl=en&sl=en&u=${route}&tl=${lang}`;
  window.open(url);
};
```

### 3. Standard UI Components

By using Vuetify's `v-btn` and `v-dialog`, the modal inherits the site's global theme and styling, ensuring it "belongs" to the project's visual identity while maintaining the standard language list.

---

## Standard Language Groups Reference

| Language Group            | Google Code | Label in UI           |
| :------------------------ | :---------- | :-------------------- |
| **Spanish**               | `es`        | Spanish               |
| **Polish**                | `pl`        | Polish                |
| **Chinese (Simplified)**  | `zh-CN`     | Chinese (Simplified)  |
| **Chinese (Traditional)** | `zh-TW`     | Chinese (Traditional) |
| **Tagalog**               | `tl`        | Tagalog               |
| **Arabic**                | `ar`        | Arabic                |
| **Hindi**                 | `hi`        | Hindi                 |
| **Urdu**                  | `ur`        | Urdu                  |

---

## Best Practices for ICJIA Projects

1.  **The Disclaimer**: Always include the standard ICJIA disclaimer text (found in `TheTranslationModal.vue`) to manage user expectations regarding machine translation accuracy.
2.  **LAP Requests**: Always provide the `LAPRequests@illinois.gov` email link for users who require human interpretation or translated documents that Google cannot provide accurately.
3.  **Placement**: The translation trigger should be easily found in the header or footer, ideally with a globe icon or the word "Translate".
4.  **No Forking**: Avoid adding or removing languages from this list without consulting the communications team, as this maintains the Illinois-specific standard.

## Related Files in This Project

- `components/content/TheTranslationModal.vue`: The reusable modal component.
- `pages/translate.vue`: The dedicated translation options page.
- `creators/createManualPages.js`: Configuration for search metadata.
- `composables/useTranslateToggle.ts`: The shared state for modal control.
