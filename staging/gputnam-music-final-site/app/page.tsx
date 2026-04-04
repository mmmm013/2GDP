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
import { buildT20Queue, type QueueTrack } from '@/lib/t20Queue';
import { resolveBgVideo, type SceneKey, type Season } from '@/config/bgVideoLibrary';
import { getLyrics, getActiveLyricIndex } from '@/config/lyrics';
import {
  loadPrefs, savePrefs, resetPrefs,
  nextAvatarMode, defaultAvatarForMood,
  type AvatarMode, type UserPrefs,
} from '@/lib/userPrefs';
import { FOUNDER_DEFAULTS } from '@/config/founderDefaults';

// ─── Supabase ────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://lbzpfqarraegkghxwbah.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabase = SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/tracks/`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Track {
  id: number | string;
  title: string;
  artist?: string;
  url?: string;
  mood?: string;
  plays?: number;
}

// ─── Hero images ─────────────────────────────────────────────────────────────
const HERO_IMAGES = [
  { src: 'https://lbzpfqarraegkghxwbah.supabase.co/storage/v1/object/public/tracks/hero.jpg', alt: 'G Putnam Music' },
  { src: 'https://lbzpfqarraegkghxwbah.supabase.co/storage/v1/object/public/tracks/IMG_7429.JPG', alt: 'G Putnam Music live' },
];

function resolveUrl(raw: string): string {
  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  return STORAGE_BASE + (raw.split('/').pop()?.split('?')[0] ?? raw);
}

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
  { title: 'Welcome to G Putnam Music',     hint: 'Stream original music, gift tracks, or join as a sponsor. Everything here is 100% original.', href: '#stream' },
  { title: 'Browse the catalog',            hint: 'Explore tracks by mood, artist, or activity. The T20 grid below shows what\'s streaming right now.', href: '/artists' },
  { title: 'Give a K-KUT as a gift',        hint: 'Buy a micro-license for any track and gift it to someone special.', href: '/gift' },
  { title: 'Become a sponsor',              hint: 'Support original music directly. Sponsors get exclusive early access and rewards.', href: '/join' },
  { title: 'Play a track',                  hint: 'Tap any card below or use the stream player to hear what\'s on right now.', href: '#stream' },
];

