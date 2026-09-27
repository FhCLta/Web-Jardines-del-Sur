import Shell from "@/app/precios/Shell";
import LogoDev from "@/app/precios/LogoDev";
import PropertyCard from "@/components/PropertyCard";
import styles from "./tipo.module.css";
import { DEVS, type DevSlug } from "@/app/(desarrollos)/_lib/dev-content";
import {
  getInventory,
  getModelType,
  slugifyModel,
  formatPriceMxn,
  preciosPublicados,
  type InventoryProperty,
} from "@/app/(desarrollos)/_lib/model-utils";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";

/**
 * CATÁLOGO POR TIPO DE PRODUCTO, cruzando desarrollos.
 *
 * ⚠️ ESTA PÁGINA NO ES /precios CON FOTOS. Las dos listan lo mismo, pero
 * contestan preguntas distintas y por eso pueden convivir:
 *
 *   /precios              → "¿cuánto cuestan?"  tabla escaneable, sin fotos,
 *                            con el ahorro calculado, para COMPARAR
 *   /casas-en-cancun      → "¿qué casas hay?"   foto, metros y recámaras,
 *                            agrupadas por desarrollo, para ELEGIR
 *
 * Si algún día esta página se convierte en otra tabla de precios, deja de
 * tener razón de existir — es la misma regla que ya se anotó en TablaPrecios.
 *
 * Y resuelve un hueco real de venta: hoy no hay UN link que enseñe todas las
 * casas. /jardines-del-sur-6/casas solo trae las de ese desarrollo y La Rioja
 * no tiene página de casas. Esta es la única vista donde La Rioja aparece al
 * lado de Jardines del Sur 6 — que además le da una entrada más a un
 * desarrollo que viene perdiendo visibilidad.
 */

export type Tipo = "Casa" | "Departamento";

const COPY: Record<
  Tipo,
  {
    plural: string;
    pluralLower: string;
    eyebrow: string;
    h1: string;
    slugPagina: string;
    comunes: { titulo: string; texto: string }[];
  }
> = {
  Casa: {
    plural: "Casas",
    pluralLower: "casas",
    eyebrow: "Casas en venta · Cancún",
    h1: "Casas en Venta en Cancún",
    slugPagina: "casas-en-cancun",
    comunes: [
      {
        titulo: "Tres recámaras",
        texto:
          "Todos los modelos son de tres recámaras. La principal tiene baño propio y área para clóset o vestidor.",
      },
      {
        titulo: "Dos y tres niveles",
        texto:
          "Según el modelo: estancia de TV en planta alta, y en algunos un tercer nivel con roof garden o terraza.",
      },
      {
        titulo: "Crédito bancario e Infonavit",
        texto:
          "Se compran con crédito bancario o Infonavit. En Jardines del Sur 6 hay unidades con FOVISSSTE.",
      },
      {
        titulo: "Respaldo de Grupo Sadasi",
        texto:
          "50 años de trayectoria y más de 430,000 viviendas entregadas en 12 estados del país.",
      },
    ],
  },
  Departamento: {
    plural: "Departamentos",
    pluralLower: "departamentos",
    eyebrow: "Departamentos en venta · Cancún",
    h1: "Departamentos en Venta en Cancún",
    slugPagina: "departamentos-en-cancun",
    comunes: [
      {
        titulo: "Tres recámaras",
        texto:
          "Ninguno es de una o dos recámaras: todos son de tres. La principal tiene baño propio y clóset.",
      },
      {
        titulo: "El precio cambia por nivel",
        texto:
          "Planta baja y niveles altos no cuestan igual, y el nivel 3 con roof garden tiene su propio precio.",
      },
      {
        titulo: "Crédito bancario e Infonavit",
        texto:
          "Es el producto de entrada: la mensualidad más baja del portafolio y el que más se compra con Infonavit.",
      },
      {
        titulo: "Cocina equipada",
        texto:
          "Barra de granito, campana, parrilla y tanque de gas. Los cuatro llevan centro de lavado.",
      },
    ],
  },
};

/** El orden en que se presentan: el más barato primero. */
function ordenarDesarrollos(props: InventoryProperty[]): string[] {
  const minPorDev = new Map<string, number>();
  for (const p of props) {
    if (p.precio === null) continue;
    const actual = minPorDev.get(p.development);
    if (actual === undefined || p.precio < actual) {
      minPorDev.set(p.development, p.precio);
    }
  }
  const devs = [...new Set(props.map((p) => p.development))];
  return devs.sort(
    // Los que aún no tienen precio van al final: no compiten por entrada.
    (a, b) =>
      (minPorDev.get(a) ?? Infinity) - (minPorDev.get(b) ?? Infinity)
  );
}

const SLUG_BY_DEV: Record<string, DevSlug> = {
  "Jardines del Sur 6": "jardines-del-sur-6",
  "Jardines del Sur 7": "jardines-del-sur-7",
  "La Rioja 2": "la-rioja-2",
  "Lirios Residencial 2": "lirios-residencial-2",
};

