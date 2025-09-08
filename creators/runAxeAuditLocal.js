const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const routesFile = path.join(__dirname, "..", "public", "appRoutes.json");
const outDir = path.join("public", "a11y");

if (!fs.existsSync(path.join(__dirname, "..", outDir))) {
  fs.mkdirSync(path.join(__dirname, "..", outDir), { recursive: true });
}

const routes = JSON.parse(fs.readFileSync(routesFile, "utf8"));

console.log(`Running local axe on ${routes.length} routes...`);

for (const route of routes) {
  try {
    const url = `http://localhost:8000${route}`;
    const filename = `axe-local-${route.replace(/\//g, "-").replace(/^-/, "") || "home"}.json`;
    const out = path.join(outDir, filename);
    console.log(`→ Auditing ${url}`);
    execSync(`npx -y @axe-core/cli ${url} --save ${out}`, { stdio: "inherit" });
  } catch (e) {
    console.warn(`⚠️  Axe failed for route ${route}: ${e.message}`);
  }
}

console.log("Axe local audits complete. Aggregating...");
execSync("node creators/aggregateAxeResults.js", { stdio: "inherit" });
console.log("Done. Summary at public/a11y/axe-summary.json");

