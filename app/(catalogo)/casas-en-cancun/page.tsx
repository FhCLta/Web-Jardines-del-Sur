import type { Metadata } from "next";
import TipoPage, { datosTipo } from "../_lib/TipoPage";
import { formatPriceMxn } from "@/app/(desarrollos)/_lib/model-utils";

// ⚠️ Tope practico ~60 caracteres. El titulo ataca "casas en venta en cancun",
// que NO es la consulta de /precios ("precios de casas y departamentos en
// Cancun") ni la de los silos. Una contesta cuanto cuestan; esta, cuales hay.
//
// Realismo, para que nadie lo re-litigue despues: "casas en cancun" a secas la
// dominan los portales (Inmuebles24, Vivanuncios, Lamudi) y no se va a ganar.
// Lo alcanzable son las variantes largas — "casas de 3 recamaras en cancun",
// "casas en venta en la zona sur de cancun" — que ademas traen mejor cliente.
const { disponibles, desde } = datosTipo("Casa");

const metaTitle = "Casas en Venta en Cancún | Altta Homes";
const metaDescription = `${disponibles.length} casas de tres recámaras en venta en la Zona Sur de Cancún${
  desde ? `, desde ${formatPriceMxn(desde)}` : ""
}. Fotos, metros, precios actualizados y atención directa por WhatsApp con un asesor autorizado de Altta Homes.`;

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/casas-en-cancun" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/casas-en-cancun",
    siteName: "Altta Homes Cancún",
    title: metaTitle,
    description: metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <TipoPage tipo="Casa" />;
}
