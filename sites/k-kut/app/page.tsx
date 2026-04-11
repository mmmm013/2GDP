import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FrontPanel from "@/components/FrontPanel";

export const metadata: Metadata = {
  title: "K-KUT — Send a Feeling.",
  description:
    "K-KUT turns the exact moment of a real song into a shareable audio snippet — so your message lands with meaning.",
  alternates: { canonical: "https://k-kut.com" },
};

const MOMENTS = [
  { label: "Congratulations", icon: "✦" },
  { label: "I'm here.", icon: "◈" },
  { label: "Apology", icon: "◇" },
  { label: "Inside joke", icon: "⬡" },
  { label: "Heartbreak", icon: "◆" },
  { label: "Hype", icon: "⬢" },
];

const DIFFERENTIATORS = [
  {
    title: "Exact moment — not a preview",
    body: "Every K-KUT is precisely selected. Not a random sample. The moment that means something.",
  },
  {
    title: "Feeling-first discovery",
    body: "Browse by emotion, not by title. Find the snippet that says exactly what you can't.",
  },
  {
    title: "Made to share",
    body: "Fast. Clean. Replayable. Built to move at the speed of messaging.",
  },
  {
    title: "Creator-respecting model",
    body: "Built around professional releases and registered works. Expression with integrity.",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="pt-14">
        {/* ─── Hero ──────────────────────────────── */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 grid-bg overflow-hidden">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[600px] h-[600px] rounded-full bg-[var(--accent-glow)] blur-[120px] opacity-40" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto animate-slide-up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
              A new kind of expression
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text)] leading-[1.05] accent-glow-text mb-6">
              Send a Feeling.
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed mb-10">
              K&#8209;KUT turns the exact moment of a real song into a
              shareable audio snippet — so your message lands with meaning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            </div>
            <p className="mt-6 text-xs text-[var(--text-subtle)] tracking-widest">
              Built for moments. Designed for speed.
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-subtle)]">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <span className="block w-px h-8 bg-gradient-to-b from-[var(--border)] to-transparent" />
          </div>
        </section>

        {/* ─── FrontPanel — Live Audio Preview ─── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3 text-center">
            Hear it now
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-[var(--text)] mb-2">
            Three inventions. All playing live.
          </h2>
          <p className="text-center text-sm text-[var(--text-muted)] mb-8 max-w-xl mx-auto">
            K&#8209;KUT, mini&#8209;KUT, and K&#8209;kUpId — tap any snippet to
            hear the exact excerpt. Play, pause, stop, or loop it.
          </p>
          <FrontPanel />
        </section>

        {/* ─── The Problem ──────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="space-y-2 text-3xl sm:text-4xl font-light text-[var(--text-muted)] leading-relaxed">
            <p>Text is fast.</p>
            <p>Emojis are close.</p>
            <p className="text-[var(--text)] font-semibold">
              But some moments need sound.
            </p>
          </div>
        </section>

        {/* ─── What K-KUT is ────────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
              The invention
            </p>
            <p className="text-xl sm:text-2xl text-[var(--text)] max-w-2xl mx-auto leading-relaxed">
              A K&#8209;KUT is an{" "}
              <span className="text-[var(--accent)]">exact excerpt</span> of
              audio from professional, registered tracks — music + vocals —
              selected for the moment it captures.
            </p>
            <p className="mt-4 text-base text-[var(--text-muted)] max-w-xl mx-auto">
              It&rsquo;s a new kind of expression: a bitmoji come-to-life, in
              sound.
            </p>
            <div className="mt-8">
              <Link
                href="/invention"
                className="text-xs uppercase tracking-widest text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:opacity-80 transition-opacity"
              >
                Learn about the invention →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── The Invention Family ─────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            The Invention Family
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-4">
            Three inventions. One complete system.
          </h2>
          <p className="text-center text-sm text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
            K&#8209;KUT is the core — but the full expression system includes
            mini&#8209;KUT and K&#8209;kUpId. Together they cover every layer
            from catalog to delivery.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                id: "K-KUT",
                icon: "◆",
                role: "The Section",
                desc: "Exact-excerpt audio from whole song sections. The structural moment that says it for you.",
              },
              {
                id: "mini-KUT",
                icon: "◈",
                role: "The Micro-Asset",
                desc: "Text-based sub-sectional extractions — words, phrases, hooks. High-velocity. Quick Tap ready.",
              },
              {
                id: "K-kUpId",
                icon: "⬡",
                role: "The Romance Invention",
                desc: "Same exact-excerpt strategy as K-KUT, but every moment is curated for a level of connection: Interest, Date, Love, Sex, or Forever.",
              },
            ].map(({ id, icon, role, desc }) => (
              <div
                key={id}
                className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-6 hover:border-[var(--border-bright)] transition-colors"
              >
                <span className="block text-2xl text-[var(--accent)] mb-3">{icon}</span>
                <p className="text-base font-bold text-[var(--text)]">{id}</p>
                <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] mt-0.5 mb-3">
                  {role}
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/invention"
              className="text-xs uppercase tracking-widest text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:opacity-80 transition-opacity"
            >
              Explore all three inventions →
            </Link>
          </div>
        </section>

        {/* ─── Make Moments ─────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            Make Moments
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-12">
            Every feeling has its moment.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {MOMENTS.map(({ label, icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] rounded-sm px-4 py-4 hover:border-[var(--border-bright)] transition-colors"
              >
                <span className="text-[var(--accent)] text-lg">{icon}</span>
                <span className="text-sm text-[var(--text-muted)]">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── How it works ─────────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-12">
              Three steps. One feeling.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Choose a feeling", body: "Browse by emotion — hype, heart, funny, fearless. Find what you mean." },
                { step: "02", title: "Pick the moment", body: "Select the exact excerpt. The right line. The right beat. The right second." },
                { step: "03", title: "Send it anywhere", body: "Share as a clean link — in a message, a post, or right to their phone." },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex flex-col gap-3">
                  <span className="text-4xl font-bold text-[var(--border-bright)]">
                    {step}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why it's different ───────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            Why it&rsquo;s different
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-12">
            Beyond emojis. Beyond GIFs.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map(({ title, body }) => (
              <div
                key={title}
                className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-6 hover:border-[var(--border-bright)] transition-colors"
              >
                <h3 className="text-sm font-semibold text-[var(--text)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Final CTA ────────────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Be first to send feelings in sound.
            </h2>
            <p className="text-base text-[var(--text-muted)] mb-10">
              K&#8209;KUT is rolling out in waves. Join now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
