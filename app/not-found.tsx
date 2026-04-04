import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-yellow-400/8 blur-[140px]" />
      </div>

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        {/* Beat icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/5 text-4xl">
          🎵
        </div>

        {/* Status code */}
        <p className="mb-2 text-xs font-black tracking-widest uppercase text-yellow-400/60">
          404
        </p>

        {/* Headline */}
        <h1 className="mb-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Skipped a Beat
        </h1>

        {/* Sub-copy */}
        <p className="mb-2 max-w-sm text-base text-gray-400 leading-relaxed">
          The page you&apos;re looking for has skipped a beat.
        </p>
        <p className="mb-10 max-w-sm text-sm text-gray-500">
          Try sharing a usable link, or head back to the music.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3.5 text-sm font-black text-black shadow-lg shadow-yellow-500/20 transition-all hover:from-yellow-300 hover:to-amber-400"
          >
            Return Home
          </Link>
          <Link
            href="/kupid"
            className="inline-flex items-center justify-center rounded-full border border-yellow-400/30 px-8 py-3.5 text-sm font-bold text-yellow-300 transition-all hover:bg-yellow-400/10"
          >
            Browse K-KUTs
          </Link>
        </div>

        {/* Divider + suggestion */}
        <div className="mt-14 flex flex-col items-center gap-1 text-gray-600 text-xs">
          <span>G Putnam Music LLC · All Rights Reserved</span>
          <span>gputnammusic.com</span>
        </div>
      </main>
    </div>
  );
}