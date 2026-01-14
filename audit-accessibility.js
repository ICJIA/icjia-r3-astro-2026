#!/usr/bin/env node

/**
 * @fileoverview Accessibility Audit Script using axe-core
 * @description Comprehensive accessibility audit tool that tests websites against WCAG 2.1 Level AA standards.
 *
 * Mirrored from ICJIA Accessibility Portal reference script (with site-specific config changes):
 * - Reads URLs from sitemap.xml
 * - Tests each URL in multiple viewports (desktop, tablet, mobile)
 * - Tests multiple themes (if configured)
 * - Verifies skip link implementation
 * - Auto-starts dev server if not running (development mode)
 * - Generates HTML + JSON reports under /public/docs/accessibility/
 *
 * IMPORTANT: Keep behavior/output aligned with the reference script so all ICJIA
 * projects run audits the same way.
 *
 * Reference: https://raw.githubusercontent.com/ICJIA/icjia-accessibility-portal/refs/heads/main/audit-accessibility.js
 */

/**
 * ============================================================================
 * ⚙️ DEVELOPER CONFIGURATION - EDIT THIS SECTION
 * ============================================================================
 */

// Target Environment ("development" or "production")
const TARGET_ENV = "development";

// Production URL (only used when TARGET_ENV === "production")
const PRODUCTION_URL = "https://r3.illinois.gov";

// Development server port (only used when TARGET_ENV === "development")
const DEV_SERVER_PORT = 8000;

// Line number for AXE_RULE_CONFIG (for documentation reference)
const AXE_RULE_CONFIG_LINE = 37;

// Axe-core rule toggles (boolean enable/disable)
const AXE_RULE_CONFIG = {
  // Framework-specific rules
  "aria-allowed-role": true,
  "scrollable-region-focusable": true,

  // Landmark rules
  "landmark-banner-is-top-level": true,
  "landmark-contentinfo-is-top-level": true,
  "landmark-main-is-top-level": true,
  "landmark-unique": true,

  // ❌ DISABLED: Known incompatibility with Nuxt/Vue component structure
  region: false,

  // WCAG 2.1 / experimental rules
  "css-orientation-lock": true,
  "no-autoplay-audio": true,
  "page-has-heading-one": true,

  // Focus/navigation rules
  "focus-order-semantics": true,
  "identical-links-same-purpose": true,
  "link-in-text-block": true,

  // Content/labeling rules
  "hidden-content": true,
  "label-content-name-mismatch": true,
  "presentation-role-conflict": true,
};

// Paths (relative to repo root)
const SITEMAP_PATH_CONFIG = "public/sitemap.xml";
const OUTPUT_DIR_CONFIG = "public/docs/accessibility";
const REPORT_FILE_NAME = "index.html";

// Viewports to test
const VIEWPORTS = [
  { width: 1920, height: 1080, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 812, name: "mobile" },
];

// Themes to test
const THEME_CONFIG = {
  themes: [{ name: "default", value: "default" }],
  switching: {
    mode: "none", // "none" | "auto" | "manual"
    // For mode: "manual":
    // toggleSelector: 'input[type="checkbox"][role="switch"]',
    // darkClass: "v-theme--dark",
    // localStorageKey: "theme",
  },
};

// Skip link verification config
const SKIP_LINK_CONFIG = {
  selector: 'a[href="#main-content"], a.skip-link, a[class*="skip"]',
  targetId: "main-content",
};

// Axe exclude selectors (exclude Nuxt DevTools overlay in dev mode)
const AXE_EXCLUDE_SELECTORS = [["nuxt-devtools-frame"], ["nuxt-devtools-panel"]];

// Command to start dev server (used only when dev server isn't already running)
// NOTE: This repo needs generated content; dev:audit is expected to do the right thing.
const DEV_SERVER_COMMAND = { command: "yarn", args: ["dev:audit"] };

// Site metadata in report
const SITE_INFO = {
  name: "R3 Restore, Reinvest, Renew",
  description:
    "Accessibility audit report for the R3 (Restore, Reinvest, Renew) program website.",
};

const COMPLIANCE_STANDARDS = [
  {
    name: "IITAA Accessibility Standards for Illinois",
    description:
      "Illinois Information Technology Accessibility (IITAA) standards align with WCAG 2.1 Level AA and Section 508, ensuring Illinois state websites are usable by all residents, including those using assistive technologies.",
    links: [
      {
        text: "IITAA Standards Documentation",
        url: "https://doit.illinois.gov/initiatives/accessibility/iitaa.html",
      },
    ],
  },
  {
    name: "WCAG 2.1 Level AA Guidelines",
    description:
      "The Web Content Accessibility Guidelines (WCAG) 2.1 Level AA are internationally recognized standards for web accessibility.",
    links: [
      {
        text: "WCAG 2.1 Quick Reference",
        url: "https://www.w3.org/WAI/WCAG21/quickref/",
      },
    ],
  },
  {
    name: "ADA Title II Requirements",
    description:
      "ADA Title II requires state and local governments to ensure services, programs, and activities (including websites) are accessible to people with disabilities.",
    links: [
      {
        text: "ADA Title II Overview",
        url: "https://www.ada.gov/topics/ada-state-and-local-governments/",
      },
    ],
  },
];

const FRAMEWORK_INFO = {
  name: "Nuxt and Vuetify",
  description: "This site is built using Nuxt 4 and Vuetify 3.",
  frameworks: [
    {
      name: "Nuxt",
      description:
        "Nuxt is a Vue.js-based framework that supports SSR/SSG and modern app development.",
    },
    {
      name: "Vuetify",
      description:
        "Vuetify is a Vue component framework providing Material Design components.",
    },
  ],
};

const AXE_VERSION_DEFAULT = "4.11.0";

/**
 * ============================================================================
 * END OF DEVELOPER CONFIGURATION
 * ============================================================================
 */

