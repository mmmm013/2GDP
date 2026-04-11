'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, TreePine, Mountain, Crown, Check, Users, 
  ShieldCheck, Compass, Zap, Gift, Music, Star, Trophy
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PromoBar from '@/components/PromoBar';

// FOUNDER SPECIAL: first N slots
const FOUNDER_TOTAL = 50;

function useFounderCount() {
  const [claimed, setClaimed] = useState(23);
  useEffect(() => {
    const stored = localStorage.getItem('gpmc_founder_claimed');
    if (stored) setClaimed(Math.min(parseInt(stored, 10), FOUNDER_TOTAL));
  }, []);
  return claimed;
}

const FLASH_SPECIALS = [
  { 
    emoji: '🎷', 
    title: 'MSJ Jazz Pack', 
    desc: 'Support Michael Scherer + unlock 3 exclusive jazz stems. One-time $4.99.', 
    href: '/gift', 
    cta: 'GRAB IT' 
  },
  { 
    emoji: '🎸', 
    title: 'KLEIGH Fan Drop', 
    desc: 'Name your price for a KLEIGH lyric sheet + album art download. Min $1.', 
    href: '/gift', 
    cta: 'FAN DROP' 
  },
  { 
    emoji: '⭐', 
    title: 'Hero Sponsor', 
    desc: 'Your name on a Hero Story of your choice. $10 one-time. Limited slots.', 
    href: '/heroes', 
    cta: 'SPONSOR' 
  },
  { 
    emoji: '🎁', 
    title: 'Surprise Pack', 
    desc: 'Random artist merch + track unlock. $2.99. Different every week.', 
    href: '/gift', 
    cta: 'SURPRISE ME' 
  },
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
    <main className="min-h-screen w-full bg-[#1A1A1A] text-white selection:bg-[#FFD54F] selection:text-black">
      <PromoBar />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none uppercase">
            Join the <br />
            <span className="text-[#FFD54F]">Pride.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl mx-auto">
            Partner with us to keep the music flowing. We value every Sponsor.
          </p>
        </div>
      </section>

      {/* Founder Alert */}
      {remaining > 0 && (
        <section className="bg-[#FFD54F] text-black py-4">
          <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="fill-black" />
              <span className="font-bold uppercase tracking-widest text-sm">Founder Special</span>
            </div>
            <p className="font-bold text-center md:text-left">
              First {FOUNDER_TOTAL} Sponsors get <span className="underline italic">ELDER status</span> at the <span className="underline italic">JOEY price</span> — forever.
            </p>
            <div className="bg-black text-white px-4 py-1 rounded-full font-black text-sm">
              {remaining} SLOTS LEFT
            </div>
          </div>
        </section>
      )}

      {/* Flash Special */}
      <section className="border-y border-white/10 py-8 bg-white/5">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{flash.emoji}</span>
            <div>
              <h3 className="font-black uppercase text-sm tracking-wider text-[#FFD54F]">{flash.title}</h3>
              <p className="text-sm opacity-60 font-medium">{flash.desc}</p>
            </div>
          </div>
          <Link 
            href={flash.href}
            className="whitespace-nowrap bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-[#FFD54F] transition-colors"
          >
            {flash.cta}
          </Link>
        </div>
      </section>

<<<<<<< HEAD
      <div className="container mx-auto px-4 mt-10 text-center max-w-3xl">
        <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-6 shadow-xl">
          <Users size={48} className="text-[#FFD54F]" strokeWidth={2} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[#3E2723] mb-3 tracking-tight drop-shadow-sm leading-none">
          Join the<br/>Pride.
        </h1>
        <p className="text-lg font-bold text-[#3E2723] opacity-80 mb-2 uppercase tracking-widest">
          Partner with us to keep the music flowing.
        </p>
        <p className="text-sm font-semibold text-[#3E2723]/60 mb-8 max-w-md mx-auto">
          We want volume. We value every single K-KUT. Pick your level — all tiers get real access, real benefits.
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
              <p>K-KUTs are the engine of G Putnam Music. You aren&apos;t just a fan — you are a partner.</p>
              <p>Your contribution keeps the <strong>Singalongs</strong> free for pediatric wards and the <strong>Kleigh</strong> stream running for fans worldwide.</p>
              <p><span className="text-[#E65100]">100% of proceeds</span> fuel artist support &amp; platform development.</p>
              <p className="text-xs opacity-50 italic">We watch process. Money cares for itself when the process is right.</p>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-[#3E2723]/10 space-y-3">
              <h3 className="font-black text-sm uppercase">Every K-KUT Gets:</h3>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Access to URU Story Engine</div>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Unlimited Plays (No Limits)</div>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Verified &quot;Sponsor&quot; Rank</div>
              <div className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-[#E65100]" /> Monthly Flash Special Offers</div>
            </div>

            {/* ONE-TIME GIFT SHORTCUT */}
            <div className="mt-6 pt-6 border-t-2 border-[#3E2723]/10">
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Not ready to subscribe?</p>
              <Link href="/gift" className="block w-full text-center bg-[#E65100] text-white py-3 rounded-xl font-black uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg">
                ❤️ One-Time Heart-Tap Gift
              </Link>
            </div>
          </div>

          <div className="space-y-4">
=======
      {/* Tiers Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
>>>>>>> origin/copilot/fix-audio-playback-issues
            {/* JOEY */}
            <TierCard 
              name="JOEY"
              desc="The Young One"
              price={5}
              loading={loading === 'joey'}
              onJoin={() => handleJoin('joey')}
              isFounder={remaining > 0}
            />

            {/* CLIMBER */}
            <TierCard 
              name="CLIMBER"
              desc="On the Rise"
              price={10}
              loading={loading === 'climber'}
              onJoin={() => handleJoin('climber')}
              highlight
            />

            {/* ALPHA */}
            <TierCard 
              name="ALPHA"
              desc="The Leader"
              price={15}
              loading={loading === 'alpha'}
              onJoin={() => handleJoin('alpha')}
            />

            {/* ELDER */}
            <TierCard 
              name="ELDER"
              desc="The Patriarch"
              price={20}
              loading={loading === 'elder'}
              onJoin={() => handleJoin('elder')}
              perks={["Max access", "Max love"]}
            />

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black uppercase mb-12">The Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div>
              <p className="text-xl font-bold mb-4 italic">"Money cares for itself when the process is right."</p>
              <p className="opacity-70 font-medium leading-relaxed">
                Your contribution keeps the Singalongs free for pediatric wards and the KLEIGH stream running for fans worldwide. 100% of proceeds fuel artist support.
              </p>
            </div>
            <div className="space-y-4">
              <BenefitItem text="Access to URU Story Engine" />
              <BenefitItem text="Unlimited Plays (No Limits)" />
              <BenefitItem text="Verified 'Sponsor' Rank" />
              <BenefitItem text="Monthly Flash Specials" />
            </div>
          </div>
        </div>
      </section>

      {/* MSJ Spotlight */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="text-6xl">🎹</div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-80">Michael Scherer Jazz</h2>
            <h3 className="text-4xl font-black mb-6 uppercase leading-tight">KEZ — Keys for a Keyboard</h3>
            <p className="text-lg font-medium mb-8 opacity-90 leading-relaxed">
              Michael is fighting through serious personal challenges. Your support goes directly to keeping his craft alive. Press a key. Keep him playing.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 font-black text-sm uppercase tracking-widest hover:bg-[#FFD54F] transition-colors">
                Become a KEZ
              </button>
              <button className="border-2 border-white px-8 py-3 font-black text-sm uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-colors">
                Stream MSJ Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TierCard({ 
  name, desc, price, loading, onJoin, highlight = false, isFounder = false, perks = [] 
}: any) {
  return (
    <div className={`
      relative p-8 border-2 flex flex-col
      ${highlight ? 'bg-[#FFD54F] border-[#FFD54F] text-black scale-105 z-10' : 'border-white/10 bg-white/5'}
    `}>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-1">{name}</h3>
      <p className="font-bold text-lg mb-8 uppercase">{desc}</p>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-black">${price}</span>
          <span className="text-xs font-bold opacity-60 uppercase">/ mo</span>
        </div>

        {isFounder && (
          <div className="mb-6 bg-black text-white text-[10px] font-black py-1 px-3 inline-block uppercase tracking-widest">
            FOUNDER: GETS ELDER PERKS
          </div>
        )}

        <button 
          onClick={onJoin}
          disabled={loading}
          className={`
            w-full py-4 font-black text-sm uppercase tracking-[0.2em] transition-all
            ${highlight 
              ? 'bg-black text-white hover:bg-white/10' 
              : 'bg-white text-black hover:bg-[#FFD54F]'}
            disabled:opacity-50
          `}
        >
          {loading ? 'WAITING...' : 'JOIN'}
        </button>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded-full bg-[#FFD54F] flex items-center justify-center">
        <Check className="h-3 w-3 text-black stroke-[4]" />
      </div>
      <span className="font-bold uppercase text-xs tracking-wider">{text}</span>
    </div>
  );
}
