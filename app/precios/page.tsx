import type { Metadata } from "next";
import Shell from "./Shell";
import TablaPrecios from "./TablaPrecios";
import LogoDev from "./LogoDev";
import NivelesTable from "@/app/(desarrollos)/_lib/NivelesTable";
import styles from "./precios.module.css";
import { DEVS, type DevSlug } from "@/app/(desarrollos)/_lib/dev-content";
import {
  getPropertiesByDev,
  formatPriceMxn,
  formatPriceShort,
} from "@/app/(desarrollos)/_lib/model-utils";
import { getFechaPrecios, getVariantesDepartamentos } from "@/lib/precios";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const PAGE_URL = `${SITE_URL}/precios`;

/**
 * "2026-08-05" → "5 de agosto de 2026".
 *
 * Se parte a mano en vez de usar `new Date(iso)`: esa cadena la interpreta el
 * navegador como UTC y en la zona de Cancun (UTC−5) el dia se corre uno hacia
 * atras. Publicar "4 de agosto" cuando la lista dice 5 es exactamente el tipo
 * de rotulo desalineado que ya mordio antes en este proyecto.
 */
function fechaLarga(iso: string): string {
  const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return iso;
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

// Mismos desarrollos que /precios/[dev]. Jardines del Sur 7 queda fuera hasta
// que tenga precios; ver la nota de esa ruta.
const SLUGS: DevSlug[] = [
  "jardines-del-sur-6",
  "la-rioja-2",
  "lirios-residencial-2",
];

// ⚠️ ESTA PAGINA NO DEBE DUPLICAR A LAS DE CADA DESARROLLO, igual que pasa con
// /promociones. Las de /precios/[dev] atacan busquedas de MARCA ("precios
// jardines del sur 6"); esta ataca las GENERICAS de ciudad ("precios de casas
// en Cancun", "cuanto cuesta una casa en Cancun"), que tienen mas volumen. Por
// eso lleva entradilla y preguntas frecuentes propias, y un comparativo de
// TODOS los modelos que ninguna otra pagina del sitio tiene.
const metaTitle = "Precios de Casas y Departamentos en Cancún | Altta Homes";
const metaDescription =
  "Lista de precios actualizada de casas y departamentos en la Zona Sur de Cancún: 11 modelos en Jardines del Sur 6, La Rioja 2 y Lirios Residencial 2, con valor de avalúo, precio con descuento y cuánto ahorras en cada uno.";

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/precios" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/precios",
    siteName: "Altta Homes Cancún",
    title: metaTitle,
    description: metaDescription,
    images: ["/optimized/hero/alberca-desktop.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Contenido propio del hub y fuente del JSON-LD FAQPage. Cada respuesta se
// apega a lo que ya dice el sitio; nada inventado.
const FAQS = [
  {
    q: "¿Los precios publicados ya traen el descuento?",
    a: "Sí. El precio que ves en cada modelo es el precio con descuento, o sea lo que pagas. Junto a él aparece el valor de avalúo, que es lo que la vivienda vale comercialmente, y la diferencia entre los dos es tu ahorro. No hay que restarle nada.",
  },
  {
    q: "¿Los precios incluyen gastos de escrituración?",
    a: "No. Los precios publicados son de la vivienda; los gastos de escrituración se calculan aparte y dependen del esquema con el que compres (bancario, Infonavit, Cofinavit, FOVISSSTE o contado). En la calculadora hipotecaria puedes verlos estimados para cada modelo.",
  },
  {
    q: "¿Por qué el precio de un departamento cambia según el nivel?",
    a: "En departamentos el precio depende del nivel y, en Jardines del Sur 6, también de la vista. Planta baja y niveles bajos cuestan distinto que los altos, y el roof garden tiene su propio precio. En la página de cada desarrollo está la tabla completa por nivel.",
  },
  {
    q: "¿Cada cuánto cambian los precios?",
    a: "Los precios se revisan periódicamente y esta página se actualiza con ellos: la fecha de la última actualización aparece arriba. Están sujetos a cambio sin previo aviso y a disponibilidad, así que conviene confirmar antes de decidir.",
  },
  {
    q: "¿Se puede apartar con estos precios?",
    a: "Los precios publicados aplican sobre las unidades disponibles al momento. Lo que cambia semana con semana es qué unidades siguen libres, y eso se confirma directamente con el asesor por WhatsApp.",
  },
];

export default function Page() {
  const todos = SLUGS.flatMap((s) => getPropertiesByDev(DEVS[s].name));
  const desde = Math.min(...todos.map((p) => p.precio));
  const hasta = Math.max(...todos.map((p) => p.precio));

  const waMsg =
    "Hola, vi la lista de precios en el sitio de Altta Homes Cancún y quiero información y disponibilidad.";
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMsg)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Precios", item: PAGE_URL },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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
          <span className={styles.eyebrow}>Casas y departamentos · Cancún</span>
          <h1>Precios de casas y departamentos en Cancún</h1>
          <p className={styles.lead}>
            Los {todos.length} modelos de Altta Homes en la Zona Sur de Cancún,
            de {formatPriceShort(desde)} a {formatPriceShort(hasta)}: valor de
            avalúo, precio con descuento y cuánto ahorras en cada uno.
          </p>
          <span className={styles.actualizado}>
            Precios actualizados al {fechaLarga(getFechaPrecios())}
          </span>
        </div>
      </header>

      {SLUGS.map((slug) => {
        const dev = DEVS[slug];
        const props = getPropertiesByDev(dev.name);
        const min = Math.min(...props.map((p) => p.precio));
        const variantes = getVariantesDepartamentos(slug);
        return (
          <section key={slug} className={styles.bloque}>
            <div className="container">
              <LogoDev slug={slug} />
              <div className={styles.bloqueHead}>
                <h2>
                  {dev.name} — desde {formatPriceMxn(min)}
                </h2>
              </div>
              <TablaPrecios slug={slug} />
            </div>
            {/* Un id por desarrollo: aqui se pintan varias tablas de nivel en
                la misma pagina y repetir el id rompe el anclaje. */}
            {variantes.length > 0 && (
              <NivelesTable
                variantes={variantes}
                waHref={waHref}
                id={`precios-por-nivel-${slug}`}
              />
            )}
          </section>
        );
      })}

      <section className={styles.bloque}>
        <div className="container">
          <p className={styles.notaLegal}>
            El <strong>precio con descuento</strong> es lo que pagas; el{" "}
            <strong>valor de avalúo</strong> es lo que la vivienda vale
            comercialmente. Precios sujetos a disponibilidad y a cambio sin
            previo aviso; no incluyen gastos de escrituración.{" "}
            <a href={waHref} target="_blank" rel="noreferrer">
              Confirma disponibilidad por WhatsApp
            </a>
            .
          </p>
          <div className={styles.cta}>
            <a className="btn btn-primary" href={waHref} target="_blank" rel="noreferrer">
              Pedir informes por WhatsApp
            </a>
            <a className="btn btn-secondary" href="/calculadora-hipotecaria">
              Calcular mi mensualidad
            </a>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div className="container">
          <h2>Preguntas frecuentes sobre precios</h2>
          <div className={styles.faqList}>
            {FAQS.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
