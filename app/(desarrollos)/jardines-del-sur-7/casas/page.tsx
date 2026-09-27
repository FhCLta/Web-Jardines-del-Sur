import type { Metadata } from "next";
import CatalogPage from "../../_lib/CatalogPage";
import { buildCatalogMetadata } from "../../_lib/dev-meta";
import { CasasJds7, casasAbren, casasLlegan } from "../ModelosJds7";

/* "Casas en Jardines del Sur 7": una pagina por busqueda, como el silo del 6.
   Pública e indexable (index:true de buildCatalogMetadata). Todo lo que se
   vende hoy lleva al 6 — ver ModelosJds7.tsx para lo que se promete. */
export const metadata: Metadata = buildCatalogMetadata(
  "jardines-del-sur-7",
  "casas",
  "Casas en Jardines del Sur 7, Cancún: abre con Tabachín y Noni; Flamboyán y Ceiba llegarán más adelante. Mientras tanto, casas disponibles en Jardines del Sur 6."
);

const fichas = [...casasAbren, ...casasLlegan];

export default function Page() {
  return (
    <CatalogPage
      slug="jardines-del-sur-7"
      kind="casas"
      preventa={{
        eyebrowConteo: `${fichas.length} MODELOS`,
        subtituloFuerte: "Abre con Tabachín y Noni · Precios por anunciar",
        subtituloDetalle:
          "Flamboyán y Ceiba llegarán más adelante. Mientras tanto, hay casas disponibles en Jardines\u00a0del\u00a0Sur\u00a06.",
        ctaTexto: "Ver las casas",
        waMessage:
          "Hola, vi las casas de Jardines del Sur 7 en Cancún. Quiero información de la preventa y de las casas disponibles en Jardines del Sur 6.",
        tituloModelos: `Conoce los ${fichas.length} modelos`,
        introModelos:
          "Precios, metros y planos se anuncian al abrir la preventa.",
        modelos: <CasasJds7 />,
        fichas,
      }}
    />
  );
}
