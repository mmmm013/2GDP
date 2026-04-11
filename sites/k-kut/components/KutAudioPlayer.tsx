"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   KutAudioPlayer
   Calls the appropriate Supabase edge function for each
   invention type, receives a signed URL, and plays it via
   the HTML5 Audio API.

   Priority order for URL resolution:
     1. demoSrc        — direct URL, no edge call (static demo)
     2. audioPath      — calls get-audio-url (AUDIO bucket, no DB)
                         USE THIS when files exist in the AUDIO
                         bucket but k_kut_assets rows don't yet.
     3. kutId / pixPckId+tag — calls invention-specific edge fn
                         (requires k_kut_assets DB rows)

   Invention routing (when using kutId/pixPckId):
     KK  → POST /functions/v1/play-k-kut
     mK  → POST /functions/v1/play-m-kut    (public, no auth)
     KPD → POST /functions/v1/play-k-kupid

   audioPath routing:
     Any → POST /functions/v1/get-audio-url  { bucket, path }
   ═══════════════════════════════════════════════════════════ */

type Invention = "KK" | "mK" | "KPD";
type PlayerState =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "error"
  | "unavailable";

export interface KutAudioPlayerProps {
  /** One of: kutId, or pixPckId+tag */
  kutId?: string;
  pixPckId?: string;
  tag?: string;
  /** Invention type determines which edge function is called */
  invention?: Invention;
  /** KPD only — Interest | Date | Love | Sex | Forever */
  romanceLevel?: string;
  /**
   * Direct AUDIO-bucket path — bypasses k_kut_assets DB lookup entirely.
   * Use this when MP3 files exist in the AUDIO bucket but no DB rows yet.
   * Convention:
   *   KK  → "k-kut/<slug>-<section>.mp3"  e.g. "k-kut/love-renews-Ch1.mp3"
   *   mK  → "mk/<slug>-<phrase>.mp3"       e.g. "mk/love-renews-rise-up.mp3"
   *   KPD → "kpd/<level>-<slug>.mp3"       e.g. "kpd/interest-find-me.mp3"
   */
  audioPath?: string;
  /** Override bucket name when using audioPath (default: "AUDIO") */
  audioBucket?: string;
  /** Display label shown next to play button */
  label?: string;
  /** "r,g,b" accent color string */
  color?: string;
  /** Direct audio URL — bypasses edge function (for future direct-upload demos) */
  demoSrc?: string;
}

