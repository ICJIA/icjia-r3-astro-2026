# Accessibility Portal & Audit Guide
**Standards**: WCAG 2.1 Level AA (Site) / Level AAA (Portal)
**Last Updated**: January 17, 2026

## 1. The Mandatory AAA Portal
All ICJIA documentation portals located at `/docs/` must strictly adhere to WCAG 2.1 Level AAA (7:1 contrast).

### **AAA Specification Table**
| Category | Requirement | Standard / Value |
| :--- | :--- | :--- |
| **Contrast** | Normal Text | **7:1 minimum** (#000 on #fff) |
| **Typography** | Font Size | **18px minimum** base |
| **Typography** | Line Height | **1.5 minimum** (1.8 preferred) |
| **Interactive** | Touch Targets | **44x44px minimum** |
| **Visuals** | Border Radius | **0px** (Sharp corners only) |
| **Visuals** | Focus State | **4px solid #ffff00** (Yellow) |

## 2. Automated Auditing
We use a unified master audit script: `audit-accessibility.js`.

### **How to Run**
1. Start dev server: `yarn dev:audit` (Port 8000).
2. Run audit: `yarn audit:a11y`.
3. View report: Open `public/docs/accessibility/index.html`.

### **Audit Scope**
- **Crawler**: Scans all URLs in `public/sitemap.xml`.
- **Viewports**: Desktop (1920x1080) and Mobile (375x812).
- **Checks**: axe-core (AA) + Custom AAA checks (Touch targets & font sizes).

## 3. Deployment Safeguards
- **No Gradients/Shadows**: Prohibited in the AAA portal.
- **Single Source of Truth**: Only `audit-accessibility.js` generates HTML in `/docs/`.
- **Script Purge**: All other doc generators (JSDoc, TypeDoc) must be removed to avoid "compliance drift."
- **Skip Links**: Must be the first child of `<body>` in `app.vue`.

## 4. Maintenance
- Run `yarn audit:a11y` before every major production deploy.
- Ensure any new interactive components maintain the 44x44px hit area.
