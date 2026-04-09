import type { Metadata } from 'next';

type Params = { id: string };

function selectOgImage(id: string): string {
  const normalized = id.toLowerCase();
  if (normalized.startsWith('mkut-') || normalized.startsWith('mk-') || normalized.startsWith('mini-')) {
    return '/hero-Music is Feeling.jpg';
  }
  if (
    normalized.startsWith('love-') ||
    normalized.startsWith('rom-') ||
    normalized.startsWith('vday-') ||
    normalized.startsWith('heart-')
  ) {
    return '/cover_love_renews.jpg';
  }
  return '/k-hero.jpg';
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const image = selectOgImage(id);

  return {
    title: 'K-KUT Gateway | G Putnam Music',
    description: 'Gateway opening sequence for K-KUT and mini-KUT links.',
    openGraph: {
      title: 'K-KUT Gateway',
      description: 'Open your K-KUT or mini-KUT experience.',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      images: [image],
    },
  };
}

export default function KGatewayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
