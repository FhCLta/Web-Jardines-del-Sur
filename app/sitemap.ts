import type { MetadataRoute } from 'next';
import { getInventory, slugifyModel } from './(desarrollos)/_lib/model-utils';
import { DEVS, type DevSlug } from './(desarrollos)/_lib/dev-content';
import { getAllPosts } from './blog/_lib/posts';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const DEV_SLUG_BY_NAME: Record<string, DevSlug> = {
  'Jardines del Sur 6': 'jardines-del-sur-6',
  'Jardines del Sur 7': 'jardines-del-sur-7',
  'La Rioja 2': 'la-rioja-2',
  'Lirios Residencial 2': 'lirios-residencial-2',
};

// Páginas-catálogo compartibles ya publicadas (/dev/casas, /dev/departamentos).
// Agregar aquí cada nueva a medida que se publica.
const CATALOG_PAGES: { slug: DevSlug; kind: 'casas' | 'departamentos' }[] = [
  { slug: 'jardines-del-sur-6', kind: 'casas' },
  { slug: 'jardines-del-sur-6', kind: 'departamentos' },
  // Jardines del Sur 7 en preventa: captan "casas/departamentos en jardines
  // del sur 7" y llevan a lo que se vende hoy en el 6.
  { slug: 'jardines-del-sur-7', kind: 'casas' },
  { slug: 'jardines-del-sur-7', kind: 'departamentos' },
];

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
      url: `${SITE_URL}/${slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    {
      // Hub de la familia "Jardines del Sur": recupera el término que el sitio
      // perdió el 20 jun 2026 al cambiar los títulos a marca. Prioridad 0.9,
      // igual que /promociones: es página de entrada, no una ficha más.
      url: `${SITE_URL}/jardines-del-sur-cancun`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      // Hub que reune las promociones de todos los desarrollos. Prioridad alta
      // (0.9): es la que ataca las busquedas genericas de ciudad y la que
      // enlazan los footers de todo el sitio.
      url: `${SITE_URL}/promociones`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      // Hub del silo de precios. Misma logica que /promociones: ataca las
      // busquedas genericas de ciudad ("precios de casas en Cancun") mientras
      // que /precios/[dev] atacan las de marca.
      url: `${SITE_URL}/precios`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      // Catálogos por TIPO de producto, cruzando desarrollos. Prioridad 0.9
      // como /precios y /promociones: son páginas de entrada, no fichas.
      url: `${SITE_URL}/casas-en-cancun`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/departamentos-en-cancun`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/calculadora-hipotecaria`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
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
        url: `${SITE_URL}/${devSlug}/${modeloSlug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const promoEntries: MetadataRoute.Sitemap = (Object.keys(DEVS) as DevSlug[])
    .filter((slug) => DEVS[slug].promos)
    .map((slug) => ({
      url: `${SITE_URL}/${slug}/promociones`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const catalogEntries: MetadataRoute.Sitemap = CATALOG_PAGES.map(({ slug, kind }) => ({
    url: `${SITE_URL}/${slug}/${kind}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Silo de precios por desarrollo. Jardines del Sur 7 entra ANTES de tener
  // precios (decision de Florencio, 27 sept 2026): su pagina captura la
  // busqueda "precios jardines del sur 7" desde ya y se llena el dia que salgan.
  const precioEntries: MetadataRoute.Sitemap = (
    ['jardines-del-sur-6', 'la-rioja-2', 'lirios-residencial-2', 'jardines-del-sur-7'] as DevSlug[]
  ).map((slug) => ({
    url: `${SITE_URL}/${slug}/precios`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...baseEntries,
    ...promoEntries,
    ...precioEntries,
    ...catalogEntries,
    ...modelEntries,
    ...blogEntries,
  ];
}
