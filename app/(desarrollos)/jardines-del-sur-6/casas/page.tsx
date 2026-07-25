import type { Metadata } from "next";
import CatalogPage from "../../_lib/CatalogPage";
import { buildCatalogMetadata } from "../../_lib/dev-meta";

/* Pública e indexable: hereda index:true de buildCatalogMetadata.
   (El botón de descarga del folleto sigue oculto vía PreviewGate hasta
   terminar de pulir el brochure — eso no afecta la indexación de la página.) */
export const metadata: Metadata = buildCatalogMetadata("jardines-del-sur-6", "casas");

export default function Page() {
  return <CatalogPage slug="jardines-del-sur-6" kind="casas" />;
}
