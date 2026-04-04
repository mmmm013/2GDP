import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import InventionBadge from '@/components/InventionBadge';

export const metadata: Metadata = {
  title: 'GPM Music Inventions — Patent Pending | G Putnam Music',
  description:
    'G Putnam Music LLC introduces two USPTO patent-pending music inventions: the K-KUT Sweet Spot Link System and the K-kUpId Frequency Gifting System. Licensing inquiries welcome.',
  openGraph: {
    title: 'GPM Music Inventions — Patent Pending',
    description:
      'Two patent-pending music inventions by G Putnam Music LLC — a new way to carry, share, and gift music.',
    url: 'https://gputnammusic.com/inventions',
  },
};

export default function InventionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-10 px-4 text-center">
        <InventionBadge size="lg" className="mx-auto mb-5" />
        <h1 className="text-4xl md:text-6xl font-black text-[#C8A882] mb-3 leading-tight">
          GPM Music Inventions
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
          G Putnam Music, LLC has introduced two patent-pending music inventions filed with the
          United States Patent and Trademark Office (USPTO). These inventions represent a
          fundamentally new way to capture, carry, and gift the emotional Sweet Spot of a song.
        </p>
      </section>

      {/* ── USPTO Disclosure ────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-12 space-y-10">

        {/* Invention 1 */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl" role="img" aria-label="music note">🎵</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400/80 mb-1">
                Invention No. 1 · USPTO Patent Pending
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                K-KUT Sweet Spot Link System
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-white/70 text-sm leading-relaxed">
            <p>
              The K-KUT system is a novel method for identifying, encoding, and delivering a
              curated time-bounded highlight segment (the &ldquo;Sweet Spot&rdquo;) of a musical
              composition, paired to a physical or digital artifact (locket, charm, QR-coded
              token) that stores and activates the associated audio experience on demand.
            </p>
            <p>
              Unlike traditional download or streaming systems, the K-KUT invention encodes up to
              three (3) pre-selected Optimum Sweet Spots per track — as well as a custom-selectable
              Sweet Spot of up to 1 minute 30 seconds chosen by the purchaser — into a unique
              6-character alphanumeric code (the &ldquo;K-KUT Code&rdquo;) that resolves to a
              playable experience at <code className="text-amber-300 bg-amber-500/10 px-1 rounded">kkupid.com/k/[code]</code>.
            </p>
            <p>
              The physical artifact (locket, enamel charm, or jewelry piece) bearing the K-KUT Code
              functions as both a wearable memento and an access token to the music experience,
              creating a new category of &ldquo;Emotional Jewelry&rdquo; not previously described
              in the prior art.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['Sweet Spot Encoding', 'Physical Music Token', 'Emotional Jewelry', '6-char Access Code', '3 Optimum Spots + Custom'].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/kupid"
              className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Experience K-KUTs &rarr;
            </Link>
          </div>
        </div>

        {/* Invention 2 */}
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl" role="img" aria-label="gift">💝</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-400/80 mb-1">
                Invention No. 2 · USPTO Patent Pending
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                K-kUpId Frequency Gifting System
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-white/70 text-sm leading-relaxed">
            <p>
              The K-kUpId system is a novel digital gifting protocol that enables any user to
              encapsulate a frequency-matched music experience (a K-KUT or mini-KUT) inside a
              shareable digital container (the &ldquo;K-kUpId&rdquo;) that can be transmitted
              via SMS, social media, email, or embedded in a physical jewelry capsule.
            </p>
            <p>
              The invention describes the method of: (1) selecting a music excerpt and assigning
              it a personal frequency mood profile; (2) binding that profile to a unique recipient
              token; (3) delivering the token through multiple channels; and (4) resolving the
              token to an immersive, personalized audio experience — all without requiring the
              recipient to have an existing account or application installed.
            </p>
            <p>
              This frictionless gifting path distinguishes the K-kUpId system from conventional
              gift-card, download-code, or streaming-share systems currently described in prior art.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['Frequency Gifting', 'Shareable Token', 'Frictionless Delivery', 'Mood Profile Binding', 'Multi-channel Transmit'].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/25">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/gift"
              className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Try K-kUpId Gifting &rarr;
            </Link>
          </div>
        </div>

        {/* Trademarks */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white mb-3">Trademarks</h2>
          <p className="text-white/60 text-sm mb-4">
            G Putnam Music, LLC holds three (3) registered or pending trademarks associated with
            the GPM inventions ecosystem:
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            {['K-KUTs™', 'K-kUpId™', 'Sweet Spot™ (music context)'].map((tm) => (
              <li key={tm} className="flex items-center gap-2">
                <span className="text-amber-400">™</span>
                <span>{tm}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Licensing Inquiry */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Licensing Inquiries</h2>
          <p className="text-white/60 text-sm mb-5 max-w-xl mx-auto">
            G Putnam Music, LLC welcomes inquiries from music technology companies, jewelry
            brands, gifting platforms, and entertainment companies interested in licensing the
            K-KUT or K-kUpId systems. Please use the contact form and reference &ldquo;Invention
            Licensing&rdquo; in your subject line.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-block px-7 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors"
            >
              Contact for Licensing &rarr;
            </Link>
            <Link
              href="/kupid"
              className="inline-block px-7 py-3 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Purchase K-KUTs
            </Link>
          </div>
        </div>

        {/* Legal notice */}
        <p className="text-center text-xs text-white/30 leading-relaxed max-w-2xl mx-auto">
          &ldquo;Patent Pending&rdquo; indicates that a patent application has been filed with the
          United States Patent and Trademark Office (USPTO). Rights and protections are subject
          to the outcome of the pending application. K-KUTs™, K-kUpId™ and Sweet Spot™ are
          trademarks of G Putnam Music, LLC. Unauthorized use is prohibited.
        </p>
      </section>

      <Footer />
    </main>
  );
}