const EDGE_FN: Record<Invention, string> = {
  KK:  "play-k-kut",
  mK:  "play-m-kut",
  KPD: "play-k-kupid",
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function KutAudioPlayer({
  kutId,
  pixPckId,
  tag,
  invention = "mK",
  romanceLevel,
  audioPath,
  audioBucket = "AUDIO",
  label,
  color = "0,229,255",
  demoSrc,
}: KutAudioPlayerProps) {
  const [state, setState] = useState<PlayerState>("idle");
  const [progress, setProgress] = useState(0);   // 0–1
  const [elapsed, setElapsed]   = useState(0);   // seconds
  const [duration, setDuration] = useState(0);   // seconds
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef   = useRef<number | null>(null);

  // ── clean up on unmount ──────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // ── progress RAF loop ────────────────────────────────────
  const tick = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!isNaN(a.duration) && a.duration > 0) {
      setElapsed(a.currentTime);
      setProgress(a.currentTime / a.duration);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── wire audio element events ────────────────────────────
  function wireAudio(a: HTMLAudioElement) {
    a.oncanplaythrough = () => { setState("ready"); };
    a.onended = () => {
      setState("paused");
      setProgress(1);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    a.onerror = () => { setState("error"); };
    a.ondurationchange = () => {
      if (!isNaN(a.duration)) setDuration(a.duration);
    };
  }

  // ── fetch signed URL via get-audio-url (direct bucket path) ──
  async function fetchAudioPathUrl(): Promise<string | null> {
    const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supaUrl || !anonKey || !audioPath) return null;

    try {
      const res = await fetch(`${supaUrl}/functions/v1/get-audio-url`, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "apikey":        anonKey,
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ bucket: audioBucket, path: audioPath }),
      });

      if (res.status === 404) { setState("unavailable"); return null; }
      if (!res.ok) { setState("error"); return null; }

      const json = await res.json();
      return (json.signed_url as string) ?? null;
    } catch {
      setState("error");
      return null;
    }
  }

  // ── fetch signed URL from invention-specific edge function ──────────────────
  async function fetchSignedUrl(): Promise<string | null> {
    const supaUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supaUrl || !anonKey) return null;

    const fnName = EDGE_FN[invention];
    const endpoint = `${supaUrl}/functions/v1/${fnName}`;

    const body: Record<string, string | undefined> = {};
    if (kutId)       body.k_kut_id   = kutId;
    if (pixPckId)    body.pix_pck_id = pixPckId;
    if (tag)         body.tag         = tag;
    if (romanceLevel && invention === "KPD") body.romance_level = romanceLevel;

    if (!body.k_kut_id && !(body.pix_pck_id && body.tag)) {
      return null; // nothing to look up
    }

    try {
      const res = await fetch(endpoint, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "apikey":        anonKey,
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 404) { setState("unavailable"); return null; }
      if (!res.ok) { setState("error"); return null; }

      const json = await res.json();
      return (json.signed_url as string) ?? null;
    } catch {
      setState("error");
      return null;
    }
  }

  // ── main play / resume logic ─────────────────────────────
  async function handlePlay() {
    // Resume if already have audio
    if (audioRef.current && (state === "ready" || state === "paused")) {
      await audioRef.current.play();
      setState("playing");
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    setState("loading");

    // Priority: demoSrc > audioPath (direct bucket) > DB-backed edge fn
    const src = demoSrc
      ?? (audioPath ? await fetchAudioPathUrl() : null)
      ?? (await fetchSignedUrl());
    if (!src) {
      if (state !== "unavailable" && state !== "error") setState("unavailable");
      return;
    }

    const a = new Audio(src);
    a.crossOrigin = "anonymous";
    audioRef.current = a;
    wireAudio(a);

    try {
      await a.play();
      setState("playing");
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setState("error");
    }
  }

  function handlePause() {
    audioRef.current?.pause();
    setState("paused");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  const rgb = color;

  // ── render ───────────────────────────────────────────────
  return (
    <div
      className="mt-2 flex flex-col gap-1"
      role="region"
      aria-label={label ? `Audio: ${label}` : "Audio player"}
    >
      {/* Play bar */}
      <div className="flex items-center gap-2">
        {/* Play / Pause button */}
        <button
          onClick={state === "playing" ? handlePause : handlePlay}
          disabled={state === "loading" || state === "unavailable" || state === "error"}
          aria-label={state === "playing" ? "Pause" : "Play"}
          className="flex items-center justify-center w-6 h-6 rounded-sm transition-opacity disabled:opacity-40"
          style={{
            background: `rgba(${rgb},0.15)`,
            border:     `1px solid rgba(${rgb},0.5)`,
            color:      `rgb(${rgb})`,
          }}
        >
          {state === "loading" ? (
            <span className="block w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin" />
          ) : state === "playing" ? (
            <span className="text-[8px] leading-none select-none">⏸</span>
          ) : (
            <span className="text-[8px] leading-none select-none">▶</span>
          )}
        </button>

        {/* Progress bar */}
        <div
          className="flex-1 h-0.5 rounded-full overflow-hidden"
          style={{ background: `rgba(${rgb},0.2)` }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-100"
            style={{
              width:      `${Math.round(progress * 100)}%`,
              background: `rgb(${rgb})`,
            }}
          />
        </div>

        {/* Time / status */}
        <span
          className="text-[8px] uppercase tracking-widest shrink-0 min-w-[44px] text-right"
          style={{ color: `rgba(${rgb},0.7)` }}
        >
          {state === "loading"     && "…"}
          {state === "unavailable" && "soon"}
          {state === "error"       && "err"}
          {(state === "idle" || state === "ready") && (
            duration > 0 ? formatTime(duration) : "▶ KUT"
          )}
          {(state === "playing" || state === "paused") && (
            duration > 0
              ? `${formatTime(elapsed)}/${formatTime(duration)}`
              : formatTime(elapsed)
          )}
        </span>
      </div>

      {/* Status micro-label */}
      {(state === "unavailable" || state === "error") && (
        <p
          className="text-[8px] uppercase tracking-widest"
          style={{ color: `rgba(${rgb},0.5)` }}
        >
          {state === "unavailable" ? "Audio pending upload" : "Playback error — retry"}
        </p>
      )}
    </div>
  );
}
