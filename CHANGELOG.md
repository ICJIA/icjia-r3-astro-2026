# Changelog

All notable changes to the ICJIA R3 Program Website are documented in this file.

---

## SEO & CLS Performance Fixes -- April 7, 2026

Full Lighthouse audit across 15 pages. SEO indexing fixed, CLS eliminated on 14 of 15 pages, performance scores dramatically improved.

### SEO Changes

| Fix | Files Changed | Impact |
|-----|---------------|--------|
| Disable `@nuxtjs/robots` module | `nuxt.config.js` | Module blocked indexing in dev mode; replaced with static robots.txt |
| Add static `robots.txt` | `public/robots.txt` | Allows full site indexing, blocks `/docs/`, `/preview/`, `/sandbox` |
| Remove conditional `noindex` meta tags | `composables/useSeoMeta.ts` | All pages now always output `index, follow` |

### CLS (Cumulative Layout Shift) Fixes

| Fix | Files Changed | Impact |
|-----|---------------|--------|
| Replace `v-layout-item` scroll button with fixed CSS | `app.vue` | Eliminated 88px layout reservation that shifted all content |
| Remove `v-if="isMounted"` from footer | `app.vue` | Footer now SSR-rendered, no hydration shift |
| Remove `v-if="isMounted"` from Funding content | `components/content/Funding.vue` | Funding content SSR-rendered directly |
| Set TOC columns from SSR data | `pages/[...slug].vue` | Column layout (12→9) no longer shifts on mount |
| Replace nav loader with zero-width hidden span | `components/content/TheNav.vue` | Eliminates visible loader→nav swap shift |

### Audit Scores (Post-Fix)

| Page | A11y | Perf | Best Practices | SEO |
|------|------|------|----------------|-----|
| `/` | 100 | 89 | 100 | 100 |
| `/funding` | 100 | 82 | 100 | 100 |
| `/faqs` | 100 | 99 | 100 | 100 |
| `/contact` | 100 | 99 | 100 | 100 |
| `/search` | 100 | 99 | 100 | 100 |
| `/translate` | 100 | 99 | 100 | 100 |
| `/news` | 100 | 99 | 100 | 100 |
| `/research` | 100 | 99 | 100 | 100 |
| `/resources` | 100 | 95 | 100 | 100 |
| `/board` | 100 | 99 | 100 | 100 |
| `/collaboratives` | 100 | 99 | 100 | 100 |
| `/eligibility` | 100 | 92 | 96 | 100 |
| `/meetings` | 100 | 99 | 100 | 100 |
| `/privacy` | 100 | 99 | 100 | 100 |
| `/resources/single-page` | 100 | 99 | 100 | 100 |

---

## Lighthouse Audit Fixes -- April 7, 2026

Full Lighthouse audit across 8 pages (home, news, research, resources, funding, contact, FAQs, search). All pages score 100 for Accessibility and Best Practices. Performance and image delivery improvements applied.

### Changes

| Fix | Files Changed | Impact |
|-----|---------------|--------|
| Convert director photo to `<NuxtImg>` with WebP | `pages/index.vue` | Image savings reduced from 182 KiB to 98 KiB; home page perf 85 → 89 |
| Add `font-display: swap` to octicons-link @font-face | `assets/css/github-markdown.css` | Eliminates flash of invisible text for markdown icon font |
| Fix `label-content-name-mismatch` on news buttons | `pages/news/index.vue` | aria-label now starts with visible text before appending article title |
| Add aria-labels to research article buttons | `pages/research/index.vue` | Both hub and publist buttons now have descriptive accessible names |
| Add aria-label to resources "Find out more" button | `pages/resources/index.vue` | Button accessible name now includes resource title |

### Audit Scores (Post-Fix)

| Page | A11y | Perf | Best Practices | SEO |
|------|------|------|----------------|-----|
| `/` | 100 | 89 | 100 | 69* |
| `/news` | 100 | 99 | 100 | 66* |
| `/research` | 100 | 99 | 100 | 69* |
| `/resources` | 100 | 94 | 100 | 69* |
| `/funding` | 100 | 85 | 100 | 69* |
| `/contact` | 100 | 99 | 100 | 66* |
| `/faqs` | 100 | 99 | 100 | 66* |
| `/search` | 100 | 99 | 100 | 63* |

*SEO scores are suppressed by dev-mode `robots.txt` (`@nuxtjs/robots` blocks indexing in development). Production builds serve the correct `Allow: /` rules.

### Not Addressed (Dev-Only / Third-Party)

