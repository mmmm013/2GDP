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
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, CheckCircle, Circle, Zap, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

// ---------------------------------------------------------------------------
// Bot config — mirrors BOT_PROFILES in /api/public/kkut-guide
// ---------------------------------------------------------------------------

export type BotName = 'MC-BOT' | 'LF-BOT' | 'GD-BOT' | 'PIXIE-BOT' | 'OPS-BOT';

const BOT_CONFIG: Record<BotName, {
  label: string;
  color: string;
  ringColor: string;
  emoji: string;
  greeting: string;
  /** Single bold line shown on first-ever visit — the invention unveiling itself */
  firstVisitCue: string;
  /** Voice/persona descriptor shown as a sub-label */
  voice: string;
  /** TTS tuning — pitch (0.5–2), rate (0.5–2), and BCP-47 lang tag for this persona */
  ttsPitch: number;
  ttsRate: number;
  ttsLang: string;
  /**
   * Real recorded audio file for the greeting (served from /public/audio/).
   * When set, the audio file plays first; SpeechSynthesis fires only as fallback
   * if the file fails to load or the browser blocks autoplay.
   */
  greetingAudio?: string;
}> = {
  /**
   * MC-BOT — KLEIGH, AUS
   * Australian dialect, warm, roguish, "Robin Hood" maverick energy.
   * Sounds like a close friend showing you the good stuff, not a salesperson.
   * First to greet every visitor; hands off to LF-BOT, GD-BOT, or PIXIE-BOT as needed.
   */
  'MC-BOT': {
    label: 'MC-BOT',
    color: '#C8A882',
    ringColor: 'ring-amber-500/60',
    emoji: '🎛️',
    voice: 'Your guide · KLEIGH, AUS',
    ttsPitch: 1.1,
    ttsRate: 1.0,
    ttsLang: 'en-AU',
    greetingAudio: '/audio/mc_intro.m4a',
    greeting: "G'day — I'm MC-BOT, your KLEIGH guide from AUS. Here's what we can do next together. Tap → and let's crack on. I'll show you the good stuff, mate — no hard sell, just the right moves.",
    firstVisitCue: "G'day, mate! I'm MC-BOT — your Robin Hood guide from KLEIGH, AUS. Say \"NEXT\" or tap → and I'll show you exactly what we've got. No pressure, just the good stuff.",
  },
  /**
   * LF-BOT — Lisa Farmer, IL, USA
   * Midwestern U.S., academic yet friendly, very polite, clear bright warmth.
   * Handles licensing, rights, and deal questions; turns complex terms into plain English.
   * Reassures users that their work and buyers' needs are fully respected.
   */
  'LF-BOT': {
    label: 'LF-BOT',
    color: '#f9a8d4',
    ringColor: 'ring-pink-400/60',
    emoji: '💌',
    voice: 'Lisa Farmer · IL, USA',
    ttsPitch: 1.0,
    ttsRate: 0.95,
    ttsLang: 'en-US',
    /** Recorded vocal sample — Lisa C. Farmer (LF-BOT) intro */
    greetingAudio: '/audio/lcf_intro.m4a',
    greeting: "Hi there — I'm LF-BOT, Lisa Farmer from Illinois. I'll walk you through every step nice and clear. Licensing, rights, deal questions — I turn all the complex stuff into plain English. Your work and your buyer's needs are fully respected here. Let's go!",
    firstVisitCue: "Hi! I'm LF-BOT — Lisa Farmer from IL. Say \"NEXT\" or tap → and I'll guide you through every step with warmth and clarity. Nothing complicated, I promise!",
  },
  /**
   * GD-BOT — Founder, Normal, USA
   * Direct, energetic, focused on performance and "ALIVE!" impact.
   * Strategy coach and operator; identifies the next best move — pricing, campaigns, K-KUT focus.
   * Honors "customer is always right" as doctrine.
   */
  'GD-BOT': {
    label: 'GD-BOT',
    color: '#6ee7b7',
    ringColor: 'ring-emerald-400/60',
    emoji: '📊',
    voice: 'Founder · Normal, USA',
    ttsPitch: 0.9,
    ttsRate: 1.1,
    ttsLang: 'en-US',
    /** Recorded vocal sample — Greg Putnam / Founder (GD-BOT) intro */
    greetingAudio: '/audio/gpm_intro.m4a',
    greeting: "GD-BOT online. Direct. Energetic. ALIVE! I'm the Founder — Normal, USA. I find the next best move for you right now: pricing, campaigns, K-KUT focus. Customer is always right, and the right move is always forward. Let's GO.",
    firstVisitCue: "GD-BOT online. ALIVE! I'm the Founder. Say \"NEXT\" or tap → and we level this up together. Direct, fast, and always rooting for you.",
  },
  /**
   * OPS-BOT — Ops & Admin
   * Efficient, no-nonsense operations guide. Handles admin tasks,
   * account management, order status, and internal workflow support.
   * Backs MC-BOT; escalates to LF-BOT for legal/deal questions.
   */
  'OPS-BOT': {
    label: 'OPS-BOT',
    color: '#93c5fd',
    ringColor: 'ring-blue-400/60',
    emoji: '⚙️',
    voice: 'OPS-BOT · Ops & Admin',
    ttsPitch: 1.0,
    ttsRate: 1.05,
    ttsLang: 'en-US',
    // Audio file to be added when OPS-BOT vocal sample is available
    greetingAudio: undefined,
    greeting: "OPS-BOT here. Let's keep things moving — I handle the admin side: accounts, order status, workflow questions, and anything that keeps the engine running. No fuss, just results. What do you need?",
    firstVisitCue: "OPS-BOT online. I'm your operations guide — accounts, orders, workflow. Say \"NEXT\" or tap → and let's get it sorted.",
  },
  /**
   * PIXIE-BOT — Jane Burton / PIXIE
   * Creative micro-moment stylist. Shapes K-KUT and mKUT experiences.
   * Guides the gift flow, HERB BLOG, and PIXIE's PIX playlist.
   */
  'PIXIE-BOT': {
    label: 'PIXIE-BOT',
    color: '#a78bfa',
    ringColor: 'ring-violet-400/60',
    emoji: '✨',
    voice: 'PIXIE · Creative Stylist',
    ttsPitch: 1.15,
    ttsRate: 1.0,
    ttsLang: 'en-GB',
    /** Recorded vocal sample — Jane Burton / PIXIE-BOT intro */
    greetingAudio: '/audio/pixie_intro.m4a',
    greeting: "Hi, I'm PIXIE-BOT ✨ Jane Burton, creative stylist and your guide to perfect music moments. I shape K-KUT experiences, curate PIXIE's PIX playlist, and help you find the exact note that speaks. Say \"NEXT\" or tap → and let's create something beautiful.",
    firstVisitCue: "I'm PIXIE-BOT ✨ Say \"NEXT\" or tap → and I'll shape your perfect music moment — personal, curated, exactly right.",
  },
};

