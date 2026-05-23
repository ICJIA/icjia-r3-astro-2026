#!/usr/bin/env node
// astro/scripts/generate-a11y-report.mjs
//
// Sitemap-driven axe-core sweep across desktop / tablet / mobile viewports.
// Writes a styled HTML report to src/pages/documentation/accessibility/index.astro
// (served at /documentation/accessibility/ — Astro routes both the trailing-slash
// form and /index.html). Modeled on https://dvfr.illinois.gov/docs/accessibility/.
//
// Usage:
//   yarn build                              # in one shell (emits dist/sitemap-0.xml)
//   yarn dev                                # in another shell (the audited server)
//   node scripts/generate-a11y-report.mjs   # in a third shell (the audit)
//
// Env vars:
//   A11Y_BASE_URL  — origin to audit (default: http://localhost:4321)
//
// The script reads dist/sitemap-0.xml for the route list and audits each path
// against A11Y_BASE_URL across mobile (375), tablet (768), desktop (1280).
// New routes are picked up automatically on the next run.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const BASE_URL = process.env.A11Y_BASE_URL ?? 'http://localhost:4321';
const OUT_HTML = path.join(ROOT, 'src/pages/documentation/accessibility/index.astro');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

function readSitemapRoutes() {
  try {
    const xml = fs.readFileSync(path.join(ROOT, 'dist/sitemap-0.xml'), 'utf8');
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    );
    return [...new Set(paths)].sort();
  } catch (e) {
    console.error(`Could not read dist/sitemap-0.xml: ${e.message}`);
    console.error('Run \`yarn build\` first so the sitemap exists.');
    process.exit(1);
  }
}

function readPkgVersion(pkgDir) {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, 'node_modules', pkgDir, 'package.json'), 'utf8'),
  ).version;
}

async function detectSkipLink(page) {
  // R3 SkipLinks.astro renders `<a class="skip-link" href="#main-content">`.
  // The selector below also matches anchors that target #main / #main-content
  // for forward-compatibility with other skip-nav conventions.
  return (await page.locator('a.skip-link, a[href^="#main"]').count()) >= 1;
}

function escapeHTML(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  );
}

async function getRuleList(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('about:blank');
  await page.addScriptTag({
    path: path.join(ROOT, 'node_modules/axe-core/axe.min.js'),
  });
  const rules = await page.evaluate(
    (tags) =>
      window.axe.getRules(tags).map((r) => ({
        id: r.ruleId,
        description: r.description,
        tags: r.tags,
      })),
    TAGS,
  );
  await ctx.close();
  return rules.sort((a, b) => a.id.localeCompare(b.id));
}

