import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Invention",
  description:
    "K-KUT is a new messaging layer — emotion delivered through an exact moment of music. Discover the invention behind Send a Feeling.",
  alternates: { canonical: "https://k-kut.com/invention" },
  openGraph: {
    title: "The Invention | K-KUT",
    description:
      "K-KUT is a new messaging layer — emotion delivered through an exact moment of music.",
    url: "https://k-kut.com/invention",
  },
};

const PILLARS = [
  {
    icon: "◆",
    title: "Send a Feeling",
    body: "Not a reaction. A signal. K-KUT lets you say something without saying anything — just the exact moment that speaks.",
  },
  {
    icon: "◈",
    title: "Make Moments",
    body: "A memory you can send. Every K-KUT is a moment anchored in sound — precise, portable, and personal.",
  },
  {
    icon: "⬢",
    title: "Exact-Excerpt Audio",
    body: "The right line. The right beat. The right second. Selected from professional, registered tracks — music + vocals.",
  },
];

const ACTIONS = [
  { gesture: "Quick Tap", level: "mK Single", price: "$1.99" },
  { gesture: "Double Tap", level: "K-KUT Duo", price: "$4.99" },
  { gesture: "Long Press", level: "PIX Stream", price: "$9.99" },
  { gesture: "Hold My Heart", level: "Sovereign Pass", price: "$24.99" },
];

export default function InventionPage() {
  return (
    <>
      <Nav />
      <main className="pt-14">
        {/* ─── Hero ──────────────────────────────── */}
        <section className="relative border-b border-[var(--border)] grid-bg py-32 px-4 text-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] blur-[100px] opacity-30" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              K-KUT
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text)] mb-6 leading-tight">
              The Invention
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
              K&#8209;KUT is a new messaging layer: emotion, delivered through
              an exact moment of music.
            </p>
          </div>
        </section>

        {/* ─── 3 Pillars ────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            Core Idea
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-12">
            Three pillars. One new language.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {PILLARS.map(({ icon, title, body }) => (
              <div
                key={title}
                className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-6 hover:border-[var(--border-bright)] transition-colors"
              >
                <span className="block text-3xl text-[var(--accent)] mb-4">
                  {icon}
                </span>
                <h3 className="text-base font-semibold text-[var(--text)] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── What makes it new ────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              What makes it new
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-12">
              Everything else falls short.
            </h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { label: "Emojis", verdict: "simplify" },
                { label: "GIFs", verdict: "imitate" },
                { label: "Full songs", verdict: "too long" },
                { label: "K-KUT", verdict: "the exact moment that says it for you.", accent: true },
              ].map(({ label, verdict, accent }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between border rounded-sm px-5 py-3 ${
                    accent
                      ? "border-[var(--accent)] bg-[var(--accent-glow)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      accent ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{verdict}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── The Actions ──────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            The Actions
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-4">
            A new interaction language.
          </h2>
          <p className="text-center text-sm text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
            K&#8209;KUT is organized around physical gestures. Every Action is
            a level of access — and a way of being present.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACTIONS.map(({ gesture, level, price }) => (
              <div
                key={level}
                className="flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] rounded-sm px-5 py-4 hover:border-[var(--border-bright)] transition-colors"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] mb-0.5">
                    {gesture}
                  </p>
                  <p className="text-sm font-semibold text-[var(--text)]">{level}</p>
                </div>
                <span className="text-sm text-[var(--text-muted)]">{price} / mo</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--text-subtle)] mt-4">
            See full plan details on the{" "}
            <Link href="/pricing" className="text-[var(--accent)] hover:opacity-80">
              Pricing page
            </Link>
            .
          </p>
        </section>

        {/* ─── Trust / Legitimacy ───────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              Designed for trust
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text)] mb-4">
              Built around professional releases and registered works.
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto">
              The goal is simple: a new format that respects creators and feels
              effortless for users. K&#8209;KUT is designed to operate within
              the framework of professional music licensing — not around it.
            </p>
          </div>
        </section>

        {/* ─── CTA row ──────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/demo"
            className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
          >
            Watch Demo
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-3 border border-[var(--border-bright)] text-[var(--text-muted)] text-sm font-semibold uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-sm"
          >
            View Pricing
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
