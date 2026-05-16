import type { MetadataRoute } from 'next';
import { getInventory, slugifyModel } from './desarrollos-cancun/_lib/model-utils';
import { DEVS, type DevSlug } from './desarrollos-cancun/_lib/dev-content';

export const dynamic = 'force-static';

const SITE_URL = 'https://jardinesdelsurcancun.mx';

const DEV_SLUG_BY_NAME: Record<string, DevSlug> = {
  'Jardines del Sur 6': 'jardines-del-sur-6',
  'La Rioja 2': 'la-rioja-2',
  'Lirios Residencial 2': 'lirios-residencial-2',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-05-15T00:00:00-05:00');

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...(Object.keys(DEVS) as DevSlug[]).map((slug) => ({
      url: `${SITE_URL}/desarrollos-cancun/${slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];

  const modelEntries: MetadataRoute.Sitemap = getInventory()
    .map((property) => {
      const devSlug = DEV_SLUG_BY_NAME[property.development];
      if (!devSlug) return null;
      const modeloSlug = slugifyModel(property.nombre_modelo);
      return {
        url: `${SITE_URL}/desarrollos-cancun/${devSlug}/${modeloSlug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return [...baseEntries, ...modelEntries];
}
