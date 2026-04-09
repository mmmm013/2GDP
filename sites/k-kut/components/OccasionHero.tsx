"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { playKKutSection } from "@/lib/kkut-audio";

/* ─── Occasion catalogue ──────────────────────────────────────────────── */

type OccasionKkut = {
  track: string;
  section: string;
  label: string;
  color: string;
  note: string;
  productType: "K-KUT" | "K-kUpId";
};

type Occasion = {
  id: string;
  label: string;
  emoji: string;
  kkut: OccasionKkut;
};

const OCCASIONS: Occasion[] = [
  {
    id: "mothers-day",
    label: "Mother's Day",
    emoji: "🌸",
    kkut: {
      track: "THANK YOU",
      section: "Ch1",
      label: "K-KUT · Chorus",
      color: "255,182,193",
      note: "Thank You by Kleigh — the only answer",
      productType: "K-KUT",
    },
  },
  {
    id: "anniversary",
    label: "Anniversary",
    emoji: "💍",
    kkut: {
      track: "LOVE RENEWS",
      section: "Ch1",
      label: "K-KUT · Chorus · 2025",
      color: "255,105,180",
      note: "Most-sent K-KUT of the year",
      productType: "K-KUT",
    },
  },
  {
    id: "romance",
    label: "Romance",
    emoji: "🔥",
    kkut: {
      track: "BURN",
      section: "Ch2",
      label: "K-kUpId · Forever",
      color: "255,80,80",
      note: "This level can't be faked",
      productType: "K-kUpId",
    },
  },
  {
    id: "apology",
    label: "Apology",
    emoji: "🕊️",
    kkut: {
      track: "STARTS WITH ME",
      section: "V2",
      label: "K-KUT · Verse 2",
      color: "0,229,255",
      note: "Let the music say what words can't",
      productType: "K-KUT",
    },
  },
  {
    id: "miss-you",
    label: "Miss You",
    emoji: "🌙",
    kkut: {
      track: "STILL HERE",
      section: "BR",
      label: "K-KUT · Bridge",
      color: "180,200,255",
      note: "Distance doesn't change this",
      productType: "K-KUT",
    },
  },
  {
    id: "hype",
    label: "Hype",
    emoji: "⚡",
    kkut: {
      track: "VICTORY RUN",
      section: "Ch1",
      label: "K-KUT · Chorus",
      color: "255,220,0",
      note: "Send this before they take the field",
      productType: "K-KUT",
    },
  },
  {
    id: "valentines",
    label: "Valentine's",
    emoji: "💌",
    kkut: {
      track: "LOVE RENEWS",
      section: "Ch1",
      label: "K-KUT · Chorus",
      color: "255,105,180",
      note: "Say it with music, not a card",
      productType: "K-KUT",
    },
  },
  {
    id: "celebration",
    label: "Celebration",
    emoji: "🎉",
    kkut: {
      track: "VICTORY RUN",
      section: "Outro",
      label: "K-KUT · Outro",
      color: "130,255,170",
      note: "The sound of winning",
      productType: "K-KUT",
    },
  },
];

/* ─── Date-smart default ──────────────────────────────────────────────── */

/**
 * Returns the occasion id that best fits the current calendar date.
 * Looks for upcoming holidays within a 2-week lead window.
 * Falls back to "anniversary" (the BOTY default).
 */
function getSeasonalOccasionId(): string {
  const now = new Date();
  const m = now.getMonth() + 1; // 1–12
  const d = now.getDate();

  // Valentine's Day: Feb 1–18
  if (m === 2 && d >= 1 && d <= 18) return "valentines";

  // Mother's Day: 2nd Sunday of May ≈ May 8–14
  // Show 2 weeks early: Apr 24 – May 14
  if ((m === 4 && d >= 24) || (m === 5 && d <= 14)) return "mothers-day";

  // Father's Day: 3rd Sunday of June ≈ Jun 15–21
  // Show 2 weeks early: Jun 1–21
  if (m === 6 && d >= 1 && d <= 21) return "hype";

  // Christmas: Dec 11–25
  if (m === 12 && d >= 11 && d <= 25) return "celebration";

  // New Year's Eve/Day: Dec 26 – Jan 3
  if ((m === 12 && d >= 26) || (m === 1 && d <= 3)) return "celebration";

  return "anniversary";
}

