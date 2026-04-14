#!/usr/bin/env bash
set -euo pipefail

SCOPE="${VERCEL_SCOPE:-g-putnam-music}"
PROJECT="${VERCEL_PROJECT:-gputnam-music-final-site}"
ENV_FILE="/tmp/creator-auth-check-preview.env"

cleanup() {
  rm -f "$ENV_FILE"
}
trap cleanup EXIT

vercel link --yes --scope "$SCOPE" --project "$PROJECT" >/tmp/creator_vercel_link_preview.log 2>&1
vercel env pull "$ENV_FILE" --environment=preview --scope "$SCOPE" >/tmp/creator_env_pull_preview.log 2>&1
node scripts/validate-creator-credentials-env.mjs "$ENV_FILE" preview
