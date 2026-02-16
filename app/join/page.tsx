'use client';
import { useState } from 'react';
import { Heart, TreePine, Mountain, Crown, Check, Users, ShieldCheck, Compass } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function JoinPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

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
    } catch (err) {
      setError('Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      <Header />

      <div className="container mx-auto px-4 mt-16 text-center max-w-3xl">
        <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-8 shadow-xl">
          <Users size={48} className="text-[#FFD54F]" strokeWidth={2} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[#3E2723] mb-4 tracking-tight drop-shadow-sm leading-none">
          Join the<br/>Pride.
        </h1>
        <p className="text-xl font-bold text-[#3E2723] opacity-80 mb-8 uppercase tracking-widest">
          Partner with us to keep the music flowing.
        </p>
      </div>

      {error && (
        <div className="container mx-auto px-4 max-w-5xl mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-bold">{error}</div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-20 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(62,39,35,1)]">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2"><Compass size={24} /> The Course</h2>
            <div className="space-y-6 text-lg font-bold text-[#3E2723]/80 leading-relaxed">
              <p>K-KUBs are the engine of G Putnam Music. You aren't just a fan; you are a partner.</p>
              <p>Your contribution keeps the <strong>Singalongs</strong> free for pediatric wards and the <strong>Kleigh</strong> stream running for fans worldwide.</p>
              <p><span className="text-[#E65100]">100% of proceeds</span> fuel development & artist support.</p>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-[#3E2723]/10 space-y-4">
              <h3 className="font-black text-sm uppercase">Pride Benefits:</h3>
              <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Access to URU Story Engine</div>
              <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Unlimited Plays (No Limits)</div>
              <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Verified "Sponsor" Rank</div>
            </div>
          </div>

          <div className="space-y-4">
            {/* JOEY */}
            <div className="bg-[#3E2723] text-[#FFD54F] p-6 rounded-2xl border-2 border-[#3E2723] shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
              <div className="flex items-center gap-4">
                <div className="bg-[#FFD54F] text-[#3E2723] p-3 rounded-full"><Heart size={24} /></div>
                <div>
                  <div className="font-black text-xl">JOEY</div><div className="text-xs opacity-70 font-bold uppercase">The Young One</div>
                </div>
              </div>
              <div className="text-right"><div className="font-black text-2xl">$5</div><button onClick={() => handleJoin('joey')} disabled={loading === 'joey'} className="text-[10px] underline hover:text-white cursor-pointer disabled:opacity-50">{loading === 'joey' ? 'LOADING...' : 'JOIN'}</button></div>
            </div>

            {/* CLIMBER */}
            <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
              <div className="flex items-center gap-4">
                <div className="bg-[#E65100] text-white p-3 rounded-full"><TreePine size={24} /></div>
                <div>
                  <div className="font-black text-xl text-[#3E2723]">CLIMBER</div><div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">On the Rise</div>
                </div>
              </div>
              <div className="text-right"><div className="font-black text-2xl text-[#3E2723]">$10</div><button onClick={() => handleJoin('climber')} disabled={loading === 'climber'} className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#E65100] cursor-pointer disabled:opacity-50">{loading === 'climber' ? 'LOADING...' : 'JOIN'}</button></div>
            </div>

            {/* ALPHA */}
            <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
              <div className="flex items-center gap-4">
                <div className="bg-[#2E7D32] text-white p-3 rounded-full"><Mountain size={24} /></div>
                <div>
                  <div className="font-black text-xl text-[#3E2723]">ALPHA</div><div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">The Leader</div>
                </div>
              </div>
              <div className="text-right"><div className="font-black text-2xl text-[#3E2723]">$15</div><button onClick={() => handleJoin('alpha')} disabled={loading === 'alpha'} className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#2E7D32] cursor-pointer disabled:opacity-50">{loading === 'alpha' ? 'LOADING...' : 'JOIN'}</button></div>
            </div>

            {/* ELDER */}
            <div className="bg-gradient-to-r from-[#FFD54F] to-[#FFB300] border-2 border-[#3E2723] p-6 rounded-2xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
              <div className="flex items-center gap-4">
                <div className="bg-[#3E2723] text-[#FFD54F] p-3 rounded-full"><Crown size={24} /></div>
                <div>
                  <div className="font-black text-xl text-[#3E2723]">ELDER</div><div className="text-xs text-[#3E2723] font-bold uppercase">The Patriarch</div>
                </div>
              </div>
              <div className="text-right"><div className="font-black text-2xl text-[#3E2723]">$20</div><button onClick={() => handleJoin('elder')} disabled={loading === 'elder'} className="text-[10px] text-[#3E2723] font-bold underline hover:text-white cursor-pointer disabled:opacity-50">{loading === 'elder' ? 'LOADING...' : 'JOIN'}</button></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
