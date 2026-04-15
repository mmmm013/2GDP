import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import FPPixBar from '@/components/FPPixBar';
import TrafficBeacon from '@/components/TrafficBeacon';

export const metadata: Metadata = {
  title: 'G Putnam Music',
  description: 'Dream The Stream',
  metadataBase: new URL('https://www.gputnammusic.com'),
  icons: {
    icon: '/gpm_logo.jpg',
    apple: '/gpm_logo.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'G Putnam Music',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#1a1207',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="bg-[#1a1207] text-[#F5e6c8] antialiased min-h-screen"
        style={{ backgroundColor: '#1a1207', color: '#F5e6c8' }}
      >
        <main className="relative w-full overflow-x-hidden">
          {children}
        </main>
        <TrafficBeacon />
        <FPPixBar />
        <Analytics />
      </body>
    </html>
  );
}
