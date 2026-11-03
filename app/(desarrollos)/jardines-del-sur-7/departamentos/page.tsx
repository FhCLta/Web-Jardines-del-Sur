import type { Metadata } from "next";
import CatalogPage from "../../_lib/CatalogPage";
import { buildCatalogMetadata } from "../../_lib/dev-meta";
import { DepartamentosJds7, deptosLlegan } from "../ModelosJds7";

/* "Departamentos en Jardines del Sur 7": Capua y Cedro Plus CONFIRMADOS para
   el 7 (3 nov 2026), llegan cuando se acaben los del 6 — igual que Flamboyan y
   Ceiba. Capta la busqueda, enlaza sus fichas del 7 y lleva a lo que se vende
   hoy en el 6. Pública e indexable. */
export const metadata: Metadata = buildCatalogMetadata(
  "jardines-del-sur-7",
  "departamentos",
  "Departamentos en Jardines del Sur 7, Cancún: Capua y Cedro Plus llegarán más adelante. Mientras tanto, están disponibles en Jardines del Sur 6, con precios actualizados."
);

export default function Page() {
  return (
    <CatalogPage
      slug="jardines-del-sur-7"
      kind="departamentos"
      preventa={{
        eyebrowConteo: `${deptosLlegan.length} MODELOS`,
        subtituloFuerte: "Capua y Cedro Plus · Precios por anunciar",
        subtituloDetalle:
          "Llegarán más adelante a Jardines del Sur 7. Mientras tanto, están disponibles en Jardines\u00a0del\u00a0Sur\u00a06.",
        ctaTexto: "Ver departamentos disponibles",
        waMessage:
          "Hola, vi la página de departamentos de Jardines del Sur 7. Me interesan los departamentos disponibles en Jardines del Sur 6.",
        tituloModelos: `Conoce los ${deptosLlegan.length} modelos`,
        introModelos: "Precios, metros y planos se anuncian más adelante.",
        modelos: <DepartamentosJds7 />,
        fichas: deptosLlegan,
      }}
    />
  );
}
