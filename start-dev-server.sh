#!/usr/bin/env bash
# start-dev-server.sh — one-command boot for the R3 Astro dev server.
#
# Local dev uses pnpm by preference. Netlify still builds with yarn (see
# netlify.toml) — that's intentional; this script only touches the local dev
# loop.
#
# Usage:
#   ./start-dev-server.sh          # installs deps if needed, then `pnpm dev`
#   ./start-dev-server.sh -- --host 0.0.0.0   # pass extra flags to astro dev

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASTRO_DIR="${REPO_ROOT}/astro"

if [ ! -d "${ASTRO_DIR}" ]; then
  echo "✗ astro/ subdir not found at ${ASTRO_DIR}" >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "✗ pnpm is not on PATH. Install with: npm install -g pnpm" >&2
  exit 1
fi

cd "${ASTRO_DIR}"

# Install only when something looks missing or stale; pnpm install is a no-op
# when the lockfile and node_modules already agree.
if [ ! -d node_modules ] || [ ! -f pnpm-lock.yaml ]; then
  echo "→ pnpm install (first run or no pnpm-lock.yaml yet)"
  pnpm install
fi

# Drop the leading `--` separator if the caller used it.
if [ "${1:-}" = "--" ]; then shift; fi

echo "→ pnpm dev${*:+ }${*:-}"
exec pnpm dev "$@"
