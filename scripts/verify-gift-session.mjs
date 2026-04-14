#!/usr/bin/env node

const sessionId = process.argv[2];
const baseUrl = (process.argv[3] || 'https://www.gputnammusic.com').replace(/\/$/, '');
const ua =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

if (!sessionId) {
  console.error('Usage: node scripts/verify-gift-session.mjs <session_id> [base_url]');
  process.exit(1);
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': ua } });
  const text = await res.text();

  try {
    return { res, data: JSON.parse(text) };
  } catch {
    return { res, data: { raw: text } };
  }
}

async function getPage(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': ua },
    redirect: 'follow',
  });
  const html = await res.text();
  return { res, html };
}

function printResult(label, value) {
  console.log(`${label}: ${value}`);
}

try {
  const statusUrl = `${baseUrl}/api/gift/session-status?session_id=${encodeURIComponent(sessionId)}`;
  const successUrl = `${baseUrl}/gift/success?session_id=${encodeURIComponent(sessionId)}`;

  const [{ res: statusRes, data: statusData }, { res: successRes, html: successHtml }] = await Promise.all([
    getJson(statusUrl),
    getPage(successUrl),
  ]);

  printResult('Base URL', baseUrl);
  printResult('Session ID', sessionId);
  printResult('Success Page HTTP', successRes.status);
  printResult(
    'Success Page Shell',
    successRes.status === 200 || successHtml.includes('Payment Confirmed') || successHtml.includes('animate-bounce')
      ? 'OK'
      : 'Unexpected'
  );
  printResult('Session Status HTTP', statusRes.status);

  if (statusRes.status === 200) {
    printResult('Payment State', 'PAID');
    printResult('Tier', statusData.tier ?? 'unknown');
    printResult('Donor Name', statusData.donorName ?? 'none');
    printResult('Donor Email', statusData.donorEmail ?? 'none');
    printResult('Grand Prize Eligible', String(Boolean(statusData.grandPrizeEligible)));
    console.log('\nVerification passed: payment is complete and the public success flow is live.');
    process.exit(0);
  }

  if (statusRes.status === 402) {
    printResult('Payment State', 'NOT_COMPLETED');
    printResult('API Message', statusData.error ?? 'Payment not completed');
    console.log('\nVerification incomplete: checkout session exists, but payment is not completed yet.');
    process.exit(2);
  }

  printResult('Payment State', 'ERROR');
  printResult('API Message', statusData.error ?? statusData.raw ?? 'Unknown error');
  console.log('\nVerification failed: could not confirm a completed paid session.');
  process.exit(3);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Verification error: ${message}`);
  process.exit(4);
}