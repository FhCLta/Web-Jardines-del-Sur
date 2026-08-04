import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /cotizador es la herramienta interna del asesor (app estatica en
      // public/cotizador). No es contenido para el cliente: sin enlaces desde
      // el sitio, fuera del sitemap y con <meta robots="noindex"> propio.
      disallow: '/cotizador',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
