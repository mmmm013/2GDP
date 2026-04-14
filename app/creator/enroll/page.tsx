'use client';

/**
 * /creator/enroll
 *
 * Biometric first-visit enrollment flow.
 * Admin visits /creator/enroll?brand=KLEIGH with the creator present.
 * WebAuthn (Face ID / Touch ID) registers the device credential.
 * After enrollment, one biometric tap → full portal access.
 */

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { startRegistration } from '@simplewebauthn/browser';
import { CREATORS, getCreatorBySlug } from '@/config/creators';
import Link from 'next/link';

function CreatorEnrollForm() {
  const searchParams = useSearchParams();
  const brandParam   = (searchParams.get('brand') ?? '').toLowerCase();
  // selfService = link was sent directly to the creator (brand pre-set in URL)
  const selfService  = brandParam !== '';
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const creator = getCreatorBySlug(selectedBrand);

  async function handleEnroll() {
    if (!creator) { setMessage('Select a valid creator brand first.'); setStatus('error'); return; }
    setStatus('loading');
    setMessage('Starting biometric enrollment…');
    try {
      const optRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'options' }),
      });
      if (!optRes.ok) { const e = await optRes.json(); throw new Error(e.error ?? 'Failed to get options'); }
      const options = await optRes.json();
      setMessage('👆 Follow the Face ID / Touch ID prompt…');
      const credential = await startRegistration({ optionsJSON: options });
      setMessage('Verifying with server…');
      const verRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'verify', credential }),
      });
      if (!verRes.ok) { const e = await verRes.json(); throw new Error(e.error ?? 'Verification failed'); }
      setStatus('success');
      setMessage(`✅ You're enrolled, ${creator.displayName}! Tap below to open your portal.`);
    } catch (err: unknown) {
      setStatus('error');
      setMessage(`❌ Enrollment failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // ── Self-service mode (brand pre-set in URL — link was sent directly to the creator)
  if (selfService && creator) {
    return (
      <div className="w-full max-w-md text-center">
        <p className="text-xs uppercase tracking-widest mb-2 text-[#a8cc7f]">GPM Creator Portal</p>
        <h1 className="text-3xl font-bold mb-1 text-[#FFD54F]">{creator.displayName}</h1>
        <p className="text-xs mb-6 text-white/35">{creator.legalName} · {creator.role}</p>

        {/* PIXIE-BOT self-enrollment guide */}
        <div className="mb-6 rounded-2xl p-4 text-left bg-[#a8cc7f]/5 border border-[#a8cc7f]/20">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#a8cc7f]">
            🤖 PIXIE-BOT · Set Up Your Access
          </p>
          <ol className="space-y-3 text-xs text-white/65">
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">①</span>
              <span>You received this link — <strong className="text-white/90">you&apos;re already in the right place!</strong> This device will be your key.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">②</span>
              <span>Tap <strong className="text-white/90">Set Up My Access</strong> below.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">③</span>
              <span>Your phone will ask for <strong className="text-white/90">Face ID or Touch ID</strong> — approve it.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">④</span>
              <span>Done! Your portal opens automatically. Next time just visit{' '}
                <code className="text-[#FFD54F] text-[0.7rem]">gputnammusic.com/creator/{creator.portalSlug}</code>
                {' '}and tap the button.
              </span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-white/30">
            No password. No app to install. Just your face or fingerprint. 🌿
          </p>
        </div>

        {status !== 'success' && (
          <button
            onClick={handleEnroll}
            disabled={status === 'loading'}
            className="w-full py-4 rounded-2xl font-bold tracking-widest text-base transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: status === 'loading' ? 'rgba(255,213,79,0.5)' : '#FFD54F', color: '#000' }}
          >
            {status === 'loading' ? '⏳ Setting up…' : '🌿 Set Up My Access'}
          </button>
        )}

        {message && (
          <div className={`mb-4 rounded-xl p-4 text-sm ${
            status === 'success' ? 'bg-green-900/40 text-green-300 border border-green-700/40' :
            status === 'error'   ? 'bg-red-900/40 text-red-300 border border-red-700/40' :
            'bg-white/5 text-white/60'
          }`}>{message}</div>
        )}

        {status === 'success' && (
          <Link
            href={`/creator/${creator.portalSlug}`}
            className="block w-full py-4 rounded-2xl font-bold tracking-widest text-base text-center text-black"
            style={{ background: '#a8cc7f' }}
          >
            🌿 Open {creator.displayName}&apos;s Portal →
          </Link>
        )}

        {status === 'error' && (
          <p className="mt-2 text-xs text-white/30">
            Having trouble? Make sure you&apos;re using Safari (iOS) or Chrome (Android) and try again.
          </p>
        )}

        <div className="mt-8">
          <Link href="/flagship.go" className="text-white/20 text-xs hover:text-white/40">← Back to Flagship</Link>
        </div>
      </div>
    );
  }

  // ── Admin mode (no brand in URL — admin selecting creator to enroll in-person)
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-widest mb-1">GPM <span className="text-[#FFD54F]">4PE-MSC</span></h1>
        <p className="text-white/50 text-sm">Creator Portal — Admin Enrollment</p>
      </div>

      <div className="mb-4 rounded-xl p-3 text-xs bg-[#FFD54F]/5 border border-[#FFD54F]/15 text-white/50">
        💡 <strong className="text-white/70">Better:</strong> Send the creator their direct enrollment link instead!
        e.g. <code className="text-[#FFD54F]">gputnammusic.com/creator/enroll?brand=PIXIE</code> — they self-enroll on their own device.
      </div>

      <div className="mb-6">
        <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Creator Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD54F]/50"
        >
          <option value="">— Select Creator —</option>
          {CREATORS.map((c) => (
            <option key={c.id} value={c.portalSlug}>{c.displayName} ({c.brand}) — {c.role}</option>
          ))}
        </select>
      </div>

      {creator && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-[#FFD54F] font-bold text-lg">{creator.displayName}</p>
          <p className="text-white/60 text-sm">{creator.legalName}</p>
          <p className="text-white/40 text-xs mt-1">{creator.role}</p>
          <p className="text-white/30 text-xs mt-2">Scopes: {creator.scope.join(' · ')}</p>
          <p className="mt-3 text-xs text-[#a8cc7f]/80">
            📋 Or send this link directly to {creator.displayName} →
            <code className="text-[#FFD54F] text-[0.65rem] block mt-1 break-all">
              gputnammusic.com/creator/enroll?brand={creator.brand}
            </code>
          </p>
        </div>
      )}

      <div className="mb-6 text-sm text-white/40 leading-relaxed">
        <p>Have the creator present their device. Click <strong className="text-white/70">Enroll</strong> and follow the Face ID / Touch ID prompt.</p>
        <p className="mt-2">Once enrolled, they access their portal at <code className="text-[#FFD54F]">/creator/{selectedBrand || '[brand]'}</code> with a single biometric tap.</p>
      </div>

      <button
        onClick={handleEnroll}
        disabled={!creator || status === 'loading'}
        className="w-full py-3 rounded-xl font-bold tracking-widest text-sm transition-all bg-[#FFD54F] text-black hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Enrolling…' : `Enroll ${creator?.displayName ?? 'Creator'}`}
      </button>

      {message && (
        <div className={`mt-4 rounded-xl p-4 text-sm ${
          status === 'success' ? 'bg-green-900/40 text-green-300 border border-green-700/40' :
          status === 'error'   ? 'bg-red-900/40 text-red-300 border border-red-700/40' :
          'bg-white/5 text-white/60'
        }`}>{message}</div>
      )}

      {status === 'success' && creator && (
        <Link href={`/creator/${creator.portalSlug}`} className="mt-4 block text-center text-[#FFD54F] text-sm hover:underline">
          → Open {creator.displayName}&apos;s Portal
        </Link>
      )}

      <div className="mt-8 text-center">
        <Link href="/flagship.go" className="text-white/20 text-xs hover:text-white/40">← Back to Flagship</Link>
      </div>
    </div>
  );
}

export default function CreatorEnrollPage() {
  return (
    <main className="min-h-screen bg-[#1a1207] text-white flex flex-col items-center justify-center p-6">
      <Suspense fallback={<div className="text-white/40 text-sm">Loading…</div>}>
        <CreatorEnrollForm />
      </Suspense>
    </main>
  );
}