export function datosTipo(tipo: Tipo) {
  const todos = getInventory().filter(
    (p) => getModelType(p.nombre_modelo) === tipo
  );
  // "Disponibles" excluye lo agotado y lo que aún no sale: es el número que se
  // dice en la entradilla, y tiene que ser el que el visitante puede comprar hoy.
  const disponibles = todos.filter(
    (p) => p.status !== "Agotado" && p.precio !== null
  );
  const precios = preciosPublicados(disponibles);
  return {
    todos,
    disponibles,
    desde: precios.length ? Math.min(...precios) : null,
    hasta: precios.length ? Math.max(...precios) : null,
  };
}

export default function TipoPage({ tipo }: { tipo: Tipo }) {
  const copy = COPY[tipo];
  const { todos, disponibles, desde, hasta } = datosTipo(tipo);
  const devs = ordenarDesarrollos(todos);
  // Nombrarlos vale más que contarlos: "3 desarrollos" no le dice nada a nadie,
  // y estos nombres son justo lo que la gente reconoce y busca.
  const listaDevs =
    devs.length > 1
      ? `${devs.slice(0, -1).join(", ")} y ${devs[devs.length - 1]}`
      : devs[0] ?? "";
  const pageUrl = `${SITE_URL}/${copy.slugPagina}`;

  const waMsg = `Hola, vi las ${copy.pluralLower} de Altta Homes en Cancún y quiero información y disponibilidad.`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMsg)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.plural,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#listado`,
        name: copy.h1,
        numberOfItems: disponibles.length,
        itemListElement: disponibles.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${p.nombre_modelo} en ${p.development}`,
          url: `${SITE_URL}/${SLUG_BY_DEV[p.development]}/${slugifyModel(
            p.nombre_modelo
          )}`,
        })),
      },
    ],
  };

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className={styles.hero}>
        <div className="container">
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1>{copy.h1}</h1>
          <p className={styles.lead}>
            {disponibles.length} {copy.pluralLower} de tres recámaras en la Zona
            Sur de Cancún, en {listaDevs}. Aquí{" "}
            {tipo === "Casa" ? "las ves todas juntas" : "los ves todos juntos"}{" "}
            —con fotos, metros y precio— para comparar antes de escribir.
          </p>
          {desde !== null && hasta !== null && (
            <div className={styles.rango}>
              <div className={styles.rangoItem}>
                <span>Desde</span>
                <strong>{formatPriceMxn(desde)}</strong>
              </div>
              <div className={styles.rangoItem}>
                <span>Hasta</span>
                <strong>{formatPriceMxn(hasta)}</strong>
              </div>
              <div className={styles.rangoItem}>
                <span>Disponibles</span>
                <strong>{disponibles.length}</strong>
              </div>
            </div>
          )}
        </div>
      </header>

      {devs.map((devName) => {
        const slug = SLUG_BY_DEV[devName];
        const delDev = todos.filter((p) => p.development === devName);
        const preciosDev = preciosPublicados(
          delDev.filter((p) => p.status !== "Agotado")
        );
        return (
          <section key={devName} className={styles.bloque}>
            <div className="container">
              {slug && <LogoDev slug={slug} />}
              <div className={styles.bloqueHead}>
                <h2>
                  {copy.plural} en {devName}
                  {preciosDev.length > 0 && (
                    <> — desde {formatPriceMxn(Math.min(...preciosDev))}</>
                  )}
                </h2>
                {slug && (
                  <a className={styles.bloqueLink} href={`/${slug}`}>
                    Ver {devName} completo →
                  </a>
                )}
              </div>
              <div className={styles.grid}>
                {delDev.map((p) => (
                  <div key={p.id} className={styles.item}>
                    <PropertyCard property={p} />
                    {slug && (
                      <a
                        className={styles.fichaLink}
                        href={`/${slug}/${slugifyModel(p.nombre_modelo)}`}
                      >
                        Ver ficha completa de{" "}
                        {p.nombre_modelo.replace(/^(Casa|Departamento)\s+/i, "")}{" "}
                        →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className={styles.comunes}>
        <div className="container">
          <div className={styles.comunesHead}>
            <h2>Lo que tienen en común</h2>
            <p>
              Más allá del precio, esto es lo que comparten{" "}
              {tipo === "Casa" ? "todas las casas" : "todos los departamentos"}{" "}
              del portafolio.
            </p>
          </div>
          <div className={styles.comunesGrid}>
            {copy.comunes.map((c) => (
              <div key={c.titulo} className={styles.comun}>
                <strong>{c.titulo}</strong>
                <span>{c.texto}</span>
              </div>
            ))}
          </div>
          <div className={styles.cta}>
            <a
              className="btn btn-primary"
              href={waHref}
              target="_blank"
              rel="noreferrer"
            >
              Pedir informes por WhatsApp
            </a>
            <a className="btn btn-secondary" href="/precios">
              Ver todos los precios
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
