import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import FPPixBar from '@/components/FPPixBar';
import { headers } from 'next/headers';
import { getBrandConfig, type BrandDomain } from '@/config/brandConfig';

// Dynamic metadata based on brand
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const brand = (headersList.get('x-brand-domain') || 'GPM') as BrandDomain;
  const config = getBrandConfig(brand);

  return {
    title: config.name,
    description: config.tagline,
    icons: {
      icon: '/gpm_logo.jpg',
      apple: '/gpm_logo.jpg',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: config.name,
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#1a1207',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const brand = (headersList.get('x-brand-domain') || 'GPM') as BrandDomain;
  const isKFS = brand === 'KFS';

  // Brand-specific background colors
  const bgColor = isKFS ? '#1a0f05' : '#1a1207';
  const textColor = isKFS ? '#F5E6D3' : '#F5e6c8';

  return (
    <html lang="en">
      <body
        className={`${
          isKFS ? 'bg-[#1a0f05] text-[#F5E6D3]' : 'bg-[#1a1207] text-[#F5e6c8]'
        } antialiased min-h-screen overflow-x-hidden`}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <main className="relative w-full">
          {children}
        </main>
        <FPPixBar />
        <Analytics />
      </body>
    </html>
  );
}
