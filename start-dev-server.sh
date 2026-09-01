#!/usr/bin/env bash
# start-dev-server.sh — one-command boot for the R3 Astro dev server.
#
# Local dev uses pnpm by preference. Netlify still builds with yarn (see
# netlify.toml) — that's intentional; this script only touches the local dev
# loop.
#
# Every start runs ./nuke first, so dev always boots against freshly generated
# caches. This is close to free: measured 1897ms to "ready" after a full nuke
# vs 1983ms warm, because Astro re-syncs content from Strapi and the Hub on
# every dev start anyway and Vite rebuilds its dep-optimization cache lazily.
# What it buys is that a stale node_modules/.vite can never survive into a new
# session — that cache is keyed by a browserHash, and when it no longer matches
# what the browser asks for, Vite answers module requests with
# "504 (Outdated Optimize Dep)". Client islands then fail to hydrate: the
# search page gets stuck on "Loading search index" with nothing but a console
# error to explain it.
#
# NOTE this does not make that failure impossible. If Vite re-optimizes *while*
# the server is running — which it does when something changes its config under
# it, e.g. running `pnpm check`, `pnpm build`, or the e2e suite against a live
# dev server — tabs opened before the change still hold the old hash and will
# hit the same 504. The fix there is a browser hard-reload, or restart this
# script.
#
# Usage:
#   ./start-dev-server.sh                     # nuke caches, then `pnpm dev`
#   ./start-dev-server.sh --no-clean          # skip the nuke, boot as-is
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

# Split our own flags from the ones destined for `astro dev`. `--` is accepted
# as a no-op separator for backwards compatibility with the old usage.
CLEAN=1
DEV_ARGS=()
for arg in "$@"; do
  case "$arg" in
    --no-clean) CLEAN=0 ;;
    --)         ;;
    *)          DEV_ARGS+=("$arg") ;;
  esac
done

cd "${ASTRO_DIR}"

# Install only when something looks missing or stale; pnpm install is a no-op
# when the lockfile and node_modules already agree.
if [ ! -d node_modules ] || [ ! -f pnpm-lock.yaml ]; then
  echo "→ pnpm install (first run or no pnpm-lock.yaml yet)"
  pnpm install
fi

# Clean after install, so node_modules/.vite exists to be removed on a rerun.
if [ "${CLEAN}" -eq 1 ]; then
  if [ -x "${REPO_ROOT}/nuke" ]; then
    echo "→ ./nuke (pass --no-clean to skip)"
    "${REPO_ROOT}/nuke"
  else
    echo "⚠ ${REPO_ROOT}/nuke missing or not executable — starting without a clean" >&2
  fi
fi

# `${DEV_ARGS[@]+...}` guards the expansion: under `set -u`, bash 3.2 (still
# the stock /bin/bash on macOS) treats an empty array as an unbound variable.
echo "→ pnpm dev${DEV_ARGS[0]+ }${DEV_ARGS[*]-}"
exec pnpm dev ${DEV_ARGS[@]+"${DEV_ARGS[@]}"}
