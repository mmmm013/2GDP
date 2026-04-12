import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | G Putnam Music',
  description: 'G Putnam Music Terms of Use — streaming, licensing, and platform terms.',
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-[#D4A017] mb-8">Terms of Use</h1>

        <div className="space-y-6 text-[#F5e6c8]/80 text-sm leading-relaxed">
          <p><strong className="text-[#D4A017]">Effective Date:</strong> January 1, 2025</p>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">1. Acceptance</h2>
            <p>
              By accessing gputnammusic.com, you agree to these Terms of Use. If you do not agree,
              please do not use this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">2. Music &amp; Content</h2>
            <p>
              All music, lyrics, artwork, and content on this platform are the property of
              G Putnam Music, LLC or the respective artists. Streaming is for personal, non-commercial
              use only. No downloading, reproduction, or redistribution without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">3. Licensing</h2>
            <p>
              For sync licensing, commercial use, or any reproduction rights, contact GPM through
              our <Link href="/contact" className="text-[#D4A017] hover:underline">Contact</Link> page.
              ASCAP registration governs all public performance rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">4. Creator Portal</h2>
            <p>
              Access to the Creator Portal is restricted to authorized GPM Kreators. Unauthorized
              access attempts are prohibited and may be subject to legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">5. Limitation of Liability</h2>
            <p>
              GPM provides this platform &quot;as is.&quot; We are not liable for any damages arising
              from use of the platform, service interruptions, or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">6. Changes</h2>
            <p>
              We may update these Terms at any time. Continued use of the platform constitutes
              acceptance of updated Terms.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#D4A017]/20 py-6 text-center text-xs text-[#F5e6c8]/40 mt-8">
        © {new Date().getFullYear()} G Putnam Music, LLC — Dream The Stream
      </footer>
    </div>
  );
}
