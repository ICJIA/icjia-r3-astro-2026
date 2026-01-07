#!/usr/bin/env node
/**
 * Runs Vitest and generates an HTML report at /public/docs/tests/index.html.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

/**
 * Human-readable test descriptions shown in the report.
 * Keys must match the test title exactly.
 * Reference: https://github.com/ICJIA/icjia-accessibility-portal/tree/main/test
 */
const TEST_DESCRIPTIONS = {
  // useCurrentPage tests
  "returns slug and a friendly message":
    "Verifies the composable returns the provided slug and a stable message used by consuming components.",
  "returns correct slug for different page slugs":
    "Ensures the composable correctly handles and returns various page slug values.",
  "always returns the same message regardless of slug":
    "Verifies that the message property remains consistent across different slug values.",
  "handles empty slug":
    "Tests that the composable gracefully handles empty string slugs.",
  "handles slug with special characters":
    "Verifies the composable correctly processes slugs containing special characters.",
  "logs to console when called":
    "Ensures the composable logs its execution for debugging purposes.",
  "returns an object with expected structure":
    "Verifies the composable returns an object with the correct properties and types.",

  // State management tests
  "initializes with default value of 0":
    "Verifies counter state initializes with the correct default value.",
  "allows incrementing the counter":
    "Tests that counter state can be incremented correctly.",
  "allows decrementing the counter":
    "Tests that counter state can be decremented correctly.",
  "maintains state across multiple calls":
    "Ensures state persistence when the composable is called multiple times.",
  "initializes with default value of 'pink'":
    "Verifies color state initializes with the correct default value.",
  "allows changing the color":
    "Tests that color state can be modified.",
  "initializes with default value of false":
    "Verifies boolean states initialize with false by default.",
  "allows toggling navigation state":
    "Tests navigation toggle functionality.",
  "initializes with provided value":
    "Verifies composables with parameters initialize correctly.",
  "allows modifying the counter value":
    "Tests state modification functionality.",
  "handles negative initial values":
    "Ensures composables handle edge cases like negative numbers.",
  "handles zero initial value":
    "Tests composable behavior with zero values.",
  "allows enabling translation mode":
    "Verifies translation toggle functionality.",
  "initializes with empty array":
    "Ensures array-based states initialize as empty arrays.",
  "allows adding queries":
    "Tests adding items to array-based state.",
  "returns readonly queries reference":
    "Verifies that search actions return read-only state references.",
  "adds new query with addNewQuery":
    "Tests the addNewQuery function for search actions.",
  "trims whitespace when adding queries":
    "Ensures search queries are properly sanitized before storage.",
  "removes duplicates when adding queries":
    "Verifies duplicate query prevention in search history.",
  "does not add empty queries":
    "Tests that empty or whitespace-only queries are rejected.",
  "clears all queries with clearQueries":
    "Verifies the clearQueries function works correctly.",
  "maintains separate state from regular search queries":
    "Ensures FAQ search queries are independent from regular search queries.",

  // Event bus tests
  "emits events without throwing errors":
    "Verifies event emission doesn't cause errors.",
  "emits events with null payload":
    "Tests event emission with null payload values.",
  "registers event listeners":
    "Verifies event listener registration functionality.",
  "calls multiple listeners for the same event":
    "Tests that multiple listeners can subscribe to the same event.",
  "calls listeners multiple times for multiple emissions":
    "Verifies listeners are called for each event emission.",
  "does not call listeners for unregistered events":
    "Ensures listeners only respond to subscribed events.",
  "supports event-driven communication pattern":
    "Tests the overall event bus communication pattern.",
  "handles rapid event emissions":
    "Verifies the event bus handles high-frequency events correctly.",

  // Component tests
  "uses navigation toggle state":
    "Verifies components use navigation state correctly.",
  "can toggle navigation state":
    "Tests component navigation toggle functionality.",
  "defines a GraphQL query structure":
    "Verifies GraphQL query component structure.",
  "expects query to return pages data structure":
    "Tests expected GraphQL response structure.",
  "handles async query execution":
    "Verifies async query handling in components.",

  // E2E Page tests
  "should have a homepage route":
    "Verifies homepage route exists and is accessible.",
  "should load homepage content":
    "Tests homepage content loading and structure.",
  "should have FAQ index route":
    "Verifies FAQ index page route exists.",
  "should support dynamic FAQ slug routes":
    "Tests dynamic FAQ route generation and handling.",
  "should have news index route":
    "Verifies news index page route exists.",
  "should support dynamic news slug routes":
    "Tests dynamic news route generation.",
  "should have resources index route":
    "Verifies resources index page route exists.",
  "should have single page resource route":
    "Tests single page resource route.",
  "should support dynamic resource slug routes":
    "Tests dynamic resource route generation.",
  "should have funding page route":
    "Verifies funding page route exists.",
  "should have contact page route":
    "Verifies contact page route exists.",
  "should have search page route":
    "Verifies search page route exists.",
  "should have translate page route":
    "Verifies translate page route exists.",
  "should have research index route":
    "Verifies research index route exists.",
  "should have preview index route":
    "Verifies preview index route exists.",
  "should have sandbox route":
    "Verifies sandbox route exists.",
  "should handle dynamic slug routes":
    "Tests catch-all dynamic route handling.",
  "should handle nested dynamic routes":
    "Tests nested dynamic route handling.",
  "should have 404 error page route":
    "Verifies 404 error page exists.",
  "should redirect /apply to /funding":
    "Tests route redirect functionality.",
  "should redirect /downloads/* to homepage":
    "Tests wildcard redirect functionality.",

  // Navigation E2E tests
  "should have skip to main content link":
    "Verifies accessibility skip link exists.",
  "should have skip to navigation link":
    "Tests skip navigation link presence.",
  "should toggle mobile navigation":
    "Tests mobile navigation toggle functionality.",
  "should close mobile navigation when link is clicked":
    "Verifies mobile navigation closes on link click.",
  "should hide breadcrumb on homepage":
    "Tests breadcrumb visibility logic for homepage.",
  "should hide breadcrumb on sandbox page":
    "Tests breadcrumb visibility for sandbox page.",
  "should hide breadcrumb on FAQs index":
    "Tests breadcrumb visibility for FAQs index.",
  "should show breadcrumb on other pages":
    "Verifies breadcrumb displays on content pages.",
  "should have scroll to top button":
    "Tests scroll to top button presence.",
  "should scroll to top when button is clicked":
    "Verifies scroll to top functionality.",

  // Content E2E tests
  "should load splash images":
    "Tests homepage splash image loading.",
  "should display news articles":
    "Verifies news article display on homepage.",
  "should display director letter":
    "Tests director letter section display.",
  "should display applicant tools section":
    "Verifies applicant tools section rendering.",
  "should load news articles list":
    "Tests news list page content loading.",
  "should display news article dates":
    "Verifies news article date formatting.",
  "should navigate to news article detail page":
    "Tests navigation to news detail pages.",
  "should load FAQ list":
    "Verifies FAQ list loading.",
  "should support FAQ search":
    "Tests FAQ search functionality.",
  "should load resources list":
    "Tests resources list loading.",
  "should support resource filtering":
    "Verifies resource filtering functionality.",
  "should show loading state while content loads":
    "Tests loading state display.",
  "should hide loading state when content is loaded":
    "Verifies loading state removal.",
  "should handle missing content gracefully":
    "Tests error handling for missing content.",
  "should display error message for failed content loads":
    "Verifies error message display.",

  // Search E2E tests
  "should have search page route":
    "Verifies search page route exists.",
  "should display search input field":
    "Tests search input field rendering.",
  "should accept search queries":
    "Tests search query input handling.",
  "should trim whitespace from queries":
    "Verifies query sanitization.",
  "should handle empty queries":
    "Tests empty query handling.",
  "should store search query history":
    "Verifies search history storage.",
  "should remove duplicate queries from history":
    "Tests duplicate query prevention.",
  "should display search results":
    "Verifies search results display.",
  "should display no results message when no matches":
    "Tests empty results handling.",
  "should highlight search terms in results":
    "Verifies search term highlighting.",
  "should support FAQ-specific search":
    "Tests FAQ search functionality.",
  "should filter FAQs by search query":
    "Verifies FAQ filtering by query.",
  "should handle rapid search queries":
    "Tests performance with multiple queries.",
  "should debounce search input":
    "Verifies search input debouncing.",

  // Integration tests
  "should generate appRoutes.json":
    "Tests route file generation.",
  "should generate sitemap.xml":
    "Verifies sitemap generation.",
  "should generate searchIndex.json":
    "Tests search index generation.",
  "should generate pages.json":
    "Verifies pages JSON generation.",
  "should generate faqs.json":
    "Tests FAQ JSON generation.",
  "should generate resources.json":
    "Verifies resources JSON generation.",
  "should generate posts.json":
    "Tests posts JSON generation.",
  "should have content directory":
    "Verifies content directory structure.",
  "should have news subdirectory":
    "Tests news directory existence.",
  "should have resources subdirectory":
    "Verifies resources directory existence.",
  "should generate routes for all pages":
    "Tests route generation for all content.",
  "should include homepage route":
    "Verifies homepage route in generated routes.",
  "should include FAQ routes":
    "Tests FAQ route generation.",
  "should include news routes":
    "Verifies news route generation.",
  "should index all content pages":
    "Tests search index generation.",
  "should include page titles in index":
    "Verifies title indexing.",
  "should include page slugs in index":
    "Tests slug indexing.",
  "should have API directory structure":
    "Verifies API directory structure.",
  "should have API base URL configured":
    "Tests API configuration.",
  "should have site base URL configured":
    "Verifies site base URL configuration.",
  "should fetch content from CMS":
    "Tests CMS content fetching.",
  "should handle API errors gracefully":
    "Verifies API error handling.",

  // Accessibility tests
  "should have skip to main content link":
    "Verifies accessibility skip link for main content.",
  "should have skip to navigation link":
    "Tests skip link for navigation.",
  "should be keyboard accessible":
    "Verifies keyboard accessibility of skip links.",
  "should have aria-label on scroll to top button":
    "Tests ARIA labeling for accessibility.",
  "should have role='main' on main content area":
    "Verifies semantic HTML roles.",
  "should use semantic navigation elements":
    "Tests semantic HTML usage.",
  "should use proper heading hierarchy":
    "Verifies heading hierarchy for accessibility.",
  "should have alt text on images":
    "Tests image alt text for screen readers.",
  "should use empty alt for decorative images":
    "Verifies decorative image handling.",
  "should have screen reader only content":
    "Tests screen reader content structure.",
  "should hide decorative content from screen readers":
    "Verifies ARIA hidden attributes.",
  "should support keyboard navigation":
    "Tests keyboard navigation support.",
  "should have focus indicators":
    "Verifies focus indicator visibility.",
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function runVitest() {
  return new Promise((resolve) => {
    const args = ["vitest", "run", "--reporter=json", "--reporter=verbose"];
    const proc = spawn("npx", args, {
      cwd: projectRoot,
      shell: true,
      env: { ...process.env, FORCE_COLOR: "0" },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
      process.stdout.write(d);
    });
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
      process.stderr.write(d);
    });

    proc.on("close", (code) => {
      let results = null;
      try {
        const jsonPath = join(projectRoot, "test-results.json");
        if (existsSync(jsonPath)) {
          results = JSON.parse(readFileSync(jsonPath, "utf8"));
        }
      } catch (e) {
        // ignore
      }

      resolve({
        passed: code === 0,
        exitCode: code,
        output: stdout + stderr,
        results,
      });
    });
  });
}

