/**
 * @fileoverview Node.js version checker script for the ICJIA R3 Nuxt 3 application.
 * This preflight script ensures the current Node.js runtime version is compatible
 * with the project requirements before running build or development commands.
 *
 * Why: Several dependencies (e.g. `uuid@11`) ship modern JS syntax that will
 * throw parse errors on older Node versions (e.g. `??=`).
 *
 * This script uses ESM syntax and requires Node 22+
 *
 * @requires module:fs - For reading .node-version file
 * @requires module:path - For path manipulation
 *
 * @since 1.0.0
 */

/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readFileTrim(filePath) {
  try {
    return String(fs.readFileSync(filePath, "utf8")).trim();
  } catch (e) {
    return "";
  }
}

function parseMajor(version) {
  // Accepts "v20.19.0" or "20.19.0"
  const v = String(version || "").replace(/^v/, "");
  const major = parseInt(v.split(".")[0], 10);
  return isFinite(major) ? major : 0;
}

function formatVersion(version) {
  if (!version) return "";
  return String(version).replace(/^v/, "");
}

const repoRoot = path.resolve(__dirname, "..");
const desiredNode = readFileTrim(path.join(repoRoot, ".node-version")); // e.g. "20.19.0"
const currentNode = process && process.versions ? process.versions.node : "";

const desiredMajor = parseMajor(desiredNode) || 20;
const currentMajor = parseMajor(currentNode);

if (currentMajor && currentMajor < desiredMajor) {
  console.error("");
  console.error("❌ Node.js version too old for this project.");
  console.error("");
  console.error("  Current Node:  " + formatVersion(currentNode));
  console.error(
    "  Required Node: >= " + (desiredNode || String(desiredMajor) + ".x"),
  );
  console.error("");
  console.error("Fix:");
  console.error(
    "  - If you use nvm/fnm/asdf: run `nvm use` (or equivalent) in this repo.",
  );
  console.error(
    "  - If you use mise: run `mise use -g node@" + (desiredNode || "20") + "`",
  );
  console.error("");
  console.error("Then re-run your command (e.g. `yarn dev`).");
  console.error("");
  process.exit(1);
}
