"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   K-KUT BOT — SMS / DM chat simulation
   Shows a scripted conversation where a K-KUT section is sent
   ═══════════════════════════════════════════════════════════ */

type ChatLine = {
  from: "sender" | "bot" | "system";
  text?: string;
  card?: {
    title: string;
    tag: string;
    section: string;
    color: string;
  };
  delay: number; // ms from previous line
};

const KKUT_SCRIPTS: ChatLine[][] = [
  [
    { from: "sender", text: "yo i can't explain it but this says it", delay: 0 },
    { from: "bot",    text: "…",                                          delay: 900 },
    {
      from: "bot",
      card: { title: "LOVE RENEWS", tag: "K-KUT · Chorus", section: "Ch1", color: "255,105,180" },
      delay: 600,
    },
    { from: "bot",    text: "that's the whole chorus. exactly that part.", delay: 800 },
    { from: "sender", text: "exactly that part 🔥",                        delay: 1200 },
    { from: "sender", text: "how did you even find that",                  delay: 700 },
    { from: "bot",    text: "K-KUT. exact section. registered track.",      delay: 900 },
  ],
  [
    { from: "sender", text: "I owe you an apology and I don't know how to start", delay: 0 },
    { from: "bot",    text: "...",                                                 delay: 1000 },
    {
      from: "bot",
      card: { title: "STARTS WITH ME", tag: "K-KUT · Verse 2", section: "V2", color: "0,229,255" },
      delay: 700,
    },
    { from: "bot",    text: "let that speak first.",                         delay: 800 },
    { from: "sender", text: "...yeah. that's it. that's exactly it.",        delay: 1400 },
  ],
  [
    { from: "sender", text: "nothing I say is landing right now",          delay: 0 },
    { from: "bot",    text: "stop talking. send this.",                     delay: 900 },
    {
      from: "bot",
      card: { title: "STILL HERE", tag: "K-KUT · Bridge", section: "BR", color: "180,200,255" },
      delay: 600,
    },
    { from: "sender", text: "they literally just replied 😭",               delay: 1600 },
    { from: "bot",    text: "K-KUT lands where words don't.",               delay: 700 },
  ],
];

/* ═══════════════════════════════════════════════════════════
   mini-KUT BOT — velocity word cannon
   Fires 12 mini-KUT text assets rapid-fire from a master track
   ═══════════════════════════════════════════════════════════ */

const MK_BATCHES: Array<{ track: string; words: string[] }> = [
  {
    track: "LOVE RENEWS",
    words: [
      "RISE UP", "not today", "you found me", "NEVER AGAIN",
      "believe", "STILL HERE", "worth it", "say my name",
      "NOW OR NEVER", "hold on", "light it up", "FOREVER",
    ],
  },
  {
    track: "STARTS WITH ME",
    words: [
      "I know", "FORGIVE ME", "starting over", "one more chance",
      "MEANT IT", "all of it", "your move", "don't go",
      "come back", "IT'S US", "no excuses", "TODAY",
    ],
  },
  {
    track: "STILL HERE",
    words: [
      "I stayed", "THROUGH IT", "you and me", "always will",
      "HOLD ON", "come home", "not done", "worth it",
      "right here", "FIND ME", "don't stop", "OURS",
    ],
  },
];

const MK_COLORS = [
  "#00e5ff", "#ff69b4", "#fbbf24", "#a78bfa",
  "#34d399", "#f87171", "#60a5fa", "#fb923c",
  "#e879f9", "#4ade80", "#f472b6", "#38bdf8",
];

/* ═══════════════════════════════════════════════════════════
   K-kUpId BOT — Cupid romance-level escalation
   DM thread escalates through 5 levels, each with its own glow
   ═══════════════════════════════════════════════════════════ */

const KUPID_LEVELS: Array<{
  level: string;
  label: string;
  color: string;
  cupid: string;
  opener: string;
  track: string;
  reply: string;
}> = [
  {
    level: "01",
    label: "INTEREST",
    color: "255,200,100",
    cupid: "👀",
    opener: "I see you.",
    track: "FIND ME — K-kUpId · Interest",
    reply: "wait… how did you know this was my song",
  },
  {
    level: "02",
    label: "DATE",
    color: "255,153,0",
    cupid: "💌",
    opener: "Tonight?",
    track: "ONE NIGHT — K-kUpId · Date",
    reply: "ok yes. absolutely yes.",
  },
  {
    level: "03",
    label: "LOVE",
    color: "255,105,180",
    cupid: "💘",
    opener: "Always.",
    track: "LOVE RENEWS — K-kUpId · Love",
    reply: "I didn't think anyone could say it better than words.",
  },
  {
    level: "04",
    label: "SEX",
    color: "200,50,150",
    cupid: "🔥",
    opener: "You know.",
    track: "BURN — K-kUpId · Sex",
    reply: "🔥🔥🔥",
  },
  {
    level: "05",
    label: "FOREVER",
    color: "150,100,255",
    cupid: "♾️",
    opener: "This is the one.",
    track: "FOREVER YOURS — K-kUpId · Forever",
    reply: "Forever it is.",
  },
];