- **Unminified JS/CSS**: Expected in dev mode; resolved by `nuxt build`.
- **`is-crawlable`**: Dev-mode `robots.txt` disallows all. Production is correctly configured.
- **`font-display-insight` (MDI icons)**: Third-party `@mdi/font` package; cannot modify source.
- **`bf-cache`**: Single failure reason from Nuxt framework internals.

---

## Security Audit Summary (Red Team Review) -- March 24, 2026

A red team security review was conducted against the full application codebase. A red team review simulates how an attacker would look for weaknesses in the application. The review covered cross-site scripting (XSS), injection attacks, authentication, data exposure, Content Security Policy (CSP), CORS (cross-origin resource sharing), dependency vulnerabilities, and server configuration.

### Critical Findings

| # | Finding | What It Means | Status |
|---|---------|---------------|--------|
| 1 | **CSP allows `'unsafe-eval'`** | If an attacker finds an XSS flaw, the Content Security Policy won't stop them from running arbitrary code in a user's browser. | **MITIGATED** -- Removed `'unsafe-eval'` from CSP script-src in `netlify.toml`. Nuxt 4 static generation does not require eval. |
| 2 | **CORS wildcard (`Access-Control-Allow-Origin: *`)** | Any website on the internet can make requests to this site's endpoints. For a static site this is low-impact, but it removes a layer of defense for the contact form submission endpoint. | **MITIGATED** -- Removed wildcard CORS header entirely from `netlify.toml`. Static sites do not need CORS headers. |
| 3 | **axios 1.10.0 has a known SSRF vulnerability** | The HTTP client library has a published security advisory (CVE-2024-28849). Upgrading to 1.10.2+ resolves it. | **MITIGATED** -- Upgraded axios to 1.13.6. |

### High-Priority Findings

| # | Finding | What It Means | Status |
|---|---------|---------------|--------|
| 4 | **No server-side form validation** | The contact form sanitizes input on the client (browser) side using DOMPurify, but an attacker can bypass the browser entirely and send malicious data directly to the API endpoint. Server-side validation is needed as a backstop. | **NOT MITIGATED** -- Requires changes to the Strapi CMS backend (`r3.icjia-api.cloud`) and the email service (`mail.icjia.cloud`), which are outside this repository. Recommendation: add input validation middleware on those services. |
| 5 | **No rate limiting on form endpoints** | Without rate limiting, an automated script could flood the contact form and email endpoints with thousands of submissions per minute, causing spam and potential service disruption. | **NOT MITIGATED** -- Rate limiting must be configured on the backend API servers or via Netlify Edge Functions. Recommendation: add rate limiting at the API gateway or Strapi middleware level. |
| 6 | **No CSRF protection** | The contact form lacks cross-site request forgery tokens. A malicious website could trick a user's browser into submitting the form without their knowledge. | **PARTIALLY MITIGATED** -- Removing the CORS wildcard header (Finding #2) prevents cross-origin form submissions from other websites. Full CSRF tokens would require server-side session support, which this static site does not have. The CORS fix addresses the most common attack vector. |

### Medium-Priority Findings

| # | Finding | What It Means | Status |
|---|---------|---------------|--------|
| 7 | **DOMPurify allows `<iframe>` tags** | The markdown renderer permits iframe elements in sanitized HTML. While necessary for embedded ESRI maps, it widens the attack surface if CMS content is ever compromised. | **MITIGATED** -- Added DOMPurify hook that validates iframe `src` attributes against a whitelist. Only iframes from `*.arcgis.com` domains are allowed; all others are removed before rendering. Applied to both `sandbox.vue` and `single-page.vue`. |
| 8 | **`'unsafe-inline'` in CSP** | Both script-src and style-src allow inline code. This is a common trade-off with Vue.js/Nuxt frameworks but reduces the effectiveness of CSP as a defense against XSS. | **ACCEPTED RISK** -- Vuetify and Vue.js require inline styles for component rendering. Removing `'unsafe-inline'` from style-src would break the UI framework. This is a known and accepted trade-off across Vue.js/Nuxt applications. |
| 9 | **Public audit reports in `/docs/` and `/a11y/`** | Accessibility audit reports are publicly accessible and reveal internal tooling details (framework versions, testing methodology). Not sensitive, but unnecessary exposure. | **ACCEPTED RISK** -- These reports demonstrate compliance with IITAA (Illinois state accessibility law) and are intentionally public as part of the transparency requirements for government websites. |

### What Passed (No Issues Found)

