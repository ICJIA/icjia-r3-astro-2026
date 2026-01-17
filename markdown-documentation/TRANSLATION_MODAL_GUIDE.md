# ICJIA Translation & Language Standards
**Standards Version:** 1.2.0
**Last Updated:** January 17, 2026

## 1. Standard Language Set
To serve Illinois effectively, we support 6 primary language groups for LEP populations:
- **Spanish**: Most common LEP language.
- **Polish**: Large Chicago-area population.
- **Chinese**: Simplified (`zh-CN`) and Traditional (`zh-TW`).
- **Tagalog**: Significant Filipino community.
- **Arabic**: Fast-growing community.
- **Hindi / Urdu**: Major South Asian presence.

## 2. Implementation Logic
We use a **URL-based Google Translate redirection** to avoid heavy local files and maintenance overhead.

### Redirection Function:
```javascript
const googleTranslate = (langCode) => {
  const { root } = useAppConfig(); // Base site URL (e.g. r3.illinois.gov)
  const { fullPath } = useRoute();
  const targetUrl = `${root}${fullPath}`;
  const redirect = `https://translate.google.com/translate?hl=en&sl=en&u=${targetUrl}&tl=${langCode}`;
  window.open(redirect);
};
```

## 3. Mandatory Requirements
- **Modal Component**: `TheTranslationModal.vue` must use standard language buttons and the ARIA `dialog` role.
- **Standard Disclaimer**: Include the machine-translation accuracy warning.
- **Human Support**: Provide `LAPRequests@illinois.gov` for human interpretation requests.
- **Trigger**: Place in header or footer with a globe icon or "Translate" label.

## 4. Key Files
- `components/content/TheTranslationModal.vue`: The UI modal.
- `composables/useTranslateToggle.ts`: Shared visibility state.
- `pages/translate.vue`: Dedicated fallback options page.
