#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Disallow raw production deploy commands outside guarded scripts.
RAW_PROD_HITS="$(git grep -nE "vercel[[:space:]]+--prod" -- \
  package.json .github/workflows scripts \
  ':(exclude)scripts/deploy-flagship.sh' \
  ':(exclude)scripts/deploy-k-kut.sh' || true)"

if [[ -n "$RAW_PROD_HITS" ]]; then
  echo "[deploy-hygiene] Found unsafe raw production deploy usage:"
  echo "$RAW_PROD_HITS"
  echo "[deploy-hygiene] Use only: npm run deploy:flagship:prod or npm run deploy:kkut:prod"
  exit 1
fi

# Ensure guarded deploy scripts exist and are wired.
node -e '
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
const scripts = p.scripts || {};
if (!scripts["deploy:flagship:prod"] || !scripts["deploy:kkut:prod"]) {
  console.error("[deploy-hygiene] Missing guarded deploy scripts in package.json");
  process.exit(1);
}
'

echo "[deploy-hygiene] OK: no unsafe raw production deploy commands found."
