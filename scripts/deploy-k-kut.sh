#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DIR="$ROOT_DIR/sites/k-kut"
EXPECTED_PROJECT="k-kut"
EXPECTED_SCOPE="g-putnam-music"
EXPECTED_ORG_ID="team_bBJGRYwSfgCofpxFKDF0uivc"
EXPECTED_PROJECT_ID="prj_894MRBYqJEhFRqHWp6jeogGcttmG"
EXPECTED_DOMAIN="k-kut.com"
REQUIRED_CONFIRM="k-kut.com"

if [[ "${DEPLOY_CONFIRM:-}" != "$REQUIRED_CONFIRM" ]]; then
  echo "[deploy-k-kut] Refusing deploy: set DEPLOY_CONFIRM=$REQUIRED_CONFIRM"
  exit 1
fi

echo "[deploy-k-kut] Using pinned project IDs for $EXPECTED_SCOPE/$EXPECTED_PROJECT"

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "[deploy-k-kut] Missing project directory: $PROJECT_DIR"
  exit 1
fi

echo "[deploy-k-kut] Deploying production"
# IMPORTANT: k-kut Vercel project uses Root Directory=sites/k-kut, so deploy from repo root.
cd "$ROOT_DIR"
mkdir -p .npm-cache
export VERCEL_PROJECT_ID="$EXPECTED_PROJECT_ID"
export VERCEL_ORG_ID="$EXPECTED_ORG_ID"
NPM_CONFIG_CACHE="$PWD/.npm-cache" vercel --prod --yes --scope "$EXPECTED_SCOPE"

echo "[deploy-k-kut] Verifying $EXPECTED_DOMAIN points to project $EXPECTED_PROJECT"
INSPECT_OUTPUT="$(vercel inspect "$EXPECTED_DOMAIN" --no-color 2>&1)"
if ! printf '%s' "$INSPECT_OUTPUT" | rg -q "name\s+$EXPECTED_PROJECT"; then
  echo "[deploy-k-kut] Verification failed: $EXPECTED_DOMAIN is not pointing to $EXPECTED_PROJECT"
  echo "$INSPECT_OUTPUT"
  exit 1
fi

echo "[deploy-k-kut] Done"
