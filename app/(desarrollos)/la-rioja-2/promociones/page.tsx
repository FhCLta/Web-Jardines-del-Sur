import type { Metadata } from "next";
import PromosPage from "../../_lib/PromosPage";
import { DEVS } from "../../_lib/dev-content";

const SLUG = "la-rioja-2" as const;
const dev = DEVS[SLUG];

const title = "Promociones en La Rioja 2 | Altta Homes Cancún";
const description =
  "Promociones y descuentos vigentes en La Rioja 2, Cancún: descuentos, minisplits y paquetes en casas residenciales premium. Consulta la promoción del mes con un asesor autorizado de Altta Homes por WhatsApp.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `/${SLUG}/promociones` },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: `/${SLUG}/promociones`,
    siteName: "Altta Homes Cancún",
    title,
    description,
    images: [
      {
        url: dev.ogImage,
        width: 1200,
        height: 630,
        alt: `Promociones ${dev.name} · Altta Homes Cancún`,
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
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <PromosPage slug={SLUG} />;
}
