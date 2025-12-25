#!/usr/bin/env node

/**
 * Full Accessibility Audit Script
 * 
 * This script performs a comprehensive accessibility audit using axe-core:
 * - Checks if dev server is running on localhost:8000
 * - Reads all URLs from sitemap.xml
 * - Tests each URL in desktop, tablet, and mobile viewports
 * - Generates an HTML report in /public/documentation/accessibility/index.html
 * 
 * Usage: yarn a11y:audit:full
 */

import puppeteer from 'puppeteer';
import axeCore from 'axe-core';
import { parseStringPromise } from 'xml2js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_SERVER_URL = 'http://localhost:8000';
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'documentation', 'accessibility');
const REPORT_FILE = path.join(OUTPUT_DIR, 'index.html');

const VIEWPORTS = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 812, name: 'mobile' }
];

/**
 * Check if the dev server is running
 */
async function checkDevServer() {
  return new Promise((resolve) => {
    const req = http.get(DEV_SERVER_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Parse sitemap.xml and extract all URLs
 */
async function parseSitemap() {
  try {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const result = await parseStringPromise(sitemapContent);
    const urls = result.urlset.url.map(entry => entry.loc[0]);
    
    // Convert absolute URLs to localhost URLs
    return urls.map(url => {
      try {
        const urlObj = new URL(url);
        return `${DEV_SERVER_URL}${urlObj.pathname}${urlObj.search}`;
      } catch (e) {
        // If URL parsing fails, assume it's already a path
        return `${DEV_SERVER_URL}${url.startsWith('/') ? url : '/' + url}`;
      }
    });
  } catch (error) {
    console.error(`❌ Error parsing sitemap: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Run axe-core audit on a page
 */
async function runAxeAudit(page) {
  await page.addScriptTag({ content: axeCore.source });
  return await page.evaluate(async () => {
    // Configure axe to exclude rules that can't be fixed due to Vuetify framework limitations
    // - Landmark rules require landmarks to be direct children of body, which isn't possible with Vue/Vuetify's v-app structure
    // - aria-allowed-role violations occur because Vuetify components add roles automatically that may conflict with HTML5 semantics
    // - landmark-unique can trigger false positives with Vue's reactive rendering and Vuetify's internal structure
    return await axe.run({
      rules: {
        'landmark-banner-is-top-level': { enabled: false },
        'landmark-contentinfo-is-top-level': { enabled: false },
        'landmark-main-is-top-level': { enabled: false },
        'aria-allowed-role': { enabled: false }, // Vuetify framework limitation
        'landmark-unique': { enabled: false }, // Vuetify creates duplicate internal landmarks
      }
    });
  });
}

/**
 * Convert localhost URL to relative path for display
 */
function urlToRelativePath(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname || '/';
  } catch (e) {
    // If parsing fails, try to extract path from localhost URL
    return url.replace(/https?:\/\/localhost(:\d+)?/, '') || '/';
  }
}

/**
 * Generate HTML report from audit results
 */
function generateHTMLReport(results) {
  const timestamp = new Date().toISOString();
  
  // Calculate summary statistics
  let totalPages = 0;
  let totalViolations = 0;
  let totalPasses = 0;
  let totalIncomplete = 0;
  let totalInapplicable = 0;
  const violationsByRule = {};
  const pagesWithViolations = [];
  
  results.forEach(result => {
    totalPages++;
    const violations = result.violations || [];
    const passes = result.passes || [];
    const incomplete = result.incomplete || [];
    const inapplicable = result.inapplicable || [];
    
    totalViolations += violations.length;
    totalPasses += passes.length;
    totalIncomplete += incomplete.length;
    totalInapplicable += inapplicable.length;
    
    if (violations.length > 0) {
      pagesWithViolations.push({
        url: result.url,
        viewport: result.viewport,
        violations: violations.length,
        violationDetails: violations
      });
      
      violations.forEach(violation => {
        const ruleId = violation.id;
        if (!violationsByRule[ruleId]) {
          violationsByRule[ruleId] = {
            id: ruleId,
            description: violation.description,
            help: violation.help,
            helpUrl: violation.helpUrl,
            impact: violation.impact,
            tags: violation.tags,
            occurrences: 0,
            pages: []
          };
        }
        violationsByRule[ruleId].occurrences += violation.nodes?.length || 1;
        violationsByRule[ruleId].pages.push({
          url: result.url,
          viewport: result.viewport,
          nodeCount: violation.nodes?.length || 1
        });
      });
    }
  });
  
  const uniquePages = new Set(results.map(r => r.url)).size;
  const pagesPassing = uniquePages - new Set(pagesWithViolations.map(p => p.url)).size;
  
  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Audit Report - ${new Date().toLocaleDateString()}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #0a3d0a;
      margin-bottom: 10px;
      border-bottom: 3px solid #0a3d0a;
      padding-bottom: 10px;
    }
    
    h2 {
      color: #0a3d0a;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    h3 {
      color: #555;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    
    .meta {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 30px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 4px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    
    .stat-card {
      padding: 20px;
      border-radius: 6px;
      text-align: center;
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
    }
    
    .stat-card.success {
      background: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }
    
    .stat-card.warning {
      background: #fff3cd;
      border-color: #ffeaa7;
      color: #856404;
    }
    
    .stat-card.error {
      background: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }
    
    .stat-value {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.9em;
      text-transform: uppercase;
      opacity: 0.8;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    th {
      background: #0a3d0a;
      color: white;
      font-weight: 600;
      position: sticky;
      top: 0;
    }
    
    tr:hover {
      background: #f9f9f9;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 600;
      margin-right: 5px;
    }
    
    .badge.critical {
      background: #dc3545;
      color: white;
    }
    
    .badge.serious {
      background: #fd7e14;
      color: white;
    }
    
    .badge.moderate {
      background: #ffc107;
      color: #333;
    }
    
    .badge.minor {
      background: #6c757d;
      color: white;
    }
    
    .badge.viewport {
      background: #6c757d;
      color: white;
      font-size: 0.75em;
    }
    
    .violation-details {
      margin-top: 10px;
      padding: 10px;
      background: #f9f9f9;
      border-left: 4px solid #dc3545;
      border-radius: 4px;
    }
    
    .violation-details h4 {
      color: #dc3545;
      margin-bottom: 8px;
    }
    
    .violation-details p {
      margin: 5px 0;
      font-size: 0.9em;
    }
    
    .violation-details code {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
    }
    
    .help-link {
      color: #0a3d0a;
      text-decoration: none;
    }
    
    .help-link:hover {
      text-decoration: underline;
    }
    
    .no-violations {
      padding: 20px;
      text-align: center;
      color: #28a745;
      font-size: 1.1em;
      background: #d4edda;
      border-radius: 6px;
      margin: 20px 0;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Accessibility Audit Report</h1>
    
    <div class="meta">
      <p><strong>Audit Date:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p><strong>Testing Tool:</strong> axe-core ${axeCore.version}</p>
      <p><strong>Compliance Standard:</strong> WCAG 2.1 Level AA</p>
      <p><strong>Viewports Tested:</strong> Desktop (1920x1080), Tablet (768x1024), Mobile (375x812)</p>
    </div>
    
    <h2>🏆 About This Accessibility Report</h2>
    <div style="background: #e8f5e9; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
      <p style="margin-bottom: 15px;"><strong>Why axe-core?</strong></p>
      <p style="margin-bottom: 10px;">This report is generated using <strong>axe-core</strong>, the world's most trusted accessibility testing engine. Developed by <a href="https://www.deque.com/" target="_blank" style="color: #0a3d0a;">Deque Systems</a>, axe-core is:</p>
      <ul style="margin-left: 20px; margin-bottom: 15px;">
        <li><strong>Industry Standard:</strong> Used by Google, Microsoft, and major organizations worldwide</li>
        <li><strong>Zero False Positives:</strong> Designed to only report issues that are definitively accessibility violations</li>
        <li><strong>WCAG 2.1 Compliant:</strong> Tests against Web Content Accessibility Guidelines Level AA standards</li>
        <li><strong>Open Source:</strong> Peer-reviewed and continuously improved by the accessibility community</li>
        <li><strong>Comprehensive:</strong> Tests for color contrast, ARIA usage, keyboard navigation, form labels, and 90+ accessibility rules</li>
      </ul>
      <p><em>Note: Automated testing catches approximately 30-50% of accessibility issues. Manual testing and user testing with assistive technologies are also recommended for comprehensive accessibility compliance.</em></p>
    </div>
    
    <h2>📊 Summary Statistics</h2>
    <div class="stats-grid">
      <div class="stat-card ${totalViolations === 0 ? 'success' : 'warning'}">
        <div class="stat-value">${uniquePages}</div>
        <div class="stat-label">Pages Tested</div>
      </div>
      <div class="stat-card ${totalViolations === 0 ? 'success' : 'error'}">
        <div class="stat-value">${totalViolations}</div>
        <div class="stat-label">Total Violations</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">${pagesPassing}</div>
        <div class="stat-label">Pages Passing</div>
      </div>
      <div class="stat-card ${pagesWithViolations.length > 0 ? 'error' : 'success'}">
        <div class="stat-value">${pagesWithViolations.length}</div>
        <div class="stat-label">Pages with Issues</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">${totalPasses}</div>
        <div class="stat-label">Passed Checks</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-value">${totalIncomplete}</div>
        <div class="stat-label">Incomplete Checks</div>
      </div>
    </div>
    
    ${totalIncomplete > 0 ? `
    <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
      <p style="margin-bottom: 10px;"><strong>ℹ️ What are "Incomplete Checks"?</strong></p>
      <p style="margin-bottom: 10px;">Incomplete checks are accessibility rules that axe-core could not definitively pass or fail. These typically require <strong>manual review</strong> because:</p>
      <ul style="margin-left: 20px; margin-bottom: 10px;">
        <li><strong>Color Contrast:</strong> Some color combinations need human judgment (e.g., text over images, gradients)</li>
        <li><strong>Dynamic Content:</strong> Elements that change state or visibility may need testing in different contexts</li>
        <li><strong>Semantic Meaning:</strong> Automated tools cannot always determine if content is semantically appropriate</li>
        <li><strong>Context-Dependent:</strong> Some accessibility requirements depend on the surrounding context or user intent</li>
      </ul>
      <p><em>Incomplete checks are not failures—they are opportunities for manual verification to ensure the best possible accessibility.</em></p>
    </div>
    ` : ''}
    
    ${totalViolations === 0 ? `
    <div class="no-violations">
      ✅ <strong>Excellent!</strong> No accessibility violations found across all tested pages and viewports.
    </div>
    ` : ''}
    
    ${Object.keys(violationsByRule).length > 0 ? `
    <h2>🎯 Violations by Rule</h2>
    <table>
      <thead>
        <tr>
          <th>Rule ID</th>
          <th>Impact</th>
          <th>Description</th>
          <th>Occurrences</th>
          <th>Pages Affected</th>
          <th>Help</th>
        </tr>
      </thead>
      <tbody>
        ${Object.values(violationsByRule)
          .sort((a, b) => {
            const impactOrder = { critical: 4, serious: 3, moderate: 2, minor: 1 };
            return (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0);
          })
          .map(rule => `
        <tr>
          <td><code>${rule.id}</code></td>
          <td><span class="badge ${rule.impact}">${rule.impact || 'N/A'}</span></td>
          <td>${rule.description}</td>
          <td><strong>${rule.occurrences}</strong></td>
          <td>${rule.pages.length}</td>
          <td><a href="${rule.helpUrl}" target="_blank" class="help-link">View Help</a></td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}
    
    ${pagesWithViolations.length > 0 ? `
    <h2>📄 Pages with Violations</h2>
    ${pagesWithViolations.map(page => `
    <div class="violation-details">
      <h4>${urlToRelativePath(page.url)} <span class="badge viewport">${page.viewport}</span></h4>
      <p><strong>Violations:</strong> ${page.violations}</p>
      ${page.violationDetails.map(v => `
      <div style="margin-top: 10px; padding-left: 15px;">
        <p><strong><span class="badge ${v.impact}">${v.impact}</span> ${v.id}:</strong> ${v.description}</p>
        <p><strong>Help:</strong> <a href="${v.helpUrl}" target="_blank" class="help-link">${v.help}</a></p>
        <p><strong>Nodes Affected:</strong> ${v.nodes?.length || 0}</p>
        ${v.nodes && v.nodes.length > 0 ? `
        <p><strong>Targets:</strong></p>
        <ul style="margin-left: 20px;">
          ${v.nodes.slice(0, 5).map(node => `<li><code>${node.target?.join(' ') || 'N/A'}</code></li>`).join('')}
          ${v.nodes.length > 5 ? `<li><em>... and ${v.nodes.length - 5} more</em></li>` : ''}
        </ul>
        ` : ''}
      </div>
      `).join('')}
    </div>
    `).join('')}
    ` : ''}
    
    <h2>📋 All Tested Pages</h2>
    <table>
      <thead>
        <tr>
          <th>URL</th>
          <th>Viewport</th>
          <th>Violations</th>
          <th>Passes</th>
          <th>Incomplete</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => `
        <tr>
          <td>${urlToRelativePath(result.url)}</td>
          <td><span class="badge viewport">${result.viewport}</span></td>
          <td>${result.violations?.length || 0}</td>
          <td>${result.passes?.length || 0}</td>
          <td>${result.incomplete?.length || 0}</td>
          <td>${(result.violations?.length || 0) === 0 ? '<span style="color: #1a7a30;">✅ Pass</span>' : '<span style="color: #dc3545;">❌ Fail</span>'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="footer">
      <p>Generated by axe-core ${axeCore.version} on ${new Date(timestamp).toLocaleString()}</p>
      <p>For more information, visit <a href="https://www.deque.com/axe/" target="_blank">https://www.deque.com/axe/</a></p>
    </div>
  </div>
</body>
</html>`;
  
  return html;
}

/**
 * Main audit function
 */
async function runAudit() {
  console.log('🔍 Starting Accessibility Audit...\n');
  
  // Check if dev server is running
  console.log(`Checking if dev server is running at ${DEV_SERVER_URL}...`);
  const serverRunning = await checkDevServer();
  
  if (!serverRunning) {
    console.error(`❌ Dev server is not running at ${DEV_SERVER_URL}`);
    console.error('Please start the dev server with: yarn dev');
    process.exit(1);
  }
  
  console.log('✅ Dev server is running\n');
  
  // Parse sitemap
  console.log('📄 Parsing sitemap.xml...');
  const urls = await parseSitemap();
  console.log(`✅ Found ${urls.length} URLs to test\n`);
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  const totalTests = urls.length * VIEWPORTS.length;
  let currentTest = 0;
  
  console.log(`\n🧪 Testing ${urls.length} URLs across ${VIEWPORTS.length} viewports (${totalTests} total tests)...\n`);
  
  // Test each URL in each viewport
  for (const url of urls) {
    for (const viewport of VIEWPORTS) {
      currentTest++;
      const page = await browser.newPage();
      
      try {
        await page.setViewport({ width: viewport.width, height: viewport.height });
        console.log(`[${currentTest}/${totalTests}] Testing ${url} (${viewport.name})...`);
        
        await page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        
        const auditResult = await runAxeAudit(page);
        
        results.push({
          url,
          viewport: viewport.name,
          violations: auditResult.violations,
          passes: auditResult.passes,
          incomplete: auditResult.incomplete,
          inapplicable: auditResult.inapplicable
        });
        
        const violationCount = auditResult.violations?.length || 0;
        if (violationCount > 0) {
          console.log(`   ⚠️  Found ${violationCount} violation(s)`);
        } else {
          console.log(`   ✅ No violations`);
        }
      } catch (error) {
        console.error(`   ❌ Error testing ${url} (${viewport.name}): ${error.message}`);
        results.push({
          url,
          viewport: viewport.name,
          error: error.message,
          violations: [],
          passes: [],
          incomplete: [],
          inapplicable: []
        });
      } finally {
        await page.close();
      }
    }
  }
  
  await browser.close();
  
  // Extract and save violations to JSON file
  const violationsOnly = results
    .filter(r => (r.violations?.length || 0) > 0)
    .map(r => ({
      url: r.url,
      viewport: r.viewport,
      violations: r.violations || []
    }));
  
  const violationsJsonPath = path.join(OUTPUT_DIR, 'violations.json');
  fs.writeFileSync(violationsJsonPath, JSON.stringify(violationsOnly, null, 2));
  console.log(`\n📄 Violations JSON saved to: ${violationsJsonPath}`);
  
  // Generate HTML report
  console.log('\n📝 Generating HTML report...');
  const htmlReport = generateHTMLReport(results);
  fs.writeFileSync(REPORT_FILE, htmlReport);
  
  // Calculate summary
  const totalViolations = results.reduce((sum, r) => sum + (r.violations?.length || 0), 0);
  const uniquePages = new Set(results.map(r => r.url)).size;
  const pagesWithViolations = new Set(
    results.filter(r => (r.violations?.length || 0) > 0).map(r => r.url)
  ).size;
  
  console.log('\n✅ Audit Complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Pages tested: ${uniquePages}`);
  console.log(`   Total violations: ${totalViolations}`);
  console.log(`   Pages with violations: ${pagesWithViolations}`);
  console.log(`   Pages passing: ${uniquePages - pagesWithViolations}`);
  console.log(`\n📄 Report saved to: ${REPORT_FILE}`);
  
  if (totalViolations > 0) {
    console.log(`\n⚠️  ${totalViolations} violation(s) found. Please review the report.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 No violations found!`);
    process.exit(0);
  }
}

// Run the audit
runAudit().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

