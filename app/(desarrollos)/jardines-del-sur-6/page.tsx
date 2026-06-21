import type { Metadata } from "next";
import SiloPage from "../_lib/SiloPage";
import { buildSiloMetadata } from "../_lib/dev-meta";

export const metadata: Metadata = buildSiloMetadata("jardines-del-sur-6");

export default function Page() {
  return <SiloPage slug="jardines-del-sur-6" />;
}