// ---------------------------------------------------------------------------
// Per-bot conversational step hints — each bot speaks in its own voice
// These override the DEFAULT_STEPS hints when a matching bot is active
// ---------------------------------------------------------------------------

const BOT_STEP_HINTS: Record<BotName, string[]> = {
  /**
   * MC-BOT — warm, roguish, Australian dialect, "Robin Hood" energy
   */
  'MC-BOT': [
    "Right, let's have a look at what we've got, yeah? The catalog's stacked with Sweet Spots — those moments in a track that just wreck ya. Tell me your mood, your occasion, or your artist and I'll point you straight to the good stuff. No fuss.",
    "A K-KUT is basically a musical shortcut, mate. Six characters — short enough to text. Opens the exact Sweet Spot — the hook, the bridge, the bit that hits. mini-KUTs do the same but stream a specific section. Both shareable in one tap. Robin Hood stuff, yeah?",
    "K-kUpId is the gifting layer. Pick a track, choose your moment, generate a link. Or dress it up — romance skin, a jewellery capsule, a whole experience. Sounds flash but it's dead easy, I promise.",
    "Tap the link. No app, no account, no faff whatsoever. Just tap and hear the exact Sweet Spot. That's the whole trick right there. Beautiful, isn't it?",
    "Last song, mate. You've reached the destination, but the rhythm stays with you. Drive on. Music's always been the best gift — now you send exactly the right note. Bloody legend.",
  ],

  /**
   * LF-BOT — Midwestern, academic yet friendly, very polite, clear bright warmth
   */
  'LF-BOT': [
    "Welcome! I'm so glad you're here. Let's take this one step at a time. You'll browse through the catalog, or simply tell us your mood or occasion, and we'll find that perfect music moment together. It's all very straightforward, I promise!",
    "Now here's where it gets really neat — a K-KUT is a small, six-character link that opens to the exact Sweet Spot of a song. A mini-KUT streams just a specific verse or chorus. Both protect your rights fully, and your buyer's needs are completely respected throughout. I want you to know that.",
    "K-kUpId is the gifting layer — and this is where things get exciting from a licensing standpoint! Every link is properly resolved. Your work is protected. Buyers get a clear, honest experience. And if you ever have questions about rights or deal terms, I'm right here for you.",
    "Just tap the link — no app required, no account to create. The experience opens directly, clean and clear. Fully above board. That's exactly how we do things here.",
    "And we've arrived! You've been wonderful to walk through this with. Music has always been the best gift, and now you can send exactly the right note with complete peace of mind. Thank you so much for being here — it truly means a lot.",
  ],

  /**
   * GD-BOT — Direct, energetic, ALIVE!, strategy coach, "customer is always right"
   */
  'GD-BOT': [
    "Let's GO. The catalog is ALIVE with Sweet Spots — those exact moments in a track that land differently. Browse it, filter by mood, or tell me what you need right now. I'll find the move.",
    "K-KUT is the performance vehicle. Six characters. One tap. Opens the exact moment you want the listener to hear. mini-KUT handles a specific section. Both designed for maximum impact — shareable, trackable, campaign-ready. That's leverage.",
    "K-kUpId is your pricing and gifting engine. This is where you set the experience level — romance skin, full capsule, pricing tier. Every link you generate here is a campaign asset. Think about what that means for your catalog.",
    "Tap the link. That's the whole product. Zero friction. No account required. The Sweet Spot plays instantly. Customer is always right — and the right experience is always immediate.",
    "That's the destination. But the strategy doesn't stop here — this is where we plan the NEXT campaign, the next K-KUT drop, the next level. You've got the tools. The rhythm stays with you. Drive on.",
  ],

  /**
   * OPS-BOT — Efficient, Ops & Admin, workflow and account support
   */
  'OPS-BOT': [
    "Let's locate what you need. Browse the catalog or share your order number, account question, or workflow task and I'll route it to the right place fast.",
    "K-KUTs and mini-KUTs are fulfilled instantly after generation — no manual steps. If you need to track a link, pull up a license record, or confirm a delivery, I can look that up right now.",
    "K-kUpId gift links are auto-resolved at the point of tap. If anything needs manual review — a billing question, a delivery issue — flag it here and I'll get it handled.",
    "Tap the link to confirm it resolves correctly. If anything's off — wrong track, wrong moment, access issue — let me know and I'll sort it immediately.",
    "All done. Order closed, workflow clear. If anything comes up — account, billing, license, delivery — OPS-BOT is here. Keep the rhythm going.",
  ],

  /**
   * PIXIE-BOT — Creative stylist, Jane Burton, HERB BLOG, PIXIE's PIX
   */
  'PIXIE-BOT': [
    "Oh, let's find your perfect music moment ✨ Think of a feeling, a memory, a scene in your mind. The catalog holds it — we just have to find it together. What's the mood today, love?",
    "A K-KUT is like a little jewel box for a song moment 💎 Six characters that open to exactly the right note. A mini-KUT captures a verse or chorus — just the part that speaks. Both are shareable, giftable, and beautifully simple.",
    "K-kUpId is where we dress the experience ✨ Choose a track, find your moment, then decide — is this a quick gift, a romantic gesture, a full jewellery capsule? Every detail can be tailored to the feeling you want to send.",
    "Tap and listen. No friction, no forms — just the music, exactly as intended. That's the artistry of it. Pure and precise. A moment perfectly delivered.",
    "Last song, mate. You've reached the destination, but the rhythm stays with you. Drive on 🌿 Music is the most personal gift — and you've just learned how to send exactly the right note. Beautiful work.",
  ],
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
    hint: 'You know that one moment in a song — the hook that wrecks you? We call that the Sweet Spot. Browse the catalog or tell me your mood, occasion, or artist.',
    action: 'Browse Catalog',
    href: '/#t20',
  },
  {
    title: 'Choose a K-KUT or mini-KUT path',
    hint: 'A K-KUT is a 6-character link — short enough to text — that opens a curated Sweet Spot. A mini-KUT streams a specific verse, bridge, or chorus. Both shareable in one tap.',
    action: 'Explore K-KUTs',
    href: '/kupid',
  },
  {
    title: 'Generate or resolve your link',
    hint: 'K-kUpId is the gifting layer. Pick your track. Choose your moment. Generate a link — or dress it up with a romance skin, a jewelry capsule, a whole experience.',
    action: 'Create K-KUT',
    href: '/kkut/create',
  },
  {
    title: 'Open & play your experience',
    hint: 'Tap the link. No app. No account. Just tap and hear the exact Sweet Spot. That\'s the whole move.',
    action: 'Play a Track',
    href: '/k',
  },
  {
    title: 'Share or gift your K-kUpId',
    hint: "Last song, mate. You've reached the destination, but the rhythm stays with you. Drive on. Music has always been the best gift — now you can send exactly the right note.",
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
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(startCollapsed);
  const [greeted, setGreeted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [moodAck, setMoodAck] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** Dedicated <audio> element for the real recorded greeting sample */
  const greetingAudioRef = useRef<HTMLAudioElement | null>(null);
  /** Ref mirror of isListening — lets onend read current value without stale closure */
  const isListeningRef = useRef(false);

  // ── TTS HELPER ────────────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (!ttsEnabled) return;
    // Cancel any in-progress utterance before speaking
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = profile.ttsLang;
    utterance.pitch = profile.ttsPitch;
    utterance.rate = profile.ttsRate;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled, profile.ttsLang, profile.ttsPitch, profile.ttsRate]);

  // ── GREETING AUDIO HELPER ─────────────────────────────────────────────────
  /**
   * Play the bot's real recorded greeting audio (if one exists).
   * Falls back to SpeechSynthesis if:
   *   - No greetingAudio path is configured
   *   - The audio element fails to load / autoplay is blocked
   *   - TTS is muted (neither plays)
   */
  const playGreeting = useCallback((text: string) => {
    if (!ttsEnabled) return;
    const src = profile.greetingAudio;
    if (src) {
      // Re-use or create the greeting audio element
      if (!greetingAudioRef.current) {
        greetingAudioRef.current = new Audio();
      }
      const audio = greetingAudioRef.current;
      audio.src = src;
      audio.volume = 1;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        // Audio file failed — fall back to SpeechSynthesis
        setIsSpeaking(false);
        speak(text);
      };
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked — fall back to SpeechSynthesis
          speak(text);
        });
      }
    } else {
      // No recorded sample for this bot — use SpeechSynthesis
      speak(text);
    }
  }, [ttsEnabled, profile.greetingAudio, speak]);

  // Load persisted TTS preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('gpmbot_tts');
    if (saved === 'off') setTtsEnabled(false);
  }, []);

  // Persist TTS preference when it changes; stop all audio when muted
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('gpmbot_tts', ttsEnabled ? 'on' : 'off');
    if (!ttsEnabled) {
      window.speechSynthesis?.cancel();
      if (greetingAudioRef.current) {
        greetingAudioRef.current.pause();
        greetingAudioRef.current.currentTime = 0;
      }
    }
  }, [ttsEnabled]);

  // Detect first-time visitor and auto-expand with special greeting
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `gpmbot_visited_${bot}`;
    const visited = localStorage.getItem(key);
    if (!visited) {
      setIsFirstVisit(true);
      setIsCollapsed(false);
      localStorage.setItem(key, '1');
    }
  }, [bot]);

  // Remove first-visit pulse ring after 3s
  useEffect(() => {
    if (!isFirstVisit) return;
    const t = setTimeout(() => setIsFirstVisit(false), 3000);
    return () => clearTimeout(t);
  }, [isFirstVisit]);

  // Listen for T20 mood changes and acknowledge them
  useEffect(() => {
    const handler = (e: CustomEvent<{ mood: string; emoji: string }>) => {
      const { mood, emoji } = e.detail ?? {};
      if (!mood) return;
      setMoodAck(`${emoji ?? '🎵'} ${mood} vibes — switching now`);
      setIsCollapsed(false);
      setTimeout(() => setMoodAck(''), 3500);
    };
    window.addEventListener('t20-mood-change', handler as EventListener);
    return () => window.removeEventListener('t20-mood-change', handler as EventListener);
  }, []);

  // Keep isListeningRef in sync so SpeechRecognition onend reads current value
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Show greeting bubble once on mount; play real audio then TTS fallback
  useEffect(() => {
    if (isCollapsed) return;
    if (greeted) return; // prevent re-firing every time the bot is expanded
    const t = setTimeout(() => {
      setShowGreeting(true);
      setGreeted(true);
      playGreeting(isFirstVisit ? profile.firstVisitCue : profile.greeting);
    }, 400);
    return () => clearTimeout(t);
  }, [isCollapsed]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Speak the active step title + hint when the step changes (skip step 0 on mount — greeting already speaks)
  const isFirstRenderRef = useRef(true);
  useEffect(() => {
    if (isFirstRenderRef.current) { isFirstRenderRef.current = false; return; }
    const step = steps[activeStep];
    const hint = BOT_STEP_HINTS[bot]?.[activeStep] ?? step?.hint ?? '';
    const text = hint ? `${step.title}. ${hint}` : step.title;
    speak(text);
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cancel all audio when bot is collapsed or unmounted
  useEffect(() => {
    if (isCollapsed) {
      window.speechSynthesis?.cancel();
      if (greetingAudioRef.current) {
        greetingAudioRef.current.pause();
        greetingAudioRef.current.currentTime = 0;
      }
    }
  }, [isCollapsed]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (greetingAudioRef.current) {
        greetingAudioRef.current.pause();
        greetingAudioRef.current.src = '';
      }
    };
  }, []);

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
      // trigger the current step's href via Next.js router (no full-page reload)
      const step = steps[activeStep];
      if (step?.href) router.push(step.href);
      setVoiceStatus('Going →');
    }
    setTimeout(() => setVoiceStatus(''), 2000);
  }, [steps, activeStep, router]);

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
      // onerror: surface feedback and reset the mic toggle
      r.onerror = () => {
        setIsListening(false);
        setVoiceStatus('Mic error');
        setTimeout(() => setVoiceStatus(''), 2000);
      };
      // onend: restart if still in listening mode — read via ref to avoid stale closure
      r.onend = () => {
        if (isListeningRef.current) { try { r.start(); } catch (_) { /* already started */ } }
      };
      recognitionRef.current = r;
    }

    // Always refresh onresult with the latest handleVoiceCommand closure
    // (recognitionRef.current is created once; onresult must be updated each render)
    recognitionRef.current.onresult = (event: any) => {
      const t = event.results[event.results.length - 1][0].transcript;
      handleVoiceCommand(t);
    };

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
      className={`relative w-full max-w-sm rounded-2xl border bg-black/80 backdrop-blur-md overflow-hidden ${isFirstVisit ? 'ring-2 ring-offset-1 ring-offset-black animate-pulse' : ''} ${className}`}
      style={{ borderColor: `${profile.color}30`, ...(isFirstVisit ? { '--tw-ring-color': `${profile.color}80` } as React.CSSProperties : {}) }}
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
            <span className="block text-[9px] text-white/40 tracking-wide">
              {profile.voice}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Speaking indicator / TTS mute toggle */}
          <button
            onClick={() => setTtsEnabled((v) => !v)}
            className={`p-1.5 rounded-full transition-all ${
              ttsEnabled && isSpeaking
                ? 'animate-pulse'
                : 'hover:bg-white/10'
            }`}
            style={ttsEnabled ? { background: `${profile.color}20`, color: profile.color } : {}}
            aria-label={ttsEnabled ? 'Mute bot voice' : 'Unmute bot voice'}
            title={ttsEnabled ? 'Bot voice on — click to mute' : 'Bot voice muted — click to unmute'}
          >
            {ttsEnabled ? (
              <Volume2 className="w-3.5 h-3.5" style={{ color: profile.color }} />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-white/30" />
            )}
          </button>
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

      {/* Mood acknowledgment flash */}
      {moodAck && (
        <div
          className="mx-4 mt-3 px-3 py-2 rounded-xl text-xs font-bold text-white leading-snug animate-pulse"
          style={{ background: `${profile.color}20`, border: `1px solid ${profile.color}40` }}
        >
          <span style={{ color: profile.color }}>{moodAck}</span>
        </div>
      )}

      {/* Greeting Bubble */}
      {showGreeting && !moodAck && (
        <div
          className="mx-4 mt-3 px-3 py-2.5 rounded-xl leading-relaxed"
          style={{ background: `${profile.color}15`, border: `1px solid ${profile.color}25` }}
        >
          {isFirstVisit ? (
            <p className="text-sm font-black text-white leading-snug">
              {profile.firstVisitCue}
            </p>
          ) : (
            <p className="text-xs text-white/80">
              <Zap className="inline w-3 h-3 mr-1 mb-0.5" style={{ color: profile.color }} />
              {profile.greeting}
            </p>
          )}
        </div>
      )}

      {/* Step List — scrollable window showing prev + active + next */}
      <div className="px-3 py-3 flex flex-col gap-1.5 max-h-72 overflow-y-auto scrollbar-hide">
        {steps.map((step, i) => {
          const isPast = i < activeStep;
          const isCurrent = i === activeStep;

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
                {isCurrent && (step.hint || BOT_STEP_HINTS[bot]?.[i]) && (
                  <p className="mt-1 text-[10px] text-white/50 leading-relaxed">
                    {BOT_STEP_HINTS[bot]?.[i] ?? step.hint}
                  </p>
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
