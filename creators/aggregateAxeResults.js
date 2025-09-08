const fs = require("fs");
const path = require("path");

/**
 * Aggregates individual axe-core JSON reports into a single summary file.
 * Supports @axe-core/cli reporter v1 output (array) and object output.
 */

const a11yDir = path.join(__dirname, "..", "public", "a11y");
const outputFile = path.join(a11yDir, "axe-summary.json");

// Discover all axe-*.json files in public/a11y to aggregate everything
const reportFiles = fs
  .readdirSync(a11yDir)
  .filter((f) => /^axe-.*\.json$/i.test(f));

const aggregatedResults = {
  timestamp: new Date().toISOString(),
  summary: {
    totalPages: 0,
    totalViolations: 0,
    totalPasses: 0,
    totalIncomplete: 0,
    totalInapplicable: 0,
  },
  pages: [],
  violationsByRule: {},
  allViolations: [],
};

console.log("🔍 Aggregating axe-core accessibility reports...");

for (const filename of reportFiles) {
  const filePath = path.join(a11yDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Report file not found: ${filename}`);
    continue;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);

    // Handle reporter v1 (array of results) or object
    const report = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!report) {
      console.warn(`⚠️  Empty or unrecognized report structure: ${filename}`);
      continue;
    }

    const pageUrl = report.url || filename.replace(".json", "");

    const violations = Array.isArray(report.violations)
      ? report.violations
      : [];
    const passes = Array.isArray(report.passes) ? report.passes : [];
    const incomplete = Array.isArray(report.incomplete)
      ? report.incomplete
      : [];
    const inapplicable = Array.isArray(report.inapplicable)
      ? report.inapplicable
      : [];

    const pageSummary = {
      url: pageUrl,
      filename,
      violations: violations.length,
      passes: passes.length,
      incomplete: incomplete.length,
      inapplicable: inapplicable.length,
      violationRules: violations.map((v) => v.id),
    };

    aggregatedResults.pages.push(pageSummary);

    aggregatedResults.summary.totalPages += 1;
    aggregatedResults.summary.totalViolations += pageSummary.violations;
    aggregatedResults.summary.totalPasses += pageSummary.passes;
    aggregatedResults.summary.totalIncomplete += pageSummary.incomplete;
    aggregatedResults.summary.totalInapplicable += pageSummary.inapplicable;

    // Aggregate violations by rule
    for (const violation of violations) {
      const bucket =
        aggregatedResults.violationsByRule[violation.id] ||
        (aggregatedResults.violationsByRule[violation.id] = {
          id: violation.id,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          impact: violation.impact,
          tags: violation.tags,
          occurrences: 0,
          pages: [],
        });

      const nodeCount = Array.isArray(violation.nodes)
        ? violation.nodes.length
        : 1;
      bucket.occurrences += nodeCount;
      bucket.pages.push({
        url: pageUrl,
        nodeCount,
        targets: (violation.nodes || []).flatMap((n) => n.target || []),
      });

      // Add to flat list with context
      aggregatedResults.allViolations.push({
        ...violation,
        pageUrl,
        pageFilename: filename,
      });
    }

    console.log(
      `✅ Processed ${filename}: ${pageSummary.violations} violations`
    );
  } catch (err) {
    console.error(`❌ Error processing ${filename}: ${err.message}`);
  }
}

// Sort violations by impact and occurrence count
const impactOrder = { critical: 4, serious: 3, moderate: 2, minor: 1 };
aggregatedResults.allViolations.sort((a, b) => {
  const aImpact = impactOrder[a.impact] || 0;
  const bImpact = impactOrder[b.impact] || 0;
  if (aImpact !== bImpact) return bImpact - aImpact;
  return (b.nodes?.length || 1) - (a.nodes?.length || 1);
});

fs.writeFileSync(outputFile, JSON.stringify(aggregatedResults, null, 2));

console.log(`\n📊 Accessibility Audit Summary:`);
console.log(`   Total pages tested: ${aggregatedResults.summary.totalPages}`);
console.log(
  `   Total violations: ${aggregatedResults.summary.totalViolations}`
);
console.log(
  `   Unique violation rules: ${Object.keys(aggregatedResults.violationsByRule).length}`
);
console.log(`\n📄 Summary saved to: ${outputFile}`);

if (aggregatedResults.summary.totalViolations > 0) {
  console.log(`\n🔴 Top violations by impact:`);
  Object.values(aggregatedResults.violationsByRule)
    .sort((a, b) => (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0))
    .slice(0, 5)
    .forEach((rule) => {
      console.log(
        `   • ${rule.id} (${rule.impact || "n/a"}): ${rule.occurrences} occurrences across ${rule.pages.length} pages`
      );
    });
}
