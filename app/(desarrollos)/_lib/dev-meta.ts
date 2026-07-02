import type { Metadata } from "next";
import { DEVS, type DevSlug } from "./dev-content";
import {
  getInventory,
  slugifyModel,
  parseStat,
  formatPriceMxn,
  type InventoryProperty,
} from "./model-utils";

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
