import { DEVS } from "./dev-content";
import { slugifyModel } from "./model-utils";

/**
 * Promoción del mes de un modelo, para el aviso de su tarjeta (PropertyCard).
 *
 * Sale de los bloques `promos` de dev-content.ts —el mismo lugar que alimenta
 * /promociones—, así que cada mes no hay nada extra que actualizar. La tarjeta
 * cuenta hacia `vence` y se apaga sola al pasar la fecha.
 *
 * Se busca por desarrollo + modelo: el Capua de Lirios no es el de Jardines 6.
 */
export type PromoTarjeta = {
  mes: string; // "noviembre"
  vence: string; // "2026-11-30"
  venceTexto: string; // "30 de noviembre"
  // true si no aplica en todo el desarrollo ("Antílope N, O, P y Q"): la
  // tarjeta lo dice para no prometer la promoción en cualquier unidad.
  seleccionadas: boolean;
  condicion: string | null; // "Con vista al estacionamiento"
};

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

type ModeloConPromo = { development: string; nombre_modelo: string; status?: string };

export function promoDeModelo(p: ModeloConPromo): PromoTarjeta | null {
  if (p.status === "Agotado") return null;
  const dev = Object.values(DEVS).find((d) => d.name === p.development);
  if (!dev?.promos) return null;
  const slug = slugifyModel(p.nombre_modelo);
  const items = dev.promos.items.filter((i) => i.modeloSlug === slug);
  if (items.length === 0) return null;

  const [, mm, dd] = dev.promos.vence.split("-").map(Number);
  const mes = MESES[mm - 1];
  return {
    mes,
    vence: dev.promos.vence,
    venceTexto: `${dd} de ${mes}`,
    seleccionadas: !items.some((i) => /todos los lotes/i.test(i.ubicaciones ?? "")),
    // Solo si TODAS las promociones del modelo la comparten: si una no la
    // pide, decirla en la tarjeta le quitaría clientes a esa otra.
    condicion: items.every((i) => i.condicion && i.condicion === items[0].condicion)
      ? items[0].condicion ?? null
      : null,
  };
}

/** Le agrega `promo` a cada modelo, para pasarlo tal cual a PropertyCard. */
export function conPromo<T extends ModeloConPromo>(props: T[]): (T & { promo: PromoTarjeta | null })[] {
  return props.map((p) => ({ ...p, promo: promoDeModelo(p) }));
}

/** Lo mismo para un solo modelo: `<PropertyCard property={conPromoUno(p)} />`. */
export function conPromoUno<T extends ModeloConPromo>(p: T): T & { promo: PromoTarjeta | null } {
  return { ...p, promo: promoDeModelo(p) };
}
