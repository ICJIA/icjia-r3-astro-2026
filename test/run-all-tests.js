#!/usr/bin/env node
/**
 * Runs Vitest and outputs results to console only.
 * No HTML report generation.
 */

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

function runVitest() {
  return new Promise((resolve) => {
    const args = ["vitest", "run", "--reporter=verbose"];
    const proc = spawn("npx", args, {
      cwd: projectRoot,
      shell: true,
      env: { ...process.env, FORCE_COLOR: "1" },
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
      resolve({
        passed: code === 0,
        exitCode: code,
        output: stdout + stderr,
      });
    });
  });
}

async function main() {
  console.log("🧪 Running tests (Vitest)...\n");
  const testResults = await runVitest();
  process.exit(testResults.passed ? 0 : 1);
}

main();
