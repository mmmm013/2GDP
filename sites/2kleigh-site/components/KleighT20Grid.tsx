'use client';

/**
 * KleighT20Grid — 2kleigh.com
 *
 * Fully self-contained. No imports from any other project.
 * ONLY KLEIGH PIX play here — activity-based, auto-advancing queue.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Activity definitions (inlined — independent of gputnammusic.com) ──────────
interface Activity {
  id: string;
  emoji: string;
  label: string;
  accent: string;
}

const T20_ACTIVITIES: Activity[] = [
  { id: 'driving',    emoji: '🚗',  label: 'Driving',         accent: '#D4A017' },
  { id: 'workout',    emoji: '💪',  label: 'Workout / Gym',   accent: '#C04000' },
  { id: 'morning',    emoji: '☀️',  label: 'Morning Routine', accent: '#E8B828' },
  { id: 'focus',      emoji: '💻',  label: 'Work / Focus',    accent: '#5C8A3C' },
  { id: 'road-trip',  emoji: '🛣️',  label: 'Road Trip',       accent: '#D4A017' },
  { id: 'running',    emoji: '🏃',  label: 'Running',         accent: '#C04000' },
  { id: 'cooking',    emoji: '🍳',  label: 'Cooking',         accent: '#C8A882' },
  { id: 'dinner',     emoji: '🍽️',  label: 'Dinner Time',     accent: '#8B6914' },
  { id: 'party',      emoji: '🥳',  label: 'Party',           accent: '#9B2FA0' },
  { id: 'romance',    emoji: '❤️',  label: 'Date Night',      accent: '#C0392B' },
  { id: 'yoga',       emoji: '🧘',  label: 'Yoga / Mindful',  accent: '#5C8A3C' },
  { id: 'chill',      emoji: '🛋️',  label: 'Chill / Relax',  accent: '#3A7BBF' },
  { id: 'wind-down',  emoji: '🌙',  label: 'Wind Down',       accent: '#2C3E68' },
  { id: 'study',      emoji: '📚',  label: 'Studying',        accent: '#8B6914' },
  { id: 'outdoor',    emoji: '🌲',  label: 'Outdoors',        accent: '#3A7A3A' },
  { id: 'beach',      emoji: '🏖️',  label: 'Beach / Summer',  accent: '#2A8FA0' },
  { id: 'gaming',     emoji: '🎮',  label: 'Gaming',          accent: '#7B2FA0' },
  { id: 'coffee',     emoji: '☕',  label: 'Coffee Shop',     accent: '#8B6914' },
  { id: 'background', emoji: '🎵',  label: 'Background',      accent: '#C8A882' },
  { id: 'commute',    emoji: '🚍',  label: 'Commute',         accent: '#D4A017' },
];

const MOOD_ORDER = T20_ACTIVITIES.map((a) => a.id);

// ── KLEIGH PIX manifest (static — no Supabase dependency) ────────────────────
interface KleighPix {
  title: string;
  vocalist: string;
  src: string;
  moods: string[];
  isInstro?: boolean;
}

const KLEIGH_PIX: KleighPix[] = [
  { title: 'Reflections',             vocalist: 'KLEIGH',       src: '/pix/kleigh--reflections.mp3',                                  moods: ['chill', 'wind-down', 'yoga'] },
  { title: 'Bought Into Your Game',   vocalist: 'KLEIGH',       src: '/pix/kleigh--bought-into-your-game-amin-87bpm-edit-master.mp3', moods: ['driving', 'road-trip', 'commute'] },
  { title: 'Breathing Serenity',      vocalist: 'KLEIGH',       src: '/pix/kleigh--breathing-serenity.mp3',                           moods: ['yoga', 'chill', 'morning'] },
  { title: 'Down (Stripped)',         vocalist: 'KLEIGH',       src: '/pix/kleigh--down-(stripped)-with-reverb--69bpm-fmaj.mp3',      moods: ['wind-down', 'romance', 'study'] },
  { title: 'Down (Prod)',             vocalist: 'KLEIGH',       src: '/pix/kleigh--down-(prod)--69bpm-fmaj.mp3',                      moods: ['romance', 'dinner'] },
  { title: 'A Calm Evening',          vocalist: 'KLEIGH',       src: '/pix/kleigh--a-calm-evening.mp3',                               moods: ['dinner', 'chill', 'background'] },
  { title: 'Waterfall',               vocalist: 'KLEIGH',       src: '/pix/kleigh--waterfall.mp3',                                    moods: ['outdoor', 'morning', 'yoga'] },
  { title: 'Nightfall',               vocalist: 'KLEIGH',       src: '/pix/kleigh--nightfall.mp3',                                    moods: ['wind-down', 'chill', 'background'] },
  { title: 'Tall Forest',             vocalist: 'KLEIGH',       src: '/pix/kleigh--tall-forest.mp3',                                  moods: ['outdoor', 'road-trip', 'focus'] },
  { title: 'Solace',                  vocalist: 'KLEIGH',       src: '/pix/kleigh--solace.mp3',                                       moods: ['yoga', 'study', 'background'] },
  { title: 'Optimistic Expectations', vocalist: 'KLEIGH',       src: '/pix/kleigh--optimistic-expectations.mp3',                      moods: ['morning', 'workout', 'running'] },
  { title: 'Is It Us? (Prod)',        vocalist: 'KLEIGH',       src: '/pix/kleigh--is-it-us-prod-amin-84bpm-master.mp3',              moods: ['romance', 'party', 'driving'] },
  { title: 'Rhythm Play',             vocalist: 'Michael Clay', src: '/pix/rhythm-play.mp3',                                          moods: ['party', 'gaming', 'workout'],   isInstro: true },
  { title: 'I Am a Fighter (Instro)', vocalist: 'Michael Clay', src: '/pix/i-am-a-fighter--el-mix-instro.mp3',                        moods: ['workout', 'running', 'driving'], isInstro: true },
  { title: 'I Live Free (Instro)',    vocalist: 'Michael Clay', src: '/pix/i-live-free--instro.mp3',                                  moods: ['morning', 'outdoor', 'road-trip'], isInstro: true },
  { title: 'Score 3: The End',        vocalist: 'Michael Clay', src: '/pix/score-3--the-end.mp3',                                     moods: ['background', 'study', 'coffee'],  isInstro: true },
];

function buildQueue(moodId: string): KleighPix[] {
  const vocals = KLEIGH_PIX.filter((t) => !t.isInstro && t.moods.includes(moodId));
  const instros = KLEIGH_PIX.filter((t) => t.isInstro && t.moods.includes(moodId));
  if (instros.length > 0 && vocals.length > 0) {
    const splice = Math.floor(vocals.length / 2);
    vocals.splice(splice, 0, instros[Math.floor(Math.random() * instros.length)]);
  }
  return vocals;
}

// ── Activity tile ─────────────────────────────────────────────────────────────
function ActivityTile({
  activity, isActive, isExhausted, onClick,
}: {
  activity: Activity; isActive: boolean; isExhausted: boolean; onClick: (a: Activity) => void;
}) {
  return (
    <button
      onClick={() => onClick(activity)}
      className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-200 min-h-[80px] md:min-h-[96px] px-2 py-3 w-full active:scale-95
        ${isActive ? 'bg-[#1a0f22] border-[#C8A882] shadow-[0_0_12px_rgba(200,168,130,0.35)]'
          : isExhausted ? 'bg-[#0a0a0a] border-[#2C1F10]/30 opacity-50'
          : 'bg-[#1a1207] border-[#5C3A1E]/40 hover:border-[#C8A882]/60 hover:bg-[#221508]'}`}
      aria-label={`Stream ${activity.label}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl transition-opacity duration-200"
        style={{ background: activity.accent, opacity: isActive ? 1 : isExhausted ? 0.1 : 0.35 }} />
      <span className="text-xl md:text-2xl leading-none">{activity.emoji}</span>
      <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider leading-tight text-center transition-colors
        ${isActive ? 'text-[#C8A882]' : isExhausted ? 'text-[#C8A882]/25' : 'text-[#C8A882]/70 group-hover:text-[#C8A882]'}`}>
        {activity.label}
      </span>
      {isActive && (
        <span className="absolute bottom-1.5 inline-flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-[3px] rounded-full bg-[#C8A882] animate-pulse"
              style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      )}
      {isExhausted && !isActive && (
        <span className="absolute bottom-1 text-[8px] text-[#C8A882]/30 uppercase tracking-widest font-bold">done</span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function KleighT20Grid() {
  const [activeMoodId, setActiveMoodId]     = useState<string | null>(null);
  const [exhaustedMoods, setExhaustedMoods] = useState<Set<string>>(new Set());
  const [nowPlaying, setNowPlaying]         = useState<KleighPix | null>(null);
  const queueRef = useRef<{ items: KleighPix[]; pos: number }>({ items: [], pos: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mobile carousel
  const MOBILE_GROUP_SIZE = 3;
  const mobileGroups: Activity[][] = [];
  for (let i = 0; i < T20_ACTIVITIES.length; i += MOBILE_GROUP_SIZE) {
    mobileGroups.push(T20_ACTIVITIES.slice(i, i + MOBILE_GROUP_SIZE));
  }
  const [groupIndex, setGroupIndex] = useState(0);
  const mobileTiles = mobileGroups[groupIndex] ?? [];

  useEffect(() => {
    const iv = setInterval(() => setGroupIndex((p) => (p + 1) % mobileGroups.length), 60_000);
    return () => clearInterval(iv);
  }, [mobileGroups.length]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    return () => { audio.pause(); };
  }, []);

  const findNextMood = useCallback((currentId: string | null): string | null => {
    const startIdx = currentId ? MOOD_ORDER.indexOf(currentId) : -1;
    for (let i = 1; i <= MOOD_ORDER.length; i++) {
      const candidate = MOOD_ORDER[(startIdx + i) % MOOD_ORDER.length];
      if (!exhaustedMoods.has(candidate) && buildQueue(candidate).length > 0) return candidate;
    }
    return null;
  }, [exhaustedMoods]);

  const playTrack = useCallback((track: KleighPix) => {
    const audio = audioRef.current;
    if (!audio) return;
    setNowPlaying(track);
    audio.src = track.src;
    audio.play().catch(() => {});
  }, []);

  const advanceRef = useRef<() => void>(() => {});

  const advanceQueue = useCallback(() => {
    queueRef.current.pos += 1;
    if (queueRef.current.pos < queueRef.current.items.length) {
      playTrack(queueRef.current.items[queueRef.current.pos]);
    } else {
      const exhaustedMood = activeMoodId;
      if (exhaustedMood) setExhaustedMoods((prev) => new Set(prev).add(exhaustedMood));
      const next = findNextMood(exhaustedMood);
      if (next) startMood(next, true);
      else { setNowPlaying(null); setActiveMoodId(null); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMoodId, playTrack, findNextMood]);

  useEffect(() => { advanceRef.current = advanceQueue; }, [advanceQueue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handler = () => advanceRef.current();
    audio.addEventListener('ended', handler);
    return () => audio.removeEventListener('ended', handler);
  }, []);

  function startMood(moodId: string, auto = false) {
    const queue = buildQueue(moodId);
    if (queue.length === 0) {
      const next = findNextMood(moodId);
      if (next) startMood(next, auto);
      return;
    }
    queueRef.current = { items: queue, pos: 0 };
    setActiveMoodId(moodId);
    if (!auto) setExhaustedMoods(new Set());
    playTrack(queue[0]);
  }

  return (
    <section className="w-full bg-[#0d0a06] border-t border-[#C8A882]/15 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A882]/40 mb-0.5">KLEIGH · The Vault</p>
            <h2 className="text-sm md:text-base font-bold text-[#C8A882] tracking-wide">Top 20 Streaming Activities</h2>
            <p className="text-[10px] text-[#C8A882]/40 mt-0.5">KLEIGH PIX only · Moods cycle automatically</p>
          </div>
          <div className="md:hidden flex items-center gap-1">
            {mobileGroups.map((_, i) => (
              <button key={i} onClick={() => setGroupIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === groupIndex ? 'bg-[#C8A882] w-3' : 'bg-[#5C3A1E]/60 w-1.5'}`}
                aria-label={`Group ${i + 1}`} />
            ))}
          </div>
        </div>

        {nowPlaying && (
          <div className="mb-4 flex items-center gap-3 bg-[#1a1207] border border-[#C8A882]/20 rounded-xl px-4 py-2.5">
            <span className="inline-flex gap-[3px] flex-shrink-0">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-[3px] rounded-full bg-[#C8A882] animate-pulse"
                  style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#C8A882] truncate">{nowPlaying.title}</p>
              <p className="text-[10px] text-[#C8A882]/50 truncate">
                {nowPlaying.vocalist}
                {nowPlaying.isInstro && <span className="ml-2 text-[#D4A017]/60 font-bold uppercase tracking-wider">· INSTRO</span>}
              </p>
            </div>
            <button onClick={() => { audioRef.current?.pause(); setNowPlaying(null); }}
              className="flex-shrink-0 text-[10px] text-[#C8A882]/50 hover:text-[#C8A882] uppercase tracking-widest font-bold transition-colors">
              Stop
            </button>
          </div>
        )}

        {/* Desktop: all 20 */}
        <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-10 gap-2">
          {T20_ACTIVITIES.map((a) => (
            <ActivityTile key={a.id} activity={a}
              isActive={activeMoodId === a.id}
              isExhausted={exhaustedMoods.has(a.id)}
              onClick={(act) => startMood(act.id)} />
          ))}
        </div>

        {/* Mobile: 3-tile carousel */}
        <div className="md:hidden grid grid-cols-3 gap-2">
          {mobileTiles.map((a) => (
            <ActivityTile key={a.id} activity={a}
              isActive={activeMoodId === a.id}
              isExhausted={exhaustedMoods.has(a.id)}
              onClick={(act) => startMood(act.id)} />
          ))}
        </div>

        <p className="md:hidden text-center text-[9px] text-[#C8A882]/25 mt-3 tracking-wide">
          Tap any mood · KLEIGH only · Cycles automatically
        </p>
      </div>
    </section>
  );
}
