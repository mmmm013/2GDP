#!/usr/bin/env node
/**
 * validate-k-kut-root.js
 *
 * Guardrail script for the k-kut Vercel deployment.
 *
 * Purpose: Fail fast if Vercel is building the k-kut project from the wrong
 * directory (i.e. the monorepo root instead of sites/k-kut).
 *
 * Wire-up: called by the `prebuild` script in sites/k-kut/package.json.
 *
 * How it works:
 *   1. When running on Vercel (process.env.VERCEL === '1'), the working
 *      directory should be sites/k-kut.  We verify this by checking that
 *      package.json in the current directory has name === "k-kut-site".
 *   2. If the check fails, the build exits with a clear error message so the
 *      operator knows exactly what to fix (set Root Directory = sites/k-kut).
 *   3. Outside of Vercel (local dev), the check is informational only and
 *      never blocks the build.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ON_VERCEL = process.env.VERCEL === '1';
const EXPECTED_PKG_NAME = 'k-kut-site';

function fail(message) {
  console.error('');
  console.error('╔══════════════════════════════════════════════════════════════╗');
  console.error('║  K-KUT BUILD GUARDRAIL — ROOT DIRECTORY MISMATCH            ║');
  console.error('╠══════════════════════════════════════════════════════════════╣');
  console.error('║  ' + message.padEnd(62) + '║');
  console.error('╠══════════════════════════════════════════════════════════════╣');
  console.error('║  Fix: In Vercel → k-kut → Settings → General,               ║');
  console.error('║       set Root Directory to:  sites/k-kut                   ║');
  console.error('║  Then redeploy.                                              ║');
  console.error('╚══════════════════════════════════════════════════════════════╝');
  console.error('');
  process.exit(1);
}

function check() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');

  if (!fs.existsSync(pkgPath)) {
    if (ON_VERCEL) {
      fail('No package.json found in current directory: ' + process.cwd());
    }
    // Not on Vercel — soft warning only
    console.warn('[k-kut] Warning: no package.json found in ' + process.cwd());
    return;
  }

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (e) {
    if (ON_VERCEL) {
      fail('Could not parse package.json: ' + e.message);
    }
    return;
  }

  if (pkg.name !== EXPECTED_PKG_NAME) {
    const msg = 'Expected package name "' + EXPECTED_PKG_NAME + '", got "' + pkg.name + '"';
    if (ON_VERCEL) {
      fail(msg);
    } else {
      console.warn('[k-kut] Warning: ' + msg);
      console.warn('[k-kut] On Vercel this would be a hard build failure.');
    }
    return;
  }

  // All good
  console.log('[k-kut] Root directory check passed (package: ' + pkg.name + ')');
}

check();
