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
 *   - Vale para TODOS                    → COMUN
 *   - Solo casas                         → POR_TIPO.Casa
 *   - Solo departamentos                 → POR_TIPO.Departamento
 *   - Solo cierto tipo, cierto desarrollo→ POR_DESARROLLO_Y_TIPO
 *
 * El tercer cajón existe porque el mismo modelo NO viene igual en todas partes:
 * el Capua y el Cedro Plus están tanto en Jardines del Sur 6 como en Lirios, y
 * lo que traen no tiene por qué coincidir. Se decide por desarrollo Y tipo, no
 * por nombre de modelo, que es lo que de verdad se repite.
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

type Tipo = "Casa" | "Departamento";

/** Lo propio de cada tipo, en cualquier desarrollo. */
const POR_TIPO: Record<Tipo, string[]> = {
  Casa: [],
  Departamento: [],
};

/**
 * Lo que solo trae cierto tipo en cierto desarrollo. La clave es el nombre del
 * desarrollo tal como viene en inventory.json.
 */
const POR_DESARROLLO_Y_TIPO: Record<string, Partial<Record<Tipo, string[]>>> = {
  "Jardines del Sur 6": {
    Departamento: ["Closets abiertos en 2 recámaras"],
  },
};

/**
 * Equipamiento de un modelo, ya resuelto: lo común primero y luego lo de su
 * tipo. Devuelve [] si el modelo no es casa ni departamento, para que la ficha
 * simplemente no pinte la sección en vez de inventarse una lista.
 */
export function getEquipamiento(property: InventoryProperty): string[] {
  const tipo = getModelType(property.nombre_modelo);
  if (!tipo) return [];
  return [
    ...COMUN,
    ...POR_TIPO[tipo],
    ...(POR_DESARROLLO_Y_TIPO[property.development]?.[tipo] ?? []),
  ];
}
