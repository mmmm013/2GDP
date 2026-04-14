#!/usr/bin/env bash
set -euo pipefail

SCOPE="${VERCEL_SCOPE:-g-putnam-music}"
PROJECT="${VERCEL_PROJECT:-gputnam-music-final-site}"
ENV_FILE="/tmp/creator-auth-check.env"

cleanup() {
  rm -f "$ENV_FILE"
}
trap cleanup EXIT

vercel link --yes --scope "$SCOPE" --project "$PROJECT" >/tmp/creator_vercel_link.log 2>&1
vercel env pull "$ENV_FILE" --environment=production --scope "$SCOPE" >/tmp/creator_env_pull.log 2>&1
node scripts/validate-creator-auth-production.mjs "$ENV_FILE"
