'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FALLBACK_KUTS, FALLBACK_MKUTS, FALLBACK_KPDS } from '@/lib/featuredKuts';
import type { KutItem } from '@/lib/featuredKuts';

// ─── Top-5 emotion tags steered toward across KKs, mKs, KPDs ───────────────
const FP_EMOTIONS = [
  { label: 'Wounded & Willing', tag: 'healing',    icon: '◆', color: 'border-amber-400/60 text-amber-300 hover:border-amber-400 hover:bg-amber-400/10' },
  { label: 'Love Renews',       tag: 'love_renews', icon: '◈', color: 'border-rose-400/60 text-rose-300 hover:border-rose-400 hover:bg-rose-400/10' },
  { label: 'High Energy',       tag: 'energy',      icon: '⬢', color: 'border-yellow-400/60 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-400/10' },
  { label: 'Heart Tap',         tag: 'emotional',   icon: '◈', color: 'border-pink-400/60 text-pink-300 hover:border-pink-400 hover:bg-pink-400/10' },
  { label: 'Melancholy Blues',  tag: 'melancholy',  icon: '◇', color: 'border-blue-400/60 text-blue-300 hover:border-blue-400 hover:bg-blue-400/10' },
  { label: 'Any / Surprise Me', tag: '__random__',  icon: '✦', color: 'border-white/20 text-white/60 hover:border-white/50 hover:bg-white/5' },
] as const;

type EmotionTag = (typeof FP_EMOTIONS)[number]['tag'];

// Pool all fallback items from every invention
const ALL_ITEMS: KutItem[] = [
  ...FALLBACK_KUTS,
  ...FALLBACK_MKUTS,
  ...FALLBACK_KPDS,
];

function pickByEmotion(tag: EmotionTag): KutItem[] {
  if (tag === '__random__') {
    // shuffle all, return up to 6
    return [...ALL_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
  }
  const matched = ALL_ITEMS.filter((k) => k.tags?.includes(tag));
  return matched.length > 0 ? matched : ALL_ITEMS.slice(0, 6);
}

// MSJ / Michael Scherer items for donation banner
const MSJ_TAGS = ['healing', 'wounded'];
function isMSJ(k: KutItem) {
  return MSJ_TAGS.some((t) => k.tags?.toLowerCase().includes(t)) ||
    k.artist?.toLowerCase().includes('michael') ||
    k.title?.toLowerCase().includes('wounded');
}

export default function FrontPanel() {
  const [selected, setSelected] = useState<EmotionTag | null>(null);
  const [playlist, setPlaylist] = useState<KutItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Select an emotion and build playlist
  const chooseEmotion = useCallback((tag: EmotionTag) => {
    setSelected(tag);
    const items = pickByEmotion(tag);
    setPlaylist(items);
    setActiveIdx(0);
    setIsPlaying(false);
  }, []);

  // Auto-start with 'Wounded & Willing' on mount
  useEffect(() => {
    chooseEmotion('healing');
  }, [chooseEmotion]);

  // When playlist/index changes, load audio
  useEffect(() => {
    const item = playlist[activeIdx];
    if (!item) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => {
        setActiveIdx((i) => (i + 1) % playlist.length);
      });
    }
    if (item.url) {
      audioRef.current.src = item.url;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, activeIdx]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const item = playlist[activeIdx];
    if (!item?.url) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.src !== item.url) audio.src = item.url;
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const activeItem = playlist[activeIdx];
  const hasMSJ = playlist.some(isMSJ);

  return (
    <section
      className="w-full max-w-2xl mx-auto mb-12 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 flex flex-col gap-6"
      aria-label="Front Panel — Pick a feeling and start playing"
    >
      {/* Headline */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-1">
          Three Ways To Share a Feeling & a Place in History
        </p>
        <h2 className="text-xl font-bold text-white tracking-tight">
          How are you feeling right now?
        </h2>
        <p className="text-xs text-white/40 mt-1">
          Pick one — or let us surprise you — and start listening immediately.
        </p>
      </div>

      {/* Emotion buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {FP_EMOTIONS.map((e) => (
          <button
            key={e.tag}
            onClick={() => chooseEmotion(e.tag)}
            className={[
              'px-4 py-2 rounded-full border text-sm font-medium transition-all',
              e.color,
              selected === e.tag ? 'ring-2 ring-white/30 scale-105' : '',
            ].join(' ')}
          >
            {e.icon}  {e.label}
          </button>
        ))}
      </div>

      {/* Now Playing strip */}
      {activeItem && (
        <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-amber-400/60 text-amber-300 hover:bg-amber-400/10 transition-all flex-shrink-0 text-lg"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{activeItem.title}</p>
            <p className="text-xs text-white/40 truncate">{activeItem.artist}</p>
          </div>

          {/* Invention type badge */}
          <span className={[
            'text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0',
            activeItem.type === 'K-KUT' ? 'border-amber-400/40 text-amber-400/80' :
            activeItem.type === 'mK'    ? 'border-[#8B5E3C]/60 text-[#C8A882]/80' :
                                          'border-rose-400/40 text-rose-400/80',
          ].join(' ')}>
            {activeItem.type}
          </span>

          {/* Track counter */}
          {playlist.length > 1 && (
            <span className="text-[10px] text-white/30 flex-shrink-0">
              {activeIdx + 1}/{playlist.length}
            </span>
          )}
        </div>
      )}

      {/* Skip row */}
      {playlist.length > 1 && (
        <div className="flex justify-center gap-2">
          {playlist.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveIdx(i); setIsPlaying(false); }}
              className={[
                'w-2 h-2 rounded-full transition-all',
                i === activeIdx ? 'bg-amber-400 scale-125' : 'bg-white/20 hover:bg-white/40',
              ].join(' ')}
              aria-label={`Track ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* MSJ / Michael Scherer donation banner — shown when Wounded & Willing is in playlist */}
      {hasMSJ && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-center">
          <p className="text-xs text-amber-300/90 leading-relaxed">
            <span className="font-semibold">Help Michael Scherer (MSJ)</span> — dad of 3,
            house-band co-writer, currently in &amp; out of ICU with severe auto-immune illness.
            <span className="text-white/50"> 90% of G Putnam Music&apos;s income from every MSJ K-KUT</span>
            {' '}goes directly to his bank. Real. Documented. Every purchase matters.
          </p>
          <p className="mt-1 text-[10px] text-amber-400/60 uppercase tracking-widest">
            Playing MSJ tracks supports Michael directly
          </p>
        </div>
      )}
    </section>
  );
}
