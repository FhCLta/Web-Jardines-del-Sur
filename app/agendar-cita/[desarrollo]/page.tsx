import type { Metadata } from "next";
import PaginaCita, { PAGINAS, textosDe } from "../PaginaCita";
import { SITE_URL } from "@/lib/site";

// Una página de citas por desarrollo (/agendar-cita/la-rioja-2…), con su
// propio título para Google y el desarrollo ya elegido en el calendario.

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGINAS).map((desarrollo) => ({ desarrollo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ desarrollo: string }>;
}): Promise<Metadata> {
  const { desarrollo } = await params;
  const { titulo, descripcion } = textosDe(desarrollo);
  const ruta = `/agendar-cita/${desarrollo}`;
  return {
    title: { absolute: titulo },
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: `${SITE_URL}${ruta}`,
      siteName: "Altta Homes Cancún",
      title: titulo,
      description: descripcion,
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
    robots: { index: true, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ desarrollo: string }>;
}) {
  const { desarrollo } = await params;
  return <PaginaCita desarrollo={desarrollo} />;
}
