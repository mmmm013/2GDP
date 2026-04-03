import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Join | G Putnam Music',
  description: 'Join the G Putnam Music community — become a supporter, sponsor, or streaming member.',
};

export default function JoinPage() {
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

      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-[#D4A017] mb-4">Join GPM</h1>
        <p className="text-[#F5e6c8]/80 text-lg mb-10 leading-relaxed">
          Dream The Stream. Support the music. Become part of the G Putnam Music community.
        </p>

        <div className="space-y-6 text-left">
          <div className="rounded-xl border border-[#D4A017]/50 bg-[#2a1e0a] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#D4A017]">KUB — KLEIGH Sponsor</h2>
              <span className="text-xs bg-[#D4A017]/20 text-[#D4A017] px-2 py-1 rounded-full border border-[#D4A017]/40">🐨 Koala</span>
            </div>
            <p className="text-[#F5e6c8]/80 text-sm leading-relaxed">
              Support KLEIGH&apos;s legacy catalog. KUB sponsors help preserve and expand the KLEIGH
              Collection — tied to the GPM koala promo.
            </p>
          </div>

          <div className="rounded-xl border border-[#D4A017]/50 bg-[#2a1e0a] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#D4A017]">KEZ — Michael Scherer Sponsor</h2>
              <span className="text-xs bg-[#D4A017]/20 text-[#D4A017] px-2 py-1 rounded-full border border-[#D4A017]/40">🎹 Keys</span>
            </div>
            <p className="text-[#F5e6c8]/80 text-sm leading-relaxed">
              KEZ PLZ — Keys for a Keyboard. Support Michael Scherer and his family through the
              KEZ campaign. A devout believer, a father of three, a soul the music needs.
            </p>
          </div>

          <div className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
            <h2 className="text-xl font-bold text-[#D4A017] mb-3">Stream & Support</h2>
            <p className="text-[#F5e6c8]/80 text-sm leading-relaxed">
              Every stream counts. Turn on the GPM Featured Playlist and let the music play —
              that&apos;s the most direct way to support the artists you love.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 bg-[#D4A017] text-[#1a1207] font-bold px-6 py-2 rounded-full text-sm hover:bg-[#e8b520] transition-colors"
            >
              Stream Now →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#D4A017]/20 py-6 text-center text-xs text-[#F5e6c8]/40 mt-12">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}