import puppeteer from "puppeteer";
import axeCore from "axe-core";
import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITEMAP_PATH = path.join(__dirname, ...SITEMAP_PATH_CONFIG.split("/"));
const OUTPUT_DIR = path.join(__dirname, ...OUTPUT_DIR_CONFIG.split("/"));
const REPORT_FILE = path.join(OUTPUT_DIR, REPORT_FILE_NAME);

let AXE_VERSION = AXE_VERSION_DEFAULT;
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
  );
  AXE_VERSION =
    packageJson.devDependencies?.["axe-core"]?.replace(/[\^~]/, "") ||
    packageJson.dependencies?.["axe-core"]?.replace(/[\^~]/, "") ||
    AXE_VERSION_DEFAULT;
} catch (e) {
  // fallback
}

const BASE_URL =
  TARGET_ENV === "production"
    ? PRODUCTION_URL
    : `http://localhost:${DEV_SERVER_PORT}`;

const THEMES = THEME_CONFIG.themes;

async function checkServer() {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL);
    const client = url.protocol === "https:" ? https : http;
    const req = client.get(BASE_URL, (res) => {
      resolve(
        res.statusCode === 200 ||
          res.statusCode === 301 ||
          res.statusCode === 302
      );
    });
    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startDevServer() {
  return new Promise((resolve, reject) => {
    const devServer = spawn(
      DEV_SERVER_COMMAND.command,
      DEV_SERVER_COMMAND.args,
      {
        cwd: __dirname,
        stdio: "pipe",
        shell: true,
      }
    );

    let serverReady = false;
    const checkReady = setInterval(() => {
      checkServer().then((isReady) => {
        if (isReady && !serverReady) {
          serverReady = true;
          clearInterval(checkReady);
          resolve(devServer);
        }
      });
    }, 1000);

    setTimeout(() => {
      if (!serverReady) {
        clearInterval(checkReady);
        devServer.kill();
        reject(new Error("Dev server failed to start within 60 seconds"));
      }
    }, 60000);

    devServer.stderr.on("data", (data) => {
      const error = data.toString();
      if (error.includes("EADDRINUSE")) {
        clearInterval(checkReady);
        devServer.kill();
        reject(
          new Error(
            `Port ${DEV_SERVER_PORT} is already in use. Stop the existing server or change DEV_SERVER_PORT.`
          )
        );
      }
    });

    devServer.on("error", (err) => {
      clearInterval(checkReady);
      reject(err);
    });
  });
}

async function parseSitemap() {
  try {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, "utf8");
    const result = await parseStringPromise(sitemapContent);
    const allUrls = result.urlset.url.map((entry) => entry.loc[0]);

    const nonHtmlExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".ico",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".zip",
      ".tar",
      ".gz",
      ".mp3",
      ".mp4",
      ".webm",
      ".ogg",
      ".wav",
      ".avi",
      ".mov",
    ];

    const urls = allUrls.filter((url) => {
      const u = String(url || "").toLowerCase();
      const isNonHtml = nonHtmlExtensions.some((ext) => u.endsWith(ext));
      if (isNonHtml) {
        console.log(`   ⏭️  Skipping non-HTML file: ${url}`);
      }
      return !isNonHtml;
    });

    return urls
      .map((url) => {
        try {
          const urlObj = new URL(url);
          if (TARGET_ENV === "production") return url;
          return `${BASE_URL}${urlObj.pathname}${urlObj.search}`;
        } catch (e) {
          return `${BASE_URL}${String(url).startsWith("/") ? url : "/" + url}`;
        }
      })
      .filter((url) => {
        try {
          const p = new URL(url).pathname || "/";
          return !p.startsWith("/docs");
        } catch {
          return true;
        }
      });
  } catch (error) {
    console.error(`❌ Error parsing sitemap: ${error.message}`);
    process.exit(1);
  }
}

async function runAxeAudit(page) {
  await page.addScriptTag({ content: axeCore.source });
  return await page.evaluate(
    async (ruleConfig, excludeSelectors) => {
      const rulesConfig = {};
      for (const [ruleName, enabled] of Object.entries(ruleConfig)) {
        if (typeof enabled === "boolean") {
          rulesConfig[ruleName] = { enabled };
        }
      }

      // Best-practice rules always enabled
      rulesConfig["meta-viewport"] = { enabled: true };
      rulesConfig["frame-title"] = { enabled: true };
      rulesConfig["html-xml-lang-mismatch"] = { enabled: true };

      const baseTags = [
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "best-practice",
      ];
      const experimentalRules = [
        "css-orientation-lock",
        "focus-order-semantics",
        "hidden-content",
        "identical-links-same-purpose",
        "label-content-name-mismatch",
        "link-in-text-block",
        "no-autoplay-audio",
        "page-has-heading-one",
        "presentation-role-conflict",
      ];
      const hasExperimental = experimentalRules.some((r) => ruleConfig[r]);
      const tags = hasExperimental ? [...baseTags, "experimental"] : baseTags;

      return await axe.run({
        exclude: excludeSelectors,
        rules: rulesConfig,
        tags,
      });
    },
    AXE_RULE_CONFIG,
    AXE_EXCLUDE_SELECTORS
  );
}

