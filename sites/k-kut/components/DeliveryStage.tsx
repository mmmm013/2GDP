"use client";

import { useState } from "react";

/* ─── Messenger roster ─────────────────────────────────────── */
// glow is an RGB triplet used in rgba() strings for dynamic inline styles
const MESSENGERS = [
  {
    id: "devil",
    emoji: "😈",
    name: "Devil",
    tagline: "From the depths. On fire.",
    glow: "255,51,0",
    anim: "anim-slide-up-bounce",
  },
  {
    id: "cupid",
    emoji: "💘",
    name: "Cupid",
    tagline: "Arrow locked. Feeling incoming.",
    glow: "255,105,180",
    anim: "anim-arc-in",
  },
  {
    id: "angel",
    emoji: "😇",
    name: "Angel",
    tagline: "Delivered from above.",
    glow: "180,200,255",
    anim: "anim-drop-top",
  },
  {
    id: "nurse",
    emoji: "👩‍⚕️",
    name: "Nurse",
    tagline: "Prescribed. Professionally.",
    glow: "0,229,255",
    anim: "anim-slide-right",
  },
  {
    id: "romeo",
    emoji: "🎭",
    name: "Romeo",
    tagline: "Enter, stage left. Dramatically.",
    glow: "255,153,0",
    anim: "anim-zoom-in",
  },
  {
    id: "friend",
    emoji: "🤝",
    name: "Friend",
    tagline: "Here. No big deal.",
    glow: "0,229,255",
    anim: "anim-slide-left",
  },
  {
    id: "puppy",
    emoji: "🐶",
    name: "Puppy",
    tagline: "Fetched it. Just for you.",
    glow: "255,187,0",
    anim: "anim-bounce-in",
  },
  {
    id: "cat",
    emoji: "🐱",
    name: "Cat",
    tagline: "Pushed it off the edge.",
    glow: "168,85,247",
    anim: "anim-tip-in",
  },
  {
    id: "ghost",
    emoji: "👻",
    name: "Ghost",
    tagline: "You didn't see this.",
    glow: "110,231,183",
    anim: "anim-ghost-in",
  },
  {
    id: "robot",
    emoji: "🤖",
    name: "Robot",
    tagline: "Transmission: complete.",
    glow: "0,229,255",
    anim: "anim-glitch-in",
  },
  {
    id: "dove",
    emoji: "🕊️",
    name: "Dove",
    tagline: "Peace. And a feeling.",
    glow: "220,230,255",
    anim: "anim-float-in",
  },
  {
    id: "spy",
    emoji: "🕵️",
    name: "Spy",
    tagline: "You never saw me.",
    glow: "100,116,139",
    anim: "anim-fade-through",
  },
] as const;

type Messenger = (typeof MESSENGERS)[number];

/* ─── Delivery codes ───────────────────────────────────────── */
const CODES = [
  "GPM", "KUT", "LUV", "SAD", "YOU",
  "HIT", "NOW", "YES", "WOW", "OWN",
  "JOY", "HOT", "ICY", "RUN", "FLY",
];

/* ─── Send channels ────────────────────────────────────────── */
const CHANNELS = [
  { id: "sms",    label: "SMS",    icon: "💬" },
  { id: "dm",     label: "DM",     icon: "✉️" },
  { id: "social", label: "Social", icon: "◈" },
  { id: "email",  label: "Email",  icon: "◆" },
];

