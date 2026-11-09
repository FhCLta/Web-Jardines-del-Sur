// Concordancia de los nombres de modelo en los textos (sobre todo los mensajes
// de WhatsApp, que le llegan tal cual a Florencio). "Casa Tabachín" es femenino
// y "Departamento Capua" / "Modelo Capua" masculino; escribirlo a mano en cada
// plantilla dio "del Casa Ceiba" y "Casa Tabachín está agotado". Una sola regla.

export const esFemenino = (nombre: string) => /^casa\b/i.test(nombre.trim());

/** "Cotizarla" (casa) · "Cotizarlo" (departamento) */
export function cotizarlo(nombre: string): string {
  return esFemenino(nombre) ? "Cotizarla" : "Cotizarlo";
}

/** "la que" (casa) · "el que" (departamento): "Me interesa la que está…" */
export function elQue(nombre: string): string {
  return esFemenino(nombre) ? "la que" : "el que";
}

/** "la Casa Ceiba" · "el Departamento Capua" */
export function conArticulo(nombre: string): string {
  return `${esFemenino(nombre) ? "la" : "el"} ${nombre}`;
}

/** "de la Casa Ceiba" · "del Departamento Capua" · "del Modelo Capua" */
export function deModelo(nombre: string): string {
  return `${esFemenino(nombre) ? "de la" : "del"} ${nombre}`;
}

/** "agotada" para una casa, "agotado" para lo demás. */
export function agotadoDe(nombre: string): string {
  return esFemenino(nombre) ? "agotada" : "agotado";
}

// Texto alternativo (alt) de las fotos de los modelos. Google lo lee para
// saber qué muestra cada foto; antes todas decían "Casa Ceiba - imagen 9".
// Las fotos con nombre descriptivo (docs/fotos-modelos.md) traen el espacio al
// final: "casa-ceiba-jardines-del-sur-6-cocina-y-comedor.webp".
const ESPACIOS: Record<string, string> = {
  "area-de-lavado": "Área de lavado",
  balcon: "Balcón",
  bano: "Baño",
  "bano-y-vestidor": "Baño y vestidor",
  "barra-y-lavado": "Barra y área de lavado",
  cocina: "Cocina",
  "cocina-comedor-sala": "Cocina, comedor y sala",
  "cocina-con-barra": "Cocina con barra",
  "cocina-detalle": "Detalle de la cocina",
  "cocina-y-comedor": "Cocina y comedor",
  comedor: "Comedor",
  "comedor-cocina-y-sala": "Comedor, cocina y sala",
  "comedor-sala-y-escalera": "Comedor, sala y escalera",
  "comedor-y-cocina": "Comedor y cocina",
  "comedor-y-sala": "Comedor y sala",
  escalera: "Escalera",
  estancia: "Estancia",
  estudio: "Estudio",
  fachada: "Fachada",
  "fachada-edificio": "Fachada del edificio",
  jardin: "Jardín",
  patio: "Patio",
  recamara: "Recámara",
  "recamara-2": "Segunda recámara",
  "recamara-3": "Tercera recámara",
  "recamara-principal": "Recámara principal",
  "recamara-principal-2": "Recámara principal, otra vista",
  recibidor: "Recibidor",
  "roof-garden": "Roof garden",
  sala: "Sala",
  "sala-2": "Sala, otra vista",
  "sala-comedor": "Sala y comedor",
  "sala-comedor-cocina": "Sala, comedor y cocina",
  "sala-comedor-y-escalera": "Sala, comedor y escalera",
  "sala-de-tv": "Sala de TV",
  "sala-y-comedor": "Sala y comedor",
  terraza: "Terraza",
  vestidor: "Vestidor",
};

/**
 * "Cocina y comedor de la Casa Ceiba en Jardines del Sur 6".
 * Una foto con nombre genérico ("2.webp") no dice qué muestra, así que no se
 * inventa: "Casa Ceiba en Jardines del Sur 6, foto 2".
 */
export function altDeFoto(src: string, modelo: string, desarrollo: string, numero: number): string {
  const archivo = decodeURIComponent(src.split("/").pop() ?? "").replace(/\.\w+$/, "");
  const etiqueta =
    archivo.match(/-(?:jardines-del-sur-\d+|la-rioja-2|lirios-residencial-2)-(.+)$/)?.[1] ??
    (archivo === "fachada" ? "fachada" : null);
  const espacio = etiqueta ? ESPACIOS[etiqueta] : undefined;
  if (!espacio) return `${modelo} en ${desarrollo}, foto ${numero}`;
  return `${espacio} ${deModelo(modelo)} en ${desarrollo}`;
}

/** "las casas" · "los departamentos" */
export function conArticuloPlural(plural: string): string {
  return `${/^departamentos?\b/i.test(plural.trim()) ? "los" : "las"} ${plural}`;
}
