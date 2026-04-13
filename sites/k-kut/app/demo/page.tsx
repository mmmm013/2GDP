import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DeliveryStage from "@/components/DeliveryStage";

const BotDemo = dynamic(() => import("@/components/BotDemo"), {
  loading: () => (
    <div className="flex items-center justify-center py-24 text-kkut-muted text-sm tracking-wide">
      Loading demo…
    </div>
  ),
});

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

const SCENARIOS = [
  {
    id: "01",
    title: "Make it right.",
    description: "An apology that actually lands — not a wall of text. The exact lyric that says \"I mean it.\"",
    feeling: "Apology",
    type: "K-KUT",
  },
  {
    id: "02",
    title: "Light them up.",
    description: "Hype your friend before the big moment. The exact beat drop that says \"you've got this.\"",
    feeling: "Hype",
    type: "mini-KUT",
  },
  {
    id: "03",
    title: "Say it without saying it.",
    description: "A crush. An inside feeling. The perfect lyric moment that says everything without the risk.",
    feeling: "Heart",
    type: "K-KUT",
  },
  {
    id: "04",
    title: "Send the moment.",
    description: "K-kUpId: Interest→Date→Love. The exact lyric for exactly where you are — and where you want to go.",
    feeling: "Romance",
    type: "K-kUpId",
  },
];

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
        <section className="relative border-b border-[var(--border)] grid-bg py-28 px-4 text-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[400px] h-[400px] rounded-full bg-[var(--accent-glow)] blur-[80px] opacity-35" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              See it in motion
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4 leading-tight">
              Pick your messenger.<br />Open the box.
            </h1>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              Devil. Cupid. Angel. Spy. Twelve messengers, each with a unique
              entrance. Three letters fall open. You choose the channel.
              Every delivery is unrepeatable.
            </p>
          </div>
        </section>

        {/* ─── How the Demo Works ───────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            The Flow
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-12">
            Four steps. One delivered feeling.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Browse a feeling",
                body: "Tap a feeling tile — Hype, Heart, Romance, Apology. The library surfaces moments that match.",
              },
              {
                step: "02",
                title: "Select your path",
                body: "Choose a K-KUT (whole section) or a mini-KUT (text phrase). Pick the one that fits the moment.",
              },
              {
                step: "03",
                title: "Pick your messenger",
                body: "Devil. Cupid. Angel. Nurse. Romeo. Puppy. Cat. Ghost. Each messenger carries the moment with a unique entrance and glow.",
              },
              {
                step: "04",
                title: "Choose the channel",
                body: "SMS, DM, Social, or Email. Three letter panels fall open — left, center, right. A new delivery every time.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="text-4xl font-bold text-[var(--border-bright)]">
                  {step}
                </span>
                <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Feelings Grid ────────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              Step 1: Browse a Feeling
            </p>
            <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-10">
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
            <p className="text-center text-xs text-[var(--text-subtle)] mt-6">
              Full library unlocks with your plan. Audio rolling out in waves.
            </p>
          </div>
        </section>

        {/* ─── BOT Demos ────────────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              Live BOT Demos
            </p>
            <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-3">
              Three inventions. Three BOTs. Watch them run.
            </h2>
            <p className="text-center text-sm text-[var(--text-muted)] mb-10 max-w-xl mx-auto">
              Scripted, auto-playing demonstrations — one per invention. K-KUT BOT
              sends an exact section. mini-KUT BOT fires 12 micro-assets from one
              master track. K-kUpId BOT walks all 5 romance levels.
            </p>
            <BotDemo />
          </div>
        </section>

        {/* ─── Delivery Stage ───────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            Step 3: The Delivery
          </p>
          <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-3">
            Pick your messenger. Open the box.
          </h2>
          <p className="text-center text-sm text-[var(--text-muted)] mb-10 max-w-xl mx-auto">
            Twelve messengers. Fifteen codes. Four channels. Every delivery is
            different — same electric feeling. Choose who carries your moment,
            then pick how it lands: SMS, DM, Social, or Email.
          </p>
          <DeliveryStage />
        </section>

        {/* ─── 4 Demo Scenarios ─────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              Demo Scenarios
            </p>
            <h2 className="text-2xl font-semibold text-center text-[var(--text)] mb-12">
              Real moments. Exact delivery.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SCENARIOS.map(({ id, title, description, feeling, type }) => (
                <div
                  key={id}
                  className="border border-[var(--border)] bg-[var(--bg)] rounded-sm p-6 hover:border-[var(--border-bright)] transition-colors flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--accent)]">
                      {feeling}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border)] px-1.5 py-0.5 rounded-sm">
                      {type}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text)]">
                    {title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA row ──────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
          >
            View Pricing
          </Link>
          <Link
            href="/invention"
            className="px-8 py-3 border border-[var(--border-bright)] text-[var(--text-muted)] text-sm font-semibold uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-sm"
          >
            The Invention
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
