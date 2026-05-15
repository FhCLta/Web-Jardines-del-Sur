import type { Metadata } from "next";
import SiloPage from "../_lib/SiloPage";
import { buildSiloMetadata } from "../_lib/dev-meta";

export const metadata: Metadata = buildSiloMetadata("la-rioja-2");

export default function Page() {
  return <SiloPage slug="la-rioja-2" />;
}
