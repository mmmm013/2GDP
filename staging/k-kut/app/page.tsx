'use client';

/**
 * K-KUT — Landing Page Wizard
 *
 * One-step-at-a-time guided experience.
 * Active step is fully visible and interactive.
 * Adjacent steps are visible but dimmed — all others hidden.
 * BOT guides the user with action-oriented instructions.
 *
 * Steps:
 *   1. Browse a feeling  → select feeling tile → up to 5 themed LT-PIX surfaces
 *   2. Select your path  → K-KUT (audio section) or mini-KUT (text phrase)
 *   3. Pick your messenger (revealed only when Step 3 is active)
 *   4. Choose the channel → SMS · DM · Social · Email
 */

import { useState } from 'react';
import Link from 'next/link';

// ── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, label: 'Browse a feeling' },
  { num: 2, label: 'Select your path' },
  { num: 3, label: 'Pick your messenger' },
  { num: 4, label: 'Choose the channel' },
] as const;

type StepNum = 1 | 2 | 3 | 4;

// ── Step 1 — Feeling tiles ───────────────────────────────────────────────────
const FEELINGS = ['Hype', 'Heart', 'Romance', 'Apology', 'Gratitude'] as const;
type Feeling = (typeof FEELINGS)[number];

// Up to 5 LT-PIXs per feeling. BOT recommends Br→Final Chorus as #1.
const PIX_LIBRARY: Record<Feeling, { id: string; title: string; sections: string; bot?: boolean }[]> = {
  Hype: [
    { id: 'h1', title: 'On Fire', sections: 'BR → Ch3', bot: true },
    { id: 'h2', title: 'Rising Up', sections: 'Intro → V1 → Ch1' },
    { id: 'h3', title: 'Stadium', sections: 'Ch2 → BR' },
    { id: 'h4', title: 'War Cry', sections: 'V2 → Pre2 → Ch2' },
    { id: 'h5', title: 'Last Stand', sections: 'Ch3 → Outro' },
  ],
  Heart: [
    { id: 'ht1', title: 'Wide Open', sections: 'BR → Ch3', bot: true },
    { id: 'ht2', title: 'First Glance', sections: 'Intro → V1 → Ch1' },
    { id: 'ht3', title: 'Tender', sections: 'V1 → Pre1 → Ch1' },
    { id: 'ht4', title: 'Still Here', sections: 'V2 → Pre2 → Ch2' },
    { id: 'ht5', title: 'Forever Yours', sections: 'Ch3 → Outro' },
  ],
  Romance: [
    { id: 'r1', title: 'Electric', sections: 'BR → Ch3', bot: true },
    { id: 'r2', title: 'First Move', sections: 'Intro → V1 → Ch1' },
    { id: 'r3', title: 'Close', sections: 'Ch2 → BR' },
    { id: 'r4', title: 'Slow Burn', sections: 'V2 → Pre2 → Ch2' },
    { id: 'r5', title: 'Inevitable', sections: 'Ch3 → Outro' },
  ],
  Apology: [
    { id: 'a1', title: 'I Meant It', sections: 'BR → Ch3', bot: true },
    { id: 'a2', title: 'Said Too Much', sections: 'V1 → Pre1 → Ch1' },
    { id: 'a3', title: 'Come Back', sections: 'Ch2 → BR' },
    { id: 'a4', title: 'I Was Wrong', sections: 'V2 → Pre2 → Ch2' },
    { id: 'a5', title: 'Forgive Me', sections: 'Ch3 → Outro' },
  ],
  Gratitude: [
    { id: 'g1', title: 'Thank You', sections: 'BR → Ch3', bot: true },
    { id: 'g2', title: 'You Changed Me', sections: 'Intro → V1 → Ch1' },
    { id: 'g3', title: 'Because of You', sections: 'Ch1 → V2 → Ch2' },
    { id: 'g4', title: 'Enough', sections: 'V2 → Pre2 → Ch2' },
    { id: 'g5', title: 'Full Circle', sections: 'Ch3 → Outro' },
  ],
};

// ── Step 3 — Messengers (hidden until Step 3 is active) ─────────────────────
const MESSENGERS = [
  { id: 'devil', emoji: '😈', label: 'Devil' },
  { id: 'cupid', emoji: '💘', label: 'Cupid' },
  { id: 'angel', emoji: '😇', label: 'Angel' },
  { id: 'nurse', emoji: '👩‍⚕️', label: 'Nurse' },
  { id: 'romeo', emoji: '🌹', label: 'Romeo' },
  { id: 'puppy', emoji: '🐶', label: 'Puppy' },
  { id: 'cat',   emoji: '🐱', label: 'Cat' },
  { id: 'ghost', emoji: '👻', label: 'Ghost' },
] as const;

// ── Step 4 — Channels ────────────────────────────────────────────────────────
const CHANNELS = [
  { id: 'sms',    label: 'SMS',    desc: 'Direct to their phone' },
  { id: 'dm',     label: 'DM',     desc: 'Slide into the moment' },
  { id: 'social', label: 'Social', desc: 'Make it public' },
  { id: 'email',  label: 'Email',  desc: 'Deliver with ceremony' },
] as const;

