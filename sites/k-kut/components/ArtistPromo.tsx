import Link from "next/link";

/**
 * ArtistPromo — BRAVE 🦅 spotlight for Michael Scherer / "Razz My-Tazz Jazz"
 *
 * Featured Artist: Michael Scherer — composer & pianist, GPM Artist.
 * GPM is gifting his family 90 % of all profits generated from his tracks.
 */
export default function ArtistPromo() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        {/* ── BRAVE badge ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Eagle + label */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 w-24">
            <span className="text-5xl select-none" aria-label="BRAVE eagle mascot">
              🦅
            </span>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--accent)] font-semibold text-center">
              BRAVE
            </p>
          </div>

          {/* Promo copy */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Overline */}
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">
              GPM Featured Artist · Now Streaming
            </p>

            {/* Track + artist */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight">
                &ldquo;Razz My&#8209;Tazz Jazz&rdquo;
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                by{" "}
                <span className="text-[var(--text)] font-semibold">
                  Michael Scherer
                </span>{" "}
                — composer &amp; pianist
              </p>
            </div>

            {/* Pitch */}
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
              Invite his stream to your next dinner party or friendly gathering.
              The room changes. The mood flourishes. Michael has{" "}
              <em>the feel</em>, man — and every note proves it.
            </p>

            {/* 90% giveback callout */}
            <div
              className="border rounded-sm px-4 py-3 max-w-xl"
              style={{
                borderColor: "rgba(255,200,50,0.4)",
                background: "rgba(255,200,50,0.06)",
              }}
            >
              <p className="text-xs leading-relaxed" style={{ color: "rgb(255,200,50)" }}>
                <span className="font-bold">GPM Gift:</span> Michael is currently
                hospitalized and facing serious medical challenges. His wife and
                three kids are by his side. GPM is gifting his family{" "}
                <span className="font-bold">90 % of all profits</span> generated
                from his tracks. Every stream. Every purchase. His music is
                working for them right now.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mt-1">
              <Link
                href="/pricing"
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-opacity hover:opacity-90"
                style={{ background: "rgb(255,200,50)", color: "#030712" }}
              >
                Support Michael — Get Access
              </Link>
              <Link
                href="/invention"
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-[var(--border-bright)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                The Invention
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