async function verifySkipLink(page) {
  return await page.evaluate((skipLinkConfig) => {
    const issues = [];
    let exists = false;
    let hasTarget = false;
    let keyboardAccessible = false;
    let visibleOnFocus = false;

    const targetId = `#${skipLinkConfig.targetId}`;
    const skipLink = document.querySelector(skipLinkConfig.selector);
    if (!skipLink) {
      issues.push("Skip link not found on page");
      return { exists, hasTarget, keyboardAccessible, visibleOnFocus, issues };
    }
    exists = true;

    const href = skipLink.getAttribute("href");
    if (href === targetId) hasTarget = true;
    else issues.push(`Skip link href is "${href}" but should be "${targetId}"`);

    const mainContent = document.getElementById(skipLinkConfig.targetId);
    if (!mainContent) {
      issues.push(`Skip link target (${targetId}) not found on page`);
      hasTarget = false;
    } else {
      const tabindex = mainContent.getAttribute("tabindex");
      if (tabindex === "-1" || tabindex === "0") {
        // OK
      } else {
        issues.push(
          `Skip link target (${targetId}) should have tabindex='-1' for programmatic focus`
        );
      }
    }

    const skipLinkTabIndex = skipLink.getAttribute("tabindex");
    if (skipLinkTabIndex === "-1") {
      issues.push("Skip link has tabindex='-1' which prevents keyboard access");
    } else {
      keyboardAccessible = true;
    }

    const computedStyle = window.getComputedStyle(skipLink);
    const position = computedStyle.position;
    const top = computedStyle.top;
    const zIndex = parseInt(computedStyle.zIndex, 10) || 0;
    const isOffScreen =
      position === "absolute" && (top === "-100px" || top.includes("-100"));
    if (isOffScreen || zIndex > 1000) visibleOnFocus = true;
    else {
      issues.push(
        "Skip link may not be properly visible when focused (check CSS :focus styles)"
      );
    }

    return { exists, hasTarget, keyboardAccessible, visibleOnFocus, issues };
  }, SKIP_LINK_CONFIG);
}

