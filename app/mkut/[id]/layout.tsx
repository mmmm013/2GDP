import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'mini-KUT Player | G Putnam Music',
  description: 'Open a mini-KUT prefab player with dedicated ambient visuals.',
  openGraph: {
    title: 'mini-KUT Player',
    description: 'A focused mini-KUT playback experience.',
    images: ['/hero-Music is Feeling.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/hero-Music is Feeling.jpg'],
  },
};

export default function MKutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
