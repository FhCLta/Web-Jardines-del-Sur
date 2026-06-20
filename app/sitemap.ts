import type { MetadataRoute } from 'next';
import { getInventory, slugifyModel } from './desarrollos-cancun/_lib/model-utils';
import { DEVS, type DevSlug } from './desarrollos-cancun/_lib/dev-content';
import { getAllPosts } from './blog/_lib/posts';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const DEV_SLUG_BY_NAME: Record<string, DevSlug> = {
  'Jardines del Sur 6': 'jardines-del-sur-6',
  'La Rioja 2': 'la-rioja-2',
  'Lirios Residencial 2': 'lirios-residencial-2',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
    // Próximo desarrollo (página "Próximamente", aún sin inventario en DEVS).
    {
      url: `${SITE_URL}/desarrollos-cancun/jardines-del-sur-7`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/preguntas-frecuentes`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

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

  return [...baseEntries, ...modelEntries, ...blogEntries];
}
