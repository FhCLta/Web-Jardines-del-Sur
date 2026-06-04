"use client";

import { useEffect } from "react";
import Script from "next/script";

// Destino: chat de WhatsApp con mensaje prellenado que identifica al lead
// como proveniente de un anuncio de Google.
const WHATSAPP_URL =
  "https://wa.me/529982059044?text=Hola%2C%20vi%20su%20anuncio%20en%20Google%20y%20quiero%20informes%20sobre%20los%20modelos%20disponibles%20en%20Canc%C3%BAn.";

// Conversión "WhatsApp Click" de Google Ads (la misma que dispara GTM en el sitio).
const ADS_ID = "AW-18157218280";
const ADS_LABEL = "UXk0CJTznrIcEOjThNJD";

export default function WhatsAppRedirect() {
  useEffect(() => {
    // Pequeña pausa para que el beacon de conversión salga antes de navegar.
    // La redirección está garantizada aunque gtag esté bloqueado (adblock).
    const timer = window.setTimeout(() => {
      window.location.replace(WHATSAPP_URL);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        id="gtag-ads-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-ads-conversion" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ADS_ID}');
gtag('event', 'conversion', {send_to: '${ADS_ID}/${ADS_LABEL}'});`}
      </Script>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#0f172a",
          color: "#ffffff",
        }}
      >
        <p style={{ fontSize: "1.15rem", margin: 0, opacity: 0.9 }}>
          Abriendo WhatsApp…
        </p>
        <a
          href={WHATSAPP_URL}
          style={{
            color: "#25D366",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "1.05rem",
          }}
        >
          Si no abre solo, toca aquí para escribirnos
        </a>
      </main>
    </>
  );
}
