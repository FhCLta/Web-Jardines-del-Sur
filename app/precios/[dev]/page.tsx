import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Shell from "../Shell";
import TablaPrecios from "../TablaPrecios";
import NivelesTable from "@/app/(desarrollos)/_lib/NivelesTable";
import styles from "../precios.module.css";
import { DEVS, type DevSlug } from "@/app/(desarrollos)/_lib/dev-content";
import { getPropertiesByDev, formatPriceMxn } from "@/app/(desarrollos)/_lib/model-utils";
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
 * Desarrollos con lista de precios publicada.
 *
 * ⚠️ Jardines del Sur 7 NO entra: esta en preventa y todavia no tiene precios.
 * El dia que los tenga se agrega aqui y la pagina aparece sola — pero OJO con
 * la regla del proyecto: ninguna pagina fuera de /jardines-del-sur-7 puede
 * llevar "Jardines del Sur 7" en su <title> ni en su <h1>, o competiria contra
 * la que hoy va en posicion 1.32 para ese termino.
 */
const SLUGS: DevSlug[] = [
  "jardines-del-sur-6",
  "la-rioja-2",
  "lirios-residencial-2",
];

export function generateStaticParams() {
  return SLUGS.map((dev) => ({ dev }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dev: string }>;
}): Promise<Metadata> {
  const { dev: slug } = await params;
  if (!SLUGS.includes(slug as DevSlug)) return {};
  const dev = DEVS[slug as DevSlug];
  const props = getPropertiesByDev(dev.name);
  const desde = Math.min(...props.map((p) => p.precio));

  // El titulo ataca "precios de <desarrollo>", que es una consulta distinta de
  // "<desarrollo>" —la que ya trabaja el silo—. Si algun dia este titulo se
  // parece al del silo, las dos paginas pelean por lo mismo.
  // ⚠️ Tope practico ~60 caracteres: Google corta ahi. Con "· Lista completa"
  // el de Lirios llegaba a 76 y la marca nunca se mostraba. Asi el mas largo
  // (Lirios Residencial 2) queda en 57 y cabe entero.
  const title = `Precios de ${dev.name} 2026 | Altta Homes Cancún`;
  const description = `Lista de precios actualizada de ${dev.name}, Cancún: ${props.length} modelos desde ${formatPriceMxn(desde)}. Valor de avalúo, precio con descuento y cuánto ahorras en cada modelo.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/precios/${slug}` },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: `/precios/${slug}`,
      siteName: "Altta Homes Cancún",
      title,
      description,
      images: [dev.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ dev: string }>;
}) {
  const { dev: slug } = await params;
  if (!SLUGS.includes(slug as DevSlug)) notFound();

  const devSlug = slug as DevSlug;
  const dev = DEVS[devSlug];
  const props = getPropertiesByDev(dev.name);
  const desde = Math.min(...props.map((p) => p.precio));
  const variantes = getVariantesDepartamentos(devSlug);
  const pageUrl = `${SITE_URL}/precios/${devSlug}`;

  const waMsg = `Hola, vi la lista de precios de ${dev.name} en el sitio y quiero información y disponibilidad.`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMsg)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Precios", item: `${SITE_URL}/precios` },
          { "@type": "ListItem", position: 3, name: dev.name, item: pageUrl },
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
          url: `${SITE_URL}/${devSlug}/${p.nombre_modelo
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
          <div className={styles.bloqueHead}>
            <h2>Todos los modelos, desde {formatPriceMxn(desde)}</h2>
            <a className={styles.bloqueLink} href={`/${devSlug}`}>
              Ver {dev.name} con fotos y amenidades →
            </a>
          </div>
          <TablaPrecios slug={devSlug} />
          <p className={styles.notaLegal}>
            El <strong>precio con descuento</strong> es lo que pagas; el{" "}
            <strong>valor de avalúo</strong> es lo que la vivienda vale
            comercialmente, y la diferencia entre los dos es tu ahorro. Precios
            sujetos a disponibilidad y a cambio sin previo aviso. No incluyen
            gastos de escrituración.
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
        <NivelesTable variantes={variantes} waHref={waHref} />
      )}
    </Shell>
  );
}
