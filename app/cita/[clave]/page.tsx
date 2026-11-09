import type { Metadata } from "next";
import PaginaCita, { textosDe } from "@/app/agendar-cita/PaginaCita";

// Links CORTOS para el botón "Reserva" de cada perfil de Google (9 nov 2026):
// alttahomescancun.mx/cita/la-rioja-2. Son páginas de verdad (200), no
// redirecciones: Google no acepta acortadores en ese campo. Muestran la página
// de citas del desarrollo y avisan en el mensaje que la cita viene de Google.
// No se indexan: su canonical es /agendar-cita/<desarrollo>.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clave: string }>;
}): Promise<Metadata> {
  const { clave } = await params;
  const { titulo, descripcion } = textosDe(CLAVES[clave]);
  return {
    title: { absolute: titulo },
    description: descripcion,
    alternates: { canonical: `/agendar-cita/${CLAVES[clave]}` },
    robots: { index: false, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ clave: string }>;
}) {
  const { clave } = await params;
  return <PaginaCita desarrollo={CLAVES[clave]} desdeGoogle />;
}
