import './globals.css';
import type { Metadata, Viewport } from 'next';
import { BraveEagleBanner } from './brave-banner';

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
