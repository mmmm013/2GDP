import Link from "next/link";

const accessPaths = [
  {
    label: "Consumer path",
    title: "Send a K-KUT HUG",
    body: "Gift buyers enter the live K-KUT product path: pick a feeling, hear samples, choose a HUG, and order a private link.",
    href: "https://www.k-kut.com/mom",
    cta: "Open HUG path",
  },
  {
    label: "Creator path",
    title: "Submit catalog for review",
    body: "Artists, writers, and rights holders can start a controlled 4PE review before anything becomes public or productized.",
    href: "/kreator-intake",
    cta: "Start intake",
  },
  {
    label: "Partner path",
    title: "Review GPMx inventions",
    body: "Partners, attorneys, and investors can review how GPMx turns source music into controlled, rights-aware music products.",
    href: "https://www.k-kut.com/som",
    cta: "View live proof",
  },
  {
    label: "Music path",
    title: "Explore source music",
    body: "Listeners can enter the GPM music world while the platform preserves separation between songs, sections, products, and behaviors.",
    href: "#music-behaviors",
    cta: "See behaviors",
  },
];

const behaviorStack = [
  {
    title: "STI",
    body: "Song-to-intent behavior: source music mapped to user purpose, emotional use, and product direction.",
  },
  {
    title: "STI-Slots",
    body: "Controlled placement slots for where a song, section, phrase, or moment can serve a defined user need.",
  },
  {
    title: "BTIs",
    body: "Behavior-triggered inventory: moments and assets organized by what a user is trying to do, send, feel, or prove.",
  },
  {
    title: "PIX",
    body: "Original source songs and catalog objects that feed GPMx review, sectioning, and future product life.",
  },
  {
    title: "K-KUT",
    body: "A controlled song-section product derived from real music and routed through defined use, access, and delivery rules.",
  },
  {
    title: "HUG / TUG",
    body: "Private-link music gifts and targeted-use gifts built from approved K-KUT moments.",
  },
];

