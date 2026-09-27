import type { Metadata } from "next";
import { DEVS, type DevSlug } from "./dev-content";
import {
  getInventory,
  getPropertiesByDev,
  getModelType,
  slugifyModel,
  parseStat,
  formatPriceMxn,
  type InventoryProperty,
} from "./model-utils";

/**
 * Páginas-catálogo (presentaciones compartibles): "Casas en X", "Departamentos en X".
 * Título largo con marca+keyword (SEO) y URL corta `/dev/casas` (compartir).
 * kind acota el inventario del desarrollo a un solo tipo de producto.
 */
export type CatalogKind = "casas" | "departamentos";

/**
 * `descripcionPreventa`: para un desarrollo sin precios (Jardines del Sur 7) la
 * descripcion armada con conteo y "desde" no aplica — la pone la pagina. El
 * titulo NO cambia: "Casas en X | Altta Homes Cancún" en todos.
 */
export function buildCatalogMetadata(
  slug: DevSlug,
  kind: CatalogKind,
  descripcionPreventa?: string
): Metadata {
  const dev = DEVS[slug];
  const tipo = kind === "casas" ? "Casa" : "Departamento";
  const productoPlural = kind === "casas" ? "Casas" : "Departamentos";
  const productoLower = kind === "casas" ? "casas" : "departamentos";
  const canonical = `/${dev.slug}/${kind}`;

  const props = getPropertiesByDev(dev.name).filter(
    (p) => getModelType(p.nombre_modelo) === tipo
  );
  const count = props.length;
  const minPrice = props.length
    ? Math.min(
        ...props
          .map((p) => p.precio)
          .filter((n): n is number => n !== null && n > 0)
      )
    : null;
  const nombres = props.map((p) => p.nombre_modelo.replace(/^(Casa|Departamento)\s+/i, ""));
  const listaNombres =
    nombres.length > 1
      ? `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`
      : nombres[0] ?? "";

  const title = `${productoPlural} en ${dev.name} | Altta Homes Cancún`;
  const description =
    descripcionPreventa ??
    `${count} ${productoLower} en venta en ${dev.name}, Cancún: ${listaNombres}.${
      minPrice ? ` Desde ${formatPriceMxn(minPrice)}.` : ""
    } Fotos, precios actualizados, amenidades y atención directa por WhatsApp.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: canonical,
      siteName: "Altta Homes Cancún",
      title,
      description,
      images: [
        {
          url: dev.ogImage,
          width: 1200,
          height: 630,
          alt: `${productoPlural} en ${dev.name} · Altta Homes Cancún`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [dev.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function buildSiloMetadata(slug: DevSlug): Metadata {
  const dev = DEVS[slug];
  const canonical = `/${dev.slug}`;
  const ogImageUrl = dev.ogImage;

  // Título limpio y coherente por silo: "[Desarrollo] | [Producto] en Cancún".
  const title = dev.seoTitleLead;

  return {
    title: { absolute: title },
    description: dev.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: canonical,
      siteName: "Altta Homes Cancún",
      title,
      description: dev.metaDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${dev.name} · Altta Homes Cancún`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dev.metaDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function buildModelMetadata(
  devSlug: DevSlug,
  modeloSlug: string
): Metadata {
  const dev = DEVS[devSlug];
  const property: InventoryProperty | undefined = getInventory().find(
    (p) =>
      p.development === dev.name &&
      slugifyModel(p.nombre_modelo) === modeloSlug
  );

  if (!property) {
    return {
      title: { absolute: `Modelo no encontrado | Altta Homes Cancún` },
    };
  }

  const recamaras = parseStat(property.amenidades_key, /^([\d.]+)\s*Rec/i);
  const banos = parseStat(property.amenidades_key, /^([\d.]+)\s*Ba/i);

  // Un modelo anunciado sin precio no puede decir "Desde $X" ni "null m²". El
  // titulo cambia el gancho por el que SI tiene: que la preventa esta por abrir.
  const porAnunciar = property.precio === null;
  // Confirmado para la etapa pero no abre con ella: NO decir "preventa por
  // abrir" ni "uno de los primeros modelos" — seria prometer de mas.
  const llegaDespues = porAnunciar && property.llega_despues === true;

  const title = llegaDespues
    ? `${property.nombre_modelo} en ${dev.name}, Cancún · Próximamente | Altta Homes`
    : porAnunciar
    ? `${property.nombre_modelo} en ${dev.name}, Cancún · Preventa por Abrir | Altta Homes`
    : `${property.nombre_modelo} en ${dev.name}, Cancún · Desde ${formatPriceMxn(property.precio)} | Altta Homes`;

  const ficha = [
    property.metros_construccion
      ? `${property.metros_construccion} m² de construcción`
      : null,
    property.metros_terreno ? `${property.metros_terreno} m² de terreno` : null,
    recamaras ? `${recamaras} recámaras` : null,
    banos ? `${banos} baños` : null,
  ].filter(Boolean).join(", ");

  const description = llegaDespues
    ? `${property.nombre_modelo} llegará a ${dev.name}, Cancún, más adelante. Precios por anunciar. Mientras tanto, está disponible en Jardines del Sur 6: escríbenos por WhatsApp.`
    : porAnunciar
    ? `${property.nombre_modelo}, uno de los primeros modelos de ${dev.name}, Cancún. Precios, metros y planos se anuncian al abrir la preventa. Escríbenos por WhatsApp y te avisamos el día que salgan.`
    : `${property.nombre_modelo}: ${ficha}. Desde ${formatPriceMxn(property.precio)}. Recorrido virtual 360°, precios actualizados y atención directa por WhatsApp.`;
  const canonical = `/${dev.slug}/${modeloSlug}`;
  const ogImage = property.images[0] || dev.ogImage;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: canonical,
      siteName: "Altta Homes Cancún",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${property.nombre_modelo} · ${dev.name} · Altta Homes Cancún`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
