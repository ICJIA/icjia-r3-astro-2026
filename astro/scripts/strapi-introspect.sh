#!/usr/bin/env bash
set -euo pipefail
ENDPOINT="${1:-https://r3.icjia-api.cloud/graphql}"
QUERY="${2:?usage: strapi-introspect.sh <endpoint> <query>}"
curl -s "$ENDPOINT" \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg q "$QUERY" '{query: $q}')" \
  | python3 -m json.tool || cat
