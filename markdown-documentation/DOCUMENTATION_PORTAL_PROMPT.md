# Documentation Portal Implementation Prompt

**Version**: 3.0  
**Last Updated**: January 14, 2026  
**Purpose**: Single comprehensive prompt for creating or migrating to a simplified, high-contrast, accessible documentation portal

---

## 🎯 Core Principle

**Keep it simple.** Focus exclusively on accessibility compliance. No fancy features. High contrast. Fully accessible. Responsive design.

---

## 📋 When to Use This Guide

- **New Project**: Building documentation portal from scratch
- **Migration**: Simplifying an existing over-engineered portal
- **Compliance**: Need WCAG 2.1 Level AA accessibility
- **State Requirements**: Meeting IITAA (Illinois) standards

---

## 🚀 Implementation Steps

### Step 1: Create Portal Landing Page

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

**Key Features:**

- ✅ High contrast (black on white, no gray text)
- ✅ 4px borders for clarity
- ✅ Large, bold headings
- ✅ Skip link implementation
- ✅ Responsive design
- ✅ Focus indicators
- ✅ No JavaScript required

---

### Step 2: Create Accessibility Audit Script

**File**: `audit-accessibility.js`

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

**Configuration Notes:**

- Edit only the "DEVELOPER CONFIGURATION" section
- Set `DEV_SERVER_PORT` to match your dev server
- Update `SITE_INFO` with your project details
- Customize `AXE_RULE_CONFIG` for specific needs

---

### Step 3: Add Package Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "dev": "nuxt dev --port=8000",
    "dev:audit": "nuxt dev --port=8000",
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

### Step 4: Create Placeholder Script

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

## 🎨 High Contrast Design Principles

**ALWAYS follow these rules:**

