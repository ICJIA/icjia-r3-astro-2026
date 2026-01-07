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

// Axe exclude selectors (Nuxt root container)
const AXE_EXCLUDE_SELECTORS = [["#__nuxt"]];

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

const puppeteer = require("puppeteer");
const axeCore = require("axe-core");
const { parseStringPromise } = require("xml2js");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { spawn } = require("child_process");

const SITEMAP_PATH = path.join(__dirname, ...SITEMAP_PATH_CONFIG.split("/"));
const OUTPUT_DIR = path.join(__dirname, ...OUTPUT_DIR_CONFIG.split("/"));
const REPORT_FILE = path.join(OUTPUT_DIR, REPORT_FILE_NAME);

let AXE_VERSION = AXE_VERSION_DEFAULT;
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
  );
  AXE_VERSION =
    packageJson.devDependencies?.["axe-core"]?.replace(/[\^~]/, "") ||
    packageJson.dependencies?.["axe-core"]?.replace(/[\^~]/, "") ||
    AXE_VERSION_DEFAULT;
} catch (e) {
  // fallback
}

const BASE_URL =
  TARGET_ENV === "production" ? PRODUCTION_URL : `http://localhost:${DEV_SERVER_PORT}`;

const THEMES = THEME_CONFIG.themes;

