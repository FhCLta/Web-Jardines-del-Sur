import type { Metadata } from "next";
import PaginaCita, { textosDe } from "./PaginaCita";
import { SITE_URL } from "@/lib/site";

const { titulo, descripcion } = textosDe();

export const metadata: Metadata = {
  title: { absolute: titulo },
  description: descripcion,
  alternates: { canonical: "/agendar-cita" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: `${SITE_URL}/agendar-cita`,
    siteName: "Altta Homes Cancún",
    title: titulo,
    description: descripcion,
  },
  twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PaginaCita />;
}
