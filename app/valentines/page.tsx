import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import MakeupTracks from './MakeupTracks';
import { LOCKET_OPTIONS } from '@/lib/kupid-protocol';

export const metadata: Metadata = {
  title: "Valentine's Day Gifts | G Putnam Music",
  description: 'Send the gift of music this Valentine\'s Day. Heart-Tap digital gifts and K-KUTs Sovereign Lockets from G Putnam Music.',
};

const GIFT_OPTIONS = [
  {
    title: 'Quick Tap',
    price: '$1.99',
    description: '1 digital sticker or ringtone',
    href: '/gift',
    emoji: '❤️',
    tag: 'Perfect starter',
  },
  {
    title: 'Double Tap',
    price: '$4.99',
    description: '2 items + 1 grand prize entry',
    href: '/gift',
    emoji: '💜',
    tag: 'Most gifted',
  },
  {
    title: 'Long Press',
    price: '$9.99',
    description: '3 items + unreleased clip + 3 entries',
    href: '/gift',
    emoji: '💜',
    tag: 'Fan favorite',
  },
  {
    title: 'Hold My Heart',
    price: '$24.99',
    description: '5 items + studio pass + merch code + 10 entries',
    href: '/gift',
    emoji: '💜',
    tag: 'Ultimate V-Day gift',
  },
];

export default function ValentinesPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
        <Header />

        {/* Hero */}
        <section className="pt-16 pb-8 px-4 text-center">
          <p className="text-5xl mb-4">&#10084;&#65039;</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Valentine&apos;s Day
          </h1>
          <p className="text-white/60 max-w-md mx-auto">
            Give the gift of music. From $1.99 digital gifts to patented K-KUTs lockets.
          </p>
          <p className="text-white/40 text-sm mt-2">G Putnam Music &bull; Limited Time</p>
        </section>

        {/* Heart-Tap Section */}
        <section className="px-4 pb-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            <span>&#10084;&#65039;</span> Heart-Tap Gifts
          </h2>
          <p className="text-center text-white/50 text-sm mb-6">
            Digital mixed bags with exclusive stickers, ringtones, unreleased clips, and more.
          </p>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {GIFT_OPTIONS.map((gift) => (
              <Link key={gift.title} href={gift.href} className="group block">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span>{gift.emoji}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/40">{gift.tag}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{gift.title}</h3>
                  <p className="text-amber-400 font-bold">{gift.price}</p>
                  <p className="text-white/40 text-xs mt-1">{gift.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/gift"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:from-red-400 hover:to-pink-400 transition-all"
            >
              Send a Heart-Tap &rarr;
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-md mx-auto border-t border-white/10 my-8" />

        {/* K-KUTs Locket Section */}
        <section className="px-4 pb-8">
          <h2 className="text-2xl font-bold text-center mb-1">
            <span>&#128274;</span> K-KUTs Sovereign Locket
          </h2>
          <p className="text-center text-white/50 text-sm mb-1">
            A patent-pending music-frequency locket. The lock-and-key to creative energy.
          </p>
          <p className="text-center text-white/30 text-xs mb-6">
            Patent-Pending &bull; 2 Inventions &bull; 3 Trademarks &bull; One-Time Purchase
          </p>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {LOCKET_OPTIONS.map((locket) => (
              <Link key={locket.title} href={locket.href} className="group block">
                <div className={`relative rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors ${
                  locket.badge === 'HISTORIC' ? 'ring-1 ring-yellow-400/40 bg-gradient-to-b from-yellow-900/10 to-transparent' : ''
                }`}>
                  {locket.featured && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-orange-500 text-black">
                      MOST POPULAR
                    </div>
                  )}
                  {locket.badge === 'HISTORIC' && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-yellow-400 text-black">
                      MAKES HISTORY
                    </div>
                  )}
                  <span className="text-[10px] font-bold tracking-widest text-amber-400">{locket.badge}</span>
                  <h3 className="font-semibold text-white mt-1">{locket.title}</h3>
                  <p className="text-amber-400 font-bold text-xl">{locket.price}</p>
                  <p className="text-white/50 text-sm mt-1">{locket.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/kupid"
              className="inline-block px-8 py-3 rounded-full border border-amber-400/40 text-amber-400 font-bold hover:bg-amber-400/10 transition-all"
            >
              Explore K-KUTs &rarr;
            </Link>
          </div>
        </section>

        {/* Makeup Tracks Section */}
        <MakeupTracks />

        {/* CTA */}
        <section className="px-4 pb-16">
          <div className="max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Not sure what to give?</h2>
            <p className="text-white/50 text-sm mb-6">
              Start with a Heart-Tap at $1.99. Every gift includes exclusive digital content and a personal message.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/gift"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:from-red-400 hover:to-pink-400 transition-all"
              >
                Heart-Tap from $1.99
              </Link>
              <Link
                href="/kupid"
                className="px-6 py-3 rounded-full border border-amber-400/40 text-amber-400 font-bold hover:bg-amber-400/10 transition-all"
              >
                K-KUTs Lockets from $333
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
