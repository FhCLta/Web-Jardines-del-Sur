import { DEVS, type DevSlug } from "../(desarrollos)/_lib/dev-content";
import {
  getInventory,
  getModelType,
  parseStat,
  slugifyModel,
} from "../(desarrollos)/_lib/model-utils";
import silosData from "@/data/silos.json";
import { SITE_URL } from "@/lib/site";

/**
 * /inventario.json — lo lee el CRM de Florencio (KloseAI) una vez al dia para
 * saber que modelos existen en cada desarrollo y cuales se ofrecen.
 *
 * ⚠️ SIN PRECIOS NI PROMOCIONES, a proposito: la IA del CRM nunca los menciona.
 * Los precios viven en /api/precios.json, que es OTRO contrato (app de
 * expedientes) y no se toca desde aqui.
 *
 * Se genera al compilar (output: export) con la MISMA funcion que alimenta las
 * fichas, asi que no puede decir algo distinto que las paginas publicadas:
 *   - getInventory ya saca lo oculto de la web (`oculto_web`, p. ej. la Casa
 *     Noni de La Rioja 2: decision de Florencio, no va).
 *   - recamaras y baños salen con la misma regla que usa la ficha.
 * No esta en el sitemap (sitemap.ts da de alta las paginas una por una) y
 * firebase.json le pone X-Robots-Tag: noindex. Sin CORS: el CRM lo lee desde
 * su servidor.
 *
 * Formato acordado con Florencio (oct 2026). Cambiar un nombre de campo o un
 * valor permitido rompe al CRM: agregar, nunca renombrar.
 */
export const dynamic = "force-static";

type EstadoDesarrollo = "venta" | "proximamente" | "agotado";
type EstadoModelo = "disponible" | "agotado" | "proximamente";

const SILOS = silosData.silos as Record<string, { preventa?: boolean }>;

// Cancun no cambia de horario: UTC-5 todo el año.
function fechaCancun(d: Date): string {
  const local = new Date(d.getTime() - 5 * 60 * 60 * 1000);
  return `${local.toISOString().slice(0, 19)}-05:00`;
}

const numero = (s: string | null): number | null =>
  s === null ? null : Number.parseFloat(s);

export function GET() {
  const inventario = getInventory();

  const desarrollos = (Object.keys(DEVS) as DevSlug[]).map((slug) => {
    const dev = DEVS[slug];
    const modelos = inventario
      .filter((p) => p.development === dev.name)
      .map((p) => {
        const modeloSlug = slugifyModel(p.nombre_modelo);
        // Mismo criterio que la ficha: "Agotado" la marca como agotada y un
        // modelo sin precio es uno anunciado que aun no se vende.
        const estado: EstadoModelo =
          p.status === "Agotado"
            ? "agotado"
            : p.precio === null
            ? "proximamente"
            : "disponible";
        return {
          id: modeloSlug,
          nombre: p.nombre_modelo,
          tipo: getModelType(p.nombre_modelo) === "Departamento" ? "departamento" : "casa",
          estado,
          recamaras: numero(parseStat(p.amenidades_key, /^([\d.]+)\s*Rec/i)),
          banos: numero(parseStat(p.amenidades_key, /^([\d.]+)\s*Ba/i)),
          // SIN medidas, decision de Florencio (3 oct 2026): en departamentos
          // el m² es un MINIMO ("desde 104.06") y la IA lo daria como exacto.
          // Los campos se quedan en null para no romper el formato del CRM.
          m2_construccion: null,
          m2_terreno: null,
          url: `${SITE_URL}/${slug}/${modeloSlug}`,
        };
      });

    // La preventa esta DECLARADA en data/silos.json (`preventa: true`), no se
    // deduce de que falten precios.
    const estado: EstadoDesarrollo = SILOS[slug]?.preventa
      ? "proximamente"
      : modelos.length > 0 && modelos.every((m) => m.estado === "agotado")
      ? "agotado"
      : "venta";

    return {
      id: slug,
      nombre: dev.name,
      estado,
      url: `${SITE_URL}/${slug}`,
      modelos,
    };
  });

  return Response.json({
    version: 1,
    actualizado: fechaCancun(new Date()),
    desarrollos,
  });
}
