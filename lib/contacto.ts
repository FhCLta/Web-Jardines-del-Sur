// NÚMERO DE CONTACTO DEL SITIO — UN SOLO LUGAR.
// Todos los botones de WhatsApp, el teléfono del pie, los datos para Google
// (JSON-LD) y /whatsapp leen de aquí. Para cambiar el número, se cambia SOLO
// este archivo, se compila y se publica.
//
// Historial: 998 205 9044 (hasta 28 oct 2026) → 998 109 8443 (bloqueado el
// 3 nov 2026) → 998 148 6819, TEMPORAL: es el de su jefe, Eduardo González
// Núñez, mientras Florencio activa su WhatsApp Business nuevo.
// ⚠️ El cotizador (public/cotizador) NO lee de aquí: ahí cada asesor tiene su
// propio teléfono en `datosAsesores`.

/** Formato internacional sin "+", para wa.me: 52 + lada + número. */
export const PHONE_E164 = "529981486819";
/** Para enlaces tel: y para el JSON-LD. */
export const PHONE_TEL = `+${PHONE_E164}`;
/** Como se ve escrito en la página. */
export const PHONE_DISPLAY = "+52 998 148 6819";
