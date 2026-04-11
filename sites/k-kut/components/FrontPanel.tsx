"use client";

/**
 * FrontPanel — Live Audio Preview Panel
 *
 * Plays real audio snippets from Supabase Storage bucket "AUDIO"
 * for all three K-KUT invention types: K-KUT (KK), mini-KUT (mK),
 * and K-kUpId (KPD).
 *
 * Autoplay compliance: audio only begins after the first user gesture
 * (tap on a snippet card or the play button).  Never silent due to
 * missing URLs — every error path is surfaced to the user gracefully.
 */

import { useState, useRef, useEffect, useCallback } from "react";

/* ─── Types ──────────────────────────────────────────────── */

type InventionType = "K-KUT" | "mK" | "KPD";

interface Snippet {
  id: string;
  title: string;
  /** Short label shown under the title (section name, romance level, etc.) */
  tag: string;
  /** Path inside the "AUDIO" Supabase Storage bucket */
  bucketPath: string;
  inventionType: InventionType;
}

/* ─── Snippet catalogue ─────────────────────────────────── */

/**
 * Returns the public URL for a file inside the "AUDIO" bucket.
 * Falls back to the placeholder Supabase project URL so the component
 * can be rendered even without env-vars set (build-time).
 */
function audioUrl(bucketPath: string): string {
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://lbzpfqarraegkghxwbah.supabase.co";
  return `${base}/storage/v1/object/public/AUDIO/${bucketPath}`;
}

const SNIPPETS: Record<InventionType, Snippet[]> = {
  "K-KUT": [
    {
      id: "kk-1",
      title: "LOVE RENEWS",
      tag: "Chorus · Ch1",
      bucketPath: "k-kut/love-renews-ch1.mp3",
      inventionType: "K-KUT",
    },
    {
      id: "kk-2",
      title: "STARTS WITH ME",
      tag: "Bridge · BR",
      bucketPath: "k-kut/starts-with-me-br.mp3",
      inventionType: "K-KUT",
    },
    {
      id: "kk-3",
      title: "STILL HERE",
      tag: "Verse 2 · V2",
      bucketPath: "k-kut/still-here-v2.mp3",
      inventionType: "K-KUT",
    },
  ],
  mK: [
    {
      id: "mk-1",
      title: "RISE UP",
      tag: "mini-KUT · LOVE RENEWS",
      bucketPath: "mk/love-renews-rise-up.mp3",
      inventionType: "mK",
    },
    {
      id: "mk-2",
      title: "FOREVER",
      tag: "mini-KUT · LOVE RENEWS",
      bucketPath: "mk/love-renews-forever.mp3",
      inventionType: "mK",
    },
    {
      id: "mk-3",
      title: "FORGIVE ME",
      tag: "mini-KUT · STARTS WITH ME",
      bucketPath: "mk/starts-with-me-forgive-me.mp3",
      inventionType: "mK",
    },
  ],
  KPD: [
    {
      id: "kpd-1",
      title: "LOVE RENEWS",
      tag: "Interest · Level 01",
      bucketPath: "kpd/interest-love-renews.mp3",
      inventionType: "KPD",
    },
    {
      id: "kpd-2",
      title: "STILL HERE",
      tag: "Love · Level 03",
      bucketPath: "kpd/love-still-here.mp3",
      inventionType: "KPD",
    },
    {
      id: "kpd-3",
      title: "LOVE RENEWS",
      tag: "Forever · Level 05",
      bucketPath: "kpd/forever-love-renews.mp3",
      inventionType: "KPD",
    },
  ],
};

/* ─── Design constants ──────────────────────────────────── */

const TAB_META: Record<
  InventionType,
  { label: string; accent: string; dimAccent: string; description: string }
> = {
  "K-KUT": {
    label: "K-KUT",
    accent: "#00e5ff",
    dimAccent: "rgba(0,229,255,0.15)",
    description: "Exact-excerpt audio — whole song sections",
  },
  mK: {
    label: "mini-KUT",
    accent: "#8B5E3C",
    dimAccent: "rgba(139,94,60,0.2)",
    description: "Exact audio micro-assets — words, phrases, hooks",
  },
  KPD: {
    label: "K-kUpId",
    accent: "#ff69b4",
    dimAccent: "rgba(255,105,180,0.15)",
    description: "Romance audio — Interest → Date → Love → Sex → Forever",
  },
};

