/* eslint-disable no-console */
/**
 * Preflight: ensure the current Node.js runtime is compatible with this repo.
 *
 * Why: Several dependencies (e.g. `uuid@11`) ship modern JS syntax that will
 * throw parse errors on older Node versions (e.g. `??=`).
 *
 * This script intentionally uses very conservative JS syntax so it can run on
 * older Node versions and provide a helpful error message.
 */

var fs = require("fs");
var path = require("path");

function readFileTrim(filePath) {
  try {
    return String(fs.readFileSync(filePath, "utf8")).trim();
  } catch (e) {
    return "";
  }
}

function parseMajor(version) {
  // Accepts "v20.19.0" or "20.19.0"
  var v = String(version || "").replace(/^v/, "");
  var major = parseInt(v.split(".")[0], 10);
  return isFinite(major) ? major : 0;
}

function formatVersion(version) {
  if (!version) return "";
  return String(version).replace(/^v/, "");
}

var repoRoot = path.resolve(__dirname, "..");
var desiredNode = readFileTrim(path.join(repoRoot, ".node-version")); // e.g. "20.19.0"
var currentNode = process && process.versions ? process.versions.node : "";

var desiredMajor = parseMajor(desiredNode) || 20;
var currentMajor = parseMajor(currentNode);

if (currentMajor && currentMajor < desiredMajor) {
  console.error("");
  console.error("❌ Node.js version too old for this project.");
  console.error("");
  console.error("  Current Node:  " + formatVersion(currentNode));
  console.error("  Required Node: >= " + (desiredNode || String(desiredMajor) + ".x"));
  console.error("");
  console.error("Fix:");
  console.error("  - If you use nvm/fnm/asdf: run `nvm use` (or equivalent) in this repo.");
  console.error("  - If you use mise: run `mise use -g node@" + (desiredNode || "20") + "`");
  console.error("");
  console.error("Then re-run your command (e.g. `yarn dev`).");
  console.error("");
  process.exit(1);
}


