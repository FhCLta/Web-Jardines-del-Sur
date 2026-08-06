import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import ObraGallery from "@/components/ObraGallery";
import MapEmbedCard from "@/components/MapEmbedCard";
import pageStyles from "@/app/page.module.css";
import styles from "./proximamente.module.css";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const PAGE_URL = `${SITE_URL}/jardines-del-sur-7`;

/* ===== Perfil de Google Business de Jardines del Sur 7 =====
   Perfil propio del desarrollo, distinto al de la oficina de JdS6.
   Dirección, coordenadas y place id leídos del propio perfil (jul 2026):
   no se inventa nada aquí — si el perfil cambia, actualizar estas constantes. */
const JDS7_PLACE_NAME = "Jardines del Sur 7 | Altta Homes";
const JDS7_MAPS_URL = "https://maps.app.goo.gl/gNUPBCHn2StkA6hB9";
const JDS7_MAPS_PLACE_URL =
  "https://www.google.com/maps/place/Jardines+del+Sur+7+%7C+Altta+Homes/@21.0835955,-86.8914348,17z/data=!3m1!4b1!4m6!3m5!1s0x8f4c2d985cecc7db:0x39666beb394ecc4c!8m2!3d21.0835955!4d-86.8914348!16s%2Fg%2F11ntdw094n";
const JDS7_STREET = "Josefa Ortiz de Domínguez";
/* ⚠️ NO cambiar a 77536. El CP oficial del fraccionamiento Jardines del Sur es
   77536, pero Google Business RECHAZA esa dirección ("dirección no encontrada"):
   la calle es nueva y aún no está en su base con ese CP. El perfil quedó en
   77500 y la web debe COINCIDIR con el perfil — la consistencia de NAP pesa más
   en SEO local que el CP exacto, y quien posiciona el pin son las coordenadas.
   Reintentar 77536 en ambos lados cuando Google reconozca la calle (jul 2026). */
const JDS7_POSTAL = "77500";
const JDS7_GEO = { lat: 21.0835955, lng: -86.8914348 };
/* El embed debe buscar por NOMBRE (q) y centrarse con las coordenadas (ll).
   Con `q=<lat,lng>` Google pinta un pin sin ficha y al tocarlo responde
   "Error al cargar la información del lugar"; así resuelve el perfil real. */
const JDS7_MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  JDS7_PLACE_NAME
)}&ll=${JDS7_GEO.lat},${JDS7_GEO.lng}&z=16&hl=es&output=embed`;

/* ===== Avance de obra — fotos tomadas en sitio ===== */
const OBRA_FECHA = "23 de julio de 2026";
const OBRA_FECHA_ISO = "2026-07-23";
const OBRA_DIR = "/jds7/obra";

/* Criterio fijado por Florencio: NINGUNA foto con personas.
   Al revisarlas en grande salieron trabajadores en azoteas y en cabinas de
   maquinaria que no se notaban en miniatura — verificar siempre a tamaño
   completo antes de publicar fotos nuevas de obra. */
const OBRA_PHOTOS = [
  {
    slug: "obra-01-calle-casas",
    caption: "Manzana en obra sobre la vialidad interior",
    alt: "Fila de casas en construcción sobre una calle de Jardines del Sur 7, Cancún, en julio de 2026",
  },
  {
    slug: "obra-10-fila-townhouses",
    caption: "Estructura terminada",
    alt: "Casas de dos niveles en obra negra en Jardines del Sur 7, nueva etapa de Altta Homes en Cancún",
  },
  {
    slug: "obra-03-casa-dos-niveles",
    caption: "Vivienda con material en sitio",
    alt: "Casa de dos niveles en construcción con material de obra en Jardines del Sur 7, Cancún",
  },
  {
    slug: "obra-04-avenida-interior",
    caption: "Vialidades ya trazadas",
    alt: "Vialidad interior trazada entre casas en construcción en Jardines del Sur 7, Cancún",
  },
  {
    slug: "obra-11-bloque-en-sitio",
    caption: "Bloque listo en obra",
    alt: "Tarimas de bloque apiladas junto a las viviendas en construcción de Jardines del Sur 7, Cancún",
  },
  {
    slug: "obra-12-frente-manzana",
    caption: "Frente completo de una manzana",
    alt: "Frente completo de una manzana de casas en obra en Jardines del Sur 7, Zona Sur de Cancún",
  },
  {
    slug: "obra-13-vialidad-principal",
    caption: "Calles amplias del residencial",
    alt: "Calle amplia del residencial Jardines del Sur 7 con las manzanas en construcción al fondo, Cancún",
  },
  {
    slug: "obra-09-material",
    caption: "Llegada de material",
    alt: "Maquinaria descargando bloques de construcción en Jardines del Sur 7, Cancún",
  },
  {
    slug: "obra-08-urbanizacion",
    caption: "Urbanización en proceso",
    alt: "Trabajos de urbanización en Jardines del Sur 7 con viviendas ya entregadas de Jardines del Sur al fondo",
  },
].map((p) => ({
  ...p,
  src: `${OBRA_DIR}/${p.slug}.webp`,
  full: `${OBRA_DIR}/${p.slug}-full.webp`,
}));

const WA_MESSAGE =
  "Hola, quiero más información sobre Jardines del Sur 7 en Cancún. Avísenme cuando abra a la venta.";
const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(WA_MESSAGE)}`;

