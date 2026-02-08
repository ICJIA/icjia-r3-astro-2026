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

---
*Maintained by the ICJIA Web Development Team.*
