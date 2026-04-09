#!/usr/bin/env node

const base = process.argv[2] || 'http://localhost:3000';
const ua =
  process.argv[3] ||
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const paths = [
  '/audio/gpm_intro.m4a',
  '/audio/lcf_intro.m4a',
  '/audio/mc_bot_intro.m4a',
  '/audio/pixie_intro.m4a',
  '/demo1.mp3',
  '/assets/fly-again.mp3',
  '/pix/i-need-an-angel.mp3',
  '/pix/kleigh--reflections.mp3',
  '/mkut/swift1',
  '/heroes',
  '/singalongs',
  '/mip',
];

const expectedByExt = {
  '.m4a': 'audio/',
  '.mp3': 'audio/',
};

const fail = [];

for (const p of paths) {
  const url = `${base}${p}`;
  try {
    const res = await fetch(url, { headers: { 'user-agent': ua } });
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    const ar = (res.headers.get('accept-ranges') || '').toLowerCase();

    const ext = p.endsWith('.m4a') ? '.m4a' : p.endsWith('.mp3') ? '.mp3' : '';
    const expectedCT = ext ? expectedByExt[ext] : 'text/html';

    const okStatus = res.status === 200;
    const okType = expectedCT ? ct.includes(expectedCT) : true;
    const okRanges = ext ? (ar.includes('bytes') || ar === '') : true;

    const ok = okStatus && okType && okRanges;

    console.log(`${ok ? 'PASS' : 'FAIL'} | ${res.status} | ${ct || 'unknown'} | ${ar || 'no-accept-ranges'} | ${url}`);

    if (!ok) {
      fail.push({ url, status: res.status, contentType: ct, acceptRanges: ar });
    }
  } catch (e) {
    console.log(`FAIL | ERR | unknown | unknown | ${url}`);
    fail.push({ url, error: e instanceof Error ? e.message : String(e) });
  }
}

if (fail.length > 0) {
  console.error(`\nAudio smoke failures: ${fail.length}`);
  process.exit(1);
}

console.log('\nAudio smoke passed.');
