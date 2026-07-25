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

export function buildCatalogMetadata(slug: DevSlug, kind: CatalogKind): Metadata {
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
    ? Math.min(...props.map((p) => p.precio).filter((n) => n > 0))
    : null;
  const nombres = props.map((p) => p.nombre_modelo.replace(/^(Casa|Departamento)\s+/i, ""));
  const listaNombres =
    nombres.length > 1
      ? `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`
      : nombres[0] ?? "";

  const title = `${productoPlural} en ${dev.name} | Altta Homes Cancún`;
  const description = `${count} ${productoLower} en venta en ${dev.name}, Cancún: ${listaNombres}.${
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

  const title = `${property.nombre_modelo} en ${dev.name}, Cancún · Desde ${formatPriceMxn(property.precio)} | Altta Homes`;
  const description = `${property.nombre_modelo}: ${property.metros_construccion} m² de construcción${property.metros_terreno ? `, ${property.metros_terreno} m² de terreno` : ""}${recamaras ? `, ${recamaras} recámaras` : ""}${banos ? `, ${banos} baños` : ""}. Desde ${formatPriceMxn(property.precio)}. Recorrido virtual 360°, precios actualizados y atención directa por WhatsApp.`;
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
