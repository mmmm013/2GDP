'use client';
import { useState, useEffect } from 'react';
import { Heart, Shield, CheckCircle, Star, Video, Award, Lock, Radio, Zap } from 'lucide-react';
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
                                                Dedicated to the Founder&#39;s Great-Grandfather, a Marine Medic who served in the 1st Wave at Hacksaw Ridge during the Battle of Okinawa, 1945.<br />
              He first enlisted in the Navy, then transferred to the Marines. Like many, he carried the weight of silence. We honor that silence with music—a place to heal, reflect, and feel.
          </p>
          
          <div className="h-1 w-24 bg-[#3E2723] mx-auto rounded-full opacity-20"></div>
        </div>
      </section>

                {/* MILITARY MIP1 - PRIORITY ACCESS */}
              <section className="py-12 bg-[#2a1f0f] text-center relative overflow-hidden">
                                    {/* LEFT: ICU/Medical Scene Watermark */}
          <div className="absolute left-0 bottom-0 top-0 w-1/2 pointer-events-none select-none opacity-[0.07]" aria-hidden="true">
            <svg viewBox="0 0 400 400" className="absolute bottom-0 left-4 h-[80%] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Medical cross */}
              <rect x="170" y="80" width="60" height="180" rx="4" fill="#C8A882" />
              <rect x="110" y="140" width="180" height="60" rx="4" fill="#C8A882" />
              {/* Heart monitor line */}
              <polyline points="40,300 80,300 100,260 120,340 140,280 160,310 200,300 240,300" stroke="#C8A882" strokeWidth="4" fill="none" />
              {/* Doctor figure left */}
              <circle cx="80" cy="100" r="18" fill="#C8A882" />
              <rect x="65" y="120" width="30" height="50" rx="6" fill="#C8A882" />
              <line x1="65" y1="170" x2="55" y2="210" stroke="#C8A882" strokeWidth="6" strokeLinecap="round" />
              <line x1="95" y1="170" x2="105" y2="210" stroke="#C8A882" strokeWidth="6" strokeLinecap="round" />
              {/* Nurse figure right */}
              <circle cx="320" cy="110" r="16" fill="#C8A882" />
              <rect x="307" y="128" width="26" height="45" rx="5" fill="#C8A882" />
              <line x1="307" y1="173" x2="297" y2="210" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              <line x1="333" y1="173" x2="343" y2="210" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              {/* IV drip stand */}
              <line x1="320" y1="50" x2="320" y2="130" stroke="#C8A882" strokeWidth="3" />
              <rect x="310" y="45" width="20" height="25" rx="3" fill="#C8A882" />
              <line x1="300" y1="50" x2="340" y2="50" stroke="#C8A882" strokeWidth="3" />
            </svg>
          </div>
          {/* RIGHT: Iwo Jima Flag-Raising Watermark */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 pointer-events-none select-none opacity-[0.07]" aria-hidden="true">
            <svg viewBox="0 0 400 500" className="absolute bottom-0 right-4 h-[85%] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Flag pole - angled like the famous photo */}
              <line x1="280" y1="40" x2="120" y2="420" stroke="#C8A882" strokeWidth="6" strokeLinecap="round" />
              {/* Flag waving from top of pole */}
              <path d="M280,40 L380,55 L370,90 L280,75 Z" fill="#C8A882" />
              <path d="M280,75 L370,90 L365,120 L280,108 Z" fill="#C8A882" opacity="0.7" />
              {/* Soldier 1 - front, arms up on pole */}
              <circle cx="160" cy="280" r="14" fill="#C8A882" />
              <rect x="150" y="296" width="20" height="40" rx="4" fill="#C8A882" />
              <line x1="170" y1="300" x2="190" y2="260" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              <line x1="150" y1="310" x2="140" y2="280" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              <line x1="155" y1="336" x2="145" y2="380" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              <line x1="165" y1="336" x2="175" y2="380" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              {/* Soldier 2 - behind, pushing */}
              <circle cx="200" cy="300" r="13" fill="#C8A882" />
              <rect x="191" y="315" width="18" height="38" rx="4" fill="#C8A882" />
              <line x1="209" y1="320" x2="220" y2="285" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              <line x1="191" y1="325" x2="180" y2="300" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              <line x1="195" y1="353" x2="185" y2="395" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              <line x1="205" y1="353" x2="215" y2="395" stroke="#C8A882" strokeWidth="5" strokeLinecap="round" />
              {/* Soldier 3 - reaching up */}
              <circle cx="135" cy="310" r="12" fill="#C8A882" />
              <rect x="127" y="324" width="16" height="36" rx="4" fill="#C8A882" />
              <line x1="143" y1="328" x2="155" y2="295" stroke="#C8A882" strokeWidth="4" strokeLinecap="round" />
              <line x1="127" y1="334" x2="115" y2="310" stroke="#C8A882" strokeWidth="4" strokeLinecap="round" />
              <line x1="131" y1="360" x2="122" y2="400" stroke="#C8A882" strokeWidth="4" strokeLinecap="round" />
              <line x1="139" y1="360" x2="148" y2="400" stroke="#C8A882" strokeWidth="4" strokeLinecap="round" />
              {/* Soldier 4 - crouching support */}
              <circle cx="230" cy="330" r="11" fill="#C8A882" />
              <rect x="223" y="343" width="14" height="32" rx="3" fill="#C8A882" />
              <line x1="237" y1="348" x2="245" y2="320" stroke="#C8A882" strokeWidth="4" strokeLinecap="round" />
              <line x1="227" y1="375" x2="218" y2="410" stroke="#C8A882" strokeWidth="4" strokeLinecap="round" />
              <line x1="233" y1="375" x2="242" y2="410" stroke="#C8A882" strokeWidth="4" strokeLinecap="round" />
              {/* Rocky ground */}
              <path d="M80,420 Q120,400 160,415 Q200,425 240,410 Q280,420 320,415 L320,450 L80,450 Z" fill="#C8A882" opacity="0.4" />
            </svg>
          </div>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#3E2723] border border-[#C8A882]/30 px-4 py-1 rounded-full mb-6">
            <Zap size={14} className="text-[#C8A882]" />
            <span className="text-xs font-black text-[#C8A882] tracking-[0.2em] uppercase">MIP1 Priority Access</span>
          </div>
          
                                            <h2 className="text-3xl md:text-4xl font-black text-[#FFD96A] mb-4 tracking-tight">MILITARY MARVELS - FREE+</h2>
                      <p className="text-sm text-[#f5e6c8]/60 mb-8">MIP1 designation grants priority free streaming access. Validate with your military email or service credentials.</p>
          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
                <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
                            <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Active Duty</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
              <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
                            <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Veterans</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
              <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
                            <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Reserves</p>
            </div>
            <div className="bg-[#3E2723] rounded-lg p-4 border border-[#C8A882]/10">
              <Shield size={24} className="text-[#C8A882] mx-auto mb-2" />
                            <p className="text-xs text-[#f5e6c8]/70 font-bold uppercase">Allied Forces</p>
            </div>
          </div>
          
                      <p className="text-xs text-[#f5e6c8]/40">Dedicated to the US Military for steadfastly protecting ALL Americans and all our borders!</p>
        </div>
      </section>

      
      {/* US MILITARY MIP2 - PRIORITY ACCESS */}
              <section className="py-12 bg-[#1a0f0a] text-center border-t border-[#C8A882]/10 relative overflow-hidden">
                                    {/* LEFT: ICU Emergency Scene Watermark */}
          <div className="absolute left-0 bottom-0 top-0 w-1/2 pointer-events-none select-none opacity-[0.06]" aria-hidden="true">
            <svg viewBox="0 0 400 400" className="absolute bottom-0 left-4 h-[80%] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Medical cross */}
              <rect x="170" y="80" width="60" height="180" rx="4" fill="#E91E63" />
              <rect x="110" y="140" width="180" height="60" rx="4" fill="#E91E63" />
              {/* Heart monitor line */}
              <polyline points="40,300 80,300 100,260 120,340 140,280 160,310 200,300 240,300" stroke="#E91E63" strokeWidth="4" fill="none" />
              {/* Doctor figure */}
              <circle cx="80" cy="100" r="18" fill="#E91E63" />
              <rect x="65" y="120" width="30" height="50" rx="6" fill="#E91E63" />
              <line x1="65" y1="170" x2="55" y2="210" stroke="#E91E63" strokeWidth="6" strokeLinecap="round" />
              <line x1="95" y1="170" x2="105" y2="210" stroke="#E91E63" strokeWidth="6" strokeLinecap="round" />
              {/* Nurse figure */}
              <circle cx="320" cy="110" r="16" fill="#E91E63" />
              <rect x="307" y="128" width="26" height="45" rx="5" fill="#E91E63" />
              <line x1="307" y1="173" x2="297" y2="210" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              <line x1="333" y1="173" x2="343" y2="210" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              {/* IV drip stand */}
              <line x1="320" y1="50" x2="320" y2="130" stroke="#E91E63" strokeWidth="3" />
              <rect x="310" y="45" width="20" height="25" rx="3" fill="#E91E63" />
              <line x1="300" y1="50" x2="340" y2="50" stroke="#E91E63" strokeWidth="3" />
            </svg>
          </div>
          {/* RIGHT: Iwo Jima Flag-Raising Watermark */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 pointer-events-none select-none opacity-[0.06]" aria-hidden="true">
            <svg viewBox="0 0 400 500" className="absolute bottom-0 right-4 h-[85%] w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Flag pole - angled */}
              <line x1="280" y1="40" x2="120" y2="420" stroke="#E91E63" strokeWidth="6" strokeLinecap="round" />
              {/* Flag waving */}
              <path d="M280,40 L380,55 L370,90 L280,75 Z" fill="#E91E63" />
              <path d="M280,75 L370,90 L365,120 L280,108 Z" fill="#E91E63" opacity="0.7" />
              {/* Soldier 1 */}
              <circle cx="160" cy="280" r="14" fill="#E91E63" />
              <rect x="150" y="296" width="20" height="40" rx="4" fill="#E91E63" />
              <line x1="170" y1="300" x2="190" y2="260" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              <line x1="150" y1="310" x2="140" y2="280" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              <line x1="155" y1="336" x2="145" y2="380" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              <line x1="165" y1="336" x2="175" y2="380" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              {/* Soldier 2 */}
              <circle cx="200" cy="300" r="13" fill="#E91E63" />
              <rect x="191" y="315" width="18" height="38" rx="4" fill="#E91E63" />
              <line x1="209" y1="320" x2="220" y2="285" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              <line x1="191" y1="325" x2="180" y2="300" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              <line x1="195" y1="353" x2="185" y2="395" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              <line x1="205" y1="353" x2="215" y2="395" stroke="#E91E63" strokeWidth="5" strokeLinecap="round" />
              {/* Soldier 3 */}
              <circle cx="135" cy="310" r="12" fill="#E91E63" />
              <rect x="127" y="324" width="16" height="36" rx="4" fill="#E91E63" />
              <line x1="143" y1="328" x2="155" y2="295" stroke="#E91E63" strokeWidth="4" strokeLinecap="round" />
              <line x1="127" y1="334" x2="115" y2="310" stroke="#E91E63" strokeWidth="4" strokeLinecap="round" />
              <line x1="131" y1="360" x2="122" y2="400" stroke="#E91E63" strokeWidth="4" strokeLinecap="round" />
              <line x1="139" y1="360" x2="148" y2="400" stroke="#E91E63" strokeWidth="4" strokeLinecap="round" />
              {/* Soldier 4 */}
              <circle cx="230" cy="330" r="11" fill="#E91E63" />
              <rect x="223" y="343" width="14" height="32" rx="3" fill="#E91E63" />
              <line x1="237" y1="348" x2="245" y2="320" stroke="#E91E63" strokeWidth="4" strokeLinecap="round" />
              <line x1="227" y1="375" x2="218" y2="410" stroke="#E91E63" strokeWidth="4" strokeLinecap="round" />
              <line x1="233" y1="375" x2="242" y2="410" stroke="#E91E63" strokeWidth="4" strokeLinecap="round" />
              {/* Rocky ground */}
              <path d="M80,420 Q120,400 160,415 Q200,425 240,410 Q280,420 320,415 L320,450 L80,450 Z" fill="#E91E63" opacity="0.4" />
            </svg>
          </div>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#3E2723] border border-[#C8A882]/30 px-4 py-1 rounded-full mb-6">
            <Heart size={14} className="text-[#E91E63]" />
            <span className="text-xs font-black text-[#C8A882] tracking-[0.2em] uppercase">MIP1 Priority Access</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-[#FFD95A] mb-4 tracking-tight">ICU ANGELS
            - FREE+</h2>          <p className="text-lg text-[#f5e6c8]/80 mb-2">Critical Care. Emergency. Trauma. ICU Staff.</p>
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
          
                      <p className="text-xs text-[#f5e6c8]/40">You hold the line. Change for ALL starts with change for ONE.</p>
        </div>
      </section>

          {/* FACE A MIRROR - OWNER MANIFESTO */}
          <section className="py-16 bg-[#2a1f0f] text-center border-t border-[#C8A882]/10">
            <div className="container mx-auto px-4 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-black text-[#f5e6c8] mb-6 tracking-tight">FACE A MIRROR.</h2>
              <div className="space-y-4 text-sm text-[#f5e6c8]/70 leading-relaxed text-left">
                <p>I designed every piece of this app. No corp mandates, no constraints, no phone-game antics. Just me and folk all over this gorgeous globe.</p>
                <p>We are hand-to-mouth as any. Large parts of income go directly to <span className="text-[#C8A882] font-bold">studio</span> and <span className="text-[#E91E63] font-bold">medical</span>. That is real.</p>
                <p className="text-[#f5e6c8]/50 italic">Change for ALL starts within change for ONE.</p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/gift" className="inline-flex items-center gap-2 bg-[#3E2723] border border-[#C8A882]/30 text-[#C8A882] font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#C8A882]/10 transition">
                  <Heart size={14} /> Sponsor Us
                </a>
                <a href="/gift" className="inline-flex items-center gap-2 bg-[#3E2723] border border-[#C8A882]/30 text-[#C8A882] font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#C8A882]/10 transition">
                  <Star size={14} /> Leave a Tip
                </a>
              </div>
              <p className="text-[10px] text-[#f5e6c8]/25 mt-6">100% Greg-designed. 100% independent. G Putnam Music LLC.</p>
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
