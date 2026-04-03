import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | G Putnam Music',
  description: 'G Putnam Music Privacy Policy — how we handle your data.',
};

export default function PrivacyPage() {
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

      <main className="max-w-2xl mx-auto px-4 py-12 prose prose-invert prose-amber">
        <h1 className="text-4xl font-bold text-[#D4A017] mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-[#F5e6c8]/80 text-sm leading-relaxed">
          <p><strong className="text-[#D4A017]">Effective Date:</strong> January 1, 2025</p>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">1. Information We Collect</h2>
            <p>
              G Putnam Music, LLC (&quot;GPM&quot;, &quot;we&quot;, &quot;us&quot;) collects minimal data to operate
              gputnammusic.com. We may collect anonymous usage statistics (page views, streaming
              activity) to improve the platform. We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">2. Streaming & Audio</h2>
            <p>
              Audio streaming is served via Supabase Storage. No personally identifiable information
              is required to stream. Play counts are recorded anonymously.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">3. Creator Portal</h2>
            <p>
              The Creator Portal uses WebAuthn (biometric authentication) for access. No passwords
              are stored. Session tokens are short-lived (4 hours) and stored in HttpOnly cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">4. Third-Party Services</h2>
            <p>
              We use Supabase (data & storage) and Vercel (hosting). Each operates under their
              own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#D4A017] mb-2">5. Contact</h2>
            <p>
              For privacy inquiries, visit our <Link href="/contact" className="text-[#D4A017] hover:underline">Contact</Link> page.
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