function generateHTMLReport(results, reportDate) {
  const reportTimestamp = reportDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const testFiles = results?.testResults || [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;

  const fileResults = testFiles.map((file) => {
    const fileName = file.name?.replace(projectRoot, "") || "Unknown file";
    const assertions = file.assertionResults || [];

    let filePassed = 0;
    let fileFailed = 0;
    let fileSkipped = 0;

    assertions.forEach((t) => {
      totalTests++;
      if (t.status === "passed") {
        passedTests++;
        filePassed++;
      } else if (t.status === "failed") {
        failedTests++;
        fileFailed++;
      } else {
        skippedTests++;
        fileSkipped++;
      }
    });

    return { fileName, assertions, passed: filePassed, failed: fileFailed, skipped: fileSkipped };
  });

  const allPassed = failedTests === 0;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test Results - R3 Restore, Reinvest, Renew</title>
    <style>
      :root { --primary:#0e4474; --info:#17a2b8; --success:#28a745; --danger:#dc3545; --muted:#6b7280; }
      body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; padding:20px; background:#f5f5f5; }
      .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,.08); }
      h1 { color: var(--primary); border-bottom: 3px solid var(--info); padding-bottom: 10px; margin-bottom: 16px; }
      .meta { color: var(--muted); margin-bottom: 16px; }
      .grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
      .stat { background:#f8f9fa; padding:16px; border-radius: 10px; text-align:center; border:1px solid #e5e7eb; }
      .stat .num { font-size: 2em; font-weight: 800; }
      .ok { color: var(--success); }
      .bad { color: var(--danger); }
      .banner { padding: 16px; border-radius: 10px; margin: 12px 0 22px; border-left: 4px solid; }
      .banner.ok { background:#d4edda; color:#155724; border-left-color: var(--success); }
      .banner.bad { background:#f8d7da; color:#721c24; border-left-color: var(--danger); }
      .file { background:#f8f9fa; padding: 18px; margin: 18px 0; border-radius: 10px; border-left: 4px solid var(--info); }
      .file h3 { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; font-size: .95rem; margin-bottom: 10px; color:#111827; }
      .test { background:white; border:1px solid #e5e7eb; border-left:4px solid var(--success); padding: 12px; border-radius: 10px; margin: 10px 0; }
      .test.failed { border-left-color: var(--danger); }
      .test small { color: var(--muted); }
      details summary { color: var(--info); cursor:pointer; font-weight:700; margin-top:8px; }
      .desc { margin-top: 10px; padding: 12px; background:#e7f3ff; border-left:3px solid var(--info); border-radius: 8px; color:#0b3b59; }
      pre { background:#111827; color:#e5e7eb; padding: 12px; border-radius: 10px; overflow-x:auto; }
      footer { margin-top: 26px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: var(--muted); }
      a { color: var(--info); text-decoration:none; font-weight:800; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🧪 Test Results</h1>
      <div class="meta"><strong>Generated:</strong> ${escapeHtml(reportTimestamp)}</div>

      <div class="grid">
        <div class="stat"><div class="num">${totalTests}</div><div>Total Tests</div></div>
        <div class="stat"><div class="num ok">${passedTests}</div><div>Passed</div></div>
        <div class="stat"><div class="num ${failedTests > 0 ? "bad" : "ok"}">${failedTests}</div><div>Failed</div></div>
        <div class="stat"><div class="num">${skippedTests}</div><div>Skipped</div></div>
      </div>

      ${
        allPassed
          ? `<div class="banner ok">✅ All tests passed.</div>`
          : `<div class="banner bad">❌ Some tests failed. Review details below.</div>`
      }

      <div class="meta">
        <strong>Repo access:</strong> This repository is private. For source-level details, contact the ICJIA web development team.
      </div>

      <h2 style="color: var(--primary); margin-top: 22px;">Detailed Results</h2>

      ${fileResults
        .map(
          (file) => `
        <div class="file">
          <h3>${escapeHtml(file.fileName)}</h3>
          ${file.assertions
            .map((t) => {
              const statusIcon =
                t.status === "passed" ? "✅" : t.status === "failed" ? "❌" : "⚠️";
              const description = TEST_DESCRIPTIONS[t.title] || null;
              return `
                <div class="test ${t.status === "failed" ? "failed" : ""}">
                  <div><strong>${statusIcon} ${escapeHtml(t.title)}</strong></div>
                  <small>Duration: ${t.duration || 0}ms</small>
                  ${
                    description
                      ? `<details><summary>What does this test verify?</summary><div class="desc">${escapeHtml(description)}</div></details>`
                      : ""
                  }
                  ${
                    t.failureMessages?.length
                      ? `<pre>${escapeHtml(t.failureMessages.join("\n"))}</pre>`
                      : ""
                  }
                </div>
              `;
            })
            .join("")}
        </div>
      `,
        )
        .join("")}

      <footer>
        <a href="/docs/index.html">← Back to Documentation Portal</a>
      </footer>
    </div>
  </body>
</html>`;
}

async function main() {
  console.log("🧪 Running tests (Vitest)...");
  const testResults = await runVitest();
  const reportDate = new Date();

  const outputDir = join(projectRoot, "public", "docs", "tests");
  const outputPath = join(outputDir, "index.html");
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  if (testResults.results) {
    const html = generateHTMLReport(testResults.results, reportDate);
    writeFileSync(outputPath, html, "utf8");
    console.log(`✓ Report generated: ${outputPath}`);
  } else {
    console.warn("⚠️ Could not parse test-results.json; report was not generated.");
  }

  process.exit(testResults.passed ? 0 : 1);
}

main();


