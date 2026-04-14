import fs from 'node:fs';

const REQUIRED_BRANDS = ['KLEIGH', 'MSJ', 'ZG', 'LGM', 'PIXIE'];

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

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function normalize(value) {
  return String(value ?? '').trim();
}

function uniqueDuplicates(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

function run() {
  const envFilePath = process.argv[2] || '/tmp/creator-auth-check.env';
  const envName = normalize(process.argv[3] || 'unknown').toLowerCase();

  const raw = readCredentialJsonFromEnvFile(envFilePath);

  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error('CREATOR_PASSWORD_CREDENTIALS is not valid JSON');
  }

  const errors = [];
  const warnings = [];
  const rows = [];

  for (const brand of REQUIRED_BRANDS) {
    const entry = credentials[brand];
    const userId = normalize(entry?.userId);
    const password = normalize(entry?.password);

    if (!entry) {
      errors.push(`Missing brand key: ${brand}`);
      rows.push({ brand, userId: 'missing', password: 'missing', status: 'FAIL' });
      continue;
    }

    if (!userId) {
      errors.push(`Missing userId for ${brand}`);
    }
    if (!password) {
      errors.push(`Missing password for ${brand}`);
    }

    rows.push({
      brand,
      userId: userId ? `${userId.length} chars` : 'missing',
      password: password ? `${password.length} chars` : 'missing',
      status: userId && password ? 'OK' : 'FAIL',
    });
  }

  const extras = Object.keys(credentials).filter((key) => !REQUIRED_BRANDS.includes(key));
  if (extras.length) {
    warnings.push(`Extra brand keys present: ${extras.join(', ')}`);
  }

  const userIds = REQUIRED_BRANDS.map((brand) => normalize(credentials[brand]?.userId)).filter(Boolean);
  const passwords = REQUIRED_BRANDS.map((brand) => normalize(credentials[brand]?.password)).filter(Boolean);

  const duplicateUserIds = uniqueDuplicates(userIds);
  const duplicatePasswords = uniqueDuplicates(passwords);

  if (duplicateUserIds.length) {
    errors.push(`Duplicate userIds detected (${duplicateUserIds.length})`);
  }
  if (duplicatePasswords.length) {
    errors.push(`Duplicate passwords detected (${duplicatePasswords.length})`);
  }

  const pass = errors.length === 0;
  const reportPath = `handoff/creator-credential-parity-${envName}-${todayStamp()}.md`;

  const lines = [
    '# Creator Credential Parity Check',
    '',
    `- Timestamp: ${new Date().toISOString()}`,
    `- Environment: ${envName}`,
    '- Variable: `CREATOR_PASSWORD_CREDENTIALS`',
    `- Result: ${pass ? 'PASS' : 'FAIL'}`,
    '',
    '| Brand | userId | password | status |',
    '|---|---:|---:|---|',
    ...rows.map((row) => `| ${row.brand} | ${row.userId} | ${row.password} | ${row.status} |`),
    '',
  ];

  if (warnings.length) {
    lines.push('## Warnings');
    for (const warning of warnings) lines.push(`- ${warning}`);
    lines.push('');
  }

  if (errors.length) {
    lines.push('## Errors');
    for (const error of errors) lines.push(`- ${error}`);
    lines.push('');
  }

  lines.push('No credential values are stored in this report.');

  fs.mkdirSync('handoff', { recursive: true });
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');

  console.log(`env\t${envName}`);
  console.log(`log\t${reportPath}`);
  console.log(`overall\t${pass ? 'PASS' : 'FAIL'}`);

  if (!pass) {
    process.exitCode = 2;
  }
}

try {
  run();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
