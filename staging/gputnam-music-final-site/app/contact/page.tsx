import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact | G Putnam Music',
  description: 'Contact G Putnam Music — licensing, sync, artist inquiries, and support.',
};

export default function ContactPage() {
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

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#D4A017] mb-2">Contact</h1>
        <p className="text-[#F5e6c8]/70 mb-10">
          Licensing, sync, artist inquiries, and support — we&apos;re here.
        </p>

        <div className="space-y-6">
          <div className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
            <h2 className="text-lg font-bold text-[#D4A017] mb-3">Licensing &amp; Sync</h2>
            <p className="text-[#F5e6c8]/80 text-sm leading-relaxed">
              For music licensing, sync placement, and commercial inquiries, reach out via
              the GPM commercial catalog portal (GPMCC).
            </p>
          </div>

          <div className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
            <h2 className="text-lg font-bold text-[#D4A017] mb-3">Artist Portal</h2>
            <p className="text-[#F5e6c8]/80 text-sm leading-relaxed mb-4">
              GPM Kreators can access their secure portal for uploads, campaign management,
              and asset delivery.
            </p>
            <Link
              href="/creator/enroll"
              className="text-[#D4A017] text-sm hover:underline"
            >
              Creator Enrollment →
            </Link>
          </div>

          <div className="rounded-xl border border-[#D4A017]/30 bg-[#2a1e0a] p-6">
            <h2 className="text-lg font-bold text-[#D4A017] mb-3">General Inquiries</h2>
            <p className="text-[#F5e6c8]/80 text-sm leading-relaxed">
              G Putnam Music, LLC<br />
              <span className="text-[#F5e6c8]/50">Dream The Stream — The One Stop Song Shop</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#D4A017]/20 py-6 text-center text-xs text-[#F5e6c8]/40 mt-8">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}