1. **Colors**: Only black (#000) and white (#fff)
2. **Borders**: Minimum 3px, preferably 4px solid black
3. **Font Weight**: 700+ for headings, 500+ for body
4. **Font Size**: Minimum 16px base, 1.8 line-height
5. **Backgrounds**:
   - Success: #d4f4dd (light green)
   - Error: #ffe0e0 (light red)
   - Warning: #fff4cc (light yellow)
6. **Padding**: Generous (1.5rem minimum for cards)
7. **Focus Indicators**: 4px solid outline with 4px offset
8. **Skip Links**: Black bg, white text, 16px padding

**NO:**

- ❌ Gray text
- ❌ Low contrast colors
- ❌ Thin borders (< 3px)
- ❌ Light font weights (< 500)
- ❌ Border radius (keep sharp corners)
- ❌ Shadows or gradients
- ❌ Small fonts (< 16px)

---

## 🔧 Migration from Legacy Portal

### If You Have Existing Documentation Portal

**Step 1: Remove Old Files**

```bash
# Remove complex documentation if it exists
rm -rf public/docs/tests/
rm -rf public/docs/jsdoc/
rm -f creators/createDocumentationHTML.js
```

**Step 2: Simplify Landing Page**

Replace `public/docs/index.html` with the simple version above (Step 1).

**Step 3: Update Audit Script**

Replace your audit script with the high-contrast version above (Step 2).

**Step 4: Remove Unused Scripts**

Check `package.json` for documentation-related scripts and remove:

- `docs:jsdoc`
- `docs:tests`
- `docs:all`

Keep only:

- `audit:a11y`

**Step 5: Clean Up Dependencies**

Remove if no longer needed:

- `jsdoc`
- Any TypeDoc-related packages

**Step 6: Test**

```bash
yarn dev
# In another terminal:
yarn audit:a11y
# Visit http://localhost:8000/docs/
```

---

## ✅ Validation Checklist

### Required Files

- [ ] `public/docs/index.html` (landing page)
- [ ] `audit-accessibility.js` (audit script)
- [ ] `scripts/ensure-accessibility-report.js` (placeholder)
- [ ] Package scripts configured

### Accessibility Verification

- [ ] Run `yarn audit:a11y` - zero violations
- [ ] Test skip link (Tab on keyboard)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Check color contrast (all text #000 on #fff)
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Verify keyboard navigation (Tab, Enter, Space)
- [ ] Check focus indicators (visible 4px outlines)

### Visual Verification

- [ ] All text is black on white
- [ ] Borders are 3-4px solid black
- [ ] Cards have clear boundaries
- [ ] Buttons have high contrast
- [ ] Tables have visible borders
- [ ] Stat cards use approved backgrounds

---

## 🚨 Common Issues & Fixes

### Issue: Audit finds violations on dev server

**Cause**: Nuxt DevTools overlay is being scanned

**Fix**: Ensure `AXE_EXCLUDE_SELECTORS` includes:

```javascript
const AXE_EXCLUDE_SELECTORS = [
  ["nuxt-devtools-frame"],
  ["nuxt-devtools-panel"],
];
```

### Issue: iframes failing accessibility checks

**Fix**: Always add both `title` and `aria-label`:

```html
<iframe
  src="..."
  title="Descriptive title"
  aria-label="Descriptive label"
></iframe>
```

### Issue: Scrollable tables not keyboard accessible

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

### Issue: Header role violation

**Fix**: Use correct ARIA roles:

- `<header>` → `role="banner"`
- `<nav>` → `role="navigation"`
- `<footer>` → `role="contentinfo"`
- `<main>` → `role="main"` (implicit)

---

## 📚 WCAG 2.1 Level AA Requirements

### Must-Have Features

1. **Skip Links** (2.4.1 Bypass Blocks)

   - First focusable element
   - Visible on focus
   - Links to `#main-content`

2. **Color Contrast** (1.4.3 Contrast Minimum)

   - 4.5:1 for normal text
   - 3:1 for large text
   - Use black on white

3. **Keyboard Navigation** (2.1.1 Keyboard)

   - All interactive elements via Tab
   - No keyboard traps
   - Logical tab order

4. **Focus Indicators** (2.4.7 Focus Visible)

   - Visible on all interactive elements
   - 4px minimum width
   - High contrast

5. **Semantic HTML** (4.1.1 Parsing, 4.1.2 Name/Role/Value)

   - Proper heading hierarchy
   - Landmarks (main, nav, footer)
   - Alt text for images

6. **Responsive** (1.4.10 Reflow)
   - Works at 320px width
   - No horizontal scroll
   - Text scales to 200%

---

## 🎓 For AI Assistants / LLMs

When implementing this guide:

1. **Start Simple**: Use provided templates exactly
2. **High Contrast Only**: Black on white, no exceptions
3. **Test Immediately**: Run audit after each change
4. **Fix All Violations**: Zero tolerance for accessibility issues
5. **One Feature**: Focus exclusively on accessibility audits
6. **No Creativity**: Don't add features or styling
7. **Document Changes**: Update this file if patterns change

### Decision Tree for Implementation

```
Is there an existing documentation portal?
├─ NO  → Use Step 1-4 templates exactly
└─ YES →
   ├─ Is it complex with multiple features?
   │  ├─ YES → Remove extras, use Step 1-4 templates
   │  └─ NO  → Update styling to high contrast
   └─ Run audit, fix violations, verify zero violations
```

---

## 📝 Maintenance

### When to Update This Document

- Accessibility requirements change
- WCAG updates released
- New browser accessibility features
- State/federal compliance changes
- Audit script improvements

### Version History

- **v3.0** (Jan 14, 2026): Consolidated to single prompt, high-contrast emphasis
- **v2.0** (Jan 14, 2026): Added dual implementation paths
- **v1.0** (Jan 10, 2026): Initial comprehensive guide

---

## 🔗 External Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Illinois IITAA Standards](https://www.illinois.gov/accessibility.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Last Updated**: January 14, 2026  
**Maintained by**: ICJIA Development Team
