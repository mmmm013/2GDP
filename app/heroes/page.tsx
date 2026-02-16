'use client';
import { useState } from 'react';
import { Heart, Shield, CheckCircle, Lock, Zap, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HeroesPage() {
  const [step, setStep] = useState<'intro' | 'verifying' | 'approved'>('intro');
  const [scanProgress, setScanProgress] = useState(0);
  
  const startVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verifying');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setStep('approved');
      }
      setScanProgress(progress);
    }, 200);
  };

  return (
    <main className="min-h-screen bg-[#3E2723] text-[#f5e6c8] font-sans">
      <Header />

      {/* DEDICATION & TRIBUTE SECTION */}
      <section className="relative pt-24 pb-16 text-center bg-[#2a1f0f] border-b border-[#C8A882]/10">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 border border-[#C8A882]/30 bg-[#3E2723] px-4 py-1 rounded-full mb-8 shadow-xl">
            <Zap size={14} className="text-[#C8A882] fill-current" />
            <span className="text-xs font-black tracking-[0.2em] uppercase text-[#C8A882]">The Sovereign Sanctuary</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-[#FFD96A]">
            MILITARY MARVELS ⚡<br />
            <span className="text-[#C8A882] opacity-90 font-serif italic">ICU ANGELS 👼</span>
          </h1>

          <p className="text-lg font-bold leading-relaxed mb-8 max-w-2xl mx-auto opacity-90">
            Dedicated to The US military for steadfastly protecting ALL Americans and all our borders!<br />
            To those serving the voice of choice, democracy!
          </p>
          
          <div className="h-px w-24 bg-[#C8A882] mx-auto opacity-30"></div>
        </div>
      </section>

      {/* HEROES PORTAL - WATERMARKED ALIGNMENT */}
      <section className="py-20 relative overflow-hidden bg-[#3E2723]">
        
        {/* LEFT WATERMARK: ICU ANGELS */}
        <div className="absolute left-4 bottom-10 opacity-[0.08] pointer-events-none hidden lg:block">
           <div className="flex flex-col items-center">
             <Heart size={300} strokeWidth={1} />
             <span className="text-4xl font-black uppercase mt-4">ICU ANGELS</span>
           </div>
        </div>

        {/* RIGHT WATERMARK: KONSTITUTIONAL KOWBOYS */}
        <div className="absolute right-4 bottom-10 opacity-[0.08] pointer-events-none hidden lg:block">
           <div className="flex flex-col items-center">
             <Zap size={300} strokeWidth={1} />
             <span className="text-4xl font-black uppercase mt-4 text-right">Konstitutional<br/>Kowboys</span>
           </div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-xl mx-auto bg-[#2a1f0f] border-2 border-[#C8A882]/20 rounded-3xl p-1 shadow-2xl">
            
            {/* GPM CYBER-OPS HEADER */}
            <div className="bg-[#4E3524] rounded-t-[1.3rem] p-4 flex items-center justify-between border-b border-[#C8A882]/20">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#C8A882]" />
                <span className="text-xs font-black uppercase tracking-wider">GPM CYBER-OPS: CERTIFIED</span>
              </div>
              <Lock size={14} className="opacity-30" />
            </div>

            <div className="p-8 md:p-10">
              {step === 'intro' && (
                <form onSubmit={startVerification} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black uppercase text-[#FFD96A]">MIP1 Recognition</h3>
                    <p className="text-sm font-bold opacity-70 mt-2">
                      Validation for Military Marvels & ICU Angels.<br />
                      No Corporate Tracing. NPI Safe.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="FULL NAME"
                      required
                      className="w-full bg-[#3E2723] border border-[#C8A882]/20 rounded-xl p-4 font-bold outline-none focus:border-[#C8A882] transition"
                    />
                    <input
                      type="email"
                      placeholder="SERVICE / MEDICAL EMAIL"
                      required
                      className="w-full bg-[#3E2723] border border-[#C8A882]/20 rounded-xl p-4 font-bold outline-none focus:border-[#C8A882] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C8A882] text-[#3E2723] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#FFD96A] transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Shield size={18} /> Initiate Security Check
                  </button>
                </form>
              )}

              {step === 'verifying' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-[#C8A882]/10 border-t-[#C8A882] rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-black animate-pulse">Running GPM Risk Protocols...</h3>
                  <p className="text-xs font-mono mt-2 text-[#C8A882]">
                    ENCRYPTING NPI: {scanProgress > 100 ? 100 : scanProgress}%
                  </p>
                </div>
              )}

              {step === 'approved' && (
                <div className="text-center animate-fade-in">
                  <div className="bg-[#1a3a1a] border border-[#4caf50]/30 p-6 rounded-2xl mb-8 flex items-center gap-4 text-left">
                    <CheckCircle size={32} className="text-[#4caf50]" />
                    <div>
                      <h4 className="text-lg font-black uppercase text-[#4caf50]">Certificate of Safety</h4>
                      <p className="text-[10px] font-mono opacity-60 uppercase">
                        Enterprise Risk Weaved | GPM-SEC-LOCKED
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-6 uppercase text-[#FFD96A]">Welcome to the Sanctuary</h3>
                  <p className="text-sm opacity-80 mb-8 italic font-serif">
                    "Change for ALL starts within change for ONE."
                  </p>

                  <a
                    href="/gift"
                    className="block w-full bg-[#C8A882] text-[#3E2723] text-center font-black py-4 rounded-xl hover:scale-[1.02] transition uppercase tracking-widest"
                  >
                    Support the Mission <ArrowRight className="inline ml-2" size={18} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO / HLP US SECTION */}
      <section className="py-20 bg-[#2a1f0f] border-t border-[#C8A882]/10 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase text-[#f5e6c8]">FACE A MIRROR.</h2>
          <div className="space-y-6 text-sm opacity-80 text-left leading-relaxed">
            <p>I designed every piece of this app. No corporate mandates, no phone-game antics. Just me and folk all over this gorgeous globe.</p>
            <p>I swear on my background directing Enterprise Risk Management: I will <span className="text-[#FFD96A] font-bold underline">NEVER SELL</span> your personal info to anyone. I don't seek grand profit. I answer to NO corporate giant.</p>
            <p>Revenue earned fuels the <span className="text-[#C8A882] font-black">Studio</span> and the <span className="text-[#C8A882] font-black">ICU Angels</span>. We are hand-to-mouth, but we are sovereign.</p>
          </div>

          <div className="mt-12 flex justify-center gap-6">
            <button className="bg-[#3E2723] border border-[#C8A882]/40 text-[#C8A882] px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#C8A882]/10 transition">
              HLP US
            </button>
          </div>
          <p className="mt-8 text-[10px] opacity-30 font-bold uppercase tracking-widest italic">
            100% Greg-Designed. G Putnam Music LLC Passthrough.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
