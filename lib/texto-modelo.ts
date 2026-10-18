// Concordancia de los nombres de modelo en los textos (sobre todo los mensajes
// de WhatsApp, que le llegan tal cual a Florencio). "Casa Tabachín" es femenino
// y "Departamento Capua" / "Modelo Capua" masculino; escribirlo a mano en cada
// plantilla dio "del Casa Ceiba" y "Casa Tabachín está agotado". Una sola regla.

const esFemenino = (nombre: string) => /^casa\b/i.test(nombre.trim());

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

/** "las casas" · "los departamentos" */
export function conArticuloPlural(plural: string): string {
  return `${/^departamentos?\b/i.test(plural.trim()) ? "los" : "las"} ${plural}`;
}
