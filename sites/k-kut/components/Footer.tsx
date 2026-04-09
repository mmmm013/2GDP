import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--text-muted)] tracking-wide">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-semibold text-[var(--accent)] tracking-widest">
            K&#8209;KUT
          </span>
          <span>Send a Feeling.</span>
          <span className="mt-1">
            From{" "}
            <a
              href="https://gputnammusic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text)] transition-colors"
            >
              GPM
            </a>
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/invention" className="hover:text-[var(--text)] transition-colors">
            Invention
          </Link>
          <Link href="/demo" className="hover:text-[var(--text)] transition-colors">
            Demo
          </Link>
          <Link href="/pricing" className="hover:text-[var(--text)] transition-colors">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-[var(--text)] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--text)] transition-colors">
            Terms
          </Link>
        </nav>

        <p className="text-center md:text-right">
          &copy; {year} K-KUT / G Putnam Music, LLC.
          <br />
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