const metaTitle =
  "Jardines del Sur 7 Cancún | Próxima Apertura a la Venta";
const metaDescription =
  "Jardines del Sur 7, la nueva etapa del residencial más exitoso de la Zona Sur de Cancún. Mira las fotos reales del avance de obra y su ubicación. Chatea con un asesor autorizado de Altta Homes y sé de los primeros en conocer modelos, precios y fechas.";

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/jardines-del-sur-7" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: PAGE_URL,
    siteName: "Altta Homes Cancún",
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "/hero-alberca-jardines.webp",
        width: 1200,
        height: 630,
        alt: "Jardines del Sur 7 · Próximamente · Altta Homes Cancún",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: ["/hero-alberca-jardines.webp"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: metaTitle,
      description: metaDescription,
      inLanguage: "es-MX",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#business` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/hero-alberca-jardines.webp`,
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
          name: "Desarrollos en Cancún",
          item: `${SITE_URL}/#desarrollos`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Jardines del Sur 7",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "Residence",
      "@id": `${PAGE_URL}#residence`,
      name: "Jardines del Sur 7",
      alternateName: JDS7_PLACE_NAME,
      description:
        "Nueva etapa del residencial Jardines del Sur en la Zona Sur de Cancún, desarrollada por Altta Homes con el respaldo de Grupo Sadasi. Actualmente en obra; preventa por anunciar.",
      url: PAGE_URL,
      address: {
        "@type": "PostalAddress",
        streetAddress: JDS7_STREET,
        addressLocality: "Cancún",
        addressRegion: "Quintana Roo",
        postalCode: JDS7_POSTAL,
        addressCountry: "MX",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: JDS7_GEO.lat,
        longitude: JDS7_GEO.lng,
      },
      telephone: `+${PHONE_E164}`,
      hasMap: JDS7_MAPS_PLACE_URL,
      sameAs: [JDS7_MAPS_PLACE_URL, JDS7_MAPS_URL],
      image: OBRA_PHOTOS.map((p) => `${SITE_URL}${p.full}`),
    },
    {
      "@type": "ImageGallery",
      "@id": `${PAGE_URL}#avance-obra`,
      name: `Avance de obra de Jardines del Sur 7 · ${OBRA_FECHA}`,
      description: `Fotografías del avance de construcción de Jardines del Sur 7 en Cancún, tomadas en sitio el ${OBRA_FECHA}.`,
      url: `${PAGE_URL}#avance-de-obra`,
      isPartOf: { "@id": `${PAGE_URL}#webpage` },
      about: { "@id": `${PAGE_URL}#residence` },
      image: OBRA_PHOTOS.map((p) => ({
        "@type": "ImageObject",
        contentUrl: `${SITE_URL}${p.full}`,
        thumbnailUrl: `${SITE_URL}${p.src}`,
        caption: p.caption,
        description: p.alt,
        datePublished: OBRA_FECHA_ISO,
        contentLocation: {
          "@type": "Place",
          name: "Jardines del Sur 7, Cancún",
          geo: {
            "@type": "GeoCoordinates",
            latitude: JDS7_GEO.lat,
            longitude: JDS7_GEO.lng,
          },
        },
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
            src="/hero-alberca-jardines.webp"
            alt="Desarrollo residencial Altta Homes en la Zona Sur de Cancún"
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>
            <span className={styles.pulse} aria-hidden="true" />
            Próximamente · Zona Sur Cancún
          </span>
          <h1 className={styles.title}>
            <span className={styles.titleSmall}>Nueva etapa · Altta Homes</span>
            Jardines del Sur 7
          </h1>
          <p className={styles.subtitle}>
            La nueva etapa del residencial más exitoso de la Zona Sur de
            Cancún, con el respaldo de Grupo Sadasi.{" "}
            <strong>Obra ya iniciada — preventa por anunciar.</strong>
          </p>
          <div className={styles.ctaRow}>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
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
              Más información por WhatsApp
            </a>
          </div>
          <p className={styles.illustrative}>
            Imagen ilustrativa de un desarrollo Altta Homes by Grupo Sadasi.{" "}
            <a href="#avance-de-obra" className={styles.illustrativeLink}>
              Ver fotos reales de la obra ↓
            </a>
          </p>
        </div>
      </section>

      {/* ===== STATUS BADGES ===== */}
      <section className={styles.statusSection}>
        <div className="container">
          <ul className={styles.statusGrid}>
            <li>
              <span className={styles.ico} aria-hidden="true">🏗️</span>
              <strong>Obra ya iniciada</strong>
              <em>Construcción en proceso</em>
            </li>
            <li>
              <span className={styles.ico} aria-hidden="true">📅</span>
              <strong>Preventa por anunciar</strong>
              <em>Fechas próximamente</em>
            </li>
            <li>
              <span className={styles.ico} aria-hidden="true">📲</span>
              <strong>Informes por WhatsApp</strong>
              <em>Pregunta sin compromiso</em>
            </li>
            <li>
              <span className={styles.ico} aria-hidden="true">🏆</span>
              <strong>Grupo Sadasi</strong>
              <em>50 años · 430,000 viviendas</em>
            </li>
          </ul>
        </div>
      </section>

      {/* ===== AVANCE DE OBRA ===== */}
      <section id="avance-de-obra" className={styles.obra}>
        <div className="container">
          <div className={styles.obraHead}>
            <div>
              <span className={styles.eyebrow2}>Así va la construcción</span>
              <h2>Avance de obra de Jardines del Sur 7</h2>
              <p className={styles.obraIntro}>
                Fotos tomadas el <strong>{OBRA_FECHA}</strong>. Las casas ya
                están levantadas y las vialidades trazadas: esto no es un
                render, es el avance real del desarrollo.
              </p>
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={styles.obraCta}
            >
              ¿Quieres ser de los primeros?
              <strong>Pregunta por WhatsApp</strong>
            </a>
          </div>

          <ObraGallery photos={OBRA_PHOTOS} label="Avance de obra de Jardines del Sur 7" />

          <p className={styles.obraNote}>
            Fotografías del avance de construcción al {OBRA_FECHA}. La obra
            continúa: modelos, precios y fechas de preventa se anunciarán
            próximamente.
          </p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className={styles.about}>
        <div className="container">
          <span className={styles.eyebrow2}>
            El siguiente capítulo de Jardines del Sur
          </span>
          <h2>Jardines del Sur 7, lo nuevo de Altta Homes en Cancún</h2>
          <p>
            Jardines del Sur 7 es la nueva etapa del residencial más exitoso de la
            Zona Sur de Cancún, desarrollado por Altta Homes con el respaldo
            de Grupo Sadasi — más de 50 años de trayectoria y 430,000 viviendas
            entregadas en México.
          </p>
          <p>
            La obra ya está en proceso. Muy pronto anunciaremos los modelos,
            precios, amenidades y las fechas de preventa. Como cada etapa de
            Jardines del Sur, estará pensado para distintos perfiles de familia y
            con el sello de calidad y plusvalía que distingue a la zona.
          </p>
          <p>
            Si quieres ser de los primeros en conocer la información y apartar en
            preventa, escríbenos por WhatsApp y te avisaremos en cuanto esté
            disponible. Sin compromiso.
          </p>
          <div className={styles.aboutCta}>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Quiero información de Jardines del Sur 7
            </a>
            <span className={styles.aboutNote}>
              Respuesta directa con un asesor · Sin costo
            </span>
          </div>
        </div>
      </section>

      {/* ===== UBICACIÓN ===== */}
      <section id="ubicacion" className={styles.ubicacion}>
        <div className="container">
          <span className={styles.eyebrow2}>Dónde está</span>
          <h2>Ubicación de Jardines del Sur 7</h2>

          <div className={styles.ubicacionGrid}>
            <MapEmbedCard
              embedSrc={JDS7_MAPS_EMBED}
              title="Mapa de Jardines del Sur 7, Cancún"
            />

            <div className={styles.ubicacionInfo}>
              <p className={styles.ubicacionLead}>
                Jardines del Sur 7 continúa el residencial en la{" "}
                <strong>Zona Sur de Cancún</strong>, la de mayor proyección de
                la ciudad, junto a las etapas ya entregadas de Jardines del Sur.
              </p>

              <ul className={styles.ubicacionList}>
                <li>
                  <span aria-hidden="true">📍</span>
                  <div>
                    <strong>{JDS7_STREET}</strong>
                    {JDS7_POSTAL} Cancún, Q.R.
                  </div>
                </li>
                <li>
                  <span aria-hidden="true">✈️</span>
                  <div>
                    <strong>A 10 minutos del aeropuerto</strong>
                    Conexión directa por la Zona Sur
                  </div>
                </li>
                <li>
                  <span aria-hidden="true">🛣️</span>
                  <div>
                    <strong>Sobre el corredor de Av. Huayacán</strong>
                    Escuelas, comercio y servicios consolidados
                  </div>
                </li>
                <li>
                  <span aria-hidden="true">🏘️</span>
                  <div>
                    <strong>Junto a Jardines del Sur 6</strong>
                    La oficina de ventas ya opera en la zona
                  </div>
                </li>
              </ul>

              <div className={styles.ubicacionBtns}>
                <a
                  href={JDS7_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Cómo llegar
                </a>
                <a
                  href={JDS7_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.ubicacionLink}
                >
                  Ver el perfil en Google →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OTROS DESARROLLOS DISPONIBLES ===== */}
      <section className={styles.others}>
        <div className="container">
          <h2>Mientras tanto, conoce nuestros desarrollos disponibles</h2>
          <div className={styles.othersGrid}>
            <a
              className={styles.othersCard}
              href="/jardines-del-sur-6"
            >
              Jardines del Sur 6 <span aria-hidden="true">→</span>
            </a>
            <a
              className={styles.othersCard}
              href="/la-rioja-2"
            >
              La Rioja 2 <span aria-hidden="true">→</span>
            </a>
            <a
              className={styles.othersCard}
              href="/lirios-residencial-2"
            >
              Lirios Residencial 2 <span aria-hidden="true">→</span>
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
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={pageStyles.footerBrandCta}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Informes por WhatsApp
            </a>
          </div>
          <div className={pageStyles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/jardines-del-sur-6">
                  Jardines del Sur 6
                </a>
              </li>
              <li>
                <a href="/promociones">Promociones</a>
              </li>
              <li>
                <a href="/la-rioja-2">La Rioja 2</a>
              </li>
              <li>
                <a href="/lirios-residencial-2">
                  Lirios Residencial 2
                </a>
              </li>
              <li>
                <a href="/jardines-del-sur-7">
                  Jardines del Sur 7 · Próximamente
                </a>
              </li>
              <li>
                <a href="/calculadora-hipotecaria">Calculadora</a>
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
