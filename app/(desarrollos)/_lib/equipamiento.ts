import { type InventoryProperty, getModelType } from "./model-utils";

/**
 * EQUIPAMIENTO DE LA VIVIENDA: lo que la casa o el departamento TRAE incluido.
 *
 * Es distinto de la DISTRIBUCIÓN, que dice cómo están repartidos los espacios.
 * Una responde "qué hay"; la otra, "cómo está acomodado".
 *
 * ⚠️ NO confundir con `equipment` de dev-content.ts, que es equipamiento del
 * DESARROLLO (caseta de acceso, macrocisterna, cerco eléctrico perimetral).
 * Aquello es del fraccionamiento; esto es de la vivienda.
 *
 * ── DÓNDE AGREGAR COSAS ──────────────────────────────────────────────────────
 *
 * Se resuelve por TIPO —casa o departamento— porque ahí es donde cambia. Meterlo
 * modelo por modelo en inventory.json habría sido copiar la misma lista doce
 * veces, y cambiar una coma obligaría a tocar los doce archivos: exactamente la
 * deuda que ya tiene el pie de página.
 *
 *   - Vale para TODOS          → COMUN
 *   - Solo casas               → POR_TIPO.Casa
 *   - Solo departamentos       → POR_TIPO.Departamento
 *
 * Si algún día un modelo suelto trae algo que ningún otro de su tipo tiene, ESE
 * es el momento de abrir un campo `equipamiento` en inventory.json — no antes.
 */

/** Lo que traen todas las viviendas, casa o departamento. */
const COMUN: string[] = [
  "Cocina equipada con barra de granito",
  "Campana",
  "Parrilla (sin instalar)",
];

/** Lo propio de cada tipo. Vacíos hoy; es donde entra lo que sigue. */
const POR_TIPO: Record<"Casa" | "Departamento", string[]> = {
  Casa: [],
  Departamento: [],
};

/**
 * Equipamiento de un modelo, ya resuelto: lo común primero y luego lo de su
 * tipo. Devuelve [] si el modelo no es casa ni departamento, para que la ficha
 * simplemente no pinte la sección en vez de inventarse una lista.
 */
export function getEquipamiento(property: InventoryProperty): string[] {
  const tipo = getModelType(property.nombre_modelo);
  if (!tipo) return [];
  return [...COMUN, ...POR_TIPO[tipo]];
}
