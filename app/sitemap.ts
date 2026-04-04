import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.gputnammusic.com';
  const routes = [
    '',
    '/about',
    '/who',
    '/heroes',
    '/gift',
    '/join',
    '/contact',
    '/artists',
    '/jazz',
    '/mip',
    '/ships',
    '/singalongs',
    '/terms',
    '/privacy',
    '/kleigh',
    '/uru',
    '/valentines',
    '/scherer',
    '/inventions',
    '/kupid',
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
