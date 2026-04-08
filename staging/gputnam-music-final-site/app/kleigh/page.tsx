import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KLEIGH | G Putnam Music',
  description:
    'KLEIGH — vocalist, songwriter, pianist, and visual artist. The Legacy Collection. KUB sponsor tier. G Putnam Music.',
};

export default function KleighPage() {
  return (
    <div className="min-h-screen bg-[#1a1207] text-[#F5e6c8]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1207]/95 border-b border-[#D4A017]/30 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gpm_logo.jpg" alt="GPM" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-[#D4A017] font-bold text-lg hidden sm:block">G Putnam Music</span>
        </Link>
        <Link href="/" className="text-sm text-[#D4A017] hover:underline">← Home</Link>
      </header>

      {/* Hero */}
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden bg-gradient-to-b from-[#2a1e0a] to-[#1a1207]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#C8A882]/5 blur-3xl rounded-full" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#C8A882]/60 mb-4">
          G Putnam Music — Artist
        </p>
        <div className="text-6xl mb-4">🎸</div>
        <h1 className="text-4xl md:text-6xl font-black text-[#F5e6c8] mb-2 leading-none">
          <span className="text-[#C8A882]">KLEIGH</span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#F5e6c8]/50 mb-4">
          Vocalist · Songwriter · Pianist · Visual Artist
        </p>
        <p className="max-w-xl mx-auto text-[#F5e6c8]/70 text-sm leading-relaxed">
          Michael Clay — known as Clayton Michael Gunn — has poured a lifetime of art
          into music, canvas, and story. His voice, his vision, and his catalog form
          the heartbeat of The Legacy Collection at GPM.
        </p>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* The Legacy Collection */}
        <section className="rounded-xl border border-[#C8A882]/30 bg-[#2a1e0a] p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h2 className="text-xl font-bold text-[#C8A882]">The Legacy Collection</h2>
            <span className="text-xs bg-[#D4A017]/20 text-[#D4A017] px-2 py-0.5 rounded-full border border-[#D4A017]/40 shrink-0">
              KUB
            </span>
          </div>
          <p className="text-[#F5e6c8]/80 leading-relaxed text-sm">
            The Legacy Collection is the full KLEIGH catalog — originals, co-writes, and
            select covers — curated for streaming, sync licensing, and the GPM platform.
            KLEIGH&apos;s sponsor tier is <strong className="text-[#D4A017]">KUB</strong>, tied to the koala promo.
            Every purchase and stream supports KLEIGH directly through the G Putnam Music profit-share model.
          </p>
        </section>

        {/* Artist Background */}
        <section className="rounded-xl border border-[#C8A882]/30 bg-[#2a1e0a] p-6">
          <h2 className="text-xl font-bold text-[#C8A882] mb-3">The Artist</h2>
          <p className="text-[#F5e6c8]/80 leading-relaxed text-sm mb-3">
            KLEIGH performs under the legal name Michael Clay / Clayton Michael Gunn.
            A multi-disciplinary artist — vocalist, songwriter, pianist, and visual artist —
            he brings a rare combination of raw emotional range and technical craft to every track.
          </p>
          <p className="text-[#F5e6c8]/70 leading-relaxed text-sm">
            His journey, his art, and his voice are the heartbeat of the GPM catalog.
            KLEIGH works alongside G Putnam and The Awesome Squad in the studio and on stage.
          </p>
        </section>

        {/* Stream */}
        <section className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
          <h2 className="text-xl font-bold text-[#D4A017] mb-3">🎵 Stream KLEIGH</h2>
          <p className="text-[#F5e6c8]/80 leading-relaxed text-sm mb-5">
            KLEIGH tracks stream on gputnammusic.com. Hit play on the featured player on the home
            page — KLEIGH&apos;s Legacy Collection is in the rotation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="bg-[#D4A017] text-[#1a1207] font-black text-sm px-6 py-3 rounded-full uppercase tracking-wider hover:bg-[#e8b520] transition-colors text-center"
            >
              ▶ Stream Now →
            </Link>
            <Link
              href="/artists"
              className="bg-[#C8A882]/10 border border-[#C8A882]/40 text-[#C8A882] font-bold text-sm px-6 py-3 rounded-full uppercase tracking-wider hover:bg-[#C8A882]/20 transition-colors text-center"
            >
              All Artists →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#D4A017]/20 py-6 text-center text-xs text-[#F5e6c8]/40 mt-8">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}