/* ─── Helpers ──────────────────────────────────────────────── */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ─── Component ────────────────────────────────────────────── */
export default function DeliveryStage() {
  const [stage, setStage] = useState<"pick" | "deliver">("pick");
  const [messenger, setMessenger] = useState<Messenger | null>(null);
  const [code, setCode] = useState(() => pick(CODES));
  const [channel, setChannel] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  function deliver(m: Messenger) {
    setMessenger(m);
    setCode(pick(CODES));
    setChannel(null);
    setAnimKey((k) => k + 1);
    setStage("deliver");
  }

  function surpriseMe() {
    deliver(pick(MESSENGERS));
  }

  function newCode() {
    setCode(pick(CODES));
    setAnimKey((k) => k + 1);
  }

  function reset() {
    setStage("pick");
    setMessenger(null);
    setChannel(null);
  }

  /* Convenience rgba prefix for the active messenger's glow color */
  const rgba = (alpha: number) =>
    messenger ? `rgba(${messenger.glow},${alpha})` : `rgba(0,229,255,${alpha})`;

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* ── Step 1: Pick a messenger ──────────────────────────── */}
      {stage === "pick" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
              Choose your messenger
            </p>
            <button
              onClick={surpriseMe}
              className="text-[10px] uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)] px-3 py-1 rounded-sm hover:bg-[var(--accent-glow)] transition-colors"
            >
              ✦ Surprise me
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {MESSENGERS.map((m) => (
              <button
                key={m.id}
                onClick={() => deliver(m)}
                className="flex flex-col items-center gap-2 border border-[var(--border)] bg-[var(--surface)] rounded-sm p-3 hover:border-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all text-center group"
              >
                <span className="text-3xl leading-none group-hover:scale-110 transition-transform duration-200">
                  {m.emoji}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text)]">
                  {m.name}
                </span>
                <span className="hidden sm:block text-[9px] text-[var(--text-muted)] leading-tight line-clamp-2">
                  {m.tagline}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: The delivery animation ───────────────────── */}
      {stage === "deliver" && messenger && (
        <div className="flex flex-col items-center gap-8">

          {/* Stage window */}
          <div
            className="relative w-full rounded-sm overflow-hidden border"
            style={{
              borderColor: rgba(0.45),
              background: `radial-gradient(ellipse at 50% 55%, ${rgba(0.13)}, transparent 72%)`,
              minHeight: "240px",
            }}
          >
            {/* Messenger entrance */}
            <div
              key={`char-${animKey}`}
              className={`absolute top-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 ${messenger.anim}`}
              style={{ zIndex: 10 }}
            >
              <span className="text-5xl sm:text-6xl leading-none">{messenger.emoji}</span>
              <p
                className="text-[10px] uppercase tracking-widest text-center max-w-[200px]"
                style={{ color: `rgb(${messenger.glow})` }}
              >
                {messenger.tagline}
              </p>
            </div>

            {/* Three-panel box — left / center / right letters fall open */}
            <div
              className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2"
              style={{ zIndex: 5 }}
            >
              {code.split("").map((letter, i) => {
                const panelClass =
                  i === 0 ? "panel-left" : i === 1 ? "panel-center" : "panel-right";
                return (
                  <div
                    key={`${animKey}-${i}`}
                    className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border rounded-sm text-2xl sm:text-3xl font-bold ${panelClass}`}
                    style={{
                      borderColor: rgba(0.7),
                      color: `rgb(${messenger.glow})`,
                      background: rgba(0.1),
                      boxShadow: `0 0 18px ${rgba(0.35)}`,
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Channel selector */}
          <div className="w-full">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 text-center">
              Send via
            </p>
            <div className="grid grid-cols-4 gap-3">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setChannel(ch.id === channel ? null : ch.id)}
                  className={`flex flex-col items-center gap-1.5 border rounded-sm py-3 text-xs font-semibold uppercase tracking-widest transition-all ${
                    channel === ch.id
                      ? "border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-bright)]"
                  }`}
                >
                  <span className="text-lg leading-none">{ch.icon}</span>
                  {ch.label}
                </button>
              ))}
            </div>
            {channel && (
              <p
                className="text-center text-xs mt-3 animate-fade-in"
                style={{ color: `rgb(${messenger.glow})` }}
              >
                ✦ {messenger.name} is ready to send{" "}
                <strong>{code}</strong> via{" "}
                {CHANNELS.find((c) => c.id === channel)?.label}.{" "}
                Live with the platform.
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={newCode}
              className="px-5 py-2 border border-[var(--border)] text-[var(--text-muted)] text-xs uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-sm"
            >
              New code
            </button>
            <button
              onClick={surpriseMe}
              className="px-5 py-2 border border-[var(--border)] text-[var(--text-muted)] text-xs uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-sm"
            >
              ✦ Surprise me
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 border border-[var(--border)] text-[var(--text-muted)] text-xs uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-sm"
            >
              Change messenger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
