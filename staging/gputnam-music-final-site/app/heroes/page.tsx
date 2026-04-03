import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Heroes | G Putnam Music',
  description: 'GPM Heroes — the inspirations, champions, and supporters behind G Putnam Music.',
};

export default function HeroesPage() {
  return (
    <div className="min-h-screen bg-[#1a1207] text-[#F5e6c8]">
      <header className="sticky top-0 z-50 bg-[#1a1207]/95 border-b border-[#D4A017]/30 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gpm_logo.jpg" alt="GPM" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-[#D4A017] font-bold text-lg hidden sm:block">G Putnam Music</span>
        </Link>
        <Link href="/" className="text-sm text-[#D4A017] hover:underline">← Home</Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#D4A017] mb-2">Heroes</h1>
        <p className="text-[#F5e6c8]/70 mb-10">
          The people, the music, and the moments that shaped G Putnam Music.
        </p>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
            <h2 className="text-xl font-bold text-[#D4A017] mb-3">Michael Scherer — KEZ PLZ</h2>
            <p className="text-[#F5e6c8]/80 leading-relaxed">
              A deeply soulful person and devout believer. Pianist, performer, and songwriter.
              A husband and father of three daughters — a true hero of the music. G Putnam donates
              most publishing on originals and all of both sides on co-writes.
              His sponsor tier is <strong className="text-[#D4A017]">KEZ</strong> — Keys for a Keyboard.
            </p>
          </section>

          <section className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
            <h2 className="text-xl font-bold text-[#D4A017] mb-3">KLEIGH — The Legacy</h2>
            <p className="text-[#F5e6c8]/80 leading-relaxed">
              Michael Clay / Clayton Michael Gunn — vocalist, songwriter, pianist, and visual artist.
              His journey, his art, and his voice are the heartbeat of the GPM catalog.
              His sponsor tier is <strong className="text-[#D4A017]">KUB</strong>, tied to the koala promo.
            </p>
          </section>

          <section className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
            <h2 className="text-xl font-bold text-[#D4A017] mb-3">The Listeners</h2>
            <p className="text-[#F5e6c8]/80 leading-relaxed">
              Every stream, every share, every moment someone lets GPM music carry them — these are
              the true heroes. Dream The Stream.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#D4A017]/20 py-6 text-center text-xs text-[#F5e6c8]/40 mt-16">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}
