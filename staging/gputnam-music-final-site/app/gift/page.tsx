import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gift | G Putnam Music',
  description: 'GPM Free Gift — K-KUTs, mini-KUTs, and K-kUpIds. Dream The Stream.',
};

export default function GiftPage() {
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
        <div className="text-6xl mb-6">🎁</div>
        <h1 className="text-4xl font-bold text-[#D4A017] mb-4">GPM Free Gift</h1>
        <p className="text-[#F5e6c8]/80 text-lg mb-8 leading-relaxed">
          Every hour, a free gift drops for GPM listeners — K-KUTs, mini-KUTs, and K-kUpIds.
          Gifts are regional, never historic cost-items, and always under $50.
        </p>

        <div className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-8 mb-8">
          <h2 className="text-xl font-bold text-[#D4A017] mb-4">Gift Drop Schedule</h2>
          <div className="grid grid-cols-2 gap-3 text-sm text-left">
            {[
              { region: '🇺🇸 US', times: '14:00 · 18:00 · 22:00 UTC' },
              { region: '🇨🇦 CA', times: '15:00 · 19:00 · 23:00 UTC' },
              { region: '🇬🇧 UK', times: '08:00 · 12:00 · 17:00 UTC' },
              { region: '🇦🇺 AUS', times: '00:00 · 04:00 · 21:00 UTC' },
              { region: '🇨🇳 CN', times: '01:00 · 05:00 · 09:00 UTC' },
              { region: '🌍 GLOBAL', times: 'Random 9h window' },
            ].map(({ region, times }) => (
              <div key={region} className="bg-[#1a1207]/60 rounded-lg p-3">
                <div className="font-bold text-[#D4A017]">{region}</div>
                <div className="text-[#F5e6c8]/60 text-xs mt-1">{times}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6 text-left">
          <h2 className="text-xl font-bold text-[#D4A017] mb-3">Gift Priority</h2>
          <ol className="space-y-2 text-[#F5e6c8]/80">
            <li className="flex items-center gap-3"><span className="text-[#D4A017] font-bold">1.</span> K-KUT</li>
            <li className="flex items-center gap-3"><span className="text-[#D4A017] font-bold">2.</span> mini-KUT</li>
            <li className="flex items-center gap-3"><span className="text-[#D4A017] font-bold">3.</span> K-kUpId</li>
          </ol>
        </div>

        <p className="text-[#F5e6c8]/40 text-sm mt-8">
          Gifts auto-distribute on the hour. Check back often — Dream The Stream.
        </p>
      </main>

      <footer className="border-t border-[#D4A017]/20 py-6 text-center text-xs text-[#F5e6c8]/40">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}
