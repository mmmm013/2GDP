"use client";

import BBBotDemo from "@/components/BBBotDemo";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A120B] text-[#F5E6C8]">

      {/* Header */}
      <header className="border-b border-[#D4A017]/20 px-6 py-4 flex justify-between">
        <div className="text-[#D4A017] font-bold">K-KUT</div>
        <Link href="/invention" className="text-[#D4A017] hover:opacity-80">
          Inventions
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold">
          Find the exact moment you need.
        </h1>

        <p className="mt-4 text-[#E8CFA8] max-w-2xl">
          Vocal hooks, phrases, emotional moments, and song sections—ready for film, TV, ads, and branded content.
        </p>

        {/* Actions */}
        <div className="mt-10 space-y-6">

          {/* Browse */}
          <div>
            <h2 className="font-semibold">Browse Moments</h2>
            <p className="text-sm text-[#C8A882]">
              Discover precise emotional moments: lead-ins, hooks, phrases, and sections.
            </p>

            <Link href="/find">
              <button className="mt-3 px-6 py-3 border border-[#D4A017] text-[#D4A017] rounded-lg hover:bg-[#D4A017]/10 transition">
                Browse Moments
              </button>
            </Link>
          </div>

          {/* Request */}
          <div>
            <h2 className="font-semibold">Request a Package</h2>
            <p className="text-sm text-[#C8A882]">
              Tell us what you need:
            </p>

            <div className="text-sm mt-2 text-[#E8CFA8]">
              <div>“warm romantic lead-in”</div>
              <div>“nostalgic couple moment”</div>
              <div>“intimate vocal phrase”</div>
            </div>

            <a
              href="mailto:hello@gputnammusic.com?subject=K-KUT Request&body=Describe what you need:"
            >
              <button className="mt-3 px-6 py-3 border border-[#D4A017] text-[#D4A017] rounded-lg hover:bg-[#D4A017]/10 transition">
                Start a Request
              </button>
            </a>
          </div>

          {/* Use */}
          <div>
            <h2 className="font-semibold">Use in a Production</h2>
            <p className="text-sm text-[#C8A882]">
              Film, TV, advertising, brand, or digital use.
            </p>

            <Link href="/supe">
              <button className="mt-3 px-6 py-3 border border-[#D4A017] text-[#D4A017] rounded-lg hover:bg-[#D4A017]/10 transition">
                Start a Request
              </button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-[#D4A017]/20" />

        {/* Footer */}
        <div className="mt-6 text-sm text-[#C8A882]">
          Powered by GPM 4PE music operations.
        </div>

        <div className="mt-4 text-[#E8CFA8]">
          Send as a HUG | Download full songs
        </div>

        {/* BB BOT */}
        <div className="mt-16">
          <BBBotDemo />
        </div>

      </section>
    </main>
  );
}