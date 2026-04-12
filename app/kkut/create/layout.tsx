import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'K-KUT Creator | G Putnam Music',
  description: 'Create K-KUT and mini-KUT links with signature GPM visuals.',
  openGraph: {
    title: 'K-KUT Creator',
    description: 'Build and share K-KUT links with signature visual handoff styling.',
    images: ['/k-hero.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/k-hero.jpg'],
  },
};

export default function KKutCreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
