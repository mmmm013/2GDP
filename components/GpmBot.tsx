'use client';

/**
 * GpmBot — Step-by-Step Journey Guide (Voice-Activated)
 *
 * Behavior:
 *  - Greets the user on mount with the active bot's arrival greeting
 *  - Displays journey steps in a vertical scroll window
 *  - Active step: full contrast, animated pulse ring, bold label
 *  - Previous steps (above): dimmed, ✓ check mark, still visible
 *  - Next steps (below): dimmed, numbered, peeking to invite scroll
 *  - User advances via "Next Step" button, keyboard (→), or VOICE COMMAND
 *  - Voice commands: "next" / "back" / "go" / "done" / "collapse" / "expand"
 *  - Can collapse to a compact bot-chip to stay non-intrusive
 *
 * Props:
 *  bot        - which bot persona to use (default: 'MC-BOT')
 *  steps      - optional custom journey steps (defaults to JOURNEY_PROTOCOL)
 *  onStepChange - optional callback fired when activeStep changes
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronDown, CheckCircle, Circle, Zap, X, Mic, MicOff } from 'lucide-react';

// ---------------------------------------------------------------------------
// Bot config — mirrors BOT_PROFILES in /api/public/kkut-guide
// ---------------------------------------------------------------------------

export type BotName = 'MC-BOT' | 'LF-BOT' | 'GD-BOT' | 'PIXIE-BOT';

const BOT_CONFIG: Record<BotName, {
  label: string;
  color: string;
  ringColor: string;
  emoji: string;
  greeting: string;
}> = {
  'MC-BOT': {
    label: 'MC-BOT',
    color: '#C8A882',
    ringColor: 'ring-amber-500/60',
    emoji: '🎛️',
    greeting: 'Welcome to G Putnam Music. I am MC-BOT. I will guide your full journey step by step.',
  },
  'LF-BOT': {
    label: 'LF-BOT',
    color: '#f9a8d4',
    ringColor: 'ring-pink-400/60',
    emoji: '💌',
    greeting: 'Welcome. I am LF-BOT. Tell me your goal and I will map each next step clearly.',
  },
  'GD-BOT': {
    label: 'GD-BOT',
    color: '#6ee7b7',
    ringColor: 'ring-emerald-400/60',
    emoji: '📊',
    greeting: 'Welcome. GD-BOT online. I will provide exact, actionable steps and checkpoints.',
  },
  'PIXIE-BOT': {
    label: 'PIXIE-BOT',
    color: '#a78bfa',
    ringColor: 'ring-violet-400/60',
    emoji: '✨',
    greeting: 'Hi, I am PIXIE-BOT. I can shape your perfect music moment and guide every click.',
  },
};

// ---------------------------------------------------------------------------
// Default journey steps (from JOURNEY_PROTOCOL in kkut-guide API)
// Each step has a title + optional hint shown in the expanded view
// ---------------------------------------------------------------------------

export interface JourneyStep {
  title: string;
  hint?: string;
  /** Optional href — if set, the CTA button navigates there */
  href?: string;
  /** Optional action label for the CTA button */
  action?: string;
}

