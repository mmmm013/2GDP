import { CENTRAL_IL_INDUSTRIES, BIZ_TIERS } from '../lib/4pe-engine';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1200] via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase mb-4">
            GPEx Business
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-none">
            Excel
            <sup className="text-[#D4AF37] text-3xl md:text-4xl font-bold align-super">A</sup>
            rator
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-2">
            4PE-BIZ Platform — Central Illinois Industry Acceleration
          </p>
          <p className="text-sm text-gray-600 mb-10">
            Process · People · Platform · Profit
          </p>
          <a
            href="#tiers"
            className="inline-block bg-[#D4AF37] text-black font-bold px-10 py-4 text-sm tracking-widest uppercase hover:bg-yellow-400 transition-colors"
          >
            Get Accelerated
          </a>
        </div>
      </section>

      {/* ── 4PE PILLARS ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#111]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase text-center mb-12">
            The 4PE Framework
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Process',  desc: 'Standardize & systematize every workflow' },
              { label: 'People',   desc: 'Workforce alignment & culture accountability' },
              { label: 'Platform', desc: 'Technology stack + data infrastructure' },
              { label: 'Profit',   desc: 'Revenue model & cost optimization' },
            ].map((p) => (
              <div key={p.label} className="border border-[#2D2D2D] p-6 text-center hover:border-[#D4AF37] transition-colors">
                <div className="text-[#D4AF37] font-black text-xl mb-2">{p.label}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase text-center mb-4">
            Top 10 Central IL Industries
          </h2>
          <p className="text-center text-gray-600 text-sm mb-12">
            The Excel-A-rator is calibrated for each vertical.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(CENTRAL_IL_INDUSTRIES).map(([key, label]) => (
              <div
                key={key}
                className="border border-[#1A1A1A] px-5 py-4 text-sm text-gray-400 hover:border-[#D4AF37] hover:text-white transition-colors"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIERS ────────────────────────────────────────────────────── */}
      <section id="tiers" className="py-24 px-6 bg-[#111]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.3em] text-[#D4AF37] uppercase text-center mb-12">
            Platform Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BIZ_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`border p-8 flex flex-col ${
                  tier.id === 'accelerator'
                    ? 'border-[#D4AF37]'
                    : 'border-[#2D2D2D]'
                }`}
              >
                <div className="mb-1">
                  <span className="text-[10px] tracking-widest text-gray-600 uppercase">
                    {tier.costType}
                  </span>
                </div>
                <h3 className="text-[#D4AF37] font-black text-lg mb-1">{tier.label}</h3>
                <p className="text-gray-500 text-xs mb-6">{tier.tagline}</p>
                <div className="text-2xl font-bold mb-6">
                  {tier.priceMonthly > 0 ? (
                    <>${tier.priceMonthly}<span className="text-sm text-gray-500">/mo</span></>
                  ) : (
                    <span className="text-base text-gray-400">Contract-based</span>
                  )}
                </div>
                <ul className="space-y-2 text-xs text-gray-400 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a
                    href="mailto:ops@gpex.biz"
                    className="block text-center border border-[#D4AF37] text-[#D4AF37] text-xs font-bold tracking-widest uppercase py-3 hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    {tier.costType === 'wholesale' ? 'Partner Inquiry' : 'Start Now'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KUT / KKr BUNDLE NOTICE ──────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest text-[#D4AF37] uppercase mb-3">Included in Every Tier</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            KUTs (K-KUTs + mini-KUTs) and KKr modules are bundled into all 4PE-BIZ platforms.
            Music business domain assets stay within the GPM ecosystem — the Excel-A-rator
            applies GPM-proven process frameworks to Central IL industry verticals.
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-[#1A1A1A] text-center">
        <p className="text-gray-700 text-xs">
          © {new Date().getFullYear()} GPEx Business — Excel-A-rator · A GPEx (Groom Process Excellarators) Platform ·{' '}
          <a href="https://www.gputnammusic.com" className="hover:text-[#D4AF37] transition-colors" target="_blank" rel="noreferrer">
            gputnammusic.com ↗
          </a>
        </p>
      </footer>

    </main>
  );
}
