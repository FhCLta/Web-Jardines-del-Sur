import type { Metadata } from "next";
import WhatsAppRedirect from "./WhatsAppRedirect";

export const metadata: Metadata = {
  title: "Redirigiendo a WhatsApp",
  description: "Te estamos conectando con un asesor de Altta Homes por WhatsApp.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <WhatsAppRedirect />;
}
