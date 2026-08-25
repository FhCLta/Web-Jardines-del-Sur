import Shell from "@/app/precios/Shell";
import TablaPrecios from "@/app/precios/TablaPrecios";
import LogoDev from "@/app/precios/LogoDev";
import NivelesTable from "./NivelesTable";
import styles from "@/app/precios/precios.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import { getPropertiesByDev, formatPriceMxn } from "./model-utils";
import { getVariantesDepartamentos, getFechaPrecios } from "@/lib/precios";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";

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

/**
 * Lista de precios de un desarrollo.
 *
 * ⚠️ La URL es /<desarrollo>/precios, NO /precios/<desarrollo>. Todo lo que
 * pertenece a un desarrollo cuelga del desarrollo — igual que /<dev>/promociones,
 * /<dev>/casas y /<dev>/departamentos. El hub /precios vive en la raiz, como
 * /promociones. Nacieron al reves y se movieron el mismo dia, antes de que
 * Google las conociera; las viejas quedaron redirigidas en firebase.json.
 */
export default function PreciosDevPage({ slug }: { slug: DevSlug }) {
  const dev = DEVS[slug];
  const props = getPropertiesByDev(dev.name);
  const desde = Math.min(...props.map((p) => p.precio));
  const variantes = getVariantesDepartamentos(slug);
  const pageUrl = `${SITE_URL}/${slug}/precios`;

  const waMsg = `Hola, vi la lista de precios de ${dev.name} en el sitio y quiero información y disponibilidad.`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMsg)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          // El orden sigue la direccion: /<desarrollo>/precios. Estuvo al reves
          // —"Precios › <desarrollo>"— porque quedo del cambio de URL, cuando
          // la pagina vivia en /precios/<desarrollo>. Es como lo hace
          // /<dev>/promociones, que tiene la misma forma.
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: dev.name,
            item: `${SITE_URL}/${slug}`,
          },
          { "@type": "ListItem", position: 3, name: "Precios", item: pageUrl },
        ],
      },
      {
        "@type": "OfferCatalog",
        "@id": `${pageUrl}#precios`,
        name: `Precios de ${dev.name}`,
        numberOfItems: props.length,
        itemListElement: props.map((p, i) => ({
          "@type": "Offer",
          position: i + 1,
          name: p.nombre_modelo,
          price: p.precio,
          priceCurrency: "MXN",
          url: `${SITE_URL}/${slug}/${p.nombre_modelo
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`,
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
          <span className={styles.eyebrow}>Lista de precios · Cancún</span>
          <h1>Precios de {dev.name}</h1>
          <p className={styles.lead}>
            Los {props.length} modelos de {dev.name} con su precio actualizado,
            ordenados de menor a mayor. De cada uno verás el valor de avalúo y
            cuánto ahorras sobre él, para que los compares sin tener que sacar
            cuentas.
          </p>
          <span className={styles.actualizado}>
            Precios actualizados al {fechaLarga(getFechaPrecios())}
          </span>
        </div>
      </header>

      <section className={styles.bloque}>
        <div className="container">
          <LogoDev slug={slug} />
          <div className={styles.bloqueHead}>
            <h2>Todos los modelos, desde {formatPriceMxn(desde)}</h2>
            <a className={styles.bloqueLink} href={`/${slug}`}>
              Ver {dev.name} con fotos y amenidades →
            </a>
          </div>
          <TablaPrecios slug={slug} />
          <p className={styles.notaLegal}>
            El <strong>precio con descuento</strong> es lo que pagas; el{" "}
            <strong>valor de avalúo</strong> es lo que la vivienda vale
            comercialmente, y la diferencia entre los dos es tu ahorro. Precios
            sujetos a disponibilidad y a cambio sin previo aviso.
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

      {variantes.length > 0 && (
        <NivelesTable
          variantes={variantes}
          waHref={waHref}
          id={`precios-por-nivel-${slug}`}
        />
      )}
    </Shell>
  );
}