function McBot({ streamUnavailable }: { streamUnavailable?: boolean }) {
  const [step, setStep]       = useState(0);
  const [collapsed, setColl]  = useState(false);
  const [listening, setLis]   = useState(false);
  const [voiceStatus, setVS]  = useState('');
  const recRef                = useRef<any>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-AU'; utt.pitch = 1.1; utt.rate = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }, []);

  const handleCmd = useCallback((transcript: string) => {
    const cmd = transcript.toLowerCase();
    if (cmd.includes('next') || cmd.includes('forward'))     { setStep(s => Math.min(s + 1, BOT_STEPS.length - 1)); setVS('→ Next'); }
    else if (cmd.includes('back') || cmd.includes('prev'))   { setStep(s => Math.max(s - 1, 0)); setVS('← Back'); }
    else if (cmd.includes('done') || cmd.includes('collapse') || cmd.includes('close')) { setColl(true); setVS('Done ✓'); }
    else if (cmd.includes('expand') || cmd.includes('open')) { setColl(false); setVS('Expanded'); }
    else if (cmd.includes('artist') || cmd.includes('catalog') || cmd.includes('music')) {
      window.location.href = '/artists'; setVS('Artists →');
    }
    else if (cmd.includes('gift') || cmd.includes('k-kut') || cmd.includes('kkut')) {
      window.location.href = '/gift'; setVS('Gift →');
    }
    else if (cmd.includes('sponsor') || cmd.includes('join') || cmd.includes('member') || cmd.includes('kub') || cmd.includes('kez')) {
      window.location.href = '/join'; setVS('Sponsor →');
    }
    else if (cmd.includes('go') || cmd.includes('action'))   {
      const href = BOT_STEPS[step]?.href;
      if (href) window.location.href = href;
      setVS('Going →');
    }
    setTimeout(() => setVS(''), 2000);
  }, [step]);

  // Proactive TTS greeting on first mount — once per session only
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (sessionStorage.getItem('mcbot_greeted')) return;
    const timer = setTimeout(() => {
      speak("G'day — MC-BOT here. " + BOT_STEPS[0].hint + " Tap 'Go' to stream now, or say 'next' to keep going.");
      sessionStorage.setItem('mcbot_greeted', '1');
    }, 1500);
    return () => clearTimeout(timer);
  }, [speak]);

  // When stream is unavailable, McBot takes over: uncollapse, speak discovery prompt, auto-listen
  useEffect(() => {
    if (!streamUnavailable) return;
    setColl(false);
    const timer = setTimeout(() => {
      speak("G'day — stream's warming up. Tell me what you're after: say 'artists', 'gift', or 'sponsor' and I'll take you straight there.");
      setTimeout(() => setLis(true), 3500);
    }, 800);
    return () => clearTimeout(timer);
  }, [streamUnavailable, speak]);

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
// AVATAR EMOJI MAP
// ─────────────────────────────────────────────────────────────────────────────
const AVATAR_EMOJI: Record<AvatarMode, string> = {
  runner:          '🏃',
  biker:           '🚴',
  parachutist:     '🪂',
  'figure-skater': '⛸️',
  surfer:          '🏄',
  skier:           '⛷️',
  none:            '',
};

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PANEL
// ─────────────────────────────────────────────────────────────────────────────
function SettingsPanel({
  onClose, onReset, prefs, onSave,
}: {
  onClose: () => void;
  onReset: () => void;
  prefs: { lyricsDefault: boolean; favAvatarMode: AvatarMode; seasonOverride: Season | null };
  onSave: (p: Partial<UserPrefs>) => void;
}) {
  const seasons: Array<Season | 'auto'> = ['auto', 'spring', 'summer', 'fall', 'winter'];
  const avatarModes: AvatarMode[] = ['runner', 'biker', 'parachutist', 'figure-skater', 'surfer', 'skier', 'none'];
  return (
    <div className="absolute inset-0 z-50 bg-[#1a1207]/95 rounded-2xl p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#C8A882] tracking-widest uppercase">⚙ Settings</h3>
        <button onClick={onClose} className="p-1 text-[#C8A882]/60 hover:text-[#C8A882]" aria-label="Close settings">✕</button>
      </div>
      <label className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#C8A882]/80">Show lyrics by default</span>
        <input type="checkbox" checked={prefs.lyricsDefault}
          onChange={(e) => onSave({ lyricsDefault: e.target.checked })}
          className="accent-[#D4A017] w-4 h-4" />
      </label>
      <div className="mb-3">
        <p className="text-xs text-[#C8A882]/60 mb-1.5">Default avatar</p>
        <div className="flex flex-wrap gap-1.5">
          {avatarModes.map((m) => (
            <button key={m} onClick={() => onSave({ favAvatarMode: m })}
              className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                prefs.favAvatarMode === m
                  ? 'border-[#D4A017] bg-[#D4A017]/20 text-[#D4A017]'
                  : 'border-[#5C3A1E]/50 text-[#C8A882]/60 hover:border-[#C8A882]/40'
              }`}>
              {AVATAR_EMOJI[m] || '—'} {m}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs text-[#C8A882]/60 mb-1.5">Season override</p>
        <div className="flex flex-wrap gap-1.5">
          {seasons.map((s) => (
            <button key={s} onClick={() => onSave({ seasonOverride: s === 'auto' ? null : (s as Season) })}
              className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                (s === 'auto' ? prefs.seasonOverride === null : prefs.seasonOverride === s)
                  ? 'border-[#D4A017] bg-[#D4A017]/20 text-[#D4A017]'
                  : 'border-[#5C3A1E]/50 text-[#C8A882]/60 hover:border-[#C8A882]/40'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <button onClick={onReset}
        className="w-full py-2 text-xs border border-[#5C3A1E]/60 text-[#C8A882]/50 rounded-lg hover:border-[#D4A017]/40 hover:text-[#C8A882]/80 transition-colors">
        Reset to Founder Defaults
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW 2 (right) — HOME FEATURED PLAYLIST PLAYER (Active/Jogger Experience)
// ─────────────────────────────────────────────────────────────────────────────
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const EXCLUDED_ARTISTS = ['sybc', 'wounded', 'willing'];

function isExcluded(t: Track): boolean {
  const titleUp = (t.title ?? '').toUpperCase();
  const artistLo = (t.artist ?? '').toLowerCase();
  if (titleUp.includes('INSTRO') || titleUp.includes('INSTRUMENTAL')) return true;
  if (titleUp.includes('KIDS') || titleUp.includes('KID TRACK')) return true;
  for (const ex of EXCLUDED_ARTISTS) { if (artistLo.includes(ex)) return true; }
  return false;
}

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  return `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, '0')}`;
}

function HomeFP({ onUnavailable }: { onUnavailable?: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  const speechRef = useRef<SpeechRecognition | null>(null);
  const playedAtRef = useRef<Map<string, number>>(new Map());

  const [tracks, setTracks] = useState<Track[]>([]);
  const [queue, setQueue] = useState<QueueTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [setComplete, setSetComplete] = useState(false);

  // Active/Jogger Experience state
  const [lyricsVisible, setLyricsVisible] = useState(false);
  const [avatarMode, setAvatarMode] = useState<AvatarMode>('runner');
  const [bgVideo, setBgVideo] = useState<{ src: string; poster?: string; scene: string; season: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<UserPrefs>(() => loadPrefs());
  const [currentMood, setCurrentMood] = useState('uplifting');

  // ── Fetch tracks + build T20 queue ─────────────────────────────────────────
  useEffect(() => {
    async function load() {
      if (!supabase) { setIsLoading(false); onUnavailable?.(); return; }
      const { data, error: dbErr } = await supabase
        .from('tracks')
        .select('id, title, artist, url, mood, bpm, duration_seconds')
        .not('url', 'is', null)
        .neq('url', '')
        .limit(200);

      if (dbErr || !data || data.length === 0) { setIsLoading(false); onUnavailable?.(); return; }

      const mapped: Track[] = (data as Record<string, unknown>[]).map((r) => ({
        id: r.id as number,
        title: (r.title as string) ?? 'Unknown',
        artist: (r.artist as string) ?? 'G Putnam Music',
        url: resolveUrl((r.url as string) ?? ''),
        mood: (r.mood as string) ?? undefined,
      }));

      const filtered = shuffleArr(mapped.filter((t) => !isExcluded(t) && t.url));
      setTracks(filtered);

      const qt: QueueTrack[] = (data as Record<string, unknown>[])
        .filter((r) => r.url && !isExcluded({ id: r.id as number, title: (r.title as string) ?? '', artist: (r.artist as string) ?? '', url: (r.url as string) ?? '' }))
        .map((r) => ({
          id: String(r.id),
          title: (r.title as string) ?? 'Unknown',
          artist: (r.artist as string) ?? 'G Putnam Music',
          url: resolveUrl((r.url as string) ?? ''),
          durationSeconds: (r.duration_seconds as number) ?? undefined,
          mood: (r.mood as string) ?? undefined,
          bpm: (r.bpm as number) ?? undefined,
        }));
      setQueue(buildT20Queue(qt));
      setIsLoading(false);
      if (filtered.length === 0) onUnavailable?.();
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Init prefs + lyrics default ─────────────────────────────────────────────
  useEffect(() => {
    const p = loadPrefs();
    setPrefs(p);
    setLyricsVisible(p.lyricsDefault);
    setAvatarMode(p.favAvatarMode);
  }, []);

  // ── Background video ─────────────────────────────────────────────────────────
  useEffect(() => {
    const bg = resolveBgVideo(currentMood, {
      sceneOverride: prefs.favLocations[0] as SceneKey | undefined,
      seasonOverride: prefs.seasonOverride ?? undefined,
      southernHemisphere: prefs.southernHemisphere,
    });
    setBgVideo(bg);
  }, [currentMood, prefs]);

  // ── Listen for T20 mood change / start-t20-session ──────────────────────────
  useEffect(() => {
    const onMood = (e: CustomEvent) => {
      if (e.detail?.mood) setCurrentMood((e.detail.mood as string).toLowerCase());
    };
    const onStartSession = (e: CustomEvent) => {
      if (queue.length > 0) {
        const played = new Set<string>(Array.from(playedAtRef.current.keys()) as string[]);
        setQueue(buildT20Queue(queue, played));
        setQueueIndex(0);
        setIsPlaying(true);
        setSetComplete(false);
      }
      if (e.detail?.mood) setCurrentMood((e.detail.mood as string).toLowerCase());
    };
    window.addEventListener('t20-mood-change', onMood as EventListener);
    window.addEventListener('start-t20-session', onStartSession as EventListener);
    return () => {
      window.removeEventListener('t20-mood-change', onMood as EventListener);
      window.removeEventListener('start-t20-session', onStartSession as EventListener);
    };
  }, [queue]);

  // ── Voice commands: "lyrics on/off" ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as Window & { SpeechRecognition?: typeof globalThis.SpeechRecognition; webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).SpeechRecognition
      || (window as Window & { webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) return;
    const sr = new SR();
    sr.continuous = true;
    sr.lang = 'en-US';
    sr.interimResults = false;
    sr.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript.toLowerCase().trim();
        if (t.includes('lyrics on'))  setLyricsVisible(true);
        if (t.includes('lyrics off')) setLyricsVisible(false);
        if (t.includes('avatar off')) setAvatarMode('none');
        if (t.includes('avatar on'))  setAvatarMode(prefs.favAvatarMode !== 'none' ? prefs.favAvatarMode : 'runner');
      }
    };
    try { sr.start(); } catch { /* already started */ }
    speechRef.current = sr;
    return () => { try { sr.stop(); } catch { /* already stopped */ } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-start once loaded ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && tracks.length > 0 && !isPlaying) {
      audioRef.current?.play()
        .then(() => { setIsPlaying(true); setAutoplayBlocked(false); })
        .catch(() => setAutoplayBlocked(true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tracks.length]);

  // ── No-repeat fallback ───────────────────────────────────────────────────────
  const getNextIndex = useCallback((from: number): number => {
    if (tracks.length === 0) return 0;
    const now = Date.now();
    for (const [id, ts] of playedAtRef.current.entries()) {
      if (now - ts > TWO_HOURS_MS) playedAtRef.current.delete(id);
    }
    for (let i = 1; i <= tracks.length; i++) {
      const c = (from + i) % tracks.length;
      if (!playedAtRef.current.has(String(tracks[c].id))) return c;
    }
    playedAtRef.current.clear();
    return (from + 1) % tracks.length;
  }, [tracks]);

  // ── Audio events ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur  = () => setDuration(audio.duration);
    const onEnded = () => {
      const list = queue.length > 0 ? queue : tracks;
      if (list[queueIndex]) playedAtRef.current.set(String(list[queueIndex].id), Date.now());
      const next = queueIndex + 1;
      if (queue.length > 0 && next >= queue.length) { setSetComplete(true); setIsPlaying(false); return; }
      setQueueIndex((p) => queue.length > 0 ? Math.min(p + 1, queue.length - 1) : getNextIndex(p));
    };
    const onError = () => {
      setError('Track unavailable — skipping…');
      setTimeout(() => {
        setQueueIndex((p) => queue.length > 0 ? Math.min(p + 1, queue.length - 1) : getNextIndex(p));
        setError('');
      }, 800);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [queueIndex, tracks, queue, getNextIndex]);

  // ── Play / pause ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying, queueIndex]);

  // ── Stop other players ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying) window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'home-fp' } }));
  }, [isPlaying]);
  useEffect(() => {
    const stop = (e: CustomEvent) => {
      if (e.detail?.source === 'home-fp') return;
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
    };
    window.addEventListener('stop-all-audio', stop as EventListener);
    return () => window.removeEventListener('stop-all-audio', stop as EventListener);
  }, [isPlaying]);

  // ── Scroll active lyric into view ────────────────────────────────────────────
  useEffect(() => {
    if (!lyricsVisible) return;
    const active = lyricsRef.current?.querySelector('[data-active="true"]') as HTMLElement | null;
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentTime, lyricsVisible]);

  // ── Preference helpers ───────────────────────────────────────────────────────
  const handlePrefSave = useCallback((partial: Partial<UserPrefs>) => {
    const updated = { ...prefs, ...partial };
    setPrefs(updated);
    savePrefs(partial);
    if (partial.favAvatarMode !== undefined) setAvatarMode(partial.favAvatarMode);
    if (partial.lyricsDefault !== undefined) setLyricsVisible(partial.lyricsDefault);
  }, [prefs]);

  const handleResetPrefs = useCallback(() => {
    resetPrefs();
    const d = { ...FOUNDER_DEFAULTS };
    setPrefs(d);
    setAvatarMode(d.favAvatarMode);
    setLyricsVisible(d.lyricsDefault);
    setSettingsOpen(false);
  }, []);

  const handleReShuffle = useCallback(() => {
    playedAtRef.current.clear();
    setQueue(buildT20Queue(queue.length > 0 ? queue : tracks.map((t) => ({ id: String(t.id), title: t.title, artist: t.artist ?? '', url: t.url ?? '' }))));
    setQueueIndex(0);
    setIsPlaying(true);
    setSetComplete(false);
  }, [queue, tracks]);

  // ── Controls ─────────────────────────────────────────────────────────────────
  const toggle = useCallback(() => { setAutoplayBlocked(false); setIsPlaying((p) => !p); }, []);
  const skipNext = useCallback(() => {
    const list = queue.length > 0 ? queue : tracks;
    if (list[queueIndex]) playedAtRef.current.set(String(list[queueIndex].id), Date.now());
    setQueueIndex((p) => queue.length > 0 ? Math.min(p + 1, queue.length - 1) : getNextIndex(p));
    setIsPlaying(true);
  }, [queueIndex, tracks, queue, getNextIndex]);
  const skipPrev = useCallback(() => {
    setQueueIndex((p) => p > 0 ? p - 1 : (queue.length > 0 ? queue.length : tracks.length) - 1);
    setIsPlaying(true);
  }, [tracks.length, queue.length]);

  // ── Current track + lyrics + avatar ──────────────────────────────────────────
  const activeList = queue.length > 0 ? queue : tracks;
  const current = activeList[queueIndex] as (QueueTrack | Track) | undefined;
  const lyrics = current ? getLyrics(current.title) : [];
  const activeLyricIdx = getActiveLyricIndex(lyrics, currentTime);
  const derivedAvatar: AvatarMode = (() => {
    if (avatarMode !== 'runner') return avatarMode;
    const qt = current as QueueTrack | undefined;
    if (qt?.mood || qt?.bpm) return defaultAvatarForMood(qt.mood ?? currentMood, qt.bpm);
    return avatarMode;
  })();

  // ── Render ────────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="w-full py-10 px-4 flex items-center justify-center gap-3 text-[#C8A882]/60">
      <span className="w-4 h-4 rounded-full bg-[#D4A017]/40 animate-pulse" />
      <span className="text-sm tracking-widest uppercase">Loading GPM Stream…</span>
    </div>
  );

  if (!current) return (
    <div className="w-full py-10 px-4 flex flex-col items-center justify-center gap-4 text-center">
      <span className="text-3xl opacity-40">📻</span>
      <p className="text-sm font-bold text-[#C8A882]/70 uppercase tracking-widest">GPM Live Stream</p>
      <p className="text-xs text-[#C8A882]/40">Catalog loading soon — check back shortly</p>
      <a href="mailto:Gputnam@gputnammusic.com"
        className="text-[10px] uppercase tracking-widest text-[#D4A017]/60 border border-[#D4A017]/20 rounded-full px-4 py-1.5 hover:border-[#D4A017]/50 transition-colors">
        Contact us
      </a>
    </div>
  );

  return (
    <div className="w-full py-6 px-4 md:py-8 md:px-6">
      <div className="max-w-md mx-auto md:max-w-none">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A882]/70 font-bold">
              GPM · 2-Hour No Repeat · All Original
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-900/40 border border-red-500/40 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-300">LIVE</span>
              </span>
            )}
            <button onClick={() => setSettingsOpen(true)}
              className="p-1.5 text-[#C8A882]/50 hover:text-[#C8A882] transition-colors text-sm"
              aria-label="Open settings">⚙</button>
          </div>
        </div>

        {/* 🎉 Set complete toast */}
        {setComplete && (
          <div className="mb-4 p-3 bg-[#2a1f0f] border border-[#D4A017]/50 rounded-xl text-center">
            <p className="text-[#D4A017] font-bold text-sm">🎉 2-hr set complete!</p>
            <button onClick={handleReShuffle}
              className="mt-2 text-xs text-[#C8A882]/70 underline hover:text-[#C8A882] transition-colors">
              Re-shuffle &amp; go again
            </button>
          </div>
        )}

        {/* Now-playing card */}
        <div className="bg-[#1a1207] rounded-2xl border border-[#5C3A1E]/40 overflow-hidden shadow-xl relative">

          {/* Background video */}
          {bgVideo?.src && (
            <video ref={videoRef} key={bgVideo.src} src={bgVideo.src} poster={bgVideo.poster}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              aria-hidden />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1207]/95 via-[#1a1207]/60 to-[#1a1207]/20 pointer-events-none" />

          {/* Avatar overlay */}
          {derivedAvatar !== 'none' && (
            <button onClick={() => setAvatarMode(nextAvatarMode(derivedAvatar))}
              className="absolute top-3 right-3 z-10 text-4xl opacity-30 hover:opacity-60 transition-opacity"
              aria-label="Cycle avatar mode" title={`Avatar: ${derivedAvatar} — tap to cycle`}>
              <span className="drop-shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                {AVATAR_EMOJI[derivedAvatar]}
              </span>
            </button>
          )}

          {/* Lyrics overlay */}
          {lyricsVisible && lyrics.length > 0 && (
            <div ref={lyricsRef}
              className="absolute inset-x-0 top-0 h-32 overflow-y-auto z-10 px-6 pt-4 pb-2 pointer-events-none"
              aria-live="polite">
              {lyrics.map((line, i) => (
                <p key={i} data-active={i === activeLyricIdx ? 'true' : 'false'}
                  className={`text-center text-sm leading-relaxed transition-all duration-300 ${
                    i === activeLyricIdx
                      ? 'text-white font-bold scale-105'
                      : i < (activeLyricIdx ?? -1) ? 'text-[#C8A882]/30' : 'text-[#C8A882]/50'
                  }`}>
                  {line.text}
                </p>
              ))}
            </div>
          )}

          {/* Track info */}
          <div className="relative z-10 px-6 pt-6 pb-4">
            {autoplayBlocked && (
              <button onClick={toggle}
                className="w-full mb-4 py-3 px-4 rounded-xl border-2 border-[#D4A017] bg-[#D4A017]/10 hover:bg-[#D4A017]/20 transition-all animate-pulse"
                aria-label="Start streaming">
                <span className="flex items-center justify-center gap-2 text-[#D4A017] font-black text-sm tracking-widest uppercase">
                  ▶ Tap to Start Your GPM Stream
                </span>
                <span className="block text-[10px] text-[#C8A882]/50 mt-0.5 tracking-wide">Non-stop original music — no ads</span>
              </button>
            )}
            {error && <p className="text-amber-400/70 text-xs mb-2">{error}</p>}
            <p className="text-[10px] text-[#C8A882]/50 uppercase tracking-widest mb-1">
              {isPlaying ? 'Now Streaming' : 'Ready'}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight truncate">{current.title}</h2>
            <p className="text-[#C8A882]/70 text-sm mt-0.5 truncate">
              {'artist' in current ? (current as Track).artist : ''}
            </p>
          </div>

          {/* Seek bar */}
          <div className="relative z-10 px-6 pb-2">
            <div className="flex items-center gap-2 text-xs text-[#C8A882]/40">
              <span className="w-8 text-right tabular-nums">{fmtTime(currentTime)}</span>
              <input type="range" min={0} max={duration || 0} value={currentTime}
                onChange={(e) => { const t = parseFloat(e.target.value); if (audioRef.current) audioRef.current.currentTime = t; setCurrentTime(t); }}
                className="flex-1 h-1 cursor-pointer accent-[#D4A017]"
                aria-label="Seek"
                style={{ background: `linear-gradient(to right, #D4A017 ${duration ? (currentTime / duration) * 100 : 0}%, #3a2510 0%)` }}
              />
              <span className="w-8 tabular-nums">{fmtTime(duration)}</span>
            </div>
          </div>

          {/* Transport controls */}
          <div className="relative z-10 px-6 pb-5 pt-2 flex items-center justify-between">
            <button onClick={skipPrev}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C8A882]/60 hover:text-[#C8A882] transition-colors"
              aria-label="Previous track">⏮</button>
            <button onClick={toggle}
              className="w-14 h-14 rounded-full bg-[#D4A017] hover:bg-[#E8C030] active:scale-95 flex items-center justify-center shadow-lg transition-all text-xl"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{ color: '#1a1207' }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={skipNext}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#C8A882]/60 hover:text-[#C8A882] transition-colors"
              aria-label="Next track">⏭</button>
          </div>

          {/* Lyrics toggle (🎤 bottom-center) */}
          <div className="relative z-10 flex justify-center pb-4">
            <button onClick={() => setLyricsVisible((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest transition-colors ${
                lyricsVisible
                  ? 'border-[#D4A017] text-[#D4A017] bg-[#D4A017]/10'
                  : 'border-[#5C3A1E]/50 text-[#C8A882]/40 hover:border-[#C8A882]/40 hover:text-[#C8A882]/70'
              }`}
              aria-label={lyricsVisible ? 'Hide lyrics' : 'Show lyrics'}>
              🎤 {lyricsVisible ? 'Lyrics On' : 'Lyrics Off'}
            </button>
          </div>

          {/* Settings panel overlay */}
          {settingsOpen && (
            <SettingsPanel onClose={() => setSettingsOpen(false)} onReset={handleResetPrefs}
              prefs={prefs} onSave={handlePrefSave} />
          )}
        </div>

        {/* Footer meta */}
        <p className="text-center text-[10px] text-[#C8A882]/30 mt-4 tracking-wide">
          {queue.length > 0
            ? `Track ${queueIndex + 1} of ${queue.length} · 2-hr no-repeat queue`
            : `${tracks.length} tracks · 2-hr no-repeat`
          } · Independent from SYBC Band &amp; Wounded &amp; Willing
        </p>
      </div>
      <audio ref={audioRef} src={current?.url ?? ''} preload="auto" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// T20 ACTIVITY DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
interface Activity {
  id: string; emoji: string; label: string; mood: string; accent: string;
}

const T20_ACTIVITIES: Activity[] = [
  { id: 'driving',    emoji: '🚗', label: 'Driving',         mood: 'driving',     accent: '#D4A017' },
  { id: 'workout',    emoji: '💪', label: 'Workout / Gym',   mood: 'energy',      accent: '#C04000' },
  { id: 'morning',    emoji: '☀️',  label: 'Morning Routine', mood: 'uplifting',   accent: '#E8B828' },
  { id: 'focus',      emoji: '💻', label: 'Work / Focus',    mood: 'focus',       accent: '#5C8A3C' },
  { id: 'road-trip',  emoji: '🛣️',  label: 'Road Trip',       mood: 'road trip',   accent: '#D4A017' },
  { id: 'running',    emoji: '🏃', label: 'Running',         mood: 'high energy', accent: '#C04000' },
  { id: 'cooking',    emoji: '🍳', label: 'Cooking',         mood: 'happy',       accent: '#C8A882' },
  { id: 'dinner',     emoji: '🍽️', label: 'Dinner Time',     mood: 'dinner',      accent: '#8B6914' },
  { id: 'party',      emoji: '🎉', label: 'Party',           mood: 'party',       accent: '#9B2FA0' },
  { id: 'romance',    emoji: '❤️',  label: 'Date Night',      mood: 'romantic',    accent: '#C0392B' },
  { id: 'yoga',       emoji: '🧘', label: 'Yoga / Mindful',  mood: 'calm',        accent: '#5C8A3C' },
  { id: 'chill',      emoji: '🛋️', label: 'Chill / Relax',   mood: 'relaxing',    accent: '#3A7BBF' },
  { id: 'wind-down',  emoji: '🌙', label: 'Wind Down',       mood: 'melancholy',  accent: '#2C3E6B' },
  { id: 'study',      emoji: '📚', label: 'Studying',        mood: 'focus',       accent: '#5C8A3C' },
  { id: 'outdoor',    emoji: '🌲', label: 'Outdoors',        mood: 'adventurous', accent: '#3A7A3A' },
  { id: 'beach',      emoji: '🏖️', label: 'Beach / Summer',  mood: 'summer',      accent: '#2A8FA0' },
  { id: 'gaming',     emoji: '🎮', label: 'Gaming',          mood: 'high energy', accent: '#7B2FA0' },
  { id: 'coffee',     emoji: '☕', label: 'Coffee Shop',     mood: 'dreamy',      accent: '#8B6914' },
  { id: 'background', emoji: '🎵', label: 'Background',      mood: 'background',  accent: '#C8A882' },
  { id: 'commute',    emoji: '🚇', label: 'Commute',         mood: 'uplifting',   accent: '#D4A017' },
];

function chunkArr<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function ActivityTile({ activity, isActive, isFlashing, onClick }: {
  activity: Activity; isActive: boolean; isFlashing: boolean; onClick: (a: Activity) => void;
}) {
  return (
    <button onClick={() => onClick(activity)}
      className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-200 min-h-[80px] md:min-h-[96px] px-2 py-3 w-full active:scale-95
        ${isFlashing ? 'scale-105 brightness-150 duration-75' : ''}
        ${isActive
          ? 'bg-[#2a1f0f] border-[#D4A017] shadow-[0_0_18px_rgba(212,160,23,0.6)]'
          : 'bg-[#1a1207] border-[#5C3A1E]/40 hover:border-[#C8A882]/60 hover:bg-[#221508]'
        }`}
      aria-label={`Stream ${activity.label}`}
      style={isFlashing ? { boxShadow: `0 0 32px ${activity.accent}99` } : undefined}>
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl transition-opacity duration-200"
        style={{ background: activity.accent, opacity: isActive ? 1 : 0.35 }} />
      <span className={`text-xl md:text-2xl leading-none transition-transform duration-75 ${isFlashing ? 'scale-125' : ''}`} role="img" aria-hidden>
        {activity.emoji}
      </span>
      <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider leading-tight text-center transition-colors ${
        isActive ? 'text-[#D4A017]' : 'text-[#C8A882]/70 group-hover:text-[#C8A882]'
      }`}>{activity.label}</span>
      {isActive && (
        <span className="absolute bottom-1.5 inline-flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-[3px] rounded-full bg-[#D4A017] animate-pulse"
              style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW 3 — T20 GRID (Top 20 streaming activities)
// ─────────────────────────────────────────────────────────────────────────────
function T20Grid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [mobileGroups, setMobileGroups] = useState<Activity[][]>(() =>
    chunkArr(shuffleArr(T20_ACTIVITIES), 3)
  );
  const [groupIndex, setGroupIndex] = useState(0);
  const groupCount = mobileGroups.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setGroupIndex((prev) => {
        const next = (prev + 1) % groupCount;
        if (next === 0) setMobileGroups(chunkArr(shuffleArr(T20_ACTIVITIES), 3));
        return next;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, [groupCount]);

  const sbRef = useRef<ReturnType<typeof createClient> | null>(null);
  useEffect(() => {
    if (supabase) sbRef.current = supabase;
  }, []);

  const handleTileClick = useCallback(async (activity: Activity) => {
    setFlashingId(activity.id);
    setTimeout(() => setFlashingId(null), 400);
    setActiveId(activity.id);

    window.dispatchEvent(new CustomEvent('t20-mood-change', { detail: { mood: activity.label, emoji: activity.emoji } }));
    window.dispatchEvent(new CustomEvent('start-t20-session', { detail: { mood: activity.mood, label: activity.label, emoji: activity.emoji } }));

    const sb = sbRef.current;
    if (!sb) return;
    try {
      let { data: tracks } = await sb.from('tracks').select('id, title, artist, url')
        .ilike('mood', `%${activity.mood}%`).not('url', 'is', null).neq('url', '').limit(30);
      if (!tracks || tracks.length === 0) {
        const { data: fallback } = await sb.from('tracks').select('id, title, artist, url')
          .not('url', 'is', null).neq('url', '').limit(10);
        tracks = fallback ?? [];
      }
      if (tracks && tracks.length > 0) {
        const pick = tracks[Math.floor(Math.random() * tracks.length)];
        const rawUrl = (pick.url as string) ?? '';
        const resolved = rawUrl.startsWith('http') ? rawUrl
          : `${STORAGE_BASE}${rawUrl.split('/').pop()}`;
        window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 't20' } }));
        window.dispatchEvent(new CustomEvent('play-track', { detail: {
          url: resolved,
          title: (pick.title as string) ?? activity.label,
          vocalist: (pick.artist as string) ?? 'G Putnam Music',
          moodTheme: { primary: activity.accent },
        }}));
      }
    } catch (err) {
      console.error('T20Grid: failed to load tracks for activity', activity.id, err);
    }
  }, []);

  const mobileTiles = mobileGroups[groupIndex] ?? [];

  return (
    <section className="w-full bg-[#110d06] border-t border-[#5C3A1E]/20 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A882]/50 mb-0.5">GPM — gtmplt Amber</p>
            <h2 className="text-sm md:text-base font-bold text-[#C8A882] tracking-wide">Top 20 Streaming Activities</h2>
          </div>
          <div className="md:hidden flex items-center gap-1">
            {mobileGroups.map((_, i) => (
              <button key={i} onClick={() => setGroupIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === groupIndex ? 'bg-[#D4A017] w-3' : 'bg-[#5C3A1E]/60'}`}
                aria-label={`Show group ${i + 1}`} />
            ))}
          </div>
        </div>
        {/* Desktop: all 20 in grid */}
        <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-10 gap-2">
          {T20_ACTIVITIES.map((activity) => (
            <ActivityTile key={activity.id} activity={activity}
              isActive={activeId === activity.id} isFlashing={flashingId === activity.id}
              onClick={handleTileClick} />
          ))}
        </div>
        {/* Mobile: 3-tile carousel */}
        <div className="md:hidden grid grid-cols-3 gap-2">
          {mobileTiles.map((activity) => (
            <ActivityTile key={activity.id} activity={activity}
              isActive={activeId === activity.id} isFlashing={flashingId === activity.id}
              onClick={handleTileClick} />
          ))}
        </div>
        <p className="md:hidden text-center text-[9px] text-[#C8A882]/30 mt-3 tracking-wide">
          Tap any activity · Rotates every 60 s · All 20 shown per cycle
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — Strictly locked 4-row template (STI / BTI / STO)
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [heroIdx, setHeroIdx]             = useState(0);
  const [fading, setFading]               = useState(false);
  const [streamUnavailable, setStreamUnavailable] = useState(false);

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
        <McBot streamUnavailable={streamUnavailable} />
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
        <div id="stream" className="flex flex-col justify-center bg-[#110d06] border-l border-[#5C3A1E]/20">
          <HomeFP onUnavailable={() => setStreamUnavailable(true)} />
        </div>
      </section>

      {/* ─── ROW 3: T20Grid (BTI body row 2) ──────────────────────────────────── */}
      <T20Grid />

      {/* ─── ROW 4: STO GPM Footer ────────────────────────────────────────────── */}
      <GpmFooter />
    </>
  );
}