export const DEFAULT_STEPS: JourneyStep[] = [
  {
    title: 'Discover your music moment',
    hint: 'Browse the catalog or tell the BOT what mood, occasion, or artist you have in mind.',
    action: 'Browse Catalog',
    href: '/#t20',
  },
  {
    title: 'Choose a K-KUT or mini-KUT path',
    hint: 'K-KUT = full sweet-spot link. mini-KUT = short verse/chorus clip. Both shareable in one tap.',
    action: 'Explore K-KUTs',
    href: '/kupid',
  },
  {
    title: 'Generate or resolve your link',
    hint: 'Create your 6-character K-KUT code at kkupid.com/kkut/create or let the BOT resolve one for you.',
    action: 'Create K-KUT',
    href: '/kkut/create',
  },
  {
    title: 'Open & play your experience',
    hint: 'Tap the link to open the track at its exact sweet spot. No app needed — just tap and hear it.',
    action: 'Play a Track',
    href: '/k',
  },
  {
    title: 'Share or gift your K-kUpId',
    hint: 'Send to a friend, pair with a K-kUpId jewelry capsule, or add to a Heart-Tap gift.',
    action: 'Gift It',
    href: '/gift',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface GpmBotProps {
  bot?: BotName;
  steps?: JourneyStep[];
  onStepChange?: (index: number) => void;
  /** If true, bot starts collapsed into chip mode */
  startCollapsed?: boolean;
  className?: string;
}

export default function GpmBot({
  bot = 'MC-BOT',
  steps = DEFAULT_STEPS,
  onStepChange,
  startCollapsed = false,
  className = '',
}: GpmBotProps) {
  const profile = BOT_CONFIG[bot];

  const [activeStep, setActiveStep] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(startCollapsed);
  const [greeted, setGreeted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognitionRef = useRef<any>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Show greeting bubble once on mount
  useEffect(() => {
    if (isCollapsed) return;
    const t = setTimeout(() => {
      setShowGreeting(true);
      setGreeted(true);
    }, 400);
    return () => clearTimeout(t);
  }, [isCollapsed]);

  // Auto-dismiss greeting after 6s
  useEffect(() => {
    if (!showGreeting) return;
    const t = setTimeout(() => setShowGreeting(false), 6000);
    return () => clearTimeout(t);
  }, [showGreeting]);

  // Scroll active step into centre of the step-list container
  useEffect(() => {
    const el = stepRefs.current[activeStep];
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    onStepChange?.(activeStep);
  }, [activeStep, onStepChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setActiveStep((s) => Math.min(s + 1, steps.length - 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setActiveStep((s) => Math.max(s - 1, 0));
    }
  }, [steps.length]);

  // Voice command handler
  const handleVoiceCommand = useCallback((transcript: string) => {
    const cmd = transcript.toLowerCase().trim();
    if (cmd.includes('next') || cmd.includes('forward') || cmd.includes('proceed')) {
      setActiveStep((s) => Math.min(s + 1, steps.length - 1));
      setVoiceStatus('→ Next');
    } else if (cmd.includes('back') || cmd.includes('previous') || cmd.includes('prev')) {
      setActiveStep((s) => Math.max(s - 1, 0));
      setVoiceStatus('← Back');
    } else if (cmd.includes('done') || cmd.includes('finish') || cmd.includes('close') || cmd.includes('collapse')) {
      setIsCollapsed(true);
      setVoiceStatus('Done ✓');
    } else if (cmd.includes('expand') || cmd.includes('open') || cmd.includes('show')) {
      setIsCollapsed(false);
      setVoiceStatus('Expanded');
    } else if (cmd.includes('go') || cmd.includes('action') || cmd.includes('click')) {
      // trigger the current step's href if available
      const step = steps[activeStep];
      if (step?.href) window.location.href = step.href;
      setVoiceStatus('Going →');
    }
    setTimeout(() => setVoiceStatus(''), 2000);
  }, [steps, activeStep]);

  // Set up / tear down SpeechRecognition when isListening changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (!recognitionRef.current) {
      const r = new SR();
      r.continuous = true;
      r.lang = 'en-US';
      r.interimResults = false;
      r.onresult = (event: any) => {
        const t = event.results[event.results.length - 1][0].transcript;
        handleVoiceCommand(t);
      };
      r.onerror = () => { /* silent */ };
      r.onend = () => {
        if (isListening) { try { r.start(); } catch (_) { /* already started */ } }
      };
      recognitionRef.current = r;
    }

    if (isListening) {
      try { recognitionRef.current.start(); } catch (_) { /* already running */ }
    } else {
      try { recognitionRef.current.stop(); } catch (_) { /* not running */ }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) { /**/ }
      }
    };
  }, [isListening, handleVoiceCommand]);

  const goNext = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setActiveStep((s) => Math.max(s - 1, 0));

  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  // ── COLLAPSED CHIP ────────────────────────────────────────────────────────
  if (isCollapsed) {
    return (
      <button
        onClick={() => {
          setIsCollapsed(false);
          if (!greeted) {
            setTimeout(() => { setShowGreeting(true); setGreeted(true); }, 200);
          }
        }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase transition-all hover:brightness-110 ${className}`}
        style={{ borderColor: `${profile.color}40`, color: profile.color, background: `${profile.color}10` }}
        aria-label={`Open ${profile.label} guide`}
      >
        <span>{profile.emoji}</span>
        <span>{profile.label}</span>
        <span className="text-[9px] text-white/40">STEP {activeStep + 1}/{steps.length}</span>
        <Mic className="w-2.5 h-2.5 opacity-30" />
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
    );
  }

  // ── EXPANDED VIEW ─────────────────────────────────────────────────────────
  return (
    <div
      className={`relative w-full max-w-sm rounded-2xl border bg-black/80 backdrop-blur-md overflow-hidden ${className}`}
      style={{ borderColor: `${profile.color}30` }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${profile.label} journey guide`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: `${profile.color}20`, background: `${profile.color}08` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{profile.emoji}</span>
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: profile.color }}>
              {profile.label}
            </span>
            <span className="block text-[9px] text-white/40 tracking-widest uppercase">
              STEP {activeStep + 1} OF {steps.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Voice status flash */}
          {voiceStatus && (
            <span className="text-[9px] font-bold tracking-wider" style={{ color: profile.color }}>
              {voiceStatus}
            </span>
          )}
          {/* Mic toggle button */}
          <button
            onClick={() => setIsListening((v) => !v)}
            className={`p-1.5 rounded-full transition-all ${
              isListening
                ? 'animate-pulse'
                : 'hover:bg-white/10'
            }`}
            style={isListening ? { background: `${profile.color}30`, color: profile.color } : {}}
            aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
            title={isListening ? 'Voice active — say: next / back / go / done' : 'Enable voice control'}
          >
            {isListening ? (
              <Mic className="w-3.5 h-3.5" style={{ color: profile.color }} />
            ) : (
              <MicOff className="w-3.5 h-3.5 text-white/30" />
            )}
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Collapse bot"
          >
            <X className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      </div>

      {/* Greeting Bubble */}
      {showGreeting && (
        <div
          className="mx-4 mt-3 px-3 py-2.5 rounded-xl text-xs text-white/80 leading-relaxed animate-fade-in"
          style={{ background: `${profile.color}15`, border: `1px solid ${profile.color}25` }}
        >
          <Zap className="inline w-3 h-3 mr-1 mb-0.5" style={{ color: profile.color }} />
          {profile.greeting}
        </div>
      )}

      {/* Step List — scrollable window showing prev + active + next */}
      <div className="px-3 py-3 flex flex-col gap-1.5 max-h-72 overflow-y-auto scrollbar-hide">
        {steps.map((step, i) => {
          const isPast = i < activeStep;
          const isCurrent = i === activeStep;
          const isFuture = i > activeStep;

          return (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              onClick={() => setActiveStep(i)}
              className={`relative flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                isCurrent
                  ? `ring-2 ${profile.ringColor} bg-white/5`
                  : isPast
                  ? 'opacity-45 hover:opacity-60'
                  : 'opacity-35 hover:opacity-55'
              }`}
              style={isCurrent ? { borderColor: `${profile.color}40` } : {}}
              aria-current={isCurrent ? 'step' : undefined}
              role="button"
              tabIndex={-1}
            >
              {/* Step icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isPast ? (
                  <CheckCircle className="w-4 h-4" style={{ color: profile.color }} />
                ) : isCurrent ? (
                  <span
                    className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black animate-pulse"
                    style={{ background: profile.color, color: '#000' }}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <Circle className="w-4 h-4 text-white/25" />
                )}
              </div>

              {/* Step text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-semibold leading-snug ${isCurrent ? 'text-white' : 'text-white/60'}`}
                >
                  {step.title}
                </p>
                {isCurrent && step.hint && (
                  <p className="mt-1 text-[10px] text-white/50 leading-relaxed">{step.hint}</p>
                )}
                {isCurrent && step.href && (
                  <a
                    href={step.href}
                    className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full transition-all hover:brightness-110"
                    style={{
                      background: `${profile.color}20`,
                      color: profile.color,
                      border: `1px solid ${profile.color}40`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {step.action ?? 'Go'}
                    <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div
        className="flex items-center justify-between px-4 py-3 border-t"
        style={{ borderColor: `${profile.color}20` }}
      >
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all disabled:opacity-20 hover:bg-white/10"
          style={{ color: profile.color }}
        >
          ← Back
        </button>

        <span className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="rounded-full transition-all"
              style={{
                width: i === activeStep ? '14px' : '6px',
                height: '6px',
                background: i === activeStep ? profile.color : `${profile.color}40`,
              }}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </span>

        {isLast ? (
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all hover:brightness-110"
            style={{ background: `${profile.color}20`, color: profile.color, border: `1px solid ${profile.color}40` }}
          >
            Done ✓
          </button>
        ) : (
          <button
            onClick={goNext}
            className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all hover:brightness-110"
            style={{ background: `${profile.color}20`, color: profile.color, border: `1px solid ${profile.color}40` }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
