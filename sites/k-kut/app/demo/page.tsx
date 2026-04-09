import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DeliveryStage from "@/components/DeliveryStage";
import BotDemo from "@/components/BotDemo";
import BotyPlayer from "@/components/BotyPlayer";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "See K-KUT in action. Browse a feeling, choose K-KUT or mini-KUT, and experience the GPM box opening.",
  alternates: { canonical: "https://k-kut.com/demo" },
  openGraph: {
    title: "Demo | K-KUT",
    description: "Browse a feeling. Pick the moment. Open the box.",
    url: "https://k-kut.com/demo",
  },
};

const FEELINGS = [
  "Hype", "Heart", "Calm", "Funny", "Confidence", "Miss You",
  "Victory", "Apology", "Glow-up", "Inside Joke",
];

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="pt-14">
        {/* ─── Hero ──────────────────────────────── */}
        <section className="relative border-b border-[var(--border)] grid-bg py-20 px-4 text-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[400px] h-[400px] rounded-full bg-[var(--accent-glow)] blur-[80px] opacity-35" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              Live Demo
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4 leading-tight">
              Hear it. Then send it.
            </h1>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              Press play on the K&#8209;KUT below — then watch the BOT send one.
              When you&rsquo;re ready, get access.
            </p>
          </div>
        </section>

        {/* ─── BOTY — Best Of The Year ──────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3 text-center">
            K-KUT of the Year
          </p>
          <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-8">
            This is what a K&#8209;KUT sounds like.
          </h2>
          <BotyPlayer />
        </section>

        {/* ─── Feelings Grid ────────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              Step 1: Browse a Feeling
            </p>
            <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-8">
              What do you need to say?
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {FEELINGS.map((feeling) => (
                <span
                  key={feeling}
                  className="px-4 py-2 text-xs uppercase tracking-widest border border-[var(--border)] text-[var(--text-muted)] rounded-sm hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-default transition-colors"
                >
                  {feeling}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-[var(--text-subtle)] mt-5">
              Full library unlocks with your plan.
            </p>
          </div>
        </section>

        {/* ─── BOT Demos ────────────────────────── */}
        <section className="border-t border-[var(--border)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3 text-center">
              Step 2: Watch the BOT Work
            </p>
            <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-3">
              Three inventions. Three BOTs.
            </h2>
            <p className="text-center text-sm text-[var(--text-muted)] mb-10 max-w-xl mx-auto">
              Press ▶ on K-KUT BOT to see an exact section get sent — with audio.
              Hit the buy button when it clicks.
            </p>
            <BotDemo />
          </div>
        </section>

        {/* ─── Delivery Stage ───────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3 text-center">
              Step 3: Pick Your Messenger
            </p>
            <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-3">
              Open the box.
            </h2>
            <p className="text-center text-sm text-[var(--text-muted)] mb-10 max-w-xl mx-auto">
              Twelve messengers. Fifteen codes. Four channels.
              Every delivery is unrepeatable.
            </p>
            <DeliveryStage />
          </div>
        </section>

        {/* ─── Final CTA ────────────────────────── */}
        <section className="border-t border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Ready to send a feeling?
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
              K&#8209;KUT is rolling out in waves. Sovereign Pass is live now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
              >
                Get Access — View Pricing
              </Link>
              <Link
                href="/invention"
                className="px-8 py-3 border border-[var(--border-bright)] text-[var(--text-muted)] text-sm font-semibold uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-sm"
              >
                The Invention
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
