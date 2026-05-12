"use client";
// Wrapper cliente para cargar FloatingWhatsApp de forma diferida (ssr: false)
// No se puede usar dynamic con ssr:false en un Server Component (page.tsx),
// por eso este wrapper actúa como puente.
import dynamic from "next/dynamic";

const FloatingWhatsApp = dynamic(() => import("./FloatingWhatsApp"), {
  ssr: false,
});

export default function FloatingWhatsAppLazy() {
  return <FloatingWhatsApp />;
}
