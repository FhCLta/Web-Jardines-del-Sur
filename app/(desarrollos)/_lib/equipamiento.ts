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
 * Tres cajones, de lo general a lo particular. Se suman en ese orden:
 *
 *   - Vale para TODAS las viviendas     → COMUN
 *   - Todas las casas / todos los depas → POR_TIPO
 *   - Un modelo concreto                → POR_MODELO
 *
 * TODO el equipamiento vive en este archivo, en uno de los tres. Que no se
 * reparta entre aquí e inventory.json: si estuviera en dos sitios habría que
 * acordarse de cuál mirar, y tarde o temprano se contradicen.
 *
 * POR_MODELO se lleva lo que depende del modelo Y del desarrollo a la vez,
 * porque el mismo nombre NO trae lo mismo en todas partes: el Capua de Lirios
 * lleva closets abiertos en 3 recámaras y el de Jardines del Sur 6 en 2. Por eso
 * la llave es el id del inventario, que ya distingue los dos.
 */

type Tipo = "Casa" | "Departamento";

/** Lo que traen todas las viviendas, casa o departamento. */
const COMUN: string[] = [
  "Cocina equipada con barra de granito",
  "Campana",
  "Parrilla (sin instalar)",
  // Va justo despues de la parrilla a proposito: el contraste importa. La
  // parrilla llega SIN instalar y el tanque CON instalacion, y leidos seguidos
  // no queda duda de cual es cual.
  "Tanque de gas estacionario e instalación",
];

/** Lo propio de cada tipo, en cualquier desarrollo. */
const POR_TIPO: Record<Tipo, string[]> = {
  // Las 8 casas tienen 3 recamaras, verificado contra inventory.json. Si algun
  // dia entra una casa de 2, este renglon deja de ser cierto para ella y hay que
  // bajarlo a POR_MODELO.
  Casa: ["Closets abiertos en 3 recámaras"],
  Departamento: ["Centro de lavado"],
};

/**
 * Lo de un modelo concreto. La llave es el `id` de data/inventory.json — no el
 * nombre del modelo, que se repite entre desarrollos.
 */
const POR_MODELO: Record<string, string[]> = {
  "jds6-capua": ["Closets abiertos en 2 recámaras"],
  "jds6-cedro-plus": ["Closets abiertos en 2 recámaras"],
  "lirios2-capua": ["Closets abiertos en 3 recámaras"],
  "lirios2-cedro-plus": ["Closets abiertos en 2 recámaras"],
};

/**
 * Equipamiento de un modelo, ya resuelto: lo común, luego lo de su tipo, luego
 * lo suyo. Devuelve [] si el modelo no es casa ni departamento, para que la
 * ficha simplemente no pinte la sección en vez de inventarse una lista.
 */
export function getEquipamiento(property: InventoryProperty): string[] {
  const tipo = getModelType(property.nombre_modelo);
  if (!tipo) return [];
  return [
    ...COMUN,
    ...POR_TIPO[tipo],
    ...(POR_MODELO[property.id] ?? []),
  ];
}