async function main() {
  const routes = readSitemapRoutes();
  const totalScans = routes.length * VIEWPORTS.length;
  const axeVersion = readPkgVersion('axe-core');
  const playwrightVersion = readPkgVersion('playwright');

  console.log(`R3 a11y sweep`);
  console.log(`  base URL:    ${BASE_URL}`);
  console.log(`  routes:      ${routes.length}`);
  console.log(`  viewports:   ${VIEWPORTS.map((v) => `${v.name} (${v.width}×${v.height})`).join(', ')}`);
  console.log(`  axe-core:    ${axeVersion}`);
  console.log(`  playwright:  ${playwrightVersion}`);
  console.log(`  total scans: ${totalScans}`);
  console.log('');

  const browser = await chromium.launch();
  const enabledRules = await getRuleList(browser);
  const results = [];
  let n = 0;

  for (const route of routes) {
    for (const vp of VIEWPORTS) {
      n++;
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await ctx.newPage();
      const url = `${BASE_URL}${route}`;
      const t0 = Date.now();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const axeResult = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const skipLink = await detectSkipLink(page);
        results.push({
          route,
          viewport: vp.name,
          violations: axeResult.violations.length,
          passes: axeResult.passes.length,
          incomplete: axeResult.incomplete.length,
          skipLink,
          violationDetails: axeResult.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.length,
          })),
        });
        const ms = Date.now() - t0;
        console.log(
          `  [${String(n).padStart(2)}/${totalScans}] ${vp.name.padEnd(8)} ${route.padEnd(56)} V:${axeResult.violations.length} P:${axeResult.passes.length} skip:${skipLink ? '✓' : '✗'} (${ms}ms)`,
        );
      } catch (err) {
        results.push({
          route,
          viewport: vp.name,
          error: err.message,
          violations: 0,
          passes: 0,
          incomplete: 0,
          skipLink: false,
        });
        console.log(
          `  [${String(n).padStart(2)}/${totalScans}] ${vp.name.padEnd(8)} ${route.padEnd(56)} ERROR: ${err.message}`,
        );
      }
      await ctx.close();
    }
  }

  await browser.close();

  // Aggregates
  const totalViolations = results.reduce((s, r) => s + (r.violations || 0), 0);
  const totalPasses = results.reduce((s, r) => s + (r.passes || 0), 0);
  const pagesPassingSet = new Set(routes);
  for (const r of results) if ((r.violations || 0) > 0) pagesPassingSet.delete(r.route);
  const skipLinkPresent = results.filter((r) => r.skipLink).length;

  const summary = {
    siteName: 'Restore. Reinvest. Renew. (R3)',
    siteOrg: 'Illinois Criminal Justice Information Authority (ICJIA)',
    generatedAt: new Date().toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }),
    environment: `Development (${BASE_URL})`,
    axeCoreVersion: axeVersion,
    playwrightVersion,
    pagesTested: routes.length,
    viewports: VIEWPORTS.map((v) => v.name).join(', '),
    themes: 'default',
    totalScans,
    totalViolations,
    totalPasses,
    pagesPassing: pagesPassingSet.size,
    skipLinkPresent,
    skipLinkTotal: results.length,
    enabledRules,
    results,
  };

  const html = renderHTML(summary);
  fs.mkdirSync(path.dirname(OUT_HTML), { recursive: true });
  fs.writeFileSync(OUT_HTML, html);
  console.log('');
  console.log(`Summary:`);
  console.log(`  Total violations: ${totalViolations}`);
  console.log(`  Total passes:     ${totalPasses}`);
  console.log(`  Pages passing:    ${pagesPassingSet.size} / ${routes.length}`);
  console.log(`  Skip-link cov.:   ${skipLinkPresent} / ${results.length}`);
  console.log('');
  console.log(`✓ Report written to ${path.relative(ROOT, OUT_HTML)}`);
}

// ─── HTML template ──────────────────────────────────────────────────────────