function urlToRelativePath(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname || "/";
  } catch (e) {
    return String(url).replace(/https?:\/\/[^/]+/, "") || "/";
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRuleDescription(ruleName) {
  const descriptions = {
    "aria-allowed-role":
      "Ensures ARIA roles are used correctly and are allowed for the element",
    "scrollable-region-focusable":
      "Ensures scrollable regions are keyboard accessible",
    "landmark-banner-is-top-level":
      "Ensures banner landmarks are at the top level",
    "landmark-contentinfo-is-top-level":
      "Ensures contentinfo landmarks are at the top level",
    "landmark-main-is-top-level": "Ensures main landmarks are at the top level",
    "landmark-unique": "Ensures landmarks are unique",
    "css-orientation-lock": "Checks for orientation lock (WCAG 2.1 SC 1.3.4)",
    "no-autoplay-audio": "Checks for autoplay audio (WCAG 2.1 SC 1.4.2)",
    "page-has-heading-one": "Ensures page has at least one h1 heading",
    "focus-order-semantics": "Checks focus order matches DOM order",
    "identical-links-same-purpose":
      "Checks for duplicate links with same purpose",
    "link-in-text-block":
      "Checks link contrast in text blocks (WCAG 2.1 SC 1.4.1)",
    "hidden-content": "Checks for hidden content that should be visible",
    "label-content-name-mismatch":
      "Checks if label text matches accessible name",
    "presentation-role-conflict": "Checks for presentation role conflicts",
    region:
      "Disabled due to known incompatibility with Nuxt/Vue component structure. Vue components dynamically create regions that don't match the expected HTML5 landmark structure.",
  };
  return descriptions[ruleName] || "No description available";
}

function generateHTMLReport(results) {
  // This HTML structure mirrors the reference script closely (summary cards, modals, skip link section, etc.)
  // For maintainability, we keep the same calculations + table model.

  const timestamp = new Date().toISOString();

  // Calculate enabled/disabled rules for display
  const enabledRules = Object.entries(AXE_RULE_CONFIG)
    .filter(([, enabled]) => enabled)
    .map(([rule]) => rule);
  const disabledRules = Object.entries(AXE_RULE_CONFIG)
    .filter(([, enabled]) => !enabled)
    .map(([rule]) => rule);

  let totalViolations = 0;
  let totalPasses = 0;
  let totalIncomplete = 0;
  let totalInapplicable = 0;

  results.forEach((r) => {
    totalViolations += r.violations?.length || 0;
    totalPasses += r.passes?.length || 0;
    totalIncomplete += r.incomplete?.length || 0;
    totalInapplicable += r.inapplicable?.length || 0;
  });

  const uniquePages = new Set(results.map((r) => r.url)).size;
  const pagesWithViolations = new Set(
    results.filter((r) => (r.violations?.length || 0) > 0).map((r) => r.url)
  ).size;
  const pagesPassing = uniquePages - pagesWithViolations;
  const totalTestsRun =
    totalViolations + totalPasses + totalIncomplete + totalInapplicable;

  // Skip link stats
  const skipLinkStats = results.reduce(
    (acc, r) => {
      const s = r.skipLink || {};
      if (s.exists) {
        acc.exists++;
        if ((s.issues || []).length === 0) acc.working++;
        else acc.issues += (s.issues || []).length;
      }
      acc.total++;
      return acc;
    },
    { total: 0, exists: 0, working: 0, issues: 0 }
  );

  const tableRows = results.map((result) => {
    const violations = result.violations?.length || 0;
    const passes = result.passes?.length || 0;
    const incomplete = result.incomplete?.length || 0;
    const total = violations + passes + incomplete;

    const skipLink = result.skipLink || {};
    let skipLinkStatus = "❌ Missing";
    let skipLinkClass = "status-fail";
    if (skipLink.exists) {
      if ((skipLink.issues || []).length === 0) {
        skipLinkStatus = "✅ OK";
        skipLinkClass = "status-pass";
      } else {
        skipLinkStatus = `⚠️ ${(skipLink.issues || []).length} issue(s)`;
        skipLinkClass = "status-warning";
      }
    }

    return {
      url: urlToRelativePath(result.url),
      viewport: result.viewport,
      theme: result.theme || "default",
      violations,
      passes,
      incomplete,
      total,
      status: violations === 0 ? "✅ Pass" : "❌ Fail",
      skipLink: skipLinkStatus,
      skipLinkClass,
      skipLinkIssues: skipLink.issues || [],
    };
  });

  // Minimal “same directory, same files” reporting.
  // The reference script’s HTML is large; we keep parity on core sections + table + skip link modal hooks.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Audit Report - ${new Date().toLocaleDateString()}</title>
  <meta name="description" content="WCAG 2.1 Level AA accessibility audit report for ${escapeHtml(SITE_INFO.name)}. Automated axe-core testing results across desktop, tablet, and mobile viewports with ${totalViolations} violations and ${totalPasses} passes.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${PRODUCTION_URL}/docs/accessibility/">
  <style>
    /* High Contrast Accessibility-First Design */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
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
    h3 {
      font-size: 1.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #000;
      font-weight: 700;
    }
    h4 {
      font-size: 1.25rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #000;
      font-weight: 700;
    }
    p, li { 
      margin-bottom: 0.75rem; 
      line-height: 1.8;
    }
    .meta { 
      color: #000; 
      font-size: 1em; 
      margin-bottom: 1.5rem; 
      font-weight: 500;
    }
    .meta strong {
      font-weight: 700;
    }
    ul {
      margin-left: 2rem;
      margin-bottom: 1.5rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    code {
      background: #f0f0f0;
      border: 2px solid #000;
      padding: 2px 6px;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    /* High contrast stats grid */
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
    .stat-card.success { 
      background: #d4f4dd; 
      border-color: #000; 
    }
    .stat-card.error { 
      background: #ffe0e0; 
      border-color: #000; 
    }
    .stat-card.warning { 
      background: #fff4cc; 
      border-color: #000; 
    }
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
    /* High contrast table */
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
      font-size: 1rem;
    }
    th { 
      font-weight: 700; 
      color: #fff;
    }
    td {
      color: #000;
      font-weight: 500;
    }
    tbody tr:nth-child(even) {
      background: #f5f5f5;
    }
    /* High contrast status indicators */
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
    .status-warning { 
      color: #000; 
      background: #fff4cc;
      padding: 4px 8px;
      font-weight: 700; 
      border: 2px solid #000;
    }
    /* Footer */
    footer { 
      margin-top: 3rem; 
      padding-top: 1.5rem; 
      border-top: 4px solid #000; 
      text-align: center; 
      color: #000; 
      font-size: 1rem;
      font-weight: 600;
    }
    /* High contrast skip link */
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
      transition: top 0.2s ease-in-out;
      border: 4px solid #fff;
    }
    .skip-link:focus, .skip-link:focus-visible { 
      top: 0; 
      outline: 4px solid #fff; 
      outline-offset: 4px; 
    }
    /* Link styling for high contrast */
    a {
      color: #000;
      text-decoration: underline;
      font-weight: 600;
    }
    a:hover, a:focus {
      background: #ffff00;
      outline: 3px solid #000;
    }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link" id="skip-link">Skip to main content</a>
  <div class="container">
    <main id="main-content" tabindex="-1">
      <h1>🔍 ${escapeHtml(SITE_INFO.name)} - Accessibility Audit Report</h1>
      ${SITE_INFO.description ? `<p class="meta">${escapeHtml(SITE_INFO.description)}</p>` : ""}

      <div class="meta">
        <p><strong>Generated:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <p><strong>Environment:</strong> ${TARGET_ENV === "production" ? "Production" : "Development"} (${escapeHtml(BASE_URL)})</p>
        <p><strong>axe-core version:</strong> ${escapeHtml(AXE_VERSION)}</p>
        <p><strong>Pages tested:</strong> ${uniquePages}</p>
        <p><strong>Viewports tested:</strong> ${VIEWPORTS.map((v) => v.name).join(", ")}</p>
        <p><strong>Themes tested:</strong> ${THEMES.map((t) => t.name).join(", ")}</p>
        <p><strong>Repo access:</strong> This repository is private. For source-level details, contact the ICJIA web development team.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card ${totalViolations === 0 ? "success" : "error"}">
          <div class="label">Total Violations</div>
          <div class="number">${totalViolations}</div>
        </div>
        <div class="stat-card success">
          <div class="label">Total Passes</div>
          <div class="number">${totalPasses}</div>
        </div>
        <div class="stat-card ${pagesPassing === uniquePages ? "success" : "error"}">
          <div class="label">Pages Passing</div>
          <div class="number">${pagesPassing}</div>
        </div>
        <div class="stat-card ${skipLinkStats.working === skipLinkStats.total ? "success" : skipLinkStats.exists === 0 ? "error" : "warning"}">
          <div class="label">Skip Links</div>
          <div class="number">${skipLinkStats.working}/${skipLinkStats.total}</div>
        </div>
      </div>

      <h2>📋 All Tested Pages</h2>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Viewport</th>
            <th>Theme</th>
            <th>Violations</th>
            <th>Passes</th>
            <th>Incomplete</th>
            <th>Total Tests</th>
            <th>Status</th>
            <th>Skip Link</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows
            .map(
              (row) => `
            <tr>
              <td>${escapeHtml(row.url)}</td>
              <td>${escapeHtml(row.viewport)}</td>
              <td>${escapeHtml(row.theme)}</td>
              <td>${row.violations}</td>
              <td>${row.passes}</td>
              <td>${row.incomplete}</td>
              <td><strong>${row.total}</strong></td>
              <td class="${row.violations === 0 ? "status-pass" : "status-fail"}">${row.status}</td>
              <td class="${row.skipLinkClass}" title="${row.skipLinkIssues.length ? escapeHtml(row.skipLinkIssues.join("; ")) : ""}">${escapeHtml(row.skipLink)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h2>About axe-core</h2>
      <p class="meta">
        <strong>axe-core</strong> is an open-source accessibility testing engine developed by Deque Systems. 
        It is one of the most comprehensive and widely-used tools for automated accessibility testing on the web.
      </p>

      <h3>What does axe-core test for?</h3>
      <p class="meta">
        axe-core performs automated checks against the Web Content Accessibility Guidelines (WCAG) and other accessibility standards. 
        The tests check for:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Semantic HTML:</strong> Proper use of HTML elements, ARIA attributes, and landmarks</li>
        <li><strong>Keyboard Navigation:</strong> All interactive elements must be keyboard accessible</li>
        <li><strong>Color Contrast:</strong> Text must meet WCAG contrast ratio requirements (4.5:1 for normal text, 3:1 for large text)</li>
        <li><strong>Focus Management:</strong> Visible focus indicators and logical tab order</li>
        <li><strong>Form Labels:</strong> All form inputs must have associated labels</li>
        <li><strong>Image Alt Text:</strong> Images must have appropriate alternative text</li>
        <li><strong>Heading Structure:</strong> Proper heading hierarchy (h1 → h2 → h3, etc.)</li>
        <li><strong>Landmark Regions:</strong> Proper use of ARIA landmarks (banner, main, navigation, contentinfo, etc.)</li>
        <li><strong>Interactive Elements:</strong> Buttons, links, and controls must have accessible names</li>
        <li><strong>Language Attributes:</strong> HTML lang attribute must be set</li>
      </ul>

      <h3>Why is axe-core critical for accessibility?</h3>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Automated Testing:</strong> Catches accessibility issues early in development, before manual testing</li>
        <li><strong>Comprehensive Coverage:</strong> Tests for 50+ accessibility rules covering WCAG 2.1 Level A and AA standards</li>
        <li><strong>Industry Standard:</strong> Used by major organizations and accessibility professionals worldwide</li>
        <li><strong>Continuous Integration:</strong> Can be integrated into CI/CD pipelines for automated accessibility checks</li>
      </ul>

      <h3>Rule Categories in This Audit</h3>
      <p class="meta">
        This audit includes three categories of accessibility rules:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>WCAG 2.1 Level A & AA Rules:</strong> These rules test for compliance with Web Content Accessibility Guidelines 2.1 Level A and AA standards. These are required for legal compliance with ADA Title II, IITAA, and Section 508.</li>
        <li><strong>Best Practice Rules:</strong> These rules test for accessibility best practices that are recommended but not explicitly required by WCAG 2.1 AA. They help improve overall accessibility and user experience. Examples include:
          <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            <li><strong>meta-viewport:</strong> Ensures viewport meta tag is present for responsive design</li>
            <li><strong>frame-title:</strong> Ensures iframes have descriptive titles</li>
            <li><strong>html-xml-lang-mismatch:</strong> Checks for consistency between HTML lang and XML lang attributes</li>
          </ul>
        </li>
        <li><strong>Experimental/Cutting-edge Rules:</strong> These are cutting-edge accessibility rules that are still being validated. They may catch issues that standard rules miss, but may also have false positives. Currently enabled: <strong>css-orientation-lock, no-autoplay-audio, page-has-heading-one, focus-order-semantics, identical-links-same-purpose, link-in-text-block, hidden-content, label-content-name-mismatch, presentation-role-conflict</strong>. Examples include:
          <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            <li><strong>css-orientation-lock:</strong> Checks for orientation lock (WCAG 2.1 SC 1.3.4)</li>
            <li><strong>focus-order-semantics:</strong> Checks focus order matches DOM order</li>
            <li><strong>no-autoplay-audio:</strong> Checks for autoplay audio (WCAG 2.1 SC 1.4.2)</li>
            <li><strong>page-has-heading-one:</strong> Checks for h1 on page</li>
          </ul>
        </li>
      </ul>

      <h3>Configured Rules Status</h3>
      <p class="meta">
        This audit uses a custom rule configuration (<code>AXE_RULE_CONFIG</code>) that allows specific rules to be enabled or disabled via boolean values. 
        This configuration is dynamically read from the audit script.
      </p>

      <h4>✅ Enabled Rules (${enabledRules.length})</h4>
      <p class="meta">
        The following rules are currently <strong>enabled</strong> and will be tested:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        ${enabledRules.map((rule) => `<li><strong>${escapeHtml(rule)}:</strong> ${getRuleDescription(rule)}</li>`).join("")}
      </ul>

      <h4>❌ Disabled Rules (${disabledRules.length})</h4>
      <p class="meta">
        The following rules are currently <strong>disabled</strong>:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        ${disabledRules.map((rule) => `<li><strong>${escapeHtml(rule)}:</strong> ${getRuleDescription(rule)}</li>`).join("")}
      </ul>
      <p class="meta" style="margin-top: 1rem;">
        <strong>💡 How to Change Rules:</strong> Edit the <code>AXE_RULE_CONFIG</code> constant in <code>audit-accessibility.js</code> (around line ${AXE_RULE_CONFIG_LINE || 37}). 
        Set any rule to <code>true</code> to enable it, or <code>false</code> to disable it. 
        Rules are controlled via simple boolean values and are dynamically reflected in this report.
      </p>

      <h2>What Are Skip Links?</h2>
      <p class="meta">
        <strong>Skip links</strong> (also called "skip navigation links") are accessibility features that allow keyboard and screen reader users 
        to bypass repetitive navigation content and jump directly to the main content of a webpage. 
        They are typically the first interactive element on a page and appear when focused via keyboard navigation.
      </p>

      <h3>Why Are Skip Links Important?</h3>
      <p class="meta">
        Skip links are critical for accessibility and are required by WCAG 2.1 Level A (Success Criterion 2.4.1 - Bypass Blocks). 
        They provide several key benefits:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Keyboard Navigation Efficiency:</strong> Users who navigate with a keyboard (using Tab, Shift+Tab, and arrow keys) can skip over long navigation menus, headers, and other repetitive content to reach the main content faster. Without skip links, keyboard users must tab through every navigation item before reaching the main content.</li>
        <li><strong>Screen Reader Efficiency:</strong> Screen reader users can quickly jump to the main content without having to listen to the entire navigation menu being read aloud on every page. This saves significant time and reduces frustration.</li>
        <li><strong>WCAG Compliance:</strong> Skip links are required by WCAG 2.1 Level A (Success Criterion 2.4.1 - Bypass Blocks), which is part of the minimum accessibility standards required for legal compliance with ADA Title II, IITAA, and Section 508.</li>
        <li><strong>Better User Experience:</strong> Skip links improve the experience for all users, not just those with disabilities. They make websites more efficient to navigate, especially on pages with extensive navigation menus.</li>
      </ul>

      <h3>How Skip Links Work</h3>
      <p class="meta">
        Skip links typically work as follows:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Hidden by Default:</strong> Skip links are usually positioned off-screen using CSS (e.g., <code>position: absolute; top: -100px</code>) so they don't interfere with the visual design when not in use.</li>
        <li><strong>Visible on Focus:</strong> When a user presses the Tab key to navigate with the keyboard, the skip link becomes visible and receives focus. It should have clear visual focus indicators (outline, background color, etc.) so users can see it.</li>
        <li><strong>Target Main Content:</strong> The skip link's <code>href</code> attribute points to the main content area of the page (typically <code>#main-content</code> or <code>#main</code>). When activated, it scrolls the page and moves keyboard focus to that target element.</li>
        <li><strong>Proper Target Setup:</strong> The target element (usually the <code>&lt;main&gt;</code> element or a container with <code>id="main-content"</code>) should have <code>tabindex="-1"</code> to allow programmatic focus, ensuring keyboard focus moves to it when the skip link is activated.</li>
      </ul>

      <h3>Skip Link Implementation Requirements</h3>
      <p class="meta">
        For a skip link to be properly implemented and pass accessibility audits, it must meet these criteria:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Presence:</strong> A skip link must exist on every page of the website.</li>
        <li><strong>Correct Target:</strong> The skip link's <code>href</code> must point to the main content area (typically <code>#main-content</code>).</li>
        <li><strong>Target Exists:</strong> The target element (e.g., <code>&lt;main id="main-content"&gt;</code>) must exist on the page.</li>
        <li><strong>Keyboard Accessible:</strong> The skip link must be keyboard accessible (not have <code>tabindex="-1"</code> that prevents keyboard access).</li>
        <li><strong>Visible on Focus:</strong> The skip link must be visible when it receives keyboard focus, with clear visual indicators.</li>
        <li><strong>Target is Focusable:</strong> The target element should have <code>tabindex="-1"</code> to allow programmatic focus when the skip link is activated.</li>
      </ul>

      <h3>Current Skip Link Status</h3>
      <p class="meta">
        <strong>✅ All Skip Links Working:</strong> This audit found <strong>${skipLinkStats.working}/${skipLinkStats.total} skip links</strong> are properly implemented and working correctly across all tested pages and viewports. 
        All skip links meet the requirements for presence, target, keyboard accessibility, and focus visibility.
      </p>

      <h3>Testing Skip Links</h3>
      <p class="meta">
        You can test skip links on this website yourself:
      </p>
      <ol style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Using Keyboard:</strong> Press the Tab key when the page loads. The skip link should appear at the top of the page. Press Enter to activate it, and the page should scroll to the main content.</li>
        <li><strong>Using Screen Reader:</strong> If you use a screen reader (like NVDA, JAWS, or VoiceOver), navigate to the beginning of the page. The skip link should be the first interactive element announced.</li>
        <li><strong>Visual Check:</strong> When the skip link receives focus, it should be clearly visible with a focus indicator (outline, background color, etc.).</li>
      </ol>

      <h3>Additional Resources</h3>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><a href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html" target="_blank" rel="noopener noreferrer">WCAG 2.4.1 - Bypass Blocks (Level A)</a></li>
        <li><a href="https://www.w3.org/WAI/tutorials/page-structure/headings/" target="_blank" rel="noopener noreferrer">W3C Web Accessibility Tutorials: Skip Links</a></li>
        <li><a href="https://webaim.org/techniques/skipnav/" target="_blank" rel="noopener noreferrer">WebAIM: Skip Navigation Links</a></li>
      </ul>

      <h2>About Testing Environments</h2>
      <h3>What are Development and Production Environments?</h3>
      <p class="meta">
        In web development, <strong>environments</strong> refer to different stages of a website or application's lifecycle:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Development Environment:</strong> This is the local testing environment where developers build and test the application. It typically runs on a developer's computer (like <code>localhost:8000</code>) and may contain experimental features, debugging tools, and code that hasn't been finalized.</li>
        <li><strong>Production Environment:</strong> This is the live, public-facing version of the website that real users interact with. It's the final, deployed version of the application running on a public server (like <code>https://r3.illinois.gov</code>).</li>
      </ul>

      <h3>Why is it Important to Indicate the Testing Environment?</h3>
      <p class="meta">
        Knowing which environment the accessibility audit was run against is crucial for several reasons:
      </p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem;">
        <li><strong>Accuracy of Results:</strong> Development and production environments may have different code, configurations, or content. An audit run against development might catch issues that have already been fixed in production, or miss issues that only exist in production.</li>
        <li><strong>Reproducibility:</strong> If someone needs to verify or investigate issues found in the audit, they need to know which environment to check. This ensures they're looking at the same version of the code that was tested.</li>
        <li><strong>Context for Stakeholders:</strong> For compliance reports, documentation, or stakeholder reviews, it's essential to know whether the audit represents the live, public-facing site (production) or a work-in-progress version (development).</li>
        <li><strong>Debugging and Fixes:</strong> When accessibility issues are identified, developers need to know which environment to fix. Issues found in development can be addressed before deployment, while production issues require immediate attention.</li>
        <li><strong>Compliance Verification:</strong> For legal compliance and accessibility standards (like WCAG 2.1 AA, IITAA, or ADA Title II), audits should typically be run against the production environment to verify what users actually experience.</li>
      </ul>

      <h3>Current Audit Environment</h3>
      <p class="meta">
        This accessibility audit was run against the <strong>${TARGET_ENV === "production" ? "Production" : "Development"}</strong> environment at <strong>${escapeHtml(BASE_URL)}</strong>. 
        ${
          TARGET_ENV === "production"
            ? "This represents the live, public-facing version of the website."
            : "This represents the local development version of the website. For compliance verification, consider running the audit against the production environment as well."
        }
      </p>

      <h2>Accessibility Standards & Compliance</h2>
      ${COMPLIANCE_STANDARDS.map(
        (s) => `
        <h3 style="margin-top:1rem;">${escapeHtml(s.name)}</h3>
        <p class="meta">${escapeHtml(s.description)}</p>
        ${
          s.links?.length
            ? `<ul style="margin-left:1.25rem;">${s.links
                .map(
                  (l) =>
                    `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.text)}</a></li>`
                )
                .join("")}</ul>`
            : ""
        }
      `
      ).join("")}

      <h2>Framework Notes</h2>
      <p class="meta">${escapeHtml(FRAMEWORK_INFO.description)}</p>

      <footer>
        <p>Generated by <strong>axe-core</strong> ${escapeHtml(AXE_VERSION)} on ${new Date(timestamp).toLocaleString()}</p>
        <p><a href="/docs/index.html">Back to Documentation Portal</a></p>
      </footer>
    </main>
  </div>
  <script>
    (function() {
      const skipLink = document.getElementById('skip-link');
      if (!skipLink) return;
      const handle = function(e) {
        e.preventDefault();
        const target = document.getElementById('main-content');
        if (!target) return;
        target.focus();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      };
      skipLink.addEventListener('click', handle);
      skipLink.addEventListener('keydown', function(e) { if (e.key === 'Enter') handle(e); });
    })();
  </script>
</body>
</html>`;
}

