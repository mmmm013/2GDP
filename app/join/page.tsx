'use client';
import { useState, useEffect } from 'react';
import { Heart, TreePine, Mountain, Crown, Check, Users, ShieldCheck, Compass, Zap, Gift } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PromoBar from '@/components/PromoBar';

// FOUNDER SPECIAL: first N slots, updates from localStorage to simulate real scarcity
const FOUNDER_TOTAL = 50;

function useFounderCount() {
  const [claimed, setClaimed] = useState(23); // seed realistic mid-progress
  useEffect(() => {
    const stored = localStorage.getItem('gpmc_founder_claimed');
    if (stored) setClaimed(Math.min(parseInt(stored, 10), FOUNDER_TOTAL));
  }, []);
  return claimed;
}

// Random "flash" specials — one rotates on page load
const FLASH_SPECIALS = [
  { emoji: '🎷', title: 'MSJ Jazz Pack', desc: 'Support Michael Scherer + unlock 3 exclusive jazz stems. One-time $4.99.', href: '/gift', cta: 'GRAB IT' },
  { emoji: '🎸', title: 'KLEIGH Fan Drop', desc: 'Name your price for a KLEIGH lyric sheet + album art download. Min $1.', href: '/gift', cta: 'FAN DROP' },
  { emoji: '⭐', title: 'Hero Sponsor', desc: 'Your name on a Hero Story of your choice. $10 one-time. Limited slots.', href: '/heroes', cta: 'SPONSOR' },
  { emoji: '🎁', title: 'Surprise Pack', desc: 'Random artist merch + track unlock. $2.99. Different every week.', href: '/gift', cta: 'SURPRISE ME' },
];

