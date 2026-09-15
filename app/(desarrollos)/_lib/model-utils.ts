import fs from "fs";
import path from "path";
import { getPrecioPublicado } from "@/lib/precios";

export type InventoryProperty = {
  id: string;
  development: string;
  status: string;
  nombre_modelo: string;
  /**
   * null solo en modelos anunciados sin precio (`precio_por_anunciar`). En
   * todos los demas es obligatorio y `getPrecioPublicado` revienta si falta.
   */
  precio: number | null;
  valor_avaluo?: number | null;
  /**
   * Modelo publicado ANTES de tener precio (Jardines del Sur 7 en preventa).
   * Es una excepcion declarada a proposito: sin esta marca, un modelo sin
   * precio revienta el build — que es justo lo que se quiere para los demas.
   */
  precio_por_anunciar?: boolean;
  /**
   * Oculto del SITIO sin borrarlo: no sale en silos, catalogos, precios,
   * sitemap ni "otras etapas", y su ficha no se genera (firebase.json la
   * redirige con 302). SIGUE en el cotizador, que lee data/precios.json y no
   * pasa por aqui. Para volver a mostrarlo: quitar la marca, quitar el 302 y
   * revisar los textos fijos del desarrollo que cuentan modelos o dicen "desde".
   */
  oculto_web?: boolean;
  precio_variable?: boolean;
  metros_construccion: number | null;
  metros_construccion_variable?: boolean;
  metros_terreno: number | null;
  levels: { nivel: number; desc: string }[];
  amenidades_key: string[];
  url_recorrido_virtual: string;
  images: string[];
};

export function slugifyModel(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInventory(): InventoryProperty[] {
  const filePath = path.join(process.cwd(), "data", "inventory.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);
  // inventory.json manda el CONTENIDO (fotos, niveles, amenidades, recorrido);
  // los PRECIOS los manda data/precios.json, que es la misma fuente que come el
  // cotizador. Asi un cambio de precio se hace en un solo lugar y la web y la
  // cotizacion formal no pueden contradecirse. Ver lib/precios.ts.
  return (data.inventory_stitch_2026 as InventoryProperty[])
    .filter((p) => !p.oculto_web)
    .map((p) =>
    // Los "por anunciar" NO pasan por getPrecioPublicado: esa funcion revienta
    // a proposito cuando falta un precio, y aqui la ausencia es intencional.
    p.precio_por_anunciar
      ? { ...p, precio: null, valor_avaluo: null }
      : { ...p, ...getPrecioPublicado(p.id) }
  );
}

export function getPropertiesByDev(devName: string): InventoryProperty[] {
  return getInventory().filter((p) => p.development === devName);
}

export function getPropertyBySlug(
  devName: string,
  modeloSlug: string
): InventoryProperty | null {
  return (
    getPropertiesByDev(devName).find(
      (p) => slugifyModel(p.nombre_modelo) === modeloSlug
    ) || null
  );
}

export function getModelStaticParams(devName: string): { modelo: string }[] {
  return getPropertiesByDev(devName).map((p) => ({
    modelo: slugifyModel(p.nombre_modelo),
  }));
}

export function parseStat(
  amenidadesKey: string[],
  regex: RegExp
): string | null {
  const found = amenidadesKey.find((a) => regex.test(a));
  if (!found) return null;
  const match = found.match(regex);
  return match ? match[1] : null;
}

export function getModelType(nombreModelo: string): "Casa" | "Departamento" | null {
  const match = nombreModelo.match(/^(Departamento|Casa)\s+/i);
  if (!match) return null;
  return match[1].toLowerCase() === "departamento" ? "Departamento" : "Casa";
}

/**
 * Importe en pesos. Los centavos se muestran SOLO si existen, y entonces con
 * los dos decimales: el neto del Noni Elite es $4,446,997.50 y `toLocaleString`
 * a secas lo escribía "4,446,997.5", que no es ni un entero ni una cantidad de
 * dinero bien escrita. Salía así en /precios, en la lista de La Rioja y en su
 * propia ficha.
 */
export function formatPriceMxn(price: number | null): string {
  if (!price) return "Precio por definir";
  return `$${formatMxnNumber(price)} MXN`;
}

/** Solo el número, sin el signo ni "MXN". Misma regla de centavos. */
export function formatMxnNumber(price: number): string {
  const conCentavos = !Number.isInteger(price);
  return price.toLocaleString("es-MX", {
    minimumFractionDigits: conCentavos ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

// Precio compacto para títulos SEO: 1853830 -> "$1.85M" (floor a 2 decimales
// para "desde": nunca sobrestima el mínimo real).
export function formatPriceShort(price: number): string {
  const millions = Math.floor(price / 10000) / 100;
  return `$${millions.toFixed(2)}M`;
}

/**
 * Los precios publicables de una lista de modelos, ya sin los "por anunciar".
 * Existe para no repetir el mismo filtro en las cuatro páginas de precios —y
 * para que el compilador sepa que después de filtrar ya no hay nulos.
 */
export function preciosPublicados(props: InventoryProperty[]): number[] {
  return props
    .map((p) => p.precio)
    .filter((n): n is number => n !== null && n > 0);
}

// Precio mínimo "desde" de un desarrollo, leído del inventario (fuente única).
// Hace que los títulos SEO se actualicen solos al cambiar precios.
export function getMinPriceByDev(devName: string): number | null {
  const prices = getPropertiesByDev(devName)
    .map((p) => p.precio)
    .filter((p): p is number => p !== null && p > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

export function getWhatsAppMessageForModel(property: InventoryProperty): string {
  const lower = property.nombre_modelo.toLowerCase();
  let text = property.nombre_modelo;
  let prefix = "la propiedad";

  if (lower.startsWith("casa modelo ")) {
    prefix = "la casa modelo";
    text = property.nombre_modelo.substring(12);
  } else if (lower.startsWith("casa ")) {
    prefix = "la casa modelo";
    text = property.nombre_modelo.substring(5);
  } else if (lower.startsWith("departamento modelo ")) {
    prefix = "el departamento modelo";
    text = property.nombre_modelo.substring(20);
  } else if (lower.startsWith("departamento ")) {
    prefix = "el departamento modelo";
    text = property.nombre_modelo.substring(13);
  }

  return `Hola, quiero cotizar ${prefix} ${text} en ${property.development}.`;
}
