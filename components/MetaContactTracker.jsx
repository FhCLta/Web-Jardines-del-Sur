"use client";

// Evento "Contact" de Meta en cada clic a WhatsApp (wa.me), por DOS canales
// con el MISMO event_id para que Meta deduplique:
//   1. Navegador: fbq('track','Contact') — si el Pixel de GTM ya cargó.
//   2. Servidor: sendBeacon a /api/meta-capi (Firebase Function → CAPI).
// El canal de servidor esquiva bloqueadores de anuncios y las restricciones
// de iOS; el de navegador aporta mejor matching. Juntos = mejor señal para
// la optimización de campañas de Meta. No toca el tracking de Google (GTM).

import { useEffect } from "react";

const ENDPOINT = "/api/meta-capi";

function getCookie(name) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export default function MetaContactTracker() {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target && e.target.closest && e.target.closest("a[href]");
      if (!link || !/wa\.me/.test(link.href)) return;

      const eventId =
        (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
        `wa-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      // Canal navegador (si el Pixel de GTM está presente)
      try {
        if (typeof window.fbq === "function") {
          window.fbq("track", "Contact", {}, { eventID: eventId });
        }
      } catch {}

      // Canal servidor (CAPI) — sendBeacon sobrevive a la navegación
      try {
        const payload = JSON.stringify({
          event_name: "Contact",
          event_id: eventId,
          event_source_url: window.location.href,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
        });
        const blob = new Blob([payload], { type: "application/json" });
        if (!(navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob))) {
          fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
