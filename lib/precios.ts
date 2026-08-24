// Fuente unica de precios: data/precios.json.
//
// El MISMO archivo alimenta al cotizador interno (via
// scripts/gen-cotizador-precios.mjs -> public/cotizador/precios.js) y al sitio
// publico (aqui). Antes cada uno tenia su propia copia de los precios y podian
// desincronizarse: el cliente veia un precio en la web y recibia otro en la
// cotizacion formal por WhatsApp.
//
// PARA CAMBIAR PRECIOS: editar data/precios.json y correr
//   node scripts/gen-cotizador-precios.mjs
//
// QUE PUBLICA LA WEB: solo las variantes con `web: "<id del inventario>"`. Hoy
// son 11 de 31 — de los departamentos se publica una variante de nivel/vista por
// modelo (la etiqueta la pone VARIANT_NOTE en MortgageCalculator). Publicar otra
// variante = mover esa marca en precios.json, no tocar codigo.

import preciosData from "@/data/precios.json";

type Escrituracion = Record<string, number>;

type EntradaBase = {
  dev: string;
  modelo: string;
  precio_lista: number;
  bono: number;
  avaluo_tramite: number;
  escrituracion: Escrituracion;
  web?: string;
};

type Casa = EntradaBase & { promocion?: { bono_extra: number } };
type Departamento = EntradaBase & {
  nivel: string;
  vista: string | null;
  prototipo: string;
};

type Precios = {
  actualizado: string;
  desarrollos: Record<
    string,
    { precio_terreno_excedente: number; cuota_contingencia: number }
  >;
  casas: Casa[];
  departamentos: Departamento[];
};

const precios = preciosData as unknown as Precios;

export type PrecioPublicado = {
  /** Lo que paga el cliente: precio de lista menos el bono. */
  precio: number;
  /** Valor comercial del perito; es sobre este que presta el banco. */
  valor_avaluo: number;
};

/**
 * Precio publicable por id del inventario. El NETO es `precio_lista - bono`;
 * la promocion de casas NO se aplica (es una variante aparte, no el precio
 * de lista vigente).
 */
function construirMapa(): Map<string, PrecioPublicado> {
  const mapa = new Map<string, PrecioPublicado>();
  const todas: EntradaBase[] = [...precios.casas, ...precios.departamentos];

  for (const entrada of todas) {
    if (!entrada.web) continue;
    if (mapa.has(entrada.web)) {
      throw new Error(
        `data/precios.json: el id "${entrada.web}" esta marcado como publicable en mas de una variante. Solo una puede alimentar la web.`
      );
    }
    mapa.set(entrada.web, {
      precio: entrada.precio_lista - entrada.bono,
      valor_avaluo: entrada.precio_lista,
    });
  }
  return mapa;
}

const PRECIOS_POR_ID = construirMapa();

/**
 * Devuelve el precio publicado de un modelo del inventario.
 *
 * Si un id no esta en precios.json revienta a proposito, en build: un modelo
 * publicado sin precio en la fuente unica saldria en $0 o con el precio viejo
 * congelado en inventory.json, y nadie lo notaria hasta que un cliente lo viera.
 */
export function getPrecioPublicado(id: string): PrecioPublicado {
  const p = PRECIOS_POR_ID.get(id);
  if (!p) {
    throw new Error(
      `data/precios.json no tiene precio para el modelo "${id}". Agrega la variante y marcala con "web": "${id}".`
    );
  }
  return p;
}

export function getFechaPrecios(): string {
  return precios.actualizado;
}

// ── Matriz de nivel × vista de los departamentos ────────────────────────────
//
// En departamentos el precio cambia por NIVEL y por VISTA (Capua: parque o
// estacionamiento; Cedro Plus: alberca o estacionamiento; Lirios no tiene
// variante de vista). La ficha del modelo publica una sola variante —la del
// gancho— y el resto se cotizaba por WhatsApp; esto permite mostrar la tabla
// completa en la página-catálogo de departamentos.
//
// Los desarrollos en precios.json usan las claves del cotizador, no los slugs
// del sitio, así que hay que traducir.
const DEV_PRECIOS_POR_SLUG: Record<string, { casas?: string; departamentos?: string }> = {
  "jardines-del-sur-6": { casas: "Azular1", departamentos: "Azular1-Depas" },
  "la-rioja-2": { casas: "LaRioja2" },
  "lirios-residencial-2": { departamentos: "Lirios2-Depas" },
};

export type VarianteDepartamento = {
  modelo: string;
  /** "PB" | "1" | "2" | "3" */
  nivel: string;
  /** null en los desarrollos sin variante de vista (Lirios) */
  vista: string | null;
  /** Nombre comercial exacto, ej. "CEDRO PLUS 3N (ROOF)" */
  prototipo: string;
  /** Lo que paga el cliente: precio de lista menos el bono. */
  precio: number;
  /**
   * Valor comercial del perito. Depende SOLO del nivel, no de la vista: las dos
   * vistas de un mismo piso comparten avalúo y lo que cambia entre ellas es el
   * bono. Por eso en la tabla basta una columna de avalúo por renglón.
   */
  avaluo: number;
};

/**
 * Todas las variantes de departamento de un desarrollo, en el orden de niveles
 * en que se presentan al cliente (planta baja primero). Devuelve [] si el
 * desarrollo no tiene departamentos.
 */
export function getVariantesDepartamentos(slug: string): VarianteDepartamento[] {
  const devKey = DEV_PRECIOS_POR_SLUG[slug]?.departamentos;
  if (!devKey) return [];

  const orden = ["PB", "1", "2", "3"];
  return precios.departamentos
    .filter((d) => d.dev === devKey)
    .map((d) => ({
      modelo: d.modelo,
      nivel: d.nivel,
      vista: d.vista,
      prototipo: d.prototipo,
      precio: d.precio_lista - d.bono,
      avaluo: d.precio_lista,
    }))
    .sort(
      (a, b) =>
        a.modelo.localeCompare(b.modelo) ||
        orden.indexOf(a.nivel) - orden.indexOf(b.nivel)
    );
}

/**
 * Traduce el id del inventario ("jds6-capua") al nombre del modelo en
 * precios.json ("CAPUA").
 *
 * Es el puente que necesita la FICHA para pintar la tabla de sus propias
 * variantes: el inventario llama al modelo "Departamento Capua" y la lista de
 * precios lo llama "CAPUA", y emparejarlos por texto sería frágil. El campo
 * `web` ya marca cuál variante alimenta a esa ficha, así que se usa ese vínculo
 * —el mismo que decide el precio publicado— en lugar de inventar otro.
 *
 * Devuelve null si el id no está en la lista; quien llama decide si eso es un
 * error o simplemente un modelo sin variantes que mostrar.
 */
export function getModeloPrecios(id: string): string | null {
  const todas: EntradaBase[] = [...precios.casas, ...precios.departamentos];
  return todas.find((e) => e.web === id)?.modelo ?? null;
}
