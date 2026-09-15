import type { Metadata } from "next";
import CatalogPage from "../../_lib/CatalogPage";
import { buildCatalogMetadata } from "../../_lib/dev-meta";

/* Pública e indexable: hereda index:true de buildCatalogMetadata. */
export const metadata: Metadata = buildCatalogMetadata("jardines-del-sur-6", "casas");

export default function Page() {
  return <CatalogPage slug="jardines-del-sur-6" kind="casas" />;
}
