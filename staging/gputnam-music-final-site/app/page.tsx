'use client';

/**
 * gputnammusic.com — Home Page (staging/gputnam-music-final-site)
 *
 * Layout (locked — strictly adheres to GTM PLT template):
 *   Row 1 — Header: STI top row, BTI-filled slots (Amber / gtmplt)
 *   Row 2 — Hero image (left) + HomeFP stream player (right) — side-by-side
 *   Row 3 — T20Grid: Top 20 streaming activities (BTI body row 2)
 *   Row 4 — STO GPM Footer
 *
 * BOT: MC-BOT voice-activated (SpeechRecognition — next/back/go/done)
 *
 * Self-contained — no imports from monorepo root.
 * Supabase: reads `tracks` table for featured playlist + T20 grid.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase ────────────────────────────────────────────────────────────────
// Use canonical env vars — never hardcode project URLs.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Track {
  id: number | string;
  title: string;
  artist?: string;
  mood?: string;
  plays?: number;
}

// ─── Hero images (public storage — no signing required for images) ────────────
const HERO_IMAGES = SUPABASE_URL
  ? [
      { src: `${SUPABASE_URL}/storage/v1/object/public/tracks/hero.jpg`, alt: 'G Putnam Music' },
      { src: `${SUPABASE_URL}/storage/v1/object/public/tracks/IMG_7429.JPG`, alt: 'G Putnam Music live' },
    ]
  : [{ src: '', alt: 'G Putnam Music' }];

// ─────────────────────────────────────────────────────────────────────────────
// ROW 1 — HEADER (STI top row, amber/gtmplt)
// ─────────────────────────────────────────────────────────────────────────────
function GpmHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: '/artists',  label: 'Artists' },
    { href: '/heroes',   label: 'Heroes' },
    { href: '/gift',     label: 'Gift' },
    { href: '/join',     label: 'JOIN' },
    { href: '/contact',  label: 'Contact' },
  ];

  return (
    <nav className="w-full bg-[#2A1506] shadow-lg border-b border-[#5C3A1E]/40 relative z-50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* LEFT: Identity */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C8A882]/60 bg-[#1a1207] flex items-center justify-center">
            <span className="text-[#D4A017] font-black text-sm">GPM</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] font-black tracking-[0.25em] text-[#D4A017] uppercase">G Putnam Music</div>
            <div className="text-[9px] text-[#C8A882]/60 tracking-widest uppercase">The One Stop Song Shop</div>
          </div>
        </a>

        {/* CENTER: Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
              className="px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase text-[#C8A882]/80 hover:text-[#D4A017] transition-colors rounded-lg hover:bg-[#D4A017]/10">
              {label}
            </a>
          ))}
        </div>

        {/* RIGHT: Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-[#D4A017]/10"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-[#C8A882] transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#C8A882] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#C8A882] transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#5C3A1E]/30 bg-[#2A1506]/95 backdrop-blur-md">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm font-bold tracking-widest uppercase text-[#C8A882]/80 hover:text-[#D4A017] border-b border-[#5C3A1E]/20 last:border-0">
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW 4 — FOOTER (STO GPM Footer)
// ─────────────────────────────────────────────────────────────────────────────
function GpmFooter() {
  return (
    <footer className="w-full bg-[#1a100e] border-t border-[#5C3A1E]/30 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <div className="text-[#D4A017] font-black text-sm uppercase tracking-widest">G Putnam Music</div>
          <div className="text-[#C8A882]/50 text-xs mt-1">Dream The Stream · The One Stop Song Shop</div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[#C8A882]/50 uppercase tracking-widest">
          {[
            { href: '/artists', label: 'Artists' },
            { href: '/heroes',  label: 'Heroes' },
            { href: '/gift',    label: 'Gift' },
            { href: '/join',    label: 'Join' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms',   label: 'Terms' },
          ].map(({ href, label }) => (
            <a key={href} href={href} className="hover:text-[#D4A017] transition-colors">{label}</a>
          ))}
        </div>
        <div className="text-[#C8A882]/30 text-[10px] uppercase tracking-widest text-center">
          © {new Date().getFullYear()} G Putnam Music, LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MC-BOT: Voice-activated step guide (voice: next / back / go / done)
// ─────────────────────────────────────────────────────────────────────────────
const BOT_STEPS = [
  { title: 'Welcome to G Putnam Music',     hint: 'Stream original music, gift tracks, or join as a sponsor. Everything here is 100% original.' },
  { title: 'Browse the catalog',            hint: 'Explore tracks by mood, artist, or activity. The T20 grid below shows what\'s streaming right now.', href: '/artists' },
  { title: 'Give a K-KUT as a gift',        hint: 'Buy a micro-license for any track and gift it to someone special.', href: '/gift' },
  { title: 'Become a sponsor',              hint: 'Support original music directly. Sponsors get exclusive early access and rewards.', href: '/join' },
  { title: 'Play a track',                  hint: 'Tap any card below or use the stream player to hear what\'s on right now.' },
];

function McBot() {
  const [step, setStep]       = useState(0);
  const [collapsed, setColl]  = useState(false);
  const [listening, setLis]   = useState(false);
  const [voiceStatus, setVS]  = useState('');
  const recRef                = useRef<any>(null);

  const handleCmd = useCallback((transcript: string) => {
    const cmd = transcript.toLowerCase();
    if (cmd.includes('next') || cmd.includes('forward'))     { setStep(s => Math.min(s + 1, BOT_STEPS.length - 1)); setVS('→ Next'); }
    else if (cmd.includes('back') || cmd.includes('prev'))   { setStep(s => Math.max(s - 1, 0)); setVS('← Back'); }
    else if (cmd.includes('done') || cmd.includes('collapse') || cmd.includes('close')) { setColl(true); setVS('Done ✓'); }
    else if (cmd.includes('expand') || cmd.includes('open')) { setColl(false); setVS('Expanded'); }
    else if (cmd.includes('go') || cmd.includes('action'))   {
      const href = BOT_STEPS[step]?.href;
      if (href) window.location.href = href;
      setVS('Going →');
    }
    setTimeout(() => setVS(''), 2000);
  }, [step]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (!recRef.current) {
      const r = new SR();
      r.continuous = true; r.lang = 'en-US'; r.interimResults = false;
      r.onresult = (e: any) => handleCmd(e.results[e.results.length - 1][0].transcript);
      r.onerror = () => {};
      r.onend = () => { if (listening) { try { r.start(); } catch (_) {} } };
      recRef.current = r;
    }
    if (listening) { try { recRef.current.start(); } catch (_) {} }
    else { try { recRef.current.stop(); } catch (_) {} }
    return () => { try { recRef.current?.stop(); } catch (_) {} };
  }, [listening, handleCmd]);

  if (collapsed) {
    return (
      <button onClick={() => setColl(false)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase transition-all hover:brightness-110"
        style={{ borderColor: '#D4A01740', color: '#D4A017', background: '#D4A01710' }}>
        🤖 MC-BOT · STEP {step + 1}/{BOT_STEPS.length}
        <span className="opacity-30 text-[9px]">🎤</span>
        <span className="opacity-60">▼</span>
      </button>
    );
  }

  return (
    <div className="w-full max-w-xs rounded-2xl border bg-black/80 backdrop-blur-md overflow-hidden"
      style={{ borderColor: '#D4A01730' }}>
      {/* Bot header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#D4A01720', background: '#D4A01708' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#D4A017]">MC-BOT</span>
            <span className="block text-[9px] text-white/40 tracking-widest uppercase">STEP {step + 1} OF {BOT_STEPS.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {voiceStatus && <span className="text-[9px] font-bold tracking-wider text-[#D4A017]">{voiceStatus}</span>}
          <button onClick={() => setLis(v => !v)}
            className={`p-1.5 rounded-full transition-all ${listening ? 'animate-pulse' : 'hover:bg-white/10'}`}
            style={listening ? { background: '#D4A01730', color: '#D4A017' } : {}}
            title={listening ? 'Voice active — say: next / back / go / done' : 'Enable voice control'}
            aria-label={listening ? 'Stop voice control' : 'Start voice control'}>
            <span className="text-sm">{listening ? '🎤' : '🎙️'}</span>
          </button>
          <button onClick={() => setColl(true)} className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Collapse">
            <span className="text-white/40 text-xs">✕</span>
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="p-3 space-y-1.5">
        {BOT_STEPS.map((s, i) => {
          const active = i === step;
          const done   = i < step;
          return (
            <button key={i} onClick={() => setStep(i)}
              className={`w-full text-left rounded-xl px-3 py-2.5 transition-all ${active ? 'bg-[#D4A017]/15 border border-[#D4A017]/30' : done ? 'opacity-40' : 'opacity-50 hover:opacity-70'}`}>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold" style={{ color: active ? '#D4A017' : done ? '#D4A01770' : '#ffffff40' }}>
                  {done ? '✓' : active ? '▶' : String(i + 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-[11px] font-bold leading-tight ${active ? 'text-white' : 'text-white/60'}`}>{s.title}</div>
                  {active && s.hint && <div className="text-[10px] text-white/50 mt-1 leading-relaxed">{s.hint}</div>}
                </div>
                {active && s.hint && (
                  <div className={`relative flex-shrink-0 w-2 h-2 mt-1 rounded-full`} style={{ background: '#D4A017' }}>
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#D4A01760' }} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        <button disabled={step === 0} onClick={() => setStep(s => s - 1)}
          className="flex-1 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border border-[#D4A017]/20 text-[#D4A017]/60 disabled:opacity-30 hover:bg-[#D4A017]/10 transition-all">
          ← Back
        </button>
        {BOT_STEPS[step]?.href ? (
          <a href={BOT_STEPS[step].href}
            className="flex-1 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-center transition-all"
            style={{ background: '#D4A017', color: '#1a1207' }}>
            Go →
          </a>
        ) : (
          <button disabled={step === BOT_STEPS.length - 1} onClick={() => setStep(s => s + 1)}
            className="flex-1 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider disabled:opacity-30 transition-all"
            style={{ background: '#D4A017', color: '#1a1207' }}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW 2 (right) — HOME FEATURED PLAYLIST PLAYER
// Resolves signed audio URLs via Supabase Edge Function `get-stream-url`.
// Explicit states: Loading → Ready | Misconfigured | Empty | Playback Error
// ─────────────────────────────────────────────────────────────────────────────
function HomeFP() {
  const [tracks, setTracks]           = useState<Track[]>([]);
  const [idx, setIdx]                 = useState(0);
  const [playing, setPlaying]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [resolving, setResolving]     = useState(false);
  const [playbackError, setError]     = useState<string | null>(null);
  const audioRef                      = useRef<HTMLAudioElement | null>(null);

  // Misconfigured when either env var is absent
  const misconfigured = !SUPABASE_URL || !SUPABASE_KEY;

  // Load track metadata (no raw audio URLs — resolved on demand via get-stream-url)
  useEffect(() => {
    if (misconfigured || !supabase) { setLoading(false); return; }
    supabase
      .from('tracks')
      .select('id, title, artist, mood')
      .limit(60)
      .then(({ data }) => {
        const filtered = (data ?? []).filter((t: any) => {
          const title  = (t.title  ?? '').toLowerCase();
          const artist = (t.artist ?? '').toLowerCase();
          return !title.includes('instro') && !title.includes('instrumental') &&
                 !artist.includes('sybc')  && !artist.includes('wounded');
        });
        setTracks([...filtered].sort(() => Math.random() - 0.5));
        setLoading(false);
      });
  }, []);

  // Stop audio and clear error when user changes track
  useEffect(() => {
    setError(null);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [idx]);

  const current = tracks[idx];

  // Resolve signed URL via get-stream-url, then play
  const resolveAndPlay = useCallback(async () => {
    if (!supabase || !current) return;
    setResolving(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-stream-url', {
        body: { track_id: String(current.id) },
      });
      if (error || !data?.url) {
        setError('Stream URL unavailable — check Supabase function config.');
        return;
      }
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = data.url as string;
      await audio.play();
      setPlaying(true);
    } catch (err) {
      console.error('[HomeFP] playback error:', err);
      setError('Playback error — get-stream-url function unreachable.');
    } finally {
      setResolving(false);
    }
  }, [current]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else if (!audio.src) {
      resolveAndPlay();
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setError('Playback blocked by browser. Tap play again.'));
    }
  };

  const skip = (dir: 1 | -1) =>
    setIdx(i => Math.max(0, Math.min(tracks.length - 1, i + dir)));

  // ── State: Misconfigured ──────────────────────────────────────────────────
  if (misconfigured) {
    return (
      <div className="flex flex-col h-full min-h-[280px] bg-[#110d06] p-6 justify-center items-center">
        <div className="text-center max-w-xs">
          <div className="text-3xl mb-3">⚠️</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4A017] font-bold mb-2">
            Stream Misconfigured
          </div>
          <p className="text-[#C8A882]/50 text-xs leading-relaxed">
            <code className="text-[#D4A017]/80">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-[#D4A017]/80">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> must be set
            in Vercel Environment Variables to enable streaming.
          </p>
          <a
            href="/api/healthcheck"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-[10px] text-[#D4A017]/60 underline underline-offset-2 hover:text-[#D4A017]"
          >
            Run healthcheck →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[280px] bg-[#110d06] p-6 justify-between">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4A017] font-bold mb-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-pulse" />
          GPM Featured Stream
        </div>

        {/* State: Loading */}
        {loading && (
          <div className="text-[#C8A882]/40 text-sm animate-pulse">Loading tracks…</div>
        )}

        {/* State: Empty catalog */}
        {!loading && tracks.length === 0 && (
          <div className="text-[#C8A882]/40 text-sm">
            <span className="text-[#D4A017]">📂</span> No tracks in catalog yet.
          </div>
        )}

        {/* State: Ready — show current track info */}
        {!loading && current && (
          <>
            <div className="text-white font-bold text-lg leading-tight truncate">{current.title}</div>
            <div className="text-[#C8A882]/70 text-sm mt-1 truncate">{current.artist ?? 'G Putnam Music'}</div>
            {current.mood && (
              <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4A017]/10 text-[#D4A017]/80">
                {current.mood}
              </div>
            )}
          </>
        )}

        {/* State: Playback error */}
        {playbackError && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-xs leading-relaxed">
            ⚠️ {playbackError}
          </div>
        )}
      </div>

      {/* Controls */}
      <div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => skip(-1)}
            disabled={idx === 0 || loading}
            className="p-3 rounded-full bg-[#2A1506] text-[#C8A882] hover:text-[#D4A017] hover:bg-[#3a2208] disabled:opacity-30 transition-all"
          >
            ⏮
          </button>
          <button
            onClick={toggle}
            disabled={loading || resolving || tracks.length === 0}
            aria-label={resolving ? 'Resolving stream…' : playing ? 'Pause' : 'Play'}
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-lg disabled:opacity-50"
            style={{ background: '#D4A017', color: '#1a1207' }}
          >
            {resolving ? '⏳' : playing ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => skip(1)}
            disabled={idx === tracks.length - 1 || loading}
            className="p-3 rounded-full bg-[#2A1506] text-[#C8A882] hover:text-[#D4A017] hover:bg-[#3a2208] disabled:opacity-30 transition-all"
          >
            ⏭
          </button>
        </div>
        <div className="text-center text-[10px] text-[#C8A882]/30 mt-3 font-mono">
          {tracks.length === 0 ? '— / —' : `${idx + 1} / ${tracks.length}`}
        </div>
        <audio ref={audioRef} onEnded={() => skip(1)} preload="none" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW 3 — T20 GRID (Top 20 streaming activities)
