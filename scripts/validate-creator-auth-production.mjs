import fs from 'node:fs';

const TARGET = 'https://www.gputnammusic.com/api/creator/password-auth';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

const BRANDS = [
  ['kleigh', 'KLEIGH'],
  ['msj', 'MSJ'],
  ['zg', 'ZG'],
  ['lgm', 'LGM'],
  ['pixie', 'PIXIE'],
];

function readCredentialJsonFromEnvFile(envFilePath) {
  const file = fs.readFileSync(envFilePath, 'utf8');
  const line = file
    .split('\n')
    .find((item) => item.startsWith('CREATOR_PASSWORD_CREDENTIALS='));

  if (!line) {
    throw new Error('CREATOR_PASSWORD_CREDENTIALS not found in pulled env file');
  }

  const rawValue = line.slice('CREATOR_PASSWORD_CREDENTIALS='.length).trim();
  if (!rawValue) {
    throw new Error('CREATOR_PASSWORD_CREDENTIALS is empty in pulled env file');
  }

  // Vercel env pull wraps JSON in outer quotes without escaping inner JSON quotes.
  if (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2) {
    return rawValue.slice(1, -1);
  }

  return rawValue;
}

function sanitizeResponseBody(text) {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify({
      ok: parsed.ok,
      brand: parsed.brand,
      displayName: parsed.displayName,
      error: parsed.error,
    });
  } catch {
    return text;
  }
}

async function run() {
  const envFilePath = process.argv[2] || '/tmp/creator-auth-check.env';
  const raw = readCredentialJsonFromEnvFile(envFilePath);

  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error('CREATOR_PASSWORD_CREDENTIALS is not valid JSON');
  }

  const rows = [];
  for (const [slug, key] of BRANDS) {
    const cred = credentials[key];
    if (!cred?.userId || !cred?.password) {
      rows.push({ brand: slug, status: 0, body: 'missing credential in env JSON' });
      continue;
    }

    const response = await fetch(TARGET, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': USER_AGENT,
      },
      body: JSON.stringify({
        brand: slug,
        userId: cred.userId,
        password: cred.password,
      }),
    });

    const text = await response.text();
    rows.push({
      brand: slug,
      status: response.status,
      body: sanitizeResponseBody(text),
    });
  }

  const allOk = rows.every((row) => row.status === 200);
  const timestamp = new Date().toISOString();

  const outputLines = [
    '# Creator Auth Validation Log',
    '',
    `- Timestamp: ${timestamp}`,
    `- Target: ${TARGET}`,
    '- Source of credentials: Vercel Production `CREATOR_PASSWORD_CREDENTIALS`',
    `- Result: ${allOk ? 'PASS' : 'FAIL'}`,
    '',
    '| Brand | HTTP | Response |',
    '|---|---:|---|',
    ...rows.map((row) => {
      const body = String(row.body).replace(/\|/g, '\\|');
      return `| ${row.brand} | ${row.status} | ${body} |`;
    }),
    '',
    'No credential values are stored in this log.',
  ];

  fs.mkdirSync('handoff', { recursive: true });
  const reportPath = 'handoff/creator-auth-validation-2026-04-14.md';
  fs.writeFileSync(reportPath, `${outputLines.join('\n')}\n`, 'utf8');

  for (const row of rows) {
    console.log(`${row.brand}\t${row.status}`);
  }
  console.log(`log\t${reportPath}`);
  console.log(`overall\t${allOk ? 'PASS' : 'FAIL'}`);

  if (!allOk) {
    process.exitCode = 2;
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
