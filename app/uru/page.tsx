'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, Lock, Music, ArrowRight, ShieldCheck, DollarSign, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import BraveEaglePromo from '@/components/BraveEaglePromo';

export default function UruPage() {
  const [snippets, setSnippets] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSnippets() {
      // THE MAGIC QUERY: Find assets shorter than 11 seconds
      const { data } = await supabase
        .from('tracks')
        .select('*')
        .lte('duration', 11)
        .limit(10);
      if (data) setSnippets(data);
    }
    fetchSnippets();
  }, []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      <Header />
      <BraveEaglePromo
        links={[
          { href: '/heroes', label: 'Back to Heroes' },
          { href: '/mip', label: 'MIP1 Recognition Form' },
          { href: '/tt', label: 'TT Tale Tell' },
          { href: '/gift', label: 'Gift Support' },
        ]}
      />

      <div className="container mx-auto px-4 mt-16 text-center max-w-3xl">
        <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-8 shadow-xl"><Fingerprint size={48} className="text-[#FFD54F]" strokeWidth={1.5} /></div>
        <h1 className="text-6xl md:text-8xl font-black text-[#3E2723] mb-4 tracking-tight drop-shadow-sm leading-none">URU</h1>
        <p className="text-xl font-bold text-[#3E2723] opacity-80 mb-12 uppercase tracking-widest">Your Life. Your Story. Your Sound.</p>
      </div>

      <div className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(62,39,35,1)] text-center relative overflow-hidden">
          <Fingerprint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#3E2723] opacity-5 w-96 h-96" />

          <div className="relative z-10">
            <div className="flex justify-center gap-4 mb-6 text-[#E65100]"><ShieldCheck size={32} /><Music size={32} /></div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Exclusive Sponsor Access</h2>

            {/* LIVE SNIPPET PREVIEW */}
            {snippets.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold opacity-50 uppercase mb-4">Available Snippets (Preview)</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {snippets.map(s => (
                    <span key={s.id} className="bg-[#3E2723] text-[#FFD54F] px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Music size={10} /> {s.duration}s
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border-2 border-[#3E2723] rounded-2xl p-6 mb-8 max-w-lg mx-auto shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4 border-b-2 border-[#3E2723]/10 pb-2">
                <DollarSign size={20} className="text-[#3E2723]" />
                <h3 className="font-black text-lg uppercase text-[#3E2723]">Audio Snippet Pricing</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm font-bold text-[#3E2723]">
                <div className="bg-[#FFECB3] p-2 rounded-l-lg">1 - 2 Seconds</div><div className="bg-[#FFF8E1] p-2 rounded-r-lg border-l border-[#3E2723]/20 text-right">$0.55</div>
                <div className="bg-[#FFECB3] p-2 rounded-l-lg">3 - 4 Seconds</div><div className="bg-[#FFF8E1] p-2 rounded-r-lg border-l border-[#3E2723]/20 text-right">$0.62</div>
                <div className="bg-[#FFECB3] p-2 rounded-l-lg">5 - 6 Seconds</div><div className="bg-[#FFF8E1] p-2 rounded-r-lg border-l border-[#3E2723]/20 text-right">$0.70</div>
                <div className="bg-[#FFECB3] p-2 rounded-l-lg">7 - 8 Seconds</div><div className="bg-[#FFF8E1] p-2 rounded-r-lg border-l border-[#3E2723]/20 text-right">$0.77</div>
                <div className="bg-[#FFECB3] p-2 rounded-l-lg">9 - 10 Seconds</div><div className="bg-[#FFF8E1] p-2 rounded-r-lg border-l border-[#3E2723]/20 text-right">$0.85</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <a href="/join" className="bg-[#3E2723] text-[#FFD54F] px-8 py-4 rounded-xl font-black uppercase hover:scale-105 transition shadow-lg flex items-center gap-2">
                Become a Sponsor to Unlock <ArrowRight size={20} />
              </a>
              <p className="text-[10px] font-bold opacity-50 uppercase flex items-center gap-1"><Lock size={10} /> Requires Active Sponsorship</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