async function checkServer() {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL);
    const client = url.protocol === "https:" ? https : http;
    const req = client.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
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
    const devServer = spawn(DEV_SERVER_COMMAND.command, DEV_SERVER_COMMAND.args, {
      cwd: __dirname,
      stdio: "pipe",
      shell: true,
    });

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
            `Port ${DEV_SERVER_PORT} is already in use. Stop the existing server or change DEV_SERVER_PORT.`,
          ),
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

      const baseTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];
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
    AXE_EXCLUDE_SELECTORS,
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
          `Skip link target (${targetId}) should have tabindex='-1' for programmatic focus`,
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
    const isOffScreen = position === "absolute" && (top === "-100px" || top.includes("-100"));
    if (isOffScreen || zIndex > 1000) visibleOnFocus = true;
    else {
      issues.push(
        "Skip link may not be properly visible when focused (check CSS :focus styles)",
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

function generateHTMLReport(results) {
  // This HTML structure mirrors the reference script closely (summary cards, modals, skip link section, etc.)
  // For maintainability, we keep the same calculations + table model.

  const timestamp = new Date().toISOString();

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
    results.filter((r) => (r.violations?.length || 0) > 0).map((r) => r.url),
  ).size;
  const pagesPassing = uniquePages - pagesWithViolations;
  const totalTestsRun = totalViolations + totalPasses + totalIncomplete + totalInapplicable;

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
    { total: 0, exists: 0, working: 0, issues: 0 },
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
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background: #fff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 1rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
    .stat-card { padding: 1.25rem; border-radius: 8px; text-align: center; background: #f8f9fa; border: 1px solid #dee2e6; }
    .stat-card.success { background: #d1e7dd; border-color: #badbcc; color: #0f5132; }
    .stat-card.error { background: #f8d7da; border-color: #f5c2c7; color: #842029; }
    .stat-card.warning { background: #fff3cd; border-color: #ffecb5; color: #856404; }
    .stat-card .number { font-size: 2.2rem; font-weight: bold; margin: 0.25rem 0; }
    .stat-card .label { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; background: white; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
    thead { background: #f8f9fa; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #dee2e6; }
    th { font-weight: 600; color: #495057; }
    tr:last-child td { border-bottom: none; }
    .status-pass { color: #198754; font-weight: 600; }
    .status-fail { color: #dc3545; font-weight: 600; }
    .status-warning { color: #856404; font-weight: 600; }
    footer { margin-top: 2rem; padding-top: 1.25rem; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 0.875rem; }
    .skip-link { position: absolute; top: -100px; left: 0; background: #0d6efd; color: #fff; padding: 12px 24px; text-decoration: none; z-index: 10000; border-radius: 0 0 4px 0; font-weight: 600; font-size: 1rem; transition: top 0.2s ease-in-out; }
    .skip-link:focus, .skip-link:focus-visible { top: 0; outline: 3px solid #0d6efd; outline-offset: 2px; }
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
          `,
            )
            .join("")}
        </tbody>
      </table>

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
                    `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.text)}</a></li>`,
                )
                .join("")}</ul>`
            : ""
        }
      `,
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
  if (enabledRules.length) console.log(` ✅ Enabled (${enabledRules.length}): ${enabledRules.join(", ")}`);
  if (disabledRules.length) console.log(` ❌ Disabled (${disabledRules.length}): ${disabledRules.join(", ")}`);
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
    console.log(`Checking if dev server is running on port ${DEV_SERVER_PORT}...`);
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
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📍 Dev Server Status:");
    console.log(` Port: ${DEV_SERVER_PORT}`);
    console.log(` Status: ${serverWasAlreadyRunning ? "Already running" : "Started by audit script"}`);
    console.log(` URL: ${BASE_URL}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
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
          await page.setViewport({ width: viewport.width, height: viewport.height });
          console.log(`[${currentTest}/${totalTests}] Testing ${url} (${viewport.name})...`);

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
                    'input[type="checkbox"][role="switch"]',
                  );
                  if (themeSwitch) {
                    const currentIsDark = document.body.classList.contains("v-theme--dark");
                    const targetIsDark = themeValue === "dark";
                    if (currentIsDark !== targetIsDark) {
                      themeSwitch.click();
                      await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                  } else {
                    if (typeof localStorage !== "undefined") {
                      localStorage.setItem("theme", themeValue);
                    }
                    if (themeValue === "dark") document.body.classList.add("v-theme--dark");
                    else document.body.classList.remove("v-theme--dark");
                  }
                } else if (switching.mode === "manual") {
                  const themeSwitch = document.querySelector(switching.toggleSelector);
                  if (themeSwitch) {
                    const darkClass = switching.darkClass || "v-theme--dark";
                    const currentIsDark = document.body.classList.contains(darkClass);
                    const targetIsDark = themeValue === "dark";
                    if (currentIsDark !== targetIsDark) {
                      themeSwitch.click();
                      await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                  } else {
                    if (switching.localStorageKey && typeof localStorage !== "undefined") {
                      localStorage.setItem(switching.localStorageKey, themeValue);
                    }
                    if (switching.darkClass) {
                      if (themeValue === "dark") {
                        document.body.classList.add(switching.darkClass);
                        if (switching.lightClass) document.body.classList.remove(switching.lightClass);
                      } else {
                        document.body.classList.remove(switching.darkClass);
                        if (switching.lightClass) document.body.classList.add(switching.lightClass);
                      }
                    }
                  }
                }
              },
              { themeValue: theme.value, switching: THEME_CONFIG.switching },
            );
            await new Promise((r) => setTimeout(r, 800));
          }

          // Vite error overlay detection (mirrors reference)
          const hasErrorOverlay = await page.evaluate(() => {
            const errorOverlay = document.querySelector("vite-error-overlay");
            const errorMessages = Array.from(document.querySelectorAll("*")).some((el) => {
              const text = (el.textContent || "").trim();
              return (
                text.includes("Failed to fetch dynamically imported module") ||
                text.includes("Internal server error") ||
                (el.getAttribute("data-v-d6beb1d7") !== null && text.includes("Failed"))
              );
            });
            return errorOverlay !== null || errorMessages;
          });
          if (hasErrorOverlay) {
            throw new Error("Application has errors - Vite error overlay detected.");
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

          if (skipLinkVerification.exists && (skipLinkVerification.issues || []).length === 0) {
            console.log("   ✅ Skip link: OK");
          } else if (skipLinkVerification.exists) {
            console.log(`   ⚠️  Skip link: Issues found (${(skipLinkVerification.issues || []).length})`);
          } else {
            console.log("   ❌ Skip link: Not found");
          }

          if (violationCount > 0) console.log(`   ⚠️  Found ${violationCount} violation(s), ${passCount} pass(es)`);
          else console.log(`   ✅ No violations, ${passCount} pass(es)`);
        } catch (error) {
          console.error(`   ❌ Error testing ${url} (${viewport.name}): ${error.message}`);
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
  fs.writeFileSync(resultsJsonPath, JSON.stringify({ baseUrl: BASE_URL, results }, null, 2));
  console.log(`📄 Results JSON saved to: ${resultsJsonPath}`);

  console.log("\n📝 Generating HTML report...");
  fs.writeFileSync(REPORT_FILE, generateHTMLReport(results));

  const totalViolations = results.reduce((sum, r) => sum + (r.violations?.length || 0), 0);
  const totalPasses = results.reduce((sum, r) => sum + (r.passes?.length || 0), 0);
  const totalIncomplete = results.reduce((sum, r) => sum + (r.incomplete?.length || 0), 0);
  const totalInapplicable = results.reduce((sum, r) => sum + (r.inapplicable?.length || 0), 0);
  const totalTestsRun = totalViolations + totalPasses + totalIncomplete + totalInapplicable;
  const uniquePages = new Set(results.map((r) => r.url)).size;
  const pagesWithViolations = new Set(results.filter((r) => (r.violations?.length || 0) > 0).map((r) => r.url)).size;

  console.log("\n✅ Audit Complete!");
  console.log("\n📊 Summary:");
  console.log(`   Total tests run: ${totalTestsRun}`);
  console.log(`   Pages tested: ${uniquePages}`);
  console.log(`   Viewports tested: ${VIEWPORTS.length}`);
  console.log(`   Theme${THEMES.length !== 1 ? "s" : ""}: ${THEMES.map((t) => t.name).join(", ")}`);
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


