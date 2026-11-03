// Mensaje de WhatsApp segun la pagina en la que esta el visitante.
//
// POR QUE EXISTE: los botones que viven DENTRO del contenido (silo, ficha,
// precios, promociones, catalogos) ya mandaban cada uno su propio mensaje. Los
// tres que acompanan al visitante en TODAS las paginas —el del encabezado, el
// flotante y el del pie— mandaban siempre el mismo texto generico. Y son justo
// los que mas se tocan, porque estan visibles mientras la persona lee. El
// resultado era que llegaba "quiero mas informacion" sin saber de que
// desarrollo venia.
//
// Se resuelve leyendo la RUTA y no pasando props: los tres son componentes de
// cliente y ya tienen usePathname(). Asi una pagina nueva queda cubierta sola,
// sin tener que acordarse de tocarla.
//
// ⚠️ El Hero del inicio NO usa esto a proposito: esa pagina no nombra un solo
// desarrollo, porque hacerlo perjudica a La Rioja y a Lirios.

import silosData from "@/data/silos.json";

// El número vive en lib/contacto.ts; se re-exporta para quien ya lo importaba de aquí.
import { PHONE_E164 } from "./contacto";
export { PHONE_E164 };

type Tiene = "casas" | "departamentos" | "ambos";
type Silo = { nombre: string; tiene: Tiene; preventa?: boolean };

export const SILOS = silosData.silos as Record<string, Silo>;

/**
 * Los slugs no llevan acento (slugify los quita), asi que el nombre bonito
 * necesita este mapa. Es el mismo que usa la migaja de pan del encabezado.
 */
export const MODEL_NAMES_BY_SLUG: Record<string, string> = {
  "casa-tabachin": "Casa Tabachín",
  "casa-ceiba": "Casa Ceiba",
  "casa-flamboyan": "Casa Flamboyán",
  "casa-noni": "Casa Noni",
  "casa-fresno-elite": "Casa Fresno Elite",
  "casa-modelo-alamo": "Casa Modelo Alamo",
  "casa-noni-elite": "Casa Noni Elite",
  "departamento-capua": "Departamento Capua",
  "departamento-cedro-plus": "Departamento Cedro Plus",
};

/** Subpaginas de un desarrollo que NO son modelos. */
export const SECTION_NAMES_BY_SLUG: Record<string, string> = {
  casas: "Casas",
  departamentos: "Departamentos",
  promociones: "Promociones",
  precios: "Precios",
};

const GENERAL = "las casas y departamentos de Altta Homes en Cancún";

function productoDe(silo: Silo): string {
  if (silo.tiene === "casas") return `las casas de ${silo.nombre}`;
  if (silo.tiene === "departamentos") return `los departamentos de ${silo.nombre}`;
  return `las casas y departamentos de ${silo.nombre}`;
}

/** Lo que va despues de "quiero más información sobre ...", y su coda. */
function objeto(segmentos: string[]): { texto: string; coda?: string } {
  const [primero, segundo] = segmentos;

  // Paginas sueltas de la raiz.
  if (!primero) return { texto: GENERAL };
  if (primero === "casas-en-cancun")
    return { texto: "las casas de Altta Homes en Cancún" };
  if (primero === "departamentos-en-cancun")
    return { texto: "los departamentos de Altta Homes en Cancún" };
  if (primero === "precios")
    return { texto: "los precios de Altta Homes en Cancún" };
  if (primero === "promociones")
    return { texto: "las promociones de Altta Homes en Cancún" };
  if (primero === "jardines-del-sur-cancun")
    return { texto: "los desarrollos de Jardines del Sur en Cancún" };

  const silo = SILOS[primero];
  if (!silo) return { texto: GENERAL };

  // Jardines del Sur 7 todavia no vende: pedir informacion es pedir el aviso.
  const coda = silo.preventa ? "Avísame cuando abra la preventa." : undefined;

  if (!segundo) {
    return silo.preventa
      ? { texto: silo.nombre, coda }
      : { texto: productoDe(silo) };
  }

  if (segundo === "casas") return { texto: `las casas de ${silo.nombre}` };
  if (segundo === "departamentos")
    return { texto: `los departamentos de ${silo.nombre}` };
  if (segundo === "precios") return { texto: `los precios de ${silo.nombre}`, coda };
  if (segundo === "promociones")
    return { texto: `las promociones de ${silo.nombre}` };

  const modelo = MODEL_NAMES_BY_SLUG[segundo];
  if (modelo) {
    // "el Departamento Capua" / "la Casa Noni".
    const art = modelo.startsWith("Departamento") ? "el" : "la";
    return { texto: `${art} ${modelo} de ${silo.nombre}`, coda };
  }

  // Subpagina nueva sin dar de alta: mejor el desarrollo que un slug crudo.
  return silo.preventa ? { texto: silo.nombre, coda } : { texto: productoDe(silo) };
}

export function mensajeWhatsAppPorRuta(pathname: string): string {
  const segmentos = (pathname || "")
    .split("?")[0]
    .split("#")[0]
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
  const { texto, coda } = objeto(segmentos);
  return `Hola, quiero más información sobre ${texto}.${coda ? ` ${coda}` : ""}`;
}

export function hrefWhatsAppPorRuta(pathname: string): string {
  return `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    mensajeWhatsAppPorRuta(pathname)
  )}`;
}
