"use client";

import Link from "next/link";
import BBBotDemo from "@/components/BBBotDemo";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A120B] text-[#F5E6C8]">
      
      {/* Header */}
      <header className="border-b border-[#D4A017]/20 px-6 py-4 flex justify-between">
        <div className="font-bold text-[#D4A017]">K-KUT</div>
        <nav className="flex gap-6 text-sm">
          <Link href="/find" className="hover:text-[#D4A017]">Browse</Link>
          <Link href="/demo" className="hover:text-[#D4A017]">Demo</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">
          Find the exact moment you need.
        </h1>

        <p className="mt-4 text-[#E8CFA8] max-w-2xl">
          Vocal hooks, phrases, emotional moments, and song sections — ready
          for film, TV, ads, and branded content.
        </p>

        {/* Actions */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link href="/find" className="p-4 border border-[#D4A017]/30 rounded hover:border-[#D4A017]">
            Browse Moments
          </Link>

          <div className="p-4 border border-[#D4A017]/30 rounded">
            Request a Package
            <p className="text-sm text-[#C8A882] mt-1">
              “warm romantic lead-in”
            </p>
          </div>

          <div className="p-4 border border-[#D4A017]/30 rounded">
            Use in Production
          </div>

          <div className="p-4 border border-[#D4A017]/30 rounded">
            Send as a HUG
          </div>
        </div>

        {/* BB BOT inline */}
        <div className="mt-14">
          <BBBotDemo />
        </div>

        <p className="mt-10 text-sm text-[#C8A882]">
          Powered by GPM 4PE music operations.
        </p>
      </section>
    </main>
  );
}