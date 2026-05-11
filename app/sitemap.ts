import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-05-11T00:00:00-05:00');

  return [
    {
      url: 'https://jardinesdelsurcancun.mx',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
