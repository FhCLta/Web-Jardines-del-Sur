import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "./hub.module.css";
import { SITE_URL } from "@/lib/site";
import {
  getPropertiesByDev,
  getMinPriceByDev,
  getModelType,
  slugifyModel,
  formatPriceMxn,
  formatPriceShort,
  parseStat,
} from "../_lib/model-utils";

/* =============================================================================
   HUB DE FAMILIA — "Jardines del Sur Cancún"
   =============================================================================
   POR QUÉ EXISTE: hasta el 20 jun 2026 el título del home era literalmente
   "Jardines del Sur Cancún". Ese día se cambió a marca ("Altta Homes Cancún")
   y el término dejó de aparecer en TODO el sitio. Esta página lo recupera sin
   tocar dominios ni migraciones.

   ⚠️ REGLA INTOCABLE — NO PONER "Jardines del Sur 7" EN EL <title> NI EN EL <h1>
   `/jardines-del-sur-7` está en posición 1.32 de Google para ese término exacto
   (47.7% de CTR) ANTES de que el desarrollo abra venta. Es el activo orgánico
   más valioso del negocio. Si esta página compite por la misma frase en título
   o H1, Google elige una sola y puede hundir la que ya gana.
   Mencionar Jardines del Sur 7 en el CUERPO y enlazarlo sí: eso le SUMA.

   REPARTO DE TÉRMINOS (ver docs/jds7-lanzamiento.md §4):
     /                        → "altta homes cancun"  (marca)
     /jardines-del-sur-cancun → "jardines del sur cancun", "jardines del sur"
     /jardines-del-sur-6      → "jardines del sur 6"
     /jardines-del-sur-7      → "jardines del sur 7"   ⭐ intocable

   ⚠️ LA DISTINCIÓN EXACTA (precisada por Florencio, 18 ago 2026):
   Jardines del Sur SÍ se desarrolla POR ETAPAS — el 6 y el 7 son etapas. Lo
   que NO es cierto es que sean etapas DENTRO de un mismo residencial: cada
   etapa es un RESIDENCIAL PROPIO, con su acceso, su obra y sus precios.
   Se dice "la etapa 7 es un residencial aparte", nunca "otra sección del 6".
   Tampoco se promete "entrega inmediata": se dice "modelos disponibles".

   Los precios salen del inventario (fuente única). Al actualizar
   data/precios.json esta página se mueve sola — no hay cifras a mano.
============================================================================= */

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const PAGE_URL = `${SITE_URL}/jardines-del-sur-cancun`;

const DEV6 = "Jardines del Sur 6";

/* Modelos que se repiten entre Jardines del Sur 6 y Jardines del Sur 7. Es el
   cruce de venta del plan de lanzamiento: al que le gustó el modelo en el 7 no
   se le cambia el modelo, se le ofrece el mismo en el 6, ya construido. */
const MODELOS_COMPARTIDOS = ["Casa Tabachín", "Casa Noni"];

const WA_MESSAGE =
  "Hola, vi la página de Jardines del Sur en Cancún y quiero información de Jardines del Sur 6 y 7: modelos, precios y disponibilidad.";
const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(WA_MESSAGE)}`;

const WA_MESSAGE_7 =
  "Hola, quiero que me avisen cuando abra la preventa de Jardines del Sur 7 en Cancún (modelos Tabachín y Noni).";
const waHref7 = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(WA_MESSAGE_7)}`;

/* ---------- Datos leídos del inventario ---------- */
const propiedades6 = getPropertiesByDev(DEV6);
const minPrice6 = getMinPriceByDev(DEV6);
const casas6 = propiedades6.filter((p) => getModelType(p.nombre_modelo) === "Casa");
const deptos6 = propiedades6.filter(
  (p) => getModelType(p.nombre_modelo) === "Departamento"
);

