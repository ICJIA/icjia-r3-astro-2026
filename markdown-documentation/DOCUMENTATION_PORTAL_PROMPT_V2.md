# Documentation Portal Implementation Prompt V2

**Version**: 4.1  
**Last Updated**: January 14, 2026  
**Purpose**: Single comprehensive prompt for creating or migrating to a simplified, high-contrast, accessible documentation portal

> 💡 **Start with the [Questions](#-questions-to-ask-before-starting)** before generating any code.

---

## 🎯 Core Principle

**Keep it simple.** Focus exclusively on accessibility compliance. No fancy features. High contrast. Fully accessible. Responsive design.

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

Regardless of which pathway you choose, the end result is the same:

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

## A1: Create Portal Landing Page

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
      h2 {
        font-size: 1.5rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: #000;
        font-weight: 700;
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
        margin-top: 0;
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
      /* Skip link */
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
      /* Responsive */
      @media (max-width: 768px) {
        body {
          padding: 15px;
          font-size: 15px;
        }
        h1 {
          font-size: 2rem;
        }
        h2 {
          font-size: 1.25rem;
        }
        .card {
          padding: 1.5rem;
        }
      }
    </style>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="container">
      <main id="main-content" tabindex="-1">
        <h1>📚 Documentation Portal</h1>
        <p><strong>Project Name</strong> - Development Documentation</p>

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

# 🎨 High Contrast Design Principles

**ALWAYS follow these rules for all generated HTML:**

| Element           | Requirement                             |
| ----------------- | --------------------------------------- |
| **Text Color**    | #000 (black) only                       |
| **Background**    | #fff (white) base                       |
| **Borders**       | Minimum 3px, preferably 4px solid black |
| **Font Weight**   | 700+ for headings, 500+ for body        |
| **Font Size**     | Minimum 16px base                       |
| **Line Height**   | 1.8 minimum                             |
| **Success BG**    | #d4f4dd (light green)                   |
| **Error BG**      | #ffe0e0 (light red)                     |
| **Warning BG**    | #fff4cc (light yellow)                  |
| **Padding**       | 1.5rem minimum for cards                |
| **Focus Outline** | 4px solid with 4px offset               |
| **Border Radius** | 0 (sharp corners only)                  |

**NEVER use:**

- ❌ Gray text
- ❌ Low contrast colors
- ❌ Thin borders (< 3px)
- ❌ Light font weights (< 500)
- ❌ Rounded corners
- ❌ Shadows or gradients
- ❌ Small fonts (< 16px)

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
- [ ] Check color contrast (all text #000 on #fff)
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Verify keyboard navigation (Tab, Enter, Space)
- [ ] Check focus indicators (visible 4px outlines)

## Visual Verification

- [ ] All text is black on white
- [ ] Borders are 3-4px solid black
- [ ] Cards have clear boundaries
- [ ] Buttons have high contrast
- [ ] Tables have visible borders
- [ ] Stat cards use approved backgrounds only

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
2. **Use templates exactly**: Copy/paste the provided code
3. **High contrast only**: Black on white, no exceptions
4. **Test immediately**: Run audit after each change
5. **Fix all violations**: Zero tolerance for accessibility issues
6. **One feature only**: Focus exclusively on accessibility audits
7. **No creativity**: Don't add features, styling, or improvements

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

| Version  | Date         | Changes                                               |
| -------- | ------------ | ----------------------------------------------------- |
| **v4.1** | Jan 14, 2026 | Added pre-implementation questionnaire section        |
| **v4.0** | Jan 14, 2026 | V2 release: Prominent two-pathway structure           |
| **v3.0** | Jan 14, 2026 | Consolidated to single prompt, high-contrast emphasis |
| **v2.0** | Jan 14, 2026 | Added dual implementation paths                       |
| **v1.0** | Jan 10, 2026 | Initial comprehensive guide                           |

---

# 🔗 External Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Illinois IITAA Standards](https://www.illinois.gov/accessibility.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Last Updated**: January 14, 2026  
**Maintained by**: ICJIA Development Team
