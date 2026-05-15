import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE_URL = 'https://jardinesdelsurcancun.mx';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-05-15T00:00:00-05:00');

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/desarrollos-cancun/jardines-del-sur-6`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/desarrollos-cancun/la-rioja-2`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/desarrollos-cancun/lirios-residencial-2`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