/* ─── Waveform bars ───────────────────────────────────────────────────── */

const BARS = [3, 6, 9, 14, 10, 13, 7, 11, 5, 12, 4, 8, 11, 6, 9];

/* ─── Component ──────────────────────────────────────────────────────── */

export default function OccasionHero() {
  const [activeId, setActiveId] = useState<string>(() => getSeasonalOccasionId());
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const occasion = OCCASIONS.find((o) => o.id === activeId) ?? OCCASIONS[1];
  const { kkut } = occasion;

  // Reset player state when occasion changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlaying(false);
    setPlayed(false);
  }, [activeId]);

  function handlePlay() {
    if (playing) return;
    const ms = playKKutSection(kkut.section);
    setPlayed(true);
    if (ms > 0) {
      setPlaying(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setPlaying(false), ms);
    }
  }

  const rgba = (a: number) => `rgba(${kkut.color},${a})`;
  const rgb = `rgb(${kkut.color})`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col gap-10">
      {/* ── Occasion strip ─────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">
          What&rsquo;s the occasion?
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {OCCASIONS.map((o) => {
            const isActive = o.id === activeId;
            return (
              <button
                key={o.id}
                onClick={() => setActiveId(o.id)}
                className="px-4 py-2 text-xs uppercase tracking-widest rounded-sm border transition-all"
                style={
                  isActive
                    ? {
                        borderColor: `rgb(${o.kkut.color})`,
                        color: `rgb(${o.kkut.color})`,
                        background: `rgba(${o.kkut.color},0.1)`,
                      }
                    : undefined
                }
              >
                <span className="mr-1.5">{o.emoji}</span>
                {o.label}
              </button>
            );
          })}
        </div>
        {/* Smart-default nudge */}
        {activeId === getSeasonalOccasionId() && (
          <p className="text-[10px] text-[var(--text-subtle)] tracking-wide">
            Auto-selected for you based on what&rsquo;s coming up.
          </p>
        )}
      </div>

      {/* ── BOTY player (occasion-driven) ─────────────────── */}
      <div className="max-w-sm mx-auto w-full">
        <div
          className="rounded-sm border p-6 flex flex-col gap-5 transition-all duration-300"
          style={{
            borderColor: rgba(0.5),
            background: `radial-gradient(ellipse at 50% 30%, ${rgba(0.12)}, transparent 70%)`,
            boxShadow: `0 0 40px ${rgba(0.12)}`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-[9px] uppercase tracking-widest font-semibold mb-1"
                style={{ color: rgb }}
              >
                {kkut.label}
              </p>
              <p className="text-xl font-bold text-[var(--text)]">{kkut.track}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{kkut.note}</p>
            </div>
            <span
              className="text-[10px] uppercase tracking-widest border rounded-sm px-2 py-1 font-semibold"
              style={{ color: rgb, borderColor: rgba(0.4) }}
            >
              {kkut.productType}
            </span>
          </div>

          {/* Waveform */}
          <div className="flex items-end gap-[3px] h-10" aria-hidden>
            {BARS.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: playing ? `${h * 2.5}px` : "3px",
                  background: rgb,
                  opacity: playing ? 0.75 : 0.25,
                  transition: `height ${0.14 + (i % 5) * 0.05}s ease-in-out ${(i % 4) * 0.04}s`,
                }}
              />
            ))}
          </div>

          {/* Play button */}
          <button
            onClick={handlePlay}
            disabled={playing}
            className="w-full py-3 rounded-sm text-sm font-bold uppercase tracking-widest transition-all"
            style={{
              background: playing ? rgba(0.15) : rgb,
              color: playing ? rgb : "#030712",
              border: `1px solid ${rgba(0.6)}`,
              cursor: playing ? "default" : "pointer",
            }}
          >
            {playing ? "▶ Playing…" : played ? "▶ Play Again" : "▶ Play This K-KUT"}
          </button>

          {/* Post-play inline CTA */}
          {played && !playing && (
            <div className="text-center space-y-3">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                That was one section. One exact moment. One K&#8209;KUT.
              </p>
              <Link
                href="/pricing"
                className="inline-block px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-opacity hover:opacity-90"
                style={{ background: rgb, color: "#030712" }}
              >
                Send this — Get Access →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
