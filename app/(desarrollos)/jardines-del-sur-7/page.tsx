import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "./proximamente.module.css";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const PAGE_URL = `${SITE_URL}/jardines-del-sur-7`;

const WA_MESSAGE =
  "Hola, quiero más información sobre Jardines del Sur 7 en Cancún. Avísenme cuando abra a la venta.";
const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(WA_MESSAGE)}`;

const metaTitle =
  "Jardines del Sur 7 Cancún | Próxima Apertura a la Venta";
const metaDescription =
  "Jardines del Sur 7, la nueva etapa del residencial más exitoso de la Zona Sur de Cancún. Próxima apertura a la venta. Chatea con un asesor autorizado de Altta Homes y sé de los primeros en conocer modelos, precios y fechas.";

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
      description:
        "Nueva etapa del residencial Jardines del Sur en la Zona Sur de Cancún, desarrollada por Altta Homes con el respaldo de Grupo Sadasi. Actualmente en obra; preventa por anunciar.",
      url: PAGE_URL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cancún",
        addressRegion: "Quintana Roo",
        addressCountry: "MX",
      },
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
            Imagen ilustrativa de un desarrollo Altta Homes by Grupo Sadasi.
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
                <a href="/jardines-del-sur-6/promociones">Promociones</a>
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
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
