import type { Metadata } from "next";
import { DEVS, type DevSlug } from "./dev-content";

export function buildSiloMetadata(slug: DevSlug): Metadata {
  const dev = DEVS[slug];
  const canonical = `/desarrollos-cancun/${dev.slug}`;
  const ogImageUrl = dev.ogImage;

  return {
    title: { absolute: dev.metaTitle },
    description: dev.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: canonical,
      siteName: "Jardines del Sur Cancún",
      title: dev.metaTitle,
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
      title: dev.metaTitle,
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
