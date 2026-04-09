"use client";

import { useState } from "react";

const CODES = ["GPM", "KUT", "LUV", "SAD", "YOU", "HIT", "NOW", "YES"];

export default function GpmBox() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(CODES[0]);
  const [animating, setAnimating] = useState(false);

  function handleOpen() {
    if (animating) return;
    const next = CODES[Math.floor(Math.random() * CODES.length)];
    setCode(next);
    setAnimating(true);
    setOpen(false);
    // brief reset then open
    setTimeout(() => setOpen(true), 80);
    setTimeout(() => setAnimating(false), 900);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* The Box */}
      <div
        aria-label="GPM Box — click to open"
        className="relative w-56 h-56 cursor-pointer select-none"
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      >
        {/* Left panel */}
        <div
          className={`absolute inset-y-0 left-0 w-1/3 border border-[var(--accent)] bg-[var(--surface)] rounded-l-sm flex items-center justify-center transition-all duration-700 origin-left ${
            open ? "-rotate-[50deg]" : "rotate-0"
          }`}
          style={{ zIndex: open ? 1 : 3 }}
        >
          <span
            className={`text-xs uppercase tracking-[0.2em] font-bold transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100 text-[var(--accent)]"
            }`}
          >
            {code.slice(0, 1)}
          </span>
        </div>

        {/* Center panel */}
        <div
          className={`absolute inset-y-0 left-1/3 w-1/3 border-y border-[var(--accent)] bg-[var(--surface-2)] flex items-center justify-center transition-all duration-700 ${
            open ? "scale-y-90 opacity-80" : "scale-y-100 opacity-100"
          }`}
          style={{ zIndex: 2 }}
        >
          {open ? (
            <span className="text-3xl font-bold text-[var(--accent)] tracking-wider animate-fade-in">
              {code}
            </span>
          ) : (
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--accent)]">
              {code.slice(1, 2)}
            </span>
          )}
        </div>

        {/* Right panel */}
        <div
          className={`absolute inset-y-0 right-0 w-1/3 border border-[var(--accent)] bg-[var(--surface)] rounded-r-sm flex items-center justify-center transition-all duration-700 origin-right ${
            open ? "rotate-[50deg]" : "rotate-0"
          }`}
          style={{ zIndex: open ? 1 : 3 }}
        >
          <span
            className={`text-xs uppercase tracking-[0.2em] font-bold transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100 text-[var(--accent)]"
            }`}
          >
            {code.slice(2, 3)}
          </span>
        </div>

        {/* Glow ring when open */}
        {open && (
          <div
            aria-hidden
            className="absolute inset-0 rounded-sm ring-1 ring-[var(--accent)] accent-glow pointer-events-none animate-fade-in"
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
          {open ? `Moment: ${code}` : "Tap the box"}
        </p>
        <p className="text-[10px] text-[var(--text-subtle)]">
          {open
            ? "Left · Center · Right — three panels. One feeling."
            : "Left, center, and right panels fall open to reveal the moment."}
        </p>
      </div>

      {/* Codes key */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CODES.map((c) => (
          <span
            key={c}
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider border rounded-sm transition-colors ${
              open && code === c
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-glow)]"
                : "border-[var(--border)] text-[var(--text-muted)]"
            }`}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
