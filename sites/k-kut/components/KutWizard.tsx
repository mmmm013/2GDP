"use client";

/**
 * KutWizard — 5-step animated K-KUT purchase wizard.
 *
 * Layout rule: always shows exactly 3 rows:
 *   [prev — dimmed, tappable to go back]
 *   [ACTIVE — full-size, highlighted]
 *   [next  — dimmed/preview, locked]
 * Bookends: index 0 = START pill, index 6 = END/Thanks pill
 */

import { useState, useRef, useEffect, useCallback } from "react";
import {
  FEELING_CLUSTERS,
  suggestFeelings,
  type FeelingCluster,
  type Messenger,
} from "@/lib/feelings";

/* ─── Section catalog (canonical order) ──────────────────────────────── */

const SECTIONS = [
  "Intro","V1","Pre1","Ch1","V2","Pre2","Ch2","BR","Ch3","Outro",
] as const;
type Section = typeof SECTIONS[number];

/* ─── Mock PIX catalog (demo data, no DB required) ───────────────────── */

type PixTrack = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tempo: "slow" | "mid" | "up";
  gender: "male" | "female" | "group";
  feelings: string[]; // feeling cluster ids
};

const PIX_CATALOG: PixTrack[] = [
  {
    id: "p1", title: "STARTS WITH ME", artist: "Kleigh",
    genre: "R&B", tempo: "mid", gender: "female",
    feelings: ["sorry","grief","healing","concern"],
  },
  {
    id: "p2", title: "VICTORY RUN", artist: "M. Scherer",
    genre: "Pop-Rock", tempo: "up", gender: "male",
    feelings: ["joy","excitement","pride","motivation"],
  },
  {
    id: "p3", title: "LOVE RENEWS", artist: "Kleigh",
    genre: "R&B", tempo: "slow", gender: "female",
    feelings: ["love","hope","friendship","gratitude"],
  },
  {
    id: "p4", title: "BURN", artist: "M. Scherer",
    genre: "Pop", tempo: "mid", gender: "male",
    feelings: ["love","excitement","motivation","nostalgia"],
  },
  {
    id: "p5", title: "STILL HERE", artist: "Kleigh",
    genre: "Soul", tempo: "slow", gender: "female",
    feelings: ["missing","grief","concern","calm"],
  },
  {
    id: "p6", title: "THANK YOU", artist: "Kleigh",
    genre: "Gospel", tempo: "mid", gender: "female",
    feelings: ["gratitude","faith","hope","friendship"],
  },
  {
    id: "p7", title: "RISE UP", artist: "M. Scherer",
    genre: "Hip-Hop", tempo: "up", gender: "male",
    feelings: ["motivation","encouragement","hope","pride"],
  },
  {
    id: "p8", title: "BREATHE", artist: "Kleigh",
    genre: "Ambient", tempo: "slow", gender: "female",
    feelings: ["calm","healing","grief","faith"],
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function rgba(color: string, alpha: number) {
  return `rgba(${color},${alpha})`;
}

/** Enforces contiguous section selection (ASCAP rule) */
function toggleSection(selected: Section[], sec: Section): Section[] {
  const allIdx = SECTIONS.indexOf(sec);
  if (selected.includes(sec)) {
    // Remove; keep only contiguous block that doesn't include sec
    const newSel = selected.filter((s) => s !== sec);
    // Re-validate contiguity
    return validateContiguous(newSel);
  }
  // Add; validate result is contiguous
  return validateContiguous([...selected, sec]);
}

function validateContiguous(secs: Section[]): Section[] {
  if (!secs.length) return secs;
  const indices = secs.map((s) => SECTIONS.indexOf(s)).sort((a, b) => a - b);
  // Keep only the longest contiguous block
  let best: number[] = [];
  let cur: number[] = [indices[0]];
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) {
      cur.push(indices[i]);
    } else {
      if (cur.length > best.length) best = cur;
      cur = [indices[i]];
    }
  }
  if (cur.length > best.length) best = cur;
  return best.map((i) => SECTIONS[i]);
}

/* ─── Click-to-play sample hook ──────────────────────────────────────── */

/**
 * Manages a single audio instance for optional sample playback.
 * Audio ONLY plays when the user explicitly calls `toggle()`.
 * No autoplay, no play-on-mount, no play-on-selection.
 */
function useSamplePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  // GAP-7: Track IDs where sample file is unavailable so we can show "coming soon"
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string, src: string) => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current = null;
      if (playingId === id) { setPlayingId(null); return; }
    }
    const a = new Audio(src);
    a.onended = () => setPlayingId(null);
    // GAP-7: On onerror, mark the sample as unavailable rather than silently resetting
    a.onerror = () => {
      setPlayingId(null);
      setUnavailableIds((prev) => new Set(prev).add(id));
    };
    a.play().catch(() => setPlayingId(null));
    audioRef.current = a;
    setPlayingId(id);
  }, [playingId]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingId(null);
  }, []);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return { playingId, toggle, stop, unavailableIds };
}

/* ─── Step Row Card ───────────────────────────────────────────────────── */

type RowVariant = "prev" | "active" | "next" | "bookend";

function StepRow({
  variant,
  stepIndex,
  label,
  summary,
  accentColor,
  onClick,
  children,
}: {
  variant: RowVariant;
  stepIndex: number | null;
  label: string;
  summary?: string;
  accentColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const color = accentColor ?? "0,229,255";
  const isActive = variant === "active";
  const isBookend = variant === "bookend";
  const isPrev = variant === "prev";

  const border = isActive
    ? `1px solid rgba(${color},0.7)`
    : "1px solid var(--border)";
  const bg = isActive
    ? `radial-gradient(ellipse at 50% 0%, rgba(${color},0.12) 0%, transparent 70%)`
    : "transparent";
  const shadow = isActive ? `0 0 30px rgba(${color},0.15)` : "none";

  return (
    <div
      onClick={isPrev || isBookend ? onClick : undefined}
      className={[
        "rounded-sm border transition-all duration-300 select-none",
        isActive ? "p-5 sm:p-6" : "p-3 sm:p-4",
        isPrev || isBookend ? "cursor-pointer hover:border-[var(--border-bright)]" : "",
        !isActive ? "opacity-50" : "",
      ].join(" ")}
      style={{ border, background: bg, boxShadow: shadow }}
    >
      <div className="flex items-center gap-3">
        {/* Step badge */}
        {stepIndex !== null && !isBookend && (
          <span
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border"
            style={{
              borderColor: isActive ? `rgba(${color},0.7)` : "var(--border)",
              color: isActive ? `rgb(${color})` : "var(--text-muted)",
              background: isActive ? `rgba(${color},0.12)` : "transparent",
            }}
          >
            {stepIndex}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p
            className={[
              "font-semibold leading-tight",
              isActive ? "text-base sm:text-lg text-[var(--text)]" : "text-sm text-[var(--text-muted)]",
            ].join(" ")}
          >
            {label}
          </p>
          {summary && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{summary}</p>
          )}
        </div>
        {isPrev && (
          <span className="text-[var(--text-muted)] text-xs shrink-0">← back</span>
        )}
      </div>

      {/* Active body */}
      {isActive && children && (
        <div className="mt-4">{children}</div>
      )}
    </div>
  );
}

/* ─── Step 1: Find Your Feeling ──────────────────────────────────────── */

function Step1Feeling({
  selected,
  onConfirm,
}: {
  selected: FeelingCluster | null;
  onConfirm: (c: FeelingCluster) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<FeelingCluster[]>(
    FEELING_CLUSTERS.slice(0, 6)
  );
  const [botMsg, setBotMsg] = useState(
    "Tell me what you're feeling, or pick one below 👇"
  );

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions(FEELING_CLUSTERS.slice(0, 6));
      setBotMsg("Tell me what you're feeling, or pick one below 👇");
      return;
    }
    const matches = suggestFeelings(query, 4);
    setSuggestions(matches.length ? matches : FEELING_CLUSTERS.slice(0, 6));
    setBotMsg(
      matches.length
        ? `I found ${matches.length} match${matches.length > 1 ? "es" : ""} — pick the one that fits best.`
        : "Hmm, try different words — or just pick from the list."
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      {/* BOT nudge */}
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">🤖</span>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{botMsg}</p>
      </div>

      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. sorry, joy, hope, courage…"
        className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-sm px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
      />

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((c) => {
          const isChosen = selected?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onConfirm(c)}
              className="px-3 py-1.5 text-xs rounded-sm border transition-all"
              style={
                isChosen
                  ? {
                      borderColor: `rgb(${c.color})`,
                      color: `rgb(${c.color})`,
                      background: `rgba(${c.color},0.12)`,
                    }
                  : undefined
              }
            >
              {c.emoji} {c.label}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={() => onConfirm(selected)}
          className="mt-1 w-full py-2.5 rounded-sm text-sm font-bold uppercase tracking-widest transition-all"
          style={{
            background: `rgb(${selected.color})`,
            color: "#030712",
          }}
        >
          Lock in "{selected.label}" →
        </button>
      )}
    </div>
  );
}

/* ─── Step 2: Find Your PIX ──────────────────────────────────────────── */

function Step2Pix({
  feeling,
  selected,
  onConfirm,
}: {
  feeling: FeelingCluster;
  selected: PixTrack | null;
  onConfirm: (p: PixTrack) => void;
}) {
  const matches = PIX_CATALOG.filter((p) =>
    p.feelings.includes(feeling.id)
  );
  const display = matches.length ? matches : PIX_CATALOG.slice(0, 3);
  const { playingId, toggle, unavailableIds } = useSamplePlayer();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">🤖</span>
        <p className="text-sm text-[var(--text-muted)]">
          {display.length} PIX match <strong style={{ color: `rgb(${feeling.color})` }}>{feeling.label}</strong>.
          Pick the one that fits your vibe.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {display.map((p) => {
          const isChosen = selected?.id === p.id;
          const isPlaying = playingId === p.id;
          const sampleUnavailable = unavailableIds.has(p.id);
          return (
            <div
              key={p.id}
              className="w-full rounded-sm border p-3 transition-all"
              style={
                isChosen
                  ? {
                      borderColor: `rgb(${feeling.color})`,
                      background: `rgba(${feeling.color},0.08)`,
                    }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => onConfirm(p)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-semibold text-[var(--text)]">{p.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {p.artist} · {p.genre} · {p.tempo} tempo · {p.gender}
                  </p>
                </button>
                {/* Sample button — click-to-play only, never auto-plays */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!sampleUnavailable) toggle(p.id, `/samples/${p.id}.mp3`);
                  }}
                  title={sampleUnavailable ? "Sample coming soon" : isPlaying ? "Stop sample" : "Play sample"}
                  disabled={sampleUnavailable}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-sm text-xs border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={
                    isPlaying
                      ? { borderColor: `rgb(${feeling.color})`, color: `rgb(${feeling.color})` }
                      : undefined
                  }
                >
                  {sampleUnavailable ? "🔇 Soon" : isPlaying ? "■ Stop" : "▶ Sample"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 3: Pick Your K-KUT ────────────────────────────────────────── */

function Step3Kut({
  pix,
  selected,
  onConfirm,
}: {
  pix: PixTrack;
  selected: Section[];
  onConfirm: (secs: Section[]) => void;
}) {
  const [localSel, setLocalSel] = useState<Section[]>(selected);
  const { playingId, toggle: toggleSample, stop: stopSample, unavailableIds } = useSamplePlayer();
  const previewId = `preview-${pix.id}`;
  const isPreviewPlaying = playingId === previewId;
  const previewUnavailable = unavailableIds.has(previewId);

  function toggle(sec: Section) {
    // Stop any sample playing when user changes selection
    stopSample();
    setLocalSel((prev) => toggleSection(prev, sec));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">🤖</span>
        <p className="text-sm text-[var(--text-muted)]">
          Pick contiguous sections of <strong className="text-[var(--text)]">{pix.title}</strong>.
          They must flow in song order (ASCAP rule).
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((sec) => {
          const idx = SECTIONS.indexOf(sec);
          const isSelected = localSel.includes(sec);
          const selIndices = localSel.map((s) => SECTIONS.indexOf(s)).sort((a, b) => a - b);
          // Allow selecting if adjacent to current selection or selection is empty
          const canSelect =
            !localSel.length ||
            (selIndices.length > 0 &&
              (idx === (selIndices[0] ?? 0) - 1 ||
                idx === (selIndices[selIndices.length - 1] ?? 0) + 1 ||
                isSelected));

          return (
            <button
              key={sec}
              onClick={() => toggle(sec)}
              disabled={!isSelected && !canSelect}
              className="px-3 py-1.5 text-xs rounded-sm border transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              style={
                isSelected
                  ? {
                      borderColor: "var(--accent)",
                      color: "var(--accent)",
                      background: "var(--accent-glow)",
                    }
                  : undefined
              }
            >
              {sec}
            </button>
          );
        })}
      </div>
      {localSel.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[var(--text-muted)]">
            Selected: {localSel.join(" → ")}
          </p>
          {/* Sample preview — click-to-play only, never auto-plays */}
          <button
            onClick={() => { if (!previewUnavailable) toggleSample(previewId, `/samples/${pix.id}-${localSel.join("-")}.mp3`); }}
            title={previewUnavailable ? "Sample coming soon" : isPreviewPlaying ? "Stop preview" : "Preview this K-KUT (optional)"}
            disabled={previewUnavailable}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-sm text-xs border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={
              isPreviewPlaying
                ? { borderColor: "var(--accent)", color: "var(--accent)" }
                : undefined
            }
          >
            {previewUnavailable ? "🔇 Soon" : isPreviewPlaying ? "■ Stop" : "▶ Preview K-KUT"}
          </button>
        </div>
      )}
      <button
        onClick={() => onConfirm(localSel)}
        disabled={!localSel.length}
        className="mt-1 w-full py-2.5 rounded-sm text-sm font-bold uppercase tracking-widest transition-all bg-[var(--accent)] text-[var(--bg)] disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
      >
        {localSel.length ? `Confirm K-KUT (${localSel.join("+")} ) →` : "Select at least 1 section"}
      </button>
    </div>
  );
}

/* ─── Step 4: Choose Your Messenger ──────────────────────────────────── */

function Step4Messenger({
  feeling,
  selected,
  onConfirm,
}: {
  feeling: FeelingCluster;
  selected: Messenger | null;
  onConfirm: (m: Messenger) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">🤖</span>
        <p className="text-sm text-[var(--text-muted)]">
          Your K-KUT carries{" "}
          <strong style={{ color: `rgb(${feeling.color})` }}>{feeling.label}</strong>.
          How should it arrive?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {feeling.messengers.map((m) => {
          const isChosen = selected?.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onConfirm(m)}
              className="rounded-sm border p-3 text-left transition-all"
              style={
                isChosen
                  ? {
                      borderColor: `rgb(${feeling.color})`,
                      background: `rgba(${feeling.color},0.12)`,
                    }
                  : undefined
              }
            >
              <span className="text-xl">{m.emoji}</span>
              <p className="text-xs font-semibold text-[var(--text)] mt-1">{m.label}</p>
            </button>
          );
        })}
      </div>
      {selected && (
        <button
          onClick={() => onConfirm(selected)}
          className="mt-1 w-full py-2.5 rounded-sm text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
          style={{
            background: `rgb(${feeling.color})`,
            color: "#030712",
          }}
        >
          Send as "{selected.label}" →
        </button>
      )}
    </div>
  );
}

/* ─── Step 5: Send It ────────────────────────────────────────────────── */

function Step5Send({
  feeling,
  pix,
  sections,
  messenger,
}: {
  feeling: FeelingCluster;
  pix: PixTrack;
  sections: Section[];
  messenger: Messenger;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">🤖</span>
        <p className="text-sm text-[var(--text-muted)]">
          You&rsquo;re all set. Review your K-KUT below, then send it.
        </p>
      </div>
      {/* Summary card */}
      <div
        className="rounded-sm border p-4 flex flex-col gap-2"
        style={{
          borderColor: `rgba(${feeling.color},0.5)`,
          background: `rgba(${feeling.color},0.06)`,
        }}
      >
        <Row label="Feeling" value={`${feeling.emoji} ${feeling.label}`} />
        <Row label="PIX" value={`${pix.title} — ${pix.artist}`} />
        <Row label="K-KUT" value={sections.join(" → ")} />
        <Row label="Messenger" value={`${messenger.emoji} ${messenger.label}`} />
      </div>
      {/* Payment CTA (Stripe integration placeholder) */}
      <button
        className="w-full py-3 rounded-sm text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
        style={{ background: `rgb(${feeling.color})`, color: "#030712" }}
        onClick={() => alert("Stripe checkout coming soon — Sovereign Pass required.")}
      >
        💳 Buy & Send →
      </button>
      <p className="text-[10px] text-center text-[var(--text-muted)]">
        1 K-KUT · 1 PIX · per email + IP · ASCAP compliant
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-xs">
      <span className="text-[var(--text-muted)] uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-[var(--text)] text-right">{value}</span>
    </div>
  );
}

/* ─── KutWizard (main export) ────────────────────────────────────────── */

type WizardState = {
  feeling: FeelingCluster | null;
  pix: PixTrack | null;
  sections: Section[];
  messenger: Messenger | null;
};

const STEP_LABELS = [
  "START",                  // 0 — bookend
  "Find Your Feeling",      // 1
  "Find Your PIX",          // 2
  "Pick Your K-KUT",        // 3
  "Choose Your Messenger",  // 4
  "Send It",                // 5
  "END · Thanks!",          // 6 — bookend
];

export default function KutWizard() {
  const [step, setStep] = useState(1); // 1–5 active steps
  const [state, setState] = useState<WizardState>({
    feeling: null,
    pix: null,
    sections: [],
    messenger: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Clamp step 1..5 (bookends rendered separately)
  const clampedStep = Math.max(1, Math.min(5, step));

  function goBack() {
    if (step > 1) setStep((s) => s - 1);
  }
  function advance() {
    if (step < 5) setStep((s) => s + 1);
  }

  // Summary labels for dimmed rows
  function stepSummary(s: number): string {
    if (s === 1) return state.feeling ? `${state.feeling.emoji} ${state.feeling.label}` : "";
    if (s === 2) return state.pix ? `${state.pix.title}` : "";
    if (s === 3) return state.sections.length ? state.sections.join("+") : "";
    if (s === 4) return state.messenger ? `${state.messenger.emoji} ${state.messenger.label}` : "";
    return "";
  }

  const accent = state.feeling?.color ?? "0,229,255";

  /* Rows to render: prev / active / next */
  const rows: ("start-bookend" | 1 | 2 | 3 | 4 | 5 | "end-bookend")[] = [];

  // prev row
  if (clampedStep === 1) rows.push("start-bookend");
  else rows.push((clampedStep - 1) as 1 | 2 | 3 | 4);

  // active
  rows.push(clampedStep as 1 | 2 | 3 | 4 | 5);

  // next row
  if (clampedStep === 5) rows.push("end-bookend");
  else rows.push((clampedStep + 1) as 2 | 3 | 4 | 5);

  return (
    <div ref={containerRef} className="max-w-lg mx-auto px-4 sm:px-0 flex flex-col gap-3">
      {rows.map((rowVal) => {
        /* ── START bookend ── */
        if (rowVal === "start-bookend") {
          return (
            <StepRow
              key="start"
              variant="prev"
              stepIndex={null}
              label="▲ START"
              summary="Tap to restart"
              onClick={() => setStep(1)}
            />
          );
        }
        /* ── END bookend ── */
        if (rowVal === "end-bookend") {
          return (
            <StepRow
              key="end"
              variant="bookend"
              stepIndex={null}
              label="END · Thanks! 🎉"
              summary="Your K-KUT is ready to send"
            />
          );
        }

        const s = rowVal as 1 | 2 | 3 | 4 | 5;
        const isActive = s === clampedStep;
        const isPrev = s < clampedStep;
        const variant: RowVariant = isActive ? "active" : isPrev ? "prev" : "next";

        return (
          <StepRow
            key={s}
            variant={variant}
            stepIndex={s}
            label={STEP_LABELS[s]}
            summary={stepSummary(s)}
            accentColor={accent}
            onClick={isPrev ? goBack : undefined}
          >
            {/* Active content per step */}
            {isActive && s === 1 && (
              <Step1Feeling
                selected={state.feeling}
                onConfirm={(c) => {
                  setState((prev) => ({ ...prev, feeling: c, pix: null, sections: [], messenger: null }));
                  advance();
                }}
              />
            )}
            {isActive && s === 2 && state.feeling && (
              <Step2Pix
                feeling={state.feeling}
                selected={state.pix}
                onConfirm={(p) => {
                  setState((prev) => ({ ...prev, pix: p, sections: [], messenger: null }));
                  advance();
                }}
              />
            )}
            {isActive && s === 3 && state.pix && (
              <Step3Kut
                pix={state.pix}
                selected={state.sections}
                onConfirm={(secs) => {
                  if (!secs.length) return;
                  setState((prev) => ({ ...prev, sections: secs, messenger: null }));
                  advance();
                }}
              />
            )}
            {isActive && s === 4 && state.feeling && (
              <Step4Messenger
                feeling={state.feeling}
                selected={state.messenger}
                onConfirm={(m) => {
                  setState((prev) => ({ ...prev, messenger: m }));
                  advance();
                }}
              />
            )}
            {isActive && s === 5 && state.feeling && state.pix && state.sections.length && state.messenger && (
              <Step5Send
                feeling={state.feeling}
                pix={state.pix}
                sections={state.sections}
                messenger={state.messenger}
              />
            )}
            {/* Guard: step reachable but prerequisite missing */}
            {isActive && s === 2 && !state.feeling && (
              <p className="text-sm text-[var(--text-muted)]">Complete Step 1 first.</p>
            )}
            {isActive && s === 3 && !state.pix && (
              <p className="text-sm text-[var(--text-muted)]">Complete Step 2 first.</p>
            )}
            {isActive && s === 5 && (!state.feeling || !state.pix || !state.sections.length || !state.messenger) && (
              <p className="text-sm text-[var(--text-muted)]">Complete all steps first.</p>
            )}
          </StepRow>
        );
      })}

      {/* Step counter */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{
              background:
                s === clampedStep
                  ? `rgb(${accent})`
                  : s < clampedStep
                  ? `rgba(${accent},0.4)`
                  : "var(--border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
