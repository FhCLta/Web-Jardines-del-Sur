import fs from "fs";
import path from "path";
import { getPrecioPublicado } from "@/lib/precios";

export type InventoryProperty = {
  id: string;
  development: string;
  status: string;
  nombre_modelo: string;
  precio: number;
  valor_avaluo?: number;
  precio_variable?: boolean;
  metros_construccion: number;
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
  return (data.inventory_stitch_2026 as InventoryProperty[]).map((p) => ({
    ...p,
    ...getPrecioPublicado(p.id),
  }));
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

export function formatPriceMxn(price: number | null): string {
  if (!price) return "Precio por definir";
  return `$${price.toLocaleString("es-MX")} MXN`;
}

// Precio compacto para títulos SEO: 1853830 -> "$1.85M" (floor a 2 decimales
// para "desde": nunca sobrestima el mínimo real).
export function formatPriceShort(price: number): string {
  const millions = Math.floor(price / 10000) / 100;
  return `$${millions.toFixed(2)}M`;
}

// Precio mínimo "desde" de un desarrollo, leído del inventario (fuente única).
// Hace que los títulos SEO se actualicen solos al cambiar precios.
export function getMinPriceByDev(devName: string): number | null {
  const prices = getPropertiesByDev(devName)
    .map((p) => p.precio)
    .filter((p) => p > 0);
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
