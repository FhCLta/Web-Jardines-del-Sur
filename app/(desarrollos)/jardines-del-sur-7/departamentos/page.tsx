import type { Metadata } from "next";
import CatalogPage from "../../_lib/CatalogPage";
import { buildCatalogMetadata } from "../../_lib/dev-meta";
import { DepartamentosJds7, deptosPuente } from "../ModelosJds7";

/* "Departamentos en Jardines del Sur 7": POR CONFIRMAR (promesa aprobada por
   Florencio, no escribir "llegaran"). Capta la busqueda y lleva a Capua y
   Cedro Plus del 6. Sin fichas de departamento del 7 a proposito: no hay
   modelo confirmado que describir. Pública e indexable. */
export const metadata: Metadata = buildCatalogMetadata(
  "jardines-del-sur-7",
  "departamentos",
  "Departamentos en Jardines del Sur 7, Cancún: por confirmar. Mientras tanto, Capua y Cedro Plus están disponibles en Jardines del Sur 6, con precios actualizados."
);

export default function Page() {
  return (
    <CatalogPage
      slug="jardines-del-sur-7"
      kind="departamentos"
      preventa={{
        eyebrowConteo: "POR CONFIRMAR",
        subtituloFuerte: "Por confirmar en Jardines del Sur 7",
        subtituloDetalle:
          "Mientras tanto, Capua y Cedro Plus están disponibles en Jardines\u00a0del\u00a0Sur\u00a06.",
        ctaTexto: "Ver departamentos disponibles",
        waMessage:
          "Hola, vi la página de departamentos de Jardines del Sur 7. Me interesan los departamentos disponibles en Jardines del Sur 6.",
        tituloModelos: `Conoce los ${deptosPuente.length} modelos`,
        introModelos: "En cuanto se confirmen los del 7, se publican aquí.",
        modelos: <DepartamentosJds7 />,
        fichas: [],
      }}
    />
  );
}
