# 🚀 Documentation Portal Implementation Prompt V4 (Optimized)

**Version**: 4.0 (Performance Optimized)  
**Last Updated**: January 17, 2026  
**Core Directive**: Mandatory WCAG 2.1 Level AAA compliance. Accessibility over aesthetics. Use the **AAA Specification Table** below for ALL generation.

---

## 📚 CANONICAL REFERENCES

1. **Portal Landing Page**: [ICJIA Documentation Portal](https://r3.illinois.gov/docs/)
2. **Accessibility Report**: [ICJIA Accessibility Report Reference](https://r3.illinois.gov/docs/accessibility/index.html)
3. **Master Audit Script**: [`audit-accessibility.js` (Reference Implementation)](https://github.com/ICJIA/icjia-r3-v5-nuxt/blob/main/audit-accessibility.js)

_Note: The Master Audit Script is in a private repository. If you are an AI assistant and receive a 404, you may need the user to provide the script content or ensure your environment has the necessary GitHub Personal Access Token (PAT) configured._

_The generated portal and its reports MUST mirror the layout, high-contrast theme, and content sections found in these references. Project names and URLs must be parameterized based on the Questionnaire._

---

## 🛠️ AAA SPECIFICATION TABLE (NON-NEGOTIABLE)

| Category        | Requirement      | Standard / Value                                            |
| :-------------- | :--------------- | :---------------------------------------------------------- |
| **Contrast**    | Normal Text      | **7:1 minimum** (Black #000 on White #fff)                  |
| **Contrast**    | Interactive / UI | **7:1 minimum** (Exceeds AA 3:1)                            |
| **Typography**  | Font Size        | **16px minimum** (18px recommended base)                    |
| **Typography**  | Line Height      | **1.5 minimum** (1.8 preferred)                             |
| **Interactive** | Touch Targets    | **44x44px minimum** (All links & buttons)                   |
| **Interactive** | Focus State      | **4px solid yellow (#ffff00)** on dark / **Black** on light |
| **Visuals**     | Border Radius    | **0px** (Sharp corners only)                                |
| **Visuals**     | Layout           | No justified text, no horizontal scroll at 200% zoom        |

---

## ❓ PRE-IMPLEMENTATION QUESTIONNAIRE

**Ask the user these questions before writing any code:**

1.  **Project Name**: [e.g., R3 Restore, Reinvest, Renew]
2.  **Pathway**: [A] New Setup or [B] Migration (Existing `/public/docs/`)?
3.  **Framework**: [e.g., Nuxt 3 + Vuetify 3, React, etc.]
4.  **Dev Port**: [Default: 8000] | **Production URL**: [Full HTTPS URL]
5.  **Sitemap Location**: [Default: `public/sitemap.xml`]

---

## 🏗️ PATHWAY A: NEW SETUP / PATHWAY B: MIGRATION

### 1. Unified Master Audit Script (`audit-accessibility.js`)

_This script replaces all previous audit and verification tools._

```javascript
import puppeteer from "puppeteer";
import axeCore from "axe-core";
import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";

// CONFIGURATION
const CONFIG = {
  baseUrl: "http://localhost:8000", // Update based on Q4
  productionUrl: "https://yoursite.gov",
  sitemapPath: "./public/sitemap.xml",
  outputDir: "./public/docs/accessibility",
  viewports: [
    { width: 1920, height: 1080, name: "desktop" },
    { width: 375, height: 812, name: "mobile" },
  ],
  exclude: [".v-overlay-container", "nuxt-devtools-frame"], // Framework specific (Q3)
};

async function runAudit() {
  const browser = await puppeteer.launch({ headless: "new" });
  const results = [];

  // 1. Get URLs from sitemap (MANDATORY: Verify sitemap.xml structure before parsing)
  const xml = fs.readFileSync(CONFIG.sitemapPath, "utf8");
  const sitemap = await parseStringPromise(xml);
  const urls = sitemap.urlset.url.map((u) =>
    u.loc[0].replace(CONFIG.productionUrl, CONFIG.baseUrl)
  );

  for (const url of urls) {
    for (const vp of CONFIG.viewports) {
      const page = await browser.newPage();
      await page.setViewport(vp);
      await page.goto(url, { waitUntil: "networkidle0" });

      // 2. Run Axe-Core (WCAG 2.1 AAA)
      await page.addScriptTag({ content: axeCore.source });
      const axe = await page.evaluate(
        (ex) =>
          axe.run({
            exclude: ex,
            runOnly: ["wcag2a", "wcag2aa", "wcag2aaa", "wcag21aaa"],
          }),
        CONFIG.exclude
      );

      // 3. Custom AAA Checks (Touch Targets & Font Size)
      const custom = await page.evaluate(() => {
        const interactive = document.querySelectorAll(
          "a, button, input, select"
        );
        const textNodes = document.querySelectorAll("p, li, span, div");
        return {
          touchFails: Array.from(interactive).filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width < 44 || r.height < 44;
          }).length,
          fontFails: Array.from(textNodes).filter((el) => {
            const s = parseFloat(window.getComputedStyle(el).fontSize);
            return el.innerText.trim().length > 0 && s < 16;
          }).length,
        };
      });

      results.push({
        url,
        viewport: vp.name,
        violations: axe.violations,
        custom,
      });
      await page.close();
    }
  }

  generateReport(results);
  await browser.close();
}

function generateReport(data) {
  // MANDATORY: Generate high-contrast HTML mirroring the CANONICAL REFERENCE exactly.
  // 1. CSS: Use :root { --b: #000; --w: #fff; --y: #ffff00; }
  // 2. LAYOUT: .stat-grid (cards), .results-table (scrollable), .info-sections (explanatory).
  // 3. CONTENT: Map 'data' array to table rows. Calculate totalViolations/Passes for cards.
  // 4. TOUCH TARGETS: All links in report must be 44x44px min.
  // 5. SAVE: fs.writeFileSync(path.join(CONFIG.outputDir, 'index.html'), html);
}
runAudit();
```

### 2. Master Portal Template (`public/docs/index.html`)

_MANDATORY: Mirror the [Portal Landing Page Reference](https://r3.illinois.gov/docs/) exactly._

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Documentation - {{PROJECT_NAME}}</title>
    <style>
      :root {
        --b: #000;
        --w: #fff;
        --y: #ffff00;
      }
      body {
        font-family: sans-serif;
        background: #f5f5f5;
        color: var(--b);
        font-size: 18px;
        line-height: 1.8;
        margin: 0;
      }
      .container {
        max-width: 900px;
        margin: 2rem auto;
        background: var(--w);
        padding: 3rem;
        border: 4px solid var(--b);
      }
      h1 {
        font-size: 2.5rem;
        font-weight: 900;
        border-bottom: 6px solid var(--b);
        padding-bottom: 1rem;
      }
      .card {
        background: var(--b);
        color: var(--w);
        padding: 2rem;
        border: 4px solid var(--b);
        margin: 2rem 0;
      }
      a {
        display: inline-block;
        min-width: 44px;
        min-height: 44px;
        padding: 12px 20px;
        background: var(--w);
        color: var(--b);
        text-decoration: none;
        font-weight: 900;
        border: 3px solid var(--w);
      }
      a:hover,
      a:focus {
        background: var(--y);
        border-color: var(--b);
        outline: 4px solid var(--y);
        outline-offset: 2px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
      .aaa-badge {
        display: inline-block;
        background: var(--b);
        color: var(--w);
        padding: 4px 12px;
        font-size: 0.875rem;
        font-weight: 900;
        border: 2px solid var(--b);
        margin-left: 8px;
        vertical-align: middle;
      }
    </style>
  </head>
  <body>
    <main class="container">
      <h1>📚 Documentation Portal <span class="aaa-badge">WCAG AAA</span></h1>
      <p>
        Welcome to the documentation portal for
        <strong>{{PROJECT_NAME}}</strong>. This portal provides accessibility
        audit reports to ensure the website meets
        <strong>WCAG 2.1 Level AA</strong> standards. This portal itself is
        designed to meet <strong>WCAG 2.1 Level AAA</strong> contrast
        requirements (7:1 minimum for normal text).
      </p>

      <section class="card">
        <h2>♿ Accessibility Audit</h2>
        <p>Automated and manual AAA verification reports.</p>
        <a href="/docs/accessibility/index.html"
          >View Audit Report
          <span class="sr-only">(Opens in new window)</span></a
        >
      </section>

      <footer
        style="margin-top: 2rem; border-top: 4px solid var(--b); padding-top: 1rem;"
      >
        <p>
          <strong>Repo access</strong>: This project repository is
          [PRIVATE/PUBLIC]. If you need access to source code or internal
          documentation, please contact the
          <strong>web development team</strong>.
        </p>
        <p><strong>Last updated</strong>: <span id="portal-date">-</span></p>
        <a
          href="/"
          style="background: none; border: none; text-decoration: underline; padding: 0; min-height: 0; min-width: 0;"
          >← Back to Application</a
        >
      </footer>
    </main>
    <script>
      document.getElementById("portal-date").textContent =
        new Date().toLocaleDateString();
    </script>
  </body>
</html>
```

---

## 🚨 ANTI-HALLUCINATION & SECURITY SAFEGUARDS (FOR LLM)

1.  **CANONICAL LOOK**: The final portal (`/docs/index.html`) and reports must look exactly like the [Portal Reference](https://r3.illinois.gov/docs/) and [Report Reference](https://r3.illinois.gov/docs/accessibility/index.html).
2.  **NO GRADIENTS / SHADOWS**: If you see a `box-shadow` or `linear-gradient` in your output, DELETE IT.
3.  **SHARP EDGES**: Use `border-radius: 0` for all cards, buttons, and containers.
4.  **MAX CONTRAST**: Only use #000, #fff, and #ffff00. No grays (e.g., #333 is forbidden).
5.  **SIZE MATTERS**: Every link must be `display: inline-block` with `min-height: 44px`.
6.  **SKIP LINKS**: Ensure `app.vue` (or root layout) has skip links as the **first** child of `<body>`.
7.  **SCRIPT PURGE**: Delete ALL `package.json` scripts that generate external documentation or reports (e.g., `docs:jsdoc`, `docs:typedoc`, `a11y:gen`). The **ONLY** allowed report script is `audit:a11y`.
8.  **SINGLE SOURCE OF TRUTH**: Only `audit-accessibility.js` is permitted to generate HTML components in `/docs/`. While `test`, `jsdoc`, or `typedoc` tools may be used for console-based verification or internal code commenting, they must NOT generate any files or folders inside `/docs/`.
9.  **JSDOC/TYPEDOC POLICY**: JSDoc and TypeDoc **comments** are allowed and encouraged within code files for developer reference. However, any automation that converts these comments into HTML/JSON documentation portals must be removed.
10. **ASK BEFORE ACTING**: If you are unsure if a script generates reports or is necessary, YOU MUST ASK THE USER BEFORE DELETING OR MODIFYING IT.
11. **PACKAGE MANAGER**: **Yarn is the preferred manager.** If you need to use `npm` (or if it's the only one present), YOU MUST CONSULT THE USER FIRST.

---

## ✅ VALIDATION CHECKLIST

- [ ] `audit:a11y` script combines Axe-Core + Touch Target + Font Size checks.
- [ ] Portal landing page passes 7:1 contrast on all text.
- [ ] All interactive elements are ≥ 44px.
- [ ] Zero usage of CommonJS (`require`). All ESM (`import`). (If project is CJS, convert script to `require`).
- [ ] `package.json` includes `axe-core`, `puppeteer`, and `xml2js`.
- [ ] ALL legacy documentation scripts (JSDoc, TypeDoc, a11y) removed from `package.json`.
- [ ] JSDoc/TypeDoc comments preserved in code, but report generation removed.
- [ ] `test` and other scripts verified to output to console only (NOT /docs/).
- [ ] `yarn` used for dependency management (consult user if `npm` is needed).

---

## 📝 DECISION LOGIC

```
IF Migration (Pathway B):
  1. Delete /public/docs/jsdoc, /public/docs/tests
  2. Overwrite /public/docs/index.html with Master Template
  3. Clean package.json: Delete all JSDoc, TypeDoc, and a11y scripts except 'audit:a11y'
  4. Verify 'test' script outputs to console only (no /docs/ generation)
  5. Install deps: **Use `yarn add -D` (Preferred).** CONSULT USER if `npm` is required.
  6. Run audit-accessibility.js
  7. IF UNSURE about a script: ASK THE USER.
ELSE (Pathway A):
  1. Create directories: /public/docs/accessibility
  2. Create files from Master Templates
  3. Ensure only 'audit:a11y' is added to package.json
  4. Install deps: **Use `yarn add -D` (Preferred).** CONSULT USER if `npm` is required.
  5. Run audit-accessibility.js
```