const comparativa = MODELOS_COMPARTIDOS.map((nombre) => {
  const prop = propiedades6.find((p) => p.nombre_modelo === nombre);
  if (!prop) return null;
  return {
    nombre: prop.nombre_modelo.replace(/^Casa\s+/i, ""),
    slug: slugifyModel(prop.nombre_modelo),
    precio6: prop.precio,
    m2c: prop.metros_construccion,
    m2t: prop.metros_terreno,
    recamaras: parseStat(prop.amenidades_key, /^([\d.]+)\s*Rec/i),
  };
}).filter((x): x is NonNullable<typeof x> => x !== null);

/* ---------- Metadatos ---------- */
const desdePrecio = minPrice6 ? formatPriceShort(minPrice6) : null;

const metaTitle = desdePrecio
  ? `Jardines del Sur Cancún | Casas y Departamentos desde ${desdePrecio}`
  : "Jardines del Sur Cancún | Casas y Departamentos";

const metaDescription = `Jardines del Sur en la Zona Sur de Cancún: dos residenciales distintos. En Jardines del Sur 6 hay ${
  propiedades6.length
} modelos disponibles${desdePrecio ? ` desde ${desdePrecio}` : ""}; Jardines del Sur 7 está en obra, con preventa por anunciar. Compara los modelos que existen en los dos, con precios actualizados. Asesor autorizado de Altta Homes by Grupo Sadasi.`;

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/jardines-del-sur-cancun" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: PAGE_URL,
    siteName: "Altta Homes Cancún",
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "/jardines/Imagnes de amenidades y hero/alberca.webp",
        width: 1200,
        height: 630,
        alt: "Jardines del Sur Cancún · Altta Homes by Grupo Sadasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: ["/jardines/Imagnes de amenidades y hero/alberca.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ---------- Preguntas frecuentes (propias de esta página) ----------
   Contenido PROPIO, no copiado de /preguntas-frecuentes ni de los silos: si
   fueran casi iguales Google elegiría una y hundiría las demás (mismo criterio
   que el hub de /promociones, ver docs/actualizar-promociones.md §5). */
const FAQS = [
  {
    q: "¿Qué es Jardines del Sur y dónde está en Cancún?",
    a: `Jardines del Sur es un desarrollo de Altta Homes, la marca de vivienda de Grupo Sadasi, en la Zona Sur de Cancún (Polígono Sur), a unos 10 minutos del aeropuerto y a 500 metros de la Avenida Huayacán. Se ha construido por etapas, y por eso los nombres llevan número. Los dos vigentes hoy son Jardines del Sur 6, con modelos disponibles, y Jardines del Sur 7, en obra.`,
  },
  {
    q: "¿Jardines del Sur 7 está dentro de Jardines del Sur 6?",
    a: "No. Son dos residenciales distintos. Jardines del Sur se ha construido por etapas, y cada etapa es un residencial propio: tiene su acceso, su obra y sus precios. Están en la misma zona y los desarrolla la misma empresa, pero no es que el 7 sea una sección nueva del 6 — son desarrollos independientes.",
  },
  {
    q: "¿Cuál me conviene, Jardines del Sur 6 o el 7?",
    a: `Depende de una sola cosa: si puedes esperar. Jardines del Sur 6 tiene casas y departamentos disponibles, ya construidos y con precio publicado. Jardines del Sur 7 todavía no abre venta, así que implica esperar a que se anuncien precios y fechas. Si el modelo que te gusta existe en los dos, en el 6 lo puedes ver hoy.`,
  },
  {
    q: "¿Cuándo abre la venta de Jardines del Sur 7?",
    a: "La apertura de preventa está prevista para septiembre-octubre de 2026, arrancando con los modelos Tabachín y Noni. Las fechas y los precios los define el desarrollador y se publican aquí en cuanto son oficiales. Si quieres que te avisemos, escríbenos por WhatsApp y te contactamos el día que abra.",
  },
  {
    q: "¿Puedo comprar hoy en Jardines del Sur?",
    a: `Sí, en Jardines del Sur 6. Hay ${casas6.length} modelos de casa y ${deptos6.length} de departamento disponibles${
      minPrice6 ? `, desde ${formatPriceMxn(minPrice6)}` : ""
    }. Se puede adquirir con crédito bancario, Infonavit, cofinanciamiento o de contado.`,
  },
  {
    q: "¿Los mismos modelos se repiten entre un Jardines del Sur y otro?",
    a: "Sí. Tabachín y Noni, los dos modelos con los que arranca Jardines del Sur 7, ya existen en Jardines del Sur 6. Es la misma casa: si te gustó el modelo pero no quieres esperar a la preventa, puedes verlo construido en el 6.",
  },
  {
    q: "¿Quién construye Jardines del Sur?",
    a: "Altta Homes, la marca residencial de Grupo Sadasi: 50 años de trayectoria y más de 430,000 viviendas entregadas en México. Fue la primera desarrolladora mexicana certificada Best Place to Live.",
  },
];

