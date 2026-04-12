#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SEARCH_DIRS = ['app', 'components', 'lib'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const AUDIO_PATH_RE = /(?:src\s*=\s*|greetingAudio\s*:\s*|audioSrc\s*:\s*)['\"](\/(?:audio|pix|assets)[^'\"]+)['\"]/g;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'staging') continue;
      walk(full, out);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

const files = SEARCH_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const missing = [];
const found = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(AUDIO_PATH_RE)) {
    const rel = match[1];
    const diskPath = path.join(ROOT, 'public', rel.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      missing.push({ file: path.relative(ROOT, file), path: rel });
    } else {
      found.push(rel);
    }
  }
}

const uniqFound = [...new Set(found)].length;
console.log(`Checked ${files.length} source files.`);
console.log(`Verified ${uniqFound} unique public audio/media paths.`);

if (missing.length > 0) {
  console.error('\nMissing public assets:');
  for (const m of missing) {
    console.error(`- ${m.path} referenced in ${m.file}`);
  }
  process.exit(1);
}

console.log('All referenced /audio, /pix, and /assets media files exist.');
