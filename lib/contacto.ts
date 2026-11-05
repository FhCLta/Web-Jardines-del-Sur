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

// DIRECCIÓN DE LA OFICINA DE VENTAS — UN SOLO LUGAR.
// Dirección dada por Florencio el 5 nov 2026. Antes la web decía
// "Av. 127 SM 342 MZ 27", que es lo que dice su perfil de Google.
// Para Google pesa que la dirección de la web y la del perfil digan lo mismo.

/** Calle, manzana, lote y supermanzana. */
export const OFFICE_CALLE = "Calle Tucán Mza 27 Lt 9, SM 341";
/** Para los datos de Google (JSON-LD): sin espacios duros. */
export const OFFICE_STREET = `${OFFICE_CALLE}, Jardines del Sur 6`;
export const OFFICE_POSTAL = "77536";
/** Como se ve en la página. Espacios duros: "Jardines del Sur 6" nunca deja el "6" solo. */
export const OFFICE_ADDRESS = `${OFFICE_CALLE}, Jardines\u00a0del\u00a0Sur\u00a06, ${OFFICE_POSTAL} Cancún, Q.R.`;

// PERFIL DE GOOGLE DE FLORENCIO: "Jardines del Sur 6 | Altta Homes Cancun"
// (agentes inmobiliarios, place id 0x8f4c2bd03e108b45:0xd4994ba93bc4b92d).
// ⚠️ Hasta el 5 nov 2026 la web enlazaba OTRO lugar, el link corto
// maps.app.goo.gl/9sKBR1fUNSswv5d19 (0x8f4c2b2036689c1f:0xa44142d0c992c304):
// hoy se llama solo "Jardines del Sur 6", con 132 reseñas, y no es su perfil.
// No volver a usarlo. Datos leídos del perfil el 5 nov 2026.
export const OFFICE_CID = "15319358797701757229";
/** Abre el perfil en Google Maps (y en la app del celular). */
export const OFFICE_MAP_URL = `https://www.google.com/maps?cid=${OFFICE_CID}`;
/** Link largo del perfil, para hasMap y sameAs del JSON-LD. */
export const OFFICE_PLACE_URL =
  "https://www.google.com/maps/place/Jardines+del+Sur+6+%7C+Altta+Homes+Cancun/@21.0826758,-86.8863806,17z/data=!3m1!4b1!4m6!3m5!1s0x8f4c2bd03e108b45:0xd4994ba93bc4b92d!8m2!3d21.0826758!4d-86.8863806!16s%2Fg%2F11ntrv9q7y";
export const OFFICE_GEO = { lat: 21.0826758, lng: -86.8863806 };
