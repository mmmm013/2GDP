import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'K-kUpId Hub | G Putnam Music',
  description: 'K-KUT, mini-KUT, and creator tiers in one visual hub.',
  openGraph: {
    title: 'K-kUpId Hub',
    description: 'Launch K-KUT and mini-KUT experiences with the K-kUpId system.',
    images: ['/k-hero-alternate.JPG'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/k-hero-alternate.JPG'],
  },
};

export default function KupidLayout({ children }: { children: React.ReactNode }) {
  return children;
}
