'use client';
/**
 * /creator/enroll — Admin enrolls a GPM creator via WebAuthn (Face ID/Touch ID).
 * gputnammusic.com/creator/enroll?brand=PIXIE
 * Self-contained for staging/gputnam-music-final-site.
 */
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CREATORS = [
  { id: 'pixie', brand: 'PIXIE', displayName: 'PIXIE', legalName: 'Jane Burton', role: 'HERB BLOG Author · GPM FP Playlist Curator', portalSlug: 'pixie' },
  { id: 'kleigh', brand: 'KLEIGH', displayName: 'KLEIGH', legalName: 'Kleigh', role: 'Audio · Image · Lyrics', portalSlug: 'kleigh' },
  { id: 'msj', brand: 'MSJ', displayName: 'MSJ', legalName: 'Michael Scherer', role: 'Audio · PDF · KEZ Campaign', portalSlug: 'msj' },
  { id: 'zg', brand: 'ZG', displayName: 'ZG', legalName: 'Zach Garrett', role: 'Lyrics · Vocal Demos', portalSlug: 'zg' },
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://lbzpfqarraegkghxwbah.supabase.co';

function EnrollForm() {
  const searchParams = useSearchParams();
  const brandParam = (searchParams.get('brand') ?? '').toLowerCase();
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const creator = CREATORS.find(c => c.portalSlug === selectedBrand || c.brand.toLowerCase() === selectedBrand);

  async function handleEnroll() {
    if (!creator) { setMessage('Select a valid creator brand first.'); setStatus('error'); return; }
    setStatus('loading');
    setMessage('Requesting enrollment options…');
    try {
      const { startRegistration } = await import('@simplewebauthn/browser');
      const optRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'options' }),
      });
      if (!optRes.ok) { const e = await optRes.json(); throw new Error(e.error ?? 'Failed to get options'); }
      const options = await optRes.json();
      setMessage('Please complete biometric verification…');
      const credential = await startRegistration({ optionsJSON: options });
      setMessage('Verifying with server…');
      const verRes = await fetch('/api/creator/webauthn/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
        <h1 className="text-2xl font-bold tracking-widest mb-1">GPM <span style={{color:'#FFD54F'}}>4PE-MSC</span></h1>
        <p style={{color:'rgba(255,255,255,0.5)'}} className="text-sm">Creator Portal — Biometric Enrollment</p>
      </div>

      {/* PIXIE-BOT enrollment guide */}
      {(selectedBrand === 'pixie' || selectedBrand === '') && (
        <div className="mb-6 rounded-2xl p-4" style={{background:'rgba(168,204,127,0.07)',border:'1px solid rgba(168,204,127,0.2)'}}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#a8cc7f'}}>🤖 PIXIE-BOT · Enrollment Steps</p>
          <ol className="space-y-2 text-xs" style={{color:'rgba(255,255,255,0.6)'}}>
            <li className="flex gap-2">
              <span style={{color:'#FFD54F'}} className="font-bold shrink-0">①</span>
              <span>Select <strong style={{color:'rgba(255,255,255,0.8)'}}>PIXIE</strong> from the dropdown below.</span>
            </li>
            <li className="flex gap-2">
              <span style={{color:'#FFD54F'}} className="font-bold shrink-0">②</span>
              <span>Make sure <strong style={{color:'rgba(255,255,255,0.8)'}}>Jane (PIXIE)</strong> is holding this device.</span>
            </li>
            <li className="flex gap-2">
              <span style={{color:'#FFD54F'}} className="font-bold shrink-0">③</span>
              <span>Tap <strong style={{color:'rgba(255,255,255,0.8)'}}>Enroll PIXIE</strong> and follow the Face ID / Touch ID prompt.</span>
            </li>
            <li className="flex gap-2">
              <span style={{color:'#FFD54F'}} className="font-bold shrink-0">④</span>
              <span>Done! Send PIXIE her portal link:{' '}
                <code style={{color:'#FFD54F',fontSize:'0.7rem'}}>gputnammusic.com/creator/pixie</code>
              </span>
            </li>
          </ol>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-widest mb-2" style={{color:'rgba(255,255,255,0.5)'}}>Creator Brand</label>
        <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}
          className="w-full rounded-lg px-4 py-3 text-white focus:outline-none"
          style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)'}}>
          <option value="">— Select Creator —</option>
          {CREATORS.map(c => <option key={c.id} value={c.portalSlug}>{c.displayName} — {c.role}</option>)}
        </select>
      </div>
      {creator && (
        <div className="mb-6 rounded-xl p-4" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)'}}>
          <p style={{color:'#FFD54F'}} className="font-bold text-lg">{creator.displayName}</p>
          <p style={{color:'rgba(255,255,255,0.6)'}} className="text-sm">{creator.legalName}</p>
          <p style={{color:'rgba(255,255,255,0.4)'}} className="text-xs mt-1">{creator.role}</p>
        </div>
      )}
      <p className="mb-6 text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.4)'}}>
        Have the creator present their device. Click <strong style={{color:'rgba(255,255,255,0.7)'}}>Enroll</strong> and follow the Face ID / Touch ID prompt.
        Once enrolled they log in at <code style={{color:'#FFD54F'}}>/creator/{selectedBrand || '[brand]'}</code>.
      </p>
      <button onClick={handleEnroll} disabled={!creator || status === 'loading'}
        className="w-full py-3 rounded-xl font-bold tracking-widest text-sm transition-all"
        style={{background:!creator||status==='loading'?'rgba(255,213,79,0.4)':'#FFD54F',color:'#000',cursor:!creator||status==='loading'?'not-allowed':'pointer'}}>
        {status === 'loading' ? 'Enrolling…' : `Enroll ${creator?.displayName ?? 'Creator'}`}
      </button>
      {message && (
        <div className="mt-4 rounded-xl p-4 text-sm" style={{
          background: status==='success' ? 'rgba(34,197,94,0.1)' : status==='error' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
          border: status==='success' ? '1px solid rgba(34,197,94,0.3)' : status==='error' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)',
          color: status==='success' ? '#86efac' : status==='error' ? '#fca5a5' : 'rgba(255,255,255,0.6)'
        }}>{message}</div>
      )}
      {status === 'success' && creator && (
        <Link href={`/creator/${creator.portalSlug}`} className="mt-4 block text-center text-sm hover:underline" style={{color:'#FFD54F'}}>
          → Open {creator.displayName}&apos;s Portal
        </Link>
      )}
      <div className="mt-8 text-center">
        <Link href="/" className="text-xs hover:underline" style={{color:'rgba(255,255,255,0.2)'}}>← Back to Home</Link>
      </div>
    </div>
  );
}

export default function CreatorEnrollPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6" style={{background:'#1a1207',color:'white'}}>
      <Suspense fallback={<div style={{color:'rgba(255,255,255,0.4)'}} className="text-sm">Loading…</div>}>
        <EnrollForm />
      </Suspense>
    </main>
  );
}
