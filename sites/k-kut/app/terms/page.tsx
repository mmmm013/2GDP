import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "K-KUT Terms of Service — rules for using the K-KUT platform.",
  alternates: { canonical: "https://k-kut.com/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-14">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-8">
            Terms of Service
          </h1>
          <p className="text-xs text-[var(--text-muted)] mb-10">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-10 text-sm text-[var(--text-muted)] leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">1. Acceptance of terms</h2>
              <p>
                By accessing or using K-KUT (&quot;the Service&quot;), you
                agree to be bound by these Terms of Service and our Privacy
                Policy. If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">2. Description of service</h2>
              <p>
                K-KUT is a product of G Putnam Music, LLC that enables users
                to access, share, and send exact excerpts from professional,
                registered audio tracks (&quot;K-KUTs&quot;). Access to
                K-KUTs is provided through a subscription plan.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">3. Accounts and subscriptions</h2>
              <ul className="space-y-2">
                {[
                  "You must provide accurate information when creating an account.",
                  "You are responsible for maintaining the security of your account credentials.",
                  "Subscription fees are billed monthly in advance via Stripe.",
                  "You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.",
                  "We reserve the right to change pricing with 30 days' notice.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--accent)] mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">4. Use of audio content</h2>
              <p>
                K-KUT audio excerpts are licensed for personal, non-commercial
                sharing only. You may not:
              </p>
              <ul className="mt-2 space-y-1">
                {[
                  "Download, copy, or redistribute audio files",
                  "Use K-KUTs for commercial purposes without a separate license",
                  "Attempt to circumvent any digital rights management or technical restrictions",
                  "Use K-KUTs in a way that infringes the rights of creators or rights holders",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--accent)] mt-0.5">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">5. Intellectual property</h2>
              <p>
                All K-KUT product names, designs, logos, and the K-KUT
                invention itself are the intellectual property of G Putnam
                Music, LLC. Audio content is licensed from rights holders and
                remains their property.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">6. Disclaimers</h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF
                ANY KIND. WE DO NOT GUARANTEE UNINTERRUPTED ACCESS AND RESERVE
                THE RIGHT TO MODIFY OR DISCONTINUE FEATURES AT ANY TIME.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">7. Limitation of liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, G PUTNAM MUSIC, LLC
                SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR
                CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">8. Governing law</h2>
              <p>
                These terms are governed by the laws of the State of Illinois,
                United States, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[var(--text)] mb-3">9. Contact</h2>
              <p>
                G Putnam Music, LLC
                <br />
                <a
                  href="mailto:legal@gputnammusic.com"
                  className="text-[var(--accent)] hover:opacity-80"
                >
                  legal@gputnammusic.com
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