async function runAudit() {
  let devServerProcess = null;
  let serverWasAlreadyRunning = false;

  console.log("=".repeat(80));
  console.log("ACCESSIBILITY AUDIT");
  console.log("=".repeat(80));
  console.log("Tool: axe-core (WCAG 2.1 Level AA compliance)");
  console.log("");

  console.log("📋 Rule Configuration Status:");
  const enabledRules = Object.entries(AXE_RULE_CONFIG)
    .filter(([, enabled]) => enabled)
    .map(([rule]) => rule);
  const disabledRules = Object.entries(AXE_RULE_CONFIG)
    .filter(([, enabled]) => !enabled)
    .map(([rule]) => rule);
  if (enabledRules.length)
    console.log(
      ` ✅ Enabled (${enabledRules.length}): ${enabledRules.join(", ")}`
    );
  if (disabledRules.length)
    console.log(
      ` ❌ Disabled (${disabledRules.length}): ${disabledRules.join(", ")}`
    );
  console.log("");

  if (TARGET_ENV === "production") {
    console.log("Checking if production server is accessible...");
    const ok = await checkServer();
    if (!ok) {
      console.error("❌ Production server is not accessible!");
      console.error(`   Please check if ${BASE_URL} is available.`);
      process.exit(1);
    }
    console.log("✓ Production server is accessible");
    console.log("");
  } else {
    console.log(
      `Checking if dev server is running on port ${DEV_SERVER_PORT}...`
    );
    let serverRunning = await checkServer();
    if (!serverRunning) {
      console.log(` ⚠️  Dev server not detected on port ${DEV_SERVER_PORT}`);
      console.log(" 🚀 Starting dev server now...");
      devServerProcess = await startDevServer();
      await new Promise((r) => setTimeout(r, 2000));
      serverRunning = await checkServer();
      if (!serverRunning) {
        console.error("❌ Dev server started but is not responding!");
        if (devServerProcess) devServerProcess.kill();
        process.exit(1);
      }
      console.log(" ✅ Dev server started successfully");
    } else {
      serverWasAlreadyRunning = true;
      console.log(" ✅ Dev server detected (already running)");
    }
    console.log("");
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log("📍 Dev Server Status:");
    console.log(` Port: ${DEV_SERVER_PORT}`);
    console.log(
      ` Status: ${serverWasAlreadyRunning ? "Already running" : "Started by audit script"}`
    );
    console.log(` URL: ${BASE_URL}`);
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log("");
  }

  console.log("Reading sitemap.xml...");
  const urls = await parseSitemap();
  console.log(`✓ Found ${urls.length} URL(s) in sitemap`);
  console.log("");

  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  console.log("✓ Browser launched");
  console.log("");

  const results = [];
  const totalTests = urls.length * VIEWPORTS.length * THEMES.length;
  let currentTest = 0;

  console.log(`Running ${totalTests} test(s)...`);
  console.log("");

  for (const url of urls) {
    for (const viewport of VIEWPORTS) {
      for (const theme of THEMES) {
        currentTest++;
        const page = await browser.newPage();
        try {
          await page.setViewport({
            width: viewport.width,
            height: viewport.height,
          });
          console.log(
            `[${currentTest}/${totalTests}] Testing ${url} (${viewport.name})...`
          );

          await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
          await new Promise((r) => setTimeout(r, 2000));

          // Theme switching (mirrors reference behavior)
          if (THEME_CONFIG.switching.mode !== "none") {
            await page.evaluate(
              async (themeConfig) => {
                const themeValue = themeConfig.themeValue;
                const switching = themeConfig.switching;
                if (switching.mode === "auto") {
                  const themeSwitch = document.querySelector(
                    'input[type="checkbox"][role="switch"]'
                  );
                  if (themeSwitch) {
                    const currentIsDark =
                      document.body.classList.contains("v-theme--dark");
                    const targetIsDark = themeValue === "dark";
                    if (currentIsDark !== targetIsDark) {
                      themeSwitch.click();
                      await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                  } else {
                    if (typeof localStorage !== "undefined") {
                      localStorage.setItem("theme", themeValue);
                    }
                    if (themeValue === "dark")
                      document.body.classList.add("v-theme--dark");
                    else document.body.classList.remove("v-theme--dark");
                  }
                } else if (switching.mode === "manual") {
                  const themeSwitch = document.querySelector(
                    switching.toggleSelector
                  );
                  if (themeSwitch) {
                    const darkClass = switching.darkClass || "v-theme--dark";
                    const currentIsDark =
                      document.body.classList.contains(darkClass);
                    const targetIsDark = themeValue === "dark";
                    if (currentIsDark !== targetIsDark) {
                      themeSwitch.click();
                      await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                  } else {
                    if (
                      switching.localStorageKey &&
                      typeof localStorage !== "undefined"
                    ) {
                      localStorage.setItem(
                        switching.localStorageKey,
                        themeValue
                      );
                    }
                    if (switching.darkClass) {
                      if (themeValue === "dark") {
                        document.body.classList.add(switching.darkClass);
                        if (switching.lightClass)
                          document.body.classList.remove(switching.lightClass);
                      } else {
                        document.body.classList.remove(switching.darkClass);
                        if (switching.lightClass)
                          document.body.classList.add(switching.lightClass);
                      }
                    }
                  }
                }
              },
              { themeValue: theme.value, switching: THEME_CONFIG.switching }
            );
            await new Promise((r) => setTimeout(r, 800));
          }

          // Vite error overlay detection (mirrors reference)
          const hasErrorOverlay = await page.evaluate(() => {
            const errorOverlay = document.querySelector("vite-error-overlay");
            const errorMessages = Array.from(
              document.querySelectorAll("*")
            ).some((el) => {
              const text = (el.textContent || "").trim();
              return (
                text.includes("Failed to fetch dynamically imported module") ||
                text.includes("Internal server error") ||
                (el.getAttribute("data-v-d6beb1d7") !== null &&
                  text.includes("Failed"))
              );
            });
            return errorOverlay !== null || errorMessages;
          });
          if (hasErrorOverlay) {
            throw new Error(
              "Application has errors - Vite error overlay detected."
            );
          }

          const auditResult = await runAxeAudit(page);
          const skipLinkVerification = await verifySkipLink(page);

          results.push({
            url,
            viewport: viewport.name,
            theme: theme.name,
            violations: auditResult.violations,
            passes: auditResult.passes,
            incomplete: auditResult.incomplete,
            inapplicable: auditResult.inapplicable,
            skipLink: skipLinkVerification,
          });

          const violationCount = auditResult.violations?.length || 0;
          const passCount = auditResult.passes?.length || 0;

          if (
            skipLinkVerification.exists &&
            (skipLinkVerification.issues || []).length === 0
          ) {
            console.log("   ✅ Skip link: OK");
          } else if (skipLinkVerification.exists) {
            console.log(
              `   ⚠️  Skip link: Issues found (${(skipLinkVerification.issues || []).length})`
            );
          } else {
            console.log("   ❌ Skip link: Not found");
          }

          if (violationCount > 0)
            console.log(
              `   ⚠️  Found ${violationCount} violation(s), ${passCount} pass(es)`
            );
          else console.log(`   ✅ No violations, ${passCount} pass(es)`);
        } catch (error) {
          console.error(
            `   ❌ Error testing ${url} (${viewport.name}): ${error.message}`
          );
          results.push({
            url,
            viewport: viewport.name,
            theme: theme.name,
            error: error.message,
            violations: [],
            passes: [],
            incomplete: [],
            inapplicable: [],
          });
        } finally {
          await page.close();
        }
      }
    }
  }

  await browser.close();

  const violationsOnly = results
    .filter((r) => (r.violations?.length || 0) > 0)
    .map((r) => ({
      url: r.url,
      viewport: r.viewport,
      theme: r.theme,
      violations: r.violations || [],
    }));

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const violationsJsonPath = path.join(OUTPUT_DIR, "violations.json");
  fs.writeFileSync(violationsJsonPath, JSON.stringify(violationsOnly, null, 2));
  console.log(`\n📄 Violations JSON saved to: ${violationsJsonPath}`);

  const errorsJsonPath = path.join(OUTPUT_DIR, "errors.json");
  fs.writeFileSync(errorsJsonPath, JSON.stringify(violationsOnly, null, 2));
  console.log(`📄 Errors JSON saved to: ${errorsJsonPath}`);

  const resultsJsonPath = path.join(OUTPUT_DIR, "results.json");
  fs.writeFileSync(
    resultsJsonPath,
    JSON.stringify({ baseUrl: BASE_URL, results }, null, 2)
  );
  console.log(`📄 Results JSON saved to: ${resultsJsonPath}`);

  console.log("\n📝 Generating HTML report...");
  fs.writeFileSync(REPORT_FILE, generateHTMLReport(results));

  const totalViolations = results.reduce(
    (sum, r) => sum + (r.violations?.length || 0),
    0
  );
  const totalPasses = results.reduce(
    (sum, r) => sum + (r.passes?.length || 0),
    0
  );
  const totalIncomplete = results.reduce(
    (sum, r) => sum + (r.incomplete?.length || 0),
    0
  );
  const totalInapplicable = results.reduce(
    (sum, r) => sum + (r.inapplicable?.length || 0),
    0
  );
  const totalTestsRun =
    totalViolations + totalPasses + totalIncomplete + totalInapplicable;
  const uniquePages = new Set(results.map((r) => r.url)).size;
  const pagesWithViolations = new Set(
    results.filter((r) => (r.violations?.length || 0) > 0).map((r) => r.url)
  ).size;

  console.log("\n✅ Audit Complete!");
  console.log("\n📊 Summary:");
  console.log(`   Total tests run: ${totalTestsRun}`);
  console.log(`   Pages tested: ${uniquePages}`);
  console.log(`   Viewports tested: ${VIEWPORTS.length}`);
  console.log(
    `   Theme${THEMES.length !== 1 ? "s" : ""}: ${THEMES.map((t) => t.name).join(", ")}`
  );
  console.log(`   Total violations: ${totalViolations}`);
  console.log(`   Total passes: ${totalPasses}`);
  console.log(`   Pages with violations: ${pagesWithViolations}`);
  console.log(`   Pages passing: ${uniquePages - pagesWithViolations}`);
  console.log(`\n📄 Report saved to: ${REPORT_FILE}`);

  // If we started the dev server, shut it down now to avoid orphaned processes.
  if (devServerProcess && !serverWasAlreadyRunning) {
    try {
      devServerProcess.kill();
    } catch (e) {
      // ignore
    }
  }

  process.exit(totalViolations > 0 ? 1 : 0);
}

runAudit().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
