import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Artists | G Putnam Music',
  description: 'GPM Artists — KLEIGH, Michael Scherer, Zach Garrett, Lloyd G Miller, PIXIE and the full G Putnam Music roster.',
};

const ARTISTS = [
  {
    slug: 'kleigh',
    name: 'KLEIGH',
    legalName: 'Michael Clay / Clayton Michael Gunn',
    role: 'Vocalist · Songwriter · Pianist · Visual Artist',
    tagline: 'The Legacy Collection',
    sponsor: 'KUB',
  },
  {
    slug: 'msj',
    name: 'Michael Scherer',
    legalName: 'Michael Scherer',
    role: 'Pianist · Performer · Songwriter — The Awesome Squad',
    tagline: 'KEZ PLZ — Keys for a Keyboard',
    sponsor: 'KEZ',
  },
  {
    slug: 'zg',
    name: 'Zach Garrett',
    legalName: 'Zach Garrett',
    role: 'Songwriter · GPN Vocalist — The Awesome Squad',
    tagline: 'The Awesome Squad',
    sponsor: null,
  },
  {
    slug: 'lgm',
    name: 'Lloyd G Miller',
    legalName: 'Lloyd G Miller',
    role: 'Visual Artist · Studio Owner',
    tagline: 'Studio & Canvas',
    sponsor: null,
  },
  {
    slug: 'pixie',
    name: 'PIXIE',
    legalName: 'Jane Burton',
    role: 'HERB BLOG Author · GPM FP Playlist Curator',
    tagline: "PIXIE's PIX — Herbal Gardening & Nature",
    sponsor: null,
  },
];

export default function ArtistsPage() {
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#D4A017] mb-2">Artists</h1>
        <p className="text-[#F5e6c8]/70 mb-10">The G Putnam Music creative roster — Kreators, vocalists, and collaborators.</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {ARTISTS.map((a) => (
            <div key={a.slug} className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6 hover:border-[#D4A017]/70 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-xl font-bold text-[#D4A017]">{a.name}</h2>
                {a.sponsor && (
                  <span className="text-xs bg-[#D4A017]/20 text-[#D4A017] px-2 py-0.5 rounded-full border border-[#D4A017]/40 shrink-0">
                    {a.sponsor}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#F5e6c8]/50 mb-1">{a.legalName}</p>
              <p className="text-sm text-[#F5e6c8]/80 mb-3">{a.role}</p>
              <p className="text-sm italic text-[#D4A017]/80">&ldquo;{a.tagline}&rdquo;</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#D4A017]/20 py-6 text-center text-xs text-[#F5e6c8]/40 mt-16">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}
