"use client";

import Link from "next/link";

export default function SupePage() {
  return (
    <main className="min-h-screen bg-[#1A120B] text-[#F5E6C8]">
      <header className="border-b border-[#D4A017]/20 px-6 py-4 flex justify-between">
        <div className="font-bold text-[#D4A017]">SUPE Specialties</div>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-[#D4A017]">Home</Link>
          <Link href="/find" className="hover:text-[#D4A017]">Browse</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-[#C8A882]">
          Powered by 4PE PROMOTER
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Placement-ready music moments.
        </h1>

        <p className="mt-4 text-[#E8CFA8] max-w-2xl">
          Find, preview, and request real-audio placement moments for film,
          television, advertising, and branded content.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button className="px-6 py-3 bg-[#D4A017] text-black font-semibold rounded">
            Start Monthly Access
          </button>
          <button className="px-6 py-3 border border-[#D4A017]/40 rounded">
            Request Placement Review
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>

        <div className="grid gap-4">
          {[
            "Define your scene or placement need",
            "Search real-audio placement moments",
            "Preview and shortlist options",
            "Request placement or custom moment",
          ].map((step, i) => (
            <div
              key={i}
              className="p-4 border border-[#D4A017]/20 rounded bg-[#24180F]"
            >
              <span className="text-[#D4A017] font-bold mr-2">{i + 1}.</span>
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Access</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-5 border border-[#D4A017]/20 rounded bg-[#24180F]">
            <h3 className="font-bold mb-2">Monthly</h3>
            <p className="text-sm text-[#C8A882]">
              Full access. Cancel anytime, effective end of month.
            </p>
          </div>

          <div className="p-5 border border-[#D4A017]/20 rounded bg-[#24180F]">
            <h3 className="font-bold mb-2">Trial</h3>
            <p className="text-sm text-[#C8A882]">
              30-day trial. Use fully for 14 days before billing begins.
            </p>
          </div>

          <div className="p-5 border border-[#D4A017]/20 rounded bg-[#24180F]">
            <h3 className="font-bold mb-2">Enterprise</h3>
            <p className="text-sm text-[#C8A882]">
              Licensing or full acquisition available under premium terms.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="text-2xl font-bold mb-4">Security</h2>
        <p className="text-[#C8A882] max-w-2xl">
          4PE operates strictly at the process and infrastructure level. No
          financial data is accessed, processed, or stored.
        </p>
      </section>

      <footer className="border-t border-[#D4A017]/20 px-6 py-6 text-sm text-[#C8A882] text-center">
        SUPE Specialties — Powered by 4PE PROMOTER
      </footer>
    </main>
  );
}