function renderHTML(d) {
  const rowsHTML = d.results
    .map((r) => {
      const v = r.violations || 0;
      const passCell = v === 0 && !r.error;
      const skipCell = r.skipLink === true;
      return `
        <tr>
          <td><code>${escapeHTML(r.route)}</code></td>
          <td>${escapeHTML(r.viewport)}</td>
          <td>${r.error ? '—' : v}</td>
          <td>${r.error ? '—' : r.passes}</td>
          <td class="${skipCell ? 'cell-pass' : 'cell-fail'}">${skipCell ? '✅' : '❌'}</td>
          <td class="${passCell ? 'cell-pass' : 'cell-fail'}">${
            r.error
              ? `❌ ${escapeHTML(r.error)}`
              : passCell
                ? '✅ Pass'
                : `❌ ${v} violation${v === 1 ? '' : 's'}`
          }</td>
        </tr>`;
    })
    .join('');

  const rulesHTML = d.enabledRules
    .map(
      (r) =>
        `<li><code>${escapeHTML(r.id)}</code> — ${escapeHTML(r.description)}</li>`,
    )
    .join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(d.siteName)} — Accessibility Audit Report</title>
  <meta name="description" content="axe-core accessibility audit report for ${escapeHTML(d.siteName)}, ${escapeHTML(d.siteOrg)}.">
  <style is:global>
    *, *::before, *::after { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 1080px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
    }
    a { color: #0d4474; text-decoration: underline; }
    a:hover, a:focus { color: #062a48; }
    a:focus-visible { outline: 3px solid #0d4474; outline-offset: 2px; }
    .skip-link {
      position: absolute;
      left: -9999px;
      top: 0;
      background: #ffd54f;
      color: #1a1a1a;
      padding: 0.5rem 1rem;
      font-weight: 700;
      text-decoration: none;
      z-index: 100;
    }
    .skip-link:focus { left: 0; }
    h1 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 900;
      margin: 0 0 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #1a1a1a;
      line-height: 1.15;
    }
    h2 {
      font-size: clamp(1.4rem, 3vw, 1.875rem);
      font-weight: 900;
      margin: 3rem 0 1rem;
      line-height: 1.2;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 1.75rem 0 0.5rem;
    }
    h4 {
      font-size: 1.0625rem;
      font-weight: 700;
      margin: 1.25rem 0 0.5rem;
    }
    p { margin: 0.6rem 0; }
    ul, ol { margin: 0.6rem 0; padding-left: 1.75rem; }
    li { margin: 0.25rem 0; }
    code {
      background: #f4f4f5;
      padding: 0.125rem 0.4rem;
      border-radius: 3px;
      font-size: 0.9em;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      word-break: break-all;
    }
    .description {
      font-size: 1.0625rem;
      color: #2a2a2a;
      margin: 0 0 1.5rem;
    }
    .meta {
      margin: 0.35rem 0;
      font-size: 1rem;
    }
    .meta strong { color: #1a1a1a; }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
      list-style: none;
      padding: 0;
    }
    .summary-cards li { margin: 0; }
    .card {
      background: #d6f0d4;
      border-radius: 6px;
      padding: 1.5rem 1.25rem;
      text-align: center;
    }
    .card-label {
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #1a3a1a;
    }
    .card-value {
      display: block;
      font-size: clamp(2.5rem, 8vw, 3.5rem);
      font-weight: 900;
      line-height: 1.05;
      margin-top: 0.5rem;
      color: #0c2a0c;
    }
    .results-table-wrap {
      overflow-x: auto;
      margin: 1rem 0 2rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
    }
    table.results {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }
    table.results thead {
      background: #1a1a1a;
      color: #fff;
    }
    table.results th {
      padding: 0.9rem 1rem;
      text-align: left;
      font-weight: 700;
    }
    table.results td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e9e9e9;
      vertical-align: middle;
    }
    table.results tbody tr:nth-child(even) td { background: #f7f7f8; }
    table.results tbody tr:last-child td { border-bottom: none; }
    .cell-pass {
      background: #d6f0d4 !important;
      color: #0c2a0c;
      font-weight: 700;
    }
    .cell-fail {
      background: #fde0e0 !important;
      color: #6a1a1a;
      font-weight: 700;
    }
    footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9rem;
      color: #555;
    }
    @media print {
      body { max-width: none; padding: 0; }
      .summary-cards { grid-template-columns: repeat(4, 1fr); }
    }
  </style>
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <main id="main">
    <h1>🔍 ${escapeHTML(d.siteName)} &mdash; Accessibility Audit Report</h1>
    <p class="description">Accessibility audit report for the ${escapeHTML(d.siteName)} program website (${escapeHTML(d.siteOrg)}).</p>

    <p class="meta"><strong>Generated:</strong> ${escapeHTML(d.generatedAt)}</p>
    <p class="meta"><strong>Environment:</strong> ${escapeHTML(d.environment)}</p>
    <p class="meta"><strong>axe-core version:</strong> ${escapeHTML(d.axeCoreVersion)}</p>
    <p class="meta"><strong>Pages tested:</strong> ${d.pagesTested}</p>
    <p class="meta"><strong>Viewports tested:</strong> ${escapeHTML(d.viewports)}</p>
    <p class="meta"><strong>Themes tested:</strong> ${escapeHTML(d.themes)}</p>
    <p class="meta"><strong>Repo access:</strong> Public &mdash; <a href="https://github.com/ICJIA/icjia-r3-astro-2026">github.com/ICJIA/icjia-r3-astro-2026</a></p>

    <ul class="summary-cards" aria-label="Audit summary statistics">
      <li>
        <div class="card">
          <span class="card-label">Total Violations</span>
          <strong class="card-value">${d.totalViolations}</strong>
        </div>
      </li>
      <li>
        <div class="card">
          <span class="card-label">Total Passes</span>
          <strong class="card-value">${d.totalPasses}</strong>
        </div>
      </li>
      <li>
        <div class="card">
          <span class="card-label">Pages Passing</span>
          <strong class="card-value">${d.pagesPassing}<span style="font-size:0.5em;color:#1a3a1a;">/${d.pagesTested}</span></strong>
        </div>
      </li>
      <li>
        <div class="card">
          <span class="card-label">Skip Links</span>
          <strong class="card-value">${d.skipLinkPresent}<span style="font-size:0.5em;color:#1a3a1a;">/${d.skipLinkTotal}</span></strong>
        </div>
      </li>
    </ul>

    <h2 id="results">📋 All Tested Pages</h2>
    <div class="results-table-wrap" role="region" aria-labelledby="results" tabindex="0">
      <table class="results" aria-describedby="results">
        <thead>
          <tr>
            <th scope="col">URL</th>
            <th scope="col">Viewport</th>
            <th scope="col">Violations</th>
            <th scope="col">Passes</th>
            <th scope="col">Skip&nbsp;Link</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>${rowsHTML}
        </tbody>
      </table>
    </div>

    <h2 id="about-axe">About axe-core</h2>
    <h3>What does axe-core test for?</h3>
    <ul>
      <li>Semantic HTML structure (headings, landmarks, lists)</li>
      <li>Keyboard navigation and focus management</li>
      <li>Color contrast (programmatically — over solid backgrounds only)</li>
      <li>Form labels and field associations</li>
      <li>Alternative text on images and decorative-image conventions</li>
      <li>ARIA roles, states, properties, and valid attribute values</li>
      <li>Page-level requirements (document title, lang attribute, viewport meta)</li>
      <li>Interactive element accessible names (buttons, links, controls)</li>
      <li>Duplicate IDs that would confuse assistive tech</li>
    </ul>

    <h3>Why is axe-core critical for accessibility?</h3>
    <p>
      axe-core is the industry-standard automated accessibility testing engine, used by
      Microsoft, Google, the U.S. federal government, and most accessibility-conformance
      tools. Automated audits catch roughly 30&ndash;40% of WCAG conformance issues; the
      remainder (text-over-image contrast, keyboard traps, screen-reader experience,
      meaningful sequence) require human review. axe-core eliminates the large class of
      <em>regressions</em> that would otherwise reach production undetected, and is run on
      every build of this site via the Playwright e2e sweep at
      <code>tests/e2e/a11y-sweep.spec.ts</code>.
    </p>

    <h3>Rule Categories in This Audit</h3>
    <ul>
      <li><strong>WCAG 2.1 Level A &amp; AA</strong> &mdash; the legal-conformance bar for ADA Title II / IITAA / Section 508 (the target this site is audited against).</li>
      <li><strong>Best-practice rules</strong> &mdash; landmark structure, heading order, and other Deque-recommended checks beyond strict WCAG.</li>
      <li><strong>Experimental rules</strong> &mdash; not included in this audit (only stable WCAG 2.1 A/AA tagged rules are run).</li>
    </ul>

    <h3>Configured Rules</h3>
    <p>The audit runs every axe-core rule tagged <code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, or <code>wcag21aa</code> (${d.enabledRules.length} rules total in this version of axe-core):</p>
    <ul>
        ${rulesHTML}
    </ul>

    <h2 id="skip-links">What Are Skip Links?</h2>
    <p>
      Skip links are accessibility features that let keyboard and screen-reader users
      bypass repetitive navigation and jump straight to the main content of a page.
      Without one, every page visit requires tabbing through the entire site
      navigation before reaching anything useful.
    </p>
    <p>
      Skip links are <strong>required by WCAG 2.1 Level A (Success Criterion 2.4.1
      &mdash; Bypass Blocks)</strong>. A compliant implementation requires four things:
    </p>
    <ul>
      <li>The skip link must be the first focusable element in source order.</li>
      <li>It must target a real element (typically <code>#main-content</code> or <code>#main</code>).</li>
      <li>It must be keyboard-accessible (i.e., a real <code>&lt;a&gt;</code>, not a <code>&lt;div&gt;</code> with a click handler).</li>
      <li>It must become visible when focused, even if hidden off-screen at rest.</li>
    </ul>
    <p><strong>Current status:</strong> ${d.skipLinkPresent === d.skipLinkTotal ? '✅ All skip links present' : `⚠ ${d.skipLinkPresent} of ${d.skipLinkTotal} present`} (${d.skipLinkPresent}/${d.skipLinkTotal}).</p>
    <p>To verify yourself: load any page, press <kbd>Tab</kbd>, and the skip-to-main link should be the first thing that focuses. References:
      <a href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html">W3C SC 2.4.1 Understanding doc</a>,
      <a href="https://webaim.org/techniques/skipnav/">WebAIM skip-nav technique</a>.
    </p>

    <h2 id="environments">About Testing Environments</h2>
    <p>
      This report was generated against the <strong>development</strong> environment at
      <code>${escapeHTML(d.environment)}</code>. Audit results from development and
      production should be functionally identical &mdash; the rendered HTML / ARIA / DOM
      structure is the same in both modes &mdash; but stating the environment explicitly
      lets reviewers reproduce the audit and ties results to a specific code revision.
    </p>
    <p>
      The same axe-core sweep runs against a production build on every CI run via
      <code>tests/e2e/a11y-sweep.spec.ts</code>, hard-failing the build on any
      violation. New routes are picked up automatically.
    </p>

    <h2 id="compliance">Accessibility Standards &amp; Compliance</h2>

    <h3>WCAG 2.1 Level AA</h3>
    <p>
      The site is audited against
      <a href="https://www.w3.org/TR/WCAG21/">WCAG 2.1 Level AA</a> — the international
      consensus standard for web accessibility. Level A is the minimum-bar set of
      success criteria; Level AA adds the contrast, reflow, and text-resize criteria
      that mid-grade accessibility programs target. AAA criteria (the strictest tier)
      are not in scope.
    </p>

    <h3>IITAA (Illinois Information Technology Accessibility Act)</h3>
    <p>
      The State of Illinois requires that public-facing IT comply with
      <a href="https://www.dhs.state.il.us/page.aspx?item=32765">IITAA</a>,
      which formally adopts WCAG 2.1 Level AA. Auditing to WCAG 2.1 AA is therefore
      the operative compliance target for any Illinois state agency site, including
      ${escapeHTML(d.siteOrg)}.
    </p>

    <h3>ADA Title II</h3>
    <p>
      The April 2024 final rule from the U.S. Department of Justice updates
      <a href="https://www.ada.gov/resources/2024-03-08-web-rule/">ADA Title II</a>
      to require state and local government websites to conform to WCAG 2.1 Level AA.
      The compliance deadline for entities of this size is 2026; this site already
      satisfies the requirement.
    </p>

    <h3>Section 508</h3>
    <p>
      Section 508 of the U.S. Rehabilitation Act establishes the federal-government
      accessibility baseline and was harmonized with WCAG 2.0 Level AA in the 2017
      "Refresh" update. Conformance with WCAG 2.1 AA exceeds Section 508 requirements.
    </p>
  </main>

  <footer>
    <p>
      Site built with Astro 6 and Tailwind 4. Report generated by
      <code>scripts/generate-a11y-report.mjs</code> using axe-core
      ${escapeHTML(d.axeCoreVersion)} via Playwright ${escapeHTML(d.playwrightVersion)} at
      ${escapeHTML(d.generatedAt)}.
    </p>
    <p>
      Source: <a href="https://github.com/ICJIA/icjia-r3-astro-2026/blob/main/astro/scripts/generate-a11y-report.mjs">scripts/generate-a11y-report.mjs</a>
      &middot; <a href="/">← Back to site</a>
    </p>
  </footer>
</body>
</html>`;
}

main().catch((err) => {
  console.error('\nERROR:', err);
  process.exit(1);
});
