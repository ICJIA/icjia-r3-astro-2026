#!/usr/bin/env bash
# astro/scripts/check-all.sh — single-command pre-push verification.
#
# Runs the full local gate: type/content-schema check, unit tests, production
# build, and the Playwright e2e suite across all three viewport projects.
# Invoke from anywhere — it cd's to the astro/ project root itself.
set -euo pipefail

cd "$(dirname "$0")/.."

# NOTE: `yarn run check`, not `yarn check`. Yarn 1 shadows the bare `yarn
# check` form with its own lockfile-integrity command (see MIGRATION.md
# "Tooling gotchas"), so the project's `check` script must be run explicitly.
echo "→ astro check (TypeScript + content schema)"
yarn run check

echo "→ vitest unit tests"
yarn run test

echo "→ astro build"
yarn run build

echo "→ playwright e2e (mobile/tablet/desktop projects)"
yarn run test:e2e

echo "✓ all checks passed"