- No hardcoded secrets, API keys, or credentials anywhere in the codebase
- DOMPurify (v3.2.6) properly sanitizes all `v-html` rendered content
- Vue devtools are disabled in production builds
- Route parameters are validated against a whitelist (no path traversal possible)
- External links use proper `rel="noopener noreferrer"` attributes
- No `eval()`, `Function()`, or `document.write()` calls in application code
- JSON-LD structured data uses safe `JSON.stringify()` pattern
- All redirects are hardcoded to internal routes (no open redirect vulnerabilities)
- No file upload functionality exists (eliminates an entire class of attacks)
- Environment variables contain only public, non-sensitive configuration

---

## Defensive Security Summary (Blue Team Review) -- March 24, 2026

A blue team review evaluates the existing security defenses already in place. This section documents what the application is doing right to protect users and data.

### Security Headers (Netlify)

The application deploys with a strong set of HTTP security headers configured in `netlify.toml`:

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | `SAMEORIGIN` | Prevents clickjacking by blocking the site from being embedded in iframes on other domains |
| X-XSS-Protection | `1; mode=block` | Legacy browser XSS filter (defense-in-depth for older browsers) |
| Referrer-Policy | `strict-origin-when-cross-origin` | Limits how much URL information is shared when navigating to external sites |
| X-Content-Type-Options | `nosniff` | Prevents browsers from guessing file types, which can lead to code execution |
| Content-Security-Policy | Restrictive policy | Controls which domains can serve scripts, styles, images, and connections |

### Input Sanitization

- **Contact form**: All user inputs are sanitized with DOMPurify before submission, then additionally stripped of HTML tags via regex (defense-in-depth)
- **Markdown rendering**: All CMS-sourced markdown is passed through DOMPurify before being rendered with `v-html`
- **URL encoding**: Route middleware properly encodes/decodes URI components

### Architecture Advantages

- **Static site generation (SSG)**: The site is pre-rendered at build time and served as static HTML files. There is no runtime server processing user requests, which eliminates entire categories of server-side attacks (SQL injection, remote code execution, etc.)
- **No authentication system**: The site has no user accounts, login systems, or session management, which removes credential theft and session hijacking from the threat model
- **No database access at runtime**: All content is fetched from the CMS at build time. The only runtime API is a read-only endpoint returning pre-generated JSON
- **Whitelisted image domains**: The `@nuxt/image` module only allows images from explicitly approved domains
- **Whitelisted API connections**: The CSP `connect-src` directive restricts which external APIs the browser can contact

### Privacy

- **Plausible Analytics**: Uses privacy-focused Plausible instead of Google Analytics (no cookies, no personal data collection, GDPR-compliant by default)
- **localStorage only**: Cookie consent preference stored in browser localStorage, not transmitted to any server
- **No tracking pixels or third-party ad networks**

---

## Accessibility Audit Summary -- March 24, 2026

A comprehensive accessibility audit was performed using [axe-core](https://github.com/dequelabs/axe-core), the industry-standard automated accessibility testing engine, against WCAG 2.1 Level AA standards.

### Results

| Metric | Value |
|--------|-------|
| **Total pages tested** | 25 |
| **Viewports tested** | 3 (desktop 1920x1080, tablet 768x1024, mobile 375x812) |
| **Total individual tests run** | 6,775 |
| **Total rule checks passed** | 3,054 |
| **Total violations found** | **0** |
| **Pages with violations** | **0 of 25** |

### What Was Tested

The audit checked 15 axe-core rules across all pages and viewports, including:

- **ARIA compliance**: Proper use of ARIA roles and attributes
- **Landmark structure**: Correct banner, main, and contentinfo landmark hierarchy
- **Keyboard navigation**: Skip links present and functional on every page, scrollable regions are focusable
- **Heading structure**: Every page has a visible `<h1>` element
- **Link accessibility**: Links in text blocks are distinguishable, identical links serve the same purpose
- **Media**: No auto-playing audio
- **Responsive**: CSS orientation lock check (content works in both portrait and landscape)

### Compliance Standards Met

- **WCAG 2.1 Level AA** -- Web Content Accessibility Guidelines (international standard)
- **IITAA** -- Illinois Information Technology Accessibility Act (state requirement)
- **ADA Title II** -- Americans with Disabilities Act requirements for government websites

### Report Location

Full HTML report: `/public/docs/accessibility/index.html`
Machine-readable results: `/public/docs/accessibility/results.json`

---

## Recent Changes

### 2026-03-23

- fix: resolve axe-core accessibility violations (frame-title, landmark-unique, page-has-heading-one)

### 2026-03-22

- fix: add og:image:alt and twitter:image:alt meta tags
- fix: use innerHTML instead of children for JSON-LD script tags

### 2026-03-21

- feat: improve AI readiness with JSON-LD, authorship, dates, and llms.txt

### 2026-03-20

- fix: add EXPIRED notice at 2pm CST
