/**
 * DEFINICIÓN DE LOS SITIOS DEL PROYECTO
 *
 * ⚠️ ANDAMIAJE — TODAVÍA NO ESTÁ CONECTADO AL BUILD.
 * Ningún archivo importa este módulo, así que hoy no cambia absolutamente nada
 * en producción. Es el esqueleto de la configuración multisitio para cuando
 * Florencio decida las 3 preguntas abiertas (ver sites/README.md).
 *
 * ⚠️ LEER ANTES DE ACTIVAR: sites/RIESGOS.md — hay 4 riesgos altos, y dos de
 * ellos (medición mezclada y CAPI rota en silencio) no se notan a simple vista.
 */

export type SiteKey = "altta" | "jds";

export type SiteConfig = {
  /** Dominio canónico, sin diagonal final. Alimenta SITE_URL. */
  url: string;
  /** Nombre de la marca para títulos y Open Graph. */
  brand: string;
  /** Carpeta de salida del build estático. */
  outDir: string;
  /** Target de Firebase Hosting (firebase.json + .firebaserc). */
  firebaseTarget: string;
  /**
   * true  = index,follow (compite en Google)
   * false = noindex,nofollow
   *
   * ⚠️ DECISIÓN CRÍTICA. Ver R1 en RIESGOS.md: hoy alttahomescancun.mx es #1
   * para "jardines del sur 7" con 47.7% de CTR, y ese desarrollo abre venta en
   * sep-oct 2026. Publicar el sitio 2 indexable arriesga ese primer lugar por
   * competir contra uno mismo.
   */
  indexable: boolean;
  /**
   * Desarrollos que incluye el sitio. `null` = todos.
   * El sitio 2 no debería llevar La Rioja ni Lirios: no pintan nada en un
   * dominio llamado "jardines del sur" y aumentan la superposición.
   */
  devs: string[] | null;
  /** Publicar el cotizador interno en este sitio. Ver R7. */
  incluirCotizador: boolean;
  /**
   * Identificadores de medición. Si los dos sitios comparten los mismos, sus
   * datos se mezclan y se pierde justamente lo que se quería medir (R3).
   * `null` = sin medición en ese canal.
   */
  tracking: {
    gtmId: string | null;
    googleAdsId: string | null;
    metaDatasetId: string | null;
  };
};

export const SITES: Record<SiteKey, SiteConfig> = {
  /** El sitio actual. Estos valores reproducen EXACTAMENTE lo que hay hoy en
   *  producción: activar el multisitio no debe cambiarle nada. */
  altta: {
    url: "https://alttahomescancun.mx",
    brand: "Altta Homes Cancún",
    outDir: "out",
    firebaseTarget: "altta",
    indexable: true,
    devs: null,
    incluirCotizador: true,
    tracking: {
      gtmId: "GTM-53BHDRWC",
      googleAdsId: "AW-18157218280",
      metaDatasetId: "2016457592282966",
    },
  },

  /** El sitio 2. TODO lo de aquí abajo está PENDIENTE DE DECISIÓN. */
  jds: {
    url: "https://jardinesdelsurcancun.com.mx",
    brand: "Jardines del Sur Cancún",
    outDir: "out-jds",
    firebaseTarget: "jds",

    // DECISIÓN 2 — arranca en false a propósito (ver R1).
    indexable: false,

    // DECISIÓN 1 — solo Jardines del Sur, sin La Rioja ni Lirios.
    devs: ["jardines-del-sur-6", "jardines-del-sur-7"],

    // R7: el cotizador es herramienta interna, no se publica en el sitio 2.
    incluirCotizador: false,

    // DECISIÓN 3 — en null hasta decidir si la medición va junta o separada.
    // ⚠️ Si se reutilizan los mismos identificadores del sitio 1, los datos se
    // mezclan y ya no se puede saber cuál sitio convierte mejor.
    tracking: {
      gtmId: null,
      googleAdsId: null,
      metaDatasetId: null,
    },
  },
};

/** Sitio que se compila. Lo fija la variable de entorno del script de build. */
export const CURRENT_SITE: SiteKey =
  (process.env.NEXT_PUBLIC_SITE as SiteKey) || "altta";

export const site = SITES[CURRENT_SITE];
