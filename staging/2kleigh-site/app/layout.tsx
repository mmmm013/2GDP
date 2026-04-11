import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KLEIGH — The Legacy Collection',
  description:
    'KLEIGH is a G Putnam Music product brand. Stream The Legacy Collection — activity-based mood streaming, Behind the Music stories, and the KUB sponsorship program.',
  icons: { icon: '/logo.png', apple: '/logo.png' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'KLEIGH' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0d0a06',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d0a06] text-[#F5e6c8] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
