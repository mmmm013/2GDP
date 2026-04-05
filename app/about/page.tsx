import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How K-KUT Works | G Putnam Music',
  description: 'Quick explainer for K-KUTs, mini-KUTs, and K-kUpId with a bot-readable endpoint.',
  alternates: {
    canonical: '/about',
  },
};

const scriptLines = [
  'You know that one moment in a song - the hook that wrecks you?',
  'We call that the Sweet Spot. And we built a way to gift it.',
  'A K-KUT is a 6-character link - short enough to text - that opens a curated excerpt of a G Putnam Music track. No app. No account. Just tap and hear it.',
  'A mini-KUT, or mKUT, goes further. It streams a specific verse, bridge, or chorus - the exact moment, packaged.',
  'K-kUpId is the gifting layer. Pick a song. Choose your moment. Generate a link, then share it instantly as a complete digital experience.',
  'Music has always been the best gift. Now you can send exactly the right note.',
];

const botNames = ['MC-BOT', 'LF-BOT', 'GD-BOT', 'PIXIE-BOT'];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#12080c] via-[#1a0c12] to-black text-[#ffe9ef]">
      <Header />

      <section className="max-w-4xl mx-auto px-4 pt-24 pb-14">
        <p className="inline-block text-[11px] uppercase tracking-[0.35em] text-[#f1a8bb] border border-[#f1a8bb]/30 rounded-full px-4 py-1">
          Quick Guide
        </p>
        <h1 className="mt-5 text-4xl md:text-6xl font-black leading-tight">
          K-KUTs, mini-KUTs, and K-kUpId
        </h1>
        <p className="mt-4 text-[#ffdbe4]/80 text-lg max-w-2xl">
          A short user explainer with bot-readable access.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="rounded-3xl border border-[#f3a9bc]/25 bg-[#1b0b12]/70 p-6 md:p-8 shadow-[0_20px_60px_rgba(219,64,107,0.25)]">
          <h2 className="text-2xl font-bold mb-3">Brief Video Script (75s)</h2>
          <p className="text-[#ffd5e0]/70 text-sm mb-6">
            Use this exact sequence for your recording voiceover.
          </p>
          <ol className="space-y-3 text-[#ffe9ef]/90">
            {scriptLines.map((line, index) => (
              <li key={line} className="flex gap-3">
                <span className="text-[#f3a9bc] font-bold w-6 shrink-0">{index + 1}.</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-[#8dc8ff]/25 bg-[#0d1822]/60 p-5 md:p-6">
          <h3 className="text-xl font-bold text-[#bfe2ff]">Bot Access Endpoint</h3>
          <p className="mt-2 text-sm text-[#d1ebff]/75">
            Public JSON for bots, assistants, and integrations.
          </p>
          <p className="mt-2 text-xs text-[#9fd5ff]/85">
            Known bots: {botNames.join(', ')}
          </p>
          <code className="block mt-3 text-xs md:text-sm text-[#9fd5ff] break-all">
            /api/public/kkut-guide
          </code>
          <code className="block mt-2 text-xs md:text-sm text-[#9fd5ff] break-all">
            /api/public/kkut-guide?bot=MC-BOT
          </code>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/api/public/kkut-guide"
              className="px-4 py-2 rounded-lg bg-[#44a5ff]/20 border border-[#44a5ff]/35 text-[#bfe2ff] text-sm font-semibold hover:bg-[#44a5ff]/30"
            >
              Open JSON
            </Link>
            <Link
              href="/kkut/create"
              className="px-4 py-2 rounded-lg bg-[#f3a9bc]/20 border border-[#f3a9bc]/35 text-[#ffdce5] text-sm font-semibold hover:bg-[#f3a9bc]/30"
            >
              Create a K-KUT
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