export default function JoinPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const founderClaimed = useFounderCount();
  const remaining = FOUNDER_TOTAL - founderClaimed;
  const [flash] = useState(() => FLASH_SPECIALS[Math.floor(Math.random() * FLASH_SPECIALS.length)]);

  const handleJoin = async (tier: string) => {
    setLoading(tier);
    setError('');
    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      <PromoBar />
      <Header />

      {/* FOUNDER SPECIAL BANNER */}
      <div className="w-full bg-[#3E2723] text-[#FFD54F] py-4 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-70">⚡ Limited Time — Founder Special</p>
          <p className="text-lg font-black leading-tight">
            First {FOUNDER_TOTAL} <span className="text-white">Sponsors</span> get <span className="text-white">ELDER status at the JOEY price</span> — forever.
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="h-2 bg-[#FFD54F]/20 rounded-full flex-1 max-w-xs overflow-hidden">
              <div
                className="h-full bg-[#FFD54F] rounded-full transition-all"
                style={{ width: `${(founderClaimed / FOUNDER_TOTAL) * 100}%` }}
              />
            </div>
            <span className="text-sm font-black text-white">{remaining} left</span>
          </div>
        </div>
      </div>

      {/* FLASH SPECIAL */}
      <div className="w-full bg-black/10 border-b border-[#3E2723]/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{flash.emoji}</span>
            <div>
              <p className="font-black text-sm leading-tight">{flash.title} <span className="font-normal opacity-70 text-xs">— {flash.desc}</span></p>
            </div>
          </div>
          <Link
            href={flash.href}
            className="shrink-0 bg-[#3E2723] text-[#FFD54F] px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider hover:bg-black transition-colors"
          >
            {flash.cta}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 text-center max-w-3xl">
        <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-6 shadow-xl">
          <Users size={48} className="text-[#FFD54F]" strokeWidth={2} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[#3E2723] mb-3 tracking-tight drop-shadow-sm leading-none">
          Join the<br />Pride.
        </h1>
        <p className="text-lg font-bold text-[#3E2723] opacity-80 mb-2 uppercase tracking-widest">
          Partner with us to keep the music flowing.
        </p>
        <p className="text-sm font-semibold text-[#3E2723]/60 mb-8 max-w-md mx-auto">
          We want volume. We value every single Sponsor. Pick your level — all tiers get real access, real benefits.
        </p>
      </div>

      {error && (
        <div className="container mx-auto px-4 max-w-5xl mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-bold">{error}</div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(62,39,35,1)]">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2"><Compass size={24} /> The Course</h2>
            <div className="space-y-4 text-base font-bold text-[#3E2723]/80 leading-relaxed">
              <p>Sponsors are the engine of G Putnam Music. You aren&apos;t just a fan — you are a partner.</p>
              <p>Your contribution keeps the <strong>Singalongs</strong> free for pediatric wards and the <strong>Kleigh</strong> stream running for fans worldwide.</p>
              <p><span className="text-[#E65100]">100% of proceeds</span> fuel artist support &amp; platform development.</p>
              <p className="text-xs opacity-50 italic">We watch process. Money cares for itself when the process is right.</p>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-[#3E2723]/10 space-y-3">
              <h3 className="font-black text-sm uppercase">Every Sponsor Gets:</h3>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Access to URU Story Engine</div>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Unlimited Plays (No Limits)</div>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Verified &quot;Sponsor&quot; Rank</div>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Monthly Flash Special Offers</div>
            </div>

            {/* ONE-TIME GIFT SHORTCUT */}
            <div className="mt-6 pt-6 border-t-2 border-[#3E2723]/10">
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Not ready to subscribe?</p>
              <Link href="/gift" className="block w-full text-center bg-[#E65100] text-white py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#BF360C] transition-colors shadow-md">
                ❤️ One-Time Heart-Tap Gift
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {/* JOEY */}
            <div className="bg-[#3E2723] text-[#FFD54F] p-6 rounded-2xl border-2 border-[#3E2723] shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
              <div className="flex items-center gap-4">
                <div className="bg-[#FFD54F] text-[#3E2723] p-3 rounded-full"><Heart size={24} /></div>
                <div>
                  <div className="font-black text-xl">JOEY</div>
                  <div className="text-xs opacity-70 font-bold uppercase">The Young One</div>
                  {remaining > 0 && <div className="text-[10px] text-white bg-red-600 px-2 py-0.5 rounded-full mt-1 inline-block font-black">FOUNDER: Gets ELDER perks</div>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-2xl">$5</div>
                <button onClick={() => handleJoin('joey')} disabled={loading === 'joey'} className="text-[10px] underline hover:text-white cursor-pointer disabled:opacity-50">{loading === 'joey' ? 'LOADING...' : 'JOIN'}</button>
              </div>
            </div>

            {/* CLIMBER */}
            <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
              <div className="flex items-center gap-4">
                <div className="bg-[#E65100] text-white p-3 rounded-full"><TreePine size={24} /></div>
                <div>
                  <div className="font-black text-xl text-[#3E2723]">CLIMBER</div>
                  <div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">On the Rise</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-2xl text-[#3E2723]">$10</div>
                <button onClick={() => handleJoin('climber')} disabled={loading === 'climber'} className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#E65100] cursor-pointer disabled:opacity-50">{loading === 'climber' ? 'LOADING...' : 'JOIN'}</button>
              </div>
            </div>

            {/* ALPHA */}
            <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
              <div className="flex items-center gap-4">
                <div className="bg-[#2E7D32] text-white p-3 rounded-full"><Mountain size={24} /></div>
                <div>
                  <div className="font-black text-xl text-[#3E2723]">ALPHA</div>
                  <div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">The Leader</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-2xl text-[#3E2723]">$15</div>
                <button onClick={() => handleJoin('alpha')} disabled={loading === 'alpha'} className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#2E7D32] cursor-pointer disabled:opacity-50">{loading === 'alpha' ? 'LOADING...' : 'JOIN'}</button>
              </div>
            </div>

            {/* ELDER */}
            <div className="bg-gradient-to-r from-[#FFD54F] to-[#FFB300] border-2 border-[#3E2723] p-6 rounded-2xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
              <div className="flex items-center gap-4">
                <div className="bg-[#3E2723] text-[#FFD54F] p-3 rounded-full"><Crown size={24} /></div>
                <div>
                  <div className="font-black text-xl text-[#3E2723]">ELDER</div>
                  <div className="text-xs text-[#3E2723] font-bold uppercase">The Patriarch</div>
                  <div className="text-[10px] text-[#3E2723] opacity-60 font-bold">Max access. Max love.</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-2xl text-[#3E2723]">$20</div>
                <button onClick={() => handleJoin('elder')} disabled={loading === 'elder'} className="text-[10px] text-[#3E2723] font-bold underline hover:text-white cursor-pointer disabled:opacity-50">{loading === 'elder' ? 'LOADING...' : 'JOIN'}</button>
              </div>
            </div>

            {/* URGENCY NOTE */}
            <p className="text-[11px] font-bold text-[#3E2723]/60 text-center pt-2">
              Every subscription directly funds artist development &amp; keeps the stream alive. Thank you.
            </p>
          </div>
        </div>
      </div>

      {/* MSJ SPOTLIGHT */}
      <div className="w-full bg-[#3E2723] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400 mb-2">KEZ — Keys for a Keyboard</p>
          <h2 className="text-3xl font-black mb-2">Michael Scherer Jazz 🎹</h2>
          <p className="text-base opacity-80 leading-relaxed mb-2 max-w-xl mx-auto">
            40+ TV placements. A career built on craft and discipline. Michael is fighting through serious
            personal challenges right now. Your support — even $2 — goes directly to keeping his music alive.
          </p>
          <p className="text-sm text-amber-300/80 font-bold mb-6 max-w-md mx-auto">
            KEZs are Michael&apos;s keyboard-keys crew. Press a key. Keep him playing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gift"
              className="bg-amber-500 text-black px-8 py-3 rounded-full font-black uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg"
            >
              🎹 Become a KEZ
            </Link>
            <Link
              href="/scherer"
              className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-black uppercase tracking-wider hover:bg-white/20 transition-colors"
            >
              Stream MSJ Now →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
