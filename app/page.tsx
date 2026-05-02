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
  const checkoutHref = '/api/checkout-attribution?utm_source=home_strip&utm_medium=site&utm_campaign=cash_sprint_apr2026&utm_content=primary';

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
        <div className="max-w-7xl mx-auto rounded-xl border border-[#5C3A1E]/50 bg-[#2A1506] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[#F5e6c8] text-sm font-semibold tracking-wide">
            Pre-made K-KUT access is live. No custom wait, no setup friction.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={checkoutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#FFD54F] text-[#2A1506] text-xs font-extrabold tracking-wider hover:bg-[#FFE082] transition-colors"
            >
              BUY K-KUT NOW
            </a>
            <a
              href="/gift"
              className="px-4 py-2 rounded-full border border-[#C8A882]/70 text-[#C8A882] text-xs font-bold tracking-wider hover:bg-[#C8A882]/10 transition-colors"
            >
              SEND A GIFT
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