const controls = [
  "Domain behavior routing",
  "Creator intake",
  "Rights-aware review",
  "Song-section productization",
  "Private-link delivery",
  "No raw-download gift flow",
  "Live product proof",
  "Patent/invention support trail",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#100804] text-[#F7E7C8]">
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="overflow-hidden rounded-[2rem] border border-[#D4A017]/35 bg-[#201106] shadow-2xl shadow-black/45">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.34em] text-[#FFD36A]">
                GPMx Flagship
              </p>

              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.92] text-[#FFD36A] sm:text-7xl">
                Music behavior infrastructure.
              </h1>

              <p className="mt-6 max-w-4xl text-xl font-bold leading-relaxed text-[#F7E7C8]/82">
                G Putnam Music is the central hub for GPMx: source music,
                creator intake, STI, STI-Slots, BTIs, PIX, K-KUTs, HUGs,
                TUGs, and 4PE-controlled music product behavior.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.k-kut.com/mom"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFD36A] px-7 py-4 text-base font-black uppercase tracking-wide text-[#201106] transition hover:bg-[#FFE7A3]"
                >
                  Live HUG proof →
                </a>

                <Link
                  href="/kreator-intake"
                  className="inline-flex items-center justify-center rounded-full border border-[#FFD36A]/45 px-7 py-4 text-base font-black uppercase tracking-wide text-[#FFD36A] transition hover:bg-[#FFD36A]/10"
                >
                  Creator intake
                </Link>
              </div>

              <p className="mt-6 max-w-3xl text-sm font-bold leading-relaxed text-[#F7E7C8]/62">
                K-KUT is one product domain. GPMx is the flagship system that
                controls source, behavior, access, review, and delivery.
              </p>
            </div>

            <div className="relative min-h-[430px] border-t border-[#D4A017]/25 bg-black/25 lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,211,106,0.22),transparent_34%),radial-gradient(circle_at_72%_75%,rgba(212,160,23,0.16),transparent_32%)]" />
              <div className="relative z-10 flex h-full min-h-[430px] items-center justify-center p-8">
                <div className="w-full max-w-md rounded-[2rem] border border-[#FFD36A]/30 bg-[#100804]/78 p-6 shadow-2xl">
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-[#FFD36A]">
                    Domain control
                  </p>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-[#F7E7C8]">
                    One flagship. Multiple behavior domains.
                  </h2>
                  <div className="mt-5 grid gap-2">
                    {["GPMx", "STI", "STI-Slots", "BTIs", "PIX", "K-KUT", "HUG/TUG", "4PE"].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-[#D4A017]/20 bg-black/25 px-4 py-3 text-sm font-black text-[#FFD36A]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D4A017]/25 p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
              Users choose the doorway
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              {accessPaths.map((path) => (
                <a
                  key={path.title}
                  href={path.href}
                  className="rounded-[1.5rem] border border-[#D4A017]/25 bg-black/20 p-5 transition hover:border-[#FFD36A]/70 hover:bg-[#FFD36A]/10"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4A017]">
                    {path.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-[#FFD36A]">
                    {path.title}
                  </h2>
                  <p className="mt-3 text-sm font-bold leading-6 text-[#F7E7C8]/72">
                    {path.body}
                  </p>
                  <p className="mt-5 text-sm font-black uppercase tracking-wide text-[#FFD36A]">
                    {path.cta} →
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <section
          id="music-behaviors"
          className="mt-10 rounded-[2rem] border border-[#D4A017]/30 bg-[#201106] p-7 sm:p-10"
        >
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
            Behavior stack
          </p>

          <h2 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-[#F7E7C8] sm:text-5xl">
            GPMx organizes music by what it can do.
          </h2>

          <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-[#F7E7C8]/72">
            A song is not only a track. It can become a section, a slot, a
            private message, a use case, a product, a proof object, or a
            controlled behavior inside a larger music-services platform.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {behaviorStack.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[#D4A017]/25 bg-black/20 p-5"
              >
                <h3 className="text-2xl font-black text-[#FFD36A]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-bold leading-6 text-[#F7E7C8]/72">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[#D4A017]/30 bg-[#201106] p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
              Live product proof
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#F7E7C8]">
              HUGs are featured, not the whole flagship.
            </h2>
            <p className="mt-5 text-base font-bold leading-8 text-[#F7E7C8]/72">
              The Mother’s Day K-KUT HUG path proves that GPMx can route a user
              from emotional intent to a real music moment, private delivery
              link, and checkout.
            </p>
            <a
              href="https://www.k-kut.com/mom"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#FFD36A] px-7 py-4 text-base font-black uppercase tracking-wide text-[#201106] transition hover:bg-[#FFE7A3]"
            >
              Open live HUG path
            </a>
          </div>

          <div className="rounded-[2rem] border border-[#D4A017]/30 bg-[#201106] p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
              Control layer
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {controls.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#D4A017]/20 bg-black/20 px-4 py-4 text-sm font-black text-[#F7E7C8]/82"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-[#D4A017]/30 bg-[#201106] p-7 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
            Founder / platform message
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#F7E7C8]">
            GPMx is the operating system. Products are the outputs.
          </h2>
          <p className="mt-5 max-w-5xl text-base font-bold leading-8 text-[#F7E7C8]/72">
            K-KUT, HUG, TUG, SOM, PIX, STI, STI-Slots, BTIs, and 4PE are not
            loose ideas. They are connected parts of a music-services platform
            designed to turn human-made source music into controlled behaviors,
            private experiences, commercial products, and rights-aware future
            use.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/kreator-intake"
              className="inline-flex items-center justify-center rounded-full bg-[#FFD36A] px-7 py-4 text-base font-black uppercase tracking-wide text-[#201106] transition hover:bg-[#FFE7A3]"
            >
              Start creator intake
            </Link>
            <a
              href="https://www.k-kut.com/som"
              className="inline-flex items-center justify-center rounded-full border border-[#FFD36A]/45 px-7 py-4 text-base font-black uppercase tracking-wide text-[#FFD36A] transition hover:bg-[#FFD36A]/10"
            >
              Review K-KUT product domain
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
