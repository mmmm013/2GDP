'use client';

/**
 * /creator/enroll
 *
 * Biometric first-visit enrollment flow.
 * Admin visits /creator/enroll?brand=KLEIGH with the creator present.
 * WebAuthn (Face ID / Touch ID) registers the device credential.
 * After enrollment, one biometric tap → full portal access.
 */

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  startRegistration,
} from '@simplewebauthn/browser';
import { CREATORS, getCreatorBySlug } from '@/config/creators';
import Link from 'next/link';

export default function CreatorEnrollPage() {
  const searchParams  = useSearchParams();
  const brandParam    = searchParams.get('brand') ?? '';
  const [selectedBrand, setSelectedBrand] = useState(brandParam.toLowerCase());
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const creator = getCreatorBySlug(selectedBrand);

  async function handleEnroll() {
    if (!creator) {
      setMessage('Select a valid creator brand first.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('Requesting enrollment options…');

    try {
      // Phase 1: get options from server
      const optRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'options' }),
      });

      if (!optRes.ok) {
        const err = await optRes.json();
        throw new Error(err.error ?? 'Failed to get registration options');
      }

      const options = await optRes.json();

      setMessage('Please complete biometric verification…');

      // Phase 2: prompt the authenticator
      const credential = await startRegistration({ optionsJSON: options });

      setMessage('Verifying with server…');

      // Phase 3: send credential back
      const verRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'verify', credential }),
      });

      if (!verRes.ok) {
        const err = await verRes.json();
        throw new Error(err.error ?? 'Verification failed');
      }

      setStatus('success');
      setMessage(`✅ ${creator.displayName} enrolled successfully! They can now log in at /creator/${creator.portalSlug}`);
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`❌ Enrollment failed: ${msg}`);
    }
  }

  return (
    <main className="min-h-screen bg-[#1a1207] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-widest mb-1">
            GPM <span className="text-[#FFD54F]">4PE-MSC</span>
          </h1>
          <p className="text-white/50 text-sm">Creator Portal — Biometric Enrollment</p>
        </div>

        {/* Brand selector */}
        <div className="mb-6">
          <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">
            Creator Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD54F]/50"
          >
            <option value="">— Select Creator —</option>
            {CREATORS.map((c) => (
              <option key={c.id} value={c.portalSlug}>
                {c.displayName} ({c.brand}) — {c.role}
              </option>
            ))}
          </select>
        </div>

        {/* Creator card */}
        {creator && (
          <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-[#FFD54F] font-bold text-lg">{creator.displayName}</p>
            <p className="text-white/60 text-sm">{creator.legalName}</p>
            <p className="text-white/40 text-xs mt-1">{creator.role}</p>
            <p className="text-white/30 text-xs mt-2">
              Scopes: {creator.scope.join(' · ')}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 text-sm text-white/40 leading-relaxed">
          <p>Have the creator present their device. Click <strong className="text-white/70">Enroll</strong> and follow the Face ID / Touch ID prompt.</p>
          <p className="mt-2">Once enrolled, they access their portal at <code className="text-[#FFD54F]">/creator/{selectedBrand || '[brand]'}</code> with a single biometric tap — no password.</p>
        </div>

        {/* Enroll button */}
        <button
          onClick={handleEnroll}
          disabled={!creator || status === 'loading'}
          className="w-full py-3 rounded-xl font-bold tracking-widest text-sm transition-all
            bg-[#FFD54F] text-black hover:bg-yellow-300
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Enrolling…' : `Enroll ${creator?.displayName ?? 'Creator'}`}
        </button>

        {/* Status message */}
        {message && (
          <div className={`mt-4 rounded-xl p-4 text-sm ${
            status === 'success' ? 'bg-green-900/40 text-green-300 border border-green-700/40' :
            status === 'error'   ? 'bg-red-900/40 text-red-300 border border-red-700/40' :
            'bg-white/5 text-white/60'
          }`}>
            {message}
          </div>
        )}

        {/* Success nav */}
        {status === 'success' && creator && (
          <Link
            href={`/creator/${creator.portalSlug}`}
            className="mt-4 block text-center text-[#FFD54F] text-sm hover:underline"
          >
            → Open {creator.displayName}&apos;s Portal
          </Link>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-white/20 text-xs hover:text-white/40">← Back to Flagship</Link>
        </div>
      </div>
    </main>
  );
}