// ── BOT guidance per step ────────────────────────────────────────────────────
const BOT_GUIDE: Record<StepNum, string> = {
  1: 'TAP a feeling tile below. Your matching tracks will appear.',
  2: 'CHOOSE your format — a section of audio (K-KUT) or a text phrase (mini-KUT).',
  3: 'PICK the messenger who carries this moment. Each one enters differently.',
  4: 'SELECT how it arrives. Three panels open. The delivery is new every time.',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function HomePage() {
  const [step, setStep]               = useState<StepNum>(1);
  const [feeling, setFeeling]         = useState<Feeling | null>(null);
  const [pix, setPix]                 = useState<string | null>(null);
  const [path, setPath]               = useState<'kkut' | 'mkut' | null>(null);
  const [messenger, setMessenger]     = useState<string | null>(null);
  const [channel, setChannel]         = useState<string | null>(null);
  const [done, setDone]               = useState(false);

  // ── can the user advance from the current step? ──────────────────────────
  const canAdvance: Record<StepNum, boolean> = {
    1: feeling !== null && pix !== null,
    2: path !== null,
    3: messenger !== null,
    4: channel !== null,
  };

  function advance() {
    if (step < 4) {
      setStep((s) => (s + 1) as StepNum);
    } else {
      setDone(true);
    }
  }

  // ── Completion screen ─────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-[#00bcd4]">K-KUT</h1>
          <button
            onClick={() => { setStep(1); setFeeling(null); setPix(null); setPath(null); setMessenger(null); setChannel(null); setDone(false); }}
            className="text-sm text-[#C8A882] hover:text-white transition-colors"
          >
            Start over
          </button>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#00bcd4]">Your feeling is ready</p>
          <h2 className="text-4xl font-extrabold text-white">One delivered feeling.</h2>
          <div className="rounded-2xl border border-white/10 bg-[#111] p-6 max-w-sm w-full text-left flex flex-col gap-3 text-sm text-[#C8A882]">
            <div><span className="text-white/40 mr-2">Feeling</span>{feeling}</div>
            <div><span className="text-white/40 mr-2">Track</span>{PIX_LIBRARY[feeling!].find(p => p.id === pix)?.title} · {PIX_LIBRARY[feeling!].find(p => p.id === pix)?.sections}</div>
            <div><span className="text-white/40 mr-2">Path</span>{path === 'kkut' ? 'K-KUT (audio section)' : 'mini-KUT (text phrase)'}</div>
            <div><span className="text-white/40 mr-2">Messenger</span>{MESSENGERS.find(m => m.id === messenger)?.emoji} {MESSENGERS.find(m => m.id === messenger)?.label}</div>
            <div><span className="text-white/40 mr-2">Channel</span>{CHANNELS.find(c => c.id === channel)?.label}</div>
          </div>
          <a
            href="https://gputnammusic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#00bcd4] text-[#0a0a0a] font-bold rounded-full hover:opacity-80 transition-opacity"
          >
            Get Your K-KUT →
          </a>
        </main>
        <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-[#C8A882]">
          K-KUT · <a href="https://gputnammusic.com" className="hover:text-[#00bcd4]">G Putnam Music</a>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-[#00bcd4]">K-KUT</h1>
        <nav className="flex gap-4 text-sm text-[#C8A882]">
          <Link href="/invention" className="hover:text-[#00bcd4] transition-colors">Inventions</Link>
        </nav>
      </header>

      {/* ── Hero label ── */}
      <div className="text-center pt-10 pb-6 px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C8A882] mb-2">K-KUT</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Four steps. One delivered feeling.</h2>
      </div>

      {/* ── Wizard rail ── */}
      <main className="flex-1 px-4 sm:px-6 max-w-xl mx-auto w-full pb-16 flex flex-col gap-2">

        {STEPS.map(({ num, label }) => {
          const isActive   = num === step;
          const isPrev     = num === step - 1;
          const isNext     = num === step + 1;
          const isVisible  = isActive || isPrev || isNext;

          if (!isVisible) return null;

          return (
            <div
              key={num}
              className={`transition-all duration-300 rounded-2xl border ${
                isActive
                  ? 'border-[#00bcd4]/60 bg-[#0d1f22]'
                  : 'border-white/5 bg-transparent'
              }`}
            >
              {/* Step header — always visible when the slot is shown */}
              <div className={`flex items-center gap-4 px-5 pt-5 ${isActive ? 'pb-2' : 'pb-5'}`}>
                <span
                  className={`text-4xl font-extrabold tabular-nums leading-none transition-colors ${
                    isActive ? 'text-[#00bcd4]' : 'text-white/15'
                  }`}
                >
                  {pad(num)}
                </span>
                <span
                  className={`font-bold text-lg transition-colors ${
                    isActive ? 'text-white' : 'text-white/20'
                  }`}
                >
                  {label}
                </span>
                {/* completed checkmark for previous step */}
                {isPrev && (
                  <span className="ml-auto text-[#00bcd4]/40 text-sm">✓</span>
                )}
              </div>

              {/* Active step body ──────────────────────────────────────────── */}
              {isActive && (
                <div className="px-5 pb-5 flex flex-col gap-5">

                  {/* BOT guidance */}
                  <div className="flex items-start gap-2 rounded-xl bg-[#00bcd4]/8 border border-[#00bcd4]/20 px-4 py-3">
                    <span className="text-[#00bcd4] text-lg mt-0.5">🤖</span>
                    <p className="text-sm text-[#00bcd4] font-medium leading-snug">{BOT_GUIDE[step]}</p>
                  </div>

                  {/* ── Step 1: Feeling tiles + PIX ───────────────────────── */}
                  {step === 1 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-2">
                        {FEELINGS.map((f) => (
                          <button
                            key={f}
                            onClick={() => { setFeeling(f); setPix(null); }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                              feeling === f
                                ? 'border-[#00bcd4] bg-[#00bcd4]/20 text-[#00bcd4]'
                                : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white/70'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>

                      {/* PIX list for selected feeling */}
                      {feeling && (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs uppercase tracking-widest text-[#C8A882] mb-1">
                            {PIX_LIBRARY[feeling].length} matches for {feeling}
                          </p>
                          {PIX_LIBRARY[feeling].map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setPix(p.id)}
                              className={`text-left rounded-xl border px-4 py-3 transition-all ${
                                pix === p.id
                                  ? 'border-[#00bcd4]/60 bg-[#00bcd4]/10'
                                  : 'border-white/10 bg-[#111] hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className={`font-semibold text-sm ${pix === p.id ? 'text-[#00bcd4]' : 'text-white'}`}>
                                    {p.title}
                                  </p>
                                  <p className="text-xs text-[#C8A882] mt-0.5 font-mono">{p.sections}</p>
                                </div>
                                {p.bot && (
                                  <span className="text-xs px-2 py-0.5 rounded-full border border-[#00bcd4]/30 text-[#00bcd4] whitespace-nowrap">
                                    🤖 #1 pick
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Step 2: Path selection ─────────────────────────────── */}
                  {step === 2 && (
                    <div className="flex flex-col gap-3">
                      {[
                        { id: 'kkut' as const, label: 'K-KUT', sub: 'Own a section of audio — exact, legal, permanent.' },
                        { id: 'mkut' as const, label: 'mini-KUT', sub: 'Own a word, phrase, or hook — text only, freed from the track.' },
                      ].map(({ id, label, sub }) => (
                        <button
                          key={id}
                          onClick={() => setPath(id)}
                          className={`text-left rounded-xl border px-5 py-4 transition-all ${
                            path === id
                              ? 'border-[#00bcd4]/60 bg-[#00bcd4]/10'
                              : 'border-white/10 bg-[#111] hover:border-white/20'
                          }`}
                        >
                          <p className={`font-bold mb-1 ${path === id ? 'text-[#00bcd4]' : 'text-white'}`}>{label}</p>
                          <p className="text-xs text-[#C8A882]">{sub}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── Step 3: Messenger (only visible now) ──────────────── */}
                  {step === 3 && (
                    <div className="grid grid-cols-4 gap-2">
                      {MESSENGERS.map(({ id, emoji, label }) => (
                        <button
                          key={id}
                          onClick={() => setMessenger(id)}
                          className={`flex flex-col items-center gap-1 rounded-xl border py-3 transition-all ${
                            messenger === id
                              ? 'border-[#00bcd4]/60 bg-[#00bcd4]/10'
                              : 'border-white/10 bg-[#111] hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className={`text-xs font-semibold ${messenger === id ? 'text-[#00bcd4]' : 'text-white/60'}`}>
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── Step 4: Channel ───────────────────────────────────── */}
                  {step === 4 && (
                    <div className="grid grid-cols-2 gap-3">
                      {CHANNELS.map(({ id, label, desc }) => (
                        <button
                          key={id}
                          onClick={() => setChannel(id)}
                          className={`text-left rounded-xl border px-4 py-4 transition-all ${
                            channel === id
                              ? 'border-[#00bcd4]/60 bg-[#00bcd4]/10'
                              : 'border-white/10 bg-[#111] hover:border-white/20'
                          }`}
                        >
                          <p className={`font-bold text-sm mb-1 ${channel === id ? 'text-[#00bcd4]' : 'text-white'}`}>
                            {label}
                          </p>
                          <p className="text-xs text-[#C8A882]">{desc}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Advance button */}
                  <button
                    onClick={advance}
                    disabled={!canAdvance[step]}
                    className={`w-full py-3 rounded-full font-bold text-sm transition-all ${
                      canAdvance[step]
                        ? 'bg-[#00bcd4] text-[#0a0a0a] hover:opacity-80'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    {step < 4 ? `Next: ${STEPS[step].label} →` : 'Get My Delivery →'}
                  </button>

                </div>
              )}
            </div>
          );
        })}

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-[#C8A882]">
        K-KUT · <a href="https://gputnammusic.com" className="hover:text-[#00bcd4] transition-colors">G Putnam Music</a> ·{' '}
        <Link href="/invention" className="hover:text-[#00bcd4] transition-colors">Inventions</Link>
      </footer>

    </div>
  );
}
