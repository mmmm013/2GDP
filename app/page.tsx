import Link from "next/link";

const userPaths = [
  {
    title: "Send a K-KUT HUG",
    label: "Gift buyers",
    body: "Pick a feeling, hear real music samples, choose a HUG, and send a private K-KUT link.",
    href: "https://www.k-kut.com/mom",
    cta: "Send Mom a HUG",
  },
  {
    title: "Submit catalog for review",
    label: "Artists / writers / rights holders",
    body: "Start a free interest review for songs, sections, hooks, and future K-KUT potential.",
    href: "/kreator-intake",
    cta: "Start review",
  },
  {
    title: "See the invention system",
    label: "Partners / attorneys / investors",
    body: "Review the K-KUT, HUG, SOM, and 4PE operating model behind the live product path.",
    href: "https://www.k-kut.com/som",
    cta: "View K-KUT",
  },
  {
    title: "Hear GPM music",
    label: "Listeners",
    body: "Explore the human-made source music that powers GPM, PIX, and future music products.",
    href: "#gpm-music",
    cta: "Explore music",
  },
];

const systemProof = [
  "Human-made PIX source songs",
  "K-KUT song-section products",
  "HUG/TUG private gift links",
  "mini-KUT emotional moments",
  "4PE intake, review, and delivery control",
  "No raw-download public gift flow",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#120A05] text-[#F7E7C8]">
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="overflow-hidden rounded-[2rem] border border-[#D4A017]/35 bg-[#211207] shadow-2xl shadow-black/45">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.34em] text-[#FFD36A]">
                G Putnam Music
              </p>

              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] text-[#FFD36A] sm:text-7xl">
                Human-made music inventions.
              </h1>

              <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed text-[#F7E7C8]/82">
                GPM is the BIC-Level Music Services Platform for PIX songs,
                K-KUTs, HUGs, mini-KUTs, artist intake, rights-aware review,
                and real-audio product delivery.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.k-kut.com/mom"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFD36A] px-7 py-4 text-base font-black uppercase tracking-wide text-[#211207] transition hover:bg-[#FFE7A3]"
                >
                  Send Mom a K-KUT HUG →
                </a>

                <Link
                  href="/kreator-intake"
                  className="inline-flex items-center justify-center rounded-full border border-[#FFD36A]/45 px-7 py-4 text-base font-black uppercase tracking-wide text-[#FFD36A] transition hover:bg-[#FFD36A]/10"
                >
                  Submit catalog
                </Link>
              </div>

              <p className="mt-6 max-w-2xl text-sm font-bold leading-relaxed text-[#F7E7C8]/62">
                Buyers go to K-KUT. Artists and partners start here. Users rule
                the path.
              </p>
            </div>

            <div className="relative min-h-[420px] border-t border-[#D4A017]/25 bg-black/25 lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,211,106,0.24),transparent_34%),radial-gradient(circle_at_68%_70%,rgba(212,160,23,0.16),transparent_32%)]" />
              <div className="relative z-10 flex h-full min-h-[420px] items-center justify-center p-8">
                <div className="w-full max-w-md rounded-[2rem] border border-[#FFD36A]/30 bg-[#120A05]/72 p-6 shadow-2xl">
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-[#FFD36A]">
                    Live invention proof
                  </p>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-[#F7E7C8]">
                    K-KUT HUGs are live for Mother’s Day.
                  </h2>
                  <p className="mt-4 text-sm font-bold leading-7 text-[#F7E7C8]/72">
                    Pick the feeling. Hear samples. Choose a HUG. Order the
                    private link.
                  </p>
                  <a
                    href="https://www.k-kut.com/mom"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#FFD36A] px-5 py-4 text-sm font-black uppercase tracking-wide text-[#211207]"
                  >
                    Try the live Mom path
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D4A017]/25 p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
              Choose your path
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              {userPaths.map((path) => (
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

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#D4A017]/30 bg-[#211207] p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
              BIC-Level MSP
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#F7E7C8]">
              Music services built as a controlled system.
            </h2>
            <p className="mt-5 text-base font-bold leading-8 text-[#F7E7C8]/72">
              GPM combines human-made music, rights-aware review, emotional-use
              mapping, section-based audio products, and private-link delivery
              into one Music Services Platform.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#D4A017]/30 bg-[#211207] p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
              Platform pieces
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {systemProof.map((item) => (
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

        <section
          id="gpm-music"
          className="mt-10 rounded-[2rem] border border-[#D4A017]/30 bg-[#211207] p-7 sm:p-10"
        >
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD36A]">
            GPM music
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#F7E7C8]">
            Source music with future product life.
          </h2>
          <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-[#F7E7C8]/72">
            A full song can be a release. A section can become a K-KUT. A
            moment can become a HUG. A phrase can become a future music product.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://www.k-kut.com/som"
              className="inline-flex items-center justify-center rounded-full border border-[#FFD36A]/45 px-7 py-4 text-base font-black uppercase tracking-wide text-[#FFD36A] transition hover:bg-[#FFD36A]/10"
            >
              See Sound of Moment
            </a>
            <Link
              href="/kreator-intake"
              className="inline-flex items-center justify-center rounded-full bg-[#FFD36A] px-7 py-4 text-base font-black uppercase tracking-wide text-[#211207] transition hover:bg-[#FFE7A3]"
            >
              Start free interest review
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
