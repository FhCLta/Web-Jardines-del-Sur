import type { Metadata } from "next";
import Shell from "@/app/precios/Shell";
import TablaPrecios from "@/app/precios/TablaPrecios";
import LogoDev from "@/app/precios/LogoDev";
import styles from "@/app/precios/precios.module.css";
import { DEVS } from "../../_lib/dev-content";
import { getPropertiesByDev, slugifyModel } from "../../_lib/model-utils";
import { SITE_URL } from "@/lib/site";
import { PHONE_E164 } from "@/lib/contacto";

/**
 * Precios de Jardines del Sur 7 — ANTES de que haya precios.
 *
 * Decision de Florencio (27 sept 2026): la pagina del 7 esta en el #1 y la
 * gente ya busca "precios jardines del sur 7". Esta pagina captura esa
 * busqueda desde ahora y la lleva a lo que SI se puede comprar hoy: los mismos
 * modelos en Jardines del Sur 6. El dia que salgan los precios oficiales se
 * llena aqui mismo con la comparacion lado a lado (docs/jds7-lanzamiento.md
 * §3) — y ya llega posicionada.
 *
 * ⚠️ Aqui NO se inventa ningun precio del 7. Lo que se promete es lo que
 * aprobo Florencio: Tabachin y Noni abren la preventa; Flamboyan y Ceiba estan
 * confirmados y llegan despues, igual que Capua y Cedro Plus (3 nov 2026).
 * Los precios del 6 salen de la lista oficial (TablaPrecios), nunca a mano.
 */

const SLUG = "jardines-del-sur-7" as const;
const dev = DEVS[SLUG];
const pageUrl = `${SITE_URL}/${SLUG}/precios`;

// ⚠️ Tope practico ~60 caracteres. Ataca "precios jardines del sur 7", que es
// una consulta DISTINTA de "jardines del sur 7" (la que defiende el silo, #1).
const title = `Precios en ${dev.name} | Altta Homes Cancún`;
const description = `¿Cuánto cuestan las casas de ${dev.name} en Cancún? Los precios oficiales se anuncian al abrir la preventa. Mientras tanto, mira los precios de hoy de los mismos modelos en Jardines del Sur 6.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `/${SLUG}/precios` },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: `/${SLUG}/precios`,
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

// Los modelos del 7 en el inventario, sin precio: Tabachin y Noni abren la
// preventa; Flamboyan y Ceiba (`llega_despues`) llegan mas adelante y hoy se
// venden en el 6. Todos enlazan a SU ficha del 7 — asi Google llega a ellas.
const modelosJds7 = getPropertiesByDev(dev.name);

type Fila = {
  modelo: string;
  estado: string;
  href: string;
  enlace: string;
  // Dorado: lleva a lo que se vende HOY en el 6.
  hoy?: boolean;
};

// Lo que llega despues (casas y departamentos) manda DIRECTO al 6, sin pasar por
// la ficha del 7 (decision de Florencio, 27 sept 2026): quien ve esta tabla
// busca precio, y el unico precio real hoy esta en el 6.
const filas: Fila[] = [
  ...modelosJds7
    .filter((p) => !p.llega_despues)
    .map((p) => ({
      modelo: p.nombre_modelo,
      estado: "Abre con la preventa",
      href: `/${SLUG}/${slugifyModel(p.nombre_modelo)}`,
      enlace: "Ver el modelo",
    })),
  ...modelosJds7
    .filter((p) => p.llega_despues)
    .map((p) => ({
      modelo: p.nombre_modelo,
      estado: "Llegará más adelante",
      href: `/jardines-del-sur-6/${slugifyModel(p.nombre_modelo)}`,
      enlace: "Disponible hoy en Jardines del Sur 6",
      hoy: true,
    })),
];

export default function Page() {
  const waAviso = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    `Hola, vi la página de precios de ${dev.name}. Avísame cuando salgan los precios de la preventa.`
  )}`;
  const wa6 = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    `Hola, vi la página de precios de ${dev.name} y me interesa lo que hay disponible hoy en Jardines del Sur 6.`
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: dev.name, item: `${SITE_URL}/${SLUG}` },
          { "@type": "ListItem", position: 3, name: "Precios", item: pageUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: "es-MX",
      },
    ],
  };

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className={styles.hero}>
        <div className="container">
          <span className={styles.eyebrow}>Lista de precios · Cancún</span>
          <h1>Precios de {dev.name}</h1>
          <p className={styles.lead}>
            Los precios oficiales de {dev.name} se anuncian al abrir la preventa, y
            los publicaremos aquí ese mismo día. Mientras tanto, abajo tienes los
            precios de hoy de los mismos modelos en Jardines del Sur 6, para que
            tengas una referencia.
          </p>
          <span className={styles.actualizado}>Preventa por anunciar</span>
        </div>
      </header>

      <section className={styles.bloque}>
        <div className="container">
          <LogoDev slug={SLUG} />
          <div className={styles.bloqueHead}>
            <h2>Modelos de {dev.name}</h2>
            <a className={styles.bloqueLink} href={`/${SLUG}`}>
              Ver {dev.name} con fotos de obra y ubicación →
            </a>
          </div>
          <div className={styles.tablaWrap}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th scope="col">Modelo</th>
                  <th scope="col">En {dev.name}</th>
                  <th scope="col">Precio</th>
                  <th scope="col">
                    <span className={styles.soloLectores}>Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.modelo}>
                    <th scope="row">{f.modelo}</th>
                    <td data-label={`En ${dev.name}`}>{f.estado}</td>
                    <td data-label="Precio" className={styles.precio}>
                      <span className={styles.precioValor}>Por anunciar</span>
                    </td>
                    <td className={styles.celdaAcciones}>
                      <span className={styles.acciones}>
                        <a className={f.hoy ? styles.cotizar : undefined} href={f.href}>
                          {f.enlace} →
                        </a>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.cta}>
            <a className="btn btn-primary" href={waAviso} target="_blank" rel="noreferrer">
              Avísame cuando salgan los precios
            </a>
          </div>
        </div>
      </section>

      <section className={styles.bloque}>
        <div className="container">
          <LogoDev slug="jardines-del-sur-6" />
          <div className={styles.bloqueHead}>
            <h2>Mientras tanto: precios de hoy en Jardines del Sur 6</h2>
            <a className={styles.bloqueLink} href="/jardines-del-sur-6">
              Ver Jardines del Sur 6 →
            </a>
          </div>
          <TablaPrecios slug="jardines-del-sur-6" />
          <p className={styles.notaLegal}>
            Estos son precios de <strong>Jardines del Sur 6</strong>, no de{" "}
            {dev.name}: sirven como referencia mientras se anuncia la preventa.
            El <strong>precio con descuento</strong> es lo que pagas; el{" "}
            <strong>valor de avalúo</strong> es lo que la vivienda vale
            comercialmente. Precios sujetos a disponibilidad y a cambio sin previo
            aviso.
          </p>
          <div className={styles.cta}>
            <a className="btn btn-primary" href={wa6} target="_blank" rel="noreferrer">
              Pedir informes de Jardines del Sur 6
            </a>
            <a className="btn btn-secondary" href="/calculadora-hipotecaria">
              Calcular mi mensualidad
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
