import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Inventions",
  description:
    "Three inventions. One new language. K-KUT, mini-KUT, and K-kUpId — the complete GPM audio expression system.",
  alternates: { canonical: "https://k-kut.com/invention" },
  openGraph: {
    title: "The Inventions | K-KUT",
    description:
      "Three inventions. One new language. K-KUT, mini-KUT, and K-kUpId.",
    url: "https://k-kut.com/invention",
  },
};

const INVENTIONS = [
  {
    id: "K-KUT",
    icon: "◆",
    tagline: "The Section",
    headline: "Exact-Excerpt Audio",
    body: "A K-KUT is a structural excerpt from a professional, registered track — music + vocals — taken from a whole song section (Verse, Chorus, Bridge, etc.). It is the exact moment that says it for you. Not a preview. Not a clip. A precise selection with meaning.",
    role: "The Core Expression",
    action: "Double Tap",
    velocity: "Depth + Precision",
  },
  {
    id: "mini-KUT",
    icon: "◈",
    tagline: "The Micro-Asset",
    headline: "High-Velocity Text",
    body: "A mini-KUT (mK) is a sub-sectional text extraction — a single word, a phrase, an exclamation, or a hook pulled from within a song section. Where a K-KUT is the Verse, the mini-K is the \"8-bar hook\" or the \"one line\" within it. Designed for social media, alerts, and instant messaging.",
    role: "The Unit of Velocity",
    action: "Quick Tap",
    velocity: "Speed + Impact",
  },
  {
    id: "K-kUpId",
    icon: "⬡",
    tagline: "The Romance Invention",
    headline: "Levels of Love",
    body: "K-kUpId is an exact-excerpt audio invention — same strategy as K-KUT — but every moment is selected for a specific level of romantic or emotional closeness: Interest, Date, Love, Sex, or Forever. Where K-KUT expresses any feeling, K-kUpId is devoted entirely to connection.",
    role: "Interest · Date · Love · Sex · Forever",
    action: "Hold My Heart",
    velocity: "Depth + Intimacy",
  },
];

