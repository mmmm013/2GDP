'use client';
import { useState, useEffect } from 'react';
import { Heart, Shield, CheckCircle, Star, Video, Award, Lock, Radio } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer'; 
import GlobalPlayer from '@/components/GlobalPlayer';

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
    <main className="min-h-screen bg-[#FFD95A] text-[#3E2723]">
      <Header />
      <GlobalPlayer />

      {/* TRIBUTE SECTION */}
      <section className="relative pt-20 pb-16 overflow-hidden text-center bg-gradient-to-b from-[#FFD95A] to-[#FFECB3]">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 border-2 border-[#3E2723] bg-white/80 px-4 py-1 rounded-full mb-6 shadow-md">
            <Star size={14} className="text-[#FF8F00] fill-current" />
            <span className="text-xs font-black text-[#3E2723] tracking-[0.2em] uppercase">Honoring The 1st Wave</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#3E2723] mb-6 tracking-tighter drop-shadow-sm leading-none">
            HONOR. SERVICE.<br />
            <span className="text-[#D84315] drop-shadow-md">SACRIFICE.</span>
          </h1>

          <p className="text-lg text-[#3E2723] font-bold opacity-80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Dedicated to the Founder's Grandfather, a Navy Medic who served in the 1st Wave at Hacksaw Ridge.<br />
            Like many, he carried the weight of silence. We honor that silence with music—a place to heal, reflect, and feel.
          </p>
          
          <div className="h-1 w-24 bg-[#3E2723] mx-auto rounded-full opacity-20"></div>
        </div>
      </section>

      {/* US MILITARY MIP1 - PRIORITY ACCESS */}
      <section className="py-12 bg-[#2a1f0f] text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#3E2723] border border-[#C8A882]/30 px-4 py-1 rounded-full mb-6">
            <Award size={14} className="text-[#C8A882]" />
            <span className="text-xs font-black text-[#C8A882] tracking-[0.2em] uppercase">MIP1 Priority Access</span>
          </div>
          
                                <h2 className="text-3xl md:text-4xl font-black text-[#FFD96A] mb-4 tracking-tight">ICU NURSES & DOCTORS - FREE!</h2>
          <p className="text-sm text-[#f5e6c8]/60 mb-8">MIP1 designation grants priority free streaming access. Validate with your .mil email or DD-214.</p>
          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
                <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Army</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
              <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Navy</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
              <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Air Force</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
              <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Marines</p>
            </div>
          </div>
          
          <p className="text-xs text-[#f5e6c8]/40">Coast Guard, Space Force, and all branches welcome. MIP1 = Most Important Person/Partner.</p>
        </div>
      </section>

      
      {/* US MILITARY MIP2 - PRIORITY ACCESS */}
      <section className="py-12 bg-[#1a0f0a] text-center border-t border-[#C8A882]/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#3E2723] border border-[#C8A882]/30 px-4 py-1 rounded-full mb-6">
            <Heart size={14} className="text-[#E91E63]" />
            <span className="text-xs font-black text-[#C8A882] tracking-[0.2em] uppercase">MIP1 Priority Access</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-[#FFD95A] mb-4 tracking-tight">ICU 62
            - FREE!</h2>          <p className="text-lg text-[#f5e6c8]/80 mb-2">Critical Care. Emergency. Trauma. ICU Staff.</p>
          <p className="text-sm text-[#f5e6c8]/60 mb-8">MIP1 designation grants priority free streaming access. Validate with your hospital or medical facility email.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#E91E63]/20">
              <Heart size={24} className="text-[#E91E63] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">ICU Nurses</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#E91E63]/20">
              <Heart size={24} className="text-[#E91E63] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">ER Doctors</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#E91E63]/20">
              <Heart size={24} className="text-[#E91E63] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Trauma Staff</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#E91E63]/20">
              <Heart size={24} className="text-[#E91E63] mx-auto mb-2" />
              <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">CCU Teams</p>
            </div>
          </div>
          
          <p className="text-xs text-[#f5e6c8]/40">All critical care professionals welcome — you hold the line. MIP1 = Most Important Person/Partner.</p>
        </div>
      </section>

      {/* SECURITY FORM SECTION */}
      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="max-w-2xl mx-auto bg-white border-4 border-[#3E2723] rounded-3xl p-1 shadow-[12px_12px_0px_0px_rgba(62,39,35,0.15)]">
          
          <div className="bg-[#FFE082] rounded-t-[1.3rem] p-4 flex items-center justify-between border-b-4 border-[#3E2723]">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#2E7D32]" />
              <span className="text-xs font-black text-[#2E7D32] uppercase tracking-wider">GPM CYBER-OPS: ACTIVE</span>
            </div>
            <Lock size={14} className="text-[#3E2723] opacity-50" />
          </div>

          <div className="p-8 md:p-12">
            {step === 'intro' && (
              <form onSubmit={startVerification} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-[#3E2723] mb-2 uppercase">Claim Your Heroes Access</h3>
                  <p className="text-sm font-bold text-[#3E2723] opacity-60">
                    Nurses, Teachers, Military, First Responders.<br />
                    Enter your professional email for <span className="text-[#E65100] underline">Instant Security Clearance</span>.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-[#3E2723] uppercase tracking-widest opacity-50">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border-2 border-[#3E2723]/20 rounded-xl p-4 text-[#3E2723] font-bold focus:border-[#3E2723] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#3E2723] uppercase tracking-widest opacity-50">Business / Mil Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@army.mil / @hospital.org"
                      className="w-full bg-white border-2 border-[#3E2723]/20 rounded-xl p-4 text-[#3E2723] font-bold focus:border-[#3E2723] outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3E2723] text-[#FFD95A] font-black uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Shield size={18} /> Initiate Security Check
                </button>

                <p className="text-[10px] text-center text-[#3E2723] opacity-40 font-bold mt-4">
                  *Protected by GPM Cybersecurity Protocols. NPI Safe.
                </p>
              </form>
            )}

            {step === 'verifying' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-[#3E2723]/10 border-t-[#3E2723] rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-black text-[#3E2723] animate-pulse">Running Security Protocols...</h3>
                <p className="text-xs text-[#E65100] font-mono mt-2 font-bold">
                  Checking Encryption: {scanProgress > 100 ? 100 : scanProgress}%
                </p>
                <div className="w-full h-2 bg-[#3E2723]/10 rounded-full mt-6 overflow-hidden">
                  <div
                    className="h-full bg-[#3E2723] transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {step === 'approved' && (
              <div className="animate-fade-in">
                <div className="bg-[#E8F5E9] border-2 border-[#2E7D32] p-6 rounded-2xl mb-8 flex items-center gap-4">
                  <div className="bg-[#2E7D32] rounded-full p-2">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#2E7D32] uppercase">Certificate of Online Security</h4>
                    <p className="text-xs text-[#2E7D32] font-mono font-bold">
                      ISSUED: {new Date().toLocaleDateString()} | ID: GPM-SEC-{Math.floor(Math.random() * 10000)}
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-[#3E2723] mb-6 text-center uppercase">
                  Welcome, Hero. Select Your Gift:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button className="p-4 bg-white border-2 border-[#3E2723]/10 rounded-xl hover:border-[#E91E63] hover:bg-[#FCE4EC] text-left transition group shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-[#E91E63]" />
                      <span className="font-black text-sm text-[#3E2723] uppercase">New Track Reviewer</span>
                    </div>
                    <p className="text-xs text-[#3E2723] opacity-60 font-bold group-hover:opacity-100">
                      Be the first to hear and rate new drops before the public.
                    </p>
                  </button>

                  <button className="p-4 bg-white border-2 border-[#3E2723]/10 rounded-xl hover:border-[#2196F3] hover:bg-[#E3F2FD] text-left transition group shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Video size={16} className="text-[#2196F3]" />
                      <span className="font-black text-sm text-[#3E2723] uppercase">5-Min Artist Zoom</span>
                    </div>
                    <p className="text-xs text-[#3E2723] opacity-60 font-bold group-hover:opacity-100">
                      Exclusive face-to-face chat with the creators on request.
                    </p>
                  </button>

                  <button className="p-4 bg-white border-2 border-[#3E2723]/10 rounded-xl hover:border-[#FFC107] hover:bg-[#FFF8E1] text-left transition group shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={16} className="text-[#FFC107]" />
                      <span className="font-black text-sm text-[#3E2723] uppercase">3 Free K-Messages</span>
                    </div>
                    <p className="text-xs text-[#3E2723] opacity-60 font-bold group-hover:opacity-100">
                      Send 3 premium musical messages to loved ones for free.
                    </p>
                  </button>

                  <button className="p-4 bg-white border-2 border-[#3E2723]/10 rounded-xl hover:border-[#9C27B0] hover:bg-[#F3E5F5] text-left transition group shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Video size={16} className="text-[#9C27B0]" />
                      <span className="font-black text-sm text-[#3E2723] uppercase">Session Vault Access</span>
                    </div>
                    <p className="text-xs text-[#3E2723] opacity-60 font-bold group-hover:opacity-100">
                      Watch raw recording sessions & singer stories.
                    </p>
                  </button>
                </div>

                <a
                  href="/uru"
                  className="block w-full bg-[#3E2723] text-[#FFD95A] text-center font-black py-4 rounded-xl hover:scale-[1.02] transition uppercase tracking-widest shadow-lg"
                >
                  Access The Music (URU Portal)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
