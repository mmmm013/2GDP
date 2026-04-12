'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Timer, Users } from 'lucide-react';

/**
 * WEEKLY RACE - BIC BOT Arena
 * DEPENDABILITY: Proper interval cleanup, no leaked timers
 * QUALITY: Smooth 200ms animation (not 100ms jank), stable layout
 * SATISFACTION: Fun race experience with replay capability
 */

const HONEY_BROWN = '#AB7E4C';

interface Racer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  frequency: 'always' | 'sometimes' | 'rare';
  speed: number;
}

const RACERS: Racer[] = [
  { id: 'gpn', name: 'GPN', icon: '💀', color: '#8B0000', description: 'Black/Brown/White Stallion', frequency: 'always', speed: 1.0 },
  { id: 'lum', name: 'LUM', icon: '🐎', color: '#000000', description: 'Piano BOT', frequency: 'always', speed: 0.95 },
  { id: 'nurt', name: 'NURT', icon: '🐢', color: '#228B22', description: 'Touchy, Country, Plant-based', frequency: 'sometimes', speed: 1.05 },
  { id: 'bro', name: 'BRC', icon: '🦆', color: '#4169E1', description: 'Macho, Hash Guy', frequency: 'sometimes', speed: 0.98 },
  { id: 'lily', name: 'LILY', icon: '🦙', color: '#DC143C', description: 'School Teacher', frequency: 'rare', speed: 0.9 },
];

const RACE_DAY = 6;
const RACE_HOUR = 19;
const REPLAY_INTERVAL = 30 * 60 * 1000;

interface RaceState {
  isLive: boolean;
  isReplay: boolean;
  positions: { [key: string]: number };
  winner: string | null;
  raceNbr: string;
  participants: Racer[];
}

export default function WeeklyRace() {
  const [raceState, setRaceState] = useState<RaceState>({
    isLive: false,
    isReplay: false,
    positions: {},
    winner: null,
    raceNbr: '',
    participants: [],
  });
  const [showReplayLink, setShowReplayLink] = useState(false);
  // DEPENDABILITY: Track race interval for cleanup
  const raceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectParticipants = useCallback(() => {
    const always = RACERS.filter(r => r.frequency === 'always');
    const sometimes = RACERS.filter(r => r.frequency === 'sometimes');
    const rare = RACERS.filter(r => r.frequency === 'rare');
    const selected = [...always];
    sometimes.forEach(racer => {
      if (Math.random() < 0.7) selected.push(racer);
    });
    rare.forEach(racer => {
      if (Math.random() < 0.3) selected.push(racer);
    });
    return selected;
  }, []);

  const runRace = useCallback((participants: Racer[], isReplay = false) => {
    // DEPENDABILITY: Clear any existing race interval
    if (raceIntervalRef.current) {
      clearInterval(raceIntervalRef.current);
    }

    const startPos: { [key: string]: number } = {};
    participants.forEach(r => startPos[r.id] = 0);

    setRaceState({
      isLive: !isReplay,
      isReplay,
      positions: startPos,
      winner: null,
      raceNbr: '',
      participants,
    });

    // QUALITY: 200ms interval (smoother than 100ms on mobile Safari)
    raceIntervalRef.current = setInterval(() => {
      setRaceState(prev => {
        const newPositions = { ...prev.positions };
        let raceWinner: string | null = null;

        prev.participants.forEach(racer => {
          const increment = (Math.random() * 8 + 3) * racer.speed;
          newPositions[racer.id] = Math.min(100, (newPositions[racer.id] || 0) + increment);
          if (newPositions[racer.id] >= 100 && !raceWinner) {
            raceWinner = racer.id;
          }
        });

        if (raceWinner) {
          if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
          setTimeout(() => {
            setRaceState(prev2 => ({
              ...prev2,
              winner: raceWinner,
              isLive: false,
              isReplay: false,
            }));
            setShowReplayLink(true);
          }, 500);
        }

        return { ...prev, positions: newPositions };
      });
    }, 200);
  }, []);

  // DEPENDABILITY: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (raceIntervalRef.current) {
        clearInterval(raceIntervalRef.current);
      }
    };
  }, []);

  // Check race schedule
  useEffect(() => {
    const checkRaceTime = () => {
      const now = new Date();
      if (now.getDay() === RACE_DAY && now.getHours() === RACE_HOUR) {
        if (!raceState.isLive && !raceState.isReplay) {
          runRace(selectParticipants());
        }
      }
    };
    checkRaceTime();
    const interval = setInterval(checkRaceTime, 60000);
    return () => clearInterval(interval);
  }, [raceState.isLive, raceState.isReplay, selectParticipants, runRace]);

  const triggerReplay = () => {
    if (!raceState.isLive && !raceState.isReplay) {
      runRace(selectParticipants(), true);
    }
  };

  const getWinnerName = () => {
    if (!raceState.winner) return '';
    return raceState.participants.find(r => r.id === raceState.winner)?.name || '';
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#D0A917] tracking-widest uppercase">
          🏆 Weekly Race
        </h2>
        <div className="flex items-center gap-2">
          {raceState.isLive && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full animate-pulse">LIVE</span>
          )}
          {raceState.isReplay && (
            <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs rounded-full">REPLAY</span>
          )}
          {showReplayLink && !raceState.isLive && !raceState.isReplay && (
            <button
              onClick={triggerReplay}
              className="text-xs text-[#C8A882] hover:text-[#D0A917] transition-colors underline"
            >
              Watch Replay
            </button>
          )}
        </div>
      </div>

      {/* Race Track */}
      {(raceState.isLive || raceState.isReplay) && (
        <div className="space-y-2 mb-4">
          {raceState.participants.map((racer) => (
            <div key={racer.id} className="flex items-center gap-2">
              <span className="text-sm w-16 truncate" style={{ color: racer.color }}>
                {racer.icon} {racer.name}
              </span>
              <div className="flex-1 bg-[#1a1206] rounded-full h-6 relative overflow-hidden border border-[#C8A882]/20">
                <div
                  className="h-full rounded-full transition-all duration-200 ease-linear"
                  style={{
                    width: `${raceState.positions[racer.id] || 0}%`,
                    backgroundColor: racer.color,
                    opacity: 0.8,
                  }}
                />
              </div>
              <span className="text-xs text-[#C8A882]/60 w-8">
                {racer.description}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Winner Announcement */}
      {raceState.winner && (
        <div className="text-center py-4">
          <p className="text-2xl font-bold text-[#D0A917] animate-bounce">
            🎉 {getWinnerName()} WINS! 🎉
          </p>
        </div>
      )}

      {/* Schedule & Competition Info */}
      {!raceState.isLive && !raceState.isReplay && !raceState.winner && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-[#C8A882]/60">
            <span className="flex items-center gap-1">
              <Timer size={14} />
              Next race: Saturday 7 PM CST
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              Replays every 30 minutes
            </span>
          </div>

          {/* BOT Arena Competition */}
          <div className="bg-[#1a1206] border border-[#C8A882]/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#D0A917] mb-2">
              🤖 Pick Your Champion BOT!
            </h3>
            <p className="text-xs text-[#C8A882]/60 mb-3">
              All members, all levels can pick competing BOTs for the arena race each week
            </p>
            <p className="text-xs text-[#D0A917]/80">
              Pick the winner correctly and your ID goes into our quarterly gift raffles!
            </p>
            <p className="text-[10px] text-[#C8A882]/40 mt-2">
              Quarterly drawings • Exclusive prizes • History in the making
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