const ACTIONS = [
  { gesture: "Quick Tap", level: "mK Single", invention: "mini-KUT", price: "$1.99" },
  { gesture: "Double Tap", level: "K-KUT Duo", invention: "K-KUT", price: "$4.99" },
  { gesture: "Long Press", level: "PIX Stream", invention: "K-KUT + mini-K", price: "$9.99" },
  { gesture: "Hold My Heart", level: "Sovereign Pass", invention: "All Access", price: "$24.99" },
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
              G Putnam Music
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text)] mb-6 leading-tight">
              Three Inventions.
              <br />
              <span className="text-[var(--accent)]">One New Language.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              K&#8209;KUT, mini&#8209;KUT, and K&#8209;kUpId together form a
              complete audio expression system — from catalog to the moment it
              reaches someone who needs to feel it.
            </p>
          </div>
        </section>

        {/* ─── 3 Inventions ─────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            The Invention Family
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-4">
            Each one does a distinct job.
          </h2>
          <p className="text-center text-sm text-[var(--text-muted)] mb-16 max-w-xl mx-auto">
            Together they cover every layer of the audio expression stack —
            from structural section to micro-text to final delivery.
          </p>

          <div className="space-y-8">
            {INVENTIONS.map(({ id, icon, tagline, headline, body, role, action, velocity }) => (
              <div
                key={id}
                className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-6 md:p-8 hover:border-[var(--border-bright)] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Left: icon + id */}
                  <div className="flex-shrink-0 flex flex-col items-start gap-2 min-w-[140px]">
                    <span className="text-3xl text-[var(--accent)]">{icon}</span>
                    <p className="text-xl font-bold text-[var(--text)]">{id}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--accent)]">
                      {tagline}
                    </p>
                  </div>

                  {/* Right: content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-3">
                      {headline}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">
                      {body}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[var(--accent)]">◆</span>
                        <strong className="text-[var(--text)]">Role:</strong> {role}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[var(--accent)]">◈</span>
                        <strong className="text-[var(--text)]">Action:</strong> {action}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[var(--accent)]">⬢</span>
                        <strong className="text-[var(--text)]">Value:</strong> {velocity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── The mini-KUT Deep Dive ───────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              mini-KUT
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-4">
              The Unit of Velocity.
            </h2>
            <p className="text-center text-sm text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
              If a K-KUT is the Verse, the mini-KUT is the 8-bar hook within
              it — unconstrained by duration, bounded only by the content
              itself.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                {
                  label: "Types",
                  items: ["Words", "Exclamations", "Compound phrases (≤4 words)", "Lyric hooks (≤2 lines)"],
                },
                {
                  label: "Use Cases",
                  items: ["Social media captions", "Message alerts", "Quick Tap sends", "Micro-sync placements"],
                },
                {
                  label: "Scale",
                  items: ["12 mini-KUTs per Master Track", "8/12/20 extraction rule", "Zero catalog waste", "Maximum speed to market"],
                },
              ].map(({ label, items }) => (
                <div
                  key={label}
                  className="border border-[var(--border)] rounded-sm p-5"
                >
                  <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] mb-3">
                    {label}
                  </p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[var(--text-muted)]">
                        <span className="text-[var(--accent)] mt-0.5">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── The K-kUpId Deep Dive ────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
            K-kUpId
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-4">
            The Romance Invention.
          </h2>
          <p className="text-center text-sm text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
            K&#8209;kUpId uses the same exact-excerpt audio strategy as K&#8209;KUT
            — but every moment is selected for a specific level of connection.
            Five levels. One intention: closeness.
          </p>

          {/* 5 Levels of Love */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-14">
            {[
              { level: "01", label: "Interest", desc: "The spark. The opener. The moment that says 'I see you.'" },
              { level: "02", label: "Date", desc: "Anticipation. A shared vibe before the night begins." },
              { level: "03", label: "Love", desc: "Deep feeling. The lyric that says what words can't." },
              { level: "04", label: "Sex", desc: "Charged. Certain. The exact beat that says everything." },
              { level: "05", label: "Forever", desc: "The forever song. The moment that seals it." },
            ].map(({ level, label, desc }) => (
              <div
                key={level}
                className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4 hover:border-[var(--accent)] transition-colors text-center"
              >
                <span className="block text-xs text-[var(--text-muted)] mb-1">{level}</span>
                <p className="text-sm font-bold text-[var(--accent)] mb-2">{label}</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* K-kUpId vs K-KUT comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              {
                title: "Same strategy as K-KUT",
                body: "Exact excerpts from professional, registered tracks — music + vocals — selected with precision. ASCAP-compliant section-based extraction.",
              },
              {
                title: "Feeling-first: Romance only",
                body: "Where K-KUT covers all emotions, K-kUpId's entire catalog is curated for the romantic spectrum — from first glance to forever.",
              },
              {
                title: "Level-matched discovery",
                body: "Browse by level, not just mood. The right excerpt for exactly where you are in the connection — and exactly where you want to go.",
              },
              {
                title: "Gift-ready by design",
                body: "K-kUpId moments are built to be sent — a gift, a signal, an invitation. Every excerpt is chosen because it says what you mean better than you can.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-5 hover:border-[var(--border-bright)] transition-colors"
              >
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">{title}</h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── What makes it new ────────────────── */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 text-center">
              Why nothing else compares
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[var(--text)] mb-12">
              Every other format leaves something out.
            </h2>
            <div className="max-w-2xl mx-auto space-y-3">
              {[
                { label: "Emojis", verdict: "simplify — no sound, no soul" },
                { label: "GIFs", verdict: "imitate — no original, no rights" },
                { label: "Full songs", verdict: "too long — loses the moment" },
                { label: "Song previews", verdict: "random — not feeling-first" },
                { label: "K-KUT + mini-K + K-kUpId", verdict: "exact · personal · delivered", accent: true },
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
                  <span className="text-sm text-[var(--text-muted)] text-right max-w-[50%]">
                    {verdict}
                  </span>
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
            Each Action maps to a gesture, a plan tier, and an invention.
            Physical expression meets audio expression.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACTIONS.map(({ gesture, level, invention, price }) => (
              <div
                key={level}
                className="flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] rounded-sm px-5 py-4 hover:border-[var(--border-bright)] transition-colors"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] mb-0.5">
                    {gesture}
                  </p>
                  <p className="text-sm font-semibold text-[var(--text)]">{level}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{invention}</p>
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
              effortless for users. K&#8209;KUT, mini&#8209;KUT, and
              K&#8209;kUpId are designed to operate within the framework of
              professional music licensing — not around it.
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
