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
  const brandParam   = searchParams.get('brand') ?? '';
  const [selectedBrand, setSelectedBrand] = useState(brandParam.toLowerCase());
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const creator = getCreatorBySlug(selectedBrand);

  async function handleEnroll() {
    if (!creator) { setMessage('Select a valid creator brand first.'); setStatus('error'); return; }
    setStatus('loading');
    setMessage('Requesting enrollment options…');
    try {
      const optRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'options' }),
      });
      if (!optRes.ok) { const e = await optRes.json(); throw new Error(e.error ?? 'Failed to get options'); }
      const options = await optRes.json();
      setMessage('Please complete biometric verification…');
      const credential = await startRegistration({ optionsJSON: options });
      setMessage('Verifying with server…');
      const verRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'verify', credential }),
      });
      if (!verRes.ok) { const e = await verRes.json(); throw new Error(e.error ?? 'Verification failed'); }
      setStatus('success');
      setMessage(`✅ ${creator.displayName} enrolled! They can now log in at /creator/${creator.portalSlug}`);
    } catch (err: unknown) {
      setStatus('error');
      setMessage(`❌ Enrollment failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-widest mb-1">GPM <span className="text-[#FFD54F]">4PE-MSC</span></h1>
        <p className="text-white/50 text-sm">Creator Portal — Biometric Enrollment</p>
      </div>

      {/* PIXIE-BOT enrollment guide */}
      {(selectedBrand === 'pixie' || selectedBrand === '') && (
        <div className="mb-6 rounded-2xl p-4 bg-[#a8cc7f]/5 border border-[#a8cc7f]/20">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#a8cc7f]">🤖 PIXIE-BOT · Enrollment Steps</p>
          <ol className="space-y-2 text-xs text-white/60">
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">①</span>
              <span>Select <strong className="text-white/80">PIXIE</strong> from the dropdown below.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">②</span>
              <span>Make sure <strong className="text-white/80">Jane (PIXIE)</strong> is holding this device.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">③</span>
              <span>Tap <strong className="text-white/80">Enroll PIXIE</strong> and follow the Face ID / Touch ID prompt.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FFD54F] font-bold shrink-0">④</span>
              <span>Done! Send PIXIE her portal link:{' '}
                <code className="text-[#FFD54F] text-[0.7rem]">gputnammusic.com/creator/pixie</code>
              </span>
            </li>
          </ol>
        </div>
      )}

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
        <Link href="/" className="text-white/20 text-xs hover:text-white/40">← Back to Flagship</Link>
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
