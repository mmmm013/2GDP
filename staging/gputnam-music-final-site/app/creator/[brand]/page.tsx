'use client';
/**
 * /creator/[brand] — Brand-scoped Creator Portal
 * gputnammusic.com/creator/pixie
 * Auth: WebAuthn biometric via gpmc_creator_session cookie.
 * Self-contained for staging/gputnam-music-final-site.
 *
 * PIXIE (Jane Burton): Two tabs — HERB BLOG + GPM FP PLAYLIST
 */
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://lbzpfqarraegkghxwbah.supabase.co';

function getSupabase() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!key) return null;
  return createClient(SUPABASE_URL, key);
}

const CREATORS: Record<string, { brand: string; displayName: string; legalName: string; role: string }> = {
  pixie: { brand: 'PIXIE', displayName: 'PIXIE', legalName: 'Jane Burton', role: 'HERB BLOG Author · GPM FP Playlist Curator' },
  kleigh: { brand: 'KLEIGH', displayName: 'KLEIGH', legalName: 'KLEIGH', role: 'Audio · Image · Lyrics' },
  msj: { brand: 'MSJ', displayName: 'MSJ', legalName: 'Michael Scherer', role: 'Audio · PDF · KEZ Campaign' },
  zg: { brand: 'ZG', displayName: 'ZG', legalName: 'Zach Garrett', role: 'Lyrics · Vocal Demos' },
};

interface Asset {
  id: string;
  brand: string;
  file_url: string;
  file_type: string;
  scope: string;
  label: string;
  meta: Record<string, string>;
  is_published: boolean;
  uploaded_at: string;
}

