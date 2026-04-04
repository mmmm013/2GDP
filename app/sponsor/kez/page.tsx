import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KEZ Sponsor Tier — Support Michael Scherer | G Putnam Music',
  description:
    'Become a KEZ Sponsor and directly support Michael D. Scherer — GPM songwriter & artist. The KEZ tier (Keys for a keyboard) funds Michael\'s originals, co-writes, and recordings.',
  openGraph: {
    title: 'KEZ Sponsor — Support Michael Scherer',
    description:
      'Back Michael D. Scherer directly with a KEZ sponsorship. Keys for a keyboard — fund the music.',
    url: 'https://gputnammusic.com/sponsor/kez',
  },
};

const PERKS = [
  { icon: '🎹', label: 'KEZ Keys badge on your profile' },
  { icon: '🎵', label: 'Early access to new MSJ releases & co-writes' },
  { icon: '💌', label: 'Private sponsor newsletter from Michael' },
  { icon: '🎁', label: 'Monthly K-KUT gift drop' },
  { icon: '📣', label: 'Name in MSJ release credits (annual sponsors)' },
  { icon: '🏆', label: 'Awesome Squad member recognition' },
];

export default function KezSponsorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto space-y-12">

          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="text-6xl">🎹</div>
            <h1 className="text-4xl font-bold text-amber-400">KEZ Sponsor</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              The <strong className="text-amber-300">KEZ</strong> tier — Keys for a keyboard —
              is Michael D. Scherer&apos;s exclusive sponsor program. Your support flows directly
              to Michael, his family, and his continued work as a songwriter and GPM artist.
            </p>
          </div>

          {/* Revenue policy note */}
          <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl px-6 py-4 text-sm text-blue-200">
            <strong className="text-blue-300">Founder&apos;s standing directive:</strong>{' '}
            90% of all G Putnam Music artist &amp; publisher revenues bearing Michael D. Scherer&apos;s
            name flows to Michael, his wife, and kids — until no longer needed.
            KEZ sponsorships honour and amplify that commitment.
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
                href="mailto:Gputnam@gputnammusic.com?subject=KEZ Sponsor Inquiry"
                className="text-amber-400 underline hover:text-white"
              >
                Gputnam@gputnammusic.com
              </a>{' '}
              with subject <em>KEZ Sponsor Inquiry</em>.
            </p>
            <Link
              href="/scherer"
              className="inline-block mt-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full transition-colors"
            >
              Visit Michael&apos;s Page
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
