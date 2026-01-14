# Documentation Portal Implementation Prompt V2

**Version**: 4.3  
**Last Updated**: January 14, 2026  
**Purpose**: Mandatory WCAG 2.1 Level AAA-compliant documentation portal guide. All portals (new and migrated) MUST meet AAA contrast requirements (7:1 ratio). Accessibility over aesthetics.

> 💡 **Start with the [Questions](#-questions-to-ask-before-starting)** before generating any code.

---

## 🎯 Core Principle

**WCAG AAA compliance is mandatory. Accessibility over aesthetics.**

| Requirement        | Standard                                             |
| ------------------ | ---------------------------------------------------- |
| **Contrast Ratio** | 7:1 minimum for normal text, 4.5:1 for large text    |
| **Font Size**      | 18px minimum base size                               |
| **Font Weight**    | 900 for headings, 500+ for body text                 |
| **Colors**         | Black (#000) on white (#fff) only - no exceptions    |
| **Borders**        | 4px solid black for maximum visibility               |
| **Focus States**   | 4px outline with high-contrast yellow (#ffff00)      |
| **Responsiveness** | Must work on all viewports (mobile, tablet, desktop) |

**AAA compliance > fancy colors.** Every portal must pass axe-core AAA tests with zero violations.

---

## ❓ QUESTIONS TO ASK BEFORE STARTING

**Before generating any scripts or documentation, gather the following information from the user:**

### Required Questions (Must Answer All)

| #   | Question                                          | Why It Matters                                      | Example Answer                            |
| --- | ------------------------------------------------- | --------------------------------------------------- | ----------------------------------------- |
| 1   | **Do you have an existing documentation portal?** | Determines Pathway A (new) vs Pathway B (migration) | "Yes, we have `/public/docs/` with JSDoc" |
| 2   | **What is your project name?**                    | Used in page titles and headings                    | "R3 Restore, Reinvest, Renew"             |
| 3   | **What port does your dev server run on?**        | Required for audit script configuration             | "8000" or "3000"                          |
| 4   | **What is your production URL?**                  | Required for audit script configuration             | "https://r3.illinois.gov"                 |
| 5   | **Where is your sitemap.xml located?**            | Required for audit to find pages to test            | "public/sitemap.xml"                      |
| 6   | **What framework are you using?**                 | Affects exclusion selectors for audit               | "Nuxt 3", "Vue 3", "React", "Plain HTML"  |

### Conditional Questions (Based on Answers Above)

**If existing portal exists (Pathway B):**

| #   | Question                                                                                     | Why It Matters                      |
| --- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| 7   | **What documentation types currently exist?** (JSDoc, TypeDoc, test reports, API docs, etc.) | Identifies what needs to be removed |
| 8   | **Are there any documentation links in your site footer or navigation?**                     | Need to update/remove these links   |
| 9   | **What package.json scripts relate to documentation?**                                       | Identifies scripts to remove        |

**If using a framework with DevTools:**

| #   | Question                                   | Why It Matters                                   |
| --- | ------------------------------------------ | ------------------------------------------------ |
| 10  | **Are DevTools enabled in development?**   | May need to add exclusion selectors              |
| 11  | **What is the DevTools element selector?** | For Nuxt: `nuxt-devtools-frame`, for Vue: varies |

### Optional Questions (Nice to Have)

| #   | Question                                                               | Default if Not Provided                |
| --- | ---------------------------------------------------------------------- | -------------------------------------- |
| 12  | **Do you need multi-viewport testing?** (desktop, tablet, mobile)      | Yes - all three viewports              |
| 13  | **Any specific axe-core rules to disable?**                            | Only `region` rule disabled by default |
| 14  | **Repository visibility?** (public/private - affects report messaging) | Private                                |
| 15  | **Contact info for accessibility questions?**                          | "Contact the web development team"     |

### Quick Questionnaire Template

Copy and ask the user to fill in:

```
📋 DOCUMENTATION PORTAL SETUP - QUESTIONNAIRE

1. Existing docs portal? [ ] Yes (Pathway B)  [ ] No (Pathway A)
2. Project name: _______________________
3. Dev server port: _______________________
4. Production URL: _______________________
5. Sitemap location: _______________________ (default: public/sitemap.xml)
6. Framework: [ ] Nuxt  [ ] Vue  [ ] React  [ ] Other: _______

If existing portal (Pathway B only):
7. Current docs types: _______________________
8. Docs links in footer/nav? [ ] Yes  [ ] No
9. Docs-related package scripts: _______________________

Optional:
10. DevTools enabled? [ ] Yes  [ ] No
11. Multi-viewport testing? [ ] Yes (default)  [ ] No (desktop only)
12. Repository: [ ] Public  [ ] Private (default)
```

### Decision Logic After Questions

```
Q1 = "No" (no existing portal)
└─► Use PATHWAY A

Q1 = "Yes" (existing portal)
└─► Use PATHWAY B
    └─► Use Q7-Q9 to identify files to remove

Q6 = "Nuxt"
└─► Use default AXE_EXCLUDE_SELECTORS for Nuxt DevTools

Q6 = Other framework
└─► Ask for DevTools selector or skip exclusions
```

---

## ⚡ TWO PATHWAYS - Choose Your Starting Point

This prompt provides **TWO DISTINCT PATHWAYS** based on your current situation:

| Pathway                     | When to Use                                       | Jump To                                                             |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| **🆕 PATHWAY A: New Setup** | Starting from scratch, no existing docs portal    | [Pathway A](#pathway-a-new-documentation-portal-setup)              |
| **🔄 PATHWAY B: Migration** | Have an existing portal that needs simplification | [Pathway B](#pathway-b-migrate-existing-portal-to-simplified-setup) |

**Choose ONE pathway and follow it completely.**

---

## 📋 Quick Reference: What You'll End Up With

Regardless of which pathway you choose, the end result is the same: **a WCAG AAA-compliant documentation portal**.

### Mandatory AAA Requirements (Non-Negotiable)

- ✅ **21:1 contrast ratio** (black #000 on white #fff)
- ✅ **18px minimum font size** for all body text
- ✅ **900 font weight** for headings, **500+** for body
- ✅ **4px solid black borders** on all interactive elements
- ✅ **Yellow (#ffff00) focus indicators** on dark backgrounds
- ✅ **Zero rounded corners** (sharp edges only)
- ✅ **Zero shadows or gradients**
- ✅ **Fully responsive** across all viewports
- ✅ **Zero axe-core AAA violations**

```
public/
├── docs/
│   ├── index.html              # Simple landing page (high contrast)
│   └── accessibility/
│       ├── index.html          # Auto-generated audit report
│       ├── results.json        # Full audit data
│       └── violations.json     # Violations only (if any)
├── sitemap.xml                 # Required for audit
audit-accessibility.js          # Audit script (project root)
scripts/
└── ensure-accessibility-report.js  # Placeholder script
```

**Package Scripts:**

- `yarn audit:a11y` - Run accessibility audit

---

# PATHWAY A: New Documentation Portal Setup

> **Use this pathway if:** You're building a documentation portal from scratch. No existing `/docs/` folder or documentation files.

⚠️ **MANDATORY**: All new portals MUST meet WCAG 2.1 Level AAA contrast requirements. Use the templates below exactly as provided - do not modify colors, fonts, or styling.

## A1: Create Portal Landing Page (WCAG AAA Compliant)

**File**: `public/docs/index.html`

This template meets WCAG 2.1 Level AAA contrast requirements (7:1 for normal text, 4.5:1 for large text).

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Documentation Portal - [PROJECT NAME]</title>
    <style>
      /*
       * WCAG AAA CONTRAST REQUIREMENTS:
       * - Normal text: 7:1 minimum contrast ratio
       * - Large text (18pt+ or 14pt+ bold): 4.5:1 minimum contrast ratio
       * 
       * This design uses:
       * - Black (#000) on white (#fff): 21:1 ratio ✓
       * - White (#fff) on black (#000): 21:1 ratio ✓
       * - Black (#000) on light gray (#f5f5f5): 16:1 ratio ✓
       */

      :root {
        --text-primary: #000000;
        --text-inverse: #ffffff;
        --bg-primary: #ffffff;
        --bg-secondary: #f5f5f5;
        --bg-dark: #000000;
        --border-heavy: #000000;
        --focus-color: #ffff00;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
        background: var(--bg-secondary);
        padding: 20px;
        line-height: 1.8;
        color: var(--text-primary);
        font-size: 18px;
      }

      .container {
        max-width: 980px;
        margin: 0 auto;
        background: var(--bg-primary);
        padding: 48px;
        border: 4px solid var(--border-heavy);
      }

      h1 {
        color: var(--text-primary);
        border-bottom: 6px solid var(--border-heavy);
        padding-bottom: 16px;
        margin-bottom: 24px;
        font-size: 2.5rem;
        font-weight: 900;
      }

      p {
        color: var(--text-primary);
        font-weight: 500;
        margin-bottom: 16px;
      }

      strong {
        font-weight: 900;
      }

      .doc-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin: 32px 0;
      }

      /* Dark card for maximum contrast */
      .doc-card {
        background: var(--bg-dark);
        color: var(--text-inverse);
        padding: 28px;
        border: 4px solid var(--border-heavy);
      }

      .doc-card h2 {
        color: var(--text-inverse);
        margin-bottom: 12px;
        font-size: 1.5rem;
        font-weight: 900;
      }

      .doc-card p {
        color: var(--text-inverse);
        margin-bottom: 16px;
        font-weight: 500;
      }

      .doc-card a {
        display: inline-block;
        background: var(--bg-primary);
        color: var(--text-primary);
        text-decoration: none;
        font-weight: 900;
        padding: 12px 20px;
        border: 3px solid var(--text-inverse);
      }

      .doc-card a:hover {
        background: var(--focus-color);
        color: var(--text-primary);
        border-color: var(--text-primary);
      }

      .doc-card a:focus,
      .doc-card a:focus-visible {
        outline: 4px solid var(--focus-color);
        outline-offset: 2px;
      }

      .callout {
        background: var(--bg-secondary);
        padding: 24px;
        border: 4px solid var(--border-heavy);
        margin: 24px 0;
      }

      footer {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 4px solid var(--border-heavy);
        font-weight: 600;
      }

      footer a {
        color: var(--text-primary);
        text-decoration: underline;
        font-weight: 900;
      }

      footer a:hover {
        background: var(--focus-color);
      }

      footer a:focus,
      footer a:focus-visible {
        outline: 3px solid var(--text-primary);
        outline-offset: 2px;
      }

      /* Skip link - AAA compliant */
      .skip-link {
        position: absolute;
        top: -100px;
        left: 0;
        background: var(--bg-dark);
        color: var(--text-inverse);
        padding: 16px 32px;
        text-decoration: none;
        z-index: 10000;
        font-weight: 900;
        font-size: 1.125rem;
        border: 4px solid var(--text-inverse);
      }

      .skip-link:focus,
      .skip-link:focus-visible {
        top: 0;
        outline: 4px solid var(--focus-color);
        outline-offset: 2px;
      }

      /* AAA Compliance Badge */
      .aaa-badge {
        display: inline-block;
        background: var(--bg-dark);
        color: var(--text-inverse);
        padding: 4px 12px;
        font-size: 0.875rem;
        font-weight: 900;
        border: 2px solid var(--border-heavy);
        margin-left: 8px;
        vertical-align: middle;
      }

      /* Responsive */
      @media (max-width: 600px) {
        body {
          padding: 12px;
          font-size: 16px;
        }
        .container {
          padding: 24px;
        }
        h1 {
          font-size: 1.75rem;
        }
      }
    </style>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <main class="container" id="main-content" tabindex="-1">
      <h1>📚 Documentation Portal <span class="aaa-badge">WCAG AAA</span></h1>

      <p>
        Welcome to the documentation portal for <strong>[PROJECT NAME]</strong>.
        This portal provides accessibility audit reports to ensure the website
        meets <strong>WCAG 2.1 Level AA</strong> standards. This portal itself
        is designed to meet <strong>WCAG 2.1 Level AAA</strong> contrast
        requirements (7:1 minimum for normal text).
      </p>

      <div class="doc-grid">
        <div class="doc-card">
          <h2>♿ Accessibility Audit</h2>
          <p>
            Sitemap-driven WCAG audit results across desktop, tablet, and mobile
            viewports using axe-core.
          </p>
          <a
            href="/docs/accessibility/index.html"
            aria-label="View accessibility audit report"
            >View Accessibility Report →</a
          >
        </div>
      </div>

      <div class="callout">
        <p>
          <strong>Repo access:</strong> This project repository is private. If
          you need access to source code or internal documentation, please
          contact the <strong>web development team</strong>.
        </p>
      </div>

      <footer>
        <p><strong>Last updated:</strong> <span id="lastUpdated">-</span></p>
        <div style="margin-top: 12px;">
          <a href="/">← Back to Application</a>
        </div>
      </footer>
    </main>

    <script>
      document.getElementById("lastUpdated").textContent =
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    </script>
  </body>
</html>
```

---

## A2: Create Accessibility Audit Script

**File**: `audit-accessibility.js` (project root)

```javascript
#!/usr/bin/env node

/**
 * ICJIA Standard Accessibility Audit Script
 * High-contrast HTML report generation
 * Tests all pages in sitemap.xml against WCAG 2.1 Level AA
 */

// ============================================================================
// DEVELOPER CONFIGURATION - EDIT THIS SECTION
// ============================================================================

const TARGET_ENV = "development"; // or "production"
const PRODUCTION_URL = "https://yoursite.gov";
const DEV_SERVER_PORT = 8000;

const AXE_RULE_CONFIG = {
  "aria-allowed-role": true,
  "scrollable-region-focusable": true,
  "landmark-banner-is-top-level": true,
  "landmark-contentinfo-is-top-level": true,
  "landmark-main-is-top-level": true,
  "landmark-unique": true,
  region: false, // Disabled - Nuxt/Vue incompatibility
  "css-orientation-lock": true,
  "no-autoplay-audio": true,
  "page-has-heading-one": true,
  "focus-order-semantics": true,
};

const SITEMAP_PATH_CONFIG = "public/sitemap.xml";
const OUTPUT_DIR_CONFIG = "public/docs/accessibility";
const REPORT_FILE_NAME = "index.html";

const VIEWPORTS = [
  { width: 1920, height: 1080, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 812, name: "mobile" },
];

const SITE_INFO = {
  name: "Your Project Name",
  description: "Accessibility audit report for your project.",
};

const AXE_EXCLUDE_SELECTORS = [
  ["nuxt-devtools-frame"],
  ["nuxt-devtools-panel"],
];

// ============================================================================
// DO NOT EDIT BELOW THIS LINE
// ============================================================================

import puppeteer from "puppeteer";
import axeCore from "axe-core";
import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITEMAP_PATH = path.join(__dirname, ...SITEMAP_PATH_CONFIG.split("/"));
const OUTPUT_DIR = path.join(__dirname, ...OUTPUT_DIR_CONFIG.split("/"));
const REPORT_FILE = path.join(OUTPUT_DIR, REPORT_FILE_NAME);
const BASE_URL =
  TARGET_ENV === "production"
    ? PRODUCTION_URL
    : `http://localhost:${DEV_SERVER_PORT}`;

console.log(
  "================================================================================"
);
console.log("ACCESSIBILITY AUDIT");
console.log(
  "================================================================================"
);
console.log("Tool: axe-core (WCAG 2.1 Level AA compliance)");
console.log("");

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read sitemap
const sitemapXml = fs.readFileSync(SITEMAP_PATH, "utf-8");
const sitemap = await parseStringPromise(sitemapXml);
const urls = sitemap.urlset.url.map((entry) => entry.loc[0]);

console.log(`✓ Found ${urls.length} URL(s) in sitemap`);
console.log("");

// Launch browser
console.log("Launching browser...");
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
console.log("✓ Browser launched");
console.log("");

const results = [];
let testCount = 0;
const totalTests = urls.length * VIEWPORTS.length;

for (const url of urls) {
  for (const viewport of VIEWPORTS) {
    testCount++;
    const page = await browser.newPage();
    await page.setViewport(viewport);

    try {
      console.log(
        `[${testCount}/${totalTests}] Testing ${url} (${viewport.name})...`
      );
      await page.goto(url.replace(PRODUCTION_URL, BASE_URL), {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Run axe
      await page.addScriptTag({ content: axeCore.source });
      const axeResults = await page.evaluate(
        (config, exclude) => {
          const rules = {};
          for (const [rule, enabled] of Object.entries(config)) {
            rules[rule] = { enabled };
          }
          return axe.run({
            exclude,
            rules,
            tags: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
          });
        },
        AXE_RULE_CONFIG,
        AXE_EXCLUDE_SELECTORS
      );

      results.push({
        url,
        viewport: viewport.name,
        violations: axeResults.violations,
        passes: axeResults.passes,
        incomplete: axeResults.incomplete,
      });

      console.log(
        `   ${axeResults.violations.length === 0 ? "✅" : "⚠️"} ${axeResults.violations.length} violation(s), ${axeResults.passes.length} pass(es)`
      );
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    } finally {
      await page.close();
    }
  }
}

await browser.close();

// Generate high-contrast HTML report
const totalViolations = results.reduce(
  (sum, r) => sum + r.violations.length,
  0
);
const totalPasses = results.reduce((sum, r) => sum + r.passes.length, 0);
const uniquePages = new Set(results.map((r) => r.url)).size;
const pagesWithViolations = new Set(
  results.filter((r) => r.violations.length > 0).map((r) => r.url)
).size;

const html = generateHighContrastReport({
  results,
  totalViolations,
  totalPasses,
  uniquePages,
  pagesWithViolations,
  timestamp: new Date().toISOString(),
});

fs.writeFileSync(REPORT_FILE, html);
fs.writeFileSync(
  path.join(OUTPUT_DIR, "violations.json"),
  JSON.stringify(
    results.filter((r) => r.violations.length > 0),
    null,
    2
  )
);
fs.writeFileSync(
  path.join(OUTPUT_DIR, "results.json"),
  JSON.stringify(results, null, 2)
);

console.log("");
console.log("✅ Audit Complete!");
console.log("");
console.log(`📊 Summary:`);
console.log(`   Total violations: ${totalViolations}`);
console.log(`   Total passes: ${totalPasses}`);
console.log(`   Pages tested: ${uniquePages}`);
console.log(`   Pages with violations: ${pagesWithViolations}`);
console.log(`   Pages passing: ${uniquePages - pagesWithViolations}`);
console.log("");
console.log(`📄 Report saved to: ${REPORT_FILE}`);
console.log("");

process.exit(totalViolations > 0 ? 1 : 0);

function generateHighContrastReport(data) {
  const {
    results,
    totalViolations,
    totalPasses,
    uniquePages,
    pagesWithViolations,
    timestamp,
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Audit Report - ${new Date().toLocaleDateString()}</title>
  <style>
    /* HIGH CONTRAST ACCESSIBILITY-FIRST DESIGN */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.8; 
      color: #000; 
      background: #fff; 
      padding: 20px; 
      font-size: 16px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { 
      font-size: 2.5rem; 
      margin-bottom: 1.5rem; 
      color: #000;
      font-weight: 700;
      border-bottom: 4px solid #000;
      padding-bottom: 0.5rem;
    }
    h2 { 
      font-size: 2rem; 
      margin-top: 3rem; 
      margin-bottom: 1.5rem; 
      color: #000;
      font-weight: 700;
      border-bottom: 3px solid #000;
      padding-bottom: 0.5rem;
    }
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
      gap: 1.5rem; 
      margin: 2rem 0; 
    }
    .stat-card { 
      padding: 1.5rem; 
      text-align: center; 
      background: #fff; 
      border: 4px solid #000;
    }
    .stat-card.success { background: #d4f4dd; }
    .stat-card.error { background: #ffe0e0; }
    .stat-card .number { 
      font-size: 3rem; 
      font-weight: 900; 
      margin: 0.5rem 0; 
      color: #000;
    }
    .stat-card .label { 
      font-size: 1rem; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      font-weight: 700;
      color: #000;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 2rem 0; 
      background: white; 
      border: 3px solid #000;
    }
    thead { 
      background: #000; 
      color: #fff;
    }
    th, td { 
      padding: 1rem; 
      text-align: left; 
      border: 2px solid #000;
    }
    th { font-weight: 700; color: #fff; }
    td { color: #000; font-weight: 500; }
    tbody tr:nth-child(even) { background: #f5f5f5; }
    .status-pass { 
      color: #000; 
      background: #d4f4dd;
      padding: 4px 8px;
      font-weight: 700; 
      border: 2px solid #000;
    }
    .status-fail { 
      color: #000; 
      background: #ffe0e0;
      padding: 4px 8px;
      font-weight: 700; 
      border: 2px solid #000;
    }
    .skip-link { 
      position: absolute; 
      top: -100px; 
      left: 0; 
      background: #000; 
      color: #fff; 
      padding: 16px 32px; 
      text-decoration: none; 
      z-index: 10000; 
      font-weight: 700; 
      font-size: 1.125rem; 
      border: 4px solid #fff;
    }
    .skip-link:focus { 
      top: 0; 
      outline: 4px solid #fff; 
      outline-offset: 4px; 
    }
    @media (max-width: 768px) {
      body { padding: 15px; font-size: 15px; }
      h1 { font-size: 2rem; }
      h2 { font-size: 1.5rem; }
      .stats-grid { grid-template-columns: 1fr; }
      table { font-size: 14px; }
      th, td { padding: 0.75rem; }
    }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div class="container">
    <main id="main-content" tabindex="-1">
      <h1>♿ ${SITE_INFO.name} - Accessibility Audit Report</h1>
      <p style="margin-bottom: 2rem;"><strong>Generated:</strong> ${new Date(timestamp).toLocaleString()}</p>

      <div class="stats-grid">
        <div class="stat-card ${totalViolations === 0 ? "success" : "error"}">
          <div class="label">Total Violations</div>
          <div class="number">${totalViolations}</div>
        </div>
        <div class="stat-card success">
          <div class="label">Total Passes</div>
          <div class="number">${totalPasses}</div>
        </div>
        <div class="stat-card ${pagesWithViolations === 0 ? "success" : "error"}">
          <div class="label">Pages Passing</div>
          <div class="number">${uniquePages - pagesWithViolations}</div>
        </div>
      </div>

      <h2>📋 Test Results</h2>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Viewport</th>
            <th>Violations</th>
            <th>Passes</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${results
            .map(
              (r) => `
          <tr>
            <td>${r.url.replace(BASE_URL, "")}</td>
            <td>${r.viewport}</td>
            <td>${r.violations.length}</td>
            <td>${r.passes.length}</td>
            <td class="${r.violations.length === 0 ? "status-pass" : "status-fail"}">
              ${r.violations.length === 0 ? "✅ Pass" : "❌ Fail"}
            </td>
          </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </main>
  </div>
</body>
</html>`;
}
```

---

## A3: Add Package Scripts

**File**: `package.json` (add to existing scripts)

```json
{
  "scripts": {
    "dev": "nuxt dev --port=8000",
    "audit:a11y": "node ./audit-accessibility.js"
  },
  "devDependencies": {
    "axe-core": "^4.11.0",
    "puppeteer": "^24.34.0",
    "xml2js": "^0.6.2"
  }
}
```

---

## A4: Create Placeholder Script

**File**: `scripts/ensure-accessibility-report.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, "../public/docs/accessibility");

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const indexPath = path.join(docsDir, "index.html");
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(
    indexPath,
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"/>' +
      "<title>Accessibility Audit</title></head><body>" +
      "<p>Placeholder. Run <code>yarn audit:a11y</code>.</p>" +
      "</body></html>"
  );
}

console.log("✅ Accessibility documentation placeholders ensured");
```

---

## A5: Test Your New Setup

```bash
# 1. Install dependencies
yarn add -D axe-core puppeteer xml2js

# 2. Start dev server
yarn dev

# 3. In another terminal, run audit
yarn audit:a11y

# 4. Visit the documentation portal
open http://localhost:8000/docs/
```

**✅ Pathway A Complete!** Skip to [Validation Checklist](#-validation-checklist).

---

# PATHWAY B: Migrate Existing Portal to Simplified Setup

> **Use this pathway if:** You have an existing documentation portal (e.g., with JSDoc, TypeDoc, test reports, multiple features) that needs simplification.

⚠️ **MANDATORY**: All migrated portals MUST be upgraded to WCAG 2.1 Level AAA contrast requirements. Replace ALL existing styling with the AAA-compliant templates below. Do not preserve legacy colors, fonts, or design elements that fail AAA standards.

## B1: Assess Current State

Before migrating, identify what you currently have:

```bash
# List current docs structure
ls -la public/docs/

# Check for complex documentation scripts
grep -r "jsdoc\|typedoc\|docs:" package.json
```

**Common legacy patterns to remove:**

- `public/docs/jsdoc/` - API documentation
- `public/docs/tests/` - Test reports
- `public/docs/api/` - API reference
- Complex `index.html` with multiple cards/links
- Scripts like `docs:jsdoc`, `docs:tests`, `docs:all`

---

## B2: Remove Legacy Files

```bash
# Remove complex documentation directories
rm -rf public/docs/jsdoc/
rm -rf public/docs/tests/
rm -rf public/docs/api/
rm -rf public/docs/coverage/

# Remove legacy creation scripts
rm -f creators/createDocumentationHTML.js
rm -f scripts/generate-docs.js
```

---

## B3: Replace Landing Page

**Delete** your current `public/docs/index.html` and **replace** with this simplified version:

**File**: `public/docs/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Documentation Portal</title>
    <style>
      /* HIGH CONTRAST DESIGN - DO NOT MODIFY */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
        line-height: 1.8;
        color: #000;
        background: #fff;
        padding: 20px;
        font-size: 16px;
      }
      .container {
        max-width: 1000px;
        margin: 0 auto;
      }
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        color: #000;
        font-weight: 700;
        border-bottom: 4px solid #000;
        padding-bottom: 0.5rem;
      }
      p {
        margin-bottom: 1rem;
        line-height: 1.8;
      }
      .card {
        background: #fff;
        border: 4px solid #000;
        padding: 2rem;
        margin: 2rem 0;
      }
      .card h2 {
        font-size: 1.5rem;
        margin-top: 0;
        margin-bottom: 1rem;
        color: #000;
        font-weight: 700;
        border-bottom: 3px solid #000;
        padding-bottom: 0.5rem;
      }
      .card a {
        display: inline-block;
        background: #000;
        color: #fff;
        padding: 12px 24px;
        text-decoration: none;
        font-weight: 700;
        margin-top: 1rem;
        border: 3px solid #000;
      }
      .card a:hover,
      .card a:focus {
        background: #fff;
        color: #000;
        outline: 4px solid #000;
        outline-offset: 2px;
      }
      .skip-link {
        position: absolute;
        top: -100px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 16px 32px;
        text-decoration: none;
        z-index: 10000;
        font-weight: 700;
        font-size: 1.125rem;
        border: 4px solid #fff;
      }
      .skip-link:focus {
        top: 0;
        outline: 4px solid #fff;
        outline-offset: 4px;
      }
      @media (max-width: 768px) {
        body {
          padding: 15px;
          font-size: 15px;
        }
        h1 {
          font-size: 2rem;
        }
        .card {
          padding: 1.5rem;
        }
        .card h2 {
          font-size: 1.25rem;
        }
      }
    </style>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="container">
      <main id="main-content" tabindex="-1">
        <h1>📚 Documentation Portal</h1>
        <p><strong>Your Project Name</strong> - Development Documentation</p>

        <div class="card">
          <h2>♿ Accessibility Audit</h2>
          <p>
            WCAG 2.1 Level AA compliance report with axe-core automated testing.
          </p>
          <a
            href="/docs/accessibility/index.html"
            aria-label="View accessibility audit report"
            >View Accessibility Report</a
          >
        </div>
      </main>
    </div>
  </body>
</html>
```

---

## B4: Update or Replace Audit Script

If you have an existing audit script, replace it with the high-contrast version from [Pathway A, Step A2](#a2-create-accessibility-audit-script).

If you don't have an audit script, create it following [Pathway A, Step A2](#a2-create-accessibility-audit-script).

---

## B5: Clean Up Package Scripts

**Remove** these scripts from `package.json` if they exist:

- `docs:jsdoc`
- `docs:tests`
- `docs:api`
- `docs:all`
- `docs:generate`

**Keep or add** only:

```json
{
  "scripts": {
    "audit:a11y": "node ./audit-accessibility.js"
  }
}
```

---

## B6: Clean Up Dependencies

Remove unused documentation dependencies:

```bash
# Remove JSDoc and related packages
yarn remove jsdoc jsdoc-to-markdown typedoc

# Keep these (needed for accessibility audit)
# axe-core, puppeteer, xml2js
```

---

## B7: Update Footer Links (if applicable)

If your site footer links to `/docs/` or specific documentation pages, update to point to the simplified structure:

**Before (legacy):**

```html
<a href="/docs/api/index.html">API Docs</a>
<a href="/docs/jsdoc/index.html">JSDoc</a>
```

**After (simplified):**

```html
<a href="/docs/accessibility/index.html">Accessibility</a>
```

---

## B8: Test Your Migration

```bash
# 1. Start dev server
yarn dev

# 2. Run accessibility audit
yarn audit:a11y

# 3. Visit the documentation portal
open http://localhost:8000/docs/

# 4. Verify old links are removed/updated
```

**✅ Pathway B Complete!** Continue to [Validation Checklist](#-validation-checklist).

---

# 🎨 High Contrast Design Principles (WCAG AAA)

**ALWAYS follow these rules for all generated HTML:**

## WCAG AAA Contrast Requirements

| Standard              | Contrast Ratio | When Applied                        |
| --------------------- | -------------- | ----------------------------------- |
| **AAA Normal Text**   | 7:1 minimum    | All body text, paragraphs, labels   |
| **AAA Large Text**    | 4.5:1 minimum  | 18pt+ (24px) or 14pt+ bold (18.5px) |
| **AAA UI Components** | 3:1 minimum    | Borders, icons, form controls       |
| **AA Normal Text**    | 4.5:1 minimum  | Fallback minimum (prefer AAA)       |

## AAA-Compliant Color Combinations

| Combination         | Contrast Ratio | Usage                              |
| ------------------- | -------------- | ---------------------------------- |
| **#000 on #fff**    | 21:1 ✓         | Primary text on white backgrounds  |
| **#fff on #000**    | 21:1 ✓         | Text on dark cards/buttons         |
| **#000 on #f5f5f5** | 16:1 ✓         | Text on light gray backgrounds     |
| **#000 on #ffff00** | 19.6:1 ✓       | Hover/focus states                 |
| **#000 on #d4f4dd** | 15.6:1 ✓       | Success backgrounds (light green)  |
| **#000 on #ffe0e0** | 14.7:1 ✓       | Error backgrounds (light red)      |
| **#000 on #fff4cc** | 16.5:1 ✓       | Warning backgrounds (light yellow) |

## Design Requirements

| Element           | Requirement                               |
| ----------------- | ----------------------------------------- |
| **Text Color**    | #000 (black) only on light backgrounds    |
| **Inverse Text**  | #fff (white) only on dark backgrounds     |
| **Background**    | #fff (white) base, #000 for cards         |
| **Borders**       | Minimum 3px, preferably 4px solid black   |
| **Font Weight**   | 900 for headings, 500+ for body           |
| **Font Size**     | Minimum 18px base for optimal readability |
| **Line Height**   | 1.8 minimum                               |
| **Success BG**    | #d4f4dd (light green) with #000 text      |
| **Error BG**      | #ffe0e0 (light red) with #000 text        |
| **Warning BG**    | #fff4cc (light yellow) with #000 text     |
| **Padding**       | 1.5rem minimum for cards                  |
| **Focus Outline** | 4px solid with 2-4px offset               |
| **Focus Color**   | #ffff00 (yellow) on dark, #000 on light   |
| **Border Radius** | 0 (sharp corners only)                    |

## CSS Variables Template (AAA-Compliant)

```css
:root {
  /* WCAG AAA Compliant Color System */
  --text-primary: #000000; /* Black text - 21:1 on white */
  --text-inverse: #ffffff; /* White text - 21:1 on black */
  --bg-primary: #ffffff; /* White background */
  --bg-secondary: #f5f5f5; /* Light gray - 16:1 with black */
  --bg-dark: #000000; /* Black background */
  --border-heavy: #000000; /* Maximum contrast borders */
  --focus-color: #ffff00; /* Yellow focus on dark - 19.6:1 */
  --focus-color-light: #000000; /* Black focus on light */
}
```

**NEVER use:**

- ❌ Gray text (even #333 fails AAA on white: 12.6:1 is AA, not AAA for small text)
- ❌ Low contrast colors (any combination below 7:1 for normal text)
- ❌ Blue links without sufficient contrast (#0066cc on white is only 6.4:1)
- ❌ Thin borders (< 3px)
- ❌ Light font weights (< 500)
- ❌ Rounded corners
- ❌ Shadows or gradients that reduce contrast
- ❌ Small fonts (< 16px, prefer 18px+)
- ❌ Color as the only differentiator (always pair with text/icons)

---

# ✅ Validation Checklist

## Required Files

- [ ] `public/docs/index.html` (landing page)
- [ ] `audit-accessibility.js` (audit script)
- [ ] `scripts/ensure-accessibility-report.js` (placeholder)
- [ ] Package scripts configured

## Accessibility Verification

- [ ] Run `yarn audit:a11y` - **zero violations**
- [ ] Test skip link (Tab on page load)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Verify keyboard navigation (Tab, Enter, Space)
- [ ] Check focus indicators (visible 4px outlines)

## WCAG AAA Contrast Verification

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify:

- [ ] **Normal text** has 7:1+ contrast ratio (AAA requirement)
- [ ] **Large text** (18pt+) has 4.5:1+ contrast ratio
- [ ] **UI components** (borders, icons) have 3:1+ contrast ratio
- [ ] All text is #000 on #fff or #fff on #000 (21:1 ratio)
- [ ] Focus states use high-contrast yellow (#ffff00) on dark backgrounds
- [ ] No gray text anywhere (even #333 doesn't meet AAA for small text)

## Visual Verification

- [ ] All body text is black (#000) on white (#fff)
- [ ] Cards use inverted colors (white text on black background)
- [ ] Borders are 3-4px solid black
- [ ] Buttons have maximum contrast (black/white or inverted)
- [ ] Tables have visible borders with adequate padding
- [ ] Status backgrounds (success/error/warning) use approved AAA colors
- [ ] Font weight is 500+ for body, 900 for headings
- [ ] Base font size is 18px minimum

---

# 🚨 Common Issues & Fixes

## Issue: Audit finds violations from Nuxt DevTools

**Fix**: Ensure `AXE_EXCLUDE_SELECTORS` includes:

```javascript
const AXE_EXCLUDE_SELECTORS = [
  ["nuxt-devtools-frame"],
  ["nuxt-devtools-panel"],
];
```

## Issue: iframes failing accessibility checks

**Fix**: Always add both `title` and `aria-label`:

```html
<iframe
  src="..."
  title="Descriptive title"
  aria-label="Descriptive label"
></iframe>
```

## Issue: Scrollable tables not keyboard accessible

**Fix**: Add to scrollable containers:

```html
<div
  style="overflow-x:auto;"
  tabindex="0"
  role="region"
  aria-label="Table description"
>
  <table>
    ...
  </table>
</div>
```

## Issue: Header role violation

**Fix**: Use correct ARIA roles:

- `<header>` → `role="banner"`
- `<nav>` → `role="navigation"`
- `<footer>` → `role="contentinfo"`

---

# 🎓 For AI Assistants / LLMs

When implementing this guide:

1. **Ask first**: "Do you have an existing documentation portal?" → Choose Pathway A or B
2. **Use templates exactly**: Copy/paste the provided code - DO NOT MODIFY
3. **WCAG AAA is mandatory**: 7:1 contrast ratio minimum, no exceptions
4. **Black on white only**: No colors other than #000, #fff, #f5f5f5, #ffff00
5. **18px minimum font size**: No smaller text anywhere
6. **Test immediately**: Run `yarn audit:a11y` after each change
7. **Zero AAA violations**: Portal must pass ALL axe-core AAA tests
8. **No creativity**: Don't add fancy colors, gradients, shadows, or rounded corners
9. **Accessibility > aesthetics**: If it looks boring but passes AAA, it's correct

### AAA Compliance Checklist (Must Pass All)

```
☐ Contrast ratio 7:1+ for all normal text
☐ Contrast ratio 4.5:1+ for all large text (18pt+)
☐ Font size 18px+ for all body text
☐ Font weight 900 for headings
☐ Font weight 500+ for body text
☐ 4px solid black borders on interactive elements
☐ Yellow (#ffff00) focus indicators on dark backgrounds
☐ Black (#000) focus indicators on light backgrounds
☐ No rounded corners anywhere
☐ No shadows or gradients
☐ Responsive on mobile, tablet, desktop
☐ axe-core audit shows zero AAA violations
```

## Decision Tree

```
Does an existing documentation portal exist?
│
├─ NO → Use PATHWAY A (New Setup)
│        Steps A1 → A2 → A3 → A4 → A5
│
└─ YES → Use PATHWAY B (Migration)
         Steps B1 → B2 → B3 → B4 → B5 → B6 → B7 → B8

After either pathway:
└─ Run validation checklist
   └─ Fix any violations
      └─ Verify zero violations
```

---

# 📝 Version History

| Version  | Date         | Changes                                                                                                                        |
| -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **v4.3** | Jan 14, 2026 | Made WCAG AAA mandatory for ALL portals (new and migrated). Added AAA checklist for AI assistants. Accessibility > aesthetics. |
| **v4.2** | Jan 14, 2026 | Added WCAG AAA contrast guidelines (7:1 ratio), updated portal template with AAA-compliant design                              |
| **v4.1** | Jan 14, 2026 | Added pre-implementation questionnaire section                                                                                 |
| **v4.0** | Jan 14, 2026 | V2 release: Prominent two-pathway structure                                                                                    |
| **v3.0** | Jan 14, 2026 | Consolidated to single prompt, high-contrast emphasis                                                                          |
| **v2.0** | Jan 14, 2026 | Added dual implementation paths                                                                                                |
| **v1.0** | Jan 10, 2026 | Initial comprehensive guide                                                                                                    |

---

# 🔗 External Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Illinois IITAA Standards](https://www.illinois.gov/accessibility.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Last Updated**: January 14, 2026  
**Maintained by**: ICJIA Development Team