/* ═══════════════════════════════════════════════════════════
   Shared helpers
   ═══════════════════════════════════════════════════════════ */

function useAutoScript<T>(
  items: T[],
  delays: number[],
  running: boolean,
): T[] {
  const [revealed, setRevealed] = useState<T[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!running) { setRevealed([]); return; }
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    let acc = 0;
    items.forEach((item, i) => {
      acc += delays[i] ?? 600;
      const t = setTimeout(() => setRevealed((p) => [...p, item]), acc);
      timerRef.current.push(t);
    });
    return () => timerRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return revealed;
}

/* ═══════════════════════════════════════════════════════════
   K-KUT BOT sub-component
   ═══════════════════════════════════════════════════════════ */

function KKutBot() {
  const [scriptIdx, setScriptIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const script = KKUT_SCRIPTS[scriptIdx];
  const delays = script.map((l) => l.delay);
  const lines = useAutoScript(script, delays, running);
  const bottomRef = useRef<HTMLDivElement>(null);

  // auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  // detect finish
  useEffect(() => {
    if (running && lines.length === script.length) {
      setDone(true); setRunning(false);
    }
  }, [lines, running, script.length]);

  function start() { setRunning(true); setDone(false); }
  function reset() {
    setRunning(false); setDone(false);
    setScriptIdx((i) => (i + 1) % KKUT_SCRIPTS.length);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat viewport */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-[260px] max-h-[340px]">
        {lines.length === 0 && !running && (
          <p className="text-xs text-[var(--text-subtle)] text-center pt-8">
            Press ▶ to watch a K-KUT get sent.
          </p>
        )}
        {lines.map((line, i) => {
          if (line.card) {
            const c = line.card;
            return (
              <div key={i} className="flex justify-start anim-bubble-in">
                <div
                  className="rounded-sm p-3 max-w-[220px] border"
                  style={{
                    borderColor: `rgba(${c.color},0.6)`,
                    background: `rgba(${c.color},0.08)`,
                    boxShadow: `0 0 16px rgba(${c.color},0.2)`,
                  }}
                >
                  <p
                    className="text-[9px] uppercase tracking-widest mb-1 font-semibold"
                    style={{ color: `rgb(${c.color})` }}
                  >
                    {c.tag}
                  </p>
                  <p className="text-sm font-bold text-[var(--text)]">{c.title}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    Section: {c.section} · K-KUT
                  </p>
                  <div
                    className="mt-2 h-1 rounded-full"
                    style={{ background: `rgba(${c.color},0.5)`, width: "70%" }}
                  />
                </div>
              </div>
            );
          }
          const isSender = line.from === "sender";
          if (line.text === "…" || line.text === "...") {
            return (
              <div key={i} className={`flex ${isSender ? "justify-end" : "justify-start"} anim-bubble-in`}>
                <div className="px-3 py-2 rounded-sm bg-[var(--surface-2)] border border-[var(--border)]">
                  <span className="text-base text-[var(--text-muted)] tracking-widest anim-typing">
                    ···
                  </span>
                </div>
              </div>
            );
          }
          return (
            <div key={i} className={`flex ${isSender ? "justify-end" : "justify-start"} anim-bubble-in`}>
              <div
                className={`px-3 py-2 rounded-sm text-sm max-w-[75%] ${
                  isSender
                    ? "bg-[var(--accent)] text-[var(--bg)] font-medium"
                    : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
                }`}
              >
                {line.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[var(--border)]">
        <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
          Script {scriptIdx + 1}/{KKUT_SCRIPTS.length}
        </span>
        <div className="flex gap-2">
          {!running && !done && (
            <button
              onClick={start}
              className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
            >
              ▶ Play
            </button>
          )}
          {(done || running) && (
            <button
              onClick={reset}
              className="px-4 py-1.5 border border-[var(--border)] text-[var(--text-muted)] text-[10px] uppercase tracking-widest rounded-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              Next scenario ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   mini-KUT BOT sub-component
   ═══════════════════════════════════════════════════════════ */

function MiniKutBot() {
  const [batchIdx, setBatchIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const batch = MK_BATCHES[batchIdx];
  const delays = batch.words.map((_, i) => (i === 0 ? 0 : 220));
  const words = useAutoScript(batch.words, delays, running);

  useEffect(() => {
    if (running && words.length === batch.words.length) {
      setDone(true); setRunning(false);
    }
  }, [words, running, batch.words.length]);

  function start() { setRunning(true); setDone(false); }
  function reset() {
    setRunning(false); setDone(false);
    setBatchIdx((i) => (i + 1) % MK_BATCHES.length);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Track label */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-[var(--accent)]">
            Master Track
          </p>
          <p className="text-sm font-bold text-[var(--text)]">{batch.track}</p>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border)] px-2 py-1 rounded-sm">
          {words.length}/12 mini-KUTs
        </span>
      </div>

      {/* Word cannon grid */}
      <div className="flex-1 p-4 min-h-[220px]">
        {words.length === 0 && !running && (
          <p className="text-xs text-[var(--text-subtle)] text-center pt-8">
            Press ▶ to fire the mini-KUT cannon.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {words.map((w, i) => (
            <span
              key={`${batchIdx}-${i}`}
              className="anim-word-blast px-2 py-1 text-xs font-bold uppercase tracking-widest rounded-sm border"
              style={{
                color: MK_COLORS[i % MK_COLORS.length],
                borderColor: MK_COLORS[i % MK_COLORS.length] + "55",
                background: MK_COLORS[i % MK_COLORS.length] + "12",
                animationDelay: `${i * 0.04}s`,
              }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* 8/12/20 rule footnote */}
        {done && (
          <p className="text-[9px] text-[var(--text-subtle)] mt-4 animate-fade-in">
            8/12/20 rule · 12 mini-KUTs extracted per Master Track · zero catalog waste
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[var(--border)]">
        <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
          Track {batchIdx + 1}/{MK_BATCHES.length}
        </span>
        <div className="flex gap-2">
          {!running && !done && (
            <button
              onClick={start}
              className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
            >
              ▶ Fire
            </button>
          )}
          {(done || running) && (
            <button
              onClick={reset}
              className="px-4 py-1.5 border border-[var(--border)] text-[var(--text-muted)] text-[10px] uppercase tracking-widest rounded-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              Next track ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   K-kUpId BOT sub-component
   Cupid escalates through 5 romance levels
   ═══════════════════════════════════════════════════════════ */

function KupidBot() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // build a flat timeline: for each level: cupid message → track card → reply
  const totalSteps = KUPID_LEVELS.length * 3;

  const reset = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    setRunning(false); setDone(false); setCurrentLevel(-1);
  }, []);

  function start() {
    reset();
    setRunning(true);
    let acc = 200;
    KUPID_LEVELS.forEach((_, li) => {
      const base = li * 3;
      // step 0: show level opener bubble
      timerRef.current.push(setTimeout(() => setCurrentLevel(base), acc)); acc += 900;
      // step 1: show track card
      timerRef.current.push(setTimeout(() => setCurrentLevel(base + 1), acc)); acc += 700;
      // step 2: show reply
      timerRef.current.push(setTimeout(() => setCurrentLevel(base + 2), acc)); acc += 1100;
    });
    timerRef.current.push(setTimeout(() => { setDone(true); setRunning(false); }, acc));
  }

  useEffect(() => () => timerRef.current.forEach(clearTimeout), []);

  // auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [currentLevel]);

  const visibleLevels = currentLevel >= 0
    ? Math.floor(currentLevel / 3) + 1
    : 0;
  const stepInLevel = currentLevel >= 0 ? currentLevel % 3 : -1;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-[280px] max-h-[360px]">
        {currentLevel < 0 && (
          <p className="text-xs text-[var(--text-subtle)] text-center pt-8">
            Press ▶ to let Cupid work through all 5 levels.
          </p>
        )}

        {KUPID_LEVELS.slice(0, visibleLevels).map((lv, li) => {
          const isLastVisible = li === visibleLevels - 1;
          const stepHere = isLastVisible ? stepInLevel : 2; // fully shown if not last
          const col = lv.color;
          return (
            <div key={li} className="space-y-2">
              {/* Level badge */}
              <div className="flex items-center gap-2 anim-level-up">
                <span className="text-lg">{lv.cupid}</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                  style={{
                    color: `rgb(${col})`,
                    borderColor: `rgba(${col},0.5)`,
                    background: `rgba(${col},0.1)`,
                  }}
                >
                  Level {lv.level} · {lv.label}
                </span>
              </div>

              {/* Cupid opener bubble */}
              <div className="flex justify-start anim-bubble-in">
                <div
                  className="px-3 py-2 rounded-sm text-sm border max-w-[75%]"
                  style={{
                    borderColor: `rgba(${col},0.5)`,
                    background: `rgba(${col},0.08)`,
                    color: `rgb(${col})`,
                    boxShadow: `0 0 12px rgba(${col},0.15)`,
                  }}
                >
                  {lv.opener}
                </div>
              </div>

              {/* Track card */}
              {stepHere >= 1 && (
                <div className="flex justify-start anim-section-card">
                  <div
                    className="rounded-sm p-3 max-w-[230px] border"
                    style={{
                      borderColor: `rgba(${col},0.55)`,
                      background: `rgba(${col},0.07)`,
                    }}
                  >
                    <p
                      className="text-[9px] uppercase tracking-widest mb-0.5 font-semibold"
                      style={{ color: `rgb(${col})` }}
                    >
                      K-kUpId · {lv.label}
                    </p>
                    <p className="text-xs font-bold text-[var(--text)]">{lv.track}</p>
                    <div
                      className="mt-2 h-0.5 rounded-full"
                      style={{ background: `rgba(${col},0.5)`, width: "65%" }}
                    />
                  </div>
                </div>
              )}

              {/* Recipient reply */}
              {stepHere >= 2 && (
                <div className="flex justify-end anim-bubble-in">
                  <div className="px-3 py-2 rounded-sm text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] max-w-[75%]">
                    {lv.reply}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {done && (
          <div className="text-center py-2 animate-fade-in">
            <p className="text-[10px] uppercase tracking-widest text-[var(--accent)]">
              ♾️ All 5 levels delivered.
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[var(--border)]">
        <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
          {currentLevel < 0
            ? "5 levels · Interest → Forever"
            : `Level ${Math.min(visibleLevels, 5)}/5 · ${KUPID_LEVELS[Math.min(visibleLevels - 1, 4)]?.label}`}
        </span>
        <div className="flex gap-2">
          {!running && !done && (
            <button
              onClick={start}
              className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
            >
              ▶ Run
            </button>
          )}
          {(done || running) && (
            <button
              onClick={reset}
              className="px-4 py-1.5 border border-[var(--border)] text-[var(--text-muted)] text-[10px] uppercase tracking-widest rounded-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              ↺ Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BotDemo — tabbed shell for all 3 BOTs
   ═══════════════════════════════════════════════════════════ */

const TABS = [
  {
    id: "kkut",
    label: "K-KUT BOT",
    icon: "◆",
    tagline: "Exact section. Sent.",
    color: "0,229,255",
  },
  {
    id: "minikut",
    label: "mini-KUT BOT",
    icon: "◈",
    tagline: "12 micro-assets. Fired.",
    color: "251,191,36",
  },
  {
    id: "kupid",
    label: "K-kUpId BOT",
    icon: "💘",
    tagline: "5 levels. Delivered.",
    color: "255,105,180",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function BotDemo() {
  const [active, setActive] = useState<TabId>("kkut");
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tab bar */}
      <div className="grid grid-cols-3 border border-[var(--border)] rounded-t-sm overflow-hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
              active === tab.id
                ? "bg-[var(--surface-2)] text-[var(--text)]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
            }`}
            style={
              active === tab.id
                ? { borderBottom: `2px solid rgb(${tab.color})` }
                : {}
            }
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden text-[8px]">{tab.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Active tab tagline */}
      <div
        className="px-4 py-2 border-x border-[var(--border)] flex items-center justify-between"
        style={{ background: `rgba(${activeTab.color},0.05)` }}
      >
        <span
          className="text-[9px] uppercase tracking-widest"
          style={{ color: `rgb(${activeTab.color})` }}
        >
          {activeTab.tagline}
        </span>
        <span
          className="text-[9px] uppercase tracking-widest"
          style={{ color: `rgba(${activeTab.color},0.5)` }}
        >
          SCRIPTED DEMO
        </span>
      </div>

      {/* BOT panel */}
      <div className="border border-t-0 border-[var(--border)] bg-[var(--surface)] rounded-b-sm">
        {active === "kkut"    && <KKutBot />}
        {active === "minikut" && <MiniKutBot />}
        {active === "kupid"   && <KupidBot />}
      </div>
    </div>
  );
}