const TAB_ORDER: InventionType[] = ["K-KUT", "mK", "KPD"];

/* ─── Helpers ───────────────────────────────────────────── */

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Component ─────────────────────────────────────────── */

export default function FrontPanel() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** Tracks the last URL we assigned to the audio element to avoid reloading the same src. */
  const prevUrlRef = useRef<string | null>(null);

  const [activeTab, setActiveTab] = useState<InventionType>("K-KUT");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorId, setErrorId] = useState<string | null>(null);
  /** Whether the panel is waiting for the very first user gesture */
  const [gestureRequired, setGestureRequired] = useState(true);

  /* Build the full URL for the currently selected snippet */
  const selectedSnippet = SNIPPETS[activeTab].find((s) => s.id === selectedId);
  const currentUrl = selectedSnippet
    ? audioUrl(selectedSnippet.bucketPath)
    : null;

  /* ── Combined load + play/pause effect ─────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const urlChanged = currentUrl !== prevUrlRef.current;

    if (urlChanged) {
      prevUrlRef.current = currentUrl ?? null;

      if (!currentUrl) {
        audio.src = "";
        audio.pause();
        return;
      }

      setCurrentTime(0);
      setDuration(0);
      setErrorId(null);
      audio.src = currentUrl;
      audio.load();
    }

    if (!currentUrl) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        if (selectedSnippet) setErrorId(selectedSnippet.id);
      });
    } else {
      audio.pause();
    }
  }, [currentUrl, isPlaying, selectedSnippet]);

  /* ── Audio event listeners ──────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      if (selectedSnippet) setErrorId(selectedSnippet.id);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [repeat, selectedSnippet]);

  /* ── Stop-all-audio global bus ──────────────────────────── */
  useEffect(() => {
    if (isPlaying) {
      window.dispatchEvent(
        new CustomEvent("stop-all-audio", { detail: { source: "front-panel" } })
      );
    }
  }, [isPlaying]);

  useEffect(() => {
    const stop = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.source !== "front-panel" && isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("stop-all-audio", stop);
    return () => window.removeEventListener("stop-all-audio", stop);
  }, [isPlaying]);

  /* ── Controls ────────────────────────────────────────────── */

  const handleSnippetTap = useCallback(
    (snippet: Snippet) => {
      setErrorId(null);
      setGestureRequired(false);

      if (snippet.id === selectedId) {
        // Toggle play/pause on the same snippet
        setIsPlaying((prev) => !prev);
        return;
      }

      // Switch to new snippet — playback starts automatically via the
      // currentUrl effect once gestureRequired is false.
      setSelectedId(snippet.id);
      setIsPlaying(true);
    },
    [selectedId]
  );

  const handleStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const t = parseFloat(e.target.value);
      audio.currentTime = t;
      setCurrentTime(t);
    },
    []
  );

  const handleTabChange = useCallback(
    (tab: InventionType) => {
      setActiveTab(tab);
      // Auto-select first snippet in new tab if something is already playing
      if (!gestureRequired) {
        const first = SNIPPETS[tab][0];
        setSelectedId(first.id);
        setIsPlaying(true);
      } else {
        setSelectedId(null);
        setIsPlaying(false);
      }
      setCurrentTime(0);
      setDuration(0);
      setErrorId(null);
    },
    [gestureRequired]
  );

  /* ── Derived ─────────────────────────────────────────────── */
  const { accent, dimAccent, description } = TAB_META[activeTab];
  const snippets = SNIPPETS[activeTab];

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div
      className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-sm overflow-hidden"
      style={{ boxShadow: `0 0 40px ${dimAccent}` }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* ── Header / Tabs ─────────────────────────────────────── */}
      <div className="border-b border-[var(--border)] flex">
        {TAB_ORDER.map((tab) => {
          const m = TAB_META[tab];
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className="flex-1 px-3 py-3 text-[10px] uppercase tracking-widest font-semibold transition-colors relative"
              style={{
                color: active ? m.accent : "var(--text-muted)",
                background: active ? m.dimAccent : "transparent",
              }}
              aria-label={`Play ${m.label} snippets`}
              aria-pressed={active}
            >
              {m.label}
              {active && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: m.accent }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Description ───────────────────────────────────────── */}
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-4 pt-3 pb-0.5">
        {description}
      </p>

      {/* ── Snippet Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
        {snippets.map((snippet) => {
          const isSelected = snippet.id === selectedId;
          const hasError = errorId === snippet.id;

          return (
            <button
              key={snippet.id}
              onClick={() => handleSnippetTap(snippet)}
              className="text-left border rounded-sm px-4 py-3 transition-all active:scale-[0.98]"
              style={{
                borderColor: isSelected ? accent : "var(--border)",
                background: isSelected ? dimAccent : "var(--bg)",
              }}
              aria-label={`${isPlaying && isSelected ? "Pause" : "Play"} ${snippet.title} — ${snippet.tag}`}
            >
              {/* Play / Pause indicator */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-lg leading-none"
                  style={{ color: isSelected ? accent : "var(--text-muted)" }}
                  aria-hidden="true"
                >
                  {isSelected && isPlaying ? "⏸" : "▶"}
                </span>
                {hasError && (
                  <span className="text-[9px] uppercase tracking-widest text-red-400">
                    unavailable
                  </span>
                )}
              </div>

              <p
                className="text-sm font-bold leading-snug"
                style={{ color: isSelected ? accent : "var(--text)" }}
              >
                {snippet.title}
              </p>
              <p
                className="text-[10px] uppercase tracking-widest mt-0.5"
                style={{
                  color: isSelected ? accent : "var(--text-muted)",
                  opacity: isSelected ? 1 : 0.7,
                }}
              >
                {snippet.tag}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Gesture gate overlay ──────────────────────────────── */}
      {gestureRequired && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setGestureRequired(false);
              const first = SNIPPETS[activeTab][0];
              setSelectedId(first.id);
              setIsPlaying(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{ background: accent, color: "#030712" }}
            aria-label="Tap to begin audio playback"
          >
            <span aria-hidden="true">▶</span> Tap to Hear
          </button>
          <p className="text-[10px] text-[var(--text-subtle)] max-w-[180px] leading-relaxed">
            Tap a snippet or the button to begin playback.
          </p>
        </div>
      )}

      {/* ── Player Bar ────────────────────────────────────────── */}
      {!gestureRequired && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3">
          {/* Track info */}
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0 flex-1 pr-4">
              {selectedSnippet ? (
                <>
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: accent }}
                  >
                    {selectedSnippet.title}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate uppercase tracking-widest">
                    {selectedSnippet.tag}
                  </p>
                </>
              ) : (
                <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-widest">
                  Select a snippet above
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Stop */}
              <button
                onClick={handleStop}
                disabled={!selectedSnippet}
                className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors disabled:opacity-30"
                style={{ color: accent }}
                aria-label="Stop"
                title="Stop"
              >
                <StopIcon />
              </button>

              {/* Play / Pause */}
              <button
                onClick={() => {
                  if (!selectedSnippet) {
                    const first = SNIPPETS[activeTab][0];
                    setSelectedId(first.id);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying((p) => !p);
                  }
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95"
                style={{ background: accent, color: "#030712" }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              {/* Repeat */}
              <button
                onClick={() => setRepeat((r) => !r)}
                className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors"
                style={{
                  color: repeat ? accent : "var(--text-muted)",
                  background: repeat ? dimAccent : "transparent",
                }}
                aria-label={repeat ? "Repeat on" : "Repeat off"}
                aria-pressed={repeat}
                title="Repeat"
              >
                <RepeatIcon />
              </button>
            </div>
          </div>

          {/* Seek bar */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-[var(--text-subtle)] w-8 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              disabled={!duration}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer disabled:cursor-default"
              style={{ accentColor: accent }}
              aria-label="Seek"
            />
            <span className="text-[9px] text-[var(--text-subtle)] w-8 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Icon helpers (inline SVG — no external dependency) ─── */

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 2.5L11.5 7 3 11.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="2" width="2.5" height="10" rx="0.5" />
      <rect x="8.5" y="2" width="2.5" height="10" rx="0.5" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="9" height="9" rx="1" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="10,2 12,4 10,6" />
      <path d="M2 7v-1a4 4 0 0 1 4-4h6" />
      <polyline points="4,8 2,10 4,12" />
      <path d="M12 7v1a4 4 0 0 1-4 4H2" />
    </svg>
  );
}