// ─────────────────────────────────────────────────────────────────────────────
function T20Grid() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from('tracks')
      .select('id, title, artist, mood, plays')
      .order('plays', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setTracks(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-[#5C3A1E]/30" />
        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-[#D4A017]">
          T20 · Top Streaming Activities
        </h2>
        <div className="h-px flex-1 bg-[#5C3A1E]/30" />
      </div>

      {/* State: Misconfigured */}
      {!SUPABASE_URL || !SUPABASE_KEY ? (
        <div className="text-center text-[#C8A882]/30 text-sm py-8">
          ⚠️ Supabase env vars missing — T20 data unavailable.{' '}
          <a href="/api/healthcheck" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#D4A017]">
            Run healthcheck
          </a>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-[#2A1506]/40 animate-pulse" />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center text-[#C8A882]/30 text-sm py-8">
          Connect Supabase to display live Top 20 data.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {tracks.map((t, i) => (
            <div key={String(t.id)}
              className="relative rounded-xl bg-[#2A1506]/60 border border-[#5C3A1E]/30 p-3 hover:border-[#D4A017]/40 hover:bg-[#2A1506]/90 transition-all cursor-pointer group">
              {/* Rank badge */}
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                style={{ background: i < 3 ? '#D4A017' : '#5C3A1E40', color: i < 3 ? '#1a1207' : '#C8A882' }}>
                {i + 1}
              </div>
              <div className="mt-4">
                <div className="text-white text-[11px] font-bold leading-tight line-clamp-2 group-hover:text-[#D4A017] transition-colors">
                  {t.title}
                </div>
                {t.artist && (
                  <div className="text-[#C8A882]/50 text-[10px] mt-1 truncate">{t.artist}</div>
                )}
                {t.mood && (
                  <div className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-[#D4A017]/60">{t.mood}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — Strictly locked 4-row template (STI / BTI / STO)
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % HERO_IMAGES.length);
        setFading(false);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const hero = HERO_IMAGES[heroIdx];

  return (
    <>
      {/* ─── ROW 1: Header (STI top row, BTI-filled slots, Amber / gtmplt) ──── */}
      <GpmHeader />

      {/* MC-BOT: voice-activated step guide (anchored top-right) */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <McBot />
      </div>

      {/* ─── ROW 2: Hero image (left) + HomeFP stream player (right) ─────────── */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[56vh] md:min-h-[64vh]">

        {/* LEFT: Rotating hero image */}
        <div className="relative w-full h-[52vw] md:h-auto min-h-[240px] overflow-hidden bg-[#2A1506]">
          {/* Hero image */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
            style={{ backgroundImage: `url(${hero.src})` }}
            role="img"
            aria-label={hero.alt}
          />
          {/* Amber gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1506]/40 via-transparent to-[#1a1207]/85" />

          {/* Brand lockup */}
          <div className="absolute bottom-6 left-5 right-5 md:bottom-8 md:left-8 md:right-8">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#C8A882]/70 mb-1.5 font-bold">
              G Putnam Music · The One Stop Song Shop
            </p>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-none drop-shadow-2xl">
              All Original.
              <br />
              <span className="text-[#D4A017]">Always Streaming.</span>
            </h1>
            <p className="mt-2 text-xs md:text-sm text-[#C8A882]/80 max-w-xs drop-shadow">
              Activity-based, context-aware music intelligence.
            </p>
          </div>
        </div>

        {/* RIGHT: GPM Featured Playlist — non-stop stream */}
        <div className="flex flex-col justify-center bg-[#110d06] border-l border-[#5C3A1E]/20">
          <HomeFP />
        </div>
      </section>

      {/* ─── ROW 3: T20Grid (BTI body row 2) ──────────────────────────────────── */}
      <T20Grid />

      {/* ─── ROW 4: STO GPM Footer ────────────────────────────────────────────── */}
      <GpmFooter />
    </>
  );
}
