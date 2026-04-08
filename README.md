# ICJIA R3 Program Website

![R3 - Restore. Reinvest. Renew.](public/og-image.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
![Node](https://img.shields.io/badge/Node-22.14.0-339933?logo=node.js&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxtdotjs&logoColor=white)

Official website for Illinois' R3 (Restore, Reinvest, Renew) program.

🌐 **Live Site**: [https://r3.illinois.gov](https://r3.illinois.gov)  
📚 **Documentation Portal**: [https://r3.illinois.gov/docs/](https://r3.illinois.gov/docs/)  
🤖 **LLM Context**: [ICJIA_LLM_BLUEPRINT.md](./markdown-documentation/ICJIA_LLM_BLUEPRINT.md) (Use this for AI context)

---

## 🚀 Quick Start

```bash
# 1. Setup
nvm use && yarn install

# 2. Content Generation (Strapi CMS -> Markdown)
yarn scripts

# 3. Development
yarn dev  # Runs at http://localhost:8000
```

## 🛠 Standards & Architecture
- **Framework**: Nuxt 4, Vue 3, Vuetify 3.
- **Config**: Centralized `config.js` (No `.env` files for public API paths).
- **SEO**: Lighthouse 100/100 via `usePageSeo` and JSON-LD.
- **Accessibility**: 100/100 WCAG 2.1 AA.
- **Docs**: Mandatory WCAG 2.1 AAA portal at `/docs/`.

## 📂 Documentation Index
| File | Description |
| :--- | :--- |
| **[LLM Blueprint](./markdown-documentation/ICJIA_LLM_BLUEPRINT.md)** | **Start Here**. Essential info for AI/Developers. |
| [Netlify Deployment](./markdown-documentation/NETLIFY_DEPLOYMENT_V1.md) | Image CDN, CSP, and deployment policies. |
| [SEO Guide](./markdown-documentation/SEO_IMPLEMENTATION_GUIDE.md) | Patterns for Meta tags and Structured Data. |
| [Config System](./markdown-documentation/CONFIG_SYSTEM.md) | How the centralized config works. |
| [Audit Guide](./markdown-documentation/DOCUMENTATION_PORTAL_PROMPT_V4_OPTIMIZED.md) | Accessibility auditing and portal generation. |
| [Changelog](./CHANGELOG.md) | Security audit, accessibility audit, and blue team summaries. |

## Security Posture (Red Team Audit -- March 2026)

A red team security review simulates how an attacker would probe the application for weaknesses. The full audit covered XSS (cross-site scripting), injection attacks, dependency vulnerabilities, Content Security Policy, CORS, authentication, and data exposure. See [CHANGELOG.md](./CHANGELOG.md) for the complete findings.

**9 findings identified. 5 mitigated, 2 accepted, 2 require backend changes:**

| Severity | Finding | Status |
|----------|---------|--------|
| Critical | CSP allowed `'unsafe-eval'` | **MITIGATED** -- Removed from CSP header |
| Critical | CORS wildcard (`*`) | **MITIGATED** -- Header removed entirely |
| Critical | axios SSRF vulnerability | **MITIGATED** -- Upgraded to v1.13.6 |
| High | No server-side form validation | Requires backend API changes (outside this repo) |
| High | No rate limiting | Requires backend API or gateway changes |
| High | No CSRF tokens | **PARTIALLY MITIGATED** by CORS fix |
| Medium | Unrestricted iframe in DOMPurify | **MITIGATED** -- Iframes now whitelisted to ArcGIS domains only |
| Medium | `'unsafe-inline'` in CSP | **ACCEPTED** -- Required by Vuetify framework |
| Medium | Public audit reports | **ACCEPTED** -- Required for IITAA compliance transparency |

**What passed:** No hardcoded secrets, proper DOMPurify sanitization on all rendered HTML, devtools disabled, route whitelist validation, safe redirect handling, no file uploads, no `eval()` usage, privacy-focused analytics.

## Defensive Security (Blue Team Summary -- March 2026)

The blue team review documents existing security measures already protecting users:

- **Static site generation (SSG)**: No runtime server processing eliminates SQL injection, remote code execution, and most server-side attacks
- **Strong HTTP headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and CSP are all configured in `netlify.toml`
- **Input sanitization**: DOMPurify v3.2.6 sanitizes all user inputs and CMS-sourced HTML before rendering
- **No authentication surface**: No user accounts, sessions, or credentials to steal
- **Privacy-first analytics**: Plausible Analytics (no cookies, no personal data, GDPR-compliant)
- **Whitelisted domains**: Both image sources and API connections are restricted to approved domains via CSP and Nuxt config

## Lighthouse Audit (April 2026)

Full Lighthouse audit across all pages. All pages score **100 for Accessibility**, **100 for SEO**, and **100 for Best Practices**. Production performance: 6 of 9 pages score **100**, remaining pages 88-97. See [CHANGELOG.md](./CHANGELOG.md) for detailed scores and fixes.

| Page | Perf | A11y | BP | SEO |
|------|------|------|----|-----|
| `/` | 96 | 100 | 100 | 100 |
| `/contact` | 100 | 100 | 100 | 100 |
| `/faqs` | 97 | 100 | 100 | 100 |
| `/news` | 88 | 100 | 100 | 100 |
| `/research` | 100 | 100 | 100 | 100 |
| `/resources` | 100 | 100 | 100 | 100 |
| `/search` | 100 | 100 | 100 | 100 |
| `/translate` | 100 | 100 | 100 | 100 |

Key optimizations: lazy-loaded Fuse.js/DOMPurify/axios to eliminate render-blocking JS, trailing slash normalization for consistent Plausible analytics, SSR hydration fixes for deterministic date formatting, and static `useAsyncData` keys to prevent payload mismatches with Netlify Pretty URLs.

## Accessibility Audit (March 2026)

Full axe-core WCAG 2.1 Level AA audit across all 25 pages in 3 viewports (desktop, tablet, mobile):

| Metric | Result |
|--------|--------|
| Pages tested | 25 |
| Individual tests | 6,775 |
| Violations found | **0** |
| Skip link verification | **Pass** (all pages) |

Compliant with **WCAG 2.1 AA**, **IITAA** (Illinois state standard), and **ADA Title II**. Full report at `/docs/accessibility/`.

---
*Maintained by the ICJIA Web Development Team.*