/* ---------- Datos estructurados ---------- */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: metaTitle,
      description: metaDescription,
      inLanguage: "es-MX",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#business` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/jardines/Imagnes de amenidades y hero/alberca.webp`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Jardines del Sur Cancún",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#residenciales`,
      name: "Residenciales Jardines del Sur en Cancún",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Jardines del Sur 6",
          url: `${SITE_URL}/jardines-del-sur-6`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Jardines del Sur 7",
          url: `${SITE_URL}/jardines-del-sur-7`,
        },
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

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src="/optimized/hero/alberca-desktop.webp"
            alt="Alberca y áreas comunes de Jardines del Sur 6, en la Zona Sur de Cancún"
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroGlow} aria-hidden="true" />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>Zona Sur de Cancún · Grupo Sadasi</span>
          <h1 className={styles.title}>
            <span className={styles.titleSmall}>Residencial Altta Homes</span>
            Jardines del Sur Cancún
          </h1>
          <p className={styles.subtitle}>
            Dos residenciales en la Zona Sur de Cancún. Modelos, precios e
            informes.
          </p>

          <nav className={styles.devChips} aria-label="Residenciales Jardines del Sur">
            <a href="/jardines-del-sur-6" className={styles.devChip}>
              <span className={styles.devChipDot} />
              Jardines del Sur 6
              <em className={styles.devChipTag}>Modelos disponibles</em>
            </a>
            <a href="/jardines-del-sur-7" className={styles.devChip}>
              <span className={styles.devChipDot} />
              Jardines del Sur 7
              <em className={styles.devChipTag}>Preventa por anunciar</em>
            </a>
          </nav>

          <div className={styles.ctaRow}>
            <a href="#residenciales" className="btn btn-primary">
              Ver los dos
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={`btn ${styles.btnGhost}`}
            >
              <svg
                className={styles.ctaIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== FRANJA DE DATOS ===== */}
      <section className={styles.quickBar} aria-label="Datos rápidos">
        <ul className={styles.quickGrid}>
          <li>
            <strong>2 residenciales</strong>
            <em>El 6 y el 7</em>
          </li>
          {/* Aquí iba "desde $X". Se quitó: junto a "2 residenciales" se leía
              como si fuera el precio de los dos, y Jardines del Sur 7 todavía
              no tiene precio. El "desde" va donde queda claro de quién es:
              en la tarjeta de Jardines del Sur 6. */}
          <li>
            <strong>Grupo Sadasi</strong>
            <em>50 años de respaldo</em>
          </li>
          <li>
            <strong>{propiedades6.length} modelos</strong>
            <em>Disponibles en el 6</em>
          </li>
          <li>
            <strong>10 min</strong>
            <em>Del aeropuerto</em>
          </li>
        </ul>
      </section>

      {/* ===== QUÉ ES ===== */}
      <section className={styles.intro}>
        <div className="container">
          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <p className={styles.introEyebrow}>El residencial</p>
              <h2>Jardines del Sur 6 y Jardines del Sur 7: qué los diferencia</h2>
              <p>
                <strong>Jardines del Sur</strong> es un desarrollo de{" "}
                <strong>Altta Homes</strong>, la marca de vivienda de{" "}
                <strong>Grupo Sadasi</strong>, construido{" "}
                <strong>por etapas</strong> en la Zona Sur de Cancún — el
                Polígono Sur.
              </p>
              <p>
                Hoy en <strong>Jardines del Sur 6</strong> hay modelos
                disponibles y con precio publicado;{" "}
                <strong>Jardines del Sur 7</strong> está en obra. Varios modelos
                se repiten entre los dos, así que si te gustó una casa del 7, es
                probable que ya exista construida en el 6.
              </p>
            </div>

            <aside className={styles.factCard}>
              <p className={styles.factTitle}>En corto</p>
              <ul className={styles.factList}>
                <li>
                  <span className={styles.factIco} aria-hidden="true">📍</span>
                  <span>
                    <strong>Dónde está</strong>
                    Zona Sur de Cancún (Polígono Sur), a 10 min del aeropuerto y
                    500 m de Av. Huayacán.
                  </span>
                </li>
                <li>
                  <span className={styles.factIco} aria-hidden="true">🏗️</span>
                  <span>
                    <strong>Los dos vigentes</strong>
                    El 6, con modelos disponibles. El 7, en obra, con preventa
                    prevista para septiembre-octubre de 2026.
                  </span>
                </li>
                <li>
                  <span className={styles.factIco} aria-hidden="true">🏠</span>
                  <span>
                    <strong>Qué hay disponible</strong>
                    {` ${casas6.length} modelos de casa y ${deptos6.length} de departamento en Jardines del Sur 6, todos de 3 recámaras.`}
                  </span>
                </li>
                <li>
                  <span className={styles.factIco} aria-hidden="true">🏆</span>
                  <span>
                    <strong>Quién construye</strong>
                    Grupo Sadasi: 50 años y más de 430,000 viviendas entregadas.
                  </span>
                </li>
                <li>
                  <span className={styles.factIco} aria-hidden="true">🏦</span>
                  <span>
                    <strong>Cómo se compra</strong>
                    Crédito bancario, Infonavit, cofinanciamiento o contado.
                  </span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== LAS DOS ETAPAS ===== */}
      <section id="residenciales" className={styles.etapas}>
        <div className="container">
          <header className={styles.sectionHeader}>
            <span>Comparación</span>
            <h2>Los dos, lado a lado</h2>
            <p>
              Dos etapas, dos residenciales independientes, misma zona y mismo
              desarrollador. Lo que cambia es si puedes elegir hoy o si estás
              dispuesto a esperar.
            </p>
          </header>

          <div className={styles.etapaGrid}>
            {/* --- Jardines del Sur 6 --- */}
            <article className={styles.etapaCard}>
              <div className={styles.etapaMedia}>
                <span className={`${styles.etapaTag} ${styles.tagNow}`}>
                  Disponible ahora
                </span>
                {/* Acceso de Jardines del Sur 6 YA CONSTRUIDO — elegida por
                    Florencio. Va en contraste con la foto de obra del 7:
                    residencial terminado vs residencial en construcción.
                    NO usar /optimized/dev-tabs/*: son íconos de 96x96 px y al
                    estirarlos a la tarjeta salen borrosos. */}
                <Image
                  src="/amenidades/Entrada.webp"
                  alt="Acceso principal de Jardines del Sur 6 en Cancún, con la caseta de vigilancia, las palmeras y las casas ya terminadas"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              <div className={styles.etapaBody}>
                <h3 className={styles.etapaName}>Jardines del Sur 6</h3>
                <p className={styles.etapaLead}>
                  El residencial con modelos disponibles hoy: casas y
                  departamentos ya construidos, que puedes visitar.
                </p>
                <ul className={styles.etapaSpecs}>
                  <li>{`${casas6.length} modelos de casa y ${deptos6.length} de departamento`}</li>
                  <li>Todos de 3 recámaras</li>
                  <li>Alberca, gimnasio y casa club</li>
                  <li>Precio publicado y disponibilidad al día</li>
                </ul>
                <div className={styles.priceBlock}>
                  <p className={styles.etapaPrice}>Desde</p>
                  <p className={styles.etapaPriceValue}>
                    {minPrice6 ? formatPriceMxn(minPrice6) : "Consultar"}
                  </p>
                </div>
                <div className={styles.etapaActions}>
                  <a href="/jardines-del-sur-6" className="btn btn-primary">
                    Ver Jardines del Sur 6
                  </a>
                  <a
                    href="/jardines-del-sur-6/promociones"
                    className="btn btn-secondary"
                  >
                    Promociones
                  </a>
                </div>
              </div>
            </article>

            {/* --- Jardines del Sur 7 ---
                Enlace con anclaje "Jardines del Sur 7": le SUMA a la página que
                ya está en 1.32. Lo que no se hace es competirle en title/H1. */}
            <article className={styles.etapaCard}>
              <div className={styles.etapaMedia}>
                <span className={`${styles.etapaTag} ${styles.tagSoon}`}>
                  En obra · preventa próxima
                </span>
                <Image
                  src="/jds7/obra/obra-01-calle-casas.webp"
                  alt="Avance de obra de Jardines del Sur 7 en Cancún"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              <div className={styles.etapaBody}>
                <h3 className={styles.etapaName}>Jardines del Sur 7</h3>
                <p className={styles.etapaLead}>
                  La etapa nueva — un residencial aparte, no una sección del 6 —
                  con obra ya iniciada. Arranca con los modelos Tabachín y Noni.
                </p>
                <ul className={styles.etapaSpecs}>
                  <li>Obra iniciada · fotos reales del avance</li>
                  <li>Preventa prevista para septiembre-octubre 2026</li>
                  <li>Arranca con Tabachín y Noni</li>
                  <li>Plusvalía por delante</li>
                </ul>
                <div className={styles.priceBlockSoon}>
                  <p className={styles.etapaPrice}>Precios</p>
                  <p className={styles.etapaPriceSoon}>Por anunciar</p>
                </div>
                <div className={styles.etapaActions}>
                  <a href="/jardines-del-sur-7" className="btn btn-primary">
                    Ver Jardines del Sur 7
                  </a>
                  <a
                    href={waHref7}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    Avísenme cuando abra
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== COMPARATIVA DEL MISMO MODELO ===== */}
      {comparativa.length > 0 && (
        <section className={styles.compara}>
          <div className="container">
            <header className={styles.sectionHeader}>
              <span>El cruce</span>
              <h2>El mismo modelo, en los dos</h2>
              <p>
                Los dos modelos con los que arranca Jardines del Sur 7 ya
                existen y están disponibles en Jardines del Sur 6. Es la misma
                casa: mismos metros, misma distribución.
              </p>
            </header>

            <div className={styles.tableCard}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Modelo</th>
                      <th scope="col">Construcción</th>
                      <th scope="col">Terreno</th>
                      <th scope="col" className={styles.colHoy}>
                        Jardines del Sur 6
                      </th>
                      <th scope="col">Jardines del Sur 7</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativa.map((m) => (
                      <tr key={m.slug}>
                        <td className={styles.modelCell}>
                          <a href={`/jardines-del-sur-6/${m.slug}`}>{m.nombre}</a>
                        </td>
                        <td>{m.m2c} m²</td>
                        <td>{m.m2t ? `${m.m2t} m²` : "—"}</td>
                        <td className={styles.priceCell}>
                          {formatPriceMxn(m.precio6)}
                        </td>
                        <td className={styles.pendingCell}>Por anunciar</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className={styles.tableNote}>
              Precios de Jardines del Sur 6 vigentes y sujetos a disponibilidad.
              Los de Jardines del Sur 7 se publican aquí en cuanto el
              desarrollador los haga oficiales. Imágenes y superficies de
              carácter informativo.
            </p>
          </div>
        </section>
      )}

      {/* ===== ORIENTACIÓN ===== */}
      <section className={styles.guia}>
        <div className="container">
          <header className={styles.sectionHeader}>
            <span>Cómo elegir</span>
            <h2>¿Cuál de los dos es para ti?</h2>
          </header>

          <div className={styles.guiaGrid}>
            <article className={styles.guiaCard}>
              <span className={styles.guiaNum} aria-hidden="true">1</span>
              <h3 className={styles.guiaQ}>
                Te gustó un modelo del 7 pero no quieres esperar
              </h3>
              <p className={styles.guiaA}>
                No hace falta que cambies de casa. Tabachín y Noni ya existen en{" "}
                <a href="/jardines-del-sur-6">Jardines del Sur 6</a>, construidos
                y disponibles. Mismo modelo, sin la espera.
              </p>
            </article>

            <article className={styles.guiaCard}>
              <span className={styles.guiaNum} aria-hidden="true">2</span>
              <h3 className={styles.guiaQ}>
                Quieres el 6 pero en otro tamaño o precio
              </h3>
              <p className={styles.guiaA}>
                Hay {propiedades6.length} modelos en total, de departamento a
                casa de tres niveles. Puedes verlos todos con precios en{" "}
                <a href="/jardines-del-sur-6">el catálogo de Jardines del Sur 6</a>.
              </p>
            </article>

            <article className={styles.guiaCard}>
              <span className={styles.guiaNum} aria-hidden="true">3</span>
              <h3 className={styles.guiaQ}>
                Prefieres estrenar residencial y puedes esperar
              </h3>
              <p className={styles.guiaA}>
                Entonces te conviene{" "}
                <a href="/jardines-del-sur-7">Jardines del Sur 7</a>: obra
                reciente y plusvalía por delante. Ahí puedes ver las fotos del
                avance y pedir que te avisemos el día que abra.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className={styles.faq}>
        <div className="container">
          <header className={styles.sectionHeader}>
            <span>Dudas comunes</span>
            <h2>Preguntas frecuentes sobre Jardines del Sur</h2>
          </header>
          <div className={styles.faqList}>
            {FAQS.map((f) => (
              <article key={f.q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.faqA}>{f.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CIERRE ===== */}
      <section className={styles.cierre}>
        <div className={`container ${styles.cierreInner}`}>
          <h2>¿Todavía no sabes cuál te conviene?</h2>
          <p>
            Dime qué buscas —presupuesto, cuántas recámaras, para cuándo la
            necesitas— y te digo con franqueza si te conviene Jardines del Sur 6
            o esperar el 7. Sin compromiso.
          </p>
          <div className={styles.cierreActions}>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Escríbeme por WhatsApp
            </a>
            <a href="/calculadora-hipotecaria" className={`btn ${styles.btnGhost}`}>
              Calcular mi mensualidad
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contacto" className={pageStyles.footer}>
        <div className={`container ${pageStyles.footerGrid}`}>
          <div className={pageStyles.footerBrand}>
            <h2>
              Altta<span>Homes</span>
            </h2>
            <span className={pageStyles.footerTagline}>
              by Grupo Sadasi · Cancún
            </span>
            <p>
              50 años de trayectoria ininterrumpida, 430,000 viviendas
              entregadas y el respaldo de la primera desarrolladora mexicana
              certificada{" "}
              <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.
            </p>
          </div>
          <div className={pageStyles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/jardines-del-sur-6">Jardines del Sur 6</a>
              </li>
              <li>
                <a href="/jardines-del-sur-7">
                  Jardines del Sur 7 · Próximamente
                </a>
              </li>
              <li>
                <a href="/promociones">Promociones</a>
              </li>
              <li>
                <a href="/la-rioja-2">La Rioja 2</a>
              </li>
              <li>
                <a href="/lirios-residencial-2">Lirios Residencial 2</a>
              </li>
              <li>
                <a href="/calculadora-hipotecaria">Calculadora</a>
              </li>
              <li>
                <a href="/precios">Precios</a>
              </li>
              <li>
                <ContactNavBtn />
              </li>
            </ul>
          </div>
          <div className={pageStyles.footerContact}>
            <h3>Contacto</h3>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📍</span>
              <a href={OFFICE_MAP_URL} target="_blank" rel="noreferrer">
                {OFFICE_ADDRESS}
              </a>
            </div>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📞</span>
              <FooterPhoneContact />
            </div>
          </div>
        </div>
        <div className={pageStyles.footerBottom}>
          <p>
            &copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos
            reservados.
          </p>
          <FooterSocial />
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
