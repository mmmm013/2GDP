"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/invention", label: "Invention" },
  { href: "/demo", label: "Demo" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-[var(--border)]">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest text-[var(--accent)] accent-glow-text hover:opacity-90 transition-opacity"
        >
          K&#8209;KUT
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-widest uppercase transition-colors ${
                pathname === href
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="px-4 py-1.5 text-xs tracking-widest uppercase border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-colors rounded-sm"
          >
            Get Access
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[var(--text-muted)] hover:text-[var(--text)] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 space-y-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block text-xs tracking-widest uppercase py-2 transition-colors ${
                pathname === href
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-xs tracking-widest uppercase border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-colors rounded-sm text-center mt-2"
          >
            Get Access
          </Link>
        </div>
      )}
    </header>
  );
}
