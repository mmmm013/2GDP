#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_PROJECT="gputnam-music-final-site"
EXPECTED_SCOPE="g-putnam-music"
EXPECTED_ORG_ID="team_bBJGRYwSfgCofpxFKDF0uivc"
EXPECTED_PROJECT_ID="prj_iQSGO9eMw9gJg5XWhELH3tkHiqG1"
EXPECTED_DOMAIN="gputnammusic.com"
REQUIRED_CONFIRM="gputnammusic.com"

if [[ "${DEPLOY_CONFIRM:-}" != "$REQUIRED_CONFIRM" ]]; then
	echo "[deploy-flagship] Refusing deploy: set DEPLOY_CONFIRM=$REQUIRED_CONFIRM"
	exit 1
fi

cd "$ROOT_DIR"

echo "[deploy-flagship] Using pinned project IDs for $EXPECTED_SCOPE/$EXPECTED_PROJECT"

echo "[deploy-flagship] Deploying production"
mkdir -p .npm-cache
export VERCEL_PROJECT_ID="$EXPECTED_PROJECT_ID"
export VERCEL_ORG_ID="$EXPECTED_ORG_ID"
NPM_CONFIG_CACHE="$PWD/.npm-cache" vercel --prod --yes --scope "$EXPECTED_SCOPE"

echo "[deploy-flagship] Verifying $EXPECTED_DOMAIN points to project $EXPECTED_PROJECT"
INSPECT_OUTPUT="$(vercel inspect "$EXPECTED_DOMAIN" --no-color 2>&1)"
if ! printf '%s' "$INSPECT_OUTPUT" | rg -q "name\s+$EXPECTED_PROJECT"; then
	echo "[deploy-flagship] Verification failed: $EXPECTED_DOMAIN is not pointing to $EXPECTED_PROJECT"
	echo "$INSPECT_OUTPUT"
	exit 1
fi

echo "[deploy-flagship] Done"
