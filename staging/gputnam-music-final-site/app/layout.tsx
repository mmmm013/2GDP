import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'G Putnam Music',
  description: 'Dream The Stream — The One Stop Song Shop',
  icons: {
    icon: '/gpm_logo.jpg',
    apple: '/gpm_logo.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'G Putnam Music',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#1a1207',
};

// ── BRAVE Eagle Banner ────────────────────────────────────────────────────────
// Founder's standing notice — Michael Scherer family & GPM profit sharing.
function BraveEagleBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-[#0a1e35] via-[#0d2440] to-[#0a1e35] border-b border-[#4da6ff]/30 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-xs text-[#F5e6c8]/75 leading-relaxed">
          <span className="text-[#4da6ff] font-black">🦅 BRAVE</span>
          {' '}— Almost ALL GPM revenues support{' '}
          <a href="/scherer" className="text-[#D4A017] font-bold hover:underline">Michael Scherer</a>
          {' '}& family — battling auto-immune illness.{' '}
          <span className="opacity-70">Devout. All-American. Kind as kind comes.</span>
          {' '}Artists:{' '}
          <a href="/scherer" className="text-[#D4A017] hover:underline font-semibold">Michael Scherer</a>
          {', '}
          <a href="/kleigh" className="text-[#C8A882] hover:underline font-semibold">KLEIGH</a>
          {', Lloyd G Miller.'}
        </p>
        <a
          href="/join"
          className="shrink-0 bg-[#4da6ff] text-[#0a1e35] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full hover:bg-[#7ec3ff] transition-colors whitespace-nowrap"
        >
          ⛵ Ships — Profit Share
        </a>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#1a1207] text-[#F5e6c8] antialiased min-h-screen">
        <BraveEagleBanner />
        <main className="relative w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
