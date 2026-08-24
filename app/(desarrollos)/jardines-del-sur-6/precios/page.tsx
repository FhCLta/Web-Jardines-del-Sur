import type { Metadata } from "next";
import PreciosDevPage from "../../_lib/PreciosDevPage";
import { DEVS } from "../../_lib/dev-content";
import { getPropertiesByDev, formatPriceMxn } from "../../_lib/model-utils";

const SLUG = "jardines-del-sur-6" as const;
const dev = DEVS[SLUG];
const props = getPropertiesByDev(dev.name);
const desde = Math.min(...props.map((p) => p.precio));

// ⚠️ Tope practico ~60 caracteres: Google corta ahi. El titulo ataca "precios
// de <desarrollo>", que es una consulta distinta de "<desarrollo>" —la que ya
// trabaja el silo—. Si se parecen, las dos paginas pelean por lo mismo.
const title = `Precios de ${dev.name} 2026 | Altta Homes Cancún`;
const description = `Lista de precios actualizada de ${dev.name}, Cancún: ${props.length} modelos desde ${formatPriceMxn(desde)}. Valor de avalúo, precio con descuento y cuánto ahorras en cada modelo.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `/${SLUG}/precios` },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: `/${SLUG}/precios`,
    siteName: "Altta Homes Cancún",
    title,
    description,
    images: [dev.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <PreciosDevPage slug={SLUG} />;
}
