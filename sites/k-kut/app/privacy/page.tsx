import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "K-KUT Privacy Policy — how we collect, use, and protect your information.",
  alternates: { canonical: "https://k-kut.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="pt-14">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-8">
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--text-muted)] mb-10">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-10 text-sm text-[var(--text-muted)] leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">1. Who we are</h2>
              <p>
                K-KUT is a product of G Putnam Music, LLC (&quot;GPM&quot;,
                &quot;we&quot;, &quot;us&quot;). This policy applies to the
                K-KUT marketing site at{" "}
                <span className="text-[var(--accent)]">k-kut.com</span> and
                related services.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">2. Information we collect</h2>
              <ul className="space-y-2 list-none">
                <li className="flex gap-2">
                  <span className="text-[var(--accent)] mt-0.5">✦</span>
                  <span>
                    <strong className="text-[var(--text)]">Email address</strong> — when you sign up for notifications via our &quot;Get Notified&quot; form.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--accent)] mt-0.5">✦</span>
                  <span>
                    <strong className="text-[var(--text)]">Optional note</strong> — if you provide a preferred plan or message in the notification form.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--accent)] mt-0.5">✦</span>
                  <span>
                    <strong className="text-[var(--text)]">Usage data</strong> — standard server logs (IP address, browser type, pages visited) for security and analytics.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">3. How we use your information</h2>
              <p>We use the information we collect to:</p>
              <ul className="mt-2 space-y-1 list-none">
                {[
                  "Send you product availability notifications (only if you opted in)",
                  "Process payments via Stripe (if you purchase a plan)",
                  "Improve and secure our site",
                  "Comply with legal obligations",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--accent)] mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">4. Data storage and security</h2>
              <p>
                Notification sign-ups are stored in Supabase (supabase.com),
                which provides secure, encrypted database storage. Payment data
                is handled entirely by Stripe (stripe.com) — we never store
                your card details.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">5. Third-party services</h2>
              <p>We use the following third-party services:</p>
              <ul className="mt-2 space-y-1">
                {[
                  "Supabase — database and authentication",
                  "Stripe — payment processing",
                  "Vercel — hosting and analytics",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--accent)] mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                Each service has its own privacy policy. We encourage you to
                review them.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">6. Your rights</h2>
              <p>
                You may request access to, correction of, or deletion of your
                personal data at any time by contacting us at{" "}
                <a
                  href="mailto:privacy@gputnammusic.com"
                  className="text-[var(--accent)] hover:opacity-80"
                >
                  privacy@gputnammusic.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">7. Children</h2>
              <p>
                K-KUT is not directed at children under 13. We do not
                knowingly collect personal information from children under 13.
                If you believe a child under 13 has provided us with personal
                information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">8. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. We will notify
                users of material changes via email or a prominent notice on
                the site.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">9. Contact</h2>
              <p>
                G Putnam Music, LLC
                <br />
                <a
                  href="mailto:privacy@gputnammusic.com"
                  className="text-[var(--accent)] hover:opacity-80"
                >
                  privacy@gputnammusic.com
                </a>
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
