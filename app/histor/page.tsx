'use client';

/**
 * /histor — HISTOR™ Backer & Investor Pitch Page
 *
 * Purpose: Drive inbound backer interest in the Historic K-KUTs locket tier.
 * Three Historic lockets have already been created — this is proof of IP, not a concept.
 * Sections:
 *   1. Hero — "HISTOR™ Is Real. Three Exist."
 *   2. Proof — What was built
 *   3. IP Portfolio — Patent-pending, 2 inventions, 3 trademarks
 *   4. The Pitch — Why back now
 *   5. Backer paths — Direct purchase ($3,300) + Inquiry form for larger deals
 */

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { Lock, Star, Zap, Shield, ArrowRight, Mail, CheckCircle, Clock, Award, Music, Layers } from 'lucide-react';

const HISTORIC_STRIPE = 'https://buy.stripe.com/9B6aEW48ebYK0PqbZI4ow06';

interface InquiryForm {
  name: string;
  email: string;
  company: string;
  type: 'investor' | 'licensor' | 'acquisition' | 'other';
  message: string;
}

const EMPTY_FORM: InquiryForm = {
  name: '',
  email: '',
  company: '',
  type: 'investor',
  message: '',
};

export default function HistorPage() {
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/histor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch {
      setError('Something went wrong. Please email us directly at gputnammusic@gmail.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col text-white bg-black">
      <Header />
      <GlobalPlayer />

      {/* ═══════════════════════════════════════════
          HERO — HISTOR™ IS REAL
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#1a0f00] to-black pt-20 pb-16 px-4">
        {/* Gold ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-yellow-400/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-yellow-300" />
            MAKES HISTORY — Patent Pending
            <Star className="w-3.5 h-3.5 fill-yellow-300" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-4">
            <span className="text-white">HISTOR</span>
            <span className="text-yellow-400">™</span>
          </h1>

          <p className="text-2xl sm:text-3xl font-bold text-yellow-200 mb-3">
            Is Real. Three Exist.
          </p>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            This is not a pitch deck. Not a concept. Not a prototype.{' '}
            <strong className="text-white">Three Historic K-KUTs lockets have already been created</strong> —
            physical + digital artifacts anchored to patent-pending music-frequency IP.
            The window to back this at ground level is open right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={HISTORIC_STRIPE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black px-8 py-4 rounded-full text-lg hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-500/30 transition-all"
            >
              <Lock className="w-5 h-5" />
              Secure a Historic Locket — $3,300
            </a>
            <a
              href="#inquire"
              className="inline-flex items-center gap-2 border border-yellow-400/40 text-yellow-300 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-400/10 transition-all"
            >
              Serious Inquiry
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROOF — WHAT WAS BUILT
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0d0d0d] py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-white mb-2">
            Three Have Been Created
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
            Each Historic K-KUTs locket is a singular artifact — not a limited edition run,
            not a pre-order. Three are built. Each one is it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: '#001',
                label: 'Historic Locket One',
                note: 'First artifact. Created. Delivered.',
                icon: '🔑',
              },
              {
                number: '#002',
                label: 'Historic Locket Two',
                note: 'Second artifact. Independent instance.',
                icon: '🔐',
              },
              {
                number: '#003',
                label: 'Historic Locket Three',
                note: 'Third artifact. Available for acquisition.',
                icon: '🏆',
              },
            ].map((locket) => (
              <div
                key={locket.number}
                className="relative bg-gradient-to-b from-[#1a1200] to-[#0a0a0a] border border-yellow-400/20 rounded-2xl p-6 text-center hover:border-yellow-400/50 transition-colors"
              >
                <div className="text-4xl mb-3">{locket.icon}</div>
                <div className="text-yellow-400 font-black text-2xl mb-1">{locket.number}</div>
                <div className="text-white font-bold text-sm mb-2">{locket.label}</div>
                <div className="text-gray-400 text-xs">{locket.note}</div>
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    HISTORIC
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          IP PORTFOLIO
          ═══════════════════════════════════════════ */}
      <section className="bg-black py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-white mb-2">
            The IP Behind It
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
            HISTOR™ is protected. Two inventions in process. Three trademarks filed.
            A physical-digital music artifact system with no comparable precedent.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Shield className="w-6 h-6 text-yellow-400" />,
                title: '2 Patent-Pending Inventions',
                body: 'Frequency-pairing engine and physical K-KUT locket delivery system. Both filings in process.',
              },
              {
                icon: <Award className="w-6 h-6 text-yellow-400" />,
                title: '3 Trademarks',
                body: 'K-KUTs™, HISTOR™, and the kUpId™ mark. Filed and in prosecution.',
              },
              {
                icon: <Music className="w-6 h-6 text-yellow-400" />,
                title: 'PRO-Registered Catalog',
                body: 'Full ASCAP / BMI registered music catalog feeding the frequency system. Live royalty pipeline.',
              },
              {
                icon: <Layers className="w-6 h-6 text-yellow-400" />,
                title: 'Physical + Digital Convergence',
                body: 'Each locket is a physical object tied to an irreplaceable digital frequency ID. One of one.',
              },
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: 'Full Archive Access',
                body: 'Historic holders get lifetime access to the complete G Putnam Music frequency archive.',
              },
              {
                icon: <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />,
                title: 'Legacy Value Designed In',
                body: 'Scarcity is structural. Once the first three are gone, Historic tier closes permanently.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/5 rounded-xl p-5 hover:border-yellow-400/20 transition-colors"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE PITCH — WHY BACK NOW
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0d0800] py-16 px-4 border-t border-yellow-400/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-6 text-center">Why Back Now</h2>

          <div className="space-y-5">
            {[
              {
                icon: <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />,
                heading: 'Ground Floor — Literally',
                body: "Three Historic lockets exist. That's it. There is no round two at this tier. The Founder built these himself — no VC, no label backing, no co-sign. The IP is real, the catalog is registered, the artifacts exist.",
              },
              {
                icon: <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />,
                heading: 'Not Speculative',
                body: 'Every component of HISTOR™ is operational. The music catalog feeds ASCAP/BMI. The lockets are physical. The frequency-pairing engine runs. The kUpId™ platform is live. Backing this is not a bet on "someday" — it is acquiring something that already works.',
              },
              {
                icon: <Music className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />,
                heading: 'PRO Pipeline Is Active',
                body: 'ASCAP, BMI, and Songtrust registrations are in place across the catalog. Live streaming royalties accumulate daily. A backer is entering a business with real PRO income in the pipeline.',
              },
              {
                icon: <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />,
                heading: 'Structured IP — Not a Side Project',
                body: "G Putnam Music LLC is the operating entity. Revenue-split structures are documented. 90% of artist revenues flow to artists. The Founder's policy is published and permanent. This is a real company with a real deal on the table.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-black/40 border border-white/5 rounded-xl p-5">
                {item.icon}
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{item.heading}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DIRECT PURCHASE CTA
          ═══════════════════════════════════════════ */}
      <section className="bg-black py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block bg-gradient-to-b from-[#1a1200] to-black border border-yellow-400/30 rounded-3xl p-8 w-full">
            <div className="text-yellow-400 text-xs font-black tracking-widest uppercase mb-2">
              One-Time Purchase
            </div>
            <div className="text-5xl font-black text-white mb-1">$3,300</div>
            <div className="text-yellow-200 text-sm mb-6">Historic K-KUTs Locket — Makes History</div>

            <ul className="text-left space-y-2 mb-8">
              {[
                'Physical Historic K-KUTs Locket — delivered by March 31, 2026',
                'Full lifetime access to GPM frequency archive',
                '2 patent-pending inventions included in ownership',
                'VIP studio sessions with G Putnam Music',
                'Historic holder inner circle — permanent',
                'Digital certificate of authenticity',
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={HISTORIC_STRIPE}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black py-4 rounded-2xl text-lg hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-500/20 transition-all text-center"
            >
              Secure This Historic Locket
            </a>

            <p className="text-gray-500 text-xs mt-4">
              Stripe-secured checkout. One-time payment. No subscription.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INQUIRY FORM — SERIOUS BACKERS / LICENSORS
          ═══════════════════════════════════════════ */}
      <section id="inquire" className="bg-[#080808] py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-2 text-center">
            Serious Inquiry
          </h2>
          <p className="text-center text-gray-400 mb-10 max-w-lg mx-auto text-sm">
            Licensing, acquisition, institutional investment, sync partnership —
            use this form. All inquiries go directly to the Founder.
          </p>

          {submitted ? (
            <div className="text-center bg-green-900/30 border border-green-500/30 rounded-2xl p-8">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Inquiry Received</h3>
              <p className="text-gray-400 text-sm">
                The Founder will respond directly. Thank you for your interest in HISTOR™.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  placeholder="Your company or fund name"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">
                  Inquiry Type *
                </label>
                <select
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as InquiryForm['type'] })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition-colors"
                >
                  <option value="investor">Investor / Backer</option>
                  <option value="licensor">Licensing Partner</option>
                  <option value="acquisition">IP Acquisition</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors resize-none"
                  placeholder="Describe your interest in HISTOR™ — investment size, deal structure, or any questions for the Founder."
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm flex items-start gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black py-4 rounded-2xl text-base hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Inquiry to Founder
                  </>
                )}
              </button>

              <p className="text-center text-gray-600 text-xs">
                All inquiries handled by Greg Putnam, Founder — G Putnam Music LLC
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
