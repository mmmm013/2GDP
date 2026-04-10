import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArtistPromo from "@/components/ArtistPromo";
import KutWizard from "@/components/KutWizard";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Tell us the feeling. We find the K-KUT. You send it. Five guided steps.",
  alternates: { canonical: "https://k-kut.com/demo" },
  openGraph: {
    title: "Demo | K-KUT",
    description: "Tell us the feeling. We find the K-KUT. You send it.",
    url: "https://k-kut.com/demo",
  },
};

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
              Feel it. Find it. Send it.
            </h1>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              Five guided steps — BOT-assisted. So simple a 6-year-old can manage.
            </p>
          </div>
        </section>

        {/* ─── 5-Step K-KUT Wizard ───────────────── */}
        <section className="border-b border-[var(--border)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] text-center mb-8">
              Your K-KUT Journey
            </p>
            <KutWizard />
          </div>
        </section>

        {/* ─── Artist Promo: Michael Scherer ────── */}
        <ArtistPromo />

        {/* ─── Final CTA ────────────────────────── */}
        <section className="border-t border-[var(--border)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Ready?
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
              K&#8209;KUT is rolling out in waves. Sovereign Pass is live now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
              >
                Get Access
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
