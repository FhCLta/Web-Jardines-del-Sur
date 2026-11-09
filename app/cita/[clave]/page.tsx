import type { Metadata } from "next";
import PaginaCita, { metaDescription, metaTitle } from "@/app/agendar-cita/PaginaCita";

// Links CORTOS para el botón "Reserva" de cada perfil de Google (9 nov 2026):
// alttahomescancun.mx/cita/la-rioja-2 en vez de
// /agendar-cita?desarrollo=la-rioja-2&desde=google. Son páginas de verdad (200),
// no redirecciones: Google no acepta acortadores en ese campo. Abren la misma
// página de citas con el desarrollo ya elegido y avisan en el mensaje que la
// cita viene de Google. No se indexan: la página para Google es /agendar-cita.
const CLAVES: Record<string, string> = {
  "jardines-6": "jardines-del-sur-6",
  "jardines-7": "jardines-del-sur-7",
  "la-rioja-2": "la-rioja-2",
  "lirios-2": "lirios-residencial-2",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CLAVES).map((clave) => ({ clave }));
}

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/agendar-cita" },
  robots: { index: false, follow: true },
};

export default async function Page({
  params,
}: {
  params: Promise<{ clave: string }>;
}) {
  const { clave } = await params;
  return <PaginaCita inicial={CLAVES[clave]} desdeGoogle />;
}
