"use client";

// Tracking de Meta SIN el script pesado del Pixel (fbevents.js ~245 KB):
// el navegador solo manda mini-beacons (~1 KB) a /api/meta-capi y la
// Firebase Function los reenvía a Meta por la Conversions API.
//
// - PageView: en cada carga de página (canal servidor únicamente).
// - Contact: en cada clic a wa.me. Si el Pixel de GTM siguiera presente,
//   también dispara fbq con el MISMO event_id (Meta deduplica); cuando el
//   Pixel se pausa en GTM, queda solo el canal servidor.
// - Matching: genera/persiste _fbp (mismo formato que el Pixel) y construye
//   _fbc a partir del parámetro fbclid de los anuncios de Meta — así la
//   calidad de coincidencia se mantiene sin cargar fbevents.js.

import { useEffect } from "react";

const ENDPOINT = "/api/meta-capi";
const COOKIE_DAYS = 90;

function getCookie(name) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function setCookie(name, value) {
  const exp = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}

function newEventId() {
  return (
    (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
    `ev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  );
}

// _fbp con el mismo formato que crea el Pixel: fb.1.<ms>.<aleatorio>
function ensureFbp() {
  let fbp = getCookie("_fbp");
  if (!fbp) {
    fbp = `fb.1.${Date.now()}.${Math.floor(Math.random() * 1e10)}`;
    setCookie("_fbp", fbp);
  }
  return fbp;
}

// _fbc a partir del fbclid que traen los clics de anuncios de Meta
function ensureFbc() {
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      setCookie("_fbc", fbc);
      return fbc;
    }
  } catch {}
  return getCookie("_fbc");
}

// Modo prueba: visitar el sitio con ?capi_test=TESTxxxx (código de la pestaña
// "Probar eventos" de Meta) hace que TODA la sesión mande los eventos con ese
// código → se ven en vivo en la pestaña de pruebas. Los visitantes normales
// no llevan código y sus eventos van a producción.
function getTestCode() {
  try {
    const qp = new URLSearchParams(window.location.search).get("capi_test");
    if (qp) sessionStorage.setItem("capi_test", qp);
    return sessionStorage.getItem("capi_test") || undefined;
  } catch {
    return undefined;
  }
}

function sendEvent(eventName, eventId, fbp, fbc) {
  try {
    const payload = JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      fbp,
      fbc,
      test_event_code: getTestCode(),
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
}

export default function MetaContactTracker() {
  useEffect(() => {
    const fbp = ensureFbp();
    const fbc = ensureFbc();

    // PageView por servidor en cada carga de página
    sendEvent("PageView", newEventId(), fbp, fbc);

    const onClick = (e) => {
      const link = e.target && e.target.closest && e.target.closest("a[href]");
      if (!link || !/wa\.me/.test(link.href)) return;

      const eventId = newEventId();

      // Canal navegador solo si el Pixel de GTM sigue cargado (transición)
      try {
        if (typeof window.fbq === "function") {
          window.fbq("track", "Contact", {}, { eventID: eventId });
        }
      } catch {}

      sendEvent("Contact", eventId, getCookie("_fbp") || fbp, getCookie("_fbc") || fbc);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
