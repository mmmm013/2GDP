'use client';

import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeFP from '@/components/HomeFP';
import T20Grid from '@/components/T20Grid';
import PromoBar from '@/components/PromoBar';
import GpmBot from '@/components/GpmBot';
import GlobalPlayer from '@/components/GlobalPlayer';
import CashSprintBanner from '@/components/CashSprintBanner';

export default function HomePage() {
  return (
    <>
      <PromoBar />

      <Header />

      <section className="px-4 pt-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl border border-[#FFD54F]/50 bg-[#2A1506] p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#FFD54F]">
              Mother’s Day GPM HUG is live
            </p>
            <h1 className="mt-2 text-2xl font-black text-[#F5e6c8] sm:text-3xl">
              FIND THE RIGHT WORDS.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#E8CFA8]">
              Send Mom something she has never, ever received: a real-audio K-KUT HUG.
              Not AI. Not a greeting card. A new G Putnam Music invention gift.
            </p>
          </div>
          <a
            href="https://k-kut.com"
            className="inline-flex items-center justify-center rounded-full bg-[#FFD54F] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#2A1506] hover:bg-[#FFE082]"
          >
            Order at k-kut.com →
          </a>
        </div>
      </section>
      <CashSprintBanner endIso="2026-04-15T23:59:59Z" source="home_countdown" />

      <section className="px-4 pt-3">
        <div className="max-w-7xl mx-auto rounded-xl border border-[#5C3A1E]/50 bg-[#2A1506] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[#FFD54F] text-xs font-black uppercase tracking-[0.22em]">
              G Putnam Music · GPEx · 4PE
            </p>
            <p className="mt-2 text-[#F5e6c8] text-base font-semibold tracking-wide">
              GPM is the home base for Kreator intake, PIX source material, and the K-KUT invention family.
            </p>
            <p className="mt-1 text-[#C8A882] text-sm leading-relaxed">
              Interested in K-KUTs? Visit the dedicated K-KUT site for the Mother’s Day HUG promo, real KK song-section samples, and ordering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://k-kut.com"
              className="px-4 py-2 rounded-full bg-[#FFD54F] text-[#2A1506] text-xs font-extrabold tracking-wider hover:bg-[#FFE082] transition-colors"
            >
              EXPLORE K-KUTs
            </a>
            <a
              href="/kreator-intake"
              className="px-4 py-2 rounded-full border border-[#C8A882]/70 text-[#C8A882] text-xs font-bold tracking-wider hover:bg-[#C8A882]/10 transition-colors"
            >
              4PE KREATOR INTAKE
            </a>
          </div>
        </div>
      </section>


      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto rounded-2xl border border-[#D4A017]/25 bg-[#1A1207] p-6 md:p-8">
          <p className="text-[#FFD54F] text-xs font-black uppercase tracking-[0.24em]">
            Artist Opportunity
          </p>

          <h2 className="mt-4 max-w-3xl text-3xl md:text-4xl font-black text-[#F5e6c8]">
            Your songs may hold more than one future.
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-[#5C3A1E]/60 bg-[#2A1506] p-4">
              <p className="text-[#FFD54F] font-black">A full track</p>
              <p className="mt-1 text-sm text-[#C8A882]">can be a release.</p>
            </div>
            <div className="rounded-xl border border-[#5C3A1E]/60 bg-[#2A1506] p-4">
              <p className="text-[#FFD54F] font-black">A section</p>
              <p className="mt-1 text-sm text-[#C8A882]">can become a K-KUT.</p>
            </div>
            <div className="rounded-xl border border-[#5C3A1E]/60 bg-[#2A1506] p-4">
              <p className="text-[#FFD54F] font-black">A message</p>
              <p className="mt-1 text-sm text-[#C8A882]">can become a HUG.</p>
            </div>
            <div className="rounded-xl border border-[#5C3A1E]/60 bg-[#2A1506] p-4">
              <p className="text-[#FFD54F] font-black">A moment</p>
              <p className="mt-1 text-sm text-[#C8A882]">can become a placement.</p>
            </div>
          </div>

          <p className="mt-6 max-w-4xl text-[#E8CFA8] leading-relaxed">
            G Putnam Music is opening a 4PE intake path for selected artists, writers, and rights holders who want their songs considered for K-KUTs, HUGs, mini-KUTs, curated gift products, licensing, placement, and future fan-engagement uses.
          </p>

          <p className="mt-3 max-w-4xl text-[#C8A882] leading-relaxed">
            This is not a public dump folder. Every submission enters review first. Nothing becomes public, released, converted into PIX, K-KUT, HUG, or catalog material until GPM reviews and approves it.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/kreator-intake"
              className="rounded-full bg-[#FFD54F] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#2A1506] hover:bg-[#FFE082]"
            >
              Submit Catalog for Review
            </a>
            <a
              href="https://k-kut.com"
              className="rounded-full border border-[#C8A882]/70 px-5 py-3 text-xs font-black uppercase tracking-wider text-[#C8A882] hover:bg-[#C8A882]/10"
            >
              Explore K-KUTs
            </a>
          </div>
        </div>
      </section>

      <div className="flex justify-end px-4 pt-3 pb-1">
        <GpmBot bot="MC-BOT" startCollapsed={false} className="w-full max-w-xs" />
      </div>

      <section id="featured" className="grid w-full grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[260px]">
          <Image
            src="/k-hero.jpg"
            alt="G Putnam Music"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1506]/40 via-transparent to-[#1A1207]/85" />
        </div>
        <div className="min-h-[260px]">
          <HomeFP />
        </div>
      </section>

      <T20Grid />
      <GlobalPlayer />
      <Footer />
    </>
  );
}
