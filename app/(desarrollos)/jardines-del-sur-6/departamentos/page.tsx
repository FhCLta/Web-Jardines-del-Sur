import type { Metadata } from "next";
import CatalogPage from "../../_lib/CatalogPage";
import { buildCatalogMetadata } from "../../_lib/dev-meta";

/* Jardines del Sur 6 es el único desarrollo con casas Y departamentos, así que
   es el único que necesita las dos páginas-catálogo. Pública e indexable:
   hereda index:true de buildCatalogMetadata. */
export const metadata: Metadata = buildCatalogMetadata(
  "jardines-del-sur-6",
  "departamentos"
);

export default function Page() {
  return <CatalogPage slug="jardines-del-sur-6" kind="departamentos" />;
}
