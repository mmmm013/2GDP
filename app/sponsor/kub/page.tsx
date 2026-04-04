import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KUB Sponsor Tier — Support KLEIGH | G Putnam Music',
  description:
    'Become a KUB Sponsor and directly support KLEIGH — G Putnam Music\'s signature artist. The KUB tier is tied to the KLEIGH koala promo. Your support funds originals, recordings, and catalog growth.',
  openGraph: {
    title: 'KUB Sponsor — Support KLEIGH',
    description:
      'Back KLEIGH directly with a KUB sponsorship. Tied to GPM\'s koala promo campaign.',
    url: 'https://gputnammusic.com/sponsor/kub',
  },
};

const PERKS = [
  { icon: '🐨', label: 'KUB Koala badge on your profile' },
  { icon: '🎵', label: 'Early access to new KLEIGH releases' },
  { icon: '💌', label: 'Private sponsor newsletter' },
  { icon: '🎁', label: 'Monthly K-KUT gift drop' },
  { icon: '📣', label: 'Name in KLEIGH release credits (annual sponsors)' },
];

export default function KubSponsorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto space-y-12">

          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="text-6xl">🐨</div>
            <h1 className="text-4xl font-bold text-amber-400">KUB Sponsor</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              The <strong className="text-amber-300">KUB</strong> tier is KLEIGH&apos;s exclusive
              sponsor program — built around the GPM koala promo campaign. Back the music,
              back the artist, join the crew.
            </p>
          </div>

          {/* Perks */}
          <div className="bg-gray-900/60 border border-amber-900/40 rounded-2xl p-8 space-y-4">
            <h2 className="text-xl font-semibold text-amber-300">What you get</h2>
            <ul className="space-y-3">
              {PERKS.map((p) => (
                <li key={p.label} className="flex items-center gap-3 text-gray-200">
                  <span className="text-2xl">{p.icon}</span>
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Stripe payment link coming soon. To inquire now, email{' '}
              <a
                href="mailto:Gputnam@gputnammusic.com?subject=KUB Sponsor Inquiry"
                className="text-amber-400 underline hover:text-white"
              >
                Gputnam@gputnammusic.com
              </a>{' '}
              with subject <em>KUB Sponsor Inquiry</em>.
            </p>
            <Link
              href="/kleigh"
              className="inline-block mt-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full transition-colors"
            >
              Visit KLEIGH&apos;s Page
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
