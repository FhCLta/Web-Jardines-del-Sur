import type { Metadata } from "next";
import PaginaCita, { metaDescription, metaTitle } from "./PaginaCita";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/agendar-cita" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: `${SITE_URL}/agendar-cita`,
    siteName: "Altta Homes Cancún",
    title: metaTitle,
    description: metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PaginaCita />;
}