export default function CreatorPortalPage() {
  const { brand } = useParams<{ brand: string }>();
  const router = useRouter();
  const creator = CREATORS[brand?.toLowerCase() ?? ''];

  const [authed,   setAuthed]   = useState(false);
  const [authMsg,  setAuthMsg]  = useState('');
  const [assets,   setAssets]   = useState<Asset[]>([]);
  const [tab,      setTab]      = useState<'HERB_BLOG' | 'GPM_FP_PLAYLIST'>('HERB_BLOG');
  const [uploading,setUploading]= useState(false);
  const [blogTitle,setBlogTitle]= useState('');
  const [blogBody, setBlogBody] = useState('');
  const [file,     setFile]     = useState<File | null>(null);
  const [label,    setLabel]    = useState('');

  // ── Check existing session ────────────────────────────────────────
  useEffect(() => {
    fetch('/api/creator/assets', { credentials: 'include' })
      .then(r => { if (r.ok) { setAuthed(true); loadAssets(); } })
      .catch(() => {});
  }, []);

  const loadAssets = useCallback(async () => {
    const res = await fetch('/api/creator/assets', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : (data.assets ?? []));
    }
  }, []);

  // ── WebAuthn login ────────────────────────────────────────────────
  async function handleAuth() {
    if (!creator) return;
    setAuthMsg('Requesting biometric options…');
    try {
      const { startAuthentication } = await import('@simplewebauthn/browser');
      const optRes = await fetch('/api/creator/webauthn/authenticate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'options' }),
      });
      if (!optRes.ok) { const e = await optRes.json(); throw new Error(e.error ?? 'Failed'); }
      const credential = await startAuthentication({ optionsJSON: await optRes.json() });
      const verRes = await fetch('/api/creator/webauthn/authenticate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: creator.brand, phase: 'verify', credential }),
      });
      if (!verRes.ok) { const e = await verRes.json(); throw new Error(e.error ?? 'Auth failed'); }
      setAuthed(true); setAuthMsg('');
      loadAssets();
    } catch (err: unknown) {
      setAuthMsg(`❌ ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // ── Upload blog post ──────────────────────────────────────────────
  async function handleBlogPost() {
    if (!blogTitle.trim() || !blogBody.trim()) return;
    setUploading(true);
    const blob = new Blob([JSON.stringify({ title: blogTitle, content: blogBody })], { type: 'application/json' });
    const fd = new FormData();
    fd.append('file', blob, `${Date.now()}-${blogTitle.replace(/\s+/g, '-').toLowerCase()}.json`);
    fd.append('scope', 'HERB_BLOG');
    fd.append('label', blogTitle);
    const res = await fetch('/api/creator/upload', { method: 'POST', body: fd, credentials: 'include' });
    if (res.ok) { setBlogTitle(''); setBlogBody(''); loadAssets(); }
    setUploading(false);
  }

  // ── Upload playlist file ──────────────────────────────────────────
  async function handlePlaylistUpload() {
    if (!file || !label.trim()) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('scope', 'GPM_FP_PLAYLIST');
    fd.append('label', label);
    const res = await fetch('/api/creator/upload', { method: 'POST', body: fd, credentials: 'include' });
    if (res.ok) { setFile(null); setLabel(''); loadAssets(); }
    setUploading(false);
  }

  // ── Toggle publish ────────────────────────────────────────────────
  async function togglePublish(id: string, current: boolean) {
    await fetch('/api/creator/assets', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, is_published: !current }),
    });
    loadAssets();
  }

  // ── Delete ────────────────────────────────────────────────────────
  async function deleteAsset(id: string) {
    if (!confirm('Delete this asset?')) return;
    await fetch(`/api/creator/assets?id=${id}`, { method: 'DELETE', credentials: 'include' });
    loadAssets();
  }

  // ── Unknown brand ─────────────────────────────────────────────────
  if (!creator) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6" style={{background:'#1a1207',color:'white'}}>
        <p style={{color:'rgba(255,255,255,0.4)'}} className="mb-4 text-sm">Unknown creator brand: <code>{brand}</code></p>
        <Link href="/creator/enroll" style={{color:'#FFD54F'}} className="text-sm hover:underline">→ Enroll a creator</Link>
      </main>
    );
  }

  // ── Auth gate ─────────────────────────────────────────────────────
  if (!authed) {
    const isPixie = creator.brand === 'PIXIE';
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6" style={{background:'#1a1207',color:'white'}}>
        <div className="w-full max-w-sm text-center">
          <p style={{color:'rgba(168,204,127,1)'}} className="text-xs uppercase tracking-widest mb-3">GPM Creator Portal</p>
          <h1 className="text-3xl font-bold mb-1">{creator.displayName}</h1>
          <p style={{color:'rgba(255,255,255,0.4)'}} className="text-xs mb-6">{creator.legalName} · {creator.role}</p>

          {/* PIXIE-BOT guided walk-through */}
          {isPixie && (
            <div className="mb-6 rounded-2xl p-4 text-left" style={{background:'rgba(168,204,127,0.07)',border:'1px solid rgba(168,204,127,0.2)'}}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#a8cc7f'}}>🤖 PIXIE-BOT · How to get in</p>
              <ol className="space-y-2 text-xs" style={{color:'rgba(255,255,255,0.6)'}}>
                <li className="flex gap-2">
                  <span style={{color:'#FFD54F'}} className="font-bold shrink-0">①</span>
                  <span><strong style={{color:'rgba(255,255,255,0.8)'}}>First time only:</strong> Ask admin to open{' '}
                    <code style={{color:'#FFD54F',fontSize:'0.7rem'}}>gputnammusic.com/creator/enroll?brand=PIXIE</code>{' '}
                    on <em>this device</em>, then tap <strong>Enroll PIXIE</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span style={{color:'#FFD54F'}} className="font-bold shrink-0">②</span>
                  <span>Once enrolled, tap <strong style={{color:'rgba(255,255,255,0.8)'}}>Verify Identity</strong> below and use Face ID or Touch ID when prompted.</span>
                </li>
                <li className="flex gap-2">
                  <span style={{color:'#FFD54F'}} className="font-bold shrink-0">③</span>
                  <span>You&apos;re in! Write posts in the <strong style={{color:'#a8cc7f'}}>🌱 Herb Blog</strong> tab or upload your curated playlist.</span>
                </li>
              </ol>
              <p className="mt-3 text-xs" style={{color:'rgba(255,255,255,0.3)'}}>
                Your session stays active for 4 hours. No password needed — ever.
              </p>
            </div>
          )}

          <button onClick={handleAuth}
            className="w-full py-3 rounded-xl font-bold tracking-widest text-sm mb-4"
            style={{background:'#FFD54F',color:'#000'}}>
            🔐 Verify Identity (Face ID / Touch ID)
          </button>
          {authMsg && <p className="text-sm mt-2" style={{color:authMsg.startsWith('❌')?'#fca5a5':'rgba(255,255,255,0.5)'}}>{authMsg}</p>}
          {authMsg.includes('not yet enrolled') && (
            <a
              href={`/creator/enroll?brand=${creator.brand}`}
              className="mt-3 inline-block px-4 py-2 rounded-lg text-sm font-semibold"
              style={{background:'rgba(255,213,79,0.15)',border:'1px solid rgba(255,213,79,0.3)',color:'#FFD54F'}}>
              → Go to Enrollment →
            </a>
          )}
          <div className="mt-6 flex flex-col gap-2 text-xs" style={{color:'rgba(255,255,255,0.2)'}}>
            <Link href="/herb-blog" className="hover:underline">→ View PIXIE&apos;s PIX (public)</Link>
            <Link href="/" className="hover:underline">← Back to Home</Link>
          </div>
        </div>
      </main>
    );
  }

  const myAssets = assets.filter(a => a.scope === tab);

  // ── Authenticated portal ──────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{background:'#1a1207',color:'white'}}>
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between" style={{borderColor:'rgba(255,255,255,0.1)'}}>
        <div>
          <span style={{color:'#FFD54F'}} className="font-bold tracking-widest text-sm">{creator.displayName}</span>
          <span style={{color:'rgba(255,255,255,0.3)'}} className="text-xs ml-2">Creator Portal</span>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/herb-blog" style={{color:'rgba(168,204,127,0.8)'}} className="text-xs hover:underline">🌿 PIXIE&apos;s PIX</Link>
          <Link href="/" style={{color:'rgba(255,255,255,0.2)'}} className="text-xs hover:underline">← Home</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['HERB_BLOG', 'GPM_FP_PLAYLIST'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'rgba(168,204,127,0.15)' : 'rgba(255,255,255,0.05)',
                border: tab === t ? '1px solid rgba(168,204,127,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: tab === t ? '#a8cc7f' : 'rgba(255,255,255,0.5)',
              }}>
              {t === 'HERB_BLOG' ? '🌱 Herb Blog' : '🎵 GPM FP Playlist'}
            </button>
          ))}
        </div>

        {/* HERB BLOG upload */}
        {tab === 'HERB_BLOG' && (
          <div className="mb-8 rounded-2xl p-6" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)'}}>
            <h2 className="font-bold mb-4" style={{color:'#a8cc7f'}}>✍️ New Post</h2>
            <input value={blogTitle} onChange={e => setBlogTitle(e.target.value)} placeholder="Post title…"
              className="w-full rounded-lg px-3 py-2 mb-3 text-sm text-white focus:outline-none"
              style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}} />
            <textarea value={blogBody} onChange={e => setBlogBody(e.target.value)} rows={8} placeholder="Write your post here…"
              className="w-full rounded-lg px-3 py-2 mb-3 text-sm text-white focus:outline-none resize-y"
              style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}} />
            <button onClick={handleBlogPost} disabled={!blogTitle.trim() || !blogBody.trim() || uploading}
              className="px-6 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{background:'#a8cc7f',color:'#1a1207',opacity:(!blogTitle.trim()||!blogBody.trim()||uploading)?0.5:1}}>
              {uploading ? 'Saving…' : '🌿 Save Post'}
            </button>
          </div>
        )}

        {/* PLAYLIST upload */}
        {tab === 'GPM_FP_PLAYLIST' && (
          <div className="mb-8 rounded-2xl p-6" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)'}}>
            <h2 className="font-bold mb-4" style={{color:'#FFD54F'}}>🎵 Upload Playlist File</h2>
            <p className="text-xs mb-4" style={{color:'rgba(255,255,255,0.4)'}}>
              Upload your 2-hour curated GPM FP playlist as an audio file or JSON track list.
            </p>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Playlist label (e.g. PIXIE's Spring 2026 Mix)…"
              className="w-full rounded-lg px-3 py-2 mb-3 text-sm text-white focus:outline-none"
              style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}} />
            <input type="file" accept="audio/*,application/json" onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm mb-3" style={{color:'rgba(255,255,255,0.6)'}} />
            <button onClick={handlePlaylistUpload} disabled={!file || !label.trim() || uploading}
              className="px-6 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{background:'#FFD54F',color:'#000',opacity:(!file||!label.trim()||uploading)?0.5:1}}>
              {uploading ? 'Uploading…' : '🎵 Upload Playlist'}
            </button>
          </div>
        )}

        {/* Asset list */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{color:'rgba(255,255,255,0.3)'}}>
            {tab === 'HERB_BLOG' ? 'Your Posts' : 'Your Playlists'} ({myAssets.length})
          </h3>
          {myAssets.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{color:'rgba(255,255,255,0.2)'}}>Nothing uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {myAssets.map(a => (
                <div key={a.id} className="rounded-xl p-4 flex items-center justify-between"
                  style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                  <div>
                    <p className="text-sm font-semibold text-white">{a.label}</p>
                    <p className="text-xs mt-0.5" style={{color:'rgba(255,255,255,0.3)'}}>
                      {new Date(a.uploaded_at).toLocaleDateString()} · {a.is_published ? '🟢 Published' : '⭕ Unpublished'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => togglePublish(a.id, a.is_published)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{background: a.is_published ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                              border: a.is_published ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(34,197,94,0.3)',
                              color: a.is_published ? '#fca5a5' : '#86efac'}}>
                      {a.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => deleteAsset(a.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold"
                      style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'rgba(252,165,165,0.7)'}}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
