import { notFound } from "next/navigation";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import ContactNavBtn from "@/components/ContactNavBtn";
import ModelGallery from "./ModelGallery";
import ModelTour from "./ModelTour";
import pageStyles from "@/app/page.module.css";
import styles from "../model.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import {
  slugifyModel,
  getInventory,
  parseStat,
  getModelType,
  formatPriceMxn,
  getWhatsAppMessageForModel,
} from "./model-utils";

const SITE_URL = "https://jardinesdelsurcancun.mx";
const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";

function getTourUrl(rawUrl: string): string | null {
  if (!rawUrl || rawUrl === "#") return null;
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("matterport.com")) {
      url.searchParams.set("play", "1");
      url.searchParams.set("qs", "1");
      url.searchParams.set("wh", "0");
      url.searchParams.set("nt", "0");
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export default async function ModelPage({
  devSlug,
  modeloSlug,
}: {
  devSlug: DevSlug;
  modeloSlug: string;
}) {
  const dev = DEVS[devSlug];
  const inventory = getInventory();
  const property = inventory.find(
    (p) =>
      p.development === dev.name &&
      slugifyModel(p.nombre_modelo) === modeloSlug
  );

  if (!property) {
    notFound();
  }

  const otherProperties = inventory.filter(
    (p) =>
      p.development === dev.name &&
      slugifyModel(p.nombre_modelo) !== modeloSlug
  );

  const recamaras = parseStat(property.amenidades_key, /^([\d.]+)\s*Rec/i);
  const banos = parseStat(property.amenidades_key, /^([\d.]+)\s*Ba/i);
  const modelType = getModelType(property.nombre_modelo);
  const tourUrl = getTourUrl(property.url_recorrido_virtual);

  const pageUrl = `${SITE_URL}/desarrollos-cancun/${dev.slug}/${modeloSlug}`;
  const waMessage = getWhatsAppMessageForModel(property);
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMessage)}`;

  // JSON-LD: WebPage + BreadcrumbList + Residence + Offer
  const residenceType =
    modelType === "Departamento" ? "Apartment" : "SingleFamilyResidence";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${property.nombre_modelo} en ${dev.name}, Cancún`,
        description: `${property.nombre_modelo} en ${dev.name}, Cancún. ${property.metros_construccion} m² de construcción${recamaras ? `, ${recamaras} recámaras` : ""}${banos ? `, ${banos} baños` : ""}. Desde ${formatPriceMxn(property.precio)}.`,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#business` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}${property.images[0] || ""}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
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
            name: dev.name,
            item: `${SITE_URL}/desarrollos-cancun/${dev.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: property.nombre_modelo,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": residenceType,
        "@id": `${pageUrl}#residence`,
        name: `${property.nombre_modelo} en ${dev.name}`,
        description: `${property.nombre_modelo} de Altta Homes en ${dev.name}, Cancún. ${property.metros_construccion} m² de construcción.`,
        floorSize: {
          "@type": "QuantitativeValue",
          value: property.metros_construccion,
          unitCode: "MTK",
        },
        ...(recamaras
          ? { numberOfBedrooms: parseFloat(recamaras) }
          : {}),
        ...(banos
          ? { numberOfBathroomsTotal: parseFloat(banos) }
          : {}),
        ...(property.metros_terreno
          ? {
              lotSize: {
                "@type": "QuantitativeValue",
                value: property.metros_terreno,
                unitCode: "MTK",
              },
            }
          : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cancún",
          addressRegion: "Quintana Roo",
          addressCountry: "MX",
        },
        image: property.images.map((img) => `${SITE_URL}${img}`),
      },
      {
        "@type": "Offer",
        "@id": `${pageUrl}#offer`,
        name: property.nombre_modelo,
        price: property.precio,
        priceCurrency: "MXN",
        availability: "https://schema.org/InStock",
        url: pageUrl,
        itemOffered: { "@id": `${pageUrl}#residence` },
        seller: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };

  const heroEyebrow =
    modelType === "Casa"
      ? "CASA · CANCÚN"
      : modelType === "Departamento"
      ? "DEPARTAMENTO · CANCÚN"
      : "MODELO · CANCÚN";

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      {/* HERO */}
      <section id="top" className={styles.modelHero}>
        <div className="container">
          <div className={styles.modelHeroInner}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              {heroEyebrow}
            </span>

            <h1 className={styles.h1}>
              {property.nombre_modelo}
              <br />
              <em>en {dev.name}</em>
            </h1>

            <p className={styles.subtitle}>
              {recamaras ? `${recamaras} recámaras` : ""}
              {recamaras && banos ? " · " : ""}
              {banos ? `${banos} baños` : ""}
              {property.levels.length > 1
                ? ` · ${property.levels.length} niveles`
                : ""}
              .
            </p>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>Precio desde</span>
                <span className={styles.heroStatValue}>
                  <span className={styles.priceDisplay}>
                    <span className={styles.priceAmount}>
                      ${property.precio.toLocaleString("es-MX")}
                    </span>
                    <span className={styles.priceCurrency}>MXN</span>
                  </span>
                </span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>Construcción</span>
                <span className={styles.heroStatValue}>
                  {property.metros_construccion} m²
                </span>
              </div>
              {property.metros_terreno && (
                <div className={styles.heroStat}>
                  <span className={styles.heroStatLabel}>Terreno</span>
                  <span className={styles.heroStatValue}>
                    {property.metros_terreno} m²
                  </span>
                </div>
              )}
            </div>

            <div className={styles.heroCtas}>
              <a
                href={waHref}
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Cotizar este modelo
              </a>
              {tourUrl && (
                <a
                  href="#recorrido"
                  className={`btn ${styles.heroCtaSecondary}`}
                >
                  Ver recorrido virtual 360°
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {property.images.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Fotos del modelo</h2>
              <p>
                Galería completa de {property.nombre_modelo}. Las imágenes
                muestran acabados de referencia.
              </p>
            </div>
            <ModelGallery images={property.images} modelName={property.nombre_modelo} />
          </div>
        </section>
      )}

      {/* DISTRIBUCIÓN */}
      {property.levels.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Distribución</h2>
              <p>
                {property.levels.length > 1
                  ? `Distribución por nivel del modelo ${property.nombre_modelo}.`
                  : `Distribución completa del modelo ${property.nombre_modelo}.`}
              </p>
            </div>
            <div className={styles.levels}>
              {property.levels.map((level) => (
                <div key={level.nivel} className={styles.levelBlock}>
                  <h3>
                    {property.levels.length > 1
                      ? `Nivel ${level.nivel}`
                      : "Espacios"}
                  </h3>
                  <ul className={styles.levelList}>
                    {level.desc.split(",").map((item) => (
                      <li key={item.trim()}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TOUR VIRTUAL */}
      {tourUrl && (
        <section
          id="recorrido"
          className={`${styles.section} ${styles.sectionAlt}`}
        >
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Recorrido virtual 360°</h2>
              <p>
                Camina virtualmente por {property.nombre_modelo} antes de
                visitarlo en sitio.
              </p>
            </div>
            <ModelTour
              tourUrl={tourUrl}
              previewImage={property.images[0]}
              modelName={property.nombre_modelo}
              development={property.development}
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.ctaBlock}>
            <div className={styles.ctaBlockText}>
              <h3>¿Te interesa {property.nombre_modelo}?</h3>
              <p>
                Recibe disponibilidad actual, formas de pago y agenda de visita
                directamente con un asesor de Altta Homes Cancún.
              </p>
            </div>
            <a
              href={waHref}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* RELATED MODELS */}
      {otherProperties.length > 0 && (
        <section className={styles.related}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Otros modelos en {dev.name}</h2>
              <p>Compara con los demás modelos disponibles en el desarrollo.</p>
            </div>
            <div className={styles.relatedGrid}>
              {otherProperties.map((other) => (
                <a
                  key={other.id}
                  href={`/desarrollos-cancun/${dev.slug}/${slugifyModel(other.nombre_modelo)}`}
                  className={styles.relatedCard}
                >
                  <span className={styles.relatedCardLabel}>
                    {getModelType(other.nombre_modelo) || "Modelo"}
                  </span>
                  <span className={styles.relatedCardName}>
                    {"Modelo " + other.nombre_modelo.replace(/^(Casa|Departamento)\s+/i, "")}
                  </span>
                  <span className={styles.relatedCardPrice}>
                    Desde{" "}
                    <span className={styles.priceDisplay}>
                      <span className={styles.priceAmount}>
                        ${other.precio.toLocaleString("es-MX")}
                      </span>
                      <span className={styles.priceCurrency}>MXN</span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
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
              certificada <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.
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
                <a href={`/desarrollos-cancun/${dev.slug}`}>{dev.name}</a>
              </li>
              <li>
                <a href="/#modelos">Modelos y Precios</a>
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
