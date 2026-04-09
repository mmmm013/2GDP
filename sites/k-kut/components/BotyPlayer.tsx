"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { playKKutSection } from "@/lib/kkut-audio";

const BOTY = {
  track: "LOVE RENEWS",
  section: "Ch1",
  label: "K-KUT · Chorus · 2025",
  color: "255,105,180",
  note: "Most-sent K-KUT of the year",
};

// Bar heights for waveform visualiser (arbitrary aesthetic values)
const BARS = [3, 6, 9, 14, 10, 13, 7, 11, 5, 12, 4, 8, 11, 6, 9];

export default function BotyPlayer() {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handlePlay() {
    if (playing) return;
    const ms = playKKutSection(BOTY.section);
    setPlayed(true);
    if (ms > 0) {
      setPlaying(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setPlaying(false), ms);
    }
  }

  const rgba = (a: number) => `rgba(${BOTY.color},${a})`;

  return (
    <div className="max-w-sm mx-auto">
      <div
        className="rounded-sm border p-6 flex flex-col gap-5"
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
              style={{ color: `rgb(${BOTY.color})` }}
            >
              {BOTY.label}
            </p>
            <p className="text-xl font-bold text-[var(--text)]">{BOTY.track}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{BOTY.note}</p>
          </div>
          <span className="text-xl" style={{ color: `rgb(${BOTY.color})` }}>◆</span>
        </div>

        {/* Waveform visualiser — animates while playing */}
        <div className="flex items-end gap-[3px] h-10" aria-hidden>
          {BARS.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: playing ? `${h * 2.5}px` : "3px",
                background: `rgb(${BOTY.color})`,
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
            background: playing ? rgba(0.15) : `rgb(${BOTY.color})`,
            color: playing ? `rgb(${BOTY.color})` : "#030712",
            border: `1px solid ${rgba(0.6)}`,
            cursor: playing ? "default" : "pointer",
          }}
        >
          {playing ? "▶ Playing…" : played ? "▶ Play Again" : "▶ Play This K-KUT"}
        </button>

        {/* Post-play message + inline sale CTA */}
        {played && !playing && (
          <div className="text-center animate-fade-in space-y-3">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              That was one section. One exact moment. One K&#8209;KUT.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-opacity hover:opacity-90"
              style={{ background: `rgb(${BOTY.color})`, color: "#030712" }}
            >
              Get Access →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
