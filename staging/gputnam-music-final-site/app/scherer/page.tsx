import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Michael Scherer | G Putnam Music',
  description:
    'Michael Scherer — pianist, performer, songwriter, and hero of G Putnam Music. KEZ PLZ — Keys for a Keyboard. GPM MSJ Anthology.',
};

export default function SchererPage() {
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#D4A017]/5 blur-3xl rounded-full" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#D4A017]/60 mb-4">
          G Putnam Music — Artist
        </p>
        <div className="text-6xl mb-4">🎹</div>
        <h1 className="text-4xl md:text-6xl font-black text-[#F5e6c8] mb-2 leading-none">
          Michael<br /><span className="text-[#D4A017]">Scherer</span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#F5e6c8]/50 mb-4">
          Pianist · Performer · Songwriter
        </p>
        <p className="max-w-xl mx-auto text-[#F5e6c8]/70 text-sm leading-relaxed">
          A deeply soulful person and devout believer. Michael Scherer is the heart of The Awesome Squad —
          husband, father of three daughters, and one of the finest pianists in the room.
          G Putnam donates most publishing on originals and all of both sides on co-writes.
        </p>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* KEZ PLZ */}
        <section className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h2 className="text-xl font-bold text-[#D4A017]">KEZ PLZ — Keys for a Keyboard</h2>
            <span className="text-xs bg-[#D4A017]/20 text-[#D4A017] px-2 py-0.5 rounded-full border border-[#D4A017]/40 shrink-0">
              KEZ
            </span>
          </div>
          <p className="text-[#F5e6c8]/80 leading-relaxed text-sm">
            Michael&apos;s sponsor tier is <strong className="text-[#D4A017]">KEZ</strong> — Keys for a Keyboard.
            Sponsors at the KEZ tier directly fund a keyboard instrument for Michael&apos;s continued performance and teaching.
            Every KUT profit flows from G Putnam directly to Michael and his family — no middleman, no delay.
          </p>
        </section>

        {/* MSJ Anthology */}
        <section className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
          <h2 className="text-xl font-bold text-[#D4A017] mb-3">MSJ Anthology</h2>
          <p className="text-[#F5e6c8]/80 leading-relaxed text-sm mb-4">
            The MSJ TV Thoroughbreds catalog — Michael Scherer&apos;s commercially cleared
            recordings available for sync, licensing, and GPM streaming. Original compositions,
            co-writes with G Putnam, and select covers cleared for broadcast.
          </p>
          <Link
            href="/artists"
            className="inline-block text-sm text-[#D4A017] border border-[#D4A017]/40 px-4 py-2 rounded-lg hover:bg-[#D4A017]/10 transition-colors"
          >
            View Full Artist Roster →
          </Link>
        </section>

        {/* Support */}
        <section className="rounded-xl border border-[#4da6ff]/30 bg-[#0e2a4a]/50 p-6">
          <h2 className="text-xl font-bold text-[#4da6ff] mb-3">⚓ Support Michael</h2>
          <p className="text-[#F5e6c8]/80 leading-relaxed text-sm mb-5">
            Michael Scherer and his family are battling serious auto-immune illness.
            Devout. All-American. Kind as kind comes.
            Joining as a Ships Sponsor means your monthly contribution flows directly to Michael
            and his family — no overhead, no delay. You become a genuine partner in GPM.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/join"
              className="bg-[#4da6ff] text-[#0a1e35] font-black text-sm px-6 py-3 rounded-full uppercase tracking-wider hover:bg-[#7ec3ff] transition-colors text-center"
            >
              ⛵ Join Ships →
            </Link>
            <Link
              href="/"
              className="bg-[#D4A017]/10 border border-[#D4A017]/40 text-[#D4A017] font-bold text-sm px-6 py-3 rounded-full uppercase tracking-wider hover:bg-[#D4A017]/20 transition-colors text-center"
            >
              Stream Now →
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
